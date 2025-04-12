package pl.jwizard.jwm.server.http.auth.dto

data class LoginResDto(
	val authenticated: Boolean,
	val userData: LoggedUserData?,
)
