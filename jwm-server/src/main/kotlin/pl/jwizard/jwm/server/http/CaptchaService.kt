package pl.jwizard.jwm.server.http

interface CaptchaService {
	fun performChallenge(cfIp: String?, cfToken: String): Boolean
}
