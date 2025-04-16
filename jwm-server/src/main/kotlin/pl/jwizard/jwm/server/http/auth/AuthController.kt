package pl.jwizard.jwm.server.http.auth

import io.javalin.http.HttpStatus
import io.javalin.http.bodyAsClass
import org.springframework.stereotype.Component
import pl.jwizard.jwl.server.exception.HttpException
import pl.jwizard.jwl.server.route.HttpControllerBase
import pl.jwizard.jwl.server.route.RouteDefinitionBuilder
import pl.jwizard.jwl.server.route.handler.RouteHandler
import pl.jwizard.jwm.server.core.ApiHttpHeader
import pl.jwizard.jwm.server.core.ApiHttpHeader.Companion.header
import pl.jwizard.jwm.server.core.ServerCookie
import pl.jwizard.jwm.server.core.ServerCookie.Companion.removeCookie
import pl.jwizard.jwm.server.core.exception.SpecifiedException
import pl.jwizard.jwm.server.core.handler.AuthNoMfaRouteHandler
import pl.jwizard.jwm.server.core.handler.AuthRouteHandler
import pl.jwizard.jwm.server.http.auth.dto.LoginReqDto
import pl.jwizard.jwm.server.http.auth.dto.LoginResDto
import pl.jwizard.jwm.server.http.auth.dto.UpdateDefaultPasswordReqDto
import pl.jwizard.jwm.server.http.dto.LoggedUserData

@Component
class AuthController(private val authService: AuthService) : HttpControllerBase {
	override val basePath = "/api/v1/auth"

	private val login = RouteHandler { ctx ->
		val reqDto = ctx.bodyAsClass<LoginReqDto>()
		val ipAddress = ctx.header(ApiHttpHeader.CF_CONNECTING_IP)
		val sessionData = authService.login(reqDto, ctx.userAgent(), ipAddress)
			?: throw HttpException(SpecifiedException.INCORRECT_USERNAME_AND_OR_PASSWORD)

		val sidCookie = ServerCookie.SID.toCookieInstance(
			value = sessionData.sessionId,
			ttl = sessionData.sessionTtl,
			domain = sessionData.cookieDomain,
			httpOnly = true,
			secure = true,
		)
		val loggedUser = LoggedUserData(
			login = reqDto.login,
			hasDefaultPassword = !sessionData.initPasswordChanged,
		)
		val resDto = LoginResDto(sessionData.mfaEnabled, loggedUser)
		ctx.json(resDto)
		ctx.cookie(sidCookie)
	}

	private val checkMfa = AuthNoMfaRouteHandler { ctx, sessionUser ->
		val code = ctx.pathParam("code")
		val resDto = authService.checkMfa(code, sessionUser)
			?: throw HttpException(SpecifiedException.INCORRECT_MFA_TOKEN)
		ctx.json(resDto)
	}

	private val checkRecoveryMfa = AuthNoMfaRouteHandler { ctx, sessionUser ->
		val code = ctx.pathParam("code")
		val resDto = authService.checkRecoveryMfa(code, sessionUser)
			?: throw HttpException(SpecifiedException.INCORRECT_RECOVERY_CODE)
		ctx.json(resDto)
	}

	private val cancelMfa = AuthNoMfaRouteHandler { ctx, sessionUser ->
		authService.logout(sessionUser)
		ctx.removeCookie(ServerCookie.SID)
		ctx.status(HttpStatus.NO_CONTENT)
	}

	private val updateInitPassword = AuthRouteHandler { ctx, sessionUser ->
		val reqDto = ctx.bodyAsClass<UpdateDefaultPasswordReqDto>()
		val ipAddress = ctx.header(ApiHttpHeader.CF_CONNECTING_IP)
		if (!authService.updateDefaultPassword(reqDto, ipAddress, sessionUser)) {
			throw HttpException(SpecifiedException.UNABLE_TO_CHANGE_DEFAULT_PASSWORD)
		}
		ctx.status(HttpStatus.NO_CONTENT)
	}

	private val logout = AuthRouteHandler { ctx, sessionUser ->
		authService.logout(sessionUser)
		ctx.removeCookie(ServerCookie.SID)
		ctx.status(HttpStatus.NO_CONTENT)
	}

	override val routes = RouteDefinitionBuilder()
		.post("/login", login)
		.patch("/mfa/<code>", checkMfa)
		.patch("/mfa/recovery/<code>", checkRecoveryMfa)
		.delete("/mfa/cancel", cancelMfa)
		.patch("/password", updateInitPassword)
		.delete("/logout", logout)
		.compositeRoutes()
}
