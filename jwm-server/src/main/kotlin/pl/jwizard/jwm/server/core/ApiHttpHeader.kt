package pl.jwizard.jwm.server.core

import io.javalin.http.Context

enum class ApiHttpHeader(val headerName: String) {
	// custom
	X_CSRF_TOKEN("X-Csrf-Token"),
	CF_CONNECTING_IP("CF-Connecting-IP"),
	;

	companion object {
		fun Context.header(apiHttpHeader: ApiHttpHeader) = header(apiHttpHeader.headerName)
	}
}
