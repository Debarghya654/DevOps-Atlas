import type { Lesson } from "../types";

export const lessons: Lesson[] = [
  {
    slug: "docker-fundamentals",
    title: "Docker fundamentals",
    status: "full",
    blocks: [
      { type: "diagram", id: "docker" },
      {
        type: "h2",
        text: "A container shares the host kernel",
      },
      {
        type: "p",
        text: "A virtual machine runs a guest kernel on virtual hardware. It boots slowly and isolates workloads strongly, because a kernel bug in the guest is not a kernel bug in the host. A container is a process (or a small group of processes) isolated with Linux namespaces and limited with cgroups. It shares the host kernel. Startup is fast and the image is smaller because there is no second kernel. The isolation is real and incomplete: a kernel exploit, a mounted Docker socket, or a privileged container is a path to the host. A container is not a security boundary by itself. Treat it as packaging plus resource and namespace isolation, and add the controls in the security primer before you describe it as a sandbox.",
      },
      {
        type: "table",
        caption: "VM and container",
        headers: ["", "Virtual machine", "Container"],
        rows: [
          ["Kernel", "Guest kernel, separate from the host", "Host kernel, shared"],
          ["Start", "Boot the guest", "Start a process"],
          ["Image weight", "Disk image with an OS install", "Layered filesystem of the app and its libraries"],
          ["Isolation", "Strong hardware boundary", "Namespaces and cgroups. Not enough on their own"],
          ["Typical use here", "The laptop running Docker Desktop", "The Spring Boot process and Postgres"],
        ],
      },
      {
        type: "h2",
        text: "Image, container, registry",
      },
      {
        type: "p",
        text: "An image is an immutable template: stacked filesystem layers plus configuration such as the environment, the user, and the command. A container is a running or stopped instance of an image with a thin writable layer on top. Deleting the container deletes that writable layer. A registry stores images. Docker Hub, GitHub Container Registry, and cloud registries are the same idea as Nexus is for jars: coordinates, tags, and access control.",
      },
      {
        type: "p",
        text: "Each instruction that changes the filesystem adds a layer. Unchanged layers are cached, which is why instruction order matters in the next lesson. A tag is a mutable label. app:1.2 and eclipse-temurin:21-jre can be moved to new bytes. latest is a tag like any other, not a promise of quality. A digest (sha256 and a hex string) names the content. Production pulls should pin the digest. The commands in this lesson use tags so they are readable, and you should verify those tags against current official docs before a shared build depends on them.",
      },
      {
        type: "h2",
        text: "Engine, CLI, daemon, Dockerfile",
      },
      {
        type: "p",
        text: "The Docker CLI is the docker command. It talks to an engine. In the classic install that engine is dockerd, a daemon that builds images and supervises containers. Docker Desktop runs that engine inside a utility VM on macOS and Windows. Rootless modes exist; the teaching model is the same. The CLI is not the container. A Dockerfile is the recipe the builder (BuildKit, on current Docker) executes to produce an image. The build context is the directory you pass to docker build, not your entire disk. Files in that directory can be sent to the daemon even if you did not mean to copy them. A .dockerignore file is how you keep secrets and the .git directory out of the context.",
      },
      {
        type: "h3",
        text: "Instructions you will type",
      },
      {
        type: "table",
        caption: "Dockerfile instructions",
        headers: ["Instruction", "Effect"],
        rows: [
          ["FROM", "Starts a stage from a base image. Every stage has one."],
          ["WORKDIR", "Sets the working directory for later instructions and for the container. Creates it if needed."],
          ["COPY", "Copies files from the build context into the image. Not a path on an arbitrary machine."],
          ["RUN", "Runs a command during the build and commits a layer."],
          ["ENV", "Sets an environment variable that remains in the image and is visible to anyone who can inspect it."],
          ["ARG", "Build-time variable. It does not persist as ENV unless you copy it. It can still remain in build history."],
          ["EXPOSE", "Documents a port. It does not publish the port to the host."],
          ["USER", "The uid or name for later RUN instructions and for the container process."],
          ["CMD", "Default arguments. docker run arguments replace a CMD."],
          ["ENTRYPOINT", "The executable. docker run arguments append to the exec form."],
        ],
      },
      {
        type: "p",
        text: "Shell form is ENTRYPOINT java -jar /app/app.jar with no JSON array. Docker runs it as /bin/sh -c and that shell is PID 1. Signals from docker stop often hit the shell and not Java, so Spring Boot may not shut down cleanly, and variables expand in the shell. Exec form is ENTRYPOINT [\"java\", \"-jar\", \"/app/app.jar\"]. There is no shell, there is no variable expansion, and Java is PID 1. Java 21 and Spring Boot 3 handle SIGTERM and start a graceful shutdown. Use exec form unless you have a specific reason to need a shell.",
      },
      {
        type: "code",
        lang: "dockerfile",
        title: "Runtime image shape",
        note: "Illustrative Dockerfile. It was not built in this environment. Verify the base image tag against current official docs.",
        code: `FROM eclipse-temurin:21-jre
WORKDIR /app
COPY app.jar /app/app.jar
EXPOSE 8080
USER 10001
ENTRYPOINT ["java", "-jar", "/app/app.jar"]`,
      },
      {
        type: "h2",
        text: "Build, run, and the default network",
      },
      {
        type: "p",
        text: "docker build -t app:local . builds from the Dockerfile in the current directory and tags the result app:local. docker run --rm -p 8080:8080 --name app app:local creates a container. --rm deletes it when it stops, which deletes the writable layer. -p 8080:8080 publishes host port 8080 to container port 8080. The order is host, then container. Prefer -p 127.0.0.1:8080:8080 on a laptop so the process is not reachable from the rest of the network. docker ps lists running containers. docker logs app reads that container's stdout and stderr. docker exec runs a new process inside the container's namespaces; it is a debugging tool, and a production image does not need a shell for the app to run. docker stop sends SIGTERM and, after a grace period (10 seconds by default), SIGKILL. docker rm removes a stopped container. It does not remove named volumes.",
      },
      {
        type: "code",
        lang: "bash",
        title: "Everyday commands",
        code: `docker build -t app:local .
docker run --rm -d -p 127.0.0.1:8080:8080 --name app app:local
docker ps
docker logs app
docker exec app java -version
docker stop app`,
      },
      {
        type: "code",
        lang: "text",
        title: "docker ps",
        note: "Illustrative output — not captured from a live run in this environment.",
        code: `CONTAINER ID   IMAGE       COMMAND                  CREATED          STATUS          PORTS                      NAMES
a1b2c3d4e5f6   app:local   "java -jar /app/app.jar" 20 seconds ago   Up 19 seconds   127.0.0.1:8080->8080/tcp   app`,
      },
      {
        type: "callout",
        tone: "danger",
        title: "docker rm and the docker group are not harmless",
        text: "docker rm deletes the container. Add a volume flag only when you intend to delete data, and never point a recursive delete at a volume you have not identified. Membership in the docker group, or sudo docker, is root-equivalent on a default engine: the daemon can mount the host filesystem. Do not grant it for convenience. This site does not run these commands for you. Install Docker Desktop or the engine locally if you want to try them.",
      },
      {
        type: "h3",
        text: "Networks, ports, and volumes",
      },
      {
        type: "p",
        text: "The default bridge network lets containers reach out, but automatic DNS by container name is a feature of user-defined bridges. Compose creates a user-defined network, which is why one service can connect to the hostname postgres. Publishing a port with -p is separate from EXPOSE. A volume is storage Docker manages; it survives docker rm and is the right place for database files. A bind mount maps a host directory into the container. Use a bind mount for local source editing. Do not use a bind mount as the production data disk unless you have a host path you actually back up. The container process sees the mount, not your laptop path, inside its own mount namespace.",
      },
      {
        type: "callout",
        tone: "warn",
        title: "127.0.0.1 inside the container is not your laptop",
        text: "Each container has its own loopback interface. -p forwards traffic to the container's network interface, not to 127.0.0.1 inside that network namespace. If the process binds only to loopback, the host connection is refused or times out. Bind to 0.0.0.0 in containers. On Spring Boot 3, leave server.address unset (the embedded server already listens on all interfaces) or set it to 0.0.0.0. Setting it to 127.0.0.1 is a local-development habit that breaks the published port.",
      },
      {
        type: "p",
        text: "The Java examples on this track stay on Java 21 and Spring Boot 3.x with jakarta.* packages. The image tags above are examples. Verify them, and later pin digests, against current official docs. Nothing in this lesson was executed in this environment.",
      },
    ],
    exercise: {
      title: "Build and run a container locally",
      prompt: "Install Docker Desktop or the Docker engine on your laptop. The lesson site does not start Docker and does not run these containers for you. If the engine is not installed, the exercise cannot be completed on that machine.",
      steps: [
        "Run docker version. If it cannot reach a daemon, start Docker Desktop or the engine and try again. Do not prefix every command with sudo unless you understand that sudo docker is root on the host.",
        "Write a Dockerfile whose only job is FROM eclipse-temurin:21-jre and an exec-form CMD of java and -version. Build it as java-version:local and run it with --rm.",
        "In a second terminal, start a publish-port experiment: docker run --rm -p 127.0.0.1:8080:8080 python:3.12-alpine python -m http.server 8080 --bind 127.0.0.1. From the host, curl http://127.0.0.1:8080 and record the failure. Stop the container.",
        "Repeat the run with --bind 0.0.0.0. curl again and record the success. Stop the container.",
        "Run docker image ls --digests on java-version:local and write one sentence on how the tag differs from the digest. Do not run docker system prune.",
      ],
      criteria: [
        "The Dockerfile uses the exec form, not a shell string.",
        "The loopback bind is unreachable from the host; the 0.0.0.0 bind answers on the published port.",
        "You can point at a digest in docker image ls --digests.",
        "You did not remove volumes and you did not prune the engine.",
        "You can say, in one sentence, that the lesson site did not run the container.",
      ],
    },
    checks: [
      {
        q: "Why is a container not a security boundary by itself?",
        a: "It shares the host kernel. Namespaces and cgroups isolate processes, but a kernel exploit, --privileged, or a mounted Docker socket can reach the host.",
      },
      {
        q: "What is the difference between a tag and a digest?",
        a: "A tag is a movable label. A digest is the content hash. Production should pull by digest because a tag can be overwritten.",
      },
      {
        q: "What does -p 127.0.0.1:8080:8080 mean, and why can it still fail?",
        a: "It publishes host loopback port 8080 to port 8080 in the container. It still fails if the app inside listens only on the container's own 127.0.0.1.",
      },
      {
        q: "How do shell form and exec form differ for docker stop?",
        a: "Shell form runs the command under /bin/sh -c, so PID 1 is the shell and SIGTERM may never reach Java. Exec form runs Java as PID 1, which is what Spring Boot's graceful shutdown expects.",
      },
    ],
    interview: [
      {
        q: "Compare a VM and a container for a Spring Boot service.",
        a: "The VM has its own kernel and a heavier image. The container packages the JRE and the jar as layers and shares the host kernel, so it starts quickly and isolates less. You still need non-root, resource limits, and a private network. The container is not the security model on its own.",
      },
      {
        q: "A developer says EXPOSE 8080 published the port. What do you correct?",
        a: "EXPOSE is metadata. Publishing is -p on docker run or the ports key in Compose. The process must also bind to 0.0.0.0, not to loopback inside the container.",
      },
      {
        q: "When do you choose a named volume instead of a bind mount?",
        a: "Use a named volume for data that must survive container replacement, such as Postgres files, managed by Docker. Use a bind mount for local source or a host path you explicitly administer. Do not bind-mount the Docker socket into an app.",
      },
    ],
    takeaways: [
      "Containers share the host kernel. They are not VMs and not a complete security boundary.",
      "An image is immutable layers. A container is a running instance. A registry stores images. Tags move; digests do not.",
      "EXPOSE does not publish a port. -p maps host:container, and the app must listen on 0.0.0.0.",
      "Use exec form so Java is PID 1 and receives SIGTERM. Shell form wraps /bin/sh -c.",
      "docker rm deletes the writable layer. The docker group is root-equivalent. This site does not run the engine for you.",
    ],
  },
  {
    slug: "optimized-dockerfile",
    title: "An optimized Spring Boot Dockerfile",
    status: "full",
    blocks: [
      {
        type: "h2",
        text: "Build tools do not belong in the runtime image",
      },
      {
        type: "p",
        text: "A single-stage Dockerfile that starts FROM a JDK, copies the repo, and runs Maven ships the compiler, the build cache, and often the source in the image you deploy. A multi-stage build uses a build stage to produce target/app.jar and a runtime stage that copies only that jar onto a JRE. The runtime process is a non-root user. The sample targets Java 21 and the Spring Boot 3.x executable jar from the Maven lesson (finalName app, jakarta.* in the application). It was not built in this environment. Verify every base image tag against current official docs, and pin digests before production.",
      },
      {
        type: "code",
        lang: "dockerfile",
        title: "Dockerfile",
        note: "Illustrative. Not built in this environment. Verify image tags against current official docs.",
        code: `FROM eclipse-temurin:21-jdk AS build
WORKDIR /src
COPY .mvn/ .mvn/
COPY mvnw pom.xml ./
RUN chmod +x mvnw && ./mvnw -B -DskipTests dependency:go-offline
COPY src ./src
RUN ./mvnw -B -DskipTests package

FROM eclipse-temurin:21-jre
RUN groupadd --system app && useradd --system --gid app --uid 10001 --no-create-home --shell /usr/sbin/nologin app
WORKDIR /app
COPY --from=build --chown=app:app /src/target/app.jar /app/app.jar
USER app
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "/app/app.jar"]`,
      },
      {
        type: "p",
        text: "The first FROM names the stage build. WORKDIR /src is where Maven runs. COPY .mvn/ and the wrapper plus pom.xml happen before COPY src so the dependency layer can stay cached when only Java files change. chmod +x covers a checkout that dropped the executable bit. ./mvnw -B -DskipTests dependency:go-offline resolves dependencies in that layer. -DskipTests here is acceptable because this image build assumes tests already ran in CI; do not use this Dockerfile as the only test gate. The second ./mvnw package produces target/app.jar via the Spring Boot plugin and finalName. The runtime FROM throws away the JDK stage except for the files you copy. groupadd and useradd create uid 10001. COPY --chown makes the jar readable by that user. USER app applies to the container process. EXPOSE documents 8080. The exec-form ENTRYPOINT starts Java as PID 1.",
      },
      {
        type: "h2",
        text: "Layer cache and dockerignore",
      },
      {
        type: "p",
        text: "Docker reuses a layer when the instruction and its inputs are unchanged. A single COPY . . followed by Maven invalidates that COPY on every source edit, so the following RUN downloads dependencies again. Copying the POM and wrapper first makes the download layer depend on dependency files only. Editing a Java file then rebuilds the compile layer and reuses the download. dependency:go-offline is the right shape and not a perfect mirror: some plugin dependencies are still fetched during package. Expect an occasional network call. If the repo has no Maven Wrapper, replace the build stage with a Maven base image whose tag you have verified, and accept that the image tag is a less precise pin than the wrapper properties.",
      },
      {
        type: "code",
        lang: "text",
        title: ".dockerignore",
        code: `.git
.github
target
.idea
*.iml
.env`,
      },
      {
        type: "p",
        text: ".dockerignore is applied to the build context before COPY. Excluding .git keeps history out of the daemon. Excluding target avoids copying a laptop-built jar over the one Maven produces, and avoids sending a large directory. Excluding .env is a last line of defense so a local secret file is not sitting in the context. Do not ignore pom.xml, mvnw, .mvn, or src. A later COPY . . would still be a cache-buster and would copy anything you forgot to ignore, including a credential file. Prefer explicit COPY lines.",
      },
      {
        type: "callout",
        tone: "danger",
        title: "Do not pass secrets as ARG or ENV",
        text: "ARG is for build-time values such as a mirror URL, not for a registry password. A RUN step that reads the ARG can leave the value in layer history. ENV is worse for runtime secrets: docker inspect shows it, and the image config keeps it. Use a short-lived mount the builder does not commit, or inject the secret at runtime from the environment of the orchestrator. Never commit a real password in the Dockerfile.",
      },
      {
        type: "table",
        caption: "Dockerfile anti-patterns",
        headers: ["Pattern", "What it costs"],
        rows: [
          ["FROM something:latest", "The base moves. Rebuilds are not reproducible."],
          ["Running as root", "A container escape starts with host-level power more often."],
          ["Secrets in ENV or ARG", "They remain in image config or build history."],
          ["apt-get update in one RUN and rm of the lists in a later RUN", "The lists stay in the earlier layer. The image does not shrink."],
          ["COPY . . then mvn package", "Any source change reruns dependency download."],
          ["A JDK image as the runtime", "Compiler and build tools ship to production for no runtime need."],
        ],
      },
      {
        type: "p",
        text: "If you install OS packages, put apt-get update, the install, and the removal of /var/lib/apt/lists in the same RUN. A delete in a later layer does not remove bytes from the previous layer. The runtime stage here does not install packages, which is the smaller outcome. Image size is not a vanity metric. The JDK, Maven, and source are extra code with CVEs you would have to patch. The JRE stage still contains a full distribution; that is a conscious tradeoff so the image stays understandable. A distroless or minimal JRE is a later tightening, not a requirement to ship the first service.",
      },
      {
        type: "ul",
        items: [
          "Tests belong in CI before docker build, or in a target that fails the pipeline. -DskipTests inside the image build must not be the only test run.",
          "The jar path matches finalName app. If you drop finalName, the COPY path must use the versioned filename instead.",
          "USER is a name that exists in the image. A numeric USER with no account can confuse tools that look up a home directory.",
          "The example was not executed here. Build it on your laptop only if the engine is installed.",
        ],
      },
      {
        type: "h3",
        text: "Which jar gets copied",
      },
      {
        type: "p",
        text: "spring-boot-maven-plugin repackages the archive in place. With finalName set to app, the file the runtime stage must copy is /src/target/app.jar, the executable one. app.jar.original, when the plugin leaves it, is the thin jar and will not boot with java -jar. COPY --chown=app:app requires the account to exist already, which is why useradd is earlier in the same stage. The default COPY mode is readable by the owner. Do not chmod the jar to world-writable to paper over a USER that does not exist. The Maven version is the one pinned by the wrapper properties you copied in .mvn, not whatever Maven happens to be on the developer laptop. Verify that wrapper version and the Temurin tags against current official docs.",
      },
      {
        type: "callout",
        tone: "info",
        title: "This site does not build the image",
        text: "Docker Desktop or the engine has to be installed on your machine. Pulling eclipse-temurin requires network access and you should confirm the tag. Nothing in the lesson environment ran docker build.",
      },
    ],
    exercise: {
      title: "Write a two-stage Dockerfile",
      prompt: "Add a Dockerfile and .dockerignore next to a Spring Boot 3 Maven project that packages target/app.jar. Building is optional and only works if Docker is installed. This site does not build or run the image.",
      steps: [
        "Confirm the POM sets finalName to app and uses Java 21. Run mvn -B -DskipTests package only after unit tests have already passed in a previous command.",
        "Write the two-stage Dockerfile from the lesson. The runtime stage must create a non-root user and switch to it. Do not add an ARG or ENV that holds a password.",
        "Write .dockerignore that excludes .git, target, and .env and does not exclude src or pom.xml.",
        "If the engine is installed, docker build -t orders:local . and confirm the image exists with docker image ls. If the engine is not installed, skip the build and say so in your notes.",
        "Read docker history orders:local if you built it. Confirm the runtime layers do not contain a Maven download as the process you ship. Do not run docker system prune.",
      ],
      criteria: [
        "Two stages: a JDK build stage and a JRE runtime stage.",
        "pom.xml and the wrapper are copied before src.",
        "The runtime user is not root, and the entrypoint is exec form.",
        "No secret appears in ENV or ARG.",
        ".dockerignore excludes .git and .env. You did not claim the lesson site built the image.",
      ],
    },
    checks: [
      {
        q: "Why copy pom.xml and download dependencies before copying src?",
        a: "The dependency layer stays cached when only application source changes. COPY . . first invalidates that cache on every edit.",
      },
      {
        q: "Why is the runtime stage a JRE image with a non-root user?",
        a: "The running service does not need the compiler or Maven. A non-root user limits what a container escape can do compared with root in the container.",
      },
      {
        q: "Where does an ARG secret go wrong?",
        a: "Build history and the cache can retain it even when the variable is not a runtime ENV. Pass secrets at runtime, or use a mount that is not committed into a layer.",
      },
      {
        q: "What does deleting apt lists in a second RUN fail to do?",
        a: "It does not shrink the earlier layer that added the lists. Update, install, and cleanup must be the same RUN instruction.",
      },
    ],
    interview: [
      {
        q: "Walk through this multi-stage Dockerfile from the first FROM to the process that runs in production.",
        a: "The build stage uses a JDK and the Maven Wrapper, resolves dependencies from the POM before source is copied, and packages app.jar. The runtime stage starts from a JRE, creates a system user, copies only that jar, and runs it with exec-form java -jar as that user. The JDK and the Maven cache are not in the final image.",
      },
      {
        q: "CI already ran tests. Why is -DskipTests inside docker build still a risk?",
        a: "The image build is now a second entry point. Someone will run it without CI. Keep the test gate on the pipeline, and do not describe the image build as the test suite.",
      },
      {
        q: "Which anti-patterns would you reject in a pull request?",
        a: "latest as the base tag, a root runtime user, a password in ENV or ARG, apt lists cleaned in a later layer, and a single COPY . . before Maven downloads dependencies.",
      },
    ],
    takeaways: [
      "Multi-stage builds compile with a JDK and ship a JRE plus the executable jar, as a non-root user.",
      "Copy the POM and download dependencies before source so the layer cache survives Java edits.",
      "Do not put secrets in ARG or ENV. Do not rely on a later RUN to shrink an earlier layer.",
      ".dockerignore keeps .git, local target/, and .env out of the build context.",
      "The Dockerfile is illustrative and was not built here. Verify base tags, then pin digests in production.",
    ],
  },
  {
    slug: "docker-compose-postgres",
    title: "Compose with Postgres",
    status: "full",
    blocks: [
      {
        type: "h2",
        text: "Two processes, one network",
      },
      {
        type: "p",
        text: "Compose starts multiple containers from one file and puts them on a user-defined network. The hostname of each container is its service name. The app connects to postgres, not to localhost. The file below is Compose V2 syntax (compose.yaml, no version key). depends_on with condition: service_healthy waits until the database healthcheck passes; that behavior requires Compose V2. This site does not run Compose. You need Docker Desktop or the engine installed locally. The password in the file is a placeholder for a laptop, not a secret you may reuse.",
      },
      {
        type: "code",
        lang: "yaml",
        title: "compose.yaml",
        note: "Illustrative. Not started in this environment. Verify the Postgres tag against current official docs.",
        code: `services:
  postgres:
    image: postgres:16
    environment:
      POSTGRES_USER: app
      POSTGRES_PASSWORD: change-me-local-only
      POSTGRES_DB: app
    volumes:
      - pgdata:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U app -d app"]
      interval: 5s
      timeout: 3s
      retries: 10
      start_period: 10s
    ports:
      - "127.0.0.1:5432:5432"
  app:
    image: app:local
    depends_on:
      postgres:
        condition: service_healthy
    environment:
      SPRING_DATASOURCE_URL: jdbc:postgresql://postgres:5432/app
      SPRING_DATASOURCE_USERNAME: app
      SPRING_DATASOURCE_PASSWORD: change-me-local-only
    ports:
      - "127.0.0.1:8080:8080"
volumes:
  pgdata:`,
      },
      {
        type: "p",
        text: "postgres uses the official Postgres image. POSTGRES_USER, POSTGRES_PASSWORD, and POSTGRES_DB are read only when the data directory is empty. The named volume pgdata is mounted at /var/lib/postgresql/data, so the files survive docker compose down. They do not survive docker compose down -v. The healthcheck runs pg_isready inside the database container. CMD-SHELL means the image's shell runs that command. pg_isready checks that the server accepts connections as user app to database app. It does not check the password. interval, timeout, retries, and start_period give init time before failures count. ports publishes Postgres on the laptop loopback only.",
      },
      {
        type: "callout",
        tone: "danger",
        title: "Do not commit a real password, and do not publish 5432 in production",
        text: "change-me-local-only is a placeholder so the file runs on a laptop. A real password does not belong in git. Use a gitignored env file or the secret store your platform provides, and rotate anything that was committed. The ports entry for 5432 is for local debugging. A production Compose file, and any cloud host, should omit it so the database is reachable only on the Compose network. Binding 0.0.0.0:5432 exposes Postgres to every interface on the machine.",
      },
      {
        type: "h2",
        text: "What Spring Boot reads",
      },
      {
        type: "p",
        text: "Spring Boot 3 maps environment variables onto properties by relaxed binding. SPRING_DATASOURCE_URL sets spring.datasource.url, SPRING_DATASOURCE_USERNAME sets the username, and SPRING_DATASOURCE_PASSWORD sets the password. You can put the same keys in application.yml; the environment wins when both are set. The hostname inside the JDBC URL must be the service name postgres. localhost inside the app container is the app container, so the connection is refused even when Postgres is healthy on the network. The JDBC driver class is org.postgresql.Driver from the PostgreSQL driver artifact, scoped runtime in Maven. Application code stays on jakarta.*, not javax.*. Verify the binding names against the Spring Boot 3 version you run.",
      },
      {
        type: "code",
        lang: "yaml",
        title: "application.yml",
        code: `# Password is not stored here.
# SPRING_DATASOURCE_PASSWORD in the environment maps onto spring.datasource.password.
server:
  port: 8080
management:
  endpoints:
    web:
      exposure:
        include: health
spring:
  datasource:
    url: jdbc:postgresql://postgres:5432/app
    username: app
    driver-class-name: org.postgresql.Driver
  jpa:
    open-in-view: false`,
      },
      {
        type: "p",
        text: "Add spring-boot-starter-actuator so /actuator/health exists. Expose health only. include: \"*\" turns on every actuator endpoint and is not a local-development shortcut you want copied to production. A smoke test after startup is an HTTP GET of /actuator/health expecting status UP. depends_on does not keep working if Postgres restarts later. The pool can still fail at runtime. A startup race is reduced by service_healthy; it is not removed for the rest of the process lifetime. HikariCP, which Spring Boot uses, fails fast if the database is down at startup unless you configure retries. service_healthy is why the app container waits. It is not a retry library.",
      },
      {
        type: "h2",
        text: "When the connection fails",
      },
      {
        type: "table",
        caption: "Symptoms on a laptop Compose stack",
        headers: ["Symptom", "Cause", "What to change"],
        rows: [
          ["Connection refused to localhost:5432", "JDBC host is localhost, so the app dials itself", "Use hostname postgres in the JDBC URL"],
          ["Connection refused to postgres:5432", "App started before Postgres accepted connections", "depends_on condition service_healthy, and confirm the healthcheck is actually passing"],
          ["password authentication failed", "Volume was initialized with a different password, or the app env does not match POSTGRES_PASSWORD", "Align the passwords. For disposable data only, recreate the volume"],
          ["Postgres healthy, app still fails auth", "pg_isready does not test the password", "Compare POSTGRES_PASSWORD and SPRING_DATASOURCE_PASSWORD"],
          ["Role or database does not exist", "POSTGRES_DB or POSTGRES_USER changed after the volume was created", "Those variables apply on first init. A new name needs a new volume or SQL you run yourself"],
          ["Port 5432 already allocated", "Another Postgres is bound on the host", "Stop the other one or change the host side of the ports mapping"],
        ],
      },
      {
        type: "code",
        lang: "text",
        title: "The localhost mistake",
        note: "Illustrative output — not captured from a live run in this environment.",
        code: `org.postgresql.util.PSQLException: Connection to localhost:5432 refused.
Check that the hostname and port are correct and that the postmaster is accepting TCP/IP connections.`,
      },
      {
        type: "p",
        text: "The named volume is why a password change appears to do nothing. Postgres initializes the cluster once. Later container starts do not reset the role password from the environment. If the data is junk from a tutorial, docker compose down -v removes the containers, the network, and the volume. That delete is permanent. If the data matters, do not use -v; change the role password with SQL inside the running server and then update the app environment to match. docker compose down without -v keeps pgdata.",
      },
      {
        type: "callout",
        tone: "warn",
        title: "down -v deletes the database",
        text: "docker compose down stops and removes containers and the network. Adding -v also removes named volumes declared in the file. That is the Postgres data directory. Do not run it against a volume you need. Do not run docker system prune --volumes as a cleanup shortcut. The engine must be installed on your laptop. This site does not start these containers.",
      },
      {
        type: "ul",
        items: [
          "Service DNS: the app and the database share the Compose network, so the host is postgres.",
          "Health of the database container is pg_isready, not a Spring endpoint. Health of the app is /actuator/health.",
          "Publish 5432 only to 127.0.0.1, and only on a laptop. Omit the ports key in production.",
          "Build app:local from the optimized Dockerfile before Compose can start the app service. You can still start postgres alone.",
        ],
      },
    ],
    exercise: {
      title: "Bring Postgres up with Compose",
      prompt: "Write compose.yaml and application.yml on your laptop. Starting the stack requires Docker Desktop or the engine. This site does not run it. Use the placeholder password only.",
      steps: [
        "Copy the lesson compose.yaml. Keep the password as change-me-local-only. Bind host ports to 127.0.0.1, not 0.0.0.0.",
        "Write application.yml with the JDBC host postgres, no password in the file, and actuator health exposed.",
        "If Docker is installed, run docker compose up -d postgres. Wait until docker compose ps shows the database as healthy. If it stays unhealthy, read docker compose logs postgres.",
        "Run docker compose down without -v. Confirm you understand that -v would delete pgdata. Do not run prune.",
        "In a few sentences, explain connection refused to localhost, a password mismatch caused by an old volume, and why production must not publish 5432.",
      ],
      criteria: [
        "The JDBC hostname is postgres, not localhost.",
        "depends_on uses condition: service_healthy.",
        "The password is the published placeholder, not a real secret, and it is absent from application.yml.",
        "Host port 5432 is bound to 127.0.0.1 in the laptop file, and your notes say to omit that mapping in production.",
        "You did not delete a volume you needed, and you can state that the lesson site did not start the containers.",
      ],
    },
    checks: [
      {
        q: "Why does jdbc:postgresql://localhost:5432/app fail inside the app container?",
        a: "localhost is the app container's loopback, not the Postgres container and not your laptop. The Compose DNS name is the service name postgres.",
      },
      {
        q: "What does depends_on condition service_healthy wait for?",
        a: "The Postgres healthcheck, pg_isready in this file, not merely the container process starting. That requires Compose V2. pg_isready does not verify the password.",
      },
      {
        q: "Why does changing POSTGRES_PASSWORD appear to do nothing?",
        a: "The official image applies that variable only when the data directory is first initialized. An existing named volume keeps the old role password.",
      },
      {
        q: "When is publishing port 5432 acceptable?",
        a: "On a laptop, bound to 127.0.0.1, for debugging. Omit the ports mapping in production so the database stays on the Compose network.",
      },
    ],
    interview: [
      {
        q: "Describe how the Spring Boot container finds Postgres in this Compose file.",
        a: "Both services share the Compose network. The JDBC URL uses hostname postgres, which resolves to the database service. The password comes from SPRING_DATASOURCE_PASSWORD. depends_on waits until pg_isready succeeds so the app does not start during the initial accept-connections window.",
      },
      {
        q: "A teammate wants to commit the production database password in compose.yaml so deploys are repeatable. What do you do?",
        a: "Refuse. Repeatability comes from the variable name and the secret store, not from the secret in git. Use a placeholder only for local files, gitignore real env files, and rotate any password that was committed.",
      },
      {
        q: "Postgres is healthy and the app still logs a password error. What do you check, and what do you not delete?",
        a: "Compare the app password with the password the volume was initialized with. pg_isready will not catch a mismatch. Do not docker compose down -v if the data is worth keeping. Change the role with SQL or, only for disposable local data, recreate the volume on purpose.",
      },
    ],
    takeaways: [
      "Compose DNS uses the service name. The JDBC host is postgres, never localhost, from inside the app container.",
      "service_healthy plus pg_isready orders startup. It does not prove the password, and it does not retry the pool forever.",
      "POSTGRES_PASSWORD applies on first init of the named volume. An old volume keeps the old password.",
      "The sample password is a laptop placeholder. Do not commit real passwords. Do not publish 5432 except on loopback for local debugging.",
      "docker compose down -v deletes pgdata. The engine runs on your machine. This site does not start it.",
    ],
  },
  {
    slug: "container-security",
    title: "Container security basics",
    status: "primer",
    blocks: [
      {
        type: "h2",
        text: "The defaults are a developer convenience",
      },
      {
        type: "p",
        text: "A container that runs as root, with a writable root filesystem, every default capability, no memory limit, and the Docker socket mounted is a process with extra powers. The fundamentals lesson said the shared kernel is not a security boundary. These are the first controls that make the boundary less fictional. They do not replace patching, scanning, or keeping secrets out of images.",
      },
      {
        type: "h3",
        text: "Non-root and a read-only root filesystem",
      },
      {
        type: "p",
        text: "USER in the image, or --user at run time, should be a uid that is not 0. A non-root process cannot rewrite files owned by root inside the image and has a harder time using privileges the kernel grants only to root. A read-only root filesystem (--read-only) blocks writes to that image entirely. The JVM and Spring Boot write temporary files, often under /tmp, and some libraries write a work directory. Give them a tmpfs mount for /tmp and nowhere else until a real path shows up in the error. Dropping --read-only because the first start failed throws away the control. Add the specific mount.",
      },
      {
        type: "ul",
        items: [
          "Drop capabilities. Start from --cap-drop ALL and add back only a capability you can name. A typical HTTP service needs none of SYS_ADMIN.",
          "--security-opt no-new-privileges stops a process from gaining privileges through setuid files.",
          "Do not pass --privileged. It is the opposite of these controls.",
          "Pin production images by digest. A tag is a label someone can move.",
          "Never mount the Docker socket into an application container. The socket is control of the daemon, which is root on the host in the usual install.",
          "Set memory and cpu limits so one leak cannot consume the node. On docker run the flags are --memory and --cpus.",
          "A restart policy brings a process back. It is not high availability, and always on a crashing container is a loop.",
          "The default json-file log driver grows until the disk is full. Cap the size.",
        ],
      },
      {
        type: "code",
        lang: "bash",
        title: "A tighter docker run",
        code: `docker run --rm --read-only --tmpfs /tmp:rw,noexec,nosuid,size=64m --cap-drop ALL --security-opt no-new-privileges --memory 512m --cpus 1 --log-opt max-size=10m --log-opt max-file=3 -p 127.0.0.1:8080:8080 app:local`,
      },
      {
        type: "p",
        text: "Read that line as a checklist, not a spell. --read-only plus a tmpfs on /tmp covers the JVM's temporary files. If the app exits because it cannot write somewhere else, mount that path, do not remove --read-only blindly. --cap-drop ALL is safe for a normal Spring Boot jar; if you drop capabilities and a legitimate feature fails, add the one capability back and record why. --memory 512m and --cpus 1 are example limits, not sizing advice. Pick them from the service's actual use and leave headroom for the JVM heap plus non-heap memory, or the process will be killed by the cgroup. In Compose, resource limit fields have varied between Swarm and plain Compose. Confirm in the current Compose specification that your engine enforces the field you set. A file that looks limited and is not is worse than an obvious gap.",
      },
      {
        type: "h3",
        text: "Scanning, digests, and restart policy",
      },
      {
        type: "p",
        text: "Trivy is a scanner you point at an image (trivy image app:local) to list known CVEs in OS packages and in some language dependencies. A report is a queue of upgrades, not a certificate. It will miss application bugs, logic flaws, and anything not in its database. Generating an SBOM and signing images are the next supply-chain steps; this primer does not teach them. Pin the base image to a digest you copied from the publisher's official channel, and rebuild on a schedule so the pin does not freeze you on a vulnerable JRE. Restart policies are no, on-failure, always, and unless-stopped. on-failure restarts non-zero exits and can cap the count. always restarts even after a daemon reboot, including a process that crashes immediately. Use it only when a human stop should not stick, and watch for crash loops. Log options max-size and max-file keep the json-file driver from filling the disk. A full disk stops every container on that node, including the database.",
      },
      {
        type: "callout",
        tone: "danger",
        title: "docker system prune can delete data",
        text: "docker system prune removes stopped containers, unused networks, and dangling images. Adding -a removes images not referenced by a container. Adding --volumes removes unused volumes. Unused means no container currently references them, not that the bytes are unimportant. A Postgres volume whose container you just removed is unused and will be deleted. Run docker system df, name the thing you are removing, and do not prune a shared engine as a reflex. This is destructive and there is no trash folder.",
      },
      {
        type: "table",
        caption: "Control and the failure it addresses",
        headers: ["Control", "Failure it limits"],
        rows: [
          ["Non-root user", "Writes and capabilities that require uid 0 inside the container"],
          ["Read-only root plus tmpfs /tmp", "Runtime modification of the image contents"],
          ["cap-drop and no --privileged", "Kernel features a normal JVM does not need"],
          ["No Docker socket mount", "Host takeover through the daemon"],
          ["Memory and CPU limits", "One process exhausting the node"],
          ["Digest pin and a scanner such as Trivy", "Running whatever a tag points at, and known CVEs you chose not to look at"],
          ["Log size cap", "json-file logs filling the disk"],
        ],
      },
      {
        type: "callout",
        tone: "warn",
        title: "The socket and privileged mode are host access",
        text: "Mounting the Docker socket into an app, or running --privileged, hands that container the ability to start other containers and mount the host filesystem. Do not do either for a Spring Boot service. The lesson site does not run Docker. Anything you try belongs on your own engine, after you can say which volumes exist.",
      },
    ],
    exercise: null,
    checks: [
      {
        q: "Why does a read-only root filesystem need a tmpfs on /tmp for a JVM?",
        a: "The JVM and many libraries write temporary files under /tmp. Without a writable mount those writes fail. The fix is the mount, not dropping --read-only entirely.",
      },
      {
        q: "What does docker system prune --volumes remove, and why is that dangerous?",
        a: "Volumes no container currently references, including database data whose container was removed. Unused does not mean disposable. The delete is permanent.",
      },
    ],
    interview: [
      {
        q: "What controls do you put on a Spring Boot container before calling it hardened enough for a first production deploy?",
        a: "Non-root user, read-only root with a tmpfs for /tmp, dropped capabilities, no privileged mode, no Docker socket, memory and cpu limits, a digest pin, a vulnerability scan you actually read, a restart policy that will not hide a crash loop, and log rotation. State that scanning is not an SBOM program and that the shared kernel remains a limit.",
      },
    ],
    takeaways: [
      "Run as non-root, drop capabilities, and do not mount the Docker socket or use --privileged.",
      "A read-only root filesystem needs an explicit writable tmpfs for paths the JVM actually writes, usually /tmp.",
      "Pin digests, scan images with a tool such as Trivy, cap logs and memory, and treat docker system prune --volumes as data loss.",
    ],
  },
];
