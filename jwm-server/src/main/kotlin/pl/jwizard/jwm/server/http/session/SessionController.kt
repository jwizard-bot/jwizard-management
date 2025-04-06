package pl.jwizard.jwm.server.http.session

import io.javalin.http.HttpStatus
import io.javalin.http.NotFoundResponse
import org.springframework.stereotype.Component
import pl.jwizard.jwl.server.route.HttpControllerBase
import pl.jwizard.jwl.server.route.RouteDefinitionBuilder
import pl.jwizard.jwl.server.route.handler.RouteHandler
import pl.jwizard.jwm.server.core.ServerCookie
import pl.jwizard.jwm.server.core.ServerCookie.Companion.cookie
import pl.jwizard.jwm.server.core.ServerCookie.Companion.removeCookie
import pl.jwizard.jwm.server.core.handler.AuthRouteHandler

@Component
class SessionController(private val sessionService: SessionService) : HttpControllerBase {
	override val basePath = "/api/v1/session"

	private val mySessions = AuthRouteHandler { ctx, loggedUser ->
		val resDto = sessionService.mySessions(loggedUser)
		ctx.json(resDto)
	}

	private val getCsrfToken = AuthRouteHandler { ctx, loggedUser ->
		val resDto = sessionService.updateAndGetCsrfToken(loggedUser.sessionId)
		ctx.json(resDto)
	}

	private val deleteMySessionBasedSessionId = AuthRouteHandler { ctx, loggedUser ->
		val sessionId = ctx.pathParam("sessionId")
		if (!sessionService.deleteMySessionsBasedSessionId(sessionId, loggedUser)) {
			throw NotFoundResponse()
		}
		ctx.status(HttpStatus.NO_CONTENT)
	}

	private val deleteAllMySessions = AuthRouteHandler { ctx, loggedUser ->
		sessionService.deleteAllMySessionsWithoutCurrentSession(loggedUser)
		ctx.status(HttpStatus.NO_CONTENT)
	}

	private val revalidate = RouteHandler { ctx ->
		val sessionId = ctx.cookie(ServerCookie.SID)
		val resDto = sessionService.revalidate(sessionId)
		if (!resDto.loggedIn) {
			ctx.removeCookie(ServerCookie.SID)
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
