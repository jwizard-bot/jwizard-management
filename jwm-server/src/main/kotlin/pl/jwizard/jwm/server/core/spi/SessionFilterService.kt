package pl.jwizard.jwm.server.core.spi

import java.time.LocalDateTime

interface SessionFilterService {
	fun getUserSession(sessionId: String): SessionUser?

	fun updateSessionTime(sessionId: String, now: LocalDateTime): Int

	fun deleteExpiredSession(sessionId: String, userId: Long)
}
