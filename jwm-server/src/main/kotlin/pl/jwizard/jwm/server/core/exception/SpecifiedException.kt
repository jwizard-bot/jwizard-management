package pl.jwizard.jwm.server.core.exception

import io.javalin.http.HttpStatus
import pl.jwizard.jwl.server.exception.ExceptionBase

enum class SpecifiedException(
	override val httpStatus: HttpStatus = HttpStatus.BAD_REQUEST,
) : ExceptionBase {
	INCORRECT_USERNAME_AND_OR_PASSWORD(HttpStatus.UNAUTHORIZED),
	UNABLE_TO_VERIFY_CF_TOKEN,
	INCORRECT_OR_EXPIRED_MFA_TOKEN,
	INCORRECT_OR_EXPIRED_OTA_TOKEN,
	INCORRECT_RECOVERY_CODE,
	UNABLE_TO_CHANGE_DEFAULT_PASSWORD,
	UNABLE_TO_UPDATE_ACCOUNT_PASSWORD,
	UNABLE_TO_UPDATE_FORGOT_PASSWORD,
	SESSION_BASED_ID_NOT_FOUND(HttpStatus.NOT_FOUND),
	;

	override val key
		get() = name
}
