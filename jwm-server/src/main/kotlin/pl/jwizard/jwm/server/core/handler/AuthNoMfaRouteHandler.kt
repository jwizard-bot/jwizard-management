package pl.jwizard.jwm.server.core.handler

import io.javalin.http.Context
import pl.jwizard.jwm.server.core.auth.SessionUser

// check if user is authenticated (has session) but without checking mfa validation state
class AuthNoMfaRouteHandler(
	override val callback: (Context, SessionUser) -> Unit,
) : AuthRouteHandlerBase(callback)
