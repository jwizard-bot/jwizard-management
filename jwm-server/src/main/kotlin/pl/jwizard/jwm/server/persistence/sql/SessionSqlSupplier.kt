package pl.jwizard.jwm.server.persistence.sql

import org.springframework.stereotype.Component
import pl.jwizard.jwl.persistence.sql.JdbiQuery
import pl.jwizard.jwl.persistence.sql.SqlColumn
import pl.jwizard.jwl.util.base64decode
import pl.jwizard.jwm.server.core.spi.SessionUser
import pl.jwizard.jwm.server.service.spi.SessionSupplier
import pl.jwizard.jwm.server.service.spi.dto.SessionDataRow
import pl.jwizard.jwm.server.service.spi.dto.SessionRevalidateState
import java.sql.JDBCType
import java.time.LocalDateTime
import java.time.ZoneOffset

@Component
class SessionSqlSupplier(private val jdbiQuery: JdbiQuery) : SessionSupplier {
	override fun getSession(sessionId: String): SessionUser? {
		val sql = """
			SELECT csrf_token, expired_at_utc, user_id, is_admin, mfa_passed
			FROM management_user_sessions mus
			INNER JOIN management_users mu ON mus.user_id = mu.id
			WHERE session_id = ? AND expired_at_utc > ?
		"""
		val now = LocalDateTime.now(ZoneOffset.UTC)
		return jdbiQuery.queryForNullableObject(sql, SessionUser::class, base64decode(sessionId), now)
	}

	override fun getMySessions(userId: Long): List<SessionDataRow> {
		val sql = """
			SELECT session_id, login, ISNULL(mfa_token) mfa_enabled, last_login_utc, device_system,
			device_mobile, geolocation_info
			FROM management_user_sessions mus
			INNER JOIN management_users mu ON mus.user_id = mu.id
			WHERE expired_at_utc > ? AND user_id = ?
		"""
		val now = LocalDateTime.now(ZoneOffset.UTC)
		return jdbiQuery.queryForList(sql, SessionDataRow::class, now, userId)
	}

	override fun getSessionExpirationTime(sessionId: String) = jdbiQuery.queryForNullableObject(
		sql = "SELECT expired_at_utc FROM management_user_sessions WHERE session_id = ?",
		type = LocalDateTime::class,
		base64decode(sessionId),
	)

	override fun getSessionRevalidateState(sessionId: String) = jdbiQuery.queryForNullableObject(
		sql = "SELECT expired_at_utc, mfa_passed FROM management_user_sessions WHERE session_id = ?",
		type = SessionRevalidateState::class,
		base64decode(sessionId),
	)

	override fun saveUserSession(
		sessionId: String,
		userId: Long,
		mfaEnabled: Boolean,
		expiredAtUtc: LocalDateTime,
		lastLoginUtc: LocalDateTime,
		deviceSystem: String?,
		deviceMobile: Boolean?,
		geolocationInfo: String?,
		csrfToken: String,
	): Int {
		val columns = createCommonSessionColumnsMap(
			expiredAtUtc, lastLoginUtc, deviceSystem, deviceMobile, geolocationInfo, csrfToken,
		)
		columns += "session_id" to SqlColumn(base64decode(sessionId), JDBCType.BINARY)
		columns += "user_id" to SqlColumn(userId, JDBCType.BIGINT)
		if (mfaEnabled) {
			columns += "mfa_passed" to SqlColumn(false, JDBCType.BOOLEAN)
		}
		return jdbiQuery.insertMultiples(tableName = "management_user_sessions", columns.toMap())
	}

	override fun afterLoginUpdateSession(
		sessionId: String,
		expiredAtUtc: LocalDateTime,
		lastLoginUtc: LocalDateTime,
		deviceSystem: String?,
		deviceMobile: Boolean?,
		geolocationInfo: String?,
		csrfToken: String,
	): Int {
		val columns = createCommonSessionColumnsMap(
			expiredAtUtc, lastLoginUtc, deviceSystem, deviceMobile, geolocationInfo, csrfToken,
		)
		return jdbiQuery.updateSingle(
			tableName = "management_user_sessions",
			columns = columns.toMap(),
			findColumn = "session_id" to SqlColumn(base64decode(sessionId), JDBCType.BINARY)
		)
	}

	override fun updateCsrfToken(
		sessionId: String,
		encryptedCsrfToken: String,
	) = jdbiQuery.updateSingle(
		tableName = "management_user_sessions",
		columns = mapOf(
			"csrf_token" to SqlColumn(encryptedCsrfToken, JDBCType.VARCHAR),
		),
		findColumn = "session_id" to SqlColumn(base64decode(sessionId), JDBCType.BINARY)
	)

	override fun updateSessionTime(
		sessionId: String,
		sessionExpiredAtUtc: LocalDateTime,
	) = jdbiQuery.updateSingle(
		tableName = "management_user_sessions",
		columns = mapOf(
			"expired_at_utc" to SqlColumn(sessionExpiredAtUtc, JDBCType.TIMESTAMP),
		),
		findColumn = "session_id" to SqlColumn(base64decode(sessionId), JDBCType.BINARY),
	)

	override fun deleteSession(sessionId: String): Int {
		val sql = "DELETE FROM management_user_sessions WHERE session_id = ?"
		return jdbiQuery.update(sql, base64decode(sessionId))
	}

	override fun deleteAllSessions(userId: Long, currentSessionId: String): Int {
		val sql = "DELETE FROM management_user_sessions WHERE user_id = ? AND session_id != ?"
		return jdbiQuery.update(sql, userId, base64decode(currentSessionId))
	}

	private fun createCommonSessionColumnsMap(
		expiredAtUtc: LocalDateTime,
		lastLoginUtc: LocalDateTime,
		deviceSystem: String?,
		deviceMobile: Boolean?,
		geolocationInfo: String?,
		csrfToken: String,
	): MutableMap<String, SqlColumn> {
		val columns = mutableMapOf<String, SqlColumn>()

		columns += "expired_at_utc" to SqlColumn(expiredAtUtc, JDBCType.TIMESTAMP)
		columns += "last_login_utc" to SqlColumn(lastLoginUtc, JDBCType.TIMESTAMP)
		columns += "csrf_token" to SqlColumn(csrfToken, JDBCType.VARCHAR)

		deviceSystem?.let { columns += "device_system" to SqlColumn(it, JDBCType.VARCHAR) }
		deviceMobile?.let { columns += "device_mobile" to SqlColumn(it, JDBCType.BOOLEAN) }
		geolocationInfo?.let { columns += "geolocation_info" to SqlColumn(it, JDBCType.VARCHAR) }

		return columns
	}
}
