package pl.jwizard.jwm.server.service.crypto

import at.favre.lib.crypto.bcrypt.BCrypt
import org.springframework.stereotype.Component
import pl.jwizard.jwl.property.BaseEnvironment
import pl.jwizard.jwl.util.base64decode
import pl.jwizard.jwl.util.base64encode
import pl.jwizard.jwm.server.property.ServerProperty
import javax.crypto.Cipher
import javax.crypto.spec.SecretKeySpec

@Component
class EncryptService(environment: BaseEnvironment) {
	companion object {
		private const val ALGORITHM = "AES"
		private const val BCRYPT_ROUNDS = 10
	}

	private val aesSecretKey = environment.getProperty<String>(ServerProperty.SERVER_AES_SECRET_KEY)
	private val secretKey = SecretKeySpec(aesSecretKey.toByteArray(), ALGORITHM)

	fun encrypt(plainText: String): String {
		val cipher = Cipher.getInstance(ALGORITHM)
		cipher.init(Cipher.ENCRYPT_MODE, secretKey)
		val encryptedValue = cipher.doFinal(plainText.toByteArray())
		return base64encode(encryptedValue)
	}

	fun decrypt(encryptedText: String): String {
		val cipher = Cipher.getInstance(ALGORITHM)
		cipher.init(Cipher.DECRYPT_MODE, secretKey)
		val decodedValue = base64decode(encryptedText)
		return String(cipher.doFinal(decodedValue))
	}

	fun hash(rawText: String): String {
		return BCrypt.withDefaults().hashToString(BCRYPT_ROUNDS, rawText.toCharArray())
	}

	fun validateHash(rawText: String, hashedText: String): Boolean {
		val result = BCrypt.verifyer().verify(rawText.toCharArray(), hashedText)
		return result.verified
	}
}
