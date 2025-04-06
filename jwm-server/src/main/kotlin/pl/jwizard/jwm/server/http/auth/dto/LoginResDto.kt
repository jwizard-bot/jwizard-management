package pl.jwizard.jwm.server.http.auth.dto

data class LoginResDto(
	val login: String,
	val isAdmin: Boolean,
	val mfaEnabled: Boolean,
	val initPasswordChanged: Boolean,
)
