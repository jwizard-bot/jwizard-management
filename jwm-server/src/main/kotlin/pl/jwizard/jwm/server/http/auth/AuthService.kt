package pl.jwizard.jwm.server.http.auth

import pl.jwizard.jwm.server.core.auth.LoggedUser
import pl.jwizard.jwm.server.http.auth.dto.LoginReqDto
import pl.jwizard.jwm.server.http.auth.dto.SessionData

interface AuthService {
	fun login(reqDto: LoginReqDto, userAgent: String?, ipAddress: String?): SessionData?

	fun logout(loggedUser: LoggedUser)
}
