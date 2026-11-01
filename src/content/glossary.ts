import type { GlossaryEntry } from "./types";

export const glossary: GlossaryEntry[] = [
  { term: "Artifact", slug: "artifact", moduleId: "m5", related: ["registry", "reproducible-build"], definition: "A versioned file produced by a build, such as a JAR or container image, that later stages deploy without rebuilding from a different source tree." },
  { term: "Availability Zone", slug: "availability-zone", moduleId: "m8", related: ["region"], definition: "An isolated location inside a cloud region with independent power and networking. Spreading instances across zones reduces the blast radius of one site failure." },
  { term: "Blue-green deployment", slug: "blue-green", moduleId: "m13", related: ["canary", "rollback"], definition: "Running two complete environments and switching traffic from the live one (blue) to the new one (green) after checks. Rollback is switching back, if the data schema still allows it." },
  { term: "CALMS", slug: "calms", moduleId: "m0", related: ["devops"], definition: "A DevOps lens: Culture, Automation, Lean, Measurement, and Sharing. It is a checklist of concerns, not a maturity score you can buy." },
  { term: "Canary deployment", slug: "canary", moduleId: "m13", related: ["blue-green"], definition: "Sending a small fraction of real traffic to a new revision and watching errors and latency before shifting the rest." },
  { term: "CIDR", slug: "cidr", moduleId: "m1", related: ["subnet"], definition: "Classless Inter-Domain Routing notation, such as 10.0.0.0/24, where the prefix length says how many leading bits identify the network." },
  { term: "Continuous delivery", slug: "continuous-delivery", moduleId: "m0", related: ["continuous-deployment", "continuous-integration"], definition: "A pipeline that keeps every change in a deployable state. A person or policy may still approve the production push." },
  { term: "Continuous deployment", slug: "continuous-deployment", moduleId: "m0", related: ["continuous-delivery"], definition: "Every change that passes the pipeline is deployed to production automatically, with no separate human approval." },
  { term: "Continuous integration", slug: "continuous-integration", moduleId: "m0", related: ["pipeline"], definition: "Merging small changes into a shared branch frequently and proving them with an automated build and tests." },
  { term: "Container", slug: "container", moduleId: "m7", related: ["image", "oci"], definition: "A running process isolated with kernel features such as namespaces and cgroups, started from an image. It is not a virtual machine and not a strong security boundary by itself." },
  { term: "Control plane", slug: "control-plane", moduleId: "m10", related: ["etcd", "kubelet"], definition: "The Kubernetes processes that decide desired state: API server, etcd, scheduler, and controller manager. Worker nodes run the workloads." },
  { term: "CrashLoopBackOff", slug: "crashloopbackoff", moduleId: "m10", related: ["kubelet"], definition: "A Kubernetes state where a container starts, exits, and is restarted with increasing delay. The cause is in the previous logs, not in the backoff itself." },
  { term: "Digest", slug: "digest", moduleId: "m7", related: ["image"], definition: "A content hash of an image manifest. Pulling by digest pins bytes. A tag can be moved to a different digest." },
  { term: "DORA metrics", slug: "dora", moduleId: "m15", related: ["lead-time"], definition: "Four delivery measures: deployment frequency, lead time for changes, change failure rate, and failed deployment recovery time." },
  { term: "Drift", slug: "drift", moduleId: "m9", related: ["terraform"], definition: "A difference between declared infrastructure and what actually exists, often because someone changed a console setting outside the code." },
  { term: "Error budget", slug: "error-budget", moduleId: "m11", related: ["slo"], definition: "The allowed unreliability left under an SLO. If a 99.9% monthly target is the SLO, about 43 minutes of downtime is the budget." },
  { term: "etcd", slug: "etcd", moduleId: "m10", related: ["control-plane"], definition: "The consistent key-value store Kubernetes uses for cluster state. Backup of etcd is backup of the cluster's desired objects." },
  { term: "GitOps", slug: "gitops", moduleId: "m15", related: ["drift"], definition: "A model where git holds desired runtime state and a controller reconciles the system until it matches, flagging or repairing drift." },
  { term: "Golden signals", slug: "golden-signals", moduleId: "m11", related: ["sli"], definition: "Latency, traffic, errors, and saturation: four measures that describe whether a user-facing service is healthy." },
  { term: "Idempotency", slug: "idempotency", moduleId: "m4", related: ["ansible"], definition: "Repeating an operation leaves the system in the same desired state. A second run should not duplicate users, append the same line forever, or fail because the change is already there." },
  { term: "Image", slug: "image", moduleId: "m7", related: ["container", "digest"], definition: "An immutable layered filesystem plus configuration used to start a container. Tags name images; digests identify their content." },
  { term: "Infrastructure as code", slug: "iac", moduleId: "m9", related: ["terraform", "drift"], definition: "Managing infrastructure through reviewed text, usually declarative, so changes are repeatable and visible in version control." },
  { term: "Ingress", slug: "ingress", moduleId: "m10", related: ["service"], definition: "A Kubernetes API that describes HTTP routing from outside the cluster to Services. A controller must be installed to implement it." },
  { term: "Lead time for changes", slug: "lead-time", moduleId: "m0", related: ["dora"], definition: "Elapsed time from a commit to that change running in production. It includes review, CI, and waiting, not only compile time." },
  { term: "Least privilege", slug: "least-privilege", moduleId: "m8", related: ["iam"], definition: "Granting only the access required for a task, for only as long as needed. Long-lived admin keys violate it." },
  { term: "Liveness probe", slug: "liveness-probe", moduleId: "m10", related: ["readiness-probe"], definition: "A Kubernetes check that restarts a container when the process is wedged. It should not depend on a downstream that you do not want to restart for." },
  { term: "Load balancer", slug: "load-balancer", moduleId: "m1", related: ["reverse-proxy"], definition: "A component that spreads requests across healthy targets. It may also terminate TLS. It is not the same thing as a forward proxy used by clients." },
  { term: "MTTR", slug: "mttr", moduleId: "m0", related: ["incident"], definition: "Mean time to restore (or repair). In DORA's current wording the related idea is failed deployment recovery time: how long until service is healthy after a failed change." },
  { term: "Namespace", slug: "namespace", moduleId: "m10", related: ["rbac"], definition: "A Kubernetes scoping boundary for names and, with RBAC and quotas, for access and resources. It is not a hard network boundary unless you add policy." },
  { term: "OCI", slug: "oci", moduleId: "m7", related: ["image"], definition: "Open Container Initiative. The image and runtime specifications that let different tools build and run compatible containers." },
  { term: "PromQL", slug: "promql", moduleId: "m11", related: ["prometheus"], definition: "The query language of Prometheus. Counters are queried with rate or increase over a range, not graphed as raw values." },
  { term: "Readiness probe", slug: "readiness-probe", moduleId: "m10", related: ["liveness-probe"], definition: "A check that decides whether a Pod should receive Service traffic. Failing readiness does not restart the container." },
  { term: "Region", slug: "region", moduleId: "m8", related: ["availability-zone"], definition: "A geographic cloud area made of multiple availability zones. Data residency, latency, and service availability are chosen per region." },
  { term: "Replica", slug: "replica", moduleId: "m14", related: ["rpo"], definition: "A live copy of data or compute. A database replica improves availability or reads. It is not a backup, because destructive statements replicate too." },
  { term: "Reverse proxy", slug: "reverse-proxy", moduleId: "m1", related: ["load-balancer"], definition: "A server that accepts client requests on behalf of an application, often terminating TLS and forwarding inward. Nginx and a cloud load balancer commonly play this role." },
  { term: "Rollback", slug: "rollback", moduleId: "m13", related: ["roll-forward"], definition: "Returning to a known previous artifact or configuration. Unsafe when the new database schema cannot be read by the old code." },
  { term: "RPO", slug: "rpo", moduleId: "m14", related: ["rto", "backup"], definition: "Recovery point objective: the maximum age of data you can afford to lose. A nightly backup implies up to 24 hours of RPO unless you add logs or more frequent copies." },
  { term: "RTO", slug: "rto", moduleId: "m14", related: ["rpo"], definition: "Recovery time objective: the maximum time you can take to restore service after a declared disaster." },
  { term: "SBOM", slug: "sbom", moduleId: "m12", related: ["digest"], definition: "A software bill of materials: a list of components in an artifact. Useful during a vulnerability disclosure, not a guarantee the software is safe." },
  { term: "Security group", slug: "security-group", moduleId: "m8", related: ["subnet"], definition: "A stateful virtual firewall attached to a cloud network interface. Allowed inbound traffic is remembered so the response is allowed." },
  { term: "SLI", slug: "sli", moduleId: "m11", related: ["slo", "sla"], definition: "A service level indicator: a measured quantity such as the fraction of requests faster than 300 ms." },
  { term: "SLO", slug: "slo", moduleId: "m11", related: ["sli", "error-budget"], definition: "A service level objective: the internal target for an SLI, such as 99.9% of requests succeeding over 30 days." },
  { term: "SLA", slug: "sla", moduleId: "m11", related: ["slo"], definition: "A service level agreement: a customer-facing contract, often with credits, which should be looser than the internal SLO." },
  { term: "State", slug: "terraform-state", moduleId: "m9", related: ["drift", "iac"], definition: "Terraform's record of which real resource IDs correspond to which config addresses. It is sensitive and must be locked and stored remotely for shared work." },
  { term: "Toil", slug: "toil", moduleId: "m0", related: ["sre"], definition: "Manual, repetitive operational work that scales with traffic or releases and does not leave the system permanently better. Automation candidates usually start here." },
  { term: "IAM role", slug: "iam-role", moduleId: "m8", related: ["least-privilege"], definition: "An AWS identity that a person or service assumes to receive temporary credentials. Preferred over long-lived access keys embedded in applications." },
];

export function glossaryByLetter(): { letter: string; entries: GlossaryEntry[] }[] {
  const sorted = [...glossary].sort((a, b) => a.term.localeCompare(b.term));
  const groups = new Map<string, GlossaryEntry[]>();
  for (const entry of sorted) {
    const letter = entry.term[0]?.toUpperCase() ?? "#";
    const list = groups.get(letter) ?? [];
    list.push(entry);
    groups.set(letter, list);
  }
  return [...groups.entries()].map(([letter, entries]) => ({ letter, entries }));
}
