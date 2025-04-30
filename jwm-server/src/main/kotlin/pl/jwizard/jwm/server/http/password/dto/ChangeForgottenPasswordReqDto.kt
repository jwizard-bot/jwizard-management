package pl.jwizard.jwm.server.http.password.dto

data class ChangeForgottenPasswordReqDto(
	val newPassword: String,
	val confirmedNewPassword: String,
	val otaToken: String,
)
