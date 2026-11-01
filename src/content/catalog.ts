import type { Difficulty, ModuleInfo, Topic } from "./types";

export const modules: ModuleInfo[] = [
  {
    id: "m0",
    slug: "foundations",
    number: 0,
    title: "DevOps Foundations",
    summary: "What DevOps is, who does the work, and how a change is supposed to move from idea to production.",
    outcomes: ["Explain DevOps without equating it to a tool", "Separate CI, delivery, and deployment", "Set honest expectations for a junior role"],
  },
  {
    id: "m1",
    slug: "networking",
    number: 1,
    title: "Networking Fundamentals",
    summary: "Addresses, names, transports, and the path of an HTTP request. Enough to debug connectivity instead of guessing.",
    outcomes: ["Read a CIDR and a DNS record", "Explain TCP, UDP, and TLS at a useful level", "Choose the right diagnostic command"],
  },
  {
    id: "m2",
    slug: "linux",
    number: 2,
    title: "Linux and Operating Systems",
    summary: "The shell, filesystem, permissions, processes, and services you will touch on almost every server and container host.",
    outcomes: ["Move around the filesystem safely", "Reason about permissions and processes", "Inspect logs and services"],
  },
  {
    id: "m3",
    slug: "git",
    number: 3,
    title: "Git and GitHub",
    summary: "Version control as a daily tool: commits, branches, reviews, and recovering without destroying someone else's work.",
    outcomes: ["Commit and branch deliberately", "Resolve a merge conflict", "Keep secrets out of history"],
  },
  {
    id: "m4",
    slug: "scripting",
    number: 4,
    title: "Bash and Python Automation",
    summary: "Small programs that check health, parse files, and call APIs without becoming production hazards.",
    outcomes: ["Write a safe shell script", "Use Python for JSON and HTTP", "Prefer idempotent automation"],
  },
  {
    id: "m5",
    slug: "builds",
    number: 5,
    title: "Build Tools and Artifacts",
    summary: "How source becomes a versioned artifact, with Maven as the worked example and Gradle as a comparison.",
    outcomes: ["Read a Maven lifecycle", "Identify the artifact you will deploy", "Explain why builds should be reproducible"],
  },
  {
    id: "m6",
    slug: "cicd",
    number: 6,
    title: "CI/CD and Pipeline Engineering",
    summary: "Pipelines that build, test, and publish on every change, compared across GitHub Actions, Jenkins, and GitLab CI.",
    outcomes: ["Design a fail-closed pipeline", "Read a GitHub Actions workflow", "Read a Jenkins declarative pipeline"],
  },
  {
    id: "m7",
    slug: "docker",
    number: 7,
    title: "Containers and Docker",
    summary: "Images, containers, multi-stage builds, and Compose for a Spring Boot service with PostgreSQL.",
    outcomes: ["Build and run a container", "Write a smaller, non-root image", "Compose an app with a database"],
  },
  {
    id: "m8",
    slug: "aws",
    number: 8,
    title: "Cloud Computing and AWS",
    summary: "Regions, identity, networks, compute, storage, and the cost habits that keep a learning account from becoming a bill.",
    outcomes: ["Draw a simple VPC", "Explain IAM roles versus users", "Name the cost risks of common services"],
  },
  {
    id: "m9",
    slug: "iac",
    number: 9,
    title: "Infrastructure as Code",
    summary: "Terraform for provisioning and Ansible for configuration, including what must be true before you apply anything.",
    outcomes: ["Read a Terraform plan", "Explain state and drift", "Write an idempotent Ansible play"],
  },
  {
    id: "m10",
    slug: "kubernetes",
    number: 10,
    title: "Kubernetes",
    summary: "Cluster architecture, core objects, and the failure modes you will actually debug. Includes when not to use a cluster.",
    outcomes: ["Explain Pods, Deployments, and Services", "Debug CrashLoopBackOff and ImagePullBackOff", "Decide when Kubernetes is the wrong tool"],
  },
  {
    id: "m11",
    slug: "observability",
    number: 11,
    title: "Monitoring and SRE Basics",
    summary: "Golden signals, Prometheus, Grafana, SLOs, logs, traces, and alerts that a human can act on.",
    outcomes: ["Distinguish metrics, logs, and traces", "Read a basic PromQL query", "Write an alert that pages on symptoms"],
  },
  {
    id: "m12",
    slug: "devsecops",
    number: 12,
    title: "DevSecOps",
    summary: "Security checks inside delivery: dependencies, images, secrets, infrastructure, and what scanners do not see.",
    outcomes: ["Place scans in a pipeline", "Handle secrets without printing them", "Talk about supply-chain controls honestly"],
  },
  {
    id: "m13",
    slug: "release",
    number: 13,
    title: "Deployment and Release Engineering",
    summary: "Rolling, blue-green, and canary releases, database compatibility, edge proxies, and rollbacks that are real.",
    outcomes: ["Compare deployment strategies", "Explain expand/contract migrations", "Write a rollback that names the artifact"],
  },
  {
    id: "m14",
    slug: "reliability",
    number: 14,
    title: "Incidents and Troubleshooting",
    summary: "A method for outages, plus backups, RPO/RTO, and paper simulations you can reason about without a production system.",
    outcomes: ["Troubleshoot from evidence", "Separate mitigation from root cause", "Define RPO and RTO with numbers"],
  },
  {
    id: "m15",
    slug: "advanced",
    number: 15,
    title: "Advanced and Emerging Practices",
    summary: "Optional, role-dependent topics: platform engineering, GitOps, FinOps, DORA, and the limits of AI in operations.",
    outcomes: ["Know what GitOps reconciles", "Define the four DORA metrics", "Decide what to postpone"],
    optional: true,
  },
  {
    id: "m16",
    slug: "career",
    number: 16,
    title: "Career Preparation",
    summary: "Junior expectations, a 30/60/90 study plan, and how to talk about labs without inflating them into production experience.",
    outcomes: ["List defensible skills", "Explain a project with trade-offs", "Practice interview answers out loud"],
  },
];

