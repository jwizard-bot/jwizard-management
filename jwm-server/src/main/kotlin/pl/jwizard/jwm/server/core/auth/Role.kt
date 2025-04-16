package pl.jwizard.jwm.server.core.auth

import pl.jwizard.jwl.server.filter.FilterRole

enum class Role : FilterRole {
	CSRF_PROTECTED,
	AUTHENTICATED,
	MFA_AUTHENTICATED,
	;

	override val id
		get() = name
}
