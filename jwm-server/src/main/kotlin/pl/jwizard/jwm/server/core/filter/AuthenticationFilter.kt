package pl.jwizard.jwm.server.core.filter

import org.springframework.stereotype.Component
import pl.jwizard.jwl.property.BaseEnvironment
import pl.jwizard.jwm.server.core.auth.SessionUser
import pl.jwizard.jwm.server.core.spi.SessionFilterService

@Component
class AuthenticationFilter(
	sessionFilterService: SessionFilterService,
	environment: BaseEnvironment,
) : AuthenticationFilterBase(sessionFilterService, environment) {
	override fun onAdditionalCheck(sessionUser: SessionUser) = true
}
