package pl.jwizard.jwm.server.service.spi.dto

import java.time.LocalDateTime

data class SessionRevalidateState(
	val login: String,
	val initPasswordChanged: Boolean,
	val expiredAtUtc: LocalDateTime,
	val mfaPassed: Boolean,
)
