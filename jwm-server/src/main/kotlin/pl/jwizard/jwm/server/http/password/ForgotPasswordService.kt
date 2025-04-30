package pl.jwizard.jwm.server.http.password

interface ForgotPasswordService {
	fun requestChangeForgotPassword(login: String)

	// return assigned user login correlated to selected ota token
	fun validateOtaToken(otaToken: String): String?

	fun updateForgotPassword(newPassword: String, otaToken: String, login: String): Boolean
}
