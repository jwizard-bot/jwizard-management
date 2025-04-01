extra["projectVersion"] = getEnv("VERSION", "latest")
extra["mavenName"] = getEnv("MAVEN_NAME")
extra["mavenSecret"] = getEnv("MAVEN_SECRET")

tasks {
	register("clean") {
		val binDir = file("$projectDir/.bin")
		if (binDir.exists()) {
			binDir.deleteRecursively()
		}
		dependsOn(":jwm-client:clean")
		dependsOn(":jwm-server:clean")
	}
}

// retrieves the value of an environment variable, with a fallback to a default value
fun getEnv(name: String, defaultValue: String = ""): String {
	return System.getenv("JWIZARD_$name") ?: defaultValue
}
