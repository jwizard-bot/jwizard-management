package pl.jwizard.jwm.server.service.crypto

import org.springframework.stereotype.Component
import pl.jwizard.jwl.util.base64encode
import java.security.SecureRandom

@Component
class SecureRndGeneratorService {
	companion object {
		private val random = SecureRandom()
		private val characters = ('a'..'z') + ('A'..'Z') + ('0'..'9')
	}

	fun generateAlphanumeric(length: Int) = random.ints(length.toLong(), 0, characters.size)
		.toArray()
		.map { characters[it] }
		.joinToString("")

	fun generate(length: Int): String {
		val bytes = ByteArray(length)
		random.nextBytes(bytes)
		return base64encode(bytes)
	}
}
