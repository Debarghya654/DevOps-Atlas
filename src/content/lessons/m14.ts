import type { Lesson } from "../types";

export const lessons: Lesson[] = [
  {
    slug: "incident-response-troubleshooting",
    title: "Incident response and troubleshooting",
    status: "full",
    blocks: [
      { type: "h2", text: "One method, used on purpose" },
      {
        type: "p",
        text: "An incident is a user-visible failure plus a clock. Troubleshooting is how you turn a symptom into a checked hypothesis. The order below feels slow for the first five minutes and fast by the twentieth, because you are not guessing with production.",
      },
      {
        type: "ol",
        items: [
          "Symptom: what is broken, in the words a user would use. '502 on checkout', not 'the cluster feels wrong'.",
          "Scope: one user, one route, one zone, or everyone. Scope decides severity.",
          "Severity: name it so the right people join. Do not page the whole company for one degraded node.",
          "Hypothesis: one sentence you can disprove. 'The new pods are not listening' is a hypothesis. 'Everything is broken' is not.",
          "Evidence: logs, metrics, deploys, and process state that support or kill the hypothesis.",
          "Fix: one change aimed at that evidence. A mitigation such as rollback counts, and it is not the same as the root-cause fix.",
          "Verify: the original symptom is gone for the original scope, not only that your command exited zero.",
        ],
      },
      {
        type: "callout",
        tone: "warn",
        title: "Do not change five things at once",
        text: "If you raise memory, restart the database, edit DNS, and roll back in the same ten minutes, you will not know which action mattered. You also will not know which one to undo. Change one thing, watch the symptom, then decide the next change.",
      },
      { type: "diagram", id: "incident" },
      { type: "h2", text: "Evidence to gather before you call it a fix" },
      {
        type: "ul",
        items: [
          "Recent deploys: who, which digest, and whether a migration ran.",
          "Logs from the proxy and the application, including the previous container if this one restarted.",
          "Metrics: error rate, latency, CPU, saturation. A flat dashboard can mean the scraper died. Say so.",
          "Process list and restarts. A crash loop is evidence. Killing it without reading it deletes evidence.",
          "Disk space. A full disk stops logging, breaks databases, and fails new containers.",
          "DNS answers and which resolver you asked. Your laptop and the cluster may not match.",
          "Certificate dates on the connection the client uses.",
          "Database connections: pool timeouts in the app, and session counts on the server.",
        ],
      },
      {
        type: "code",
        lang: "bash",
        title: "Read-only checks to start from",
        code: `kubectl rollout history deployment/payments-api -n prod
kubectl logs deploy/payments-api -n prod --tail=100
df -h
dig +time=2 api.example.com
openssl s_client -connect api.example.com:443 -servername api.example.com </dev/null`,
      },
      {
        type: "p",
        text: "These commands observe. They do not repair. Run them in an environment you are allowed to touch. openssl printing a certificate is a diagnostic, not a change to trust settings. If a command needs a privileged role, that is an escalation, not a step you skip past.",
      },
      { type: "h2", text: "Six situations, evidence then action" },
      { type: "h3", text: "502 right after a deploy" },
      {
        type: "p",
        text: "A 502 from the proxy means it did not get a valid response from the upstream. If the error starts in the minute you rolled out, look at the new instances before you edit Nginx. Evidence you want: the proxy error, the pod or process state, and the image digest now running. Typical findings are a process that crashed on startup, a port that does not match the probe, or a migration that threw during boot. If the previous revision was healthy and the schema is still compatible, roll back, then keep the failed logs. Editing the proxy timeout to hide a crash is how the next request waits longer for the same failure.",
      },
      { type: "h3", text: "Disk full" },
      {
        type: "p",
        text: "Evidence is a filesystem at 100 percent and writes failing with no space left. Find which directory grew: application logs, container layers, or a data volume. Delete only files you can name. Rotated logs and a build cache are candidates. The last known-good image is not a candidate, because you may need it for rollback. If the growth is legitimate data, expand the volume and add an alert well before 100 percent. A full disk is also why new logs never appeared. Check one node versus all nodes before you declare the cluster out of space.",
      },
      { type: "h3", text: "DNS failure" },
      {
        type: "p",
        text: "NXDOMAIN means the name is not in the zone you asked. SERVFAIL means the resolver could not get an answer. A successful answer with the wrong address is a bad record or a stale cache, not a resolver crash. Compare a public resolver with the cluster resolver. Check whether a zone change just shipped and what TTL still caches the old answer. Roll back a bad zone record if you have the previous value. Do not edit resolv.conf on every node because one laptop failed a lookup.",
      },
      { type: "h3", text: "Certificate expired" },
      {
        type: "p",
        text: "Evidence is a client refusing the handshake because notAfter is in the past, or notBefore is in the future when the clock is wrong. Confirm you are looking at the certificate the client sees, not a renewed file that was never loaded. The fix is to issue a current certificate and reload the proxy, then verify the dates on a new handshake. Clock skew gets checked before you blame the issuer. Do not tell users to ignore the browser warning, and do not turn verification off.",
      },
      { type: "h3", text: "Database connection pool exhausted" },
      {
        type: "p",
        text: "The application waits for a pool slot and times out. The database may be healthy, saturated, or full of idle-in-transaction sessions that a leak never returned. Compare instances times pool size with the server max connections. A pool of 20 on 30 pods is 600 sessions before any admin client connects. Raising the pool without that arithmetic knocks the database over. Mitigation can be to stop the bleeding pod or kill a runaway query with a DBA. The fix is the leak, the long transaction, or a pool size that fits. Restarting everything recycles sockets and hides the leak until traffic returns.",
      },
      { type: "h3", text: "High CPU" },
      {
        type: "p",
        text: "Confirm it is CPU and not a process stuck waiting on disk. See whether one instance or every instance is hot, and whether the jump lines up with a deploy. For a Java service, a thread dump beats a restart you cannot explain. Scale out only as a bridge, and only if the process is stateless and the extra load will not stampede a database. If the previous version was calm and the schema allows it, roll back the hot version. A tight loop that you scale is a larger tight loop.",
      },
      {
        type: "code",
        lang: "text",
        title: "Evidence excerpts for the six cases",
        code: `proxy: 2026-04-02T18:04:11Z error 502 upstream connect refused 10.0.2.21:8080
disk:  /dev/nvme0n1p1  20G  20G  0  100% /
dns:   api.example.com status SERVFAIL
tls:   certificate notAfter=Apr  1 00:00:00 2026 GMT
pool:  HikariPool-1 - Connection is not available, request timed out after 30000ms
cpu:   PID 4122 user app cpu 98.4 command java`,
        note: "Illustrative output — not captured from a live run in this environment.",
      },
      { type: "h2", text: "Severity and what you say out loud" },
      {
        type: "table",
        caption: "Severity is about customer impact, not about how embarrassed the team is.",
        headers: ["Severity", "Example", "Response"],
        rows: [
          [
            "Sev-1",
            "Checkout fails for all customers. There is no workaround.",
            "Page the on-call set. Incident channel. Updates on a clock, for example every 15 minutes.",
          ],
          [
            "Sev-2",
            "Payments are delayed. A manual workaround exists and is staffed.",
            "Urgent work during the day or a narrow page, depending on the business. Still a named owner.",
          ],
          [
            "Sev-3",
            "One of three nodes is down. The others serve traffic and the SLO holds.",
            "Record it, fix it in hours, mention it in handover. Do not pretend it is fine, and do not page the company.",
          ],
        ],
      },
      {
        type: "p",
        text: "A status update has three parts: the state of the investigation, the impact, and the next update time. 'Investigating. Checkout has failed for all customers since 18:04 UTC. No evidence of data loss yet. Next update 18:20 UTC.' That is enough. Do not speculate a root cause as if it were a fact, and do not name a teammate as the cause. If you are late for the update time, post that you are late and set a new time. Silence reads as hiding.",
      },
      { type: "h2", text: "Afterward: postmortem and runbooks" },
      {
        type: "p",
        text: "A blameless postmortem assumes a person was at the keyboard and asks why the system made the mistake easy and the detection late. Hold it after the service is stable, with the timeline in front of you.",
      },
      {
        type: "ul",
        items: [
          "Summary and impact: who was hurt, for how long, and whether data was lost.",
          "Timeline from first bad signal to detection to mitigation to recovery. Include the gap before you knew.",
          "Contributing factors: missing alert, unsafe migration, wrong digest, runbook that did not match production.",
          "What worked: the rollback, the person who kept updates on time, the dashboard that showed scope.",
          "Action items with an owner and a date. Prefer detect, mitigate, and prevent. 'Be more careful' is not an action.",
          "Leave out a villain. If one click could drop a table, the finding is the missing guard, not the person who clicked.",
        ],
      },
      {
        type: "p",
        text: "A runbook is the short version future you can execute while tired. It names the symptom, the read-only checks, the safe mitigation, when to roll back, when to escalate, and the date it was last tried. Store it next to the service. A runbook that says 'restart and hope' is a wish. After each incident, patch the runbook while the evidence is still fresh.",
      },
      {
        type: "callout",
        tone: "info",
        title: "Practice incidents are not production stories",
        text: "If you learned this on a lab or a paper drill, say so. The method is real either way. Inventing an on-call shift you did not work will collapse at the first follow-up question.",
      },
    ],
    exercise: {
      title: "Write the first fifteen minutes",
      prompt:
        "Pick one scenario: 502 after deploy, disk full, DNS failure, expired certificate, exhausted DB pool, or high CPU. Write the incident note a fresher can execute without changing five things.",
      steps: [
        "State the symptom, the scope you will check first, and a severity with a reason.",
        "List three pieces of evidence and the command or screen that produces each.",
        "Write one hypothesis the evidence could disprove.",
        "Give one mitigation and the condition that would make you choose a different one.",
        "Draft the customer or channel update: status, impact, next update time.",
      ],
      criteria: [
        "Only one change is proposed before the evidence is checked.",
        "The update does not blame a person or invent a root cause.",
        "The certificate scenario does not disable TLS verification.",
        "The disk scenario does not delete unknown files or the last good image.",
        "Severity matches the scope. One bad node is not described as all customers down.",
      ],
    },
    checks: [
      {
        q: "Why is rollback a mitigation and not automatically the end of the incident?",
        a: "Rollback can restore the previous behavior if the schema still matches. Customers may recover while you still do not know why the new version failed. The incident stays open until you verify the original symptom is gone and you have kept enough logs to explain the failure. Closing the channel because the undo command succeeded hides a migration that will fail the same way on the next attempt.",
      },
      {
        q: "The database looks idle, but the app reports pool timeouts. How can both be true?",
        a: "The pool is a client-side limit. Threads can block waiting for a connection the pool will not give out, while the database has spare capacity, if the app is leaking connections or holding them in idle-in-transaction. The opposite also happens: the server is at max connections because too many instances each opened a large pool. Read both sides before you raise the pool size. Raising it blindly can be what fills the server.",
      },
      {
        q: "What three fields does every status update need?",
        a: "Current state (investigating, identified, monitoring, or resolved), customer impact (who cannot do what), and the next update time in a real clock. A paragraph of guesses is not a substitute. If impact is unknown, say impact is unknown and what you are checking. Do not fill the gap with a person's name.",
      },
      {
        q: "A postmortem action item says 'engineer will be more careful.' Why reject it?",
        a: "It has no owner who can finish it, no date, and no change to the system. The next tired person will make a similar mistake. Replace it with a guard you can see: a blocking check, an alert, a runbook step, or a migration rule. Blameless does not mean actionless. It means the action lands on the system that allowed the mistake.",
      },
    ],
    interview: [
      {
        q: "A 502 starts right after a deploy. What do you do in the first minutes?",
        a: "I write the symptom and the scope: which route, since when, and whether it matches the deploy. A 502 means the proxy did not get a valid upstream response, so I look at the new instances before I edit the proxy. I check events, readiness, and the log for a crash or a bind error, and I compare the running digest to the one we meant to ship. If the previous revision was healthy and the schema did not move, I roll back, then keep reading. I do not also raise memory, change DNS, and restart the database, because I will not know what mattered. I post what is broken, who is affected, and the next update time. I have practiced this in labs, not on a paid on-call seat.",
      },
      {
        q: "A node is at 100 percent disk. What is a safe response?",
        a: "I confirm the mount and which directory grew: logs, container layers, or a data volume. I do not delete files because the names look old. Rotated logs or unused build cache are fair game only if the running service does not need them. I keep the last known-good image so rollback is still possible. If the bytes are real data, I expand the volume and alert before the disk is full, because a full disk stops logs, hurts databases, and blocks new containers. I check one node versus the whole cluster. Then I write the path into the runbook so the next person is not improvising delete commands.",
      },
      {
        q: "What belongs in a blameless postmortem, and what does not?",
        a: "I want the timeline, the user impact, how we detected it, and how long customers were hurt before we knew. Then the contributing factors: a missing alert, a migration that made rollback unsafe, a runbook that was wrong. Action items need an owner and a date, and they should make the next incident easier to detect or safer to mitigate. What does not belong is a hunt for the person at the keyboard. If one click could drop a table, the finding is the missing guard. I keep guesses out of customer updates during the incident. The write-up can be honest after the evidence is in. I would not invent a production outage I did not live through.",
      },
    ],
    takeaways: [
      "Move from symptom to scope, severity, one hypothesis, evidence, one change, and a verification of the original symptom.",
      "Read deploys, logs, metrics, disk, DNS, certificates, and database sessions before you stack changes.",
      "Sev-1 is customers down. Sev-3 can be one node while the service still holds. Say which you have.",
      "Updates carry status, impact, and the next time you will speak. They do not carry blame.",
      "Postmortems change the system. Runbooks hold the checks and the safe mitigation, and they have a last-tested date.",
    ],
  },
  {
    slug: "backup-dr-ha",
    title: "Backups, disaster recovery, and high availability",
    status: "primer",
    blocks: [
      { type: "h2", text: "Three copies that are not interchangeable" },
      {
        type: "table",
        caption: "If you can only say one sentence in an interview, say what each copy is for.",
        headers: ["Kind", "What it is", "Use it for", "Do not confuse it with"],
        rows: [
          [
            "Backup",
            "A copy written to separate storage, often incremental, retained on a schedule.",
            "Getting data back after deletion, corruption, or a bad change.",
            "A live system. Restore time is part of the design, not a hope.",
          ],
          [
            "Snapshot",
            "A point-in-time copy of a volume or database, usually fast to create.",
            "A quick recovery of that dataset, sometimes in the same platform.",
            "A copy that automatically survives the same account, region, and failure.",
          ],
          [
            "Replica",
            "A second database applying changes continuously.",
            "Failover when the primary host dies, and sometimes read scaling.",
            "A backup. Deletes and bad migrations replicate.",
          ],
        ],
      },
      {
        type: "p",
        text: "High availability keeps the service up through a failed disk, host, or, if you paid for it, availability zone. It does not keep yesterday's rows after someone drops the table today. The standby will drop the table too. Backups are how you move backward in time. HA is how you avoid moving users to a dead host. You usually need both, and they have different bills.",
      },
      { type: "h2", text: "RPO and RTO with the clock in the sentence" },
      {
        type: "p",
        text: "Recovery point objective is how much data you can afford to lose, measured in time. Recovery time objective is how long you can afford to be down. Example: RPO 15 minutes and RTO 60 minutes. The database dies at 14:00. A 15-minute RPO means the business has accepted losing writes after 13:45. A 60-minute RTO means the service should take traffic again by 15:00. That is only true if a restore you have timed actually finishes inside an hour, including finding the backup, provisioning a clean instance, and checking a query you know the answer to. A backup job that exists on paper and has never been restored does not meet an RTO. It meets a calendar reminder.",
      },
      { type: "h2", text: "Failure domains" },
      {
        type: "ul",
        items: [
          "Disk: one volume dies. A host with a second disk, or a replica on another host, still serves. A snapshot stored on the same disk does not.",
          "Host: one machine dies. A replica in the same rack may die with it if the failure is power or a top-of-rack switch. Know what you actually separated.",
          "Availability zone: one data center in a region. Multi-AZ failover is the usual HA story. A snapshot that exists only in that zone is not a regional plan.",
          "Region: a wide outage or a bad regional change. Cross-region copies cost money and operational practice. Do not claim them because a checkbox looked available.",
        ],
      },
      {
        type: "callout",
        tone: "tip",
        title: "Restore onto something that is not production",
        text: "A drill restores a backup to a clean non-production instance, runs a check you predicted, and writes down the elapsed time and the step that confused you. Never test restore only in theory. Theory does not reveal a missing key, a wrong version, or a backup that is empty.",
      },
      {
        type: "p",
        text: "Capacity planning sits beside the objectives. The standby has to be large enough to take the failover load, or your RTO includes a resize you have not practiced. Backup storage grows with retention and change rate. Restore time grows with size and with how far the copy lives from the machine that will serve it. An idle tiny instance is not a disaster plan for a large primary. Write the numbers next to the RPO and RTO so the next person can see whether the design can hit them.",
      },
    ],
    exercise: null,
    checks: [
      {
        q: "A multi-AZ standby failed over in two minutes. Why might the RPO still be violated later the same day?",
        a: "Failover protected you from a dead host, which is an RTO event. It does not create a point in time before a bad migration. If a drop table replicated to the standby, both sides are missing the data, two minutes after the statement. Only a backup or a point-in-time recovery from logs kept off that replication stream can return you to 13:45. Fast failover and a 15-minute RPO are different promises.",
      },
      {
        q: "What would you record at the end of a restore drill?",
        a: "Which backup you used, the start and finish times, whether the RTO of 60 minutes was met, and one query result you predicted before you opened the data. Also the step that blocked you: permissions, a missing tool, or a snapshot in the wrong region. A drill without a written gap becomes a story that the backup is fine. The next person needs the notes, not the confidence.",
      },
    ],
    interview: [
      {
        q: "The database has a hot standby in another zone. Why is that not a backup?",
        a: "The standby is high availability. If the primary host dies, failover can be fast, which helps the recovery time objective. It does not help when the failure is logical. A dropped table, a bad migration, or a bad update replicates to the standby, sometimes in seconds. A backup is a copy you can restore from a point in time, stored so one disk or one zone does not delete the copy with the primary. A snapshot is often that point in time, but a snapshot stuck in the same account and region can die with a regional loss. An RPO of 15 minutes can lose a quarter hour of writes. An RTO of 60 minutes is believable only after a timed restore.",
      },
    ],
    takeaways: [
      "A replica fails over. A backup lets you go back in time. A snapshot is only as independent as the place you store it.",
      "RPO is data you can lose. RTO is time you can be down. Put numbers on both, then time a restore.",
      "Disk, host, zone, and region are different failure domains. HA in one zone is not a regional backup.",
    ],
  },
  {
    slug: "incident-simulations",
    title: "Paper incident simulations",
    status: "primer",
    blocks: [
      { type: "h2", text: "These are paper drills" },
      {
        type: "p",
        text: "The two situations below are for reasoning. They are not instructions to touch a live system, a classmate's cluster, or a company environment you do not operate. Write the decision, the evidence you would collect, and the fix. If you later practice with commands, do it only in a lab you are allowed to break.",
      },
      {
        type: "callout",
        tone: "info",
        title: "Not a live exercise",
        text: "Do not run these against production to see what happens. A paper simulation ends in a written answer. An unapproved experiment on a shared system is an incident you caused.",
      },
      { type: "h2", text: "Simulation A: CI is green and production is down" },
      {
        type: "p",
        text: "The pipeline on main is green. Checkout in production returns errors. Someone says the tests passed, so the outage cannot be the release. That sentence skips identity. A green pipeline proves the artifact that pipeline built and tested was good enough for those tests. It does not prove production is running that artifact.",
      },
      {
        type: "ul",
        items: [
          "Decision: treat this as a release-identity problem until the digests match. Do not start by rewriting application code.",
          "Evidence: the digest in the production workload, the digest the pipeline recorded, and whether production tracks a moving tag such as latest. Also check whether only configuration changed.",
          "Fix on paper: redeploy the intended digest, and stop releasing mutable tags. If the digests already match, the hypothesis is wrong and you look at config and dependencies next, still one change at a time.",
        ],
      },
      {
        type: "p",
        text: "A common way to get here is promoting a tag that moved after the tests, or rebuilding from main at deploy time so production is a different image than the green job. The dashboard can honestly say CI passed. It passed for a sibling of the thing that is running.",
      },
      { type: "h2", text: "Simulation B: pods Pending after a node scale-down" },
      {
        type: "p",
        text: "A node group scaled down. New or rescheduled pods sit in Pending. The application image did not change. Pending means the scheduler has not bound the pod to a node. It is not, by itself, a crash in the container.",
      },
      {
        type: "ul",
        items: [
          "Decision: this is placement. Read scheduler events before you rebuild the image or raise the database pool.",
          "Evidence: the pod events. Insufficient cpu or memory, a taint the pod does not tolerate, or an affinity rule that names a node pool you just removed. Compare node count to the last hour.",
          "Fix on paper: restore capacity, or reduce requests only after you know the process can actually run smaller. Do not delete random pods. A PodDisruptionBudget explains eviction during the scale-down. It does not, by itself, explain a pod that cannot be scheduled onto what remains.",
        ],
      },
      {
        type: "code",
        lang: "text",
        title: "The kind of event line this drill is about",
        code: `Warning  FailedScheduling  pod/payments-api-7d4f
0/2 nodes are available: 2 Insufficient cpu.`,
        note: "Illustrative output — not captured from a live run in this environment.",
      },
      { type: "h2", text: "How to write the answer" },
      {
        type: "ol",
        items: [
          "One sentence for the decision, so you do not skip straight to commands.",
          "Two or three evidence items, each something you could show another person.",
          "One fix, plus the observation that would make you abandon it.",
          "Label the whole note as a paper simulation.",
        ],
      },
      {
        type: "p",
        text: "That structure is the same method as a real incident, with the production controls removed. Interviewers listening to a fresher are often checking whether you separate evidence from action. They are not checking whether you have a story about taking down a real company system.",
      },
    ],
    exercise: null,
    checks: [
      {
        q: "CI is green. Which single comparison do you want before you blame the tests?",
        a: "The digest running in production against the digest the green pipeline built and recorded. If they differ, the tests did not evaluate the running artifact. A moving tag or a rebuild at deploy time is enough to create that gap. If they match, identity is not the cause and you need a new hypothesis. Restarting pods does not answer the comparison.",
      },
      {
        q: "Pods are Pending after scale-down. Why is rebuilding the image the wrong first fix?",
        a: "Pending means the scheduler has not placed the pod. The container has not started, so a new image cannot change the Insufficient cpu event or a taint on the remaining nodes. The evidence is the event list and the node count. Restoring capacity or correcting requests and rules is the class of fix. A disruption budget may explain why a scale-down stalled. It does not place a pod onto a node that has no room.",
      },
    ],
    interview: [
      {
        q: "CI is green and production is down. How do you reason about a wrong artifact without touching a live system?",
        a: "This is a paper simulation. I am naming evidence, not steps to run on someone else's production. A green pipeline shows that the build it tested met those tests. It does not show that production is running that build. I would compare the digest in the production workload with the digest the pipeline recorded. If production follows a moving tag, or a later rebuild from main, I am looking at tests for a different artifact. The paper fix is to deploy the intended digest and to stop releasing mutable tags. If the digests already match, I drop the hypothesis and look at configuration. I write decision, evidence, and fix so I do not skip to restarting everything.",
      },
    ],
    takeaways: [
      "A green pipeline certifies the artifact it built. Production may be running something else. Compare digests.",
      "Pending after scale-down is a scheduling problem. Read events before you rebuild the image.",
      "These drills are paper reasoning. Do not turn them into unapproved experiments on a live system.",
    ],
  },
];
