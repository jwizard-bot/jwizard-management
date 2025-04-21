package pl.jwizard.jwm.server.http.me

import pl.jwizard.jwm.server.core.auth.SessionUser

interface MeService {
	fun getAccountEmail(sessionUser: SessionUser): String?

	fun updateAccountEmail(email: String?, sessionUser: SessionUser)

	fun sendTestEmail(email: String, sessionUser: SessionUser)

	fun changePassword(oldPassword: String, newPassword: String, sessionUser: SessionUser): Boolean
}
