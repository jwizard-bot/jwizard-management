package pl.jwizard.jwm.server.service.mfa

import dev.samstevens.totp.code.DefaultCodeGenerator
import dev.samstevens.totp.code.DefaultCodeVerifier
import dev.samstevens.totp.code.HashingAlgorithm
import dev.samstevens.totp.exceptions.QrGenerationException
import dev.samstevens.totp.qr.QrData
import dev.samstevens.totp.qr.ZxingPngQrGenerator
import dev.samstevens.totp.recovery.RecoveryCodeGenerator
import dev.samstevens.totp.secret.DefaultSecretGenerator
import dev.samstevens.totp.time.TimeProvider
import dev.samstevens.totp.util.Utils
import org.springframework.stereotype.Component
import pl.jwizard.jwl.util.logger
import java.time.ZoneOffset
import java.time.ZonedDateTime

@Component
class MfaGeneratorService {
	companion object {
		private val log = logger<MfaGeneratorService>()
	}

	private val secretGenerator = DefaultSecretGenerator()
	private val qrGenerator = ZxingPngQrGenerator()
	private val codeVerifier = DefaultCodeVerifier(DefaultCodeGenerator(), UtcTimeProvider())
	private val recoveryCodeGenerator = RecoveryCodeGenerator()

	fun generateSecret(): String = secretGenerator.generate()

	fun generateImage(login: String, secret: String, digitsCount: Int, periodCount: Int): String? {
		val qrData = QrData.Builder()
			.label(login)
			.secret(secret)
			.issuer("JWizard Management")
			.algorithm(HashingAlgorithm.SHA512)
			.digits(digitsCount)
			.period(periodCount)
			.build()

		return try {
			val imageBytes = qrGenerator.generate(qrData)
			Utils.getDataUriForImage(imageBytes, qrGenerator.imageMimeType)
		} catch (ex: QrGenerationException) {
			log.error("Unable generate MFA QR code. Cause: \"{}\".", ex.message)
			null
		}
	}

	fun validateCode(secret: String, code: String) = codeVerifier.isValidCode(secret, code)

	fun generateRecoveryCodes(
		amount: Int,
	): List<String> = recoveryCodeGenerator.generateCodes(amount).toList()

	private class UtcTimeProvider : TimeProvider {
		override fun getTime() = ZonedDateTime.now(ZoneOffset.UTC).toEpochSecond()
	}
}
