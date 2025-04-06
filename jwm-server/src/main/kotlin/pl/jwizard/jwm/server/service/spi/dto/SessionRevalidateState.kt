package pl.jwizard.jwm.server.service.spi.dto

import java.time.LocalDateTime

data class SessionRevalidateState(
	val expiredAtUtc: LocalDateTime,
	val mfaPassed: Boolean?,
)
