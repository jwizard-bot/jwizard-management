package pl.jwizard.jwm.server.http.me

import io.javalin.http.HttpStatus
import io.javalin.http.bodyAsClass
import org.springframework.stereotype.Component
import pl.jwizard.jwl.server.exception.HttpException
import pl.jwizard.jwl.server.route.HttpControllerBase
import pl.jwizard.jwl.server.route.RouteDefinitionBuilder
import pl.jwizard.jwm.server.core.exception.SpecifiedException
import pl.jwizard.jwm.server.core.handler.AuthRouteHandler
import pl.jwizard.jwm.server.http.me.dto.AccountEmailResDto
import pl.jwizard.jwm.server.http.me.dto.ChangePasswordReqDto
import pl.jwizard.jwm.server.http.me.dto.SendTestEmailReqDto
import pl.jwizard.jwm.server.http.me.dto.UpdateAccountEmailReqDto

@Component
class MeController(private val meService: MeService) : HttpControllerBase {
	override val basePath = "/api/v1/@me"

	private val getAccountEmail = AuthRouteHandler { ctx, sessionUser ->
		val accountEmail = meService.getAccountEmail(sessionUser)
		ctx.json(AccountEmailResDto(accountEmail))
	}

	private val updateAccountEmail = AuthRouteHandler { ctx, sessionUser ->
		val reqDto = ctx.bodyAsClass<UpdateAccountEmailReqDto>()
		meService.updateAccountEmail(reqDto.email, sessionUser)
		ctx.status(HttpStatus.NO_CONTENT)
	}

	private val sendTestEmail = AuthRouteHandler { ctx, sessionUser ->
		val reqDto = ctx.bodyAsClass<SendTestEmailReqDto>()
		meService.sendTestEmail(reqDto.email, sessionUser)
		ctx.status(HttpStatus.NO_CONTENT)
	}

	private val changePassword = AuthRouteHandler { ctx, sessionUser ->
		val reqDto = ctx.bodyAsClass<ChangePasswordReqDto>()
		if (!meService.changePassword(reqDto.oldPassword, reqDto.newPassword, sessionUser)) {
			throw HttpException(SpecifiedException.UNABLE_TO_UPDATE_ACCOUNT_PASSWORD)
		}
		ctx.status(HttpStatus.NO_CONTENT)
	}

	override val routes = RouteDefinitionBuilder()
		.get("/email", getAccountEmail)
		.patch("/email", updateAccountEmail)
		.post("/email/test", sendTestEmail)
		.patch("/password", changePassword)
		.compositeRoutes()
}