const t = (
  slug: string,
  moduleId: string,
  title: string,
  summary: string,
  difficulty: Difficulty,
  minutes: number,
  depth: Topic["depth"],
  objectives: string[],
  prerequisites: string[],
  tags: string[],
  brief: string,
): Topic => ({
  slug,
  moduleId,
  title,
  summary,
  difficulty,
  minutes,
  depth,
  objectives,
  prerequisites,
  tags,
  brief,
});

export const topics: Topic[] = [
  t("what-is-devops", "m0", "What Is DevOps?", "A precise definition, the problems it exists to solve, and the roles people confuse with it.", "beginner", 28, "full", ["Define DevOps as a way of working", "Compare Dev, Ops, SRE, and platform engineering", "Reject the myth that DevOps is only YAML"], [], ["devops", "calms", "culture"], "DevOps is the practice of shipping small changes quickly while keeping systems reliable. It grew out of the conflict between teams rewarded for change and teams rewarded for stability."),
  t("problems-devops-solves", "m0", "Problems DevOps Solves", "Handoffs, snowflake servers, and feedback that arrives after the damage.", "beginner", 14, "primer", ["Name the delays in a traditional release", "Explain snowflake servers", "Connect long lead time to risk"], ["what-is-devops"], ["lead time", "toil"], "Most release pain is queue time between teams, not compile time. A server that was hand-edited cannot be recreated, so the next incident starts from mystery state."),
  t("team-roles", "m0", "Roles: Dev, Ops, QA, SRE, Platform, Cloud", "What each title tends to own, and why the titles differ by company.", "beginner", 16, "primer", ["Distinguish SRE from classic operations", "Describe a platform team as a product team", "Set scope for a junior"], ["what-is-devops"], ["sre", "platform"], "Developers change the product. Operations traditionally ran it. SRE uses error budgets to negotiate reliability. Platform teams build the paved road other engineers deploy on."),
  t("culture-calms", "m0", "Culture, CALMS, and Feedback", "Culture, Automation, Lean, Measurement, and Sharing — without the poster version.", "beginner", 15, "primer", ["Expand CALMS", "Explain blameless as specific, not soft", "Identify a feedback loop in delivery"], ["what-is-devops"], ["calms", "culture"], "CALMS is a lens: culture, automation, lean flow, measurement, and sharing. Blameless reviews still name the broken control; they do not pretend nobody owns the follow-up."),
  t("sdlc-agile", "m0", "SDLC, Agile, Scrum, and Kanban", "How work is sliced and why operability belongs in the definition of done.", "beginner", 16, "primer", ["Contrast waterfall and agile", "Compare Scrum and Kanban", "Add operability to done"], ["what-is-devops"], ["agile", "scrum", "kanban"], "Waterfall discovers integration risk at the end. Agile slices work so that risk shows up weekly. A story is not done if it cannot be deployed, observed, and reverted."),
  t("ci-cd-terms", "m0", "CI, Delivery, and Deployment", "Three terms that interviews use to see whether you are careful.", "beginner", 14, "primer", ["Define continuous integration", "Separate the two CD meanings", "Give an example of each"], ["sdlc-agile"], ["ci", "cd"], "Continuous integration means merging and testing small changes frequently. Continuous delivery means the artifact is always deployable. Continuous deployment means production updates without a manual gate."),
  t("devops-lifecycle", "m0", "The DevOps Lifecycle", "The infinity loop as a flow of one change, not a logo.", "beginner", 30, "full", ["Walk a change through the loop", "Define lead time, cycle time, and MTTR", "See where juniors actually work"], ["ci-cd-terms"], ["lifecycle", "feedback"], "Plan, code, build, test, release, deploy, operate, and monitor only matter if monitor changes the next plan. The same artifact should move forward; production should not be a second build."),
  t("junior-role", "m0", "A Junior DevOps Day", "Tickets, pipelines, access, shadowing incidents, and what is out of scope.", "beginner", 14, "primer", ["Describe a realistic week", "List work you should not pretend to own", "See how documentation is part of the job"], ["devops-lifecycle"], ["career", "junior"], "Juniors fix pipeline failures, write small automation, update runbooks, and shadow incidents. They are not usually the person who redesigns the production network in month one."),
  t("learning-milestones", "m0", "Skills Roadmap and Milestones", "A sequence that compounds, with an explicit ceiling on what 90 days can mean.", "beginner", 12, "primer", ["Order the skills", "Define job-ready without exaggeration", "Choose what to defer"], ["junior-role"], ["roadmap"], "Comfort with Linux and Git comes before a pipeline. A pipeline comes before a cluster. Ninety days of study can make you a credible beginner, not an expert operator."),
  t("ip-subnetting", "m1", "IP Addresses, CIDR, and Subnets", "IPv4, IPv6, private ranges, and a worked subnet.", "beginner", 18, "primer", ["Read a CIDR prefix", "Name private IPv4 ranges", "Count hosts in a small subnet"], [], ["ip", "cidr", "ipv6"], "An IPv4 address plus a prefix length is a network and a host portion. 10.0.0.0/8, 172.16.0.0/12, and 192.168.0.0/16 are private. IPv6 is the larger address family, not a different internet."),
  t("tcp-udp-dns-http", "m1", "TCP, UDP, DNS, HTTP, and HTTPS", "Transports, name resolution, the HTTP message, and TLS.", "beginner", 40, "full", ["Explain the TCP handshake and when UDP fits", "Read common DNS record types", "Interpret HTTP status codes and certificate chains"], ["ip-subnetting"], ["tcp", "dns", "http", "tls"], "DNS turns a name into an address. TCP provides an ordered stream. TLS authenticates the server and encrypts that stream. HTTP is the application message, which is why HTTPS is HTTP over TLS rather than a different protocol."),
  t("routing-nat-security", "m1", "Routing, NAT, Firewalls, and SSH", "How a packet chooses a next hop and what a security group actually filters.", "beginner", 16, "primer", ["Explain a default gateway", "Contrast NAT with a firewall", "Describe SSH versus a VPN"], ["tcp-udp-dns-http"], ["nat", "firewall", "ssh"], "A host sends unknown destinations to its default gateway. NAT rewrites addresses so many private hosts can share a public one. A firewall filters; NAT alone is not a security policy."),
  t("network-commands", "m1", "Network Troubleshooting Commands", "ping, curl, dig, ss, ip, and traceroute — and what each one fails to prove.", "beginner", 16, "primer", ["Pick a command for a symptom", "Read a short illustrative result", "Avoid claiming a green ping means the app works"], ["tcp-udp-dns-http"], ["dig", "curl", "ss"], "ping proves a basic reachability path, not HTTP. curl shows the status line. dig shows DNS answers. ss shows sockets. traceroute shows hops until something stops answering."),
  t("linux-filesystem-commands", "m2", "Linux Filesystem and Essential Commands", "The tree, everyday commands, pipes, and redirection.", "beginner", 36, "full", ["Navigate and inspect files", "Compose pipelines", "Use rm without gambling"], [], ["linux", "shell", "fhs"], "The shell is a program that runs other programs. Paths are strings the kernel resolves. Pipes connect stdout to stdin. Exit codes are how scripts learn that a command failed."),
  t("linux-permissions-processes", "m2", "Permissions and Processes", "Users, modes, sudo, signals, and how to see what a machine is doing.", "beginner", 34, "full", ["Compute a mode such as 640", "Signal a process safely", "Read a process list"], ["linux-filesystem-commands"], ["chmod", "sudo", "signals"], "Every file has an owner, a group, and a mode. Every process has a user and a PID. SIGTERM asks a process to exit; SIGKILL cannot be handled and skips cleanup."),
  t("systemd-packages-logs", "m2", "systemd, Packages, and Logs", "Services on modern Linux, and where their logs go.", "beginner", 16, "primer", ["Use systemctl for status and enablement", "Read journalctl for one unit", "Update packages without confusing the commands"], ["linux-permissions-processes"], ["systemd", "journalctl", "apt"], "systemd starts units and restarts them according to policy. journalctl reads the journal. apt and dnf install software from distro repositories; they are not interchangeable commands."),
  t("shell-ssh-scheduling", "m2", "Shell Environment, SSH, and Scheduling", "PATH, keys, copy tools, archives, and cron.", "beginner", 16, "primer", ["Explain PATH lookup", "Create an SSH key pair safely", "Read a five-field cron expression"], ["linux-filesystem-commands"], ["ssh", "cron", "path"], "PATH is the ordered list of directories the shell searches. An SSH private key is a secret. Cron runs with a minimal environment, which is why scripts that work interactively fail at night."),
  t("linux-troubleshooting", "m2", "Linux Troubleshooting Scenarios", "Disk full, permission denied, and a service that will not start.", "intermediate", 16, "primer", ["Apply a short diagnostic order", "Check disk and logs", "Name a safe remediation"], ["systemd-packages-logs"], ["troubleshooting", "disk"], "Start with the symptom and the last change. df shows fullness; du finds the directory; journalctl shows why a unit exited. Deleting the newest log is sometimes right and sometimes how you destroy evidence."),
  t("git-fundamentals-branching", "m3", "Git Fundamentals and Branching", "The three local areas, history, branches, merges, and conflicts.", "beginner", 36, "full", ["Explain working tree, index, and repository", "Create and merge a branch", "Resolve a conflict on purpose"], ["linux-filesystem-commands"], ["git", "branch", "merge"], "Git stores snapshots. The index is the proposed next snapshot. A branch is a name pointing at a commit. A conflict means two edits touched the same region and Git will not guess."),
  t("github-collaboration", "m3", "GitHub Collaboration", "Remotes, pull requests, protection rules, tags, and commit messages.", "beginner", 16, "primer", ["Push and open a pull request", "Describe branch protection", "Write a useful commit message"], ["git-fundamentals-branching"], ["github", "pull request"], "origin is just the default remote name. A pull request is a conversation around a diff. Tags name releases. Semantic versions communicate breaking changes."),
  t("git-safety-workflows", "m3", "Workflows and Recovering Safely", "Feature branches, trunk-based development, GitFlow, reset, and revert.", "intermediate", 16, "primer", ["Choose a workflow for a small team", "Revert a pushed commit", "Remove a secret from use, not only from the file"], ["github-collaboration"], ["revert", "gitignore"], "Reverting creates a new commit that undoes another. Reset rewrites local history and is dangerous once you have pushed. A leaked token must be rotated even after you delete the file."),
  t("bash-scripting-fundamentals", "m4", "Bash Scripting Fundamentals", "Quoting, control flow, functions, and set -euo pipefail.", "beginner", 34, "full", ["Quote expansions correctly", "Explain set -euo pipefail and its gaps", "Return a useful exit status"], ["shell-ssh-scheduling"], ["bash", "scripting"], "Unquoted expansions split on spaces. set -e exits on many failures, -u catches unset variables, and pipefail makes a pipeline fail if any stage fails. None of that replaces checking inputs."),
  t("python-for-devops", "m4", "Python for DevOps Automation", "Files, JSON, HTTP, subprocess, and virtual environments.", "beginner", 34, "full", ["Choose Python over Bash for structured data", "Call a process without shell=True", "Pin dependencies"], ["bash-scripting-fundamentals"], ["python", "json", "venv"], "Python is the better default when you parse JSON, talk to APIs, or need real exceptions. A virtual environment keeps those libraries off the system interpreter. subprocess should take an argument list, not a shell string."),
  t("safe-automation", "m4", "Idempotency, Retries, and Safety", "Scripts that can run twice and still be boring.", "intermediate", 14, "primer", ["Define idempotency", "Add timeouts and backoff", "Keep cron from using your interactive environment"], ["python-for-devops"], ["idempotency", "retries"], "An idempotent action leaves the system in the desired state whether it runs once or five times. Retries need a timeout and a reason to believe the next try might work. Blind retries can amplify an outage."),
  t("maven-build-lifecycle", "m5", "Maven Build Lifecycle", "pom coordinates, phases, plugins, and the Spring Boot jar you actually ship.", "beginner", 32, "full", ["Read groupId, artifactId, and version", "Run the correct phase", "Find the executable jar"], ["git-fundamentals-branching"], ["maven", "java"], "Maven binds goals to phases. mvn test runs the phases up through test. The Spring Boot plugin repackages a jar so java -jar works. The file in target/ is the artifact, not the source tree."),
  t("artifacts-gradle-registries", "m5", "Gradle, JARs, and Registries", "Where artifacts live after the build, and how Gradle differs.", "beginner", 14, "primer", ["Contrast Maven and Gradle", "Explain a registry", "List common Java archive types"], ["maven-build-lifecycle"], ["gradle", "nexus"], "A registry stores versioned artifacts and their checksums. Gradle is another build tool with a task graph. You do not need to memorize both DSLs to read a build log."),
  t("reproducible-builds", "m5", "Reproducible Builds and Supply Chain Basics", "Pins, caches, and why latest is not a version.", "intermediate", 14, "primer", ["Explain why CI should not float dependencies", "Describe a checksum", "Name a dependency-confusion risk"], ["maven-build-lifecycle"], ["supply chain", "lockfile"], "A build that can change because a repository published a new transitive dependency is not the build you tested. Pin versions, cache deliberately, and treat unexpected new artifacts as suspicious."),
  t("cicd-pipeline-fundamentals", "m6", "CI/CD Pipeline Fundamentals", "Stages, triggers, secrets, approvals, and failure as a feature.", "beginner", 32, "full", ["List a sensible stage order", "Explain fail-closed", "Separate CI from deployment permissions"], ["maven-build-lifecycle", "ci-cd-terms"], ["pipeline", "ci"], "A pipeline is the executable form of your delivery policy. Tests that can be skipped are not tests. Production credentials do not belong on the pull-request runner that builds untrusted forks."),
  t("github-actions-spring-boot", "m6", "GitHub Actions for Spring Boot", "A workflow that checks out, tests, and packages a Maven service.", "intermediate", 36, "full", ["Read on, jobs, and steps", "Cache Maven safely", "Set least-privilege permissions"], ["cicd-pipeline-fundamentals"], ["github actions", "yaml"], "A workflow file in .github/workflows is CI configuration as code. actions/checkout gets the commit. setup-java can cache Maven. The workflow should declare permissions instead of inheriting write access."),
  t("jenkins-declarative-pipelines", "m6", "Jenkins Declarative Pipelines", "Controller, agents, Jenkinsfile, and credentials.", "intermediate", 32, "full", ["Explain controller versus agent", "Read a declarative Jenkinsfile", "Compare Jenkins with GitHub Actions"], ["cicd-pipeline-fundamentals"], ["jenkins", "jenkinsfile"], "Jenkins splits a controller that schedules work from agents that run it. A Jenkinsfile keeps the pipeline next to the code. Plugins are part of your supply chain."),
  t("gitlab-ci-comparison", "m6", "GitLab CI and a Fair Comparison", "Enough .gitlab-ci.yml to read a job, plus an honest comparison.", "intermediate", 16, "primer", ["Identify stages and script", "Compare three CI systems", "Avoid declaring a universal winner"], ["cicd-pipeline-fundamentals"], ["gitlab"], "GitLab CI uses .gitlab-ci.yml, shared or project runners, and a job script that runs in a container image. The best system is the one your team will actually maintain."),
  t("pipeline-debugging", "m6", "Debugging Pipeline Failures", "Logs first, then local reproduction, caches, and path mistakes.", "intermediate", 14, "primer", ["Read a failed step", "Suspect cache and working directory", "Describe a flaky test"], ["github-actions-spring-boot"], ["flaky", "debug"], "The failed step's log is the evidence. Reproduce the command locally before you rerun the job ten times. A cache that restores the wrong branch's build output will waste an afternoon."),
  t("docker-fundamentals", "m7", "Docker Fundamentals", "Images, containers, registries, ports, and volumes.", "beginner", 36, "full", ["Contrast a VM and a container", "Map a host port", "Explain tags versus digests"], ["linux-filesystem-commands"], ["docker", "oci"], "A container is a process with isolation, not a small virtual machine. The image is the template. Publishing port 8080 does nothing useful if the process inside only listens on 127.0.0.1."),
  t("optimized-dockerfile", "m7", "Writing an Optimized Dockerfile", "Multi-stage builds, caching, and non-root runtime for Spring Boot.", "intermediate", 32, "full", ["Write a multi-stage Dockerfile", "Explain layer cache invalidation", "Run as a non-root user"], ["docker-fundamentals", "maven-build-lifecycle"], ["dockerfile", "multi-stage"], "The build stage has the JDK and Maven. The runtime stage copies the jar onto a smaller base and a user who is not root. Copying the entire source before resolving dependencies throws away the cache on every edit."),
  t("docker-compose-postgres", "m7", "Docker Compose with PostgreSQL", "Two services, a volume, a health check, and the hostname trap.", "intermediate", 30, "full", ["Write a compose file for app and database", "Wait for Postgres correctly", "Keep data on a named volume"], ["optimized-dockerfile"], ["compose", "postgres"], "Inside the Compose network the database host is the service name, not localhost. localhost inside the app container is the app container. A named volume keeps the data when you recreate the container."),
  t("container-security", "m7", "Container Security Basics", "Users, secrets, limits, scanning, and the Docker socket.", "intermediate", 14, "primer", ["List high-value hardening steps", "Explain why the socket is privileged", "Set a memory limit"], ["docker-fundamentals"], ["security", "trivy"], "Running as root, baking secrets into layers, and mounting the Docker socket are the mistakes that turn a container into a host compromise. Scanning an image shows known CVEs; it does not show a logic bug."),
  t("aws-core-services", "m8", "AWS IAM, EC2, VPC, S3, and CloudWatch", "The core services a junior is expected to recognize, with cost and safety limits.", "intermediate", 40, "full", ["Explain the shared responsibility model", "Describe a minimal VPC", "Write an IAM habit that avoids long-lived keys"], ["routing-nat-security"], ["aws", "iam", "vpc", "s3"], "AWS regions contain availability zones. IAM decides who may call an API. A VPC is your network. EC2 is a virtual machine. S3 is object storage. CloudWatch is where metrics and logs go. All of them can cost money."),
  t("aws-scaling-data-dns", "m8", "Load Balancing, Autoscaling, DNS, and RDS", "How a stateless app grows and how a database should not be exposed.", "intermediate", 16, "primer", ["Contrast ALB and a single instance", "Describe Multi-AZ at a high level", "Keep a database off the public internet"], ["aws-core-services"], ["alb", "rds", "route53"], "A load balancer spreads requests and fails out bad targets. An Auto Scaling group replaces instances. RDS Multi-AZ is a standby for availability, not a license to skip backups."),
  t("aws-containers-lambda-cli", "m8", "ECR, ECS, EKS, Lambda, and the CLI", "Which AWS compute option you are actually choosing.", "intermediate", 16, "primer", ["Place ECR, ECS, and EKS", "Say when Lambda fits", "Use a named CLI profile"], ["aws-core-services", "docker-fundamentals"], ["ecs", "eks", "lambda"], "ECR stores images. ECS runs containers with less cluster machinery than EKS. EKS is managed Kubernetes, and you still operate workloads. Lambda runs short functions. The CLI should use a profile, not keys in the shell history."),
  t("aws-cost-and-other-clouds", "m8", "Cost Safety, Azure, and Google Cloud", "Bills, cleanup, and equivalent names so AWS is not the only vocabulary.", "beginner", 14, "primer", ["List expensive easy mistakes", "Map a few Azure and GCP names", "State that this site creates no cloud resources"], ["aws-core-services"], ["finops", "azure", "gcp"], "NAT gateways, idle load balancers, forgotten volumes, and public IPv4 addresses are common learning-account surprises. Azure and Google Cloud have the same shapes under different names."),
  t("terraform-fundamentals", "m9", "Terraform Fundamentals", "Declarative infrastructure, plans, state, and a local example that does not touch a cloud.", "intermediate", 36, "full", ["Explain plan versus apply", "Treat state as sensitive", "Read a small HCL module boundary"], ["aws-core-services"], ["terraform", "iac"], "Terraform compares desired config with state and shows a plan. Apply is what changes the real world. State maps your names to remote IDs and may contain secrets. A local random/file example teaches the workflow without a bill."),
  t("ansible-fundamentals", "m9", "Ansible Fundamentals", "Inventories, playbooks, modules, handlers, and idempotency.", "intermediate", 30, "full", ["Contrast Ansible with Terraform", "Write a tiny playbook", "Explain a handler"], ["linux-filesystem-commands"], ["ansible", "playbook"], "Ansible connects to machines and brings them toward a described state. Modules are idempotent when you use them as intended; raw shell often is not. Terraform creates infrastructure; Ansible usually configures it."),
  t("iac-safety", "m9", "Safety, Drift, and Environments", "What to check before apply, and how dev stays separate from prod.", "intermediate", 14, "primer", ["Review a plan for destroys", "Separate state per environment", "Avoid admin keys on a laptop as a habit"], ["terraform-fundamentals"], ["drift", "state"], "If the plan says destroy and you do not know why, you stop. Production state should not be the same file as a sandbox. Drift is what appears when someone fixes production in the console."),
  t("kubernetes-architecture", "m10", "Kubernetes Architecture and Core Objects", "Control plane, Pods, Deployments, and Services.", "intermediate", 40, "full", ["Name the control plane components and their jobs", "Write a mental model of a Deployment", "Expose a Pod with a Service"], ["docker-fundamentals"], ["kubernetes", "pod", "deployment"], "The API server is the front door. etcd stores state. The scheduler places Pods. The kubelet starts them. A Deployment owns a ReplicaSet, which owns Pods. A Service selects those Pods with labels."),
  t("kubernetes-workloads", "m10", "Config, Probes, and Storage", "ConfigMaps, Secrets, probes, requests, and volumes.", "intermediate", 16, "primer", ["Choose a probe type", "Set requests and limits", "Explain why a Secret is not encryption"], ["kubernetes-architecture"], ["probes", "configmap"], "A liveness probe restarts a stuck container. A readiness probe removes it from Service endpoints. A Secret manifest is base64, not a vault. Requests are what the scheduler believes you need."),
  t("kubernetes-troubleshooting", "m10", "Kubernetes Troubleshooting", "CrashLoopBackOff, image pull errors, Pending Pods, and empty Services.", "intermediate", 34, "full", ["Use describe, logs, and events", "Match a symptom to a cause", "Roll back a Deployment"], ["kubernetes-architecture"], ["crashloopbackoff", "kubectl"], "The Events section is often the whole answer. ImagePullBackOff is registry or name. CrashLoopBackOff is the process exiting. Pending is scheduling. A Service with no endpoints is usually a selector or port mismatch."),
  t("helm-and-delivery", "m10", "Helm, Autoscaling, and Access Control", "Charts, HPA, taints, and RBAC at an introductory level.", "advanced", 16, "primer", ["Explain a Helm release", "Describe HPA inputs", "Contrast Role and ClusterRole"], ["kubernetes-workloads"], ["helm", "rbac"], "Helm templates a chart with values and installs a release. It can hide a lot of YAML, which is both the point and the risk. RBAC decides what a service account may ask the API to do."),
  t("kubernetes-fit", "m10", "When Kubernetes Is the Wrong Tool", "A local cluster for learning, and smaller production options.", "beginner", 12, "primer", ["Name signs you do not need a cluster", "Choose kind or minikube for practice", "Respect control-plane cost"], ["kubernetes-architecture"], ["kind", "minikube"], "Kubernetes pays off when you have many services and people who will operate the platform. A single Spring Boot app can live on Compose, a PaaS, or ECS. Learn with kind or minikube, not a forgotten EKS cluster."),
  t("prometheus-and-grafana", "m11", "Prometheus and Grafana", "Scrapes, labels, PromQL, dashboards, and symptom-based alerts.", "intermediate", 36, "full", ["Explain pull-based scraping", "Write a rate() query conceptually", "Warn about label cardinality"], ["kubernetes-architecture"], ["prometheus", "grafana", "promql"], "Prometheus scrapes text metrics and stores them as series. Counters need rate(). Grafana draws the queries. A label like user_id will explode the database. Alerts should fire when users are in pain or a limit is near."),
  t("sli-slo-golden-signals", "m11", "Golden Signals, SLIs, SLOs, and SLAs", "The vocabulary of reliability targets.", "intermediate", 16, "primer", ["Define the four golden signals", "Separate SLI, SLO, and SLA", "Estimate an error budget"], ["prometheus-and-grafana"], ["slo", "sli"], "Latency, traffic, errors, and saturation describe a service. An SLI is the measurement, an SLO is the target, and an SLA is a promise with consequences. 99.9% monthly availability is roughly 43 minutes of downtime."),
  t("logging-and-tracing", "m11", "Logs, Traces, and OpenTelemetry", "Structured logs, pipelines, and spans.", "intermediate", 14, "primer", ["Choose a log level", "Explain a correlation id", "Define a trace span"], ["prometheus-and-grafana"], ["opentelemetry", "logs"], "Logs are events. Metrics are aggregated numbers. Traces follow one request across processes. OpenTelemetry is the vendor-neutral way to emit the latter. None of them should contain secrets."),
  t("alerting-oncall", "m11", "Alerts, On-call, and Postmortems", "Pages, runbooks, and reviews that change the system.", "intermediate", 14, "primer", ["Write a page-worthy condition", "Describe escalation", "Outline a blameless review"], ["sli-slo-golden-signals"], ["oncall", "postmortem"], "Every page needs an action and a runbook. If the only action is to stare at a dashboard, it is not a page. A review records timeline, impact, contributing factors, and owners."),
  t("devsecops-pipeline-security", "m12", "DevSecOps Pipeline Security", "Where SAST, SCA, image scans, and IaC scans sit, and what they miss.", "intermediate", 34, "full", ["Place scanners in a pipeline", "Set a block-versus-warn policy", "Avoid printing secrets in logs"], ["cicd-pipeline-fundamentals"], ["devsecops", "trivy", "sast"], "Security checks that run only the week before release find problems when change is expensive. Dependency and image scanners catch known vulnerabilities. They do not understand your business rules."),
  t("secrets-and-supply-chain", "m12", "Secrets, SBOMs, and Signing", "Managers, rotation, provenance, and signing at concept level.", "intermediate", 14, "primer", ["Keep secrets out of images and git", "Define an SBOM", "Explain why signing matters"], ["devsecops-pipeline-security"], ["sbom", "secrets"], "A secret in a git history or an image layer will be copied. Rotation limits the window. An SBOM lists components. A signature tells you the image is the one your pipeline built."),
  t("owasp-and-hardening", "m12", "OWASP Awareness and Hardening", "Operator-relevant application risks and cluster boundaries.", "intermediate", 14, "primer", ["Name misconfiguration risks", "Recap least privilege", "Describe safe disclosure"], ["devsecops-pipeline-security"], ["owasp", "hardening"], "Broken access control and security misconfiguration are how operators accidentally expose data. Hardening is the boring defaults: non-root, closed networks, short-lived credentials, and patched components."),
  t("deployment-strategies-rollbacks", "m13", "Deployment Strategies and Rollbacks", "Recreate, rolling, blue-green, canary, and migrations that trap you.", "intermediate", 34, "full", ["Compare strategies with cost and rollback", "Explain expand/contract", "Write a rollback that is specific"], ["docker-fundamentals"], ["blue-green", "canary", "rollback"], "A rolling update replaces instances gradually. Blue-green runs two full stacks and switches. Canary exposes a slice of traffic. All of them fail if the new code cannot live with the current database schema."),
  t("nginx-tls-edge", "m13", "Nginx, TLS Termination, and Load Balancing", "The edge proxy in front of an application.", "intermediate", 16, "primer", ["Describe TLS termination", "Read a minimal proxy_pass", "Explain certificate expiry as an incident"], ["tcp-udp-dns-http"], ["nginx", "tls"], "A reverse proxy accepts public HTTPS and forwards HTTP or HTTPS to the app. Certificates expire on a date whether or not you remember. Disabling verification is not a fix."),
  t("release-coordination", "m13", "Release Coordination", "Tags, freezes, DNS, and the checklist after the deploy command.", "intermediate", 12, "primer", ["Promote an immutable artifact", "Plan a DNS cutover", "Name who communicates"], ["deployment-strategies-rollbacks"], ["release"], "Production should receive the artifact you tested, not a fresh build from a moving branch. DNS changes wait on TTL. Someone should be explicitly watching the smoke checks."),
  t("incident-response-troubleshooting", "m14", "Incident Response and Troubleshooting", "A method and several classic failures with evidence and fixes.", "intermediate", 36, "full", ["Separate symptom, scope, and hypothesis", "Use logs and recent changes", "Communicate during an incident"], ["prometheus-and-grafana", "linux-troubleshooting"], ["incident", "troubleshooting"], "Change one thing, then re-measure. Recent deploys, full disks, expired certificates, bad DNS, and exhausted connection pools explain a large share of outages. The timeline starts when you notice, not when you feel ready."),
  t("backup-dr-ha", "m14", "Backups, Disaster Recovery, and HA", "RPO, RTO, replicas, and why a replica is not a backup.", "intermediate", 14, "primer", ["Define RPO and RTO with numbers", "Contrast backup and replica", "State why restore drills matter"], ["incident-response-troubleshooting"], ["rpo", "rto", "backup"], "RPO is how much data you can lose. RTO is how long you can be down. A replica copies mistakes too, including a dropped table. A backup you have never restored is a hope."),
  t("incident-simulations", "m14", "Incident Simulations", "Paper exercises with evidence, a decision, and a fix.", "intermediate", 16, "primer", ["Practice the method without a live system", "Avoid multi-variable thrash", "Write a short timeline"], ["incident-response-troubleshooting"], ["simulation"], "Simulations here are written scenarios, not access to a production account. The skill is choosing the next fact to collect, not guessing a tool name."),
  t("platform-gitops", "m15", "Platform Engineering and GitOps", "Paved roads, and controllers that reconcile git with the cluster.", "advanced", 16, "primer", ["Define an internal developer platform", "Explain GitOps reconciliation", "Know when it is premature"], ["kubernetes-architecture", "terraform-fundamentals"], ["gitops", "platform"], "Platform engineering treats the deployment path as a product. GitOps stores desired state in git and uses a controller such as Argo CD or Flux to make the cluster match. A three-person team may not need that machinery yet."),
  t("finops-dora-aiops", "m15", "FinOps, DORA, and AI in Operations", "Cost, delivery performance, and what AI assistants are bad at.", "advanced", 16, "primer", ["Define the four DORA metrics", "List cost controls", "State limits of AIOps"], ["devops-lifecycle", "aws-cost-and-other-clouds"], ["dora", "finops", "aiops"], "DORA measures deployment frequency, lead time for changes, change failure rate, and recovery time. FinOps is cost accountability. AI can summarize a log and also invent a command; you still verify."),
  t("interview-prep-freshers", "m16", "Interview Preparation for Freshers", "What juniors are actually asked, and how to answer without bluffing.", "beginner", 32, "full", ["List a defensible skill set", "Structure a project explanation", "Practice troubleshooting questions"], ["learning-milestones"], ["interview", "career"], "Interviewers listen for clear models and honesty. A lab you can explain beats a tool list you cannot. Saying you have not run something in production is stronger than inventing an on-call story."),
  t("roadmap-30-60-90", "m16", "A 30/60/90 Day Study Plan", "A paced plan for about eight hours a week, with a faster note for full-time study.", "beginner", 14, "primer", ["Plan the first month", "Sequence CI and Docker", "Avoid the expert-in-90-days claim"], ["learning-milestones"], ["roadmap"], "Thirty days is Linux, networking basics, and Git. Sixty adds scripting, a Maven build, CI, and Docker. Ninety adds one cloud path, Terraform plans, and a local cluster. That is a junior foundation, not seniority."),
  t("explain-your-work", "m16", "Explaining Projects and Trade-offs", "How to talk about labs, decisions, and incidents you did not fabricate.", "beginner", 14, "primer", ["Use problem, decision, trade-off, lesson", "Label lab experience honestly", "Score an answer for clarity"], ["interview-prep-freshers"], ["portfolio", "resume"], "Say what you built, why you chose it over the alternative, and what broke. If it was a laptop lab, call it a lab. Resume skills you cannot explain will be the questions you fail."),
];

export function getModule(idOrSlug: string): ModuleInfo | undefined {
  return modules.find((m) => m.id === idOrSlug || m.slug === idOrSlug);
}

export function getTopic(slug: string): Topic | undefined {
  return topics.find((topic) => topic.slug === slug);
}

export function moduleTopics(moduleId: string): Topic[] {
  return topics.filter((topic) => topic.moduleId === moduleId);
}

export function topicNeighbors(slug: string): { prev: Topic | null; next: Topic | null } {
  const index = topics.findIndex((topic) => topic.slug === slug);
  if (index < 0) return { prev: null, next: null };
  return {
    prev: topics[index - 1] ?? null,
    next: topics[index + 1] ?? null,
  };
}

export function curriculumMinutes(): number {
  return topics.reduce((sum, topic) => sum + topic.minutes, 0);
}

export function moduleByTopic(slug: string): ModuleInfo | undefined {
  const topic = getTopic(slug);
  return topic ? getModule(topic.moduleId) : undefined;
}
