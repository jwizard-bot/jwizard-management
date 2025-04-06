package pl.jwizard.jwm.server.core.spi

import java.time.LocalDateTime

data class SessionUser(
	val csrfToken: String,
	val expiredAtUtc: LocalDateTime,
	val userId: Long,
	val isAdmin: Boolean,
	// true -> passed, false -> not passed, null -> mfa not set for session (and account)
	val mfaPassed: Boolean?,
)
