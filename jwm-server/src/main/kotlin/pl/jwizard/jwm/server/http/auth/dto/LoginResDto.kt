package pl.jwizard.jwm.server.http.auth.dto

import pl.jwizard.jwm.server.http.dto.LoggedUserData

data class LoginResDto(
	val requireMfa: Boolean,
	val loggedUser: LoggedUserData,
)
