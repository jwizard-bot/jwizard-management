package pl.jwizard.jwm.server.http.session.dto

data class SessionsDataResDto(
	val current: SessionData,
	val sessions: List<SessionData>,
	val geolocationProviderName: String,
	val geolocationProviderWebsiteUrl: String,
)
