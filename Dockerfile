# build frontend separately
FROM node:22-alpine AS client

ENV BUILD_DIR=/build/jwm

RUN mkdir -p $BUILD_DIR
WORKDIR $BUILD_DIR/jwm-client

COPY jwm-client/package.json $BUILD_DIR/package.json
COPY jwm-client/yarn.lock $BUILD_DIR/yarn.lock

RUN yarn install --frozen-lockfile

COPY jwm-client $BUILD_DIR

RUN yarn build

FROM eclipse-temurin:21-jdk-alpine AS server

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
RUN ./gradlew dependencies --no-daemon

# copy rest of resources
COPY --from=client $BUILD_DIR/target/dist $BUILD_DIR/jwm-server/src/main/resources/static
COPY jwm-server $BUILD_DIR/jwm-server
COPY docker $BUILD_DIR/docker

RUN ./gradlew clean --no-daemon
RUN JWIZARD_VERSION=${JWIZARD_VERSION} \
  ./gradlew shadowJar --no-daemon

FROM eclipse-temurin:21-jre-alpine

ENV BUILD_DIR=/build/jwm
ENV ENTRY_DIR=/app/jwm
ENV JAR_NAME=jwizard-management.jar

WORKDIR $ENTRY_DIR

COPY --from=server $BUILD_DIR/.bin/$JAR_NAME $ENTRY_DIR/$JAR_NAME
COPY --from=server $BUILD_DIR/docker/entrypoint $ENTRY_DIR/entrypoint

RUN sed -i \
  -e "s/\$JAR_NAME/$JAR_NAME/g" \
  entrypoint

RUN chmod +x entrypoint

LABEL maintainer="JWizard <info@jwizard.pl>"

EXPOSE 8080
ENTRYPOINT [ "./entrypoint" ]
