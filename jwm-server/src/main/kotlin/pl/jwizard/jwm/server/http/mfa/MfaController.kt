package pl.jwizard.jwm.server.http.mfa

import org.springframework.stereotype.Component
import pl.jwizard.jwl.server.route.HttpControllerBase
import pl.jwizard.jwl.server.route.RouteDefinitionBuilder
import pl.jwizard.jwl.server.route.handler.RouteHandler
import pl.jwizard.jwm.server.core.handler.AuthRouteHandler

@Component
class MfaController : HttpControllerBase {
	override val basePath = "/api/v1/mfa"

	private val getMfaMethods = RouteHandler { ctx ->
	}

	private val getMfaDetails = AuthRouteHandler { ctx, sessionUser ->
	}

	private val addMfaToAccount = AuthRouteHandler { ctx, sessionUser ->
	}

	private val removeMfaFromAccount = AuthRouteHandler { ctx, sessionUser ->
	}

	override val routes = RouteDefinitionBuilder()
		.get("/method/all", getMfaMethods)
		.get("/", getMfaDetails)
		.post("/", addMfaToAccount)
		.delete("/", removeMfaFromAccount)
		.compositeRoutes()
}
