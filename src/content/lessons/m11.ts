import type { Lesson } from "../types";

export const lessons: Lesson[] = [
  {
    slug: "prometheus-and-grafana",
    title: "Prometheus and Grafana",
    status: "full",
    blocks: [
      {
        type: "h2",
        text: "Monitoring and observability",
      },
      {
        type: "p",
        text: "Monitoring is the set of checks you knew you would need: dashboards, thresholds, and pages for a service you already understand. Observability is whether you can explain a new failure from the signals you already emit, without shipping a fresh probe for every question. You get there with three signal types, not with a single tool logo.",
      },
      {
        type: "ul",
        items: [
          "Metrics: cheap numbers over time. Good for alerts and trends. Bad at telling you which user hit a rare bug.",
          "Logs: a record of events, best when structured. Good for one request. Expensive if you log everything at debug forever.",
          "Traces: a tree of spans for one request across processes. Good for 'where did the time go'. Useless if nobody propagates the trace id.",
        ],
      },
      {
        type: "h2",
        text: "Golden signals, USE, and RED",
      },
      {
        type: "p",
        text: "The four golden signals are latency, traffic, errors, and saturation. Latency is how long the work takes, and it should be a distribution, not only an average. Traffic is demand: requests per second, or jobs per minute. Errors are the failed fraction of that demand. Saturation is how full the constrained resource is: a queue, a connection pool, a CPU that is throttled, a disk that is nearly full.",
      },
      {
        type: "p",
        text: "USE is a checklist for resources such as CPU, memory, disk, and a network link. Utilization is the fraction of the resource that is busy. Saturation is the queued work that does not fit. Errors are the fault counters on that resource. A disk at moderate utilization with a long queue is saturated. Utilization alone would have looked fine.",
      },
      {
        type: "p",
        text: "RED is the same idea aimed at a service rather than a device. Rate is requests per second. Errors is the failed fraction. Duration is how long successful and failed calls take. A web API dashboard that cannot answer those three questions is not finished. USE and RED overlap the golden signals on purpose. Pick the checklist that matches the thing you are looking at.",
      },
      {
        type: "table",
        caption: "Which checklist to reach for.",
        headers: ["Checklist", "Aimed at", "Questions"],
        rows: [
          ["Golden signals", "A user-facing system", "Latency, traffic, errors, saturation"],
          ["RED", "A request service", "Rate, errors, duration"],
          ["USE", "A physical or kernel resource", "Utilization, saturation, errors"],
        ],
      },
      {
        type: "h2",
        text: "How Prometheus collects",
      },
      {
        type: "diagram",
        id: "prometheus",
      },
      {
        type: "p",
        text: "Prometheus pulls. On a schedule it scrapes an HTTP endpoint, usually /metrics, and stores the samples locally. An application can expose that endpoint itself. An exporter exposes it for something that cannot, such as a node or a database. Each sample has a name, a number, and labels. Labels are how you slice a chart by service or status code. They are also how you blow up the database.",
      },
      {
        type: "callout",
        tone: "warn",
        title: "Cardinality",
        text: "Every unique combination of labels is a new time series. Do not put a user id, an email, an order id, or a raw URL that contains those ids on a metric. Use a route template, a status code, and a service name. High cardinality exhausts memory and makes queries fail when you most need them.",
      },
      {
        type: "h2",
        text: "PromQL for counters and histograms",
      },
      {
        type: "p",
        text: "A counter only goes up, aside from a reset when the process restarts. Graphing the raw counter shows a line to the top right, which is not a rate of traffic. rate() is the per-second average over a window, and it accounts for resets. The window has to be at least a few scrape intervals. A five-minute window on a fifteen-second scrape is a reasonable default for an alert.",
      },
      {
        type: "code",
        lang: "promql",
        title: "Request rate for a Spring Boot timer",
        code: `rate(http_server_requests_seconds_count[5m])`,
        note: "Illustrative query. Not captured from a live run in this environment. This is traffic, not latency. The metric name is the Prometheus form of the Micrometer timer http.server.requests.",
      },
      {
        type: "p",
        text: "A histogram counts observations in buckets. histogram_quantile estimates a percentile from those buckets. It is an estimate: if your buckets are coarse, the quantile is coarse. You rate the bucket series first, and you must keep the le label in the sum. A client-side summary quantile is a different instrument and cannot be aggregated the same way. Do not treat a histogram quantile as an exact percentile from raw samples you do not have.",
      },
      {
        type: "code",
        lang: "promql",
        title: "Estimated 95th percentile, with the bucket caveat",
        code: `histogram_quantile(
  0.95,
  sum by (le) (
    rate(http_server_requests_seconds_bucket[5m])
  )
)`,
        note: "Illustrative. The result is only as fine as the buckets the application exported. Sum by le drops other labels; add the ones you still need, and never drop le.",
      },
      {
        type: "h2",
        text: "Scraping a Spring Boot app",
      },
      {
        type: "p",
        text: "Add Actuator and the Micrometer Prometheus registry. Expose the prometheus endpoint, and do not expose it on the public internet without a network control. A scrape job names a target and a metrics path. Labels on the job, such as service and env, should be low-cardinality and stable.",
      },
      {
        type: "code",
        lang: "yaml",
        title: "Scrape job for Actuator",
        code: `scrape_configs:
  - job_name: orders-api
    metrics_path: /actuator/prometheus
    static_configs:
      - targets: ["orders-api:8080"]
        labels:
          service: orders
          env: lab`,
        note: "Illustrative configuration. Not loaded into a server for this lesson. Bind any local Prometheus to localhost.",
      },
      {
        type: "h2",
        text: "Alerts, fatigue, and Grafana",
      },
      {
        type: "p",
        text: "Page a human for a symptom the user feels: error ratio, latency against the SLO, or a service that is down. Do not page because a cause might be developing, such as a single CPU sample above a round number, unless that cause has a tight and proven link to the outage. Alert fatigue is what happens when every chart has a page. People mute the channel, and the real page is missed. A warning that opens a ticket can be louder in the dashboard and quieter on the phone.",
      },
      {
        type: "code",
        lang: "yaml",
        title: "A symptom alert, not a CPU alert",
        code: `groups:
  - name: orders-api
    rules:
      - alert: OrdersApiHighErrorRatio
        expr: |
          sum(rate(http_server_requests_seconds_count{service="orders",status=~"5.."}[5m]))
          /
          sum(rate(http_server_requests_seconds_count{service="orders"}[5m]))
          > 0.05
        for: 10m
        labels:
          severity: page
        annotations:
          summary: Orders API is failing user requests`,
        note: "Illustrative rule. Not loaded here. A production rule should also require a minimum request rate so an idle night does not divide its way into a page.",
      },
      {
        type: "p",
        text: "Grafana reads Prometheus and draws panels: time series, stats, and tables. A dashboard variable, such as service or env, repeats one dashboard across many services. Keep the variable's label low-cardinality. A dashboard is a hypothesis about RED or USE. If it does not answer rate, errors, and duration for the API, add those panels before you add a twelfth CPU chart.",
      },
      {
        type: "callout",
        tone: "info",
        title: "Nothing here was scraped",
        text: "Queries and YAML on this page are illustrative. They were not executed against a live Prometheus. Prometheus has no authentication in a default install. Do not publish port 9090 on a public address.",
      },
    ],
    exercise: {
      title: "Run Prometheus locally and query it",
      prompt:
        "Use Docker Compose to run Prometheus on localhost only. Scrape Prometheus itself. Do not expose the port on a public interface, and do not create a cloud VM for this.",
      steps: [
        "Write a prometheus.yml that scrapes localhost:9090 under job name prometheus, with a 15 second scrape interval.",
        "Write a Compose file whose Prometheus port binding is 127.0.0.1:9090 only. Pin an official prom/prometheus image tag you have looked up. Treat any tag written in an old note as illustrative, not as a version promise.",
        "Start the stack. Open the local expression browser and query the metric up.",
        "Query a counter on the Prometheus process with rate and a five-minute window, for example the process's own HTTP request counter if it is present.",
        "Stop and remove the stack when you finish. Do not commit a data directory full of local state if it is large, and do not put a cloud key in the compose file.",
      ],
      criteria: [
        "The published port is bound to 127.0.0.1, not to every interface.",
        "The up query shows the prometheus job as 1.",
        "You used rate() on a counter rather than graphing the raw counter as if it were a speed.",
        "You can explain why a user id must not be a label.",
        "No cloud monitoring service was created. If you later point a scrape at AWS, set a billing alarm; free tier is limited; delete what you create. This website never creates cloud resources.",
      ],
    },
    checks: [
      {
        q: "Why wrap a counter in rate()?",
        a: "A counter is cumulative. rate() turns it into a per-second average over the window and handles process restarts. The raw value is not a measure of current traffic.",
      },
      {
        q: "Why is a histogram quantile only an estimate?",
        a: "Prometheus stores bucket counts, not every sample. histogram_quantile interpolates inside the buckets you configured. Coarse buckets mean a coarse percentile, and you must rate the buckets and keep the le label.",
      },
      {
        q: "What is a high-cardinality label?",
        a: "A label with a huge number of values, such as user id or raw request path with ids. Each combination is a new series and will exhaust Prometheus long before a label like status code will.",
      },
      {
        q: "What should a page correspond to?",
        a: "A user-visible symptom: errors, latency, or the service being unreachable. A bare CPU threshold is a cause, and it belongs in a dashboard or a ticket unless you have shown it predicts an outage.",
      },
    ],
    interview: [
      {
        q: "Compare the golden signals, RED, and USE.",
        a: "Golden signals are the four things a user-facing system owes you: latency, traffic, errors, and saturation. RED narrows that to a service's rate, errors, and duration, which is what I put on an API dashboard. USE is for a resource: utilization, saturation, and errors, which is what I use when the API is slow and I suspect the disk or the CPU. Saturation, the queue, matters more than a pretty utilization percentage.",
      },
      {
        q: "How does a Spring Boot app show up in Prometheus?",
        a: "Actuator plus the Micrometer Prometheus registry exposes /actuator/prometheus. Prometheus scrapes it on an interval. The timer http.server.requests becomes a counter and a histogram with names ending in http_server_requests_seconds_count and http_server_requests_seconds_bucket. I graph rate of the count for traffic, and histogram_quantile of the rated buckets for a latency estimate. I keep labels to method, status, and a route template.",
      },
      {
        q: "What does alert fatigue look like, and how do you reduce it?",
        a: "Pages fire for CPU, for disk predictions, and for single failed health checks, so the on-call mutes the channel. I delete or retarget alerts that are not symptoms, add a for duration so a one-scrape blip does not page, and require enough traffic that an idle ratio cannot divide by nearly zero. Causes stay on dashboards. The page is tied to a runbook.",
      },
    ],
    takeaways: [
      "Metrics, logs, and traces answer different questions. Metrics are what Prometheus stores.",
      "Golden signals cover the user path. RED is for services. USE is for resources.",
      "Prometheus scrapes. rate() is for counters. Histogram quantiles are bucket estimates.",
      "Do not use a user id as a label. Page on symptoms, or people will ignore the pages.",
      "Grafana is the dashboard. Keep Prometheus on localhost in a lab, and do not pretend a query here was run.",
    ],
  },
  {
    slug: "sli-slo-golden-signals",
    title: "SLIs, SLOs, and error budgets",
    status: "primer",
    blocks: [
      {
        type: "h2",
        text: "Three words that are not synonyms",
      },
      {
        type: "p",
        text: "An SLI is a measurement: the ratio of good events to valid events, such as the fraction of HTTP requests that returned in under 300 milliseconds and were not 5xx. An SLO is an internal target for that SLI over a window, such as 99.9 percent of requests over 30 days. An SLA is a contract with a customer, usually with a credit or a penalty if a different, often looser, number is missed. You can have an SLO with no SLA. You should not have an SLA you do not know how to measure.",
      },
      {
        type: "table",
        caption: "SLI, SLO, and SLA.",
        headers: ["Term", "What it is", "Who it is for"],
        rows: [
          ["SLI", "The measurement", "The team, computed from metrics or logs"],
          ["SLO", "The target for that measurement", "The team, as an engineering goal"],
          ["SLA", "A promise with consequences", "A customer contract, written by the business"],
        ],
      },
      {
        type: "h2",
        text: "Error budget",
      },
      {
        type: "p",
        text: "The error budget is what the SLO allows you to get wrong. For an availability SLO of 99.9 percent, the budget is 0.1 percent of the window. In a 30-day month there are 30 times 24 times 60, which is 43,200 minutes. One tenth of one percent of 43,200 is 43.2 minutes. So a 99.9 percent monthly availability SLO allows about 43 minutes of downtime in that 30-day window. A 31-day month is slightly more and a 28-day month is slightly less. This is arithmetic for a hypothetical target. It is not a measured outage from a real customer, and this lesson invents no customer numbers.",
      },
      {
        type: "p",
        text: "Spend the budget on releases and planned risk. When the budget is gone, stop shipping features that add risk and put the time into reliability until the window recovers. An SLO that is 100 percent is a refusal to change the system. An SLO copied from a slide, with no SLI behind it, is a slogan.",
      },
      {
        type: "h2",
        text: "Where the SLI comes from",
      },
      {
        type: "p",
        text: "Availability and latency SLIs are golden signals with a threshold. Traffic tells you whether the ratio is meaningful. Errors are the numerator of a failure SLI if you define failure as a 5xx or a timeout. Saturation is often a leading indicator, not the SLI itself: users do not experience queue depth, they experience slow and failed requests. Write the SLI as a ratio of events, not as an average of averages.",
      },
      {
        type: "callout",
        tone: "info",
        title: "No invented customers",
        text: "Do not present the 43 minute figure as someone's outage. It is the downtime a 99.9 percent target permits in a 30-day month. Do not invent revenue loss or user counts to make an SLO feel urgent.",
      },
      {
        type: "h3",
        text: "A target you can defend",
      },
      {
        type: "ul",
        items: [
          "Name the SLI in one sentence: good requests over valid requests, and what good means.",
          "Pick the window: rolling 30 days, or a calendar month. Say which.",
          "Compare the SLO to the SLI you can actually query. If the metric does not exist, the SLO is not real yet.",
          "Keep the SLA, if any, looser than the SLO so you have room to react before a contract breach.",
        ],
      },
    ],
    exercise: null,
    checks: [
      {
        q: "Which of SLI, SLO, and SLA is the contract?",
        a: "The SLA. The SLI is the measurement and the SLO is the internal target. An SLA without an SLI is a promise you cannot verify.",
      },
      {
        q: "About how many minutes of downtime does a 99.9 percent SLO allow in a 30-day month?",
        a: "About 43 minutes. 30 times 24 times 60 is 43,200 minutes, and 0.1 percent of that is 43.2. It is a budget for a hypothetical target, not a report of a real incident.",
      },
    ],
    interview: [
      {
        q: "Define SLI, SLO, and error budget with a latency example.",
        a: "The SLI is the fraction of valid requests served in under 300 milliseconds without a 5xx. The SLO might say that fraction is at least 99.9 percent over a rolling 30 days. The error budget is the 0.1 percent of requests that may miss that bar, which is the same idea as about 43 minutes if you were talking about full downtime in a 30-day month. I alert on budget burn, not on a vanity average. I do not quote a customer impact number I have not measured.",
      },
    ],
    takeaways: [
      "An SLI is a measurement, an SLO is a target, and an SLA is a contract.",
      "A 99.9 percent availability SLO over 30 days is about 43 minutes of error budget.",
      "Base the SLI on events users feel. Do not invent customer figures to decorate the target.",
    ],
  },
  {
    slug: "logging-and-tracing",
    title: "Logging and tracing",
    status: "primer",
    blocks: [
      {
        type: "h2",
        text: "Structured logs",
      },
      {
        type: "p",
        text: "A log line should be an event with fields, not a sentence somebody has to parse with a regular expression. JSON with a timestamp, a level, a message, and a small set of ids is enough. Levels are a contract: error means a human may need to act, warn means a degraded path, info means a business or lifecycle event you are willing to keep, debug means detail you turn on briefly. A correlation id, often the trace id, ties one request's lines together across services.",
      },
      {
        type: "callout",
        tone: "danger",
        title: "Do not log secrets or payment data",
        text: "Do not log access keys, session tokens, passwords, or full card numbers. Log a request id, not the Authorization header. The fake key id AKIAEXAMPLEINVALID is still not something to put in a log example as if it were useful data. If a secret was logged, rotate it, and do not copy the line into a ticket.",
      },
      {
        type: "h2",
        text: "Shipping and storing",
      },
      {
        type: "p",
        text: "Fluent Bit is a small agent that tails container logs, adds Kubernetes metadata, and ships them. It is not a database. Where the logs land is a separate choice. Grafana Loki stores log text cheaply and indexes only the labels you choose, which fits high volume if you do not treat it like a full-text search engine. Elasticsearch and OpenSearch index the contents of the log, which answers richer searches and costs more to run. Pick Loki when label-scoped search is enough. Pick OpenSearch when you truly need to search the message body across a large history.",
      },
      {
        type: "table",
        caption: "Two ways to keep logs. Both need someone to operate them.",
        headers: ["", "Loki", "Elasticsearch or OpenSearch"],
        rows: [
          ["Index", "Labels you chose", "Inverted index of the log contents"],
          ["Strength", "Lower cost next to Grafana and Prometheus labels", "Richer full-text queries"],
          ["Failure mode", "You cannot find a line if you did not label or filter it", "Cluster load and cost if every field is indexed"],
        ],
      },
      {
        type: "h2",
        text: "Traces",
      },
      {
        type: "p",
        text: "OpenTelemetry is the vendor-neutral way to emit telemetry. A trace is one request. A span is one timed operation inside it: an HTTP server call, a database query, a downstream HTTP client call. Spans carry a trace id and a parent id. The application must propagate the trace context, usually the W3C traceparent header, or the next service starts a new trace and the picture breaks. Export spans to a tracing backend. Do not log every span as a substitute for a trace store.",
      },
      {
        type: "p",
        text: "Use the trace id as the log correlation id so a slow trace points at the log lines for that request, and the logs point back at the trace. Sample traces when volume is high, and do not sample away one hundred percent of errors if you can mark them to keep. Metrics remain the thing you alert on. Traces explain a single slow request. Logs explain what the process said.",
      },
      {
        type: "callout",
        tone: "info",
        title: "Local first",
        text: "You can run a log shipper and a trace collector on your laptop later. You do not need a cloud account for the vocabulary. A cloud log platform bills for ingest and retention. Free tier is limited. Set a billing alarm and delete what you create. This website never creates cloud resources.",
      },
    ],
    exercise: null,
    checks: [
      {
        q: "What is the indexing difference between Loki and OpenSearch?",
        a: "Loki indexes a small set of labels and keeps the line text beside them. OpenSearch builds an inverted index of the log content, which searches more and costs more.",
      },
      {
        q: "What has to travel with a request for traces to cross services?",
        a: "The trace context, typically the W3C traceparent header. Without propagation, each service starts an unrelated trace and you cannot see the path.",
      },
    ],
    interview: [
      {
        q: "What do you put in a log line, and what do you refuse to put there?",
        a: "A timestamp, level, message, service name, and a correlation or trace id, plus a few low-cardinality fields such as route template and status. I refuse secrets, raw tokens, and full payment numbers. I ship through an agent such as Fluent Bit into Loki or OpenSearch depending on whether I need full-text search. I keep metrics for paging and use the trace id to jump from a slow span to those log lines.",
      },
    ],
    takeaways: [
      "Log structured events with levels and a correlation id. Never log secrets or full payment data.",
      "Fluent Bit ships logs. Loki indexes labels. OpenSearch indexes the text.",
      "A trace is a tree of OpenTelemetry spans. Propagate the trace context or the tree breaks.",
    ],
  },
  {
    slug: "alerting-oncall",
    title: "Alerting and on-call",
    status: "primer",
    blocks: [
      {
        type: "h2",
        text: "Symptoms, not theories",
      },
      {
        type: "p",
        text: "An alert that pages someone should describe a symptom: users are receiving errors, latency has burned the SLO, or the site does not answer. An alert on a cause, such as one CPU core or one disk prediction, belongs in a dashboard or a daytime ticket unless you have evidence that this cause becomes this symptom within minutes. Tie every page to a runbook with the service name, the dashboard, the first commands, and the rollback. A page with no runbook is a request to improvise at night.",
      },
      {
        type: "h2",
        text: "Severity and escalation",
      },
      {
        type: "table",
        caption: "An example scale. Match it to your team's words, and keep the count small.",
        headers: ["Severity", "Meaning", "Response"],
        rows: [
          ["SEV-1", "User-facing outage or data loss in progress", "Page primary now. Escalate if they do not acknowledge."],
          ["SEV-2", "Major feature broken, workaround exists or impact is partial", "Page primary. Secondary if the impact is spreading."],
          ["SEV-3", "Degraded internal tool or a risk that can wait", "Ticket for the next business day. Do not page."],
        ],
      },
      {
        type: "p",
        text: "Escalation is a clock, not an insult. Primary on-call acknowledges within a defined time. If they do not, the secondary is paged. If the impact crosses a boundary the primary cannot change, they escalate to the service owner. Write the path down before the incident. Do not invent it in the chat channel.",
      },
      {
        type: "h2",
        text: "Noise is toil",
      },
      {
        type: "p",
        text: "A flapping alert trains the on-call to ignore the phone. That is toil: work that is manual, repetitive, and without lasting value. Give symptom alerts a for duration, a minimum traffic guard, and a single route. Review pages every week and delete the ones that did not change a decision. A quiet week is not a failure of the monitoring system.",
      },
      {
        type: "h2",
        text: "Afterward, briefly",
      },
      {
        type: "p",
        text: "This primer stops at the shape of a review. A later module goes into incident command in depth. When the user-facing impact is over, hold a blameless postmortem. Blameless means you look for the system and the process that let the change through, not for a person to punish. People who expect blame hide the timeline.",
      },
      {
        type: "ol",
        items: [
          "Timeline: what happened, in order, from the first symptom to recovery, with times.",
          "Impact: who was affected, for how long, in quantities you actually measured. Do not invent user counts.",
          "Root cause: the technical and process reasons, including why the guardrails did not catch it.",
          "Corrective actions: specific changes with owners, not a resolution to be more careful.",
        ],
      },
      {
        type: "callout",
        tone: "info",
        title: "Scope",
        text: "You do not need a cloud account, a paid paging vendor, or a production cluster to learn this vocabulary. If a later lab wires alerts to a cloud notification topic, that topic and the resources it watches can cost money. Free tier is limited. Set a billing alarm and delete what you create. This website never creates cloud resources.",
      },
    ],
    exercise: null,
    checks: [
      {
        q: "Why is a bare CPU alert a poor page?",
        a: "CPU is a cause, not a user symptom. It fires when nobody is hurt and teaches the on-call to mute the channel. Page on errors, latency, or unavailability, and keep CPU on a dashboard.",
      },
      {
        q: "What four parts belong in a blameless postmortem?",
        a: "A timeline, measured impact, root cause including process gaps, and corrective actions with owners. Blameless means the review does not hunt for someone to punish.",
      },
    ],
    interview: [
      {
        q: "Design the paging rule for an HTTP API in four sentences.",
        a: "I page when the error ratio or the latency SLI burns the error budget fast enough that users are affected, and I keep that alert in a for window so one scrape does not wake anyone. The alert links a runbook with the dashboard, the rollback, and the escalation to secondary. CPU and disk sit on the RED or USE dashboard unless they have a proven short path to the symptom. I delete alerts that fire and do not change what we do, because noisy pages become toil and then become silence.",
      },
    ],
    takeaways: [
      "Page on symptoms, and attach a runbook. Causes belong on dashboards.",
      "Severity decides who is woken. Escalation is a written clock.",
      "A blameless postmortem records timeline, impact, root cause, and corrective actions.",
    ],
  },
];
