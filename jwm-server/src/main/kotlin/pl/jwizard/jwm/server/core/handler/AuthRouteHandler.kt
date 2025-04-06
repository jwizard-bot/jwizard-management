package pl.jwizard.jwm.server.core.handler

import io.javalin.http.Context
import pl.jwizard.jwm.server.core.auth.LoggedUser
import pl.jwizard.jwm.server.core.auth.Role

class AuthRouteHandler(
	override val callback: (Context, LoggedUser) -> Unit,
) : AuthRouteHandlerBase(callback, Role.MFA_AUTHENTICATED)
