FROM eclipse-temurin:17-jdk-alpine AS build

SHELL ["/bin/sh", "-c"]

# install missing xargs library
RUN apk update
RUN apk add --no-cache findutils

ENV BUILD_DIR=/build/jwm

ARG JWIZARD_VERSION
# environment variables for M2 Central Repository Service
ARG JWIZARD_MAVEN_NAME
ARG JWIZARD_MAVEN_SECRET

# ignore secret warning (in multi-stage image is irrelevant)
ENV JWIZARD_MAVEN_NAME=$JWIZARD_MAVEN_NAME
ENV JWIZARD_MAVEN_SECRET=$JWIZARD_MAVEN_SECRET

RUN mkdir -p $BUILD_DIR
WORKDIR $BUILD_DIR

# copy only maven-based resources for optimized caching
COPY gradle $BUILD_DIR/gradle
COPY gradlew $BUILD_DIR/gradlew
COPY build.gradle.kts $BUILD_DIR/build.gradle.kts
COPY settings.gradle.kts $BUILD_DIR/settings.gradle.kts

COPY jwm-client/build.gradle.kts $BUILD_DIR/jwm-client/build.gradle.kts
COPY jwm-server/build.gradle.kts $BUILD_DIR/jwm-server/build.gradle.kts

RUN chmod +x $BUILD_DIR/gradlew
RUN cd $BUILD_DIR

RUN ./gradlew dependencies --no-daemon

# copy rest of resources
COPY jwm-client $BUILD_DIR/jwm-client
COPY jwm-server $BUILD_DIR/jwm-server
COPY docker $BUILD_DIR/docker

RUN ./gradlew clean --no-daemon
RUN JWIZARD_VERSION=${JWIZARD_VERSION} \
  ./gradlew shadowJar --no-daemon

FROM eclipse-temurin:17-jre-alpine

ENV BUILD_DIR=/build/jwm
ENV ENTRY_DIR=/app/jwm
ENV JAR_NAME=jwizard-management.jar

WORKDIR $ENTRY_DIR

COPY --from=build $BUILD_DIR/.bin/$JAR_NAME $ENTRY_DIR/$JAR_NAME
COPY --from=build $BUILD_DIR/docker/entrypoint $ENTRY_DIR/entrypoint

RUN sed -i \
  -e "s/\$JAR_NAME/$JAR_NAME/g" \
  entrypoint

RUN chmod +x entrypoint

LABEL maintainer="JWizard <info@jwizard.pl>"

EXPOSE 8080
ENTRYPOINT [ "./entrypoint" ]
