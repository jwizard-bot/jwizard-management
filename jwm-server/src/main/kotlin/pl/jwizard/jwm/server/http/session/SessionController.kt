package pl.jwizard.jwm.server.http.session

import io.javalin.http.HttpStatus
import org.springframework.stereotype.Component
import pl.jwizard.jwl.server.exception.HttpException
import pl.jwizard.jwl.server.route.HttpControllerBase
import pl.jwizard.jwl.server.route.RouteDefinitionBuilder
import pl.jwizard.jwl.server.route.handler.RouteHandler
import pl.jwizard.jwl.util.base64decode
import pl.jwizard.jwm.server.core.ApiHttpHeader
import pl.jwizard.jwm.server.core.ServerCookie
import pl.jwizard.jwm.server.core.ServerCookie.Companion.cookie
import pl.jwizard.jwm.server.core.ServerCookie.Companion.removeCookie
import pl.jwizard.jwm.server.core.exception.SpecifiedException
import pl.jwizard.jwm.server.core.handler.AuthNoMfaRouteHandler
import pl.jwizard.jwm.server.core.handler.AuthRouteHandler
import pl.jwizard.jwm.server.http.session.dto.CsrfTokenResDto

@Component
class SessionController(private val sessionService: SessionService) : HttpControllerBase {
	override val basePath = "/api/v1/session"

	private val mySessions = AuthRouteHandler { ctx, loggedUser ->
		val resDto = sessionService.mySessions(loggedUser)
		ctx.json(resDto)
	}

	private val getCsrfToken = AuthNoMfaRouteHandler { ctx, loggedUser ->
		val csrfToken = sessionService.updateAndGetCsrfToken(loggedUser.sessionId)
		val resDto = CsrfTokenResDto(csrfToken, ApiHttpHeader.X_CSRF_TOKEN.headerName)
		ctx.json(resDto)
	}

	private val deleteMySessionBasedSessionId = AuthRouteHandler { ctx, loggedUser ->
		val sessionId = ctx.pathParam("sessionId")
		if (!sessionService.deleteMySessionsBasedSessionId(base64decode(sessionId), loggedUser)) {
			throw HttpException(SpecifiedException.SESSION_BASED_ID_NOT_FOUND)
		}
		ctx.status(HttpStatus.NO_CONTENT)
	}

	private val deleteAllMySessions = AuthRouteHandler { ctx, loggedUser ->
		sessionService.deleteAllMySessionsWithoutCurrentSession(loggedUser)
		ctx.status(HttpStatus.NO_CONTENT)
	}

	private val revalidate = RouteHandler { ctx ->
		val sessionId = ctx.cookie(ServerCookie.SID)
		val resDto = sessionService.revalidate(sessionId?.let { base64decode(it) })
		if (!resDto.exists) {
			// delete cookie if selected session not exists or is expired
			ctx.removeCookie(ServerCookie.SID, sessionService.cookieDomain)
		}
		ctx.json(resDto)
	}

	// do nothing, refreshed already in authentication filter
	private val update = AuthRouteHandler { ctx, _ ->
		ctx.status(HttpStatus.NO_CONTENT)
	}

	override val routes = RouteDefinitionBuilder()
		.get("/@me/all", mySessions)
		.get("/@me/csrf", getCsrfToken)
		.delete("/@me/<sessionId>", deleteMySessionBasedSessionId)
		.delete("/@me/all", deleteAllMySessions)
		.get("/revalidate", revalidate)
		.patch("/update", update)
		.compositeRoutes()
}
