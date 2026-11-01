import type { Lesson } from "../types";

export const lessons: Lesson[] = [
  {
    slug: "deployment-strategies-rollbacks",
    title: "Deployment strategies and rollbacks",
    status: "full",
    blocks: [
      {
        type: "h2",
        text: "Promote one artifact through dev, stage, and prod",
      },
      {
        type: "p",
        text: "Dev is where the author breaks things. Stage should look like production in the ways that matter: same major runtime, same migration tool, configuration that is production-shaped but pointed at stage data. Production serves customers. What moves between them is the same immutable artifact, identified by an image digest, not a rebuild from the branch with a different profile baked in. Rebuilding pulls a base tag that may have moved and a dependency resolver that may have changed its mind. Configuration changes per environment. The binary does not.",
      },
      {
        type: "ul",
        items: [
          "Build once in CI. Record the git SHA and the image digest in the release notes.",
          "Select the Spring profile at runtime with an environment variable. Do not compile a different jar for prod.",
          "A moving tag such as latest is not an identity. Deploy the digest.",
          "Keep the previous digest. Rollback is a deploy of something you already ran, not a scavenger hunt in the registry.",
        ],
      },
      { type: "diagram", id: "bluegreen" },
      { type: "h2", text: "Strategies, side by side" },
      {
        type: "table",
        caption: "Pick a strategy for the failure you can afford, not for the diagram that looks modern.",
        headers: ["Strategy", "Mechanics", "Downtime", "Cost", "Rollback"],
        rows: [
          [
            "Recreate",
            "Stop the old instances, then start the new ones.",
            "Yes. Users wait through the gap.",
            "Low. One copy of the service.",
            "Start the previous artifact. The gap happens again.",
          ],
          [
            "Rolling",
            "Replace instances in batches. Readiness decides when a batch may take traffic.",
            "Usually none, if old and new can run together and probes are honest.",
            "Low to moderate. A small surge of extra instances.",
            "Stop the rollout and return to the previous revision.",
          ],
          [
            "Blue-green",
            "Run two full stacks. Switch the router or service when green is healthy.",
            "None at the switch, if in-flight work is drained.",
            "High. About two environments.",
            "Switch traffic back to blue. Fast, if blue is still up.",
          ],
          [
            "Canary",
            "Send a small share of traffic to the new version and watch errors and latency.",
            "None for the majority of users.",
            "Moderate. Extra capacity and real metrics.",
            "Shift weight back to the old version.",
          ],
          [
            "Shadow",
            "Copy requests to the new version and discard its responses.",
            "None for users, because they never see the shadow.",
            "Moderate to high. You pay for a second execution.",
            "Stop copying. Do not shadow a path that charges a card or sends mail.",
          ],
        ],
      },
      {
        type: "p",
        text: "Rolling is the default in many Kubernetes clusters because it needs little extra capacity. It is a poor fit when only one instance may run, or when the new code cannot tolerate the old schema. Blue-green and canary need the database to accept both versions during the overlap. Shadow is for comparison, not for a release by itself, and it is unsafe on endpoints with side effects unless you strip those side effects in the shadow path.",
      },
      { type: "h2", text: "Feature flags separate deploy from release" },
      {
        type: "p",
        text: "A deploy puts code on servers. A release turns behavior on for users. A feature flag lets you deploy dark code and enable it for one account, then more, without another binary. Flags do not make a destructive migration safe, and they rot: a flag that stays for a year is a second product. Give every flag an owner and a removal date. Store the flag in configuration you can change without rebuilding the image, and log the decision without logging customer secrets.",
      },
      { type: "h2", text: "Database changes that survive a rollback" },
      {
        type: "p",
        text: "Expand and contract keeps the schema compatible with the code you might still need to run. Each step is its own release. Doing them in one deploy feels faster until you need the previous jar.",
      },
      {
        type: "ol",
        items: [
          "Expand: add the new column as nullable or with a default. Do not drop or rename the old column. Old instances ignore the new column.",
          "Deploy code that writes both the old and the new column. Reads still use the old column.",
          "Backfill existing rows. Do it in batches so you do not lock the hot table for the whole table.",
          "Deploy code that reads the new column. Keep writing both until you are sure you will not roll back.",
          "Deploy code that stops writing the old column.",
          "Contract, in a later release: drop the old column only when no running or rollback version reads it.",
        ],
      },
      {
        type: "code",
        lang: "sql",
        title: "Expand now. Contract later.",
        code: `-- Release N. The current application does not read status_v2 yet.
alter table payment add column status_v2 varchar(32);

-- Release N+2 or later, after backfill and after old code is gone.
-- Do not ship this statement in release N.
-- alter table payment drop column status;`,
      },
      {
        type: "callout",
        tone: "warn",
        title: "Flyway on startup is still a migration",
        text: "Many Spring Boot apps apply Flyway or Liquibase when the process starts. That is convenient and it means a deploy can change the schema immediately. Prefer expand-only scripts in that path. A drop, a rename, or a type change in the same release as the new code makes the previous image unsafe to start.",
      },
      { type: "h2", text: "Health, smoke, rollback, roll forward" },
      {
        type: "p",
        text: "A readiness probe tells the load balancer this instance may take traffic. A liveness probe should mean the process is stuck and a restart is the right mitigation, not that a downstream database blipped. A startup probe gives a slow Spring Boot process time to open before liveness kills it. A smoke test runs after the router points at the new version: the public health route, one real read, and a look at the error rate. A green pod that fails login is not a successful deploy. Do not use a smoke test that charges a customer or deletes data.",
      },
      {
        type: "p",
        text: "Roll back when the new code is the problem and the previous artifact still matches the schema. Roll forward when the fix is smaller and safer than returning, or when the schema has already moved so the old process cannot boot. Rolling forward is not a slogan for refusing to undo a bad deploy. It is the choice you make when undo would corrupt data or crash on startup. Write down which one you are doing, and do not do both at once.",
      },
      { type: "h3", text: "A documented Spring Boot rollback" },
      {
        type: "code",
        lang: "bash",
        title: "Return traffic to the previous revision",
        code: `kubectl rollout history deployment/payments-api -n prod
kubectl rollout undo deployment/payments-api -n prod
kubectl rollout status deployment/payments-api -n prod --timeout=180s

# If history was trimmed, set the image back to the digest you recorded.
# kubectl set image deployment/payments-api api=registry.example.com/payments-api@sha256:bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb -n prod

# ECS-style alternative: point the service at the previous task definition revision.
# aws ecs update-service --cluster prod --service payments-api --task-definition payments-api:42`,
      },
      {
        type: "p",
        text: "Before the change, record the running image digest, the git SHA, and the migration version. kubectl rollout undo restores the previous Deployment revision if that ReplicaSet is still in history. Check the revision history limit before you depend on it. On ECS, update the service to the previous task definition revision; do not register a brand-new task definition that happens to look similar unless that is all you have. After the undo, watch readiness and the error rate. Then read the logs of the failed version so the rollback is not the end of the investigation.",
      },
      {
        type: "p",
        text: "Rollback is unsafe when the new version already applied a migration the old version cannot live with. If V2 dropped a column, narrowed a type, or added a NOT NULL column with no default and V2 is the only writer that understands it, V1 will crash-loop or write bad rows. Undo the Deployment only after you know the schema still matches V1. Otherwise ship a forward fix, or restore from backup if the migration destroyed data. Expand and contract is how you stay out of that corner. A feature flag does not recreate a dropped column.",
      },
      { type: "h2", text: "Zero downtime is a qualified claim" },
      {
        type: "ul",
        items: [
          "Long requests die when the process gets SIGTERM, unless you drain them. A preStop hook and a termination grace period help, and they are not infinite.",
          "WebSockets and other pinned connections stay on the old process until you close them on purpose.",
          "A migration that locks a busy table stalls every color of the deploy, not just the new pods.",
          "A scheduler or consumer that is not leader-elected runs twice while both versions are up. That double-sends mail or applies a payment twice if the job is not idempotent.",
          "Clients and DNS caches can keep using an old address after you think the switch is done.",
        ],
      },
      {
        type: "callout",
        tone: "tip",
        title: "Say the limitation out loud",
        text: "A release plan that says zero downtime without mentioning in-flight requests, migrations, and singleton jobs is a slogan. Name the one you are not solving this time.",
      },
    ],
    exercise: {
      title: "Write the rollback note for a column change",
      prompt:
        "A Spring Boot service on Kubernetes is about to add payment.status_v2 and, in the same pull request, drop payment.status. Production uses Flyway on startup. Write the release note you would actually hand to the person on call.",
      steps: [
        "Split the schema change into expand and contract releases. State what the application does in each.",
        "Name the artifact identity you will deploy, and where the previous digest is written down.",
        "Give the Kubernetes rollback commands, and the condition under which you must not run them.",
        "Add one smoke check that does not mutate customer data.",
        "Name one zero-downtime limitation that still applies if the pod rollout itself is clean.",
      ],
      criteria: [
        "The drop is not in the same release as the first deploy of the new code.",
        "Rollback uses a recorded digest or the previous Deployment revision, not a rebuild.",
        "The note says a destructive migration makes app rollback unsafe.",
        "The smoke check is read-only or clearly synthetic.",
        "At least one of long requests, WebSockets, table locks, or singleton jobs is called out.",
      ],
    },
    checks: [
      {
        q: "Staging was built from main this morning. Production will be built from main tonight. Why is that not promotion?",
        a: "Those are two builds. The base image tag, a Maven plugin, or the clock can change the output in between. Promotion means production runs the digest that staging already ran. What you change is configuration: endpoints, secret references, and the Spring profile selected at runtime. If you must rebuild, you are cutting a new release, and staging has not seen it.",
      },
      {
        q: "When is a feature flag the wrong tool for a database change?",
        a: "A flag can hide a code path. It cannot keep the old jar working after you drop the column that jar reads. If the migration is destructive, turning the flag off still leaves a schema the previous version does not understand. Use expand and contract so both versions run. Use the flag to shift reads after the new column is backfilled, not instead of that sequence.",
      },
      {
        q: "Readiness is failing on the new pods and the error rate climbed. Why might rollout undo still be the wrong button?",
        a: "Undo is right when the previous image matches the live schema. It is wrong when this deploy already dropped or rewrote data the old image needs. The old process will then crash or corrupt rows, and you have two failures. Check the migration version that applied before you undo. If the schema moved destructively, roll forward or restore, and say so in the incident channel.",
      },
      {
        q: "Both blue and green are up, and a scheduled report runs twice. What did the strategy assume?",
        a: "Blue-green assumes the extra stack is harmless while it is idle or newly active. A scheduler inside the application, with no leader election and no idempotency key, will run on both sides. The traffic switch did not fail. The job model did. Fix it by electing a leader or by moving the job to a single worker you do not duplicate, and do not shadow or double-run jobs that send mail or move money.",
      },
    ],
    interview: [
      {
        q: "Why promote one artifact instead of rebuilding for production?",
        a: "If I rebuild the jar or the image between staging and production, I ship something the tests did not see. A base image tag can move, and a dependency plugin can resolve a newer build. I build once, record the digest, and that digest is what staging and production run. Configuration changes per environment: the database endpoint, the secret reference, and the Spring profile selected at runtime. I keep the previous digest so a rollback deploys a known image. A tag can be moved later. A digest cannot. Rebuilding to be safe is how you lose the link between the green pipeline and the process that is actually running.",
      },
      {
        q: "When is rolling back a Spring Boot service the wrong mitigation?",
        a: "Rollback is the right first move when the new image is unhealthy and the previous image still matches the database. It is the wrong sole move when a migration already removed something the old version needs. If Flyway dropped a column or changed a type, the previous container can crash on startup or write bad rows. Then I roll forward, or I restore, depending on the damage. Expand and contract avoids the trap: add the column, write both, backfill, switch reads, and drop the old column in a later release. A rollout undo only helps if that old pod template still matches the schema that is live now.",
      },
      {
        q: "Blue-green looks like zero downtime. What still breaks?",
        a: "The traffic switch can be fast and users can still get hurt. In-flight uploads die if I terminate pods immediately, and WebSocket sessions are pinned to the old process. A migration that locks a hot table stalls both colors. A scheduled job with no leader election runs twice while both stacks are up, which double-sends mail if the job is not idempotent. The database has to accept both versions during the overlap. Blue-green also costs about two environments. I would use it when I need a fast switch back and I can afford the capacity. I would not promise zero downtime without those exceptions. A feature flag does not fix a destructive migration.",
      },
    ],
    takeaways: [
      "Promote the same image digest from stage to prod. Rebuilding is a different artifact.",
      "Recreate, rolling, blue-green, canary, and shadow differ in downtime, cost, and how fast you can undo.",
      "Expand and contract database changes so the previous application version can still start.",
      "Roll back when the schema allows it. Roll forward when a migration made the old image unsafe.",
      "Zero downtime fails open on long requests, WebSockets, locks, and singleton jobs. Name the gap.",
    ],
  },
  {
    slug: "nginx-tls-edge",
    title: "Nginx, TLS, and the edge",
    status: "primer",
    blocks: [
      { type: "h2", text: "The reverse proxy is the public door" },
      {
        type: "p",
        text: "Clients should not open a socket straight to an application process on a private port. A reverse proxy accepts the public connection, terminates TLS, and forwards a request to an upstream. Nginx is a common choice for that job. The application can listen on the private network only. Terminating TLS at the edge means the certificate lives on the proxy. Traffic from the proxy to the app is often plain HTTP inside a network you control. Some teams encrypt that hop again. Either choice is a design. Skipping the public certificate is not.",
      },
      {
        type: "code",
        lang: "nginx",
        title: "TLS termination and an upstream",
        code: `upstream payments_api {
    least_conn;
    server 10.0.1.12:8080;
    server 10.0.1.13:8080;
}

server {
    listen 443 ssl;
    server_name api.example.com;

    ssl_certificate     /etc/letsencrypt/live/api.example.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/api.example.com/privkey.pem;

    location / {
        proxy_pass http://payments_api;
        proxy_set_header Host $host;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}`,
      },
      {
        type: "p",
        text: "upstream names the app servers. proxy_pass sends the request there. The Host header and the forwarded headers tell the app what the client asked for. Without them, the app may generate the wrong redirect or think every call is HTTP from the proxy's own address. This block is a teaching sketch: real configs also set timeouts, body size limits, and a TLS protocol floor. Do not copy it into production without those.",
      },
      { type: "h3", text: "How Nginx picks an upstream" },
      {
        type: "ul",
        items: [
          "Round robin is the default: each new connection goes to the next server.",
          "least_conn prefers the server with the fewest active connections. It helps when requests vary in length.",
          "ip_hash sticks a client address to one server. That is a weak session strategy. A shared session store is clearer than hoping the hash holds.",
          "If a server fails its health check, it should leave rotation. A proxy that keeps sending to a dead port turns an app crash into a stream of 502s.",
        ],
      },
      { type: "diagram", id: "http" },
      { type: "h2", text: "Certificates expire on a date, not when you remember" },
      {
        type: "p",
        text: "Public certificates from Let's Encrypt, issued through the ACME protocol, last about ninety days. An ACME client such as certbot, or a controller in the cluster, completes a challenge and renews. HTTP-01 proves you control the hostname by serving a token on port 80. DNS-01 proves it with a DNS record, which you need for wildcards. Automation fails: the challenge port is closed, the account is rate-limited, or the reload never happens. Alert when the served certificate's notAfter date is inside fourteen days, and again inside seven.",
      },
      {
        type: "ul",
        items: [
          "Confirm the certificate the client actually sees. A CDN or a second proxy may still be serving the old file.",
          "Renew, reload Nginx, and check the new dates. A file on disk that Nginx has not loaded does not help the browser.",
          "Check the system clock. A wrong clock looks like an expiry or a not-yet-valid certificate.",
          "Write the customer note as an expiry and a restoration time. Do not instruct people to bypass the warning.",
        ],
      },
      {
        type: "callout",
        tone: "danger",
        title: "Do not disable TLS to get unstuck",
        text: "Turning off certificate verification on a client, setting the proxy to skip verification, or telling users to proceed anyway is not a fix. It hides the next expiry and teaches every client to ignore a real attack. Renew the certificate.",
      },
      {
        type: "p",
        text: "An expiry incident is a release failure you can predict. The calendar, the alert, and a renewal runbook belong next to the host. After you recover, record why automation did not renew, and fix that. The next ninety-day cycle will not be kinder because this one was loud.",
      },
    ],
    exercise: null,
    checks: [
      {
        q: "What is the difference between TLS termination and proxy_pass?",
        a: "TLS termination is the proxy ending the client's encrypted session and holding the certificate. proxy_pass is the instruction that forwards the now-decrypted request to an upstream such as payments_api. You can terminate TLS and still forget to set Host and forwarded headers, and the app will mis-read the original request. They are two steps in one door, not two names for the same thing.",
      },
      {
        q: "The certificate file on disk is valid, and browsers still show an expired certificate. What do you check next?",
        a: "Which certificate the client received. A load balancer, a CDN, or a second Nginx may be serving a different file, or this Nginx may not have been reloaded after the renewal. Compare the dates on the wire with the dates in the file you just wrote. Reloading the process that actually terminates TLS is part of renewal, not a follow-up. Do not tell users to disable verification while you look.",
      },
    ],
    interview: [
      {
        q: "Where should TLS terminate, and what do you do when a certificate expires?",
        a: "I terminate TLS on the public reverse proxy or load balancer, with a certificate that matches the hostname clients use. Nginx accepts HTTPS and proxies to the upstream on the private network. Re-encrypting to the pod is a valid extra choice. Skipping the public certificate is not. Renewal should be automatic with an ACME client, and I still alert on the expiry date because automation fails. If the certificate has already expired, I issue a new one, reload the proxy, and confirm the certificate the client sees. I do not tell users to click through the warning, and I do not disable certificate checks to unblock the incident.",
      },
    ],
    takeaways: [
      "A reverse proxy terminates public TLS and uses proxy_pass to reach private upstreams.",
      "Round robin, least connections, and address hashing behave differently. None of them replace a health check.",
      "Renew certificates before notAfter, alert on the date, and never disable TLS verification as a fix.",
    ],
  },
  {
    slug: "release-coordination",
    title: "Release coordination",
    status: "primer",
    blocks: [
      { type: "h2", text: "A release is a decision, not a script exiting zero" },
      {
        type: "p",
        text: "The pipeline can build a digest and still be the wrong thing to ship today. Coordination is how a small group agrees what is in the artifact, when it moves, and who may stop it. For a fresher, the useful skill is to write that plan down before the window, not to invent a change board.",
      },
      {
        type: "ul",
        items: [
          "Tag the commit that produced the digest. An annotated tag with the release id is easier to find than a Slack message.",
          "Write a changelog of behavior users and operators will notice. A dump of every commit subject is not a changelog.",
          "Declare a short freeze on the release branch so a drive-by merge does not enter the artifact after you tested it.",
          "Name the person who can say no. A window without that person is a script running unattended.",
        ],
      },
      { type: "h2", text: "Config in git, DNS ahead of the cutover" },
      {
        type: "p",
        text: "The manifest, Helm values, or task definition that points at the digest should be reviewed like code. A console click that changes production has no diff and no rollback except memory. If the cutover moves a DNS name, lower the TTL before the window, for example from one hour to one minute, and wait out the old TTL first. During the incident is too late: resolvers are still holding the previous answer. After a stable cutover, raise the TTL again so you are not depending on one-minute caches forever.",
      },
      { type: "diagram", id: "git" },
      { type: "h3", text: "Smoke checklist" },
      {
        type: "ol",
        items: [
          "The running digest matches the digest in the release note.",
          "Health succeeds through the public hostname, not only from inside the pod.",
          "One real read path works. Add a write only if it is synthetic and you can delete it.",
          "Error rate and latency are inside the band you wrote down before the window.",
          "The certificate the client sees is the one you expect, and a background job has not started twice.",
        ],
      },
      { type: "h2", text: "Who communicates" },
      {
        type: "p",
        text: "Separate the person changing the system from the person speaking about it when you can. The speaker posts the start, the impact, and the next update time. The operator does not also compose a novel in the incident channel while a command is half typed. If you are alone, you still write one line before you start and one line when smoke passes or when you abort. Support and the on-call lead should hear that the window is happening before customers do.",
      },
      {
        type: "callout",
        tone: "tip",
        title: "Abort is a successful coordination outcome",
        text: "Stopping because smoke failed, the digest did not match, or the named approver is missing is the process working. Pushing through because people are in the channel is how a small mismatch becomes an outage.",
      },
      {
        type: "p",
        text: "Afterward, attach the digest, the changelog link, the smoke results, and whether you rolled back. That note is what a later incident will need. Memory of who thought the deploy looked fine is not a record.",
      },
    ],
    exercise: null,
    checks: [
      {
        q: "Why lower DNS TTL before a cutover instead of during it?",
        a: "Resolvers cache the old record for the previous TTL. If that TTL is an hour, a bad switch or a rollback can keep sending people to the old address for an hour after you change the zone. Lower the TTL, wait for the old caches to expire, then cut over. Raising it again after the release is fine. Changing it in the middle of the failure does not erase caches that already copied the old value.",
      },
      {
        q: "What makes a changelog different from git log?",
        a: "git log is what changed in the tree. A changelog is what operators and users must know: a new required configuration key, a migration, a removed endpoint, a flag that defaults off. A release note that only lists commit subjects forces every reader to reconstruct the risk. The digest and the tag should be on the same note so the text points at one artifact.",
      },
    ],
    interview: [
      {
        q: "What has to be true before you call a production cutover done?",
        a: "The digest is the one we tested, the changelog says what people will notice, and a named person can still say no. Config that points at the digest lives in git, not in a console click nobody can diff. If the cutover moves DNS, I lower the TTL beforehand so a rollback does not wait on a one-hour cache. Smoke is agreed in advance: public health, one real read, error rate, and the certificate. A green pod is not a working login. One person posts impact and the next update time. Done means smoke passed and the old version can still be restored, not that the script exited zero. I would describe this as lab practice plus a written plan.",
      },
    ],
    takeaways: [
      "Tag the commit, record the digest, and freeze the branch so the tested artifact is the shipped artifact.",
      "Keep release config in git. Lower DNS TTL before a cutover, not in the middle of one.",
      "A named person communicates impact and can abort. Smoke through the public path decides done.",
    ],
  },
];
