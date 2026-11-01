import type { Lesson } from "../types";

export const lessons: Lesson[] = [
  {
    slug: "cicd-pipeline-fundamentals",
    title: "CI/CD pipeline fundamentals",
    status: "full",
    blocks: [
      { type: "diagram", id: "cicd" },
      {
        type: "h2",
        text: "Small batches, fast feedback",
      },
      {
        type: "p",
        text: "Continuous integration runs the build and tests on every change, while the change is still small. A failure points at one pull request instead of a week of unmerged work. That is the risk reduction: less code to inspect, a shorter time from mistake to signal, and a main branch that stays deployable. A pipeline that is slow, flaky, or optional does not give you that. People route around it.",
      },
      {
        type: "p",
        text: "Three terms stay distinct. Continuous integration means merge often and prove the merge with an automated build and tests. Continuous delivery means the artifact from that build is always in a state you could release; a human approval usually gates production. Continuous deployment means a green main branch deploys to production with no human approval step. Delivery and deployment both require integration. Deployment does not require that you skip reviews of the code; it requires that the release step itself is automated once the code is on the release branch.",
      },
      {
        type: "h2",
        text: "Stages",
      },
      {
        type: "p",
        text: "A stage is a group of work with a clear stop. If a stage fails, later stages do not run. The names below match a Spring Boot service. Not every team splits them into separate jobs; the order is the part that matters. Checkout obtains the commit. Deps resolves libraries. Compile proves the sources build. Lint runs static checks. Unit test runs Surefire, with no database. Integration test runs Failsafe or a compose stack against real sockets. Security scan looks for known-vulnerable dependencies or image issues. Package produces the jar or image. Publish pushes that artifact to a registry. Deploy rolls it out. Smoke hits a health endpoint. Rollback returns the previous artifact, by digest, without rebuilding an old commit from memory.",
      },
      {
        type: "ol",
        items: [
          "Checkout the commit the event selected.",
          "Restore or download dependencies from a lock or a pinned POM.",
          "Compile.",
          "Lint.",
          "Unit test. A failure fails the pipeline.",
          "Integration test, usually only after unit tests are green.",
          "Security scan. Decide which severities block the merge.",
          "Package the executable jar or image.",
          "Publish the artifact to a registry you control.",
          "Deploy to an environment.",
          "Smoke-test /actuator/health or the equivalent.",
          "Rollback by redeploying the previous digest if smoke fails.",
        ],
      },
      {
        type: "h2",
        text: "Triggers, branches, secrets, approvals",
      },
      {
        type: "ul",
        items: [
          "push: a commit landed on a branch you listed. Use it for main.",
          "pull_request: someone opened or updated a review branch. This is the default CI trigger. Do not give fork pull requests your secrets.",
          "tag: a version tag was pushed. Use it to publish a release, not to discover compile errors.",
          "schedule: a cron inside the CI system, for dependency scans or nightly integration tests. Its environment is the runner, not your laptop shell.",
          "manual: a person starts the workflow (workflow_dispatch or a Jenkins build button). Use it for production deploys and for expensive suites, not for unit tests.",
        ],
      },
      {
        type: "p",
        text: "Branch strategy for this track is short-lived branches and a pull request into main. Main is protected: required review, required CI, no direct push. Feature branches do not deploy to production. A release tag, or main itself, is what publish and deploy are allowed to see. Secrets are credentials: registry passwords, cloud keys, signing keys. They are masked and should be scoped to the environment that needs them. Variables are non-secret configuration: a region name, a feature flag that is not sensitive, a registry hostname. Approvals are a rule on the production environment so deploy waits even when the YAML is otherwise automatic. The approval is not a substitute for tests.",
      },
      {
        type: "callout",
        tone: "danger",
        title: "A red test is a red pipeline",
        text: "Do not append || true to a test command. Do not set continue-on-error on the unit-test step. A pipeline that stays green when tests fail is a dashboard, not a control. Flaky tests are a defect in the test or in the product. Quarantine them with an owner and a ticket. Rerunning until green trains the team to ignore the signal CI exists to provide.",
      },
      {
        type: "h2",
        text: "A Spring Boot pipeline, narrated",
      },
      {
        type: "p",
        text: "A developer opens a pull request. The CI system checks out that revision, installs Temurin 21, and runs mvn -B test package. Surefire executes the unit tests. One assertion fails. Maven exits non-zero. The upload step does not run, or if it does it finds no new jar and fails. The pull request cannot merge. The author fixes the assertion, pushes, and the same pipeline goes green and uploads target/app.jar as a build artifact. That upload is not a release. After merge to main, a second run packages the same way and publishes an image tagged with the commit SHA, not latest. Production deploy is a manual approval. The smoke step requests /actuator/health and expects UP. If smoke fails, the deploy job re-points the service at the previous image digest. Nobody rebuilds an old branch and hopes the dependencies resolve the same way.",
      },
      {
        type: "h3",
        text: "The commands those stages run",
      },
      {
        type: "p",
        text: "The unit-test and package gate is one Maven invocation. -B is batch mode so the log never waits for a prompt. -DskipITs sets the Failsafe skip property so this job does not run integration tests; Surefire still runs during test. test is the phase that fails the pipeline when an assertion fails. package builds the executable jar only if that phase returned zero. Do not put || true after it. The shell would exit zero and the pipeline would go green with a broken build. The smoke command is curl against the actuator health URL. --fail turns an HTTP error into a non-zero exit, --max-time 5 stops a hung process, and --show-error keeps the reason on stderr. A smoke failure must fail the deploy stage so rollback can run. Verify actuator paths against the Spring Boot 3 docs for the version you ship.",
      },
      {
        type: "code",
        lang: "bash",
        title: "Test gate, then smoke. The commented line is the defect.",
        code: `mvn -B -DskipITs test package
curl --fail --silent --show-error --max-time 5 http://127.0.0.1:8080/actuator/health
# mvn -B test || true`,
      },
      {
        type: "code",
        lang: "text",
        title: "Rollback selects an existing digest",
        code: `deploy registry.example.com/orders@sha256:0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef`,
        note: "Illustrative command — not a real registry, and not run in this environment.",
      },
      {
        type: "table",
        caption: "Integration, delivery, deployment",
        headers: ["Practice", "What is automatic", "What a human still does"],
        rows: [
          ["Continuous integration", "Build and test on every merge proposal", "Reviews the code. Decides what main means"],
          ["Continuous delivery", "CI plus a releasable artifact every green main build", "Approves the production deploy"],
          ["Continuous deployment", "CI plus deploy of every green release-branch commit", "Watches the smoke test and the rollback path. Does not click deploy"],
        ],
      },
      {
        type: "callout",
        tone: "tip",
        title: "Rollback is an artifact you already have",
        text: "Keep the previous image digest or jar version. Rolling back should select that digest and redeploy. Rebuilding last week's commit with floating tags is a second release, not a rollback.",
      },
      {
        type: "p",
        text: "The diagram on this page is the loop: change, pipeline, artifact, environment, feedback. The following lessons turn the loop into a GitHub Actions workflow, a Jenkinsfile, and a GitLab CI file. The definitions do not change when the syntax does.",
      },
    ],
    exercise: {
      title: "Write the stage list for one service",
      prompt: "On your laptop, in a local text file, specify the pipeline for a Spring Boot 3 service on Java 21. No cloud account. This site does not run a pipeline for you.",
      steps: [
        "List the stages from checkout through rollback in the order they must run.",
        "Mark which stages run on a pull request and which run only on main after merge.",
        "Name the exact test command for the unit-test stage: mvn -B test, or mvn -B -DskipITs test package if you also want the jar. State that a non-zero exit fails the pipeline.",
        "Separate secrets from variables. Put the registry password on the secret side. Put the registry hostname on the variable side.",
        "Write the rollback as 'redeploy the previous digest', and write one sentence on what you will do with a test that fails only on the third retry.",
      ],
      criteria: [
        "Unit tests run before publish and deploy.",
        "Pull request stages do not need production secrets.",
        "The test command is not wrapped in a way that ignores failure.",
        "Rollback does not say 'rebuild latest'.",
        "A flaky test is called a defect with an owner, not a retry policy.",
      ],
    },
    checks: [
      {
        q: "What is the difference between continuous delivery and continuous deployment?",
        a: "Delivery keeps a releasable artifact and usually waits for a human approval before production. Deployment ships every green release-branch commit without that approval click.",
      },
      {
        q: "Why does a pull request pipeline omit production secrets?",
        a: "The code under test, especially from a fork, is untrusted. Secrets in that job can be exfiltrated by the build script the pull request just changed.",
      },
      {
        q: "Where does a Failsafe integration test sit relative to Surefire?",
        a: "After unit tests. Surefire binds to the test phase. Failsafe typically binds to integration-test and verify, once the package exists.",
      },
      {
        q: "Why is a flaky test a pipeline defect?",
        a: "People rerun until the job is green, which hides real failures. Quarantine it with a ticket. Do not make retries the permanent process.",
      },
    ],
    interview: [
      {
        q: "Design the triggers for CI versus production deploy for a Spring Boot service.",
        a: "Pull request and push to main run checkout, compile, unit tests, and package. Publish runs on main only. Production deploy is manual or approval-gated and then smoke-tests health. Tag triggers are for releases, not for discovering that the code compiles.",
      },
      {
        q: "A teammate sets the test step to continue on error so the jar still uploads. What do you say?",
        a: "The pipeline no longer enforces the tests. Upload a jar only after Maven exits 0. A failed test must fail the job and block merge.",
      },
      {
        q: "What do you store so a bad deploy can roll back?",
        a: "The previous immutable artifact digest or version, and a deploy path that selects it. Rebuilding the old Git commit with floating dependencies is not the same bytes.",
      },
    ],
    takeaways: [
      "CI is fast feedback on a small change. A green build with failing tests is not CI.",
      "Delivery keeps an approval before production. Deployment automates that step too.",
      "Order the work: test, then package, then publish, then deploy, then smoke, then rollback by digest.",
      "Secrets stay off pull requests. Variables are for non-secret configuration.",
      "A flaky test is a defect. Do not paper over it with retries.",
    ],
  },
  {
    slug: "github-actions-spring-boot",
    title: "GitHub Actions for Spring Boot",
    status: "full",
    blocks: [
      {
        type: "h2",
        text: "A workflow file is the pipeline",
      },
      {
        type: "p",
        text: "GitHub Actions reads YAML under .github/workflows. The file below is a complete unit-test and package workflow for a Maven Spring Boot application on Java 21. It runs on pull_request and on push to main. It was not executed in this environment. Validate it in a repository against current action releases before you trust the major tags. Production workflows should pin each action to a full commit SHA; the tags below are readable examples, not the pin.",
      },
      {
        type: "code",
        lang: "yaml",
        title: ".github/workflows/ci.yml",
        note: "Illustrative workflow, not executed in this environment. Validate it in a repository.",
        code: `name: ci

on:
  push:
    branches:
      - main
  pull_request:

permissions:
  contents: read

concurrency:
  group: spring-boot-ci
  cancel-in-progress: true

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v5

      - name: Set up JDK 21
        uses: actions/setup-java@v6
        with:
          distribution: temurin
          java-version: "21"
          cache: maven

      - name: Unit test and package
        run: mvn -B -DskipITs test package

      - name: Upload jar
        uses: actions/upload-artifact@v4
        with:
          name: app-jar
          path: target/*.jar
          if-no-files-found: error`,
      },
      {
        type: "h2",
        text: "What each part does",
      },
      {
        type: "table",
        caption: "Workflow lines that change behavior",
        headers: ["Lines", "Why they are there"],
        rows: [
          ["name: ci", "Label in the Actions UI. It does not select the file. The path does."],
          ["on.push.branches: main", "Runs the workflow when a commit is pushed to main."],
          ["on.pull_request", "Runs on pull request activity. Fork pull requests do not receive secrets."],
          ["permissions: contents: read", "The job token can read the repo and cannot push, tag, or change settings."],
          ["concurrency.group", "Names the group of runs that must not pile up. This sample uses one static group."],
          ["cancel-in-progress: true", "A newer run in that group cancels the older run so agents are not wasted."],
          ["jobs.build", "Job id. Later jobs would depend on it with needs. This file has one job."],
          ["runs-on: ubuntu-latest", "Selects a GitHub-hosted Ubuntu runner. The image, including its preinstalled Maven, moves over time."],
          ["uses: actions/checkout", "Clones the revision for this event into the workspace. uses loads an action."],
          ["uses: actions/setup-java", "Installs Temurin 21 and enables a Maven cache keyed from the POM."],
          ["run: mvn -B -DskipITs test package", "A shell command. Batch mode, skip Failsafe, run unit tests, then package. Non-zero fails the step."],
          ["uses: actions/upload-artifact", "Stores target/*.jar as a build artifact. if-no-files-found: error fails the job if the jar is missing."],
        ],
      },
      {
        type: "p",
        text: "uses and run are the two step kinds. uses downloads an action and runs it with the with: inputs. run starts a shell on the runner and runs the command string. Checkout is first because every later step reads the repo. For a pull_request event, the revision GitHub checks out is the proposed merge of the branch into the base, which is what you want for CI. Confirm the exact ref behavior in the current checkout action docs if you must build the head commit instead. setup-java with distribution: temurin and java-version: \"21\" installs Eclipse Temurin 21. The version is quoted so YAML does not treat it as a number. cache: maven stores the local Maven repository between runs and should change key when the POM changes. Verify the major versions of checkout, setup-java, and upload-artifact against their current official releases.",
      },
      {
        type: "p",
        text: "The Maven line is the test gate. -B is batch mode: no prompts, logs that do not depend on a terminal. -DskipITs sets the Failsafe property so integration tests do not run in this job. Surefire still runs during the test phase. package runs only if tests passed, and the Spring Boot plugin repackages the executable jar. Do not replace this with -DskipTests. That flag skips the unit tests this workflow exists to run. GitHub-hosted Ubuntu runners usually have some Maven preinstalled, and that Maven version changes when the runner image changes. A reproducible repo commits the Maven Wrapper and calls ./mvnw with the same arguments. Switch to the wrapper before you treat the jar as a release artifact. Verify wrapper and plugin versions against current official docs.",
      },
      {
        type: "p",
        text: "upload-artifact copies matching files off the runner so a human can download them or a later job can consume them. path: target/*.jar must match finalName or the default artifact name. if-no-files-found: error is the difference between a green job that published nothing and a red job you will notice. The result is a short-lived Actions artifact, not a Maven registry publish. It expires. It is not what production pulls.",
      },
      {
        type: "p",
        text: "concurrency cancels stale runs. The sample group is the literal spring-boot-ci, which is valid YAML and simple to read. It is also too wide: a push on one branch cancels a run on another. In the real file, set the group from the GitHub context so each ref has its own queue. The expression is a dollar sign, two open braces, github.ref, and two close braces. That expression is omitted from the sample so the lesson source stays plain. cancel-in-progress should stay true for CI and should be false for a production deploy group, or you will cancel a deploy halfway through.",
      },
      {
        type: "callout",
        tone: "danger",
        title: "Do not use pull_request_target for untrusted forks",
        text: "pull_request_target runs in the base repository context and can see secrets. If that workflow checks out the pull request head, it runs the contributor's code with those secrets. Use pull_request for CI. Keep secrets on workflows that run only from main, tags, or a protected environment.",
      },
      {
        type: "h2",
        text: "Secrets, variables, and the Maven cache",
      },
      {
        type: "p",
        text: "This test workflow needs no secrets. A publish step would. GitHub exposes secrets on a context that is not available to pull requests from forks. In YAML you reference it with a dollar sign, two open braces, secrets.REGISTRY, and two close braces. The sample uses a placeholder instead of that syntax. Map the secret into an environment variable and let the publisher read the variable. Do not echo it. Do not pass it on a command line that shows up in the process list. Variables (the vars context) are for the registry host name and similar non-secrets. Prefer environment protection rules when the secret can deploy to production.",
      },
      {
        type: "code",
        lang: "yaml",
        title: "Publish sketch with a placeholder, not a real secret",
        code: `# Do not echo the password. Replace the placeholder in the real repository
# with the secrets context. Never commit a real registry password.
- name: Publish
  env:
    REGISTRY_PASSWORD: (secrets.REGISTRY)
  run: echo "publisher reads REGISTRY_PASSWORD from the environment"`,
      },
      {
        type: "callout",
        tone: "warn",
        title: "The Maven cache can restore a bad download",
        text: "cache: maven is an optimization. A truncated jar or an old SNAPSHOT in that cache is reused until the cache key changes. The cache is not a lockfile and not a security boundary. If CI fails only when warm, delete the cache for the branch and rebuild. Prefer release versions in the POM so you are not caching something that is supposed to move.",
      },
      {
        type: "ul",
        items: [
          "Keep contents: read on the test job. Add write permissions only on a separate publish job that does not run for fork pull requests.",
          "Pin actions to commit SHAs when you leave the tutorial stage. Update them on purpose.",
          "Failed tests fail the step because Maven's exit code is the step's exit code. Nothing in this file swallows it.",
          "ubuntu-latest is convenient and not a stable build environment. The wrapper plus a pinned JDK closes most of that gap.",
        ],
      },
      {
        type: "p",
        text: "If you copy the workflow, open it in a repository, push a branch, and read the log. This site cannot run GitHub Actions. When the log disagrees with the lesson, trust the current official docs for the action version you pinned.",
      },
    ],
    exercise: {
      title: "Author the workflow locally",
      prompt: "Create .github/workflows/ci.yml on your laptop for a Maven Spring Boot 3 project on Java 21. You do not need to push it for the exercise to count. If you do push, use a private practice repo. This site does not run the workflow.",
      steps: [
        "Set on.push for main and on.pull_request. Do not add pull_request_target.",
        "Set permissions contents to read at the workflow level.",
        "Add a job on ubuntu-latest that checks out the repo, sets up Temurin 21 with the Maven cache, and runs mvn -B -DskipITs test package.",
        "Upload target/*.jar with if-no-files-found set to error.",
        "In a comment or a short README next to the file, explain uses versus run, and write the concurrency caveat: a static group cancels across branches.",
      ],
      criteria: [
        "The YAML lists pull_request and push to main, and does not list pull_request_target.",
        "The token permission is contents read, not write.",
        "The Maven command runs unit tests. It does not pass -DskipTests.",
        "Java is Temurin 21.",
        "The note in your README says the file was not executed by the lesson site and must be validated in a repository. Verify action major versions against current official releases.",
      ],
    },
    checks: [
      {
        q: "What is the difference between uses and run?",
        a: "uses invokes a versioned action such as actions/checkout. run executes a shell command on the runner, such as mvn.",
      },
      {
        q: "Why is permissions: contents: read enough for this job?",
        a: "Checkout and tests only need to read the repository. A write token is extra privilege the test script could abuse if the workflow is ever tricked into running untrusted code.",
      },
      {
        q: "What does -DskipITs do, and what does it not do?",
        a: "It asks Failsafe to skip integration tests. Surefire unit tests still run during the test phase. -DskipTests would skip those unit tests and must not be used here.",
      },
      {
        q: "Why can a static concurrency group be wrong?",
        a: "Every branch shares it, so a push on one branch cancels an in-progress run on another. Scope the group per ref in the real workflow.",
      },
    ],
    interview: [
      {
        q: "Walk through this workflow from event to uploaded jar.",
        a: "A push to main or a pull request starts the workflow with a read-only token. The runner checks out the event revision, installs Temurin 21, restores the Maven cache, runs unit tests, packages the jar, and uploads it. Any non-zero Maven exit fails the job before a bad jar is treated as success.",
      },
      {
        q: "Why refuse pull_request_target on a public repository?",
        a: "It runs with the base repository's secrets. Checking out the fork's code in that job executes untrusted code with credentials. Use pull_request for CI and keep secrets on protected branches.",
      },
      {
        q: "The Maven cache is warm and the build fails with a bad zip. What now?",
        a: "Treat the cache as suspect. Delete that cache entry and rebuild from the registry. Then confirm the POM uses release versions so you are not caching a moving SNAPSHOT.",
      },
    ],
    takeaways: [
      "A Spring Boot CI workflow checks out, installs Temurin 21, runs mvn -B -DskipITs test package, and uploads the jar only if that command produced one.",
      "permissions: contents: read is the least privilege for tests. Do not use pull_request_target to build untrusted forks.",
      "uses loads an action. run executes a shell command. The Maven exit code must fail the step.",
      "A static concurrency group cancels across branches. Scope it per ref, and do not cancel production deploys.",
      "The sample was not executed here. Pin action SHAs in a real repository and validate the log there. Verify versions against current official docs.",
    ],
  },
  {
    slug: "jenkins-declarative-pipelines",
    title: "Jenkins declarative pipelines",
    status: "full",
    blocks: [
      {
        type: "h2",
        text: "A controller schedules. Agents run builds.",
      },
      {
        type: "p",
        text: "Jenkins is a controller plus agents. The controller stores job definitions, credentials, and the queue. An agent is a worker with a workspace, a JDK, and Maven. A Jenkinsfile checked into the repo is a declarative pipeline: pipeline, agent, stages, steps, and post. The controller should have zero executors so it never runs a build. Agents are selected with labels such as linux-jdk21. The textbook snippet agent any means any executor, including the controller if someone left executors enabled. Replace it.",
      },
      {
        type: "callout",
        tone: "danger",
        title: "Do not build on the controller",
        text: "A pipeline runs the repo's code. On the controller that code can read the credential store, the war file, and the files that authenticate agents. A compromised or merely buggy test then owns CI. Set the controller's executor count to 0 and run builds on disposable agents. sudo or administrator access on the controller is not a convenience feature.",
      },
      {
        type: "code",
        lang: "groovy",
        title: "Jenkinsfile",
        code: `pipeline {
    agent { label 'linux-jdk21' }
    options {
        timeout(time: 30, unit: 'MINUTES')
    }
    stages {
        stage('Test') {
            steps {
                sh 'mvn -B test'
            }
        }
        stage('Package') {
            steps {
                sh 'mvn -B -DskipTests package'
            }
        }
    }
    post {
        always {
            echo 'Finished. Archive target/surefire-reports from the agent workspace.'
        }
    }
}`,
      },
      {
        type: "h2",
        text: "What the Jenkinsfile is doing",
      },
      {
        type: "p",
        text: "pipeline is the declarative root. agent { label 'linux-jdk21' } reserves an agent whose label you attached in the node configuration. The agent, not the Jenkinsfile, must provide JDK 21 and Maven, unless you add a tool installer. Tool installers are plugins; prefer an agent image that already has the toolchain. options { timeout(...) } aborts the build after 30 minutes so a stuck test cannot hold the agent. That timeout is a safety rail, not a substitute for timeouts inside the tests themselves.",
      },
      {
        type: "p",
        text: "stages holds ordered stages. stage('Test') names a block in the UI. steps is the list of commands. sh 'mvn -B test' runs that string in a shell on the agent. -B is batch mode. The test phase runs Surefire. A non-zero exit fails the step, which fails the stage, which skips the remaining stages. stage('Package') runs only after Test succeeds. sh 'mvn -B -DskipTests package' starts a second Maven process in the same workspace. -DskipTests skips unit-test execution on this second pass because Test already ran them. package still builds the jar and the Spring Boot plugin still repackages it. If you wipe the workspace between stages, do not do it here: Package expects target/ from the same agent. A failed Test does not reach Package, so you never package a build whose tests failed.",
      },
      {
        type: "p",
        text: "post { always { ... } } runs after the stages whether they passed or failed. Use it to archive test reports and to clean credentials from the workspace, not to deploy. The echo in the sample is intentional: the JUnit plugin's junit step can publish target/surefire-reports/*.xml, and adding that plugin is a dependency you should make on purpose. always still runs when Test fails, which is when you most want the reports. A post { success } block would not.",
      },
      {
        type: "h2",
        text: "Credentials, sandbox, and plugins",
      },
      {
        type: "p",
        text: "Jenkins stores secrets in its credential store. A pipeline binds one credential into environment variables for a block and should not print them. The binding step is withCredentials, provided by the credentials-binding plugin. The id is a name such as registry-upload, not the password. usernameVariable and passwordVariable choose the env names inside the block. When the block ends, those variables are gone. Jenkins tries to mask the exact secret string in logs. Masking fails if the script base64-encodes the value or prints half of it. Do not echo the variables. Do not write the password into the Jenkinsfile.",
      },
      {
        type: "code",
        lang: "groovy",
        title: "Credential binding without a secret value",
        code: `// withCredentials binds a store entry for this block only.
// credentialsId is a name in Jenkins, not the password.
// withCredentials([usernamePassword(
//     credentialsId: 'registry-upload',
//     usernameVariable: 'REG_USER',
//     passwordVariable: 'REG_PASS')]) {
//     sh 'the publisher reads REG_USER and REG_PASS from the environment'
// }`,
      },
      {
        type: "p",
        text: "Declarative pipelines run in the script-security sandbox unless an administrator approves extra method signatures. The sandbox blocks surprising Groovy calls. It is a speed bump for accidents, not an isolation boundary. Untrusted pull requests should not run on agents that hold production credentials, sandbox or not. Use a label for untrusted CI that has no deploy credentials, and a different label for the release agent.",
      },
      {
        type: "callout",
        tone: "warn",
        title: "Plugins are a supply chain on the controller",
        text: "Every plugin runs inside the controller process with access to jobs and credentials. An outdated or typo-squatted plugin is a direct path to CI takeover. Install the smallest set, read the project's advisories, and update on a schedule. The Jenkinsfile looks portable; the plugin list usually is not.",
      },
      {
        type: "table",
        caption: "Jenkins and GitHub Actions",
        headers: ["", "GitHub Actions", "Jenkins"],
        rows: [
          ["Config", "YAML in .github/workflows, reviewed with the code", "Jenkinsfile in the repo, plus controller and folder settings in the UI"],
          ["Where builds run", "GitHub-hosted runners or self-hosted runners", "Agents you patch, labeled and often long-lived"],
          ["Control plane", "GitHub operates it on github.com, or you operate GitHub Enterprise", "You operate the controller: backups, upgrades, executor count"],
          ["Secrets", "Encrypted secrets and environment protection rules", "Credential store and withCredentials bindings"],
          ["Extension", "Reusable actions, pinned by SHA", "Plugins on the controller. High privilege, your patching burden"],
          ["Portability", "Tied to GitHub's YAML model", "Jenkinsfile moves between Jenkins servers only if the plugins and labels exist there"],
        ],
      },
      {
        type: "p",
        text: "Neither system is the default winner. Actions fits a repo that already lives on GitHub and a team that does not want a controller to patch. Jenkins fits a network that already runs agents next to internal registries and cannot send source to a hosted runner. The pipeline ideas are the same: fail on test failure, keep secrets out of the file, and do not run untrusted code on the machine that stores credentials. The example Jenkinsfile was not executed in this environment. Load it on a practice controller only after the agent label exists and the controller executors are set to 0.",
      },
    ],
    exercise: {
      title: "Write a two-stage Jenkinsfile",
      prompt: "Create a Jenkinsfile in a local repo. You can complete the exercise without a running Jenkins. If you have a practice controller, run it only on an agent label, never on the controller. This site does not run Jenkins for you.",
      steps: [
        "Set agent to a label, not any. Add a timeout option of 30 minutes.",
        "Add stage Test with sh 'mvn -B test' and stage Package with sh 'mvn -B -DskipTests package'.",
        "Add post { always } that does not deploy. State in a comment where Surefire reports are.",
        "Add a commented withCredentials example that uses a credential id and does not contain a real password.",
        "Write three sentences: why controller executors must be 0, why Package uses -DskipTests, and why a plugin is a supply-chain dependency.",
      ],
      criteria: [
        "The file is declarative pipeline syntax with both stages and post.always.",
        "No secret value appears in the file.",
        "agent does not select the controller.",
        "Package cannot run if you imagine Test returning non-zero, because it is a later stage.",
        "The write-up mentions plugin risk and the script sandbox as a speed bump, not a security boundary.",
      ],
    },
    checks: [
      {
        q: "Why must the controller's executor count be 0?",
        a: "Executors on the controller run build code next to the credential store. A build should run on an agent. agent any can select the controller if executors are enabled.",
      },
      {
        q: "Why does the Package stage pass -DskipTests?",
        a: "Test already ran Surefire. The second Maven invocation only needs to package. If Test failed, Package does not run.",
      },
      {
        q: "What does post { always } guarantee?",
        a: "The block runs after the stages on success and on failure. That is where you archive test reports. It is the wrong place to deploy.",
      },
      {
        q: "How should a registry password enter a pipeline?",
        a: "As a credential-store id bound with withCredentials for one block, injected as environment variables, never written into the Jenkinsfile and never echoed.",
      },
    ],
    interview: [
      {
        q: "Compare where Jenkins and GitHub Actions keep configuration and secrets.",
        a: "Actions keeps YAML in the repo and secrets in GitHub's store, with environment approvals. Jenkins keeps a Jenkinsfile in the repo but also UI configuration, a controller you patch, and a credential store bound by withCredentials. Plugins on that controller are part of the trust boundary.",
      },
      {
        q: "A pull request build currently runs on the production-deploy agent. What do you change?",
        a: "Move untrusted builds to a label with no production credentials. Keep the controller free of executors. The sandbox does not make an over-privileged agent safe.",
      },
      {
        q: "Two Maven stages share one workspace. What breaks if you clean the workspace at the start of Package?",
        a: "Package would lose target/ and would need to compile again. -DskipTests would then package without having run tests in that process. Either do not clean, or use one Maven command that tests and packages together.",
      },
    ],
    takeaways: [
      "The controller schedules and stores credentials. Agents run mvn. Controller executors stay at 0.",
      "Declarative shape: agent label, Test with mvn -B test, Package with mvn -B -DskipTests package, post always for reports.",
      "withCredentials binds a named credential for one block. The password is not in the Jenkinsfile.",
      "Plugins run in the controller. They are a supply chain, not free features.",
      "The Jenkinsfile is portable only together with its labels, tools, and plugins. Actions is a different system, not a worse one.",
    ],
  },
  {
    slug: "gitlab-ci-comparison",
    title: "GitLab CI, compared",
    status: "primer",
    blocks: [
      {
        type: "h2",
        text: "One file, stages, and jobs",
      },
      {
        type: "p",
        text: "GitLab CI reads .gitlab-ci.yml from the repository. A stage orders jobs. A job names one stage, an image, and a script. The runner (shared or self-hosted) starts the image and runs each script line in a shell. The file below is a Maven test job and a package job for Java 21. It was not executed here. The image tag must be checked against current official Docker Hub tags before you depend on it. The maven image is used because a plain Temurin JDK image does not include the mvn binary.",
      },
      {
        type: "code",
        lang: "yaml",
        title: ".gitlab-ci.yml",
        code: `stages:
  - test
  - package

unit:
  stage: test
  image: maven:3.9-eclipse-temurin-21
  script:
    - mvn -B test
  rules:
    - if: $CI_PIPELINE_SOURCE == "merge_request_event"
    - if: $CI_COMMIT_BRANCH == "main"
  cache:
    key: maven-repo
    paths:
      - .m2/repository
  artifacts:
    when: on_success
    paths:
      - target/surefire-reports/

package:
  stage: package
  image: maven:3.9-eclipse-temurin-21
  script:
    - mvn -B -DskipTests package
  artifacts:
    when: on_success
    paths:
      - target/*.jar`,
      },
      {
        type: "p",
        text: "stages lists test before package. GitLab does not start package if test failed. unit and package are job names. image is the container the script runs in, not the image you are publishing. script lines are shell. mvn -B test is the unit-test gate; a non-zero exit fails the job. rules decide whether the job is created at all. The two if lines include merge-request pipelines and pipelines on main. rules are the current replacement for the older only and except keys. cache copies .m2/repository between runs. The key maven-repo is constant in this primer, which is easy and stale: change the key when dependencies change, or you will restore yesterday's jars after editing the POM. artifacts are files kept with the pipeline. when: on_success does not publish reports or jars from a failed job. The package job's jar is a pipeline artifact, not a Maven registry upload.",
      },
      {
        type: "h3",
        text: "Secrets on GitLab",
      },
      {
        type: "p",
        text: "Put passwords in CI/CD variables, marked masked, and protected if they should appear only on protected branches. The YAML holds the variable name, not the value. The predefined variables CI_PIPELINE_SOURCE and CI_COMMIT_BRANCH describe the event. They are not secrets. A merge request pipeline from a fork is untrusted code: do not expose protected variables there.",
      },
      {
        type: "table",
        caption: "Three systems, no winner",
        headers: ["", "GitHub Actions", "Jenkins", "GitLab CI"],
        rows: [
          ["Config location", ".github/workflows in the repo", "Jenkinsfile plus UI and plugin config", ".gitlab-ci.yml in the repo"],
          ["Runners", "GitHub-hosted or self-hosted", "Agents you operate", "GitLab.com runners or your own GitLab Runner"],
          ["Secrets", "Actions secrets, environment protection", "Credential store, withCredentials", "CI/CD variables, masked and optionally protected"],
          ["Best fit", "Source already on GitHub, little controller work", "Existing Jenkins standard, private networks, custom agents", "Source already on GitLab, pipelines next to the GitLab registry"],
        ],
      },
      {
        type: "callout",
        tone: "info",
        title: "Pick the system your source already uses",
        text: "Moving CI without a pain you can name is a rewrite. All three can checkout, test, package, and refuse to continue after a red test. The operating cost is the controller or the runner fleet, not the YAML keywords.",
      },
      {
        type: "ul",
        items: [
          "GitHub Actions if the repo is on GitHub and you want hosted runners.",
          "Jenkins if the company already runs a controller and agents beside internal systems.",
          "GitLab CI if the repo is on GitLab and you want the pipeline file next to GitLab's registry and merge requests.",
          "In all three: pin the toolchain, keep secrets out of the file, and fail the pipeline when tests fail.",
        ],
      },
    ],
    exercise: null,
    checks: [
      {
        q: "What does a GitLab job's image key mean, and why not a plain Temurin JDK tag for this sample?",
        a: "image is the container the script runs inside. The official Temurin JDK image does not ship Maven. The sample uses a Maven image that includes Temurin 21. Verify the tag before relying on it.",
      },
      {
        q: "How do rules, artifacts, and cache differ?",
        a: "rules decide whether the job runs. artifacts keep files from a successful job with the pipeline. cache reuses a directory such as .m2 across runs and is not a lockfile.",
      },
    ],
    interview: [
      {
        q: "Your team asks which of GitHub Actions, Jenkins, and GitLab CI is best. How do you answer?",
        a: "None is best in the abstract. Match the tool to where the source lives and who will patch runners or the controller. Compare config location, runners, and secret storage. Require the same behavior everywhere: tests fail the pipeline, and secrets are not in the YAML.",
      },
    ],
    takeaways: [
      ".gitlab-ci.yml orders jobs with stages. script runs in the job image. A failed test stage blocks package.",
      "rules select pipelines, artifacts keep outputs, and cache only speeds Maven. A constant cache key goes stale.",
      "GitHub Actions, Jenkins, and GitLab CI fit different hosting and admin models. Do not invent a universal winner.",
    ],
  },
  {
    slug: "pipeline-debugging",
    title: "Debugging a failed pipeline",
    status: "primer",
    blocks: [
      {
        type: "h2",
        text: "Read the first red step",
      },
      {
        type: "p",
        text: "A failed pipeline has one earliest error. Later steps fail because their inputs never appeared. Open the log of the first red step and read the first Maven or shell error, not the final upload message. Then reproduce that command on your laptop from a clean checkout of the same commit. If it passes locally and fails in CI, the difference is the environment: JDK, working directory, missing permission, or a cache the laptop does not have.",
      },
      {
        type: "h3",
        text: "A failed build, end to end",
      },
      {
        type: "p",
        text: "A pull request on the Spring Boot repo goes red at Upload jar. The log says no files matched target/*.jar. The author edits the glob three times. The Test step above it had already failed: an assertion in OrdersApplicationTests, Maven exited 1, and package never wrote the jar. Upload with if-no-files-found: error then failed exactly as configured. The fix is the assertion, not the glob. After the test is fixed, a second failure mode appears: package writes target/app.jar because finalName is app, but a downstream job downloads an artifact named orders-jar. The names do not match, so the later job reports the artifact is missing even though upload succeeded.",
      },
      {
        type: "code",
        lang: "text",
        title: "The upload error that was not the root cause",
        code: `Error: No files were found with the provided path: target/*.jar.
No artifacts will be uploaded.`,
        note: "Illustrative output — not captured from a live run in this environment.",
      },
      {
        type: "ol",
        items: [
          "Find the earliest red step. Expand its log. Ignore later cascade errors until the first one is explained.",
          "Copy the command and run it locally on the same commit: mvn -B test package.",
          "If Maven failed, fix the test or the compile error before touching artifact paths.",
          "If Maven passed, compare the jar name under target/ with the upload path and the artifact name the next job expects.",
          "Check the working directory of each step. A step that sets a module directory does not change the next step.",
          "If the same commit fails only in CI, disable or delete the dependency cache once and rebuild. Then inspect token permissions.",
        ],
      },
      {
        type: "table",
        caption: "Symptoms that lie about the cause",
        headers: ["What you see", "What often happened"],
        rows: [
          ["Artifact path not found", "An earlier test or compile step failed, or finalName does not match the glob"],
          ["Works on my machine", "CI working directory, JDK, or wrapper differs from the laptop"],
          ["Fails only on the second run", "A warm cache restored a truncated or SNAPSHOT jar"],
          ["Passes when retried with no code change", "A flaky test. Defect, not a green build"],
          ["403 on a push or package read", "Token permissions. contents: read cannot push tags. Do not grant write to the test job"],
          ["Downstream job cannot see the jar", "Upload was skipped, the artifact name differs, or the retention window passed"],
        ],
      },
      {
        type: "callout",
        tone: "tip",
        title: "Reproduce the command, not the whole UI",
        text: "The UI adds checkout and caching around a command you can type. If mvn -B test fails locally, you do not need a runner to start the fix. If it passes locally, then compare directory, JDK major version, and whether CI used a cache.",
      },
      {
        type: "p",
        text: "Cache poisoning means the job restored bytes that a clean resolve would not have used: a half-written jar, a SNAPSHOT that moved, or a cache key that ignores the POM. Delete that cache and rerun. If a clean run passes, fix the key so the next POM change does not reuse the old directory. A flaky test fails without a code change and passes on retry. Track it as a defect. Adding a blanket retry of the whole job hides the next real failure. Missing permissions look like a missing file only in the sense that the API returns 403 before any bytes arrive; the log will say forbidden, not not found. Read that status code. Wrong working directory is quieter: the shell starts at the repo root, the project is in services/orders, and target/ is created there while upload looks at the root. Set the working directory on the Maven step and on the upload step, or use a path that includes the module.",
      },
    ],
    exercise: null,
    checks: [
      {
        q: "Upload says the jar path is missing. What do you open first?",
        a: "The earliest red step, usually the Maven test or package log. The jar is often missing because that command failed and package never ran.",
      },
      {
        q: "A job fails in CI and passes locally with no code change. Name two causes.",
        a: "A warm CI cache restoring bad dependencies, or a different working directory or JDK than the laptop. A pass on retry with no other change is a flaky test.",
      },
    ],
    interview: [
      {
        q: "Describe how you would debug a red main build that failed while uploading target/*.jar.",
        a: "Open the first red step. If Maven failed, reproduce mvn -B test package locally and fix that. If Maven passed, compare the jar name, the upload path, and the downstream artifact name, then check working directories. If only CI fails, purge the Maven cache once. Do not start by widening token permissions or rerunning until green.",
      },
    ],
    takeaways: [
      "The first red step is the cause. Later missing-artifact errors are usually the consequence.",
      "Reproduce the same command locally before you edit globs or permissions.",
      "Cache poisoning, flaky tests, the wrong directory, and a mismatched artifact name are different faults. A retry is not a fix.",
    ],
  },
];
