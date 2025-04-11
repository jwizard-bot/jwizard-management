package pl.jwizard.jwm.server.service

import org.springframework.stereotype.Service
import pl.jwizard.jwl.property.BaseEnvironment
import pl.jwizard.jwl.util.logger
import pl.jwizard.jwm.server.core.spi.InitAppService
import pl.jwizard.jwm.server.property.ServerProperty
import pl.jwizard.jwm.server.service.crypto.EncryptService
import pl.jwizard.jwm.server.service.crypto.SecureRndGeneratorService
import pl.jwizard.jwm.server.service.spi.UserSupplier

@Service
class InitAppServiceImpl(
	private val encryptService: EncryptService,
	private val rndGeneratorService: SecureRndGeneratorService,
	private val userSupplier: UserSupplier,
	environment: BaseEnvironment,
) : InitAppService {
	companion object {
		private val log = logger<InitAppServiceImpl>()
	}

	private val defaultAdminLogin = environment
		.getProperty<String>(ServerProperty.SERVER_AUTH_ADMIN_LOGIN)

	override fun createOrUpdateDefaultAdminUser() {
		val rawPassword = rndGeneratorService.generateAlphanumeric(30)
		val userAccountDetails = userSupplier.getUserAccountDetails(defaultAdminLogin)
		if (userAccountDetails == null) {
			userSupplier.createUser(
				login = defaultAdminLogin,
				passwordHash = encryptService.hash(rawPassword),
				isAdmin = true,
			)
			printCredentialsInfo("created", rawPassword)
			return
		}
		// account already persisted, update only default password (if not yet changed)
		log.info("Omit creating default admin user (already persisted in DB)")
		if (!userAccountDetails.initPasswordChanged) {
			userSupplier.updateUserPassword(
				login = defaultAdminLogin,
				newPasswordHash = encryptService.hash(rawPassword),
			)
			printCredentialsInfo("updated", rawPassword)
		}
	}

	private fun printCredentialsInfo(status: String, rawPassword: String) {
		log.info("Successfully {} default admin user. Use this following credentials:", status)
		println("\n\tLogin: $defaultAdminLogin")
		println("\tTemporary password: $rawPassword\n")
	}
}
