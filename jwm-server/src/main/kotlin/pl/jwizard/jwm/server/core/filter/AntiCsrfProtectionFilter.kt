package pl.jwizard.jwm.server.core.filter

import io.javalin.http.Context
import io.javalin.http.ForbiddenResponse
import io.javalin.http.UnauthorizedResponse
import io.javalin.security.RouteRole
import org.springframework.stereotype.Component
import pl.jwizard.jwl.server.filter.RoleFilterBase
import pl.jwizard.jwl.server.getAttribute
import pl.jwizard.jwl.util.logger
import pl.jwizard.jwm.server.core.ApiHttpHeader
import pl.jwizard.jwm.server.core.ApiHttpHeader.Companion.header
import pl.jwizard.jwm.server.core.ApiServerAttribute
import pl.jwizard.jwm.server.core.auth.Role
import pl.jwizard.jwm.server.core.auth.SessionUser

@Component
class AntiCsrfProtectionFilter : RoleFilterBase() {
	companion object {
		private val log = logger<AntiCsrfProtectionFilter>()
	}

	override val roles = arrayOf<RouteRole>(Role.CSRF_PROTECTED)
	override val runIndex = 2

	override fun roleFilter(ctx: Context) {
		val session = ctx.getAttribute<SessionUser>(ApiServerAttribute.AUTHENTICATED_USER)
			?: throw UnauthorizedResponse()
		if (session.csrfToken != ctx.header(ApiHttpHeader.X_CSRF_TOKEN)) {
			log.debug("Passed csrf token is not equal to persisted csrf token.")
			throw ForbiddenResponse()
		}
	}
}
