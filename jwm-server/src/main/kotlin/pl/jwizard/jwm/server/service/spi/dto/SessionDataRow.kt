package pl.jwizard.jwm.server.service.spi.dto

import java.time.LocalDateTime

data class SessionDataRow(
	val sessionId: ByteArray,
	val mfaEnabled: Boolean,
	val lastLoginUtc: LocalDateTime,
	val deviceSystem: String?,
	val deviceMobile: Boolean?,
	val geolocationInfo: String?,
) {
	override fun equals(other: Any?): Boolean {
		if (this === other) {
			return true
		}
		if (javaClass != other?.javaClass) {
			return false
		}
		other as SessionDataRow
		return sessionId.contentEquals(other.sessionId)
	}

	override fun hashCode() = sessionId.contentHashCode()
}
