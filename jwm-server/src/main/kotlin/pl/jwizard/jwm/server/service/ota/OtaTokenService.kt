package pl.jwizard.jwm.server.service.ota

import org.springframework.stereotype.Component
import pl.jwizard.jwl.property.BaseEnvironment
import pl.jwizard.jwm.server.property.ServerProperty
import pl.jwizard.jwm.server.service.crypto.SecureRndGeneratorService

@Component
class OtaTokenService(
	private val secureRndGeneratorService: SecureRndGeneratorService,
	environment: BaseEnvironment,
) {
	private val otaLength = environment.getProperty<Int>(ServerProperty.OTA_TOKEN_LENGTH)
	private val otaTtlSec = environment.getProperty<Long>(ServerProperty.OTA_TOKEN_TTL)

	fun generateOtaToken() = secureRndGeneratorService.generateAlphanumeric(otaLength)

	fun validateOtaToken(otaTokenType: OtaTokenType, otaToken: String): String? {
		return null
	}

	fun persistOtaToken(otaTokenType: OtaTokenType, otaToken: String) {
	}

	fun markOtaTokenAsUsed(otaToken: String) {
	}
}
