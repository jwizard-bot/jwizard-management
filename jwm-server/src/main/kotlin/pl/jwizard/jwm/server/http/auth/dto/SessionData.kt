package pl.jwizard.jwm.server.http.auth.dto

data class SessionData(
	val isAdmin: Boolean,
	val initPasswordChanged: Boolean,
	val mfaEnabled: Boolean,
	val sessionId: String,
	val sessionTtl: Int,
	val cookieDomain: String,
)
