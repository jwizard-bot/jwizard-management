package pl.jwizard.jwm.server.service.mfa

import org.springframework.stereotype.Component
import pl.jwizard.jwm.server.http.mfa.MfaService

@Component
class MfaServiceImpl(
	private val mfaGeneratorService: MfaGeneratorService,
) : MfaService
