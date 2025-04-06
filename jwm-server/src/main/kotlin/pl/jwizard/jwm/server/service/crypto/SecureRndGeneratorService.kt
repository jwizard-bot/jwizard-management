package pl.jwizard.jwm.server.service.crypto

import org.springframework.stereotype.Component
import pl.jwizard.jwl.util.base64encode
import java.security.SecureRandom

@Component
class SecureRndGeneratorService {
	companion object {
		private val random = SecureRandom()
	}

	fun generate(length: Int): String {
		val bytes = ByteArray(length)
		random.nextBytes(bytes)
		return base64encode(bytes)
	}
}
