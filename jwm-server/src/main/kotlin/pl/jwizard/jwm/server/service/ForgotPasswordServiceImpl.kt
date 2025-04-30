package pl.jwizard.jwm.server.service

import org.springframework.stereotype.Component
import pl.jwizard.jwl.util.logger
import pl.jwizard.jwm.server.http.password.ForgotPasswordService
import pl.jwizard.jwm.server.service.crypto.EncryptService
import pl.jwizard.jwm.server.service.ota.OtaTokenService
import pl.jwizard.jwm.server.service.ota.OtaTokenType
import pl.jwizard.jwm.server.service.spi.UserSupplier

@Component
class ForgotPasswordServiceImpl(
	private val encryptService: EncryptService,
	private val otaTokenService: OtaTokenService,
	private val userSupplier: UserSupplier,
) : ForgotPasswordService {
	companion object {
		private val log = logger<ForgotPasswordServiceImpl>()
	}

	override fun requestChangeForgotPassword(login: String) {
		val email = userSupplier.getUserEmail(login)
		if (email != null) {
			val otaToken = otaTokenService.generateOtaToken()
			// TODO: send generated ota token via email, if email address exists
			otaTokenService.persistOtaToken(OtaTokenType.CHANGE_FORGOT_PASSWORD, otaToken)
		}
	}

	override fun validateOtaToken(otaToken: String): String? {
		val userLogin = otaTokenService.validateOtaToken(OtaTokenType.CHANGE_FORGOT_PASSWORD, otaToken)
		if (userLogin == null) {
			log.debug("Unable to verify passed ota token: \"{}\".", otaToken)
		}
		return userLogin
	}

	override fun updateForgotPassword(newPassword: String, otaToken: String, login: String): Boolean {
		userSupplier.updateUserPassword(
			login = login,
			newPasswordHash = encryptService.hash(newPassword),
		)
		otaTokenService.markOtaTokenAsUsed(otaToken)
		log.debug("Changed forgot password for user: \"{}\".", login)
		return true
	}
}
