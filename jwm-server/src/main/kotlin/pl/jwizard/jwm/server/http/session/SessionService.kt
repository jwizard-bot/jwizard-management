package pl.jwizard.jwm.server.http.session

import pl.jwizard.jwm.server.core.auth.SessionUser
import pl.jwizard.jwm.server.http.session.dto.RevalidateStateResDto
import pl.jwizard.jwm.server.http.session.dto.SessionsDataResDto

interface SessionService {
	val cookieDomain: String

	fun mySessions(sessionUser: SessionUser): SessionsDataResDto

	fun deleteMySessionsBasedSessionId(
		toDeleteSessionId: ByteArray,
		sessionUser: SessionUser,
	): Boolean

	fun deleteAllMySessionsWithoutCurrentSession(sessionUser: SessionUser)

	fun updateAndGetCsrfToken(sessionId: ByteArray): String

	fun revalidate(sessionId: ByteArray?): RevalidateStateResDto
}
