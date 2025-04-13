package pl.jwizard.jwm.server.http.dto

data class LoggedUserData(
	val login: String,
	val hasDefaultPassword: Boolean,
)
