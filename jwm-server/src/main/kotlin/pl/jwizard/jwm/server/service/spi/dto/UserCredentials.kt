package pl.jwizard.jwm.server.service.spi.dto

data class UserCredentials(
	val userId: Long,
	val passwordHash: String,
	val mfaEnabled: Boolean,
	val isAdmin: Boolean,
	val initPasswordChanged: Boolean,
)
