package pl.jwizard.jwm.server.http.auth

import pl.jwizard.jwm.server.core.auth.SessionUser
import pl.jwizard.jwm.server.http.auth.dto.*

interface AuthService {
	fun login(reqDto: LoginReqDto, userAgent: String?, ipAddress: String?): SessionData?

	fun checkMfa(reqDto: CheckMfaReqDto, sessionUser: SessionUser): CheckMfaResDto?

	fun updateDefaultPassword(
		reqDto: UpdateDefaultPasswordReqDto, ipAddress: String?,
		sessionUser: SessionUser,
	): Boolean

	fun logout(sessionUser: SessionUser)
}
