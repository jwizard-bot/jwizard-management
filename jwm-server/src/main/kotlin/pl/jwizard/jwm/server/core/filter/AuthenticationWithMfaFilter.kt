package pl.jwizard.jwm.server.core.filter

import org.springframework.stereotype.Component
import pl.jwizard.jwl.property.BaseEnvironment
import pl.jwizard.jwm.server.core.auth.Role
import pl.jwizard.jwm.server.core.spi.SessionFilterService
import pl.jwizard.jwm.server.core.spi.SessionUser

@Component
class AuthenticationWithMfaFilter(
	sessionFilterService: SessionFilterService,
	environment: BaseEnvironment,
) : AuthenticationFilterBase(sessionFilterService, environment, Role.MFA_AUTHENTICATED) {
	// check if user which has mfa enabled, passed and validated mfa token
	override fun onAdditionalCheck(sessionUser: SessionUser) = sessionUser.mfaPassed ?: true
}
