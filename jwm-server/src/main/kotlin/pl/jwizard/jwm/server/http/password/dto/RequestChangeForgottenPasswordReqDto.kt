package pl.jwizard.jwm.server.http.password.dto

data class RequestChangeForgottenPasswordReqDto(
	val login: String,
	val cfToken: String,
)
