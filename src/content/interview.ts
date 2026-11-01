import type { InterviewItem } from "./types";

export const interviewItems: InterviewItem[] = [
  {
    id: "i1",
    category: "Foundations",
    difficulty: "beginner",
    kind: "concept",
    prompt: "What is DevOps, in two minutes, without listing tools?",
    hint: "Talk about batch size, feedback, and shared ownership of production.",
    topic: "what-is-devops",
    answer:
      "DevOps is a way of building and running software so that small changes reach users quickly and safely. It exists because separating people who change systems from people who keep them stable creates long queues and fragile releases. The practical version is shared ownership: code is reviewed, built, and tested automatically, the same artifact is deployed, and production signals change what the team does next. Tools help, but a Jenkins server without that habit is not DevOps.",
  },
  {
    id: "i2",
    category: "Foundations",
    difficulty: "beginner",
    kind: "compare",
    prompt: "Compare continuous integration, continuous delivery, and continuous deployment.",
    hint: "Integration is about merging and testing. The two CDs differ on who decides to deploy.",
    topic: "ci-cd-terms",
    answer:
      "Continuous integration means developers merge small changes into a shared branch often, and an automated build and test run on each change. Continuous delivery means the result is always in a state where you could deploy it; a person or a policy may still approve production. Continuous deployment means a green pipeline deploys to production by itself. A team can have CI without either form of CD if artifacts sit for a weekly manual release.",
  },
  {
    id: "i3",
    category: "Networking",
    difficulty: "beginner",
    kind: "concept",
    prompt: "A user says the site is down. ping works. What does that tell you, and what do you check next?",
    hint: "ICMP is not HTTP. Think DNS, TLS, status codes, and the process.",
    topic: "network-commands",
    answer:
      "ping only shows that some path answered ICMP. The HTTP service can still be down, listening on the wrong interface, failing TLS, or returning 500. I would curl the URL and read the status, check DNS with dig, and look at whether the process is listening with ss. If curl from the server works but not from outside, I look at security groups, firewalls, and the proxy.",
  },
  {
    id: "i4",
    category: "Networking",
    difficulty: "intermediate",
    kind: "concept",
    prompt: "What is the difference between a certificate expiring and a certificate name mismatch?",
    hint: "Both fail TLS for different reasons. Browsers show different errors.",
    topic: "tcp-udp-dns-http",
    answer:
      "Expiry means the not-after date has passed, so a previously valid certificate is no longer acceptable. A name mismatch means the certificate is currently valid but its names do not include the host the client requested. Renewal fixes expiry. The name problem needs a certificate that covers that DNS name, or clients must use the name that is on the certificate. Disabling verification hides both and is not a fix.",
  },
  {
    id: "i5",
    category: "Linux",
    difficulty: "beginner",
    kind: "output",
    prompt: "A deploy script logs 'Permission denied' creating /var/log/myapp. The process runs as user myapp. What is a reasonable fix, and what is a bad one?",
    hint: "Ownership and mode. Not 777.",
    topic: "linux-permissions-processes",
    answer:
      "The user myapp cannot write that directory. I would look at ls -ld on the path and then chown or grant group write on a dedicated directory such as /var/log/myapp with a mode like 750. chmod 777 would make the log writable by every account on the box, which is a wider hole than the outage. I would also check that a future package update does not reset the directory.",
  },
  {
    id: "i6",
    category: "Linux",
    difficulty: "beginner",
    kind: "compare",
    prompt: "Why send SIGTERM before SIGKILL?",
    hint: "Handlers and cleanup versus an immediate death.",
    topic: "linux-permissions-processes",
    answer:
      "SIGTERM can be caught. A well-behaved process closes connections, flushes files, and exits. SIGKILL cannot be caught or ignored, so the kernel removes the process immediately and any cleanup is skipped. I use kill -9 when a process ignores TERM or is wedged, not as the default, and I expect possible corruption or a leftover lock if it dies mid-write.",
  },
  {
    id: "i7",
    category: "Git",
    difficulty: "beginner",
    kind: "compare",
    prompt: "When do you git revert, and when do you git reset?",
    hint: "Has the commit been pushed and shared?",
    topic: "git-safety-workflows",
    answer:
      "revert adds a new commit that undoes an earlier one. History stays intact, so it is the safe choice on a shared branch. reset moves a branch pointer and can discard commits. That is fine for local commits I have not pushed. Resetting a shared branch and force-pushing rewrites history other people may have based work on. If a secret was committed, revert is not enough: I rotate the secret because the old commit may still exist in clones.",
  },
  {
    id: "i8",
    category: "Git",
    difficulty: "intermediate",
    kind: "scenario",
    prompt: "Two people edited the same lines. Git marks a conflict. What do you do, step by step?",
    hint: "Markers, decision, stage, test.",
    topic: "git-fundamentals-branching",
    answer:
      "I open the file and find the conflict markers. I decide what the combined result should be, delete the markers, and make sure the file compiles or the relevant test passes. Then I git add the file and commit the merge. I do not pick 'ours' blindly to make the markers go away. If I do not understand the other change, I ask the author before I complete the merge.",
  },
  {
    id: "i9",
    category: "CI/CD",
    difficulty: "intermediate",
    kind: "scenario",
    prompt: "Unit tests pass on your laptop and fail in CI. What are the first things you compare?",
    hint: "JDK version, working directory, environment, and timing.",
    topic: "pipeline-debugging",
    answer:
      "I compare the JDK and Maven versions, the branch and commit, environment variables, and whether the test depends on local files or the clock. CI might be running from a clean directory while my laptop has a stale build output. I then read the failed step log and run the same command the pipeline ran, not a similar one. If it fails only sometimes, I treat it as a flake and look for shared state or sleeps.",
  },
  {
    id: "i10",
    category: "CI/CD",
    difficulty: "intermediate",
    kind: "concept",
    prompt: "Why is pull_request_target dangerous for workflows that check out the PR head and run its scripts?",
    hint: "Secrets and the default token.",
    topic: "github-actions-spring-boot",
    answer:
      "pull_request_target runs in the context of the base repository, so it can see secrets and a token that writes to the repo. If that workflow checks out the pull request's code and executes it, a stranger's fork can run with those privileges. For untrusted PRs I use pull_request, read-only permissions, and no secrets. I do not switch the event just so a fork can comment on the PR.",
  },
  {
    id: "i11",
    category: "Docker",
    difficulty: "beginner",
    kind: "compare",
    prompt: "What is the difference between an image and a container?",
    hint: "Template versus running process.",
    topic: "docker-fundamentals",
    answer:
      "An image is an immutable template: layers plus configuration such as the entrypoint and user. A container is a running, or exited, instance of that image with a writable layer, its own process, and usually its own network namespace. I can start many containers from one image. Deleting the container does not delete the image, and deleting the container does not delete a named volume.",
  },
  {
    id: "i12",
    category: "Docker",
    difficulty: "intermediate",
    kind: "scenario",
    prompt: "Your Compose app cannot connect to Postgres at localhost:5432, but the database container is healthy. Why?",
    hint: "localhost inside a container.",
    topic: "docker-compose-postgres",
    answer:
      "localhost inside the application container is that container, not the database and not my laptop. Compose DNS name for the database is the service name, so the JDBC host should be that name on the Compose network. Publishing 5432 on the host lets my laptop connect to localhost, which is a different path from the app container. I would also check the password, the database name, and whether the app started before Postgres accepted connections.",
  },
  {
    id: "i13",
    category: "AWS",
    difficulty: "intermediate",
    kind: "concept",
    prompt: "Why should an application running on EC2 use an IAM role instead of an access key in a file?",
    hint: "Temporary credentials and blast radius.",
    topic: "aws-core-services",
    answer:
      "An instance role gives the application temporary credentials that rotate and are not sitting in a config file or image. An access key in a file gets copied into AMIs, logs, and tickets, and it often has more permission than the app needs. If the instance is compromised I can still constrain the role, and I am not rotating a key that was baked into last month's image. People should use roles or SSO too, not long-lived keys in shell rc files.",
  },
  {
    id: "i14",
    category: "AWS",
    difficulty: "beginner",
    kind: "concept",
    prompt: "What makes a subnet public?",
    hint: "Route table, not the name.",
    topic: "aws-core-services",
    answer:
      "A public subnet has a route to an internet gateway, typically 0.0.0.0/0. The name in the console does not matter. A private subnet has no such route; outbound internet, if any, goes through a NAT gateway. A security group can still block traffic in a public subnet, and a public IP alone does not define the subnet.",
  },
  {
    id: "i15",
    category: "Terraform",
    difficulty: "intermediate",
    kind: "concept",
    prompt: "What is Terraform state, and why is committing it a bad default?",
    hint: "IDs and secrets.",
    topic: "terraform-fundamentals",
    answer:
      "State maps resource addresses in code to real IDs in the provider, and it stores attributes Terraform needs for the next plan. Those attributes can include passwords or keys. Committed state also causes races when two people apply different copies. I use a remote backend with locking, restrict who can read it, and keep .tfstate out of git.",
  },
  {
    id: "i16",
    category: "Kubernetes",
    difficulty: "intermediate",
    kind: "scenario",
    prompt: "A Pod is CrashLoopBackOff. What do you look at, in order?",
    hint: "describe, logs --previous, events. Do not delete the namespace.",
    topic: "kubernetes-troubleshooting",
    answer:
      "I kubectl describe the Pod and read the container state and events. Then I get logs and logs --previous, because the current container may not have started. Typical causes are a bad config, a missing secret, an immediate exception, or a liveness probe killing a slow start. I fix the cause and let the Deployment roll. Deleting random resources hides the evidence.",
  },
  {
    id: "i17",
    category: "Kubernetes",
    difficulty: "intermediate",
    kind: "compare",
    prompt: "What is the difference between a liveness probe and a readiness probe?",
    hint: "Restart versus endpoints.",
    topic: "kubernetes-workloads",
    answer:
      "Liveness failure restarts the container. I use it when the process is deadlocked and only a restart will help. Readiness failure removes the Pod from Service endpoints so it stops receiving traffic, without restarting it. A dependency being down is usually a readiness concern. If I put that check on liveness, every backend blip restarts all the app Pods and makes the outage worse.",
  },
  {
    id: "i18",
    category: "Observability",
    difficulty: "intermediate",
    kind: "concept",
    prompt: "Why do you graph rate() of a counter instead of the raw counter?",
    hint: "Counters reset and only increase.",
    topic: "prometheus-and-grafana",
    answer:
      "A counter is a total that climbs and resets to zero when the process restarts. The raw number mostly tells you uptime. rate() over a window turns it into a per-second average and handles resets. I still pick a window long enough to be smooth and short enough to show the incident. A gauge, such as current memory, is graphed directly.",
  },
  {
    id: "i19",
    category: "Security",
    difficulty: "intermediate",
    kind: "concept",
    prompt: "A scanner reports a critical CVE in a base image. What do you do before you declare the service safe or unsafe?",
    hint: "Is the vulnerable code reachable? Is there a fixed image? What is the exception process?",
    topic: "devsecops-pipeline-security",
    answer:
      "I confirm the package and version, whether our process actually uses the vulnerable code path, and whether a patched base image exists. If it is reachable and a fix exists, I rebuild and redeploy the same way we ship any change. If it is not reachable, I record a time-boxed exception rather than clicking ignore forever. The scanner does not know our exposure, and I do not treat a green scan as proof the app is secure.",
  },
  {
    id: "i20",
    category: "Reliability",
    difficulty: "intermediate",
    kind: "scenario",
    prompt: "Error rate jumped two minutes after a deploy. What is your first mitigation if the previous artifact is known-good and the migration was backward compatible?",
    hint: "Restore service before the deep root cause.",
    topic: "incident-response-troubleshooting",
    answer:
      "I roll back to the previous artifact and watch the same error rate. I say that in the incident channel with the next update time. I do not start by tuning the database or restarting every node. After the error rate returns, I keep the bad revision for a staged reproduction. If the migration had been incompatible, rollback might be wrong and I would say so before I switched traffic.",
  },
  {
    id: "i21",
    category: "Reliability",
    difficulty: "beginner",
    kind: "compare",
    prompt: "What is the difference between RPO and RTO? Give numbers.",
    hint: "Data loss versus downtime.",
    topic: "backup-dr-ha",
    answer:
      "RPO is how much data you can lose, measured in time. A backup every hour means you might lose 60 minutes of writes. RTO is how long restoring service may take, for example 30 minutes to boot a new database from that backup and repoint the app. A replica can make RTO short and still leave RPO poor if the replica is your only copy and someone drops a table.",
  },
  {
    id: "i22",
    category: "Behavioral",
    difficulty: "beginner",
    kind: "behavioral",
    prompt: "Tell me about a time something you deployed did not work.",
    hint: "If it was a lab, say so. Include what you checked and what you changed.",
    topic: "explain-your-work",
    answer:
      "In a local Compose lab, my Spring Boot app restarted because it could not open Postgres. I had used localhost in the JDBC URL. Logs showed connection refused, while docker compose ps showed the database healthy. I changed the host to the Compose service name and added a health check so the app waited. I would call this a lab, not a production incident. The lesson I kept is that a name means a different machine inside a container network.",
  },
  {
    id: "i23",
    category: "Builds",
    difficulty: "beginner",
    kind: "concept",
    prompt: "What does mvn -B package do, relative to mvn test?",
    hint: "Phases run in order, up to the one you name.",
    topic: "maven-build-lifecycle",
    answer:
      "Maven runs every phase up to the one you request. test runs through the test phase. package continues through packaging, so it also tests unless you skip them, and it writes the artifact under target. -B is batch mode, which avoids interactive prompts and is what you want in CI. For a Spring Boot app I still confirm the repackaged jar is the one I run, not a thin jar that is missing dependencies.",
  },
  {
    id: "i24",
    category: "Scripting",
    difficulty: "intermediate",
    kind: "concept",
    prompt: "What does set -euo pipefail buy you, and what does it not catch?",
    hint: "Each flag, then an if-test exception.",
    topic: "bash-scripting-fundamentals",
    answer:
      "-e exits when a command fails, -u errors on unset variables, and pipefail makes a pipeline fail if any command in it fails, not only the last. It does not make a script correct. Failures inside if conditions are intentionally allowed, and a command in a variable can still be dangerous. I still check arguments and avoid unquoted expansions. For JSON and HTTP I would rather use Python.",
  },
];

export const interviewCategories = [...new Set(interviewItems.map((item) => item.category))];
