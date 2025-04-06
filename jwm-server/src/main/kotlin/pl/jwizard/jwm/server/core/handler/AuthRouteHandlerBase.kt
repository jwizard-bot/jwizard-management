package pl.jwizard.jwm.server.core.handler

import io.javalin.http.Context
import io.javalin.security.RouteRole
import pl.jwizard.jwl.server.getAttribute
import pl.jwizard.jwl.server.route.RouteMethod
import pl.jwizard.jwl.server.route.handler.RouteDataHandler
import pl.jwizard.jwm.server.core.ApiServerAttribute
import pl.jwizard.jwm.server.core.auth.LoggedUser
import pl.jwizard.jwm.server.core.auth.Role

abstract class AuthRouteHandlerBase(
	override val callback: (Context, LoggedUser) -> Unit,
	vararg roles: RouteRole,
) : RouteDataHandler<LoggedUser>() {
	final override val withRoles = mapOf(
		forAllRouteMethods(Role.AUTHENTICATED),
		*(roles.map(this::forAllRouteMethods).toTypedArray()),
		forRouteMethods(
			Role.CSRF_PROTECTED,
			RouteMethod.PUT,
			RouteMethod.POST,
			RouteMethod.PATCH,
			RouteMethod.DELETE,
		)
	)

	final override fun handleWithData(
		ctx: Context,
	) = ctx.getAttribute<LoggedUser>(ApiServerAttribute.AUTHENTICATED_USER)!!
}
