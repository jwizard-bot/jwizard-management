package pl.jwizard.jwm.server.service.auth

import org.springframework.stereotype.Component
import pl.jwizard.jwl.property.BaseEnvironment
import pl.jwizard.jwl.server.useragent.GeolocationProvider
import pl.jwizard.jwl.server.useragent.UserAgentExtractor
import pl.jwizard.jwl.util.logger
import pl.jwizard.jwm.server.core.auth.LoggedUser
import pl.jwizard.jwm.server.http.auth.AuthService
import pl.jwizard.jwm.server.http.auth.dto.LoginReqDto
import pl.jwizard.jwm.server.http.auth.dto.SessionData
import pl.jwizard.jwm.server.property.ServerProperty
import pl.jwizard.jwm.server.service.CaptchaService
import pl.jwizard.jwm.server.service.crypto.EncryptService
import pl.jwizard.jwm.server.service.crypto.SecureRndGeneratorService
import pl.jwizard.jwm.server.service.spi.SessionSupplier
import pl.jwizard.jwm.server.service.spi.UserSupplier
import java.time.LocalDateTime
import java.time.ZoneOffset

@Component
class AuthServiceImpl(
	private val encryptService: EncryptService,
	private val secureRndGeneratorService: SecureRndGeneratorService,
	private val userAgentExtractor: UserAgentExtractor,
	private val geolocationProvider: GeolocationProvider,
	private val captchaService: CaptchaService,
	private val userSupplier: UserSupplier,
	private val sessionSupplier: SessionSupplier,
	environment: BaseEnvironment,
) : AuthService {
	companion object {
		private val log = logger<AuthServiceImpl>()
	}

	private val sessionTtlSec = environment
		.getProperty<Int>(ServerProperty.SERVER_AUTH_SESSION_TTL_SEC)
	private val sidTokenLength = environment
		.getProperty<Int>(ServerProperty.SERVER_AUTH_SESSION_SID_TOKEN_LENGTH)
	private val csrfTokenLength = environment
		.getProperty<Int>(ServerProperty.SERVER_AUTH_SESSION_CSRF_TOKEN_LENGTH)
	private val cookieDomain = environment
		.getProperty<String>(ServerProperty.SERVER_AUTH_COOKIE_DOMAIN)

	override fun login(reqDto: LoginReqDto, userAgent: String?, ipAddress: String?): SessionData? {
		val success = captchaService.performChallenge(ipAddress, reqDto.cfToken)
		if (!success) {
			return null
		}
		val userCredentials = userSupplier.getUserCredentials(reqDto.login) ?: return null
		// validate password hash
		if (!encryptService.validateHash(reqDto.password, userCredentials.passwordHash)) {
			return null
		}
		val now = LocalDateTime.now(ZoneOffset.UTC)
		val sessionId = secureRndGeneratorService.generate(sidTokenLength)
		val expiredAt = now.plusSeconds(sessionTtlSec.toLong())
		val (deviceSystem, deviceMobile) = userAgentExtractor.analyzeAndExtract(userAgent)

		// persist new user session
		sessionSupplier.saveUserSession(
			sessionId = base64decode(sessionId),
			userId = userCredentials.userId,
			mfaEnabled = userCredentials.mfaEnabled,
			expiredAtUtc = expiredAt,
			lastLoginUtc = now,
			deviceSystem = deviceSystem,
			deviceMobile = deviceMobile,
			geolocationInfo = geolocationProvider.getGeolocationInfo(ipAddress),
			csrfToken = encryptService.encrypt(secureRndGeneratorService.generate(csrfTokenLength)),
		)
		log.debug("Persist new session for user ID: \"{}\".", userCredentials.userId)
		return SessionData(
			isAdmin = userCredentials.isAdmin,
			initPasswordChanged = userCredentials.initPasswordChanged,
			mfaEnabled = userCredentials.mfaEnabled,
			sessionId,
			sessionTtlSec,
			cookieDomain,
		)
	}

	override fun logout(loggedUser: LoggedUser) {
		sessionSupplier.deleteSession(loggedUser.sessionId)
		log.debug("Delete session from user ID: \"{}\".", loggedUser.userId)
	}
}
