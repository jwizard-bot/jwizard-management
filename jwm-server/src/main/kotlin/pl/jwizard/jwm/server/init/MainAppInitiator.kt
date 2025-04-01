package pl.jwizard.jwm.server.init

import io.javalin.config.JavalinConfig
import io.javalin.http.staticfiles.StaticFileConfig
import org.springframework.core.io.ClassPathResource
import org.springframework.stereotype.Component
import pl.jwizard.jwl.AppInitiator
import pl.jwizard.jwl.server.HttpServer

@Component
internal class MainAppInitiator(private val httpServer: HttpServer) : AppInitiator {
	companion object {
		private const val SPA_CLASSPATH_PATH: String = "/static"
	}

	private fun createServerConfig(config: JavalinConfig) {
		// SPA only for production server (with -PcopyResources gradle flag in shadowJar task)
		val resource = ClassPathResource("/static")
		if (resource.exists()) {
			config.spaRoot.addFile("/", "$SPA_CLASSPATH_PATH/index.html")
			config.staticFiles.add { staticFiles: StaticFileConfig ->
				staticFiles.directory = SPA_CLASSPATH_PATH
			}
		}
	}

	override fun onInit() {
		httpServer.init(extendedConfig = ::createServerConfig)
	}
}
