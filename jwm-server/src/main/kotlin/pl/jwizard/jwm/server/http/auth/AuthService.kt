package pl.jwizard.jwm.server.http.auth

import pl.jwizard.jwm.server.core.auth.SessionUser
import pl.jwizard.jwm.server.http.dto.LoggedUserData
import pl.jwizard.jwm.server.service.spi.dto.UserCredentials

interface AuthService {
	val sessionTtlSec: Int

	val cookieDomain: String

	fun validateUserCredentials(login: String, password: String): UserCredentials?

	fun persistNewUserSession(
		userCredentials: UserCredentials,
		ip: String?,
		userAgent: String?
	): String

	fun checkMfa(code: String, sessionUser: SessionUser): LoggedUserData?

	fun checkRecoveryMfa(code: String, sessionUser: SessionUser): LoggedUserData?

	fun updateDefaultPassword(
		oldPassword: String,
		newPassword: String,
		sessionUser: SessionUser,
	): Boolean

	fun logout(sessionUser: SessionUser)
}
