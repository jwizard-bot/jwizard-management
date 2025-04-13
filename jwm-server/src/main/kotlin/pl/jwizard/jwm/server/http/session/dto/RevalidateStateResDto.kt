package pl.jwizard.jwm.server.http.session.dto

import pl.jwizard.jwm.server.http.dto.LoggedUserData

data class RevalidateStateResDto(
	val exists: Boolean,
	val loggedUser: LoggedUserData?,
	val expired: Boolean,
	val requireMfa: Boolean,
)
