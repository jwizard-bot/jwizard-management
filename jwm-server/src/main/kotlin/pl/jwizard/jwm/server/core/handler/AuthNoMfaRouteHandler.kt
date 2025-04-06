package pl.jwizard.jwm.server.core.handler

import io.javalin.http.Context
import pl.jwizard.jwm.server.core.auth.LoggedUser

// check if user is authenticated (has session) but without checking mfa validation state
class AuthNoMfaRouteHandler(
	override val callback: (Context, LoggedUser) -> Unit,
) : AuthRouteHandlerBase(callback)
