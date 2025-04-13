package pl.jwizard.jwm.server.core.spi

import pl.jwizard.jwm.server.core.auth.SessionUser
import java.time.LocalDateTime

interface SessionFilterService {
	fun getUserSession(sessionId: ByteArray): SessionUser?

	fun updateSessionTime(sessionId: ByteArray, now: LocalDateTime): Int

	fun deleteExpiredSession(sessionId: ByteArray, userId: Long)
}
