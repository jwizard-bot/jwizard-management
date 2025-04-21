package pl.jwizard.jwm.server.service

import org.eclipse.jetty.http.HttpMethod
import org.springframework.stereotype.Component
import pl.jwizard.jwl.http.ApiContentType
import pl.jwizard.jwl.http.SecureHttpClientService
import pl.jwizard.jwl.http.UrlSearchParamsBuilder
import pl.jwizard.jwl.property.BaseEnvironment
import pl.jwizard.jwl.util.logger
import pl.jwizard.jwm.server.http.CaptchaService
import pl.jwizard.jwm.server.property.ServerProperty

@Component
class CaptchaServiceImpl(
	private val secureHttpClientService: SecureHttpClientService,
	environment: BaseEnvironment,
) : CaptchaService {
	companion object {
		private val log = logger<CaptchaServiceImpl>()
	}

	private val endpoint = environment.getProperty<String>(ServerProperty.CF_CAPTCHA_VERIFY_ENDPOINT)
	private val secretKey = environment.getProperty<String>(ServerProperty.CF_CAPTCHA_SECRET_KEY)

	override fun performChallenge(cfIp: String?, cfToken: String): Boolean {
		val bodyParams = UrlSearchParamsBuilder()
			.addParam("secret", secretKey)
			.addParam("response", cfToken)
			.apply { cfIp?.let { addParam("remoteip", it) } }
			.buildAsFormData()

		val node = secureHttpClientService.prepareAndRunSecureHttpRequest(
			url = endpoint,
			httpMethod = HttpMethod.POST,
			contentType = ApiContentType.WWW_FORM_URL_ENCODED,
			body = bodyParams,
			silent = true,
			onErrorCallback = {
				log.error(
					"Unable to verify captcha challenge for CF token: \"{}\". Cause: \"{}\".",
					cfToken,
					it.message,
				)
			}
		)
		return node != null && node.get("success").asBoolean()
	}
}
