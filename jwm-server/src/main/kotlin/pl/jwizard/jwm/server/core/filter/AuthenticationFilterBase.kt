package pl.jwizard.jwm.server.core.filter

import io.javalin.http.Context
import io.javalin.http.UnauthorizedResponse
import pl.jwizard.jwl.property.BaseEnvironment
import pl.jwizard.jwl.server.filter.FilterRole
import pl.jwizard.jwl.server.filter.RoleFilterBase
import pl.jwizard.jwl.server.setAttribute
import pl.jwizard.jwl.util.base64decode
import pl.jwizard.jwl.util.logger
import pl.jwizard.jwm.server.core.ApiServerAttribute
import pl.jwizard.jwm.server.core.ServerCookie
import pl.jwizard.jwm.server.core.ServerCookie.Companion.cookie
import pl.jwizard.jwm.server.core.ServerCookie.Companion.removeCookie
import pl.jwizard.jwm.server.core.auth.Role
import pl.jwizard.jwm.server.core.auth.SessionUser
import pl.jwizard.jwm.server.core.spi.SessionFilterService
import pl.jwizard.jwm.server.property.ServerProperty
import java.time.LocalDateTime
import java.time.ZoneOffset

abstract class AuthenticationFilterBase(
	private val sessionFilterService: SessionFilterService,
	environment: BaseEnvironment,
	vararg roles: Role,
) : RoleFilterBase() {
	companion object {
		private val log = logger<AuthenticationFilterBase>()
	}

	override val roles = arrayOf<FilterRole>(Role.AUTHENTICATED, *roles)
	override val runIndex = 1

	private val cookieDomain = environment
		.getProperty<String>(ServerProperty.SERVER_AUTH_COOKIE_DOMAIN)

	final override fun roleFilter(ctx: Context) {
		val sessionId = ctx.cookie(ServerCookie.SID) ?: throw UnauthorizedResponse()
		val decodedSessionId = base64decode(sessionId)
		val session = sessionFilterService.getUserSession(decodedSessionId)
		if (session == null) {
			ctx.removeCookie(ServerCookie.SID, cookieDomain)
			log.debug("Not found active session with session ID: \"{}\". Delete cookie.", sessionId)
			throw UnauthorizedResponse()
		}
		val now = LocalDateTime.now(ZoneOffset.UTC)
		// if session expired, remove it from db and return 401
		if (session.expiredAtUtc.isBefore(now)) {
			sessionFilterService.deleteExpiredSession(decodedSessionId, session.userId)
			ctx.removeCookie(ServerCookie.SID, cookieDomain)
			log.debug("Session with session ID: \"{}\" is expired. Delete cookie.", sessionId)
			throw UnauthorizedResponse()
		}
		if (!onAdditionalCheck(session)) {
			throw UnauthorizedResponse()
		}
		val sessionExpiredAt = sessionFilterService.updateSessionTime(decodedSessionId, now)
		val updatedCookie = ServerCookie.SID.toCookieInstance(
			value = sessionId,
			ttl = sessionExpiredAt,
			domain = cookieDomain,
			httpOnly = true,
			secure = true,
		)
		ctx.setAttribute(ApiServerAttribute.AUTHENTICATED_USER, session)
		ctx.cookie(updatedCookie)
	}

	// return true if all good, otherwise return false and throw 401
	protected abstract fun onAdditionalCheck(sessionUser: SessionUser): Boolean
}
