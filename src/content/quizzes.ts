import type { Quiz, QuizQuestion } from "./types";

function mc(
  id: string,
  difficulty: QuizQuestion["difficulty"],
  prompt: string,
  choices: string[],
  answer: number,
  explanation: string,
  topic: string,
): QuizQuestion {
  return { id, kind: "mc", difficulty, prompt, choices, answer, explanation, topic };
}

function tf(
  id: string,
  difficulty: QuizQuestion["difficulty"],
  prompt: string,
  answer: boolean,
  explanation: string,
  topic: string,
): QuizQuestion {
  return { id, kind: "tf", difficulty, prompt, answer, explanation, topic };
}

function short(
  id: string,
  difficulty: QuizQuestion["difficulty"],
  prompt: string,
  model: string,
  explanation: string,
  topic: string,
): QuizQuestion {
  return { id, kind: "short", difficulty, prompt, model, explanation, topic };
}

export const quizzes: Quiz[] = [
  {
    id: "foundations",
    title: "DevOps foundations",
    summary: "Definitions, CALMS, lifecycle, and what a junior is actually for.",
    moduleId: "m0",
    minutes: 12,
    questions: [
      mc("f1", "beginner", "Which statement best defines DevOps?", ["A product you install to replace operations", "A way of working that shortens lead time while protecting reliability", "A synonym for Kubernetes", "A job title that always means on-call for the whole company"], 1, "DevOps is a practice and culture. Tools implement it. Kubernetes is optional.", "what-is-devops"),
      mc("f2", "beginner", "In CALMS, what does the M stand for?", ["Microservices", "Measurement", "Multicloud", "Manual approval"], 1, "Measurement means you use lead time, failure rate, and user-facing signals rather than opinions alone.", "culture-calms"),
      tf("f3", "beginner", "Continuous deployment means every change is deployed to production with no manual approval gate.", true, "That is the distinction from continuous delivery, where the artifact is always deployable but a gate may remain.", "ci-cd-terms"),
      mc("f4", "beginner", "Which metric is lead time for changes?", ["Time from commit to production", "Time to compile the project", "Time between two incidents", "CPU time of the build agent"], 0, "Lead time includes wait, review, and deploy, not only the compiler.", "devops-lifecycle"),
      mc("f5", "intermediate", "A platform team is most accurately described as:", ["The only people allowed to commit", "A product team whose customers are other engineers", "A renamed help desk with no backlog", "The group that approves every production SSH session by hand"], 1, "Platform engineering builds a paved road: self-service with guardrails, not a ticket queue with a new name.", "team-roles"),
      short("f6", "beginner", "Name two things a junior DevOps engineer typically does in the first months, and one thing they typically do not own.", "They fix pipeline failures, write small automation, and update docs. They typically do not redesign production networking or own the company error budget alone.", "Honest scope beats a heroic job description.", "junior-role"),
      mc("f7", "beginner", "Waterfall mainly delays discovery of integration risk until:", ["The daily standup", "Late integration or test phases", "The first commit", "The monitoring dashboard"], 1, "Big-batch integration is why agile and CI emphasize small slices.", "sdlc-agile"),
      tf("f8", "intermediate", "A team that rebuilds from a different commit during deploy is still promoting an immutable artifact.", false, "Promotion means the same bytes you tested move forward. A rebuild can pick up new dependencies or a different tree.", "devops-lifecycle"),
    ],
  },
  {
    id: "networking",
    title: "Networking",
    summary: "CIDR, DNS, TCP versus UDP, HTTP status codes, and TLS.",
    moduleId: "m1",
    minutes: 14,
    questions: [
      mc("n1", "beginner", "How many usable IPv4 host addresses are in 10.1.1.0/26, ignoring any reservation a cloud may add?", ["14", "30", "62", "126"], 2, "A /26 has 64 addresses. Subtract network and broadcast and 62 remain. Clouds may reserve more.", "ip-subnetting"),
      mc("n2", "beginner", "Which record maps a hostname to an IPv4 address?", ["AAAA", "A", "MX", "NS"], 1, "A is IPv4. AAAA is IPv6. MX is mail. NS delegates a zone.", "tcp-udp-dns-http"),
      tf("n3", "beginner", "HTTPS is a separate application protocol that does not use HTTP.", false, "HTTPS is HTTP messages over TLS. Methods, paths, and status codes are still HTTP.", "tcp-udp-dns-http"),
      mc("n4", "beginner", "A 503 status usually means:", ["The client sent a bad body", "The resource does not exist", "The server or a dependency is temporarily unable to handle the request", "The client is unauthenticated"], 2, "503 is a server-side availability problem. 400 is a bad request, 404 is missing, 401 is unauthenticated.", "tcp-udp-dns-http"),
      mc("n5", "intermediate", "ping succeeds and curl returns connection refused on port 443. The best inference is:", ["DNS is definitely broken", "ICMP works, but nothing is accepting TCP on 443", "TLS certificates are expired", "The application returned HTTP 500"], 1, "Connection refused is TCP-level. TLS and HTTP have not started. DNS worked well enough to pick an address.", "network-commands"),
      short("n6", "intermediate", "Why can a CNAME not solve every DNS need at the zone apex?", "DNS standards do not allow a CNAME to sit next to other records at the apex, and the apex already needs SOA and NS. Providers use ALIAS or ANAME-like records instead.", "This is a common outage when someone 'just CNAMEs the root'.", "tcp-udp-dns-http"),
      mc("n7", "beginner", "Which service is a stateful packet filter on an AWS elastic network interface?", ["NACL only", "Security group", "Route 53", "IAM policy"], 1, "Security groups are stateful. Network ACLs are stateless and sit on the subnet.", "routing-nat-security"),
      tf("n8", "beginner", "UDP provides ordering and retransmission the way TCP does.", false, "UDP is a datagram service. Applications such as DNS add their own retry behavior if they need it.", "tcp-udp-dns-http"),
    ],
  },
  {
    id: "linux",
    title: "Linux",
    summary: "Paths, permissions, processes, systemd, and disk pressure.",
    moduleId: "m2",
    minutes: 14,
    questions: [
      mc("l1", "beginner", "What does the execute bit mean on a directory?", ["The directory can be run as a program", "You may traverse the directory", "The directory is archived", "Files inside are executable automatically"], 1, "Directory execute permission allows traversal and, with other bits, reaching inodes inside.", "linux-permissions-processes"),
      mc("l2", "beginner", "Which mode is rw-r----- ?", ["644", "640", "600", "755"], 1, "Owner read/write is 6, group read is 4, other none is 0.", "linux-permissions-processes"),
      tf("l3", "beginner", "SIGKILL can be caught so the process can flush its files.", false, "SIGKILL cannot be caught or ignored. SIGTERM can.", "linux-permissions-processes"),
      mc("l4", "beginner", "Which path is the usual place for service logs on a Linux host?", ["/etc/logs", "/var/log", "/usr/log", "/home/log"], 1, "/var holds variable data, including logs. /etc is configuration.", "linux-filesystem-commands"),
      mc("l5", "intermediate", "A cron job works when you run it in your shell and fails with 'command not found' at night. Likely cause:", ["Cron does not support Bash", "The job's PATH is minimal and does not match your interactive PATH", "The filesystem is read-only at night", "sudo is implied in cron"], 1, "Cron does not source your full interactive profile. Use absolute paths or set PATH in the crontab.", "shell-ssh-scheduling"),
      short("l6", "intermediate", "df says the disk is full. du on the obvious directory does not add up. Name one place the space might be.", "A deleted file still held open by a process, a different mount point, or space under a path du was not allowed to read. lsof can show deleted open files.", "df and du measure different things when mounts and deleted files are involved.", "linux-troubleshooting"),
      mc("l7", "beginner", "systemctl enable does what?", ["Starts the unit now and only now", "Starts the unit and links it to boot", "Links the unit so it starts on boot, without necessarily starting it now", "Tails the journal"], 2, "enable installs the boot hook. start runs it now. enable --now does both.", "systemd-packages-logs"),
      tf("l8", "beginner", "rm -rf $BUILD_DIR is safe if the variable is usually set.", false, "If BUILD_DIR is empty, the command can target the current directory or worse, depending on how it is written. Unset variables and missing quotes are how cleanup scripts destroy machines.", "linux-filesystem-commands"),
    ],
  },
  {
    id: "git",
    title: "Git and GitHub",
    summary: "Areas of Git, merging, history safety, and reviews.",
    moduleId: "m3",
    minutes: 12,
    questions: [
      mc("g1", "beginner", "What does git add update?", ["The remote repository", "The index (staging area)", "Only the last tag", "GitHub branch protection"], 1, "The index is the proposed next commit. The remote changes only when you push.", "git-fundamentals-branching"),
      mc("g2", "beginner", "You already pushed a bad commit to a shared branch. The safest undo is:", ["git reset --hard and git push --force", "git revert", "Delete the local clone", "git stash"], 1, "revert creates a new commit. Force-pushing a reset rewrites other people's history.", "git-safety-workflows"),
      tf("g3", "beginner", "A pull request is a Git object stored in every clone.", false, "A pull request is a feature of the forge (GitHub, GitLab). Git itself has commits, trees, and refs.", "github-collaboration"),
      mc("g4", "intermediate", "A secret was committed and then removed in a later commit. What else is required?", ["Nothing, git is encrypted", "Rotate the secret, because history and other clones may still contain it", "chmod 600 on the repository", "Squash merge only on the next PR"], 1, "Deleting the file does not remove it from old commits. Assume the secret is compromised and rotate it.", "git-safety-workflows"),
      short("g5", "beginner", "What is a merge conflict, in one or two sentences?", "Two branches changed the same lines, and Git will not choose a side. You edit the file to the intended result, remove the markers, and commit.", "Conflicts are ordinary. Blindly taking 'ours' is how features disappear.", "git-fundamentals-branching"),
      mc("g6", "beginner", "Semantic version 2.4.0 to 3.0.0 signals:", ["A documentation typo", "A backward-compatible feature", "A breaking change", "A build number only"], 2, "MAJOR is for incompatible changes. MINOR is compatible features. PATCH is compatible fixes.", "github-collaboration"),
      tf("g7", "intermediate", "Trunk-based development means nobody uses branches at all.", false, "People still use short-lived branches. The point is to integrate into the trunk very frequently rather than keep long-lived release branches.", "git-safety-workflows"),
      mc("g8", "beginner", "git fetch does what, compared with git pull?", ["Deletes remote branches", "Updates remote-tracking refs and does not merge by itself", "Always creates a merge commit", "Pushes your commits"], 1, "fetch updates what you know about the remote. pull is fetch plus merge or rebase.", "git-fundamentals-branching"),
    ],
  },
  {
    id: "scripting-builds",
    title: "Scripting and Maven",
    summary: "Bash safety, Python automation, and the Maven lifecycle.",
    moduleId: "m4",
    minutes: 12,
    questions: [
      mc("s1", "beginner", "Which quoting preserves a variable and also prevents word-splitting?", ["Unquoted $FILE", "\"$FILE\"", "'$FILE' which also expands the variable", "`$FILE`"], 1, "Double quotes expand variables without splitting. Single quotes do not expand. Unquoted values split on spaces.", "bash-scripting-fundamentals"),
      mc("s2", "intermediate", "set -o pipefail changes which behavior?", ["The shell ignores unset variables", "A pipeline fails if any command in it fails, not only the last", "The script becomes idempotent", "Bash switches to Python"], 1, "-u is unset variables. -e is exit on error. pipefail is the pipeline status.", "bash-scripting-fundamentals"),
      tf("s3", "intermediate", "subprocess.run with shell=True and a formatted string is the safest way to pass user input.", false, "Pass an argument list and keep shell=False so metacharacters are not interpreted.", "python-for-devops"),
      mc("s4", "beginner", "mvn test runs which phases?", ["Only the test phase, skipping compile", "Every phase up to and including test", "Only deploy", "package, then it stops before tests"], 1, "Requesting a phase runs the lifecycle up to that phase.", "maven-build-lifecycle"),
      short("s5", "beginner", "Why pin dependency versions instead of using a floating latest?", "A later resolution can change the bytes you ship without a code change, so CI no longer matches what you reviewed. Pins make builds repeatable.", "latest is convenient and non-deterministic.", "reproducible-builds"),
      mc("s6", "beginner", "An idempotent script:", ["Always appends a new line to a config file", "Can run more than once and still leave the desired state", "Must be written in Bash", "Deletes and recreates the server every time"], 1, "The outcome, not the tool, defines idempotency.", "safe-automation"),
      tf("s7", "beginner", "A Spring Boot executable jar is produced only by the compiler, with no packaging plugin involved.", false, "The spring-boot-maven-plugin repackages the jar so it can be started with java -jar.", "maven-build-lifecycle"),
      mc("s8", "intermediate", "Gradle differs from Maven mainly because:", ["Gradle cannot build Java", "Gradle uses a task graph and a Groovy or Kotlin DSL, while Maven uses XML phases", "Gradle has no dependencies", "Gradle images are OCI layers"], 1, "Both resolve dependencies and produce artifacts. The model and the file format differ.", "artifacts-gradle-registries"),
    ],
  },
  {
    id: "cicd",
    title: "CI/CD systems",
    summary: "Pipeline design, GitHub Actions, Jenkins, and failures.",
    moduleId: "m6",
    minutes: 14,
    questions: [
      mc("c1", "beginner", "A fail-closed pipeline means:", ["Failures are ignored so deploys stay fast", "A failed required check stops the release of that change", "The cluster rejects all traffic", "Tests run only on Fridays"], 1, "The point of CI is to make failure cheaper than a production incident.", "cicd-pipeline-fundamentals"),
      mc("c2", "intermediate", "Which GitHub Actions permission is the better default for a test workflow?", ["permissions: write-all", "A token that can administer the organization", "contents: read, plus only the extra scopes you can justify", "No permissions key, and hope the default is tiny"], 2, "Least privilege. Defaults have changed over time, so set them explicitly.", "github-actions-spring-boot"),
      tf("c3", "intermediate", "Jenkins agents should generally run untrusted builds on the controller process.", false, "The controller coordinates. Builds run on agents so a job cannot trivially take over the scheduler.", "jenkins-declarative-pipelines"),
      mc("c4", "beginner", "In a declarative Jenkinsfile, sh steps belong inside:", ["The agent label only", "stage steps", "The plugins page only", "A Dockerfile FROM line"], 1, "pipeline, agent, stages, stage, steps is the usual nesting.", "jenkins-declarative-pipelines"),
      short("c5", "intermediate", "Tests pass locally and fail in CI with 'file not found' for target/app.jar. What do you verify?", "That the package step actually ran before the step that needs the jar, that the path matches the artifact name, and that a clean workspace is being used rather than a laptop leftover.", "Order and paths cause this more often than 'CI is broken'.", "pipeline-debugging"),
      mc("c6", "beginner", "GitLab CI job scripts typically run:", ["Only on the developer's laptop", "Inside the job's container image on a runner", "Inside etcd", "As a Kubernetes probe"], 1, "image: selects the environment. The runner executes the script.", "gitlab-ci-comparison"),
      tf("c7", "intermediate", "Caching Maven in CI can never restore stale or wrong outputs.", false, "Caches key on files you choose. A bad key can restore an incompatible repository or hide a real download failure.", "pipeline-debugging"),
      mc("c8", "intermediate", "Production deploy credentials in CI should be available to:", ["Every pull request from a fork", "The deployment environment or protected branch, not untrusted PR jobs", "The README", "The Docker build ARG so they are easy to inspect"], 1, "Forks and build logs are the wrong place for production secrets.", "cicd-pipeline-fundamentals"),
    ],
  },
  {
    id: "docker",
    title: "Containers",
    summary: "Images, Dockerfiles, Compose, and hardening.",
    moduleId: "m7",
    minutes: 14,
    questions: [
      mc("d1", "beginner", "A container differs from a virtual machine because:", ["It always includes a separate guest kernel", "It shares the host kernel and isolates a process", "It cannot have a filesystem", "It is the same thing as a registry"], 1, "Containers use kernel isolation features. VMs virtualize hardware and boot a guest kernel.", "docker-fundamentals"),
      tf("d2", "beginner", "Moving a tag on a registry changes which digest that tag points at.", true, "Tags are mutable names. Digests identify content. Production pins prefer digests.", "docker-fundamentals"),
      mc("d3", "intermediate", "Which Dockerfile practice keeps dependency downloads cached when only source changes?", ["COPY . . as the first instruction", "Copy the build manifest, resolve dependencies, then copy source", "Use ADD on a secrets directory", "Run as root so cache is global"], 1, "Layers invalidate from the first changed instruction downward.", "optimized-dockerfile"),
      mc("d4", "intermediate", "Inside Compose, the app should reach Postgres using:", ["localhost", "The service name on the Compose network", "The host's public IP always", "0.0.0.0 as the database hostname"], 1, "localhost is the app container itself. Compose DNS uses the service name.", "docker-compose-postgres"),
      short("d5", "intermediate", "Why is mounting the Docker socket into an application container risky?", "The socket is effectively root-equivalent access to the host's Docker daemon. A process that can talk to it can start privileged containers and escape the isolation you thought you had.", "Convenience volume mounts are a common hardening miss.", "container-security"),
      mc("d6", "beginner", "CMD and ENTRYPOINT in exec form:", ["Are ignored by the runtime", "Avoid an extra shell, so signals reach the process", "Always run as root", "Publish ports"], 1, "Shell form wraps a shell, which can swallow SIGTERM. Exec form is the better default for servers.", "docker-fundamentals"),
      tf("d7", "beginner", "EXPOSE publishes the port on the host by itself.", false, "EXPOSE is documentation and a hint. Publishing is -p or a Compose ports mapping.", "docker-fundamentals"),
      mc("d8", "intermediate", "A named volume is used for Postgres so that:", ["The image becomes smaller", "Data survives container recreation", "Secrets are encrypted", "The app can bind port 80 without root"], 1, "The container filesystem is disposable. The volume is the durable disk for that data.", "docker-compose-postgres"),
    ],
  },
  {
    id: "cloud-iac",
    title: "AWS, Terraform, and Ansible",
    summary: "Identity, networks, plans, and configuration management.",
    moduleId: "m8",
    minutes: 14,
    questions: [
      mc("a1", "intermediate", "The safer pattern for an app on EC2 is:", ["An access key in the AMI", "An instance IAM role with a narrow policy", "The account root user", "A key shared in Slack"], 1, "Roles issue temporary credentials. Keys in images leak.", "aws-core-services"),
      mc("a2", "beginner", "A subnet is public when:", ["Its name contains public", "Its route table sends internet traffic to an internet gateway", "It has a private CIDR", "CloudWatch is enabled"], 1, "Routing defines it. Names are just labels.", "aws-core-services"),
      tf("a3", "beginner", "NAT gateways are free in every AWS region.", false, "They have hourly and data charges. Learning accounts forget them and keep paying.", "aws-cost-and-other-clouds"),
      mc("a4", "intermediate", "You should stop a Terraform apply when the plan unexpectedly shows:", ["Formatting changes only", "Resource destroys you did not intend", "A variable description edit with no infrastructure change", "terraform fmt differences"], 1, "Destroys delete real infrastructure. Read them before you approve.", "terraform-fundamentals"),
      short("a5", "intermediate", "Why keep Terraform state out of git?", "State contains real resource IDs and often secrets, and shared copies race. Use a remote backend with access control and locking.", "tfstate is not source code.", "terraform-fundamentals"),
      mc("a6", "beginner", "Ansible is primarily used to:", ["Replace DNS", "Configure existing machines toward a described state", "Store container layers", "Issue TLS certificates for browsers automatically"], 1, "Terraform usually provisions; Ansible usually configures. The line can blur, but the default split is useful.", "ansible-fundamentals"),
      tf("a7", "intermediate", "An Ansible shell task is automatically idempotent.", false, "Shell runs whatever you wrote. Modules such as apt and copy are designed to converge.", "ansible-fundamentals"),
      mc("a8", "beginner", "Which pairing is a reasonable cloud analogy?", ["Azure Blob storage and Amazon S3", "Azure Blob storage and AWS IAM", "Google IAM and Amazon S3", "Route 53 and a Linux chmod"], 0, "Both are object storage. Identity services map to identity services, not to buckets.", "aws-cost-and-other-clouds"),
    ],
  },
  {
    id: "kubernetes",
    title: "Kubernetes",
    summary: "Architecture, probes, and the usual broken Pod states.",
    moduleId: "m10",
    minutes: 14,
    questions: [
      mc("k1", "intermediate", "Which component stores Kubernetes cluster state?", ["kubelet", "etcd", "CoreDNS only", "A ConfigMap"], 1, "etcd is the datastore. The API server is the front door to it.", "kubernetes-architecture"),
      mc("k2", "beginner", "A Service with no endpoints often means:", ["The cluster has no nodes", "The selector does not match Pod labels, or no Pod is ready", "etcd is always down", "The image tag is latest"], 1, "Selectors are exact. A typo or a failing readiness probe both yield an empty endpoints set.", "kubernetes-troubleshooting"),
      tf("k3", "intermediate", "A Kubernetes Secret manifest encrypts the value so git is a safe place for it.", false, "The manifest field is base64, which is encoding, not encryption. Anyone with the YAML can read it.", "kubernetes-workloads"),
      mc("k4", "intermediate", "CrashLoopBackOff means:", ["The scheduler cannot find a node", "The container starts and then exits, and Kubernetes is delaying restarts", "The image registry returned 401 only", "The Service is type LoadBalancer"], 1, "Look at logs --previous. Image pull failures are a different status.", "kubernetes-troubleshooting"),
      short("k5", "intermediate", "When should a dependency check be readiness rather than liveness?", "When the process is fine but should not receive traffic until a dependency is up. Liveness would restart healthy Pods and can amplify the outage.", "Probe choice is a common interview scenario.", "kubernetes-workloads"),
      mc("k6", "beginner", "kind and minikube are:", ["Managed production control planes", "Local Kubernetes environments for learning and tests", "Container registries", "Replacements for IAM"], 1, "They are labs. They are not a high-availability production design.", "kubernetes-fit"),
      tf("k7", "beginner", "A Pod is the smallest unit Kubernetes schedules.", true, "Containers run inside Pods. You do not schedule a container on its own.", "kubernetes-architecture"),
      mc("k8", "advanced", "A Pending Pod that mentions insufficient cpu is waiting on:", ["A liveness probe", "Scheduling, because requests do not fit any node", "An Ingress certificate", "Helm values only"], 1, "Requests are what the scheduler uses. Limits do not place the Pod.", "kubernetes-troubleshooting"),
    ],
  },
  {
    id: "operate-secure",
    title: "Observability, security, and releases",
    summary: "Signals, SLOs, scanners, deployment strategies, and incidents.",
    moduleId: "m11",
    minutes: 15,
    questions: [
      mc("o1", "beginner", "Which set is the four golden signals?", ["CPU, RAM, disk, network cards", "Latency, traffic, errors, saturation", "Build time, image size, PR count, lines of code", "RPO, RTO, SLA, VPC"], 1, "They describe user-facing health, not only host inventory.", "sli-slo-golden-signals"),
      mc("o2", "intermediate", "99.9% availability over a 30-day month allows about how much downtime?", ["4 minutes", "43 minutes", "7 hours", "3 days"], 1, "0.1% of about 30 days is roughly 43 minutes. Interviewers like the order of magnitude.", "sli-slo-golden-signals"),
      tf("o3", "intermediate", "A high-cardinality label such as user id is a good Prometheus label.", false, "Each unique combination is a series. User ids will overwhelm memory and cost.", "prometheus-and-grafana"),
      mc("o4", "intermediate", "SAST is best described as:", ["Scanning a running production URL from outside", "Analyzing source or bytecode for bug patterns without executing the app", "A cloud bill report", "A Kubernetes liveness probe"], 1, "DAST exercises a running app. SCA looks at dependencies. SAST looks at your code.", "devsecops-pipeline-security"),
      short("o5", "intermediate", "Why can a database migration make rollback unsafe?", "The new schema may be unreadable by the previous application version, so pointing traffic back would start errors or data loss. Expand/contract migrations avoid that by staying compatible in both directions for one release.", "Rollback is not free once data changes shape.", "deployment-strategies-rollbacks"),
      mc("o6", "beginner", "The first move when error rate spikes immediately after a compatible deploy is usually:", ["Rewrite the service in another language", "Roll back the artifact and confirm the same graph", "Open SSH from 0.0.0.0/0 to collect logs", "Disable TLS to rule out certificates"], 1, "Mitigate with the change you just made, then investigate. Do not open the network or weaken TLS as a diagnostic.", "incident-response-troubleshooting"),
      tf("o7", "beginner", "A database replica is a sufficient backup.", false, "Replicas copy bad writes, including deletes. Backups are separate point-in-time copies you have restored in a drill.", "backup-dr-ha"),
      mc("o8", "advanced", "Which DORA metric is change failure rate?", ["How often you deploy", "The percentage of changes that cause a failure in production", "Time to compile", "Number of dashboards"], 1, "Frequency, lead time, change failure rate, and recovery time are the four.", "finops-dora-aiops"),
    ],
  },
];

export function getQuiz(id: string): Quiz | undefined {
  return quizzes.find((quiz) => quiz.id === id);
}
