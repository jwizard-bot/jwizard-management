package pl.jwizard.jwm.server.service.spi

import pl.jwizard.jwm.server.service.spi.dto.UserCredentials

interface UserSupplier {
	// null if user with provided login do not exist
	fun getUserCredentials(login: String): UserCredentials?
}
