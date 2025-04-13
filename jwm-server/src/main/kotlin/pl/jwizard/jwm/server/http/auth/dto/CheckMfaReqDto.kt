package pl.jwizard.jwm.server.http.auth.dto

data class CheckMfaReqDto(
	val mfaCode: String,
)
