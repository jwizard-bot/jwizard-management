package pl.jwizard.jwm.server.persistence.sql

import org.springframework.stereotype.Component
import pl.jwizard.jwl.persistence.sql.JdbiQuery
import pl.jwizard.jwm.server.service.spi.UserSupplier
import pl.jwizard.jwm.server.service.spi.dto.UserCredentials

@Component
class UserSqlSupplier(private val jdbiQuery: JdbiQuery) : UserSupplier {
	override fun getUserCredentials(login: String): UserCredentials? {
		val sql = """
			SELECT id user_id, password password_hash, ISNULL(mfa_secret) mfa_enabled, is_admin,
			init_password_changed
			FROM management_users WHERE login = ?
		"""
		return jdbiQuery.queryForNullableObject(sql, UserCredentials::class, login)
	}
}
