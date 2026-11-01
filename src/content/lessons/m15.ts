import type { Lesson } from "../types";

export const lessons: Lesson[] = [
  {
    slug: "platform-gitops",
    title: "Platform engineering and GitOps",
    status: "primer",
    blocks: [
      { type: "h2", text: "Optional, and it depends on the role" },
      {
        type: "p",
        text: "This topic is optional and role-dependent. A fresher hired to operate a handful of services may never build an internal developer platform. A fresher joining a platform team will hear these words in the first week. Learn the ideas so you can recognize them. Do not put Argo CD on a resume because you read this page.",
      },
      { type: "h2", text: "A paved road, not a renamed ticket queue" },
      {
        type: "p",
        text: "Platform engineering is the work of making a supported path easier than a snowflake path. The paved road usually includes a service template, a CI pipeline, a deploy target, and a minimum of logs and metrics. Self-service means a developer can create a service along that path without waiting for a human to click on their behalf, because the guardrails are already in the template. Renaming the operations queue to 'platform' and keeping the same tickets is not platform engineering. It is a new sign on the same door.",
      },
      {
        type: "ul",
        items: [
          "The template encodes decisions the company has already paid to learn: non-root containers, health checks, a pinned runtime, a place for secrets.",
          "The road is optional only in theory. If the supported path is slower than a one-off script, people will leave the road.",
          "A platform team still operates the road. They do not disappear behind a portal.",
        ],
      },
      { type: "diagram", id: "git" },
      { type: "h2", text: "GitOps: desired state in git, reconciled continuously" },
      {
        type: "p",
        text: "GitOps means a git repository holds the desired state of the system, and a controller in the cluster keeps reality matched to a commit. Argo CD and Flux are the two controllers you will hear named. They pull from git. You do not give every developer a kubeconfig and hope they remember what they edited. If someone changes a live Deployment, the controller reports drift and, if you configured it to, corrects the object back to git. Rollback of config is a revert of a commit, which is reviewable. Promotion between environments is often a change of which digest a folder or a branch points at. GitOps does not remove code review, and it does not make a bad manifest safe. It makes the bad manifest visible and repeatable.",
      },
      {
        type: "ul",
        items: [
          "Desired state is what should be running. Live state is what is running. Drift is the gap.",
          "The controller reconciles on an interval or on a webhook. It is not a script someone must remember to run.",
          "Secrets still do not belong in git as raw values. The repo holds a reference. A manager or a sealed secret holds the value.",
          "A manual hotfix in the cluster will be reverted or flagged. That is the point. Agree the emergency path before you need it.",
        ],
      },
      { type: "h2", text: "Policy as code" },
      {
        type: "p",
        text: "Open Policy Agent is a policy engine. You write rules, often in Rego, and a system such as a Kubernetes admission controller asks those rules before it accepts an object. The idea of policy as code is that 'no privileged pods' and 'images must come from our registry' are reviewed changes, not a wiki paragraph. Gatekeeper is a common way to run OPA policies in a cluster. Kyverno is a different, Kubernetes-native policy tool you will also see. Either way, the policy should fail closed on the rules you truly mean, and it should return a message a developer can act on. A deny with no explanation becomes a ticket back to the platform team, which is the queue you were trying to shrink.",
      },
      {
        type: "callout",
        tone: "tip",
        title: "This stack is premature for a tiny team",
        text: "Three people, one service, and every change already going through one reviewed pipeline do not need a portal, Argo CD, and OPA on the same afternoon. Those are products you must run. Add a reconciler when unreviewed edits and drift are already hurting you. Until then, a small pipeline and honest docs are the paved road.",
      },
      {
        type: "p",
        text: "If an interviewer asks and you have not operated this, say so, then explain the desired-state idea in one minute. That answer is stronger than a tour of product names. The rest of this course, Linux through incidents, is the part a junior is expected to practice. Platform tooling sits on top of that practice.",
      },
    ],
    exercise: null,
    checks: [
      {
        q: "What is the difference between a ticket queue renamed platform and an internal developer platform?",
        a: "A renamed queue still waits on a person to perform the change. An internal platform offers a paved path a developer can take themselves: template, pipeline, and guardrails already encoded. The platform team builds and runs that path. If the only interface is still a form that a human retypes into a cluster, the name changed and the work did not.",
      },
      {
        q: "Someone kubectl-edits a Deployment in production under GitOps. What should happen?",
        a: "The controller should notice drift between the live object and git. Depending on configuration it flags the drift or reverts the object to the commit. That surprise is a reason to agree an emergency path before go-live, not a reason to turn the controller off. The durable fix is a commit, reviewed like any other change. A hotfix that only exists on the cluster will disappear or remain as an exception you can see.",
      },
    ],
    interview: [
      {
        q: "What is GitOps, and when would you tell a small team to wait?",
        a: "GitOps means git holds the desired state, and a controller such as Argo CD or Flux keeps the cluster matched to that commit. A hand edit shows up as drift and can be reverted. You get a reviewable history and a cleaner config rollback. It is not a ticket queue with a new name, and it is not required on day one. A tiny team with one service and no surprise edits can deploy from a reviewed pipeline and say that plainly. I would add a reconciler when several people change the cluster and nobody can say what should be running. Policy as code, such as rejecting privileged pods, can come with it. I would not stand up a full internal platform just to look mature. The topic is optional and depends on the role.",
      },
    ],
    takeaways: [
      "Platform engineering is a paved, self-service path. A renamed ticket queue is not a platform.",
      "GitOps stores desired state in git. Argo CD or Flux reconciles the cluster and makes drift visible.",
      "Policy as code, often Open Policy Agent, rejects classes of change. For a tiny team the whole stack can wait.",
    ],
  },
  {
    slug: "finops-dora-aiops",
    title: "FinOps, DORA, and AIOps",
    status: "primer",
    blocks: [
      { type: "h2", text: "Optional: cost, delivery numbers, and automation" },
      {
        type: "p",
        text: "FinOps, DORA metrics, and AIOps are optional and role-dependent. A junior may be asked to explain them and is rarely hired to own the company cost model or an AIOps rollout. Use this lesson to speak precisely. Do not chase the tools before you can operate a service without them.",
      },
      { type: "h2", text: "FinOps is a habit, not a surprise invoice" },
      {
        type: "ul",
        items: [
          "Tags: owner, environment, and service on resources that cost money. Untagged spend is unowned spend.",
          "Budgets with alerts before the month ends, not a postmortem of the bill.",
          "Rightsizing from real usage, including peaks. A nightly idle average will shrink a batch job that needs the peak.",
          "Idle waste: unattached disks, unused addresses, dev clusters left running, load balancers with no targets.",
          "Unit cost: money per thousand requests or per order, so a saving is tied to the product and not only to a smaller virtual machine.",
        ],
      },
      {
        type: "p",
        text: "The point is a feedback loop. Someone can see the cost of a choice while there is still time to change it. Turning everything off is not FinOps. Running a second full environment for blue-green is a cost you accept because rollback is faster. Write that trade-off down so the bill is not a mystery.",
      },
      { type: "h2", text: "DORA metrics, named carefully" },
      {
        type: "table",
        caption: "The four metrics this course expects you to define. A later DORA report also tracks deployment rework rate.",
        headers: ["Metric", "What it measures", "A way it gets gamed"],
        rows: [
          [
            "Deployment frequency",
            "How often you deploy to production.",
            "Empty deploys that move a counter and no behavior.",
          ],
          [
            "Lead time for changes",
            "Time from commit to production for a change.",
            "Committing only when the work is already finished, so the clock starts late.",
          ],
          [
            "Change failure rate",
            "Share of deployments that need immediate remediation: rollback, hotfix, or similar.",
            "Hiding failures, or stopping deploys so the ratio looks calm.",
          ],
          [
            "Failed deployment recovery time",
            "How long it takes to recover from a deployment that failed and needs intervention.",
            "Closing the incident before customers are actually recovered.",
          ],
        ],
      },
      {
        type: "p",
        text: "Failed deployment recovery time is the modern name. Older write-ups, and many dashboards, say MTTR or time to restore service. That older phrase often mixed every incident, including ones no deploy caused. The newer name is narrower: recovery from a failed deployment. When someone says MTTR, ask which clock they mean before you compare numbers. Deployment rework rate, added in later DORA reporting, is the share of deployments that exist because something in production went wrong. You do not need elite benchmark tables in your head. You need the definitions, and you need to refuse a comparison you have not measured.",
      },
      {
        type: "callout",
        tone: "warn",
        title: "Goodhart's law",
        text: "When a measure becomes a target, it stops measuring what you cared about. Reward deploy count and you will get empty releases. Punish change failure rate and people will ship less or relabel failures. Read the four numbers together, and ask what the team is optimizing besides the chart.",
      },
      { type: "h2", text: "AIOps and assistants" },
      {
        type: "p",
        text: "AIOps tools and general AI assistants are useful for summarizing a long log, grouping noisy alerts, and drafting a runbook or a timeline you then edit. They are not a substitute for knowing what a 502 means or how a connection pool fills. They hallucinate commands, flags, and cloud API calls that look plausible. Verify against the documentation, and prefer a dry run or a lab when one exists, before you run a generated command on anything shared. Do not paste production secrets, customer data, or live credentials into a chat tool to get a nicer summary.",
      },
      {
        type: "p",
        text: "Event-driven automation and drift remediation are the same caution in product form. A detector notices a defined gap: an untagged bucket, a security group open to the world, a replica count someone edited by hand. The safe first action is to notify or to open a reviewed change. Automatic remediation is reasonable only for a fix you can undo and that you have already approved, with an audit event. A bot that deletes unfamiliar resources will cause the next incident faster than it closes the last one. Start with notify. Expand only the cases you have reversed on purpose.",
      },
      {
        type: "p",
        text: "Advice for a fresher: consolidate fundamentals before you chase this layer. Linux, Git, one CI system, containers, one cloud path, and the incident method will carry an interview. FinOps tags, a honest reading of DORA, and skepticism toward generated commands are enough of this module until a job actually uses the rest.",
      },
    ],
    exercise: null,
    checks: [
      {
        q: "How does failed deployment recovery time differ from the MTTR number on an old dashboard?",
        a: "Failed deployment recovery time measures how long you take to recover from a deployment that failed and needed intervention. MTTR and time to restore, as many teams still say them, often average every incident, including a disk failure or a third-party outage no deploy caused. The modern DORA name is the narrower clock. If a dashboard still says MTTR, ask which incidents are in the average before you treat it as the same metric.",
      },
      {
        q: "An assistant suggests a kubectl command during an incident. What do you do before running it?",
        a: "You treat it as a draft. Check the flags against the documentation, confirm the namespace and the name, and use a dry run when the command has one. Do not run it because the prose around it sounded confident. Assistants invent flags and objects. Also do not paste secrets into the chat to help it be more specific. The incident method still applies: one change, then look at the symptom.",
      },
    ],
    interview: [
      {
        q: "Which DORA metrics would you discuss, and what is the trap in chasing them?",
        a: "I would name deployment frequency, lead time for changes, change failure rate, and failed deployment recovery time. The last one is the modern name for the recovery metric people called MTTR or time to restore, narrowed to recovery from a bad deployment rather than every incident. Later reports also track deployment rework rate, deploys that exist only because something broke. I would not quote elite benchmarks I have not measured. Goodhart's law is the trap: reward deploy count and people ship empty releases; punish failures and people hide them or stop shipping. An assistant can summarize a log or draft a runbook, and it also invents flags, so I verify commands before I run them. I can define these. I have not operated a company dashboard.",
      },
    ],
    takeaways: [
      "FinOps means tags, budgets, rightsizing, idle cleanup, and a unit cost someone can act on.",
      "State the four DORA metrics precisely. Failed deployment recovery time is the modern recovery name; MTTR is the older, broader clock.",
      "Do not game the metric. Verify AI-generated commands. Learn the fundamentals before you collect more tools.",
    ],
  },
];
