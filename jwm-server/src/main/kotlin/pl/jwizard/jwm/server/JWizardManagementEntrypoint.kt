package pl.jwizard.jwm.server

import pl.jwizard.jwl.AppRunner
import pl.jwizard.jwl.ioc.AppContextInitiator

@AppContextInitiator
class JWizardManagementEntrypoint

fun main() {
	AppRunner.run(JWizardManagementEntrypoint::class)
}
