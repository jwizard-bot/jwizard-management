package pl.jwizard.jwm.server.service.spi.dto

import java.time.LocalDateTime

data class SessionDataRow(
	val sessionId: ByteArray,
	val mfaEnabled: Boolean,
	val lastLoginUtc: LocalDateTime,
	val deviceSystem: String?,
	val deviceMobile: Boolean?,
	val geolocationInfo: String?,
)
