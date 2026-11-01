import type { ReactNode } from "react";
import type { DiagramId } from "@/content/types";

function Nodes({ items }: { items: { t: string; d: string }[] }) {
  return (
    <ol className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {items.map((item, index) => (
        <li key={item.t} className="rounded-lg border border-border bg-bg px-3 py-2">
          <p className="font-mono text-xs text-accent">
            {String(index + 1).padStart(2, "0")}
          </p>
          <p className="text-sm font-semibold text-fg">{item.t}</p>
          <p className="mt-1 text-xs leading-relaxed text-muted">{item.d}</p>
        </li>
      ))}
    </ol>
  );
}

function Rows({ items }: { items: { t: string; d: string }[] }) {
  return (
    <ol className="space-y-2">
      {items.map((item, index) => (
        <li key={item.t} className="flex gap-3 rounded-lg border border-border bg-bg px-3 py-2">
          <span className="mt-0.5 font-mono text-xs text-accent" aria-hidden="true">
            {index + 1}
          </span>
          <span>
            <span className="block text-sm font-semibold text-fg">{item.t}</span>
            <span className="mt-0.5 block text-xs leading-relaxed text-muted">{item.d}</span>
          </span>
        </li>
      ))}
    </ol>
  );
}

const diagrams: Record<DiagramId, { title: string; caption: string; body: ReactNode }> = {
  infinity: {
    title: "DevOps lifecycle",
    caption:
      "The loop is not a waterfall drawn in a circle. Work moves forward, and signals from production change the next plan. A junior spends most time in build, test, deploy, and the first level of operate.",
    body: (
      <Nodes
        items={[
          { t: "Plan", d: "Small batch of work, acceptance, operability, and rollback thought through." },
          { t: "Code", d: "Change on a branch, reviewed, with tests and no secrets." },
          { t: "Build", d: "Compile, resolve dependencies, produce one immutable artifact." },
          { t: "Test", d: "Automated checks fail the pipeline before a human is asked to trust it." },
          { t: "Release", d: "Version, publish the artifact, and record what is allowed to deploy." },
          { t: "Deploy", d: "Promote that same artifact. Do not rebuild from a different commit." },
          { t: "Operate", d: "Run it, limit blast radius, and keep a way back." },
          { t: "Monitor", d: "Latency, errors, saturation, and logs feed the next plan." },
        ]}
      />
    ),
  },
  http: {
    title: "Request path from browser to application",
    caption:
      "DNS finds an address, TCP (usually) carries the bytes, TLS protects them, and HTTP is the message format on top. A 200 from a health check does not prove the database is healthy unless the check actually uses it.",
    body: (
      <Rows
        items={[
          { t: "Name", d: "The resolver turns app.example.com into an address (A or AAAA) or follows a CNAME." },
          { t: "Connection", d: "TCP handshake to a port (443 for HTTPS). UDP is used by DNS itself, not by typical HTTP." },
          { t: "TLS", d: "The server presents a leaf certificate; the client checks the chain, name, and expiry." },
          { t: "HTTP", d: "Method, path, headers, and maybe a body. The response carries a status code." },
          { t: "Edge", d: "A reverse proxy or load balancer may terminate TLS and forward to an app on a private port." },
          { t: "App", d: "The process logs, queries dependencies, and returns. Timeouts apply at every hop." },
        ]}
      />
    ),
  },
  git: {
    title: "Git areas and a feature branch",
    caption:
      "A commit is a snapshot plus metadata, not a diff. The staging area lets you choose what enters the next snapshot. Remotes are other copies; they do not update until you fetch or push.",
    body: (
      <Rows
        items={[
          { t: "Working tree", d: "Files you edit. Unsaved intent lives here until you stage it." },
          { t: "Index", d: "The snapshot proposal. git add updates it; git commit reads it." },
          { t: "Local repository", d: "Objects and branches on your machine, including commits nobody else has." },
          { t: "Remote", d: "Usually origin. git push publishes; git fetch updates remote-tracking branches." },
          { t: "Branch", d: "A movable name for a commit. main and feature branches diverge, then merge or rebase." },
          { t: "Pull request", d: "A review around a diff. It is a forge feature, not a Git object." },
        ]}
      />
    ),
  },
  cicd: {
    title: "CI/CD pipeline stages",
    caption:
      "Each stage should fail closed: a red test stops publishing. Deployment is a later stage with its own permissions, not a script that runs on every laptop with production credentials.",
    body: (
      <Nodes
        items={[
          { t: "Checkout", d: "Exact commit. Shallow clones are fine until a step needs history." },
          { t: "Build & test", d: "Dependencies, compile, lint, unit tests. Cache with care." },
          { t: "Scan", d: "Dependencies, secrets, image, or IaC. Policy decides warn versus block." },
          { t: "Publish", d: "One versioned artifact or image digest." },
          { t: "Approve", d: "Required for production in many teams. Not a substitute for tests." },
          { t: "Deploy", d: "Promote the artifact. Record the release." },
          { t: "Smoke", d: "A narrow check that the new revision answers and can reach its dependencies." },
          { t: "Rollback", d: "A known previous revision, unless a data migration made that unsafe." },
        ]}
      />
    ),
  },
  docker: {
    title: "Image build and container run",
    caption:
      "The image is a layered template. The container is a running process plus a writable layer. Tags move; digests do not. Deleting a container does not delete its named volume.",
    body: (
      <Rows
        items={[
          { t: "Dockerfile", d: "Instructions. Each RUN/COPY can become a cached layer." },
          { t: "Build context", d: "Files sent to the daemon. .dockerignore keeps secrets and target/ out." },
          { t: "Image", d: "Content-addressed layers plus config (entrypoint, env, user)." },
          { t: "Registry", d: "Stores images. Production pulls by digest when you can." },
          { t: "Container", d: "A process from that image, with its own filesystem layer, network, and limits." },
          { t: "Volume", d: "Data that should outlive the container, such as a database directory." },
        ]}
      />
    ),
  },
  aws: {
    title: "A small three-tier layout on AWS",
    caption:
      "This is a teaching diagram, not a bill of materials. NAT gateways, load balancers, and idle volumes cost money even when traffic is low. DevOps Atlas never creates these resources for you.",
    body: (
      <Rows
        items={[
          { t: "Route 53 and ACM", d: "Name and certificate for the public endpoint." },
          { t: "Public subnet", d: "Load balancer and, if you still use one, a NAT gateway. Not the application." },
          { t: "Private subnet", d: "Application instances or tasks. No direct inbound internet." },
          { t: "Data subnet", d: "RDS or similar. Security group allows the app, not the world." },
          { t: "S3", d: "Artifacts, logs, or uploads. Block public access unless a bucket is intentionally public." },
          { t: "CloudWatch", d: "Metrics, logs, and alarms. An alarm without an owner is noise." },
          { t: "IAM role", d: "The compute assumes a role. People do not paste access keys into the app." },
        ]}
      />
    ),
  },
  vpc: {
    title: "VPC packet path",
    caption:
      "A public subnet is one whose route table sends 0.0.0.0/0 to an internet gateway, not a subnet that merely has a public IP. Private subnets reach the internet through NAT if you pay for that path.",
    body: (
      <Rows
        items={[
          { t: "VPC", d: "Your private network range, for example 10.0.0.0/16." },
          { t: "Subnets", d: "Slices in specific AZs. Spread tiers across AZs when you need availability." },
          { t: "Route table", d: "Longest-prefix decision. Local route is automatic; default route is a choice." },
          { t: "Internet gateway", d: "Path for public subnets. It is not a firewall." },
          { t: "NAT gateway", d: "Outbound from private subnets. Hourly plus data charges. Easy to forget." },
          { t: "Security group", d: "Stateful allow-list on the elastic network interface." },
        ]}
      />
    ),
  },
  terraform: {
    title: "Terraform plan and apply",
    caption:
      "The plan is a prediction against current state and the provider. Apply updates state only if the provider calls succeed. State can contain secrets. Do not commit it.",
    body: (
      <Rows
        items={[
          { t: "Config", d: "HCL you review: resources, variables, modules." },
          { t: "init", d: "Download providers and configure the backend." },
          { t: "plan", d: "Read add, change, and destroy. Surprise destroys stop the review." },
          { t: "apply", d: "Execute the approved plan. This can spend money or delete data." },
          { t: "State", d: "Maps addresses to real IDs. Lock it if more than one person applies." },
          { t: "Drift", d: "Someone clicks in the console. The next plan shows the difference." },
        ]}
      />
    ),
  },
  k8s: {
    title: "Kubernetes control plane and a Deployment",
    caption:
      "You talk to the API server. Controllers reconcile desired spec with the cluster. A Service selects Pods by labels; a selector typo yields a Service with no endpoints.",
    body: (
      <Rows
        items={[
          { t: "API server", d: "Authn, authz, admission, then etcd. kubectl is a client." },
          { t: "etcd", d: "Cluster state. Losing it without backups is losing the cluster configuration." },
          { t: "Scheduler", d: "Binds Pods to nodes that fit requests, taints, and affinity." },
          { t: "Controllers", d: "Deployment maintains ReplicaSets. ReplicaSets maintain Pods." },
          { t: "kubelet", d: "On the node: pulls images, starts containers, runs probes." },
          { t: "Service", d: "Stable virtual IP and DNS name in front of matching Pods." },
        ]}
      />
    ),
  },
  prometheus: {
    title: "Scrape, store, query, alert",
    caption:
      "Prometheus pulls metrics on an interval. Counters only go up, so you graph rate(). An alert should describe user pain or imminent exhaustion, and it should link to a runbook.",
    body: (
      <Rows
        items={[
          { t: "App / exporter", d: "Exposes a text endpoint, often /metrics or /actuator/prometheus." },
          { t: "Scrape", d: "Prometheus fetches it on a schedule and stores samples with labels." },
          { t: "PromQL", d: "Queries the time-series database. Cardinality is a cost and a reliability limit." },
          { t: "Grafana", d: "Dashboards for humans. A dashboard is not an alert." },
          { t: "Alertmanager", d: "Routes firing alerts, deduplicates, and pages the right rotation." },
          { t: "Runbook", d: "What the page means, how to confirm, and how to mitigate." },
        ]}
      />
    ),
  },
  bluegreen: {
    title: "Blue-green deployment",
    caption:
      "Two environments stay compatible with the same data store or you do not cut traffic. Switching the router back is the rollback, until a migration makes the previous code unable to read the new schema.",
    body: (
      <Rows
        items={[
          { t: "Blue", d: "The live revision serving users." },
          { t: "Green", d: "The new revision, deployed and smoked, with no user traffic yet." },
          { t: "Shared data", d: "Migrations must be backward compatible or the switch is one-way." },
          { t: "Cutover", d: "The load balancer or Service selector moves to green." },
          { t: "Watch", d: "Error rate and latency. Have a time box and a person watching." },
          { t: "Rollback", d: "Point traffic at blue if green misbehaves and the schema still allows it." },
        ]}
      />
    ),
  },
  incident: {
    title: "Incident loop",
    caption:
      "Stabilize before you write the perfect root-cause essay. One communicator, one timeline, and a next-update time reduce chaos. The review is blameless about people and specific about systems.",
    body: (
      <Rows
        items={[
          { t: "Detect", d: "Alert, user report, or a deploy you are watching." },
          { t: "Triage", d: "Severity, scope, and whether to roll back first." },
          { t: "Mitigate", d: "Restore service. That may be a rollback, a scale-up, or a feature flag." },
          { t: "Communicate", d: "Impact and next update. No silent heroics on a shared incident." },
          { t: "Resolve", d: "Confirm with the same signal that said you were down." },
          { t: "Review", d: "Timeline, contributing factors, and actions with owners. Not a blame session." },
        ]}
      />
    ),
  },
  linuxfs: {
    title: "Filesystem places you will actually use",
    caption:
      "/proc and /sys are kernel interfaces that look like files. /tmp is scratch space and may be wiped. Logs in /var can fill a disk and take the box down with it.",
    body: (
      <Nodes
        items={[
          { t: "/", d: "Root of the tree. Not a directory to pass to rm." },
          { t: "/etc", d: "Host configuration. Package updates may change files here." },
          { t: "/home", d: "People's files. Service accounts often have no useful home." },
          { t: "/var", d: "Logs, caches, library data, Docker storage on many distros." },
          { t: "/usr", d: "Most installed software. /usr/local for admin-added tools." },
          { t: "/tmp", d: "Temporary files. Do not store the only copy of anything." },
          { t: "/proc", d: "Processes and kernel info as files. Read it; do not treat it as a disk." },
          { t: "/opt", d: "Optional third-party packages, sometimes the app itself." },
        ]}
      />
    ),
  },
  permissions: {
    title: "Ownership and mode bits",
    caption:
      "The effective access is owner bits if you own the file, else group bits if you are in the group, else other. sudo changes who you are for that command. 777 is almost never the fix.",
    body: (
      <Rows
        items={[
          { t: "Owner", d: "A user account. chown changes it. Root can chown anything." },
          { t: "Group", d: "A set of users. Useful for a deploy group that can read config." },
          { t: "Mode", d: "Read, write, execute for owner, group, and other. 644 is rw-r--r--." },
          { t: "Directory x", d: "Execute on a directory means you may traverse it, not run it as a program." },
          { t: "sudo", d: "Runs a command as another user, usually root, and should be logged." },
          { t: "Process", d: "Runs as a user. A service should not run as root unless it must bind a privileged port and then drop privileges." },
        ]}
      />
    ),
  },
};

export function Diagram({ id }: { id: DiagramId }) {
  const spec = diagrams[id];
  return (
    <figure className="my-6 overflow-hidden rounded-xl border border-border bg-surface shadow-card">
      <figcaption className="border-b border-border px-4 py-3">
        <p className="text-sm font-semibold text-fg">{spec.title}</p>
      </figcaption>
      <div className="p-4">{spec.body}</div>
      <p className="border-t border-border px-4 py-3 text-sm leading-relaxed text-muted">{spec.caption}</p>
    </figure>
  );
}
