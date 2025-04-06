package pl.jwizard.jwm.server.http.session.dto

data class RevalidateStateResDto(
	val loggedIn: Boolean,
	val expired: Boolean,
	val mfaPassed: Boolean?,
)
