package pl.jwizard.jwm.server.service.auth

import org.springframework.stereotype.Component
import pl.jwizard.jwl.property.BaseEnvironment
import pl.jwizard.jwl.util.logger
import pl.jwizard.jwm.server.core.spi.SessionFilterService
import pl.jwizard.jwm.server.property.ServerProperty
import pl.jwizard.jwm.server.service.spi.SessionSupplier
import java.time.LocalDateTime

@Component
class SessionFilterServiceImpl(
	private val sessionSupplier: SessionSupplier,
	environment: BaseEnvironment,
) : SessionFilterService {
	companion object {
		private val log = logger<SessionFilterServiceImpl>()
	}

	private val sessionTtlSec = environment
		.getProperty<Int>(ServerProperty.SERVER_AUTH_SESSION_TTL_SEC)

	override fun getUserSession(sessionId: String) = sessionSupplier.getSession(sessionId)

	override fun updateSessionTime(sessionId: String, now: LocalDateTime): Int {
		sessionSupplier.updateSessionTime(sessionId, now.plusSeconds(sessionTtlSec.toLong()))
		log.debug("Update session time for session ID: \"{}\".", sessionId)
		return sessionTtlSec
	}

	override fun deleteExpiredSession(sessionId: String, userId: Long) {
		sessionSupplier.deleteSession(sessionId)
		log.debug("Delete expired session from user ID: \"{}\".", userId)
	}
}
