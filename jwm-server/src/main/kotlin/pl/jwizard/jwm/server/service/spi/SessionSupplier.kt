package pl.jwizard.jwm.server.service.spi

import pl.jwizard.jwm.server.core.auth.SessionUser
import pl.jwizard.jwm.server.service.spi.dto.SessionDataRow
import pl.jwizard.jwm.server.service.spi.dto.SessionRevalidateState
import java.time.LocalDateTime

interface SessionSupplier {
	fun getSession(sessionId: ByteArray): SessionUser?

	fun getMySessions(userId: Long): List<SessionDataRow>

	fun getSessionExpirationTime(sessionId: ByteArray): LocalDateTime?

	fun getSessionRevalidateState(sessionId: ByteArray): SessionRevalidateState?

	fun saveUserSession(
		sessionId: ByteArray,
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
		sessionId: ByteArray,
		expiredAtUtc: LocalDateTime,
		lastLoginUtc: LocalDateTime,
		deviceSystem: String?,
		deviceMobile: Boolean?,
		geolocationInfo: String?,
		csrfToken: String,
	): Int

	fun updateCsrfToken(sessionId: ByteArray, encryptedCsrfToken: String): Int

	fun updateSessionTime(sessionId: ByteArray, sessionExpiredAtUtc: LocalDateTime): Int

	fun deleteSession(sessionId: String): Int

	fun deleteAllSessions(userId: Long, currentSessionId: String): Int
}
