package pl.jwizard.jwm.server.service.spi

import pl.jwizard.jwm.server.core.spi.SessionUser
import pl.jwizard.jwm.server.service.spi.dto.SessionDataRow
import pl.jwizard.jwm.server.service.spi.dto.SessionRevalidateState
import java.time.LocalDateTime

interface SessionSupplier {
	fun getSession(sessionId: String): SessionUser?

	fun getMySessions(userId: Long): List<SessionDataRow>

	fun getSessionExpirationTime(sessionId: String): LocalDateTime?

	fun getSessionRevalidateState(sessionId: String): SessionRevalidateState?

	fun saveUserSession(
		sessionId: String,
		userId: Long,
		mfaEnabled: Boolean,
		expiredAtUtc: LocalDateTime,
		lastLoginUtc: LocalDateTime,
		deviceSystem: String?,
		deviceMobile: Boolean?,
		geolocationInfo: String?,
		csrfToken: String,
	): Int

	fun afterLoginUpdateSession(
		sessionId: String,
		expiredAtUtc: LocalDateTime,
		lastLoginUtc: LocalDateTime,
		deviceSystem: String?,
		deviceMobile: Boolean?,
		geolocationInfo: String?,
		csrfToken: String,
	): Int

	fun updateCsrfToken(sessionId: String, encryptedCsrfToken: String): Int

	fun updateSessionTime(sessionId: String, sessionExpiredAtUtc: LocalDateTime): Int

	fun deleteSession(sessionId: String): Int

	fun deleteAllSessions(userId: Long, currentSessionId: String): Int
}
