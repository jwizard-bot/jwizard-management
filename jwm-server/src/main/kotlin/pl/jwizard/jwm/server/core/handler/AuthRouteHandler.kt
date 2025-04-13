package pl.jwizard.jwm.server.core.handler

import io.javalin.http.Context
import pl.jwizard.jwm.server.core.auth.Role
import pl.jwizard.jwm.server.core.auth.SessionUser

class AuthRouteHandler(
	override val callback: (Context, SessionUser) -> Unit,
) : AuthRouteHandlerBase(callback, Role.MFA_AUTHENTICATED)
