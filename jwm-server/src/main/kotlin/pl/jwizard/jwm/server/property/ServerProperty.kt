package pl.jwizard.jwm.server.property

import pl.jwizard.jwl.property.AppProperty
import kotlin.reflect.KClass

enum class ServerProperty(
	override val key: String,
	override val type: KClass<*> = String::class,
) : AppProperty {
	SERVER_AES_SECRET_KEY("server.aes-secret-key"),

	// auth
	SERVER_AUTH_ADMIN_LOGIN("server.auth.admin-login"),
	SERVER_AUTH_COOKIE_DOMAIN("server.auth.cookie-domain"),

	// session
	SERVER_AUTH_SESSION_TTL_SEC("server.auth.session.ttl-sec", Int::class),
	SERVER_AUTH_SESSION_SID_TOKEN_LENGTH("server.auth.session.sid-token-length", Int::class),
	SERVER_AUTH_SESSION_CSRF_TOKEN_LENGTH("server.auth.session.csrf-token-length", Int::class),
}
