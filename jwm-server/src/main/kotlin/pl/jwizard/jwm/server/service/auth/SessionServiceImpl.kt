package pl.jwizard.jwm.server.service.auth

import io.javalin.http.UnauthorizedResponse
import org.springframework.stereotype.Component
import pl.jwizard.jwl.property.BaseEnvironment
import pl.jwizard.jwl.server.useragent.GeolocationProvider
import pl.jwizard.jwl.util.base64encode
import pl.jwizard.jwl.util.logger
import pl.jwizard.jwl.util.timeDifference
import pl.jwizard.jwm.server.core.ApiHttpHeader
import pl.jwizard.jwm.server.core.auth.LoggedUser
import pl.jwizard.jwm.server.http.session.SessionService
import pl.jwizard.jwm.server.http.session.dto.CsrfTokenResDto
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

	override fun mySessions(loggedUser: LoggedUser): SessionsDataResDto {
		val sessions = sessionSupplier.getMySessions(loggedUser.userId)
		val currentSession = sessions
			.find { base64encode(it.sessionId) == loggedUser.sessionId }
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
				.filter { base64encode(it.sessionId) != loggedUser.sessionId }
				.map(objectMapper),
			geolocationProviderName = name,
			geolocationProviderWebsiteUrl = url,
		)
	}

	override fun deleteMySessionsBasedSessionId(
		toDeleteSessionId: String,
		loggedUser: LoggedUser
	): Boolean {
		// we cannot delete current session
		if (toDeleteSessionId.contentEquals(loggedUser.sessionId)) {
			return false
		}
		val expiredAtUtc = sessionSupplier.getSessionExpirationTime(toDeleteSessionId) ?: return false
		val now = LocalDateTime.now(ZoneOffset.UTC)
		if (expiredAtUtc.isAfter(now)) {
			sessionSupplier.deleteSession(toDeleteSessionId)
			log.debug("Delete user session for session ID: \"{}\".", toDeleteSessionId)
			return true
		}
		return false
	}

	override fun deleteAllMySessionsWithoutCurrentSession(loggedUser: LoggedUser) {
		val userId = loggedUser.userId
		val deleted = sessionSupplier.deleteAllSessions(userId, loggedUser.sessionId)
		log.debug("Delete: {} user sessions for user ID: \"{}\".", deleted, userId)
	}

	override fun updateAndGetCsrfToken(sessionId: String): CsrfTokenResDto {
		val csrfToken = encryptService.encrypt(secureRndGeneratorService.generate(csrfTokenLength))
		sessionSupplier.updateCsrfToken(sessionId, csrfToken)
		return CsrfTokenResDto(csrfToken, ApiHttpHeader.X_CSRF_TOKEN.headerName)
	}

	override fun revalidate(sessionId: String?): RevalidateStateResDto {
		if (sessionId == null) {
			return RevalidateStateResDto(false, false, false)
		}
		var loggedIn = false
		var expired = false
		var mfaPassed: Boolean? = null
		val revalidateState = sessionSupplier.getSessionRevalidateState(sessionId)
		if (revalidateState != null) {
			val expiredAtUtc = revalidateState.expiredAtUtc
			val now = LocalDateTime.now(ZoneOffset.UTC)
			loggedIn = expiredAtUtc.isAfter(now) || expiredAtUtc.isEqual(now)
			expired = expiredAtUtc.isBefore(now)
			mfaPassed = revalidateState.mfaPassed
		}
		return RevalidateStateResDto(loggedIn, expired, mfaPassed)
	}
}
