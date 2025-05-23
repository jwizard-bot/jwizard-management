package pl.jwizard.jwm.server.service.auth

import io.javalin.http.UnauthorizedResponse
import org.springframework.stereotype.Component
import pl.jwizard.jwl.property.BaseEnvironment
import pl.jwizard.jwl.server.useragent.GeolocationProvider
import pl.jwizard.jwl.util.base64encode
import pl.jwizard.jwl.util.logger
import pl.jwizard.jwl.util.timeDifference
import pl.jwizard.jwm.server.core.auth.SessionUser
import pl.jwizard.jwm.server.http.dto.LoggedUserData
import pl.jwizard.jwm.server.http.session.SessionService
import pl.jwizard.jwm.server.http.session.dto.RevalidateStateResDto
import pl.jwizard.jwm.server.http.session.dto.SessionData
import pl.jwizard.jwm.server.http.session.dto.SessionsDataResDto
import pl.jwizard.jwm.server.property.ServerProperty
import pl.jwizard.jwm.server.service.crypto.EncryptService
import pl.jwizard.jwm.server.service.crypto.SecureRndGeneratorService
import pl.jwizard.jwm.server.service.spi.SessionSupplier
import pl.jwizard.jwm.server.service.spi.dto.SessionDataRow
import java.time.LocalDateTime
import java.time.ZoneOffset

@Component
class SessionServiceImpl(
	private val sessionSupplier: SessionSupplier,
	private val encryptService: EncryptService,
	private val secureRndGeneratorService: SecureRndGeneratorService,
	private val geolocationProvider: GeolocationProvider,
	environment: BaseEnvironment,
) : SessionService {
	companion object {
		private val log = logger<SessionServiceImpl>()
	}

	private val csrfTokenLength = environment
		.getProperty<Int>(ServerProperty.SERVER_AUTH_SESSION_CSRF_TOKEN_LENGTH)

	override fun mySessions(sessionUser: SessionUser): SessionsDataResDto {
		val sessions = sessionSupplier.getMySessions(sessionUser.userId)
		val currentSession = sessions
			.find { it.sessionId.contentEquals(sessionUser.sessionId) }
			?: throw UnauthorizedResponse()

		val now = LocalDateTime.now(ZoneOffset.UTC)
		val objectMapper: (SessionDataRow) -> SessionData = {
			val (lastLoginUtcUnit, lastLoginUtcTime) = timeDifference(it.lastLoginUtc, now)
			SessionData(
				sessionId = base64encode(it.sessionId),
				lastLoginTime = lastLoginUtcTime,
				lastLoginTimeUnit = lastLoginUtcUnit,
				deviceSystem = it.deviceSystem,
				deviceMobile = it.deviceMobile,
				geolocationInfo = it.geolocationInfo,
			)
		}
		val (name, url) = geolocationProvider.geolocationApiInfo
		return SessionsDataResDto(
			current = objectMapper(currentSession),
			sessions = sessions
				.sortedBy(SessionDataRow::lastLoginUtc)
				.filter { it.sessionId.contentEquals(sessionUser.sessionId) }
				.map(objectMapper),
			geolocationProviderName = name,
			geolocationProviderWebsiteUrl = url,
		)
	}

	override fun deleteMySessionsBasedSessionId(
		toDeleteSessionId: ByteArray,
		sessionUser: SessionUser,
	): Boolean {
		// we cannot delete current session
		if (toDeleteSessionId.contentEquals(sessionUser.sessionId)) {
			return false
		}
		val expiredAtUtc = sessionSupplier.getSessionExpirationTime(toDeleteSessionId) ?: return false
		val now = LocalDateTime.now(ZoneOffset.UTC)
		if (expiredAtUtc.isAfter(now)) {
			sessionSupplier.deleteSession(toDeleteSessionId)
			log.debug("Delete user session for session ID: \"{}\".", base64encode(toDeleteSessionId))
			return true
		}
		return false
	}

	override fun deleteAllMySessionsWithoutCurrentSession(sessionUser: SessionUser) {
		val userId = sessionUser.userId
		val deleted = sessionSupplier.deleteAllSessions(userId, sessionUser.sessionId)
		log.debug("Delete: {} user sessions for user ID: \"{}\".", deleted, userId)
	}

	override fun updateAndGetCsrfToken(sessionId: ByteArray): String {
		val csrfToken = encryptService.encrypt(secureRndGeneratorService.generate(csrfTokenLength))
		sessionSupplier.updateCsrfToken(sessionId, csrfToken)
		return csrfToken
	}

	override fun revalidate(sessionId: ByteArray?): RevalidateStateResDto {
		if (sessionId == null) {
			return RevalidateStateResDto(exists = false, null, expired = false, requireMfa = false)
		}
		val revalidateState = sessionSupplier.getSessionRevalidateState(sessionId)
			?: return RevalidateStateResDto(exists = false, null, expired = false, requireMfa = false)

		val (login, initPasswordChanged, expiredAtUtc, mfaPassed, isAdmin) = revalidateState
		val now = LocalDateTime.now(ZoneOffset.UTC)
		val isExpired = expiredAtUtc.isBefore(now)

		return RevalidateStateResDto(
			exists = !isExpired,
			loggedUser = if (!isExpired && mfaPassed) {
				LoggedUserData(login, !initPasswordChanged, isAdmin)
			} else {
				null
			},
			expired = isExpired,
			requireMfa = !mfaPassed,
		)
	}
}
