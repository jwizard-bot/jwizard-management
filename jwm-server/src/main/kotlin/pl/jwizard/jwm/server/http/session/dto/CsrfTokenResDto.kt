package pl.jwizard.jwm.server.http.session.dto

data class CsrfTokenResDto(
	val csrfToken: String,
	val headerName: String,
)
