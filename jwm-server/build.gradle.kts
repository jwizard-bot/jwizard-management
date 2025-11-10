import org.gradle.api.tasks.testing.logging.TestLogEvent
import org.jetbrains.kotlin.gradle.dsl.JvmTarget

plugins {
	alias(libs.plugins.kotlinJvm)
	alias(libs.plugins.shadowJar)
}

group = "pl.jwizard"
version = getProperty("projectVersion")

// only for java classes
java {
	sourceCompatibility = JavaVersion.VERSION_21
	targetCompatibility = JavaVersion.VERSION_21
}

kotlin {
	compilerOptions {
		jvmTarget.set(JvmTarget.JVM_21)
	}
}

repositories {
	mavenCentral()
	mavenLocal()
	maven {
		url = uri("https://m2.miloszgilga.pl/private")
		credentials {
			username = getProperty("mavenName")
			password = getProperty("mavenSecret")
		}
	}
}

dependencies {
	implementation(libs.bcrypt)
	implementation(libs.kotlin)
	implementation(libs.logbackClassic)
	implementation(libs.jwizardLib)
	implementation(libs.totp)

	testImplementation(libs.junitJupiter)
	testImplementation(libs.junitJupiterEngine)
}

tasks {
	processResources {
		if (project.hasProperty("buildFrontend")) {
			// build frontend only when flag -PbuildFrontend was passed
			dependsOn(":jwm-client:copyFrontendToBackend")
		}
	}

	jar {
		manifest {
			attributes(
				"Main-Class" to "pl.jwizard.jwm.server.JWizardManagementEntrypointKt"
			)
		}
	}

	shadowJar {
		archiveBaseName.set("jwizard-management")
		archiveClassifier.set("")
		archiveVersion.set("")
		destinationDirectory.set(file("$rootDir/.bin"))
	}

	test {
		useJUnitPlatform()
		testLogging {
			events(TestLogEvent.PASSED, TestLogEvent.SKIPPED, TestLogEvent.FAILED)
		}
	}
}

// retrieves root property
fun getProperty(name: String) = rootProject.extra[name] as String
