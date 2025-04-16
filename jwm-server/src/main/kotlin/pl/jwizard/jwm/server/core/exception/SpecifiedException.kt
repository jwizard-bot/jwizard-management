package pl.jwizard.jwm.server.core.exception

import io.javalin.http.HttpStatus
import pl.jwizard.jwl.server.exception.ExceptionBase

enum class SpecifiedException(override val httpStatus: HttpStatus) : ExceptionBase {
	INCORRECT_USERNAME_AND_OR_PASSWORD(HttpStatus.UNAUTHORIZED),
	INCORRECT_MFA_TOKEN(HttpStatus.UNAUTHORIZED),
	INCORRECT_RECOVERY_CODE(HttpStatus.UNAUTHORIZED),
	UNABLE_TO_CHANGE_DEFAULT_PASSWORD(HttpStatus.BAD_REQUEST),
	SESSION_BASED_ID_NOT_FOUND(HttpStatus.NOT_FOUND),
	;

	override val key
		get() = name
}
