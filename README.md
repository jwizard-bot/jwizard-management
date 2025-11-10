![](.github/banner.png)

[[About project](https://jwizard.pl/about)]
| [[Docker image](https://hub.docker.com/r/milosz08/jwizard-management)]
| [[Docker installation](docker/README.md)]

JWizard is an open-source Discord music bot handling audio content from various multimedia sources
with innovative web player. This repository contains web interface to simplify configuration,
updates and management of JWizard infrastructure.

## Table of content

* [Project modules](#project-modules)
* [Clone and install](#clone-and-install)
* [Contributing](#contributing)
* [License](#license)

## Project modules

| Name       | Description                        |
|------------|------------------------------------|
| jwm-client | React application (SPA).           |
| jwm-server | Javalin (with embed Jetty server). |

## Clone and install

1. Make sure you have at least JDK 17 and Kotlin 2.0.
2. Clone **JWizard Lib** and **JWizard Tools** from organization repository via:

```bash
$ git clone https://github.com/jwizard-bot/jwizard-lib
$ git clone https://github.com/jwizard-bot/jwizard-tools
```

3. Configure and run all necessary containers defined in `README.md` file in this repository. You
   must have up these containers:

| Name             | Port(s)    | Description                           |
|------------------|------------|---------------------------------------|
| jwizard-vault    | 8761       | Secret keys storage service.          |
| jwizard-mysql-db | 8762       | MySQL database.                       |
| jwizard-rabbitmq | 8771, 8772 | RabbitMQ server and management panel. |

> [!IMPORTANT]
> Don't forget to perform database migration after start DB (see
> [jwizard-lib](https://github.com/jwizard-bot/jwizard-lib) repository).

4. Build library and package to Maven Local artifacts' storage:

* for UNIX based systems:

```bash
$ ./gradlew clean publishToMavenLocal
```

* for Windows systems:

```bash
.\gradlew clean publishToMavenLocal
```

5. Clone this repository via:

```bash
$ git clone https://github.com/jwizard-bot/jwizard-management
```

6. Create `.env` file in root of the project path (based on `example.env`) and insert Vault token:

```properties
JWIZARD_VAULT_TOKEN=<vault token>
```

where `<value token>` property is the Vault token stored in configured `.env` file
in [jwizard-lib](https://github.com/jwizard-bot/jwizard-lib) repository.

7. That's it. Now you can run server via Intellij IDEA. Make sure, you have set JVM parameters (for
   server app):

```
-Druntime.profiles=dev -Denv.enabled=true -Xms128m -Xmx128m
```

where `Xmx` and `Xms` parameters are optional and can be modified.

> [!NOTE]
> For servers running on HotSpot JVM, Oracle recommended same Xms and Xmx parameter, ex. `-Xms128m`
> and `-Xmx128m`. More information you will find
> [here](https://docs.oracle.com/cd/E74363_01/ohi_vbp_-_installation_guide--20160224-094432-html-chunked/s66.html).

8. To run client development server, install packages via:

```bash
$ cd jwm-client
$ yarn install --frozen-lockfile
```

> [!TIP]
> If you do not have yarn, install via: `npm i -g yarn`.

and run it via:

```bash
$ yarn run dev
```

Client development server should be available at [8773](http://localhost:8773)

## Contributing

We welcome contributions from the community! Please read our [CONTRIBUTING](./CONTRIBUTING.md) file
for guidelines on how to get involved.

## License

This project is licensed under the Apache 2.0 License - see the LICENSE file for details.
