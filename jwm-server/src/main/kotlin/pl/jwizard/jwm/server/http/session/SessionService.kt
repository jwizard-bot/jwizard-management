package pl.jwizard.jwm.server.http.session

import pl.jwizard.jwm.server.core.auth.LoggedUser
import pl.jwizard.jwm.server.http.session.dto.CsrfTokenResDto
import pl.jwizard.jwm.server.http.session.dto.RevalidateStateResDto
import pl.jwizard.jwm.server.http.session.dto.SessionsDataResDto

interface SessionService {
	fun mySessions(loggedUser: LoggedUser): SessionsDataResDto

	fun deleteMySessionsBasedSessionId(toDeleteSessionId: String, loggedUser: LoggedUser): Boolean

	fun deleteAllMySessionsWithoutCurrentSession(loggedUser: LoggedUser)

	fun updateAndGetCsrfToken(sessionId: String): CsrfTokenResDto

	fun revalidate(sessionId: String?): RevalidateStateResDto
}
