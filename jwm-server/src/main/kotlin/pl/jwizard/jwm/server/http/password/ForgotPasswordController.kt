package pl.jwizard.jwm.server.http.password

import io.javalin.http.HttpStatus
import io.javalin.http.bodyAsClass
import org.springframework.stereotype.Component
import pl.jwizard.jwl.server.exception.HttpException
import pl.jwizard.jwl.server.route.HttpControllerBase
import pl.jwizard.jwl.server.route.RouteDefinitionBuilder
import pl.jwizard.jwl.server.route.handler.RouteHandler
import pl.jwizard.jwm.server.core.ApiHttpHeader
import pl.jwizard.jwm.server.core.ApiHttpHeader.Companion.header
import pl.jwizard.jwm.server.core.exception.SpecifiedException
import pl.jwizard.jwm.server.http.CaptchaService
import pl.jwizard.jwm.server.http.password.dto.ChangeForgottenPasswordReqDto
import pl.jwizard.jwm.server.http.password.dto.RequestChangeForgottenPasswordReqDto

@Component
class ForgotPasswordController(
	private val forgotPasswordService: ForgotPasswordService,
	private val captchaService: CaptchaService,
) : HttpControllerBase {
	override val basePath = "/api/v1/forgot/password"

	private val requestChangeForgotPassword = RouteHandler { ctx ->
		val reqDto = ctx.bodyAsClass<RequestChangeForgottenPasswordReqDto>()
		val pass = captchaService.performChallenge(
			cfIp = ctx.header(ApiHttpHeader.CF_CONNECTING_IP),
			cfToken = reqDto.cfToken,
		)
		if (!pass) {
			throw HttpException(SpecifiedException.UNABLE_TO_VERIFY_CF_TOKEN)
		}
		forgotPasswordService.requestChangeForgotPassword(reqDto.login)
		ctx.status(HttpStatus.NO_CONTENT)
	}

	private val validateOtaToken = RouteHandler { ctx ->
		val otaToken = ctx.pathParam("otaToken")
		forgotPasswordService.validateOtaToken(otaToken)
			?: throw HttpException(SpecifiedException.INCORRECT_OR_EXPIRED_OTA_TOKEN)
		ctx.status(HttpStatus.NO_CONTENT)
	}

	private val updateForgotPassword = RouteHandler { ctx ->
		val reqDto = ctx.bodyAsClass<ChangeForgottenPasswordReqDto>()
		val ota = reqDto.otaToken
		val userLogin = forgotPasswordService.validateOtaToken(ota)
			?: throw HttpException(SpecifiedException.INCORRECT_OR_EXPIRED_OTA_TOKEN)
		if (!forgotPasswordService.updateForgotPassword(reqDto.newPassword, ota, userLogin)) {
			throw HttpException(SpecifiedException.UNABLE_TO_UPDATE_FORGOT_PASSWORD)
		}
		ctx.status(HttpStatus.NO_CONTENT)
	}

	override val routes = RouteDefinitionBuilder()
		.post("/request", requestChangeForgotPassword)
		.get("/token/<otaToken>/valid", validateOtaToken)
		.patch("/", updateForgotPassword)
		.compositeRoutes()
}
