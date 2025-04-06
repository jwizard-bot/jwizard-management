package pl.jwizard.jwm.server.http.auth

import io.javalin.http.HttpStatus
import io.javalin.http.UnauthorizedResponse
import io.javalin.http.bodyAsClass
import org.springframework.stereotype.Component
import pl.jwizard.jwl.server.route.HttpControllerBase
import pl.jwizard.jwl.server.route.RouteDefinitionBuilder
import pl.jwizard.jwl.server.route.handler.RouteHandler
import pl.jwizard.jwm.server.core.ApiHttpHeader
import pl.jwizard.jwm.server.core.ApiHttpHeader.Companion.header
import pl.jwizard.jwm.server.core.ServerCookie
import pl.jwizard.jwm.server.core.ServerCookie.Companion.removeCookie
import pl.jwizard.jwm.server.core.handler.AuthNoMfaRouteHandler
import pl.jwizard.jwm.server.core.handler.AuthRouteHandler
import pl.jwizard.jwm.server.http.auth.dto.LoginReqDto
import pl.jwizard.jwm.server.http.auth.dto.LoginResDto

@Component
class AuthController(private val authService: AuthService) : HttpControllerBase {
	override val basePath = "/api/v1/auth"

	private val login = RouteHandler { ctx ->
		val reqDto = ctx.bodyAsClass<LoginReqDto>()
		val ipAddress = ctx.header(ApiHttpHeader.CF_CONNECTING_IP)
		val sessionData = authService.login(reqDto, ctx.userAgent(), ipAddress)
			?: throw UnauthorizedResponse()
		val sidCookie = ServerCookie.SID.toCookieInstance(
			value = sessionData.sessionId,
			ttl = sessionData.sessionTtl,
			domain = sessionData.cookieDomain,
			httpOnly = true,
			secure = true,
		)
		val resDto = LoginResDto(
			login = reqDto.login,
			isAdmin = sessionData.isAdmin,
			mfaEnabled = sessionData.mfaEnabled,
			initPasswordChanged = sessionData.initPasswordChanged,
		)
		ctx.cookie(sidCookie)
		ctx.json(resDto)
	}

	private val checkMfa = AuthNoMfaRouteHandler { ctx, loggedUser ->
		// TODO
		ctx.status(HttpStatus.NO_CONTENT)
	}

	private val updateInitPassword = AuthRouteHandler { ctx, loggedUser ->
		// TODO
		ctx.status(HttpStatus.NO_CONTENT)
	}

	private val logout = AuthRouteHandler { ctx, loggedUser ->
		authService.logout(loggedUser)
		ctx.removeCookie(ServerCookie.SID)
		ctx.status(HttpStatus.NO_CONTENT)
	}

	override val routes = RouteDefinitionBuilder()
		.post("/login", login)
		.patch("/mfa", checkMfa)
		.patch("/password/init", updateInitPassword)
		.delete("/logout", logout)
		.compositeRoutes()
}
