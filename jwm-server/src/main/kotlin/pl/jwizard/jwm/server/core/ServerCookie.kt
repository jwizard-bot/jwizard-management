package pl.jwizard.jwm.server.core

import io.javalin.http.Context
import io.javalin.http.Cookie

enum class ServerCookie(val cookieName: String) {
	SID("JWIZARD_MANAGEMENT_SID"),
	;

	fun toCookieInstance(
		value: String,
		domain: String,
		ttl: Int,
		httpOnly: Boolean,
		secure: Boolean,
	) = Cookie(
		cookieName,
		value,
		domain = domain,
		maxAge = ttl,
		isHttpOnly = httpOnly,
		secure = secure
	)

	fun removeCookie(
		domain: String,
		httpOnly: Boolean = true,
		secure: Boolean = true,
	) = Cookie(
		cookieName,
		value = "",
		domain = domain,
		maxAge = 0,
		isHttpOnly = httpOnly,
		secure = secure,
	)

	companion object {
		fun Context.cookie(serverCookie: ServerCookie) = cookie(serverCookie.cookieName)

		// for cross-domain cookie must be removed manually, by setting maxAge to 0
		// removeCookie() method from javalin not working in this case!
		fun Context.removeCookie(serverCookie: ServerCookie, domain: String) {
			res().setHeader("Set-Cookie", null) // clear cookies from middlewares
			cookie(serverCookie.removeCookie(domain))
		}
	}
}
