package pl.jwizard.jwm.server.persistence.sql

import org.springframework.stereotype.Component
import pl.jwizard.jwl.persistence.sql.JdbiQuery
import pl.jwizard.jwl.persistence.sql.SqlColumn
import pl.jwizard.jwm.server.service.spi.UserSupplier
import pl.jwizard.jwm.server.service.spi.dto.UserAccountDetails
import pl.jwizard.jwm.server.service.spi.dto.UserCredentials
import java.sql.JDBCType

@Component
class UserSqlSupplier(private val jdbiQuery: JdbiQuery) : UserSupplier {
	override fun getUserAccountDetails(login: String) = jdbiQuery.queryForNullableObject(
		sql = "SELECT init_password_changed FROM management_users WHERE login = ?",
		type = UserAccountDetails::class,
		login,
	)

	override fun getUserCredentials(login: String): UserCredentials? {
		val sql = """
			SELECT id user_id, password password_hash, IF(ISNULL(mfa_secret), false, true) mfa_enabled,
			is_admin, init_password_changed
			FROM management_users WHERE login = ?
		"""
		return jdbiQuery.queryForNullableObject(sql, UserCredentials::class, login)
	}

	override fun createUser(
		login: String,
		passwordHash: String,
		isAdmin: Boolean,
	) = jdbiQuery.insertMultiples(
		tableName = "management_users",
		columns = mapOf(
			"login" to SqlColumn(login, JDBCType.VARCHAR),
			"password" to SqlColumn(passwordHash, JDBCType.CHAR),
			"is_admin" to SqlColumn(isAdmin, JDBCType.BOOLEAN),
		)
	)

	override fun updateUserPassword(login: String, newPasswordHash: String) = jdbiQuery.updateSingle(
		tableName = "management_users",
		columns = mapOf("password" to SqlColumn(newPasswordHash, JDBCType.CHAR)),
		findColumn = "login" to SqlColumn(login, JDBCType.VARCHAR),
	)
}
