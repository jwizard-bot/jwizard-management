package pl.jwizard.jwm.server.core.handler

import io.javalin.http.Context
import pl.jwizard.jwl.server.filter.FilterRole
import pl.jwizard.jwl.server.getAttribute
import pl.jwizard.jwl.server.route.RouteMethod
import pl.jwizard.jwl.server.route.handler.RouteDataHandler
import pl.jwizard.jwm.server.core.ApiServerAttribute
import pl.jwizard.jwm.server.core.auth.Role
import pl.jwizard.jwm.server.core.auth.SessionUser

abstract class AuthRouteHandlerBase(
	override val callback: (Context, SessionUser) -> Unit,
	vararg roles: FilterRole,
) : RouteDataHandler<SessionUser>() {
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
	) = ctx.getAttribute<SessionUser>(ApiServerAttribute.AUTHENTICATED_USER)!!
}
