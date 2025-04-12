package pl.jwizard.jwm.server.http.auth.dto

data class LoggedUserData(
	val login: String,
	val isAdmin: Boolean,
	val mfaEnabled: Boolean,
	val initPasswordChanged: Boolean,
)
