import type { Lesson } from "../types";

export const lessons: Lesson[] = [
  {
    slug: "devsecops-pipeline-security",
    title: "DevSecOps: security through the pipeline",
    status: "full",
    blocks: [
      {
        type: "h2",
        text: "Security is a delivery activity, not a final stamp",
      },
      {
        type: "p",
        text: "A scan that runs only after the release branch is built finds problems when the artifact already exists, the dependency is already merged, and a secret may already sit in git history. DevSecOps means the same pipeline that compiles and ships also checks the change, with identities that can do only the job in front of them. The scanners are necessary. They are not a security program.",
      },
      {
        type: "ul",
        items: [
          "Least privilege: a build job can read the repo and push one image. It cannot administer the cloud account or read production data.",
          "Separate identities for build, scan, and deploy. A compromised test job should not be able to roll production.",
          "Application and database users get the rights that workload needs, not a shared superuser.",
          "Human access to production is named, logged, and rare. A personal laptop is not a deploy tool.",
        ],
      },
      { type: "h2", text: "A lightweight threat model" },
      {
        type: "p",
        text: "You do not need a week-long workshop to decide what this pipeline must stop. Before adding a tool, write four lines for the system you are actually shipping. If you cannot name a person who will act on the result, do not add the tool yet.",
      },
      {
        type: "ol",
        items: [
          "What can go wrong? A secret in a commit, a poisoned dependency, an image with a known critical flaw, a pipeline that can change production, infrastructure opened to the world.",
          "Who can cause it? An external attacker, a stolen maintainer token, a pull request from a fork, a teammate with too much access, or a compromised build plugin.",
          "What is the impact? Customer data leaves, you ship malware onward, or you take an outage while you rotate credentials.",
          "What will you implement this sprint? One control you will actually run, with an owner, beats a diagram of twelve controls nobody wired up.",
        ],
      },
      { type: "diagram", id: "cicd" },
      { type: "h2", text: "What each scan sees, and what it misses" },
      {
        type: "table",
        caption: "Scanners overlap less than vendor pages imply. Run more than one, and do not treat a green job as proof.",
        headers: ["Scan", "What it sees", "What it misses"],
        rows: [
          [
            "SAST",
            "Risky patterns in your source: string-built queries, unsafe deserialization, some hardcoded secrets.",
            "Runtime config, OS packages in the base image, and authorization bugs that are syntactically valid.",
          ],
          [
            "DAST",
            "The running app from the outside: headers, some injection, exposed debug routes, on the paths the test actually hits.",
            "Code that the crawl never executes, deep authorization bugs, and anything you did not deploy in the test environment.",
          ],
          [
            "SCA",
            "Known advisories in dependencies declared by the lockfile or Maven/Gradle graph.",
            "Bugs in code you wrote, flaws with no advisory yet, and whether your app even calls the vulnerable function.",
          ],
          [
            "Container scan",
            "OS packages and language libraries inside the image you built, plus some image misconfiguration.",
            "How you run it (root, host mounts, cluster RBAC) and anything added only on the node.",
          ],
          [
            "IaC scan",
            "Risky templates: open security groups, public buckets, missing encryption, privileged pods.",
            "Console edits after apply, and application flaws that never appear in Terraform or Kubernetes YAML.",
          ],
        ],
      },
      {
        type: "p",
        text: "SAST is static application security testing. DAST is dynamic testing of a running app. SCA is software composition analysis. A container scanner such as Trivy inspects an image or a filesystem. tfsec and Checkov inspect infrastructure files. None of them understand a product rule such as which clerk may refund which payment. A human review still has to.",
      },
      {
        type: "callout",
        tone: "warn",
        title: "Tools do not close the risk",
        text: "A green board means those checks found nothing in their scope at that commit. It does not mean the design is safe, the production account matches the template, or a stolen token would be useless. Keep a short list of what you chose not to scan and why.",
      },
      { type: "h2", text: "One pipeline, in order" },
      {
        type: "p",
        text: "Picture a Spring Boot service built with Maven, packaged as an image, and deployed with Terraform for the database security group. The scans below are concepts you can implement with gitleaks, Dependabot or OWASP Dependency-Check, npm audit on a JavaScript repo, Trivy, and tfsec or Checkov. The product names matter less than the order and the fail rule.",
      },
      {
        type: "ol",
        items: [
          "On the pull request, scan git history for secrets. A working-tree-only scan misses a secret that was committed and then deleted in a later commit.",
          "Compile and run unit tests. A security job that never builds is easy to ignore when the build is already red for another reason.",
          "Run SCA on the dependency graph. Dependabot can open upgrade pull requests and alert on advisories. OWASP Dependency-Check or npm audit can fail the job at a severity you choose.",
          "Build the image once. Record the digest. Do not rebuild it later for the scan or for production.",
          "Run Trivy against that image. A filesystem scan of the repo does not see the base-image packages inside the image.",
          "Scan Terraform or Kubernetes manifests with tfsec or Checkov before apply. Re-run when the files change, not only when application code changes.",
          "Optionally run DAST against staging, with synthetic data and written permission. Do not point a scanner at production customer data to see what happens.",
        ],
      },
      { type: "h3", text: "Secret scan and dependency scan" },
      {
        type: "code",
        lang: "bash",
        title: "History scan, then known vulnerabilities",
        code: `# Redact so a hit does not echo the secret into the job log.
gitleaks detect --source . --redact --exit-code 1

# Maven. failBuildOnCVSS is a Dependency-Check property: 9 blocks critical findings.
mvn -B org.owasp:dependency-check-maven:check -DfailBuildOnCVSS=9

# JavaScript alternative for a Node repo. Do not run both on the same project.
npm audit --audit-level=high`,
      },
      {
        type: "p",
        text: "gitleaks walks the git history when you point it at a repository. The redact flag is there because the finding is the secret: the log must show the file, the rule, and the commit, not the value. If it finds a real credential, rotate that credential first. Rewriting history comes second, and only through the team's agreed process. Deleting the line on the branch does not un-copy a pushed secret. Dependabot is the GitHub-side notifier and pull-request updater. Dependency-Check and npm audit are the build-time gates. They report known advisories. They do not prove your code avoids the bad function.",
      },
      { type: "h3", text: "Trivy on the tree and on the image" },
      {
        type: "code",
        lang: "yaml",
        title: "Generic CI: trivy fs, then trivy image",
        code: `name: security-scan
on:
  pull_request:
  push:
    branches:
      - main
jobs:
  trivy:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4
      - name: Scan the working tree
        run: trivy fs --severity CRITICAL,HIGH --exit-code 1 --scanners vuln,secret,misconfig .
      - name: Scan the image that this pipeline built
        env:
          IMAGE_REF: registry.example.com/payments-api@sha256:0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef
        run: trivy image --severity CRITICAL,HIGH --exit-code 1 --no-progress "$IMAGE_REF"`,
      },
      {
        type: "p",
        text: "Install Trivy from a release your team has pinned. Do not pipe a shell script from the internet into a root shell. The filesystem step looks at the checkout: dependencies, misconfiguration, and files that look like secrets. The image step must use the digest the build job pushed. A floating tag can move between the scan and the deploy, which means you scanned a different artifact than you shipped. exit-code 1 makes matching findings fail the job. Login to a private registry belongs in the CI secret store, which masks values in logs. Do not echo the environment, do not run a debug trace that prints every variable, and do not cat a secret file to prove the file exists.",
      },
      {
        type: "code",
        lang: "text",
        title: "Shape of a Trivy finding, values not real",
        code: `Target: registry.example.com/payments-api
CRITICAL: 1
Library: com.example:old-xml 1.2.0
Fix: 2.4.1
This line is an example of a report row, not a live scan.`,
        note: "Illustrative output — not captured from a live run in this environment.",
      },
      { type: "h2", text: "Fail, warn, and the exception path" },
      {
        type: "p",
        text: "Fail the release branch on critical vulnerabilities. Warn on high findings in a short-lived branch if you need the signal without blocking every experiment, but convert that warning into a ticket that is due before promotion. Medium and low stay in the report. A team that fails on every informational finding teaches people to disable the job. A team that never fails teaches people that the report is decoration.",
      },
      {
        type: "ul",
        items: [
          "An exception names the finding id, the owner, the reason, a compensating control, and an expiry date such as 14 days.",
          "Someone other than the author approves it. A file full of permanent suppressions is not an exception process.",
          "Compensating control means something real: the service has no route to the internet, or the vulnerable code is not in the running configuration. Write that down.",
          "When the exception expires, the pipeline fails again until you upgrade or extend the exception in review.",
          "tfsec or Checkov failures on open ingress follow the same rule. A security group open to the world is not a warning you scroll past.",
        ],
      },
      {
        type: "callout",
        tone: "danger",
        title: "Secrets never go in the log",
        text: "If a command fails, read the error without re-running it under a flag that dumps the environment. If a secret did land in a log, rotate it, then remove the log copy. Cleaning the text and keeping the old password is not containment.",
      },
      {
        type: "p",
        text: "IaC scanning sits in the same pipeline, on the Terraform or manifest change, before apply. Checkov and tfsec will not notice that someone later opened the port in the console. Pair them with an audit log or a drift check if that is a real risk for your account. And after all of these jobs are green, you still have not tested whether a user can read another user's invoice. Schedule that review on purpose. Do not pretend the scanner list is the whole of security.",
      },
    ],
    exercise: {
      title: "Design the merge gate",
      prompt:
        "You own CI for a Spring Boot service shipped as a container, with Terraform for the database security group. Write the scan order, the fail policy, and the exception rule for critical findings. Do not disable a scanner to get a green pipeline.",
      steps: [
        "List the scans from pull request, to dependency graph, to the built image, to the infrastructure files.",
        "For each scan, name one class of problem it will not catch.",
        "State what a critical finding does to the release branch, and what a high finding with no fix does.",
        "Write the exception fields: finding id, owner, expiry, compensating control, and who may approve.",
        "State how the job avoids printing a secret value if a scan hits.",
      ],
      criteria: [
        "Critical findings block promotion of the release branch.",
        "The exception expires and names a person who is not only the author.",
        "The image scan targets the digest that will be deployed, not a later rebuild.",
        "The write-up says scanners do not replace review of access control.",
        "No step prints a secret, recommends world-writable permissions, or disables TLS checks.",
      ],
    },
    checks: [
      {
        q: "SAST is green. Why can the image you ship still be vulnerable?",
        a: "SAST reads source patterns in your repository. It does not inventory operating-system packages inside the base image, and it does not see a library you only copy in during the Docker build. A container scan of the digest you will deploy covers that layer. Even SAST plus a container scan misses an authorization bug that is legal code and a port that someone opens later in the console.",
      },
      {
        q: "A secret was committed, then the bad line was deleted on the branch. Are you done?",
        a: "No. The value may remain in git history, on a fork, in a developer's clone, and in CI logs if a job printed it. Rotate the credential so the old value stops working. Then scan history with a tool that redacts output, and follow your team's history-rewrite process if the secret is still reachable. Deleting the tip of the branch is not rotation.",
      },
      {
        q: "What does an IaC scanner such as tfsec or Checkov fail to see?",
        a: "It sees the templates you give it: Terraform, Kubernetes YAML, and similar files, depending on the tool. It does not see a click in the cloud console after apply, a helm value produced only at deploy time if you never scan the rendered output, or a flaw in the application. Drift and audit logs are a separate control.",
      },
      {
        q: "Why block critical findings but allow a time-boxed exception, instead of failing on every row or on none?",
        a: "Failing on every informational row trains people to turn the job off or to commit a permanent ignore file. Failing on nothing means a known critical issue ships with a shrug. A severity gate keeps the pipeline meaningful. An exception with an owner, a compensating control, and an expiry is how you handle a real delay without pretending the finding is fine. The exact cutoff is a team decision; critical-as-blocking is the policy this lesson uses.",
      },
    ],
    interview: [
      {
        q: "Where should security sit in a delivery pipeline, and why is a final gate not enough?",
        a: "I treat security as checks on every change, not as a review the week before release. A late gate means the image is already built, the dependency is already merged, and the secret may already be in git history. In a lab pipeline I would run a secret scan and a dependency check on the pull request, then scan the image CI just built, and scan Terraform before apply. Critical findings fail the job. A finding with no safe upgrade gets a ticket with an owner and an expiry, not a permanent ignore. Scanners still miss broken authorization, so a human reviews the change. I have not run a company's security program; this is the pipeline I can explain.",
      },
      {
        q: "A scanner reports a critical issue in a base image the night before release. What do you do?",
        a: "I do not silence the check to let the release go out. I look at whether the finding is in a package we use, whether a fixed base image exists, and whether the vulnerable code is on a path we run. If a rebuild on an updated base is small and tests pass, I ship that digest instead. If we cannot upgrade in time, the exception needs a name, a reason, a compensating control such as a network restriction, and a date when it expires. I tell the release owner the risk in plain language. I do not paste raw scanner output into chat. After release I still owe the upgrade. An exception is a delay, not a decision that the issue is fine.",
      },
      {
        q: "Why is printing the environment in a CI log a serious bug?",
        a: "CI logs are copied into pull requests, stored for months, and visible to more people than the production secret store. A debug step that prints the environment, or a failed command that echoes its arguments, can put a database password or a cloud token into that history. Deleting the line later does not guarantee every copy is gone. I mask secrets in the CI system, pass them as files or protected variables, and I avoid tracing flags that dump the environment. If a secret did leak into a log, I rotate it and then clean the log, in that order, because the old value is already untrustworthy. I also check that jobs triggered by forks never receive those secrets.",
      },
    ],
    takeaways: [
      "Run secret, dependency, image, and infrastructure scans in the pipeline, not as a ceremony after the release artifact already exists.",
      "A critical finding blocks promotion until it is fixed or covered by a named exception that expires.",
      "Each scanner sees one layer and misses the others. None of them prove access control or design is sound.",
      "Least privilege applies to CI jobs, cloud roles, and database users, not only to customer accounts.",
      "Never print secret values in logs. If one leaks, rotate it before you spend the afternoon editing text.",
    ],
  },
  {
    slug: "secrets-and-supply-chain",
    title: "Secrets and the software supply chain",
    status: "primer",
    blocks: [
      { type: "h2", text: "A secret is a lifecycle, not a file" },
      {
        type: "p",
        text: "Production credentials should be created for one environment, handed to one workload, rotated on a schedule and after any leak, and removed when the workload is gone. A value that lives forever in a chat log or a disk image has already failed that test, even if the application is currently up.",
      },
      {
        type: "ul",
        items: [
          "Dev, staging, and production use different secrets. A lab leak must not open production.",
          "Rotation means: issue the new value, deploy the consumers, check health, then disable the old value. Both work during the overlap, or you cause an outage.",
          "Delete unused credentials. A token for a service you retired is still a key.",
          "Prefer short-lived credentials from the cloud identity system over a key that sits in a repository for a year.",
        ],
      },
      { type: "h2", text: "Secret managers versus dotenv files" },
      {
        type: "p",
        text: "A .env file is acceptable for local development when it is gitignored and never copied into an image layer. It is a poor production store: no access audit, no rotation API, and a habit of ending up in shell history, crash dumps, and Docker build context. AWS Secrets Manager stores a secret in AWS and lets you grant GetSecretValue to a role the workload assumes. Some secret types can rotate with a Lambda function on a schedule. HashiCorp Vault is the broader idea: policies decide who can read a path, leases expire, and dynamic database credentials can be issued per login and revoked. Both are secret managers. A file on a laptop is not.",
      },
      { type: "diagram", id: "permissions" },
      {
        type: "code",
        lang: "bash",
        title: "Reference the secret. Do not print it.",
        code: `# The platform injects the value. The script only checks that the variable is non-empty.
if [ -z "$DB_PASSWORD" ]; then
  echo "DB_PASSWORD is missing"
  exit 1
fi
echo "DB_PASSWORD is set"
# Never: echo "$DB_PASSWORD"`,
      },
      {
        type: "p",
        text: "The application should receive a secret name or a mounted file path, not a long-lived cloud key baked into the image. At start, the platform resolves the value using the workload identity. Log the name of the secret if you must. Log that it was present. Do not log the value, the connection string, or the full environment.",
      },
      { type: "h2", text: "Supply chain: know what you shipped" },
      {
        type: "ul",
        items: [
          "An SBOM is a software bill of materials, often SPDX or CycloneDX. It lists components so that when a new advisory appears you can answer whether you shipped that component. It does not by itself mean the build was safe.",
          "Provenance is evidence of how the artifact was built: which source, which builder, which pipeline. The SLSA levels are a way to talk about how strong that evidence is. A badge without a recorded digest is not provenance.",
          "Image signing: cosign, part of the Sigstore project, can sign an image. An admission policy then rejects unsigned images in the cluster. Signing does not scan for vulnerabilities. It answers whether this image is one your build produced.",
          "Dependency confusion: an attacker publishes a public package whose name matches a private package, at a higher version, and the build tool downloads the public one. Defenses are a lockfile, a scoped private registry, and checksums. Do not invent package names that look internal and leave them unresolved.",
        ],
      },
      {
        type: "p",
        text: "Audit logs close the loop. You want a record of who read a secret, who changed a pipeline, and who assumed a production role, retained somewhere the same person cannot quietly edit. Review is part of the control. A log nobody looks at is storage, not detection. None of these controls replace least privilege: a signed image running as cluster-admin is still a large blast radius.",
      },
      {
        type: "callout",
        tone: "warn",
        title: "Local files are not a manager",
        text: "Do not commit a .env, do not COPY it into an image, and do not paste production values into a ticket. If a secret leaked, rotate first. Then find the copies.",
      },
    ],
    exercise: null,
    checks: [
      {
        q: "Why are separate secrets per environment part of rotation, not a nice extra?",
        a: "Rotation limits how long a stolen value works. Separate secrets limit where it works. If dev and prod share a password, rotating prod and forgetting a developer's copy does nothing, and a leaked lab file is a production incident. Issue a new prod value, move prod consumers, disable the old prod value, and leave dev on its own credential the whole time.",
      },
      {
        q: "What does image signing prove, and what does an SBOM not prove?",
        a: "A signature from cosign or another Sigstore-style system proves the image matches an identity you trust to build, if the cluster actually verifies the signature. It does not prove there is no vulnerability inside. An SBOM lists components so you can search them later. It does not prove the list is complete unless the build generated it, and it does not prove you patched anything.",
      },
    ],
    interview: [
      {
        q: "Why is a .env file a weak production secret store, and what would you use instead?",
        a: "A .env file is fine for local config if it is gitignored and never copied into an image. It is a weak production store because it has no access audit, no rotation workflow, and it ends up in shell history, crash dumps, and image layers. I would use a secret manager such as AWS Secrets Manager or Vault. The app gets a name or a path, and the platform injects the value using the workload identity, not a long-lived key in the repo. Dev, staging, and production use different secrets so a lab leak does not open production. I rotate by creating the new value, deploying consumers, checking health, then disabling the old one. I have practiced this in labs, not as the owner of a company vault.",
      },
    ],
    takeaways: [
      "Rotate secrets with an overlap window, and never share them across dev, staging, and production.",
      "Use a secret manager for real environments. Keep .env files local, gitignored, and out of images.",
      "SBOMs, provenance, and image signatures answer different questions: what is inside, how it was built, and who built it.",
    ],
  },
  {
    slug: "owasp-and-hardening",
    title: "OWASP risks operators actually meet",
    status: "primer",
    blocks: [
      {
        type: "h2",
        text: "Five risks, from the operator's side of the wall",
      },
      {
        type: "p",
        text: "The OWASP Top 10 is an application-security list. Operators do not fix it by installing one product. You do change how likely several of the items are, by how you expose the service, how you patch it, and how much network it can reach. This lesson is defensive. It is not a guide to breaking into systems.",
      },
      {
        type: "table",
        caption: "Awareness level for people who run the system, not a full secure-coding course.",
        headers: ["Risk", "What it means in production", "Operator-shaped control"],
        rows: [
          [
            "Injection",
            "Untrusted input is glued into a query, a shell command, or a template.",
            "The app must use parameters or a safe API. You still avoid running that process as a powerful database or OS user.",
          ],
          [
            "Broken access control",
            "A caller reads or changes someone else's object, or uses an admin route with no check.",
            "Do not publish admin ports. Authentication at the edge does not replace authorization in the service.",
          ],
          [
            "Security misconfiguration",
            "Default passwords, debug routes, open storage, directory listings, wide CORS.",
            "This is home turf: baselines, IaC review, and a ban on shipping the sample config.",
          ],
          [
            "Vulnerable components",
            "A library or base image with a known flaw.",
            "SCA, image rebuilds on a schedule, and a patch rule that is not 'next quarter' for critical issues.",
          ],
          [
            "SSRF",
            "The app fetches a URL an attacker influenced and can reach internal systems or the cloud metadata service.",
            "Restrict egress. Require the cloud metadata service v2 where the platform offers it. Do not explore this by calling metadata on a real account.",
          ],
        ],
      },
      {
        type: "p",
        text: "A web application firewall can block some obvious malicious requests. It does not turn string-built SQL into a parameterized query, and it does not know which customer may see which invoice. Treat it as an extra layer. Injection and broken access control are fixed in the application and in how much privilege the process has. Security misconfiguration and vulnerable components are where pipeline scans and hardening pay rent. SSRF is dangerous because the server's network position is better than the attacker's: it may see the metadata address 169.254.169.254 or internal admin ports. The defensive move is egress control and modern metadata settings, not a lab where you try the call against an account you do not own.",
      },
      { type: "h2", text: "Container hardening, recap" },
      {
        type: "ul",
        items: [
          "Run as a non-root user. Root in the container is one mistake away from root-shaped damage on the node.",
          "Use a read-only root filesystem and a dedicated writable volume only where the process must write.",
          "Drop capabilities. Add one back only when you can name the syscall that needs it.",
          "Do not set privileged, and do not mount the container socket into the pod.",
          "Pin the image by digest. A tag can move after you scanned it.",
          "Pass secrets at runtime from a manager. Build arguments and image environment variables stick in layers.",
        ],
      },
      { type: "diagram", id: "k8s" },
      { type: "h2", text: "Kubernetes boundaries and CI permissions" },
      {
        type: "p",
        text: "RBAC decides which API calls a service account may make. An application that only serves HTTP does not need permission to list secrets in the cluster, and it does not need cluster-admin. A namespace groups objects. It is not, by itself, a strong security boundary against a privileged pod. Network policy should default to deny and then allow the ingress path and the database path you intend. Everything else, including calls out to the cloud metadata address, is a choice you should have to write down.",
      },
      {
        type: "ul",
        items: [
          "Give the default CI token read access to the repository. Grant write or deploy rights only on the job that needs them.",
          "Workflows triggered by forks should not receive secrets. A pull request is untrusted input.",
          "Prefer the cloud's short-lived identity federation over a long-lived access key stored in the CI secret list.",
          "Protect the production environment in the CI system with a required reviewer.",
        ],
      },
      {
        type: "callout",
        tone: "danger",
        title: "Finding a flaw is not permission to exploit it",
        text: "If you find a vulnerability in a system your team runs, report it on the internal security channel with enough detail to reproduce, and stop. Do not pivot into neighboring systems. If the system is someone else's, use their published contact or disclosure policy. Do not dump data, do not scan networks you do not own, and do not demand payment. Vigilante testing is an incident of your own.",
      },
      {
        type: "p",
        text: "Safe disclosure is part of the job. Include the version, the request path or config that shows the issue, and the impact you can already justify. Leave out a how-to for abusing it, customer data, and credentials. Patch, rotate if a secret was exposed, and write down the detection you wish you had had.",
      },
    ],
    exercise: null,
    checks: [
      {
        q: "Why is 'the firewall will handle access control' a weak operations plan?",
        a: "A filter at the edge can drop some known-bad payloads. It cannot decide whether this user may open that object id, and it cannot repair a query the application builds by concatenation. Broken access control is missing authorization in the service. Your job is to keep admin interfaces off the public internet and to avoid giving the process a database superuser, not to declare the problem solved by a signature set.",
      },
      {
        q: "What should a CI job that builds pull requests from forks be allowed to see?",
        a: "The code in the pull request and the permissions required to compile it. Not production secrets, not a cloud key, and not a token that can push to the default branch. Forked code is an untrusted input. Short-lived cloud credentials for the deploy job belong on the protected branch, after review, not on every pull request workflow.",
      },
    ],
    interview: [
      {
        q: "Someone says the WAF handles injection and access control. What is wrong with that?",
        a: "A web application firewall can block some obvious bad requests, and it is useful as one layer. It does not know who may read which order, and it cannot turn a concatenated query into a parameterized one. Broken access control is missing checks in the application. The fix is authorization in the service, not only a filter in front. Misconfiguration, old images, and a service that can reach the cloud metadata address are also outside what a signature set will reliably stop. I would patch components, run as a non-root user, restrict egress, and keep admin ports off the public internet. If I found a hole in a system I do not own, I would use the owner's disclosure contact and stop there.",
      },
    ],
    takeaways: [
      "Injection and broken access control are fixed in the application. Operators still reduce blast radius with least privilege and private admin paths.",
      "Misconfiguration and old components are pipeline and hardening work: baselines, image rebuilds, and scanners with a fail rule.",
      "Report flaws you are responsible for through the security channel. Do not exploit systems, yours or anyone else's, to make a point.",
    ],
  },
];
