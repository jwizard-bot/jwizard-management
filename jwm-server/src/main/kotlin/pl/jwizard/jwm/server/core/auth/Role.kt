package pl.jwizard.jwm.server.core.auth

import io.javalin.security.RouteRole

enum class Role : RouteRole {
	CSRF_PROTECTED,
	AUTHENTICATED,
	MFA_AUTHENTICATED,
}
