import type { Lesson } from "../types";

export const lessons: Lesson[] = [
  {
    slug: "maven-build-lifecycle",
    title: "Maven build lifecycle",
    status: "full",
    blocks: [
      {
        type: "h2",
        text: "Why a build exists",
      },
      {
        type: "p",
        text: "Source is not what you run. A build resolves dependencies, compiles, tests, and packages one artifact other systems can fetch by coordinates. Maven is the usual build tool for Java services on this track: Java 21 and Spring Boot 3.x, with jakarta.* imports rather than javax.*. The parent version in the sample is a 3.5 patch so the XML is concrete. Verify that patch, the plugin versions it manages, and the JDK against current official docs before you copy them into a repository. Spring Boot 3 requires Java 17 or newer; this track uses 21.",
      },
      {
        type: "h2",
        text: "Coordinates and a minimal POM",
      },
      {
        type: "p",
        text: "pom.xml is the project object model. groupId is the organization namespace, artifactId is the name of this module, and version is the release you are building. Together they are the coordinates other builds use to depend on you. packaging defaults to jar. spring-boot-starter-parent is a parent POM: it sets the Java release, dependency versions, and plugin versions so you do not repeat them. A starter dependency omits version because the parent manages it. That is a pin, inherited from the parent version you chose. Changing the parent is how you move the whole stack.",
      },
      {
        type: "code",
        lang: "xml",
        title: "pom.xml",
        code: `<project xmlns="http://maven.apache.org/POM/4.0.0">
  <modelVersion>4.0.0</modelVersion>
  <parent>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-parent</artifactId>
    <version>3.5.16</version>
  </parent>
  <groupId>com.example</groupId>
  <artifactId>orders</artifactId>
  <version>0.1.0</version>
  <properties>
    <java.version>21</java.version>
  </properties>
  <dependencies>
    <dependency>
      <groupId>org.springframework.boot</groupId>
      <artifactId>spring-boot-starter-web</artifactId>
    </dependency>
    <dependency>
      <groupId>org.springframework.boot</groupId>
      <artifactId>spring-boot-starter-test</artifactId>
      <scope>test</scope>
    </dependency>
  </dependencies>
  <build>
    <finalName>app</finalName>
    <plugins>
      <plugin>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-maven-plugin</artifactId>
      </plugin>
    </plugins>
  </build>
</project>`,
      },
      {
        type: "p",
        text: "finalName app makes the packaged file target/app.jar instead of orders-0.1.0.jar. Later container lessons copy that stable path. Application code for this stack imports jakarta.servlet and jakarta.persistence, not javax.*. A javax import is a sign the snippet targets Spring Boot 2.",
      },
      {
        type: "h2",
        text: "Lifecycles, phases, and goals",
      },
      {
        type: "p",
        text: "Maven has lifecycles. The default lifecycle is the one you use every day. Invoking a phase runs that phase and every earlier phase in the same lifecycle. mvn package therefore validates, compiles, tests, and then packages. If tests fail, Maven stops and returns non-zero; the jar from this run is not produced. There are phases between the ones operators memorize, including process-resources, test-compile, and integration-test. The names to remember are validate, compile, test, package, verify, install, and deploy.",
      },
      {
        type: "table",
        caption: "Default lifecycle phases you will type",
        headers: ["Phase", "What it is for"],
        rows: [
          ["validate", "POM is readable and required information is present"],
          ["compile", "Main sources compiled to target/classes"],
          ["test", "Unit tests compiled and run (Surefire). Failure stops the build"],
          ["package", "Compiled output packed into the jar or war"],
          ["verify", "Integration checks bound here, including Failsafe, after the package exists"],
          ["install", "Copy the artifact into the local ~/.m2 repository"],
          ["deploy", "Upload the artifact to a remote repository. Not a laptop default"],
        ],
      },
      {
        type: "p",
        text: "A goal is one plugin task, written plugin:goal, such as dependency:tree or surefire:test. A phase is a named slot in the lifecycle. Plugins bind goals to phases: the compiler binds to compile, Surefire binds to test, the jar plugin binds to package, and spring-boot-maven-plugin binds a repackage goal so the jar becomes executable. mvn test runs the test phase (and everything before it). mvn compiler:compile runs that goal only, which is why it can surprise you by skipping resource processing you expected. Prefer phases in CI. Use a single goal when you are inspecting, not shipping.",
      },
      {
        type: "h2",
        text: "Scopes, plugins, and repositories",
      },
      {
        type: "ul",
        items: [
          "compile (the default): on the compile, test, and runtime classpaths, and transitive to dependents. It is not copied inside a plain jar unless a packaging plugin does that.",
          "test: only for compiling and running tests. Not shipped in the application package and not transitive to dependents. JUnit belongs here.",
          "provided: compile and test classpath, but you expect the runtime (a servlet container, or the JDK) to supply it. Not packaged by a plain war/jar plugin.",
          "runtime: not required to compile, required to run and to test. JDBC drivers are the usual example.",
          "Plugins are build tools, not application libraries. The compiler, Surefire, Failsafe, and spring-boot-maven-plugin are plugins.",
          "Dependencies download from repositories. Maven Central is the default public one. A company registry (Nexus or Artifactory) usually proxies Central. Credentials belong in settings.xml or the CI secret store, not in the committed POM.",
        ],
      },
      {
        type: "h2",
        text: "SNAPSHOT, JAR, WAR, and the executable jar",
      },
      {
        type: "p",
        text: "A version ending in -SNAPSHOT is mutable. Maven will look for newer builds of 0.1.0-SNAPSHOT. A release version such as 0.1.0 is immutable by contract: once published, those bytes stay. Never rebuild different code under a release version that already shipped. Use SNAPSHOT only for unpublished work, and do not deploy a SNAPSHOT from a release pipeline that claims to be reproducible.",
      },
      {
        type: "p",
        text: "A plain JAR is a zip of classes, suitable for a library. A WAR is the layout a traditional servlet container expands. A Spring Boot service wants an executable jar. spring-boot-maven-plugin repackages the archive: nested dependencies, a start-up loader, and a Main-Class manifest entry so java -jar target/app.jar boots the application. The plugin can leave the thin jar beside it as app.jar.original. Publish and run the repackaged file, not the thin one. java -jar on the thin jar fails because the dependencies are not inside it.",
      },
      {
        type: "h3",
        text: "The command CI should run",
      },
      {
        type: "p",
        text: "mvn -B test package is the unit-test-then-jar command. -B (batch mode) never asks a question and avoids progress bars that corrupt logs. The test phase runs Surefire unit tests. package builds the jar only if earlier phases succeeded. Failsafe integration tests bind to integration-test and verify, so this command does not run them. -DskipITs sets the property Failsafe uses to skip integration tests; it does not skip Surefire. Use mvn -B -DskipITs test package when the POM also binds Failsafe early or when you want the property recorded in the log. Do not pass -DskipTests on the pipeline that exists to test. -DskipTests skips execution. maven.test.skip also skips compiling tests, which hides broken tests. Verify the Failsafe property name against the plugin version your parent manages.",
      },
      {
        type: "code",
        lang: "bash",
        title: "Batch test and package",
        code: `mvn -B -DskipITs test package`,
      },
      {
        type: "code",
        lang: "text",
        title: "What a successful log looks like",
        code: `[INFO] Building orders 0.1.0
[INFO] --- compiler:3.13.0:compile (default-compile) @ orders ---
[INFO] --- surefire:3.2.5:test (default-test) @ orders ---
[INFO] Tests run: 2, Failures: 0, Errors: 0, Skipped: 0
[INFO] --- spring-boot:3.5.16:repackage (repackage) @ orders ---
[INFO] Building jar: target/app.jar
[INFO] BUILD SUCCESS`,
        note: "Illustrative output — not captured from a live run in this environment.",
      },
      {
        type: "callout",
        tone: "info",
        title: "The local cache is ~/.m2",
        text: "Resolved artifacts land in ~/.m2/repository on the machine that ran Maven. The next build reuses them. A truncated download surfaces later as a zip error. Delete that one artifact directory and let Maven fetch it again. Do not wipe the whole cache unless you accept a full re-download. Purging the local repository with a plugin goal is the same kind of hammer.",
      },
      {
        type: "callout",
        tone: "warn",
        title: "install and deploy write somewhere",
        text: "mvn install copies the artifact into your ~/.m2 so other local builds can depend on it. mvn deploy uploads it to the remote repository in distributionManagement. Do not run deploy from a laptop experiment against a shared registry. CI should publish once, from the commit you tagged, with credentials injected as secrets.",
      },
      {
        type: "p",
        text: "Reproducible here means a later build of the same commit resolves the same coordinates. Pin the parent version. Do not use version ranges. Do not depend on a SNAPSHOT for a release. Commit the Maven Wrapper if you need a fixed Maven binary rather than whatever is on the agent. Maven has no single standard lockfile the way npm does; the POM plus a registry that does not rewrite release bytes is the pin. A CI cache of ~/.m2 speeds the download. It is not the pin. If the cache is corrupt, the build should still be able to resolve the same versions from the registry.",
      },
    ],
    exercise: {
      title: "Run the default lifecycle on a small POM",
      prompt: "Install a JDK 21 and Maven (or the Maven Wrapper). Free tooling only. This site does not compile the project for you. Verify the Spring Boot 3.x patch against current official docs before you treat the sample version as current.",
      steps: [
        "Create a directory with the lesson POM. Confirm groupId, artifactId, version, java.version 21, test scope on the test starter, and spring-boot-maven-plugin.",
        "Add a Spring Boot 3 application class under src/main/java that starts, and one JUnit 5 test under src/test/java that asserts true. Imports for any Servlet or JPA types must be jakarta.*, not javax.*.",
        "Run mvn -B test and confirm Surefire runs and the build exits 0.",
        "Run mvn -B -DskipITs package. Confirm target/app.jar exists because finalName is app.",
        "Run jar tf target/app.jar and find the Spring Boot loader entries. Do not run mvn deploy.",
      ],
      criteria: [
        "mvn -B test exits 0 and the log shows tests running, not skipped.",
        "target/app.jar exists after package.",
        "The POM has no version range and no SNAPSHOT if you labeled it a release exercise.",
        "Breaking the test on purpose makes mvn -B test exit non-zero.",
        "You did not put repository passwords in the POM.",
      ],
    },
    checks: [
      {
        q: "What happens when you run mvn package?",
        a: "Maven runs the package phase and every earlier default-lifecycle phase, including compile and test. A test failure stops the build before a new jar is published by this run.",
      },
      {
        q: "How is a goal different from a phase?",
        a: "A phase is a lifecycle slot such as test. A goal is a single plugin task such as surefire:test. Phases are what CI should invoke. Goals are for a specific task.",
      },
      {
        q: "Where does test scope appear, and where does a SNAPSHOT version go?",
        a: "Test scope is only on the test classpath and is not shipped in the app package. A SNAPSHOT version is mutable and does not belong on a release that must be reproducible.",
      },
      {
        q: "What does spring-boot-maven-plugin change about the jar?",
        a: "It repackages a jar that java -jar can boot, with dependencies nested inside, unlike a thin library jar or a traditional WAR.",
      },
    ],
    interview: [
      {
        q: "Walk through validate, compile, test, package, verify, install, and deploy.",
        a: "They are ordered phases. Each invocation runs earlier phases too. test runs unit tests, package builds the archive, verify is where integration checks run, install writes ~/.m2, and deploy uploads to a remote registry. CI usually stops at package or verify and publishes in a later controlled job.",
      },
      {
        q: "Why can java -jar succeed on a Spring Boot build and fail on a plain Maven jar?",
        a: "The Spring Boot plugin repackages an executable jar with a loader and nested libraries. A plain jar has your classes and a thin manifest. The dependencies are on the classpath only if some other mechanism adds them.",
      },
      {
        q: "What would you pin to make a Maven build reproducible?",
        a: "The parent and plugin versions, no ranges, no SNAPSHOT in the release, a wrapper if the Maven binary must be fixed, and a registry that does not rewrite release artifacts. The ~/.m2 cache is a speed-up, not a lockfile.",
      },
    ],
    takeaways: [
      "Coordinates are groupId, artifactId, and version. The parent POM pins the Spring Boot 3.x stack.",
      "A phase runs itself and every earlier phase. A goal is one plugin task.",
      "test scope stays out of the shipped app. SNAPSHOT versions are mutable; release versions are not.",
      "spring-boot-maven-plugin produces the executable jar. java -jar needs that jar, not the thin one.",
      "mvn -B test package is the CI shape. install and deploy write to a repository; do not deploy by accident.",
    ],
  },
  {
    slug: "artifacts-gradle-registries",
    title: "Artifacts, Gradle, and registries",
    status: "primer",
    blocks: [
      {
        type: "h2",
        text: "An artifact is the file plus its coordinates",
      },
      {
        type: "p",
        text: "An artifact is the built output a build publishes: a jar, a war, a zip, or an image later in this track, identified by group, name, and version. Next to the file, a registry stores checksums (SHA-256, sometimes still SHA-1). A checksum detects corruption and accidental truncation. It is not a signature. Someone who can change the file and the checksum together defeats it. Signatures and repository permissions are the stronger control; this lesson only needs the distinction.",
      },
      {
        type: "h3",
        text: "Registries, without the click-path",
      },
      {
        type: "p",
        text: "Nexus Repository and JFrog Artifactory are the two registries you will hear named. Both host your releases, your SNAPSHOT builds, and a proxy cache of Maven Central. Builds then depend on the company registry instead of the public internet, and the security team can block a package by name. You do not need the admin UI to be effective as a junior. You need to know which URL the POM or settings.xml points at, which repository holds releases versus snapshots, and that publish credentials are secrets. The same idea appears later for container registries. The product names change; coordinates plus an immutable release do not.",
      },
      {
        type: "table",
        caption: "Maven and Gradle from the hallway",
        headers: ["", "Maven", "Gradle"],
        rows: [
          ["Config file", "pom.xml, XML", "build.gradle (Groovy) or build.gradle.kts (Kotlin DSL)"],
          ["Unit of work", "Lifecycle phases that plugins bind to", "Tasks, wired by convention plugins"],
          ["Incremental work", "Phase reruns are coarse", "Tasks are incremental; a build cache can reuse outputs"],
          ["Pinned tool", "Maven Wrapper is optional but wise", "./gradlew is the normal entry point"],
          ["Where a junior meets it", "Most Java service backends", "Android, and many Spring samples and multi-module builds"],
        ],
      },
      {
        type: "h3",
        text: "When the repo is Gradle",
      },
      {
        type: "p",
        text: "Do not install a random global Gradle. The repository should contain gradlew, gradlew.bat, and gradle/wrapper. The wrapper downloads the Gradle version declared in the wrapper properties, which is the pin. From the repo root, ./gradlew tasks prints the tasks the project chose to advertise. ./gradlew tasks --all shows more, including tasks you rarely type. For a Spring Boot Gradle build the test task runs tests and bootJar packages an executable jar, analogous to the Maven package plus repackage flow. Android projects use different task names; tasks is how you discover them instead of guessing. If a task needs a flag, ./gradlew help --task bootJar describes that task.",
      },
      {
        type: "code",
        lang: "bash",
        title: "Discover tasks through the wrapper",
        code: `./gradlew tasks
./gradlew tasks --all
./gradlew test
./gradlew bootJar`,
      },
      {
        type: "callout",
        tone: "tip",
        title: "The wrapper is the build tool",
        text: "A global gradle on your PATH can be a different major version than the project, and it will fail in ways the CI wrapper does not. Call ./gradlew. On Windows the file is gradlew.bat. Commit the wrapper bits the project already generated; do not upgrade Gradle casually in the same change as a feature.",
      },
      {
        type: "p",
        text: "Gradle dependency coordinates look like a compact string instead of XML elements, but they still mean group, artifact, and version. A version written as a plus or as latest is a floating pin. Treat it the way you treat a Maven SNAPSHOT: acceptable only while exploring, never for a release you expect to rebuild. When a Spring or Android tutorial says to run a task and the task is missing, you are in the wrong directory or the wrong module. tasks from that directory is the check, not a search for a blog that matches an older plugin.",
      },
      {
        type: "ul",
        items: [
          "Release artifacts are immutable. Snapshot or changing versions are not.",
          "Checksums catch broken downloads. They do not prove who published the file.",
          "A registry proxy is a control point and a cache, not a second build system.",
          "If both pom.xml and build.gradle exist, read the CI script to see which tool actually runs.",
        ],
      },
    ],
    exercise: null,
    checks: [
      {
        q: "What do you run to see a Gradle project's tasks, and why not a system-wide gradle command?",
        a: "./gradlew tasks, from the project root. The wrapper pins the Gradle version. A global install can be a different version than CI.",
      },
      {
        q: "What is the difference between a checksum and a signature on an artifact?",
        a: "A checksum detects accidental change or truncation. A signature is what ties the bytes to a publisher. Replacing the file and the checksum together defeats a checksum alone.",
      },
    ],
    interview: [
      {
        q: "You join a team and the repo has gradlew but you have only used Maven. What do you do on day one?",
        a: "Read the CI script, run ./gradlew tasks, and map test and bootJar to the Maven phases you know. Do not install a random Gradle. Treat versions as pins, and ask which registry the build resolves through.",
      },
    ],
    takeaways: [
      "An artifact is a file plus coordinates. Checksums detect corruption; they are not signatures.",
      "Nexus and Artifactory host private artifacts and proxy public ones. You do not need the admin UI to use them correctly.",
      "On a Gradle repo, ./gradlew tasks is how you learn the build. Do not depend on a floating version.",
    ],
  },
  {
    slug: "reproducible-builds",
    title: "Reproducible builds",
    status: "primer",
    blocks: [
      {
        type: "h2",
        text: "Same commit, same inputs",
      },
      {
        type: "p",
        text: "A reproducible build is one you can run again from the same source and get the same dependency graph and the same artifact bytes, or as close as the toolchain allows. The practical lever is pinning. The POM parent version, Gradle wrapper, Python requirements, GitHub Action SHAs, and container image digests are all pins. A label that means \"whatever was current when the agent ran\" is not a pin.",
      },
      {
        type: "h3",
        text: "Lockfiles and version pins",
      },
      {
        type: "p",
        text: "A lockfile records the full resolved graph, including transitive versions, not only the direct dependencies you typed. package-lock.json, poetry.lock, and Gradle's dependency lock are lockfiles. Maven's common equivalent is an explicit version on every dependency that matters, usually imported through a parent BOM such as the Spring Boot parent, plus a ban on version ranges and SNAPSHOT releases. Ranges resolve differently next month. A lockfile that is not committed, or a CI job that regenerates it from floating ranges on every build, does not lock anything.",
      },
      {
        type: "p",
        text: "Dependency confusion and typosquatting are the same family of mistake. Confusion: a build asks a public registry for a name that was supposed to stay private, and an attacker has published that name at a higher version, so the resolver picks the attacker. Typosquatting: the dependency string is one character off a real package, and that name belongs to someone else. The defense a junior can apply this week is to resolve through the company registry, keep private package names from being looked up publicly, and read a new dependency before adding it. Scanning and admission policy go further; they are not this lesson.",
      },
      {
        type: "table",
        caption: "Pins versus labels that move",
        headers: ["Input", "Moves under you", "Pin"],
        rows: [
          ["Maven SNAPSHOT or version range", "Yes", "A release version, parent BOM included"],
          ["pip package name with no version", "Yes", "name==version in requirements.txt"],
          ["Docker tag latest", "Yes", "A digest you have verified, or at least a version tag you still plan to replace with a digest"],
          ["GitHub Action @v1", "The major tag can move", "A commit SHA, updated on purpose"],
          ["CI cache of downloaded jars", "It is a cache, not a definition", "Key the cache from the lockfile, and be able to rebuild with the cache deleted"],
        ],
      },
      {
        type: "h3",
        text: "Caching in CI is not a dependency pin",
      },
      {
        type: "ul",
        items: [
          "A cache makes the second build faster. It must not be the only place a dependency exists.",
          "Key the cache on the lockfile or POM contents. A constant key restores yesterday's graph after you edited a version.",
          "A poisoned or truncated cache entry is reused until the key changes. Know how to delete the cache entry for one branch.",
          "Do not depend on latest, SNAPSHOT, or a range in any job that produces a release artifact.",
        ],
      },
      {
        type: "callout",
        tone: "warn",
        title: "latest is an instruction to change the build without a commit",
        text: "An image tag, a GitHub Action major tag, or a Maven SNAPSHOT can move between the pull request and production. If the bits matter, the commit should name them. Updating a pin is a normal change with a diff. Discovering the update during an incident is not.",
      },
      {
        type: "p",
        text: "Supply chain, in one paragraph, is the admission that your build runs other people's code: parent POMs, plugins, actions, base images, and transitive libraries. Pinning and a private registry are the start. A software bill of materials (an SBOM) is a list of those components for a specific build, and signing is how a later stage checks the list still matches the bytes. This lesson does not teach SBOM tooling. Later security material points at image scanning. Until then, do not describe a cached build as reproducible, and do not merge a release workflow that pulls latest.",
      },
    ],
    exercise: null,
    checks: [
      {
        q: "Why is a CI dependency cache not a lockfile?",
        a: "The cache only speeds downloads. The lockfile or pinned POM is what decides the versions. A cache can be deleted, corrupted, or keyed so poorly that it restores the wrong graph.",
      },
      {
        q: "What is dependency confusion?",
        a: "A resolver fetches a private package name from a public registry, where an attacker published the same name at a version the build prefers.",
      },
    ],
    interview: [
      {
        q: "A release pipeline uses a Docker tag of latest and a Maven SNAPSHOT. What do you change first, and what do you deliberately not claim to have finished?",
        a: "Replace them with a release version and an image digest or at least an immutable tag you control, and make CI fail if a range or SNAPSHOT appears. You have not finished supply-chain work: SBOMs, signing, and admission policy are still ahead and should not be pretended otherwise.",
      },
    ],
    takeaways: [
      "Pin versions and commit lockfiles. Ranges, SNAPSHOT, and latest are not reproducible.",
      "Dependency confusion and typosquatting are reasons to resolve through a registry you control and to read new dependencies.",
      "A CI cache is a performance tool. An SBOM is a later topic; pinning is the part you do now.",
    ],
  },
];
