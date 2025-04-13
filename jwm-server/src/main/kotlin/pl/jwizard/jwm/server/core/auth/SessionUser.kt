package pl.jwizard.jwm.server.core.auth

import java.time.LocalDateTime

data class SessionUser(
	val sessionId: ByteArray,
	val login: String,
	val initPasswordChanged: Boolean,
	val csrfToken: String,
	val expiredAtUtc: LocalDateTime,
	val userId: Long,
	val isAdmin: Boolean,
	// true -> passed, false -> not passed, null -> mfa not set for session (and account)
	val mfaPassed: Boolean?,
	val mfaEnabled: Boolean,
) {
	override fun equals(other: Any?): Boolean {
		if (this === other) {
			return true
		}
		if (javaClass != other?.javaClass) {
			return false
		}
		other as SessionUser
		return sessionId.contentEquals(other.sessionId)
	}

	override fun hashCode() = sessionId.contentHashCode()
}
