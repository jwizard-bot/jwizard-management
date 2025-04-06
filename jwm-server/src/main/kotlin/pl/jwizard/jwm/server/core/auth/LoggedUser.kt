package pl.jwizard.jwm.server.core.auth

data class LoggedUser(
	val sessionId: String,
	val userId: Long,
	val csrfToken: String,
)
