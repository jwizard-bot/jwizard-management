package pl.jwizard.jwm.server.service

import org.springframework.stereotype.Component
import pl.jwizard.jwl.util.logger
import pl.jwizard.jwm.server.core.auth.SessionUser
import pl.jwizard.jwm.server.http.me.MeService
import pl.jwizard.jwm.server.service.crypto.EncryptService
import pl.jwizard.jwm.server.service.spi.UserSupplier

@Component
class MeServiceImpl(
	private val encryptService: EncryptService,
	private val userSupplier: UserSupplier,
) : MeService {
	companion object {
		private val log = logger<MeServiceImpl>()
	}

	override fun getAccountEmail(
		sessionUser: SessionUser,
	) = userSupplier.getUserEmail(sessionUser.login)

	override fun updateAccountEmail(email: String?, sessionUser: SessionUser) {
		userSupplier.updateUserEmail(sessionUser.userId, email)
	}

	override fun sendTestEmail(email: String, sessionUser: SessionUser) {
		// TODO: send test email at specified email address
	}

	override fun changePassword(
		oldPassword: String,
		newPassword: String,
		sessionUser: SessionUser,
	): Boolean {
		val userCredentials = userSupplier.getUserCredentials(sessionUser.login) ?: return false
		if (!encryptService.validateHash(oldPassword, userCredentials.passwordHash)) {
			log.debug(
				"Attempt to change init password with incorrect old password for user: \"{}\".",
				sessionUser,
			)
			return false
		}
		userSupplier.updateUserPassword(
			login = sessionUser.login,
			newPasswordHash = encryptService.hash(newPassword),
		)
		log.debug("Changed init password for user: \"{}\".", sessionUser)
		return true
	}
}
