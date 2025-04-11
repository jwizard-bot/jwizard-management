package pl.jwizard.jwm.server.service.spi

import pl.jwizard.jwm.server.service.spi.dto.UserAccountDetails
import pl.jwizard.jwm.server.service.spi.dto.UserCredentials

interface UserSupplier {
	fun getUserAccountDetails(login: String): UserAccountDetails?

	// null if user with provided login do not exist
	fun getUserCredentials(login: String): UserCredentials?

	fun createUser(login: String, passwordHash: String, isAdmin: Boolean): Int

	fun updateUserPassword(login: String, newPasswordHash: String): Int
}
