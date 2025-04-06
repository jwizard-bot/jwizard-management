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

	companion object {
		fun Context.cookie(serverCookie: ServerCookie) = cookie(serverCookie.cookieName)

		fun Context.removeCookie(serverCookie: ServerCookie) = removeCookie(serverCookie.cookieName)
	}
}
