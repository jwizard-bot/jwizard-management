package pl.jwizard.jwm.server.http.auth.dto

data class LoginReqDto(
	val login: String,
	val password: String,
)
