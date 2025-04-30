package pl.jwizard.jwm.server.http.mfa.dto

data class MfaAccountDetailsResDto(
	val secret: String,
	val qrCodeUri: String,
	val recoveryCodes: List<String>,
)
