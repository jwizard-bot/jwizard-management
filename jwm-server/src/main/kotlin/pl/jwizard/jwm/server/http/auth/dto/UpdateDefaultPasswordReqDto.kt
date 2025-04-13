package pl.jwizard.jwm.server.http.auth.dto

data class UpdateDefaultPasswordReqDto(
	val oldPassword: String,
	val newPassword: String,
	val confirmedNewPassword: String,
	val cfToken: String,
)
