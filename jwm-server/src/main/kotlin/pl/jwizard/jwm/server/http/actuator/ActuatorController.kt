package pl.jwizard.jwm.server.http.actuator

import org.springframework.stereotype.Component
import pl.jwizard.jwl.server.route.HttpControllerBase
import pl.jwizard.jwl.server.route.RouteDefinitionBuilder
import pl.jwizard.jwl.server.route.handler.RouteHandler
import pl.jwizard.jwm.server.http.actuator.dto.ActuatorHealthResDto

@Component
internal class ActuatorController : HttpControllerBase {
	override val basePath = "/api/actuator"

	private val getHealth = RouteHandler { ctx ->
		val resDto = ActuatorHealthResDto(status = "UP")
		ctx.json(resDto)
	}

	override val routes = RouteDefinitionBuilder()
		.get("/health", getHealth)
		.compositeRoutes()
}
