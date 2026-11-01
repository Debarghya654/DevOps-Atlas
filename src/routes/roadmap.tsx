import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/roadmap")({
  head: () => ({ meta: [{ title: "Roadmap · DevOps Atlas" }] }),
  component: RoadmapPage,
});

const phases = [
  {
    title: "Phase 1 — Foundations",
    time: "Weeks 1–4 at about 8 hours a week",
    body: "Language, Linux, networking basics, and Git. You should be able to explain a request path and not be afraid of a shell.",
    links: [
      ["what-is-devops", "What Is DevOps?"],
      ["tcp-udp-dns-http", "TCP, DNS, HTTP, HTTPS"],
      ["linux-filesystem-commands", "Linux filesystem"],
      ["git-fundamentals-branching", "Git"],
    ],
  },
  {
    title: "Phase 2 — Build and ship a change",
    time: "Weeks 5–8",
    body: "A script, a Maven build, a pipeline, and a container. One service you can start with Compose.",
    links: [
      ["bash-scripting-fundamentals", "Bash"],
      ["maven-build-lifecycle", "Maven"],
      ["github-actions-spring-boot", "GitHub Actions"],
      ["docker-compose-postgres", "Compose and Postgres"],
    ],
  },
  {
    title: "Phase 3 — Platforms",
    time: "Weeks 9–12",
    body: "Read a cloud diagram, read a Terraform plan, and deploy to a local Kubernetes cluster. Do not start with a paid cluster.",
    links: [
      ["aws-core-services", "AWS core"],
      ["terraform-fundamentals", "Terraform"],
      ["kubernetes-architecture", "Kubernetes"],
      ["kubernetes-troubleshooting", "Troubleshooting Pods"],
    ],
  },
  {
    title: "Phase 4 — Operate and explain",
    time: "After the core path",
    body: "Metrics, a rollback, an incident write-up, and interview answers that match what you actually did.",
    links: [
      ["prometheus-and-grafana", "Prometheus"],
      ["deployment-strategies-rollbacks", "Rollbacks"],
      ["incident-response-troubleshooting", "Incidents"],
      ["interview-prep-freshers", "Interview prep"],
    ],
  },
];

function RoadmapPage() {
  return (
    <div className="mx-auto max-w-reading px-4 py-8 md:px-6">
      <p className="font-mono text-xs text-accent">ROADMAP</p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight">A paced path, not a promise</h1>
      <p className="mt-3 text-base leading-7 text-muted">
        The order is the product. Kubernetes before Linux makes every later error look like magic. Full-time study moves the
        calendar, not the sequence. Ninety days of serious practice can make you a credible beginner. It does not make you a
        senior, and it does not guarantee employment.
      </p>
      <ol className="mt-8 space-y-4">
        {phases.map((phase, index) => (
          <li key={phase.title} className="rounded-xl border border-border bg-surface p-4">
            <p className="font-mono text-xs text-accent">0{index + 1}</p>
            <h2 className="mt-1 text-lg font-semibold">{phase.title}</h2>
            <p className="mt-1 text-xs text-muted">{phase.time}</p>
            <p className="mt-2 text-sm leading-6">{phase.body}</p>
            <ul className="mt-3 space-y-1">
              {phase.links.map(([slug, label]) => (
                <li key={slug}>
                  <Link to="/topics/$slug" params={{ slug }} className="text-sm text-accent">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ol>
      <section className="mt-8">
        <h2 className="text-lg font-semibold">30 / 60 / 90 days</h2>
        <div className="mt-3 overflow-x-auto rounded-xl border border-border">
          <table className="w-full min-w-[36rem] text-left text-sm">
            <thead className="bg-surface-2">
              <tr>
                <th className="px-3 py-2">Window</th>
                <th className="px-3 py-2">Focus</th>
                <th className="px-3 py-2">You can honestly say</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-t border-border align-top">
                <td className="px-3 py-2">30 days</td>
                <td className="px-3 py-2">Linux, networking picture, Git</td>
                <td className="px-3 py-2">I can navigate a host, read a status code, and make a commit without force-pushing main.</td>
              </tr>
              <tr className="border-t border-border align-top">
                <td className="px-3 py-2">60 days</td>
                <td className="px-3 py-2">Scripting, Maven, CI, Docker</td>
                <td className="px-3 py-2">I have a pipeline and a container I started myself, and I can read its failure log.</td>
              </tr>
              <tr className="border-t border-border align-top">
                <td className="px-3 py-2">90 days</td>
                <td className="px-3 py-2">One cloud vocabulary, Terraform plan, local Kubernetes, one project narrative</td>
                <td className="px-3 py-2">I can draw a small system and explain a trade-off. I have not operated a company’s production.</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-sm text-muted">
          The same plan is written as a lesson in{" "}
          <Link to="/topics/$slug" params={{ slug: "roadmap-30-60-90" }} className="text-accent">
            A 30/60/90 day study plan
          </Link>
          .
        </p>
      </section>
    </div>
  );
}
