package pl.jwizard.jwm.server.core

import pl.jwizard.jwl.server.ServerAttribute

enum class ApiServerAttribute(override val attributeId: String) : ServerAttribute {
	AUTHENTICATED_USER("authenticated_user"),
	;
}
