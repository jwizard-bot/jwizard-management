package pl.jwizard.jwm.server.http.auth

import pl.jwizard.jwm.server.core.auth.SessionUser
import pl.jwizard.jwm.server.http.auth.dto.CheckMfaResDto
import pl.jwizard.jwm.server.http.auth.dto.LoginReqDto
import pl.jwizard.jwm.server.http.auth.dto.SessionData
import pl.jwizard.jwm.server.http.auth.dto.UpdateDefaultPasswordReqDto

interface AuthService {
	fun login(reqDto: LoginReqDto, userAgent: String?, ipAddress: String?): SessionData?

	fun checkMfa(code: String, sessionUser: SessionUser): CheckMfaResDto?

	fun checkRecoveryMfa(code: String, sessionUser: SessionUser): CheckMfaResDto?

	fun updateDefaultPassword(
		reqDto: UpdateDefaultPasswordReqDto, ipAddress: String?,
		sessionUser: SessionUser,
	): Boolean

	fun logout(sessionUser: SessionUser)
}
