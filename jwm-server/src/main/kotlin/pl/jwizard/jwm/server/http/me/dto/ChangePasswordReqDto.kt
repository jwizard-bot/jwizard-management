package pl.jwizard.jwm.server.http.me.dto

data class ChangePasswordReqDto(
	val oldPassword: String,
	val newPassword: String,
	val confirmedNewPassword: String,
)
