import type { Lesson } from "../types";

export const lessons: Lesson[] = [
  {
    slug: "what-is-devops",
    title: "What DevOps is",
    status: "full",
    blocks: [
      { type: "h2", text: "A way of working, not a product" },
      {
        type: "p",
        text: "DevOps is a way of working so that the people who change a system and the people who run it pursue one outcome: small changes, released safely, with evidence that the system still meets its expectations. It is not a tool you buy, not a vendor category, and not a single job title. Jenkins, Git, Docker, Kubernetes, and Terraform can support that way of working. Owning any of them does not mean an organization is practicing DevOps.",
      },
      { type: "h3", text: "Where the name came from" },
      {
        type: "p",
        text: "In 2008 Andrew Shafer proposed a session called Agile Infrastructure at the Agile conference. Almost nobody came. Patrick Debois, a consultant who had been living the gap between software delivery and operations, sought him out anyway, and the conversation continued. In 2009 John Allspaw and Paul Hammond gave a Velocity talk, 10+ Deploys per Day, about developers and operators at Flickr cooperating instead of treating change and stability as enemies. Debois then organized the first DevOpsDays in Ghent, Belgium, on 30-31 October 2009. The hashtag named the problem. It did not invent a new department.",
      },
      { type: "h3", text: "The conflict the conference was about" },
      {
        type: "p",
        text: "Developers were typically rewarded for shipping change. Operators were typically punished when production broke. Each side behaved rationally inside its own incentives. Change introduces risk, so a team measured only on uptime learns to say no, batch changes into rare windows, and add approvals. A team measured only on features learns to throw releases over a wall. The wall itself became the system: slow lead time, late discovery of defects, and incidents with nobody who could see the whole path.",
      },
      { type: "diagram", id: "infinity" },
      {
        type: "p",
        text: "The infinity diagram is a figure-eight used as a map, not as a standard. One loop is usually plan, code, build, and test. The other is release, deploy, operate, and monitor. The crossing is feedback. If information from production does not change the next plan, you have two teams and a logo, not a loop.",
      },
      { type: "h3", text: "Problems that made the wall expensive" },
      {
        type: "ul",
        items: [
          "Long lead time. A change that took an afternoon to write waited weeks for a release window, a change-advisory meeting, or a person who knew the undocumented steps.",
          "Snowflake servers. Machines configured by hand drift. Two hosts with the same role are not the same host. Rebuilding one is a research project.",
          "Manual deploys. Copy a file, restart a process, hope. The steps live in one person's memory, so the deploy is not repeatable and not reviewable.",
          "Blame. An incident becomes a search for who to punish. People hide mistakes, logs go quiet, and the next failure gets more surprising.",
          "Late testing. Integration and operability show up at the end, when fixing them is most expensive. Defects found after the release branch is cut are treated as emergencies instead of as feedback.",
        ],
      },
      { type: "h3", text: "CALMS" },
      {
        type: "p",
        text: "John Willis and Damon Edwards described the early idea as CAMS: Culture, Automation, Measurement, and Sharing. Jez Humble added Lean, which is the L in CALMS. The letters are a checklist for whether a team is changing how it works. They are not five tools, and they are not five teams.",
      },
      {
        type: "table",
        caption: "CALMS, in operational language",
        headers: ["Letter", "Means", "A concrete sign", "A failure mode"],
        rows: [
          [
            "Culture",
            "Shared ownership of the outcome",
            "The person who wrote the change is still available after deploy, and the person who is on call helped shape the rollback",
            "A new DevOps team becomes another queue between development and operations",
          ],
          [
            "Automation",
            "Repeatable build, test, and release",
            "The same scripts produce the artifact every time; production is not assembled on a laptop",
            "Automating a bad manual process and calling the script a transformation",
          ],
          [
            "Lean",
            "Small batches and less waste",
            "One change in flight, limited work-in-progress, waiting time treated as a defect",
            "Making coding faster while the release queue still holds the work for nine days",
          ],
          [
            "Measurement",
            "Decisions from observed flow and runtime",
            "Lead time, change fail rate, time to restore, and a few service-level signals that page someone",
            "Dashboards nobody acts on, or uptime used only as a reason to refuse change",
          ],
          [
            "Sharing",
            "Knowledge leaves one person's head",
            "Runbooks, postmortems, and reviews that a new teammate can use next week",
            "Heroics. The system works only when one senior is online",
          ],
        ],
      },
      { type: "h3", text: "Roles that get collapsed into the word DevOps" },
      {
        type: "p",
        text: "Titles vary by company. A posting named DevOps Engineer often means CI, cloud, and infrastructure-as-code. That can be a real job. It is not the definition of DevOps, and it does not absorb the other roles below. Read the work, not the badge.",
      },
      {
        type: "table",
        caption: "How neighboring roles differ",
        headers: ["Role", "Primary outcome", "Typical lever", "Common confusion"],
        rows: [
          [
            "Development",
            "Change the product correctly",
            "Code, tests, reviews, feature design",
            "Not excused from operability, logs, and rollback",
          ],
          [
            "Operations (classic)",
            "Keep named systems running",
            "Change windows, patching, capacity, incident response",
            "Not a wall whose success metric is how often it says no",
          ],
          [
            "QA",
            "Information about risk before users have it",
            "Test design, automation strategy, exploratory testing",
            "Not the only people who test, and not a phase that starts when coding is declared finished",
          ],
          [
            "SRE",
            "Reliability against an explicit error budget",
            "SLOs, toil reduction, software used on operations work",
            "Not classic ops renamed, and not a promise of 100 percent uptime",
          ],
          [
            "Platform engineering",
            "An internal product developers can use without a ticket",
            "Paved paths: CI templates, clusters, golden deploy, docs",
            "Not a helpdesk that only fulfills infrastructure tickets",
          ],
          [
            "Cloud engineering",
            "A landing zone: accounts, network, identity, cost, guardrails",
            "Account structure, IAM, network baselines, cost controls",
            "Not automatically the DevOps team; the work overlaps platform and often sits beside it",
          ],
        ],
      },
      { type: "h3", text: "What DevOps is not" },
      {
        type: "ul",
        items: [
          "Not a tool. Buying a CI server or a Kubernetes distribution does not create shared ownership.",
          "Not a team that sits between development and operations and becomes a third silo with its own queue.",
          "Not NoOps. Someone still runs the system. The work moves into software, on-call, and platform product management. It does not vanish.",
          "Not developers doing every operational task alone, including pages at 03:00, without tooling, training, or a limit on scope.",
          "Not speed obtained by skipping review, tests, or a rollback path.",
        ],
      },
      {
        type: "callout",
        tone: "warn",
        title: "A junior does not own the company culture",
        text: "You are accountable for your own habits: small changes, honest status, reviews, and writing down what you learned. You are not accountable for renaming departments, repairing a blame culture across an organization, or driving a transformation program. If a job description tells a junior to own the culture, the accurate reply is that you will follow and improve the working agreements on your team. Culture at company scale is a leadership problem.",
      },
      { type: "h3", text: "The same deploy, two ways" },
      {
        type: "p",
        text: "The first script is a manual deploy. It is valid Bash, and it is still a poor system: it runs from a laptop, it assumes one person, and it restarts production without a recorded artifact or a test. The address 203.0.113.10 is from TEST-NET-3, a documentation range, not a host you should contact. The second file is the start of a different practice: every push to main is built and tested by a server the team shares. The runs-on value ubuntu-24.04 is one vendor's image label; your CI must actually provide whatever label you write. That file alone is not DevOps either. It is automation, which is one letter.",
      },
      {
        type: "code",
        lang: "bash",
        title: "Manual deploy from a laptop (anti-pattern)",
        code: `#!/bin/bash
# Anti-pattern: one person, one laptop, no recorded artifact.
# 203.0.113.10 is documentation-only (TEST-NET-3). Do not aim this at a real host.
set -euo pipefail
HOST=203.0.113.10
scp ./invoices.jar "admin@$HOST:/opt/invoices/invoices.jar"
ssh "admin@$HOST" "sudo systemctl restart invoices"`,
      },
      {
        type: "code",
        lang: "yaml",
        title: "Shared verification on every push to main",
        code: `name: invoices-ci
on:
  push:
    branches: [main]
jobs:
  test:
    runs-on: ubuntu-24.04
    steps:
      - uses: actions/checkout@v4
      - run: npm test`,
      },
      {
        type: "p",
        text: "Later measurement work, especially the DORA research published through the Accelerate book and the DORA reports, put numbers on the same idea: deployment frequency, lead time for changes, change failure rate, and time to restore. Those four are useful. They are not a complete definition of DevOps, and a dashboard of them does not replace the culture letter. You will define lead time and time to restore precisely in the lifecycle lesson.",
      },
    ],
    exercise: {
      title: "Map one change onto CALMS",
      prompt:
        "Pick a real or realistic change: a config edit, a library bump, or a one-line bugfix. Write what a DevOps way of working would require for that change. Stay concrete. Do not propose a new department.",
      steps: [
        "Name the change in one sentence and name the handoff that exists today, if any.",
        "Under Culture, name two roles who share the outcome and what each does before production.",
        "Under Automation, name the single manual step you would replace first and how you would know the replacement ran.",
        "Under Lean, state the batch size (one change, or a bundle) and the waiting you would remove.",
        "Under Measurement, name one number with a unit and where it would come from.",
        "Under Sharing, name the artifact a teammate could use next week.",
        "Close with what DevOps is not in this story, and with what a junior is not responsible for.",
      ],
      criteria: [
        "All five CALMS letters appear, and each names an action rather than a slogan.",
        "The measurement includes a unit such as minutes, percent, or deploys per week.",
        "The closing sentences reject a tool purchase or a renamed team as the definition.",
        "The junior's responsibility is limited to team working agreements, not an organization-wide culture program.",
      ],
    },
    checks: [
      {
        q: "A manager says, We do DevOps now, because the company bought a CI server. What is wrong with that claim?",
        a: "A CI server is automation at most. DevOps is the working agreement between change and stability: small batches, shared ownership, measurement, and feedback from production. A server no one trusts, or a pipeline that runs while releases still wait on a monthly manual window, does not create that agreement. The tool can support the practice. It is not the practice.",
      },
      {
        q: "Why were change and stability in conflict in the story that led to DevOpsDays, and what assumption did the Flickr talk challenge?",
        a: "Developers were rewarded for changing the system and operators were punished when it failed, so each group protected its own metric. The assumption was that fewer changes means more stability. Allspaw and Hammond argued the opposite path: if the route to production is small, automated, and reversible, you can change often and stay stable. DevOpsDays in Ghent in October 2009 turned that argument into a community. It did not declare a new job title.",
      },
      {
        q: "Name the five CALMS letters and one failure mode of Automation.",
        a: "Culture, Automation, Lean, Measurement, Sharing. A failure mode of Automation is encoding a bad manual process into a script and treating the script as success. Another is a pipeline that only one person understands, which is heroics with a YAML file. Automation should make the path repeatable and visible, not just faster for the person who already knew the secret steps.",
      },
      {
        q: "How does SRE differ from classic operations and from platform engineering?",
        a: "Classic operations is often accountable for uptime and controls change through tickets and windows. SRE applies software engineering to operations and uses an error budget derived from an SLO: when the budget is healthy the team can take more release risk; when it is exhausted, reliability work comes first. Platform engineering builds an internal product, such as a paved CI and deploy path, whose customers are product teams. None of the three is a synonym for DevOps, and companies mix the titles.",
      },
    ],
    interview: [
      {
        q: "What is DevOps?",
        a: "DevOps is a way of working, not a tool and not a job title. The people who change the system and the people who run it share one outcome: small changes that reach production on a repeatable path, with a way to see whether the change worked. The name comes from the friction that DevOpsDays, first held in Ghent in 2009, was created to discuss. Developers were rewarded for change and operators for stability, and the wall between them made lead time long and failures late. CALMS is the short checklist I use: culture, automation, lean, measurement, and sharing. If a company only bought a CI server, I would say they bought automation, which is necessary and not sufficient.",
      },
      {
        q: "What is DevOps not?",
        a: "It is not Kubernetes, not a DevOps team that becomes a third ticket queue, and not NoOps. Someone still operates production. It is also not asking developers to carry every page with no platform and no training. And it is not skipping tests to look fast. I would judge the practice by lead time, how often deploys hurt users, how fast service is restored, and whether a new person can ship without a hero.",
      },
      {
        q: "Who owns the culture, and what should a junior own?",
        a: "A junior should not claim to own the company culture. I can own my habits: small pull requests, telling the truth about status, reviewing carefully, and updating the runbook I actually used. Changing incentives, on-call design, and whether blame is the default is leadership work. If I were asked to drive a DevOps transformation in my first year, I would narrow that to the agreements on my team and say so.",
      },
    ],
    takeaways: [
      "DevOps is a working agreement between change and stability, not a tool and not a single title.",
      "The 2009 DevOpsDays conversation was about incentives: change was rewarded, instability was punished, and the handoff made both worse.",
      "CALMS stands for Culture, Automation, Lean, Measurement, and Sharing. Automation alone does not qualify.",
      "Development, operations, QA, SRE, platform engineering, and cloud engineering have different outcomes. Titles overlap; the work still differs.",
      "A junior practices team agreements and does not own an organization-wide culture program.",
    ],
  },
  {
    slug: "problems-devops-solves",
    title: "Problems DevOps solves",
    status: "primer",
    blocks: [
      { type: "h2", text: "Most of the delay is not typing" },
      {
        type: "p",
        text: "The problems DevOps targets are flow problems. A two-hour code change that reaches users ten days later was not a two-hour change. It waited in handoffs. The code that passed on a laptop and failed in production was not a mystery of the cloud. The environments were different, and nobody had encoded the difference. The page that fires every morning to restart a process is not engineering. It is toil, and it grows with the service.",
      },
      { type: "h3", text: "Handoffs and queue time" },
      {
        type: "p",
        text: "A handoff is a point where one group stops and another has not started: development to QA, QA to a release manager, release manager to operations. Each handoff puts the work in a queue. The receiver rebuilds context from a ticket, which is a lossy copy of what the author knew. Queue time is the wait before a person touches the work. In many traditional release processes it dominates lead time. If coding takes 2 hours, review waits 1 day, QA waits 3 days, and the next release window is 5 days out, the user waits about 9 days. Speeding up the 2 hours of typing does almost nothing to the 9 days.",
      },
      {
        type: "table",
        caption: "Illustrative timeline for a two-hour fix",
        headers: ["Segment", "Clock time", "Touch or queue"],
        rows: [
          ["Code and local test", "2 hours", "Touch"],
          ["Waiting for review", "1 day", "Queue"],
          ["Waiting for a QA slot", "3 days", "Queue"],
          ["Waiting for the release window", "5 days", "Queue"],
          ["Deploy steps, by hand", "1 hour", "Touch"],
        ],
      },
      { type: "h3", text: "Work in progress" },
      {
        type: "p",
        text: "Work in progress, WIP, is everything started and not finished. High WIP feels productive because everyone is busy. It slows completion: context switching, branches that diverge, and test environments occupied by half-done changes. Lean practice puts an explicit cap on WIP. Finishing one change, including the deploy and the check that it worked, beats starting five. A branch that has been open for three weeks is WIP, even if the author is in meetings.",
      },
      { type: "h3", text: "It worked on my machine" },
      {
        type: "ul",
        items: [
          "Different dependency versions. The laptop has a library the server does not, or the reverse.",
          "Snowflake configuration. A flag was exported in one shell and never written down.",
          "Manual steps that are not in the repository, so production never received them.",
          "Data differences. A unique index exists only in production, or only in development.",
          "Time, locale, and filesystem case sensitivity. A test that passes on macOS can fail on Linux for those reasons alone.",
        ],
      },
      {
        type: "p",
        text: "The fix is not a slogan about environments. It is to build the artifact once, run it in an environment created from the same definition as production, and treat undocumented steps as bugs. Local success is a hint. It is not evidence about production.",
      },
      { type: "h3", text: "Toil" },
      {
        type: "p",
        text: "The SRE literature defines toil as production work that is manual, repetitive, automatable, tactical, without enduring value, and that scales linearly as the service grows. Restarting the same stuck worker every morning is toil: it tracks the number of hosts. Writing a health check that restarts it, then fixing why it sticks, is engineering: the result survives next month. Hard operational work is not automatically toil. Designing a backup restore drill is engineering even though it is operational. Interrupt-driven ticket queues that only ever restart, click, and copy are where toil hides.",
      },
      {
        type: "callout",
        tone: "info",
        title: "What this does not claim",
        text: "Removing a handoff does not remove the need for testing or for an operator's judgment. It moves the test earlier and makes the release path a script instead of a meeting. Some queue time is deliberate, such as a human approval for a regulated production change. That wait should be a decision you chose, with a name, not an accident of a calendar.",
      },
      {
        type: "code",
        lang: "text",
        title: "Same fix, touch time versus elapsed time",
        code: `touch time:  2h code + 1h manual deploy = 3h
queue time:  1d review + 3d QA slot + 5d release window
elapsed:     about 9 days for 3 hours of touch
fraction:    most of the lead time is waiting, not engineering`,
      },
    ],
    exercise: {
      title: "Mark the queues",
      prompt:
        "Take the illustrative timeline in this lesson, or a real change you have seen. Separate touch time from queue time and name one piece of toil.",
      steps: [
        "List each segment with a duration.",
        "Label each segment touch or queue.",
        "Add the touch hours and the queue days separately. Do not add them into one misleading total without units.",
        "Name one handoff where context is lost, and what artifact would carry the context instead.",
        "Name one repeated manual task around this change. Say why it matches the toil definition, or why it does not.",
      ],
      criteria: [
        "Touch time and queue time are both present and not added as if they were the same unit.",
        "At least one handoff is named along with a replacement artifact such as a pipeline log, a test, or a runbook line.",
        "The toil judgment uses the properties manual, repetitive, and linear with growth, not the phrase boring ops.",
      ],
    },
    checks: [
      {
        q: "A team optimizes coding time from 2 hours to 90 minutes. Lead time stays at about 9 days. Why?",
        a: "Because almost all of the 9 days is queue time: review wait, QA wait, and the release window. Cutting 30 minutes of touch time does not move a queue measured in days. The useful change is fewer handoffs, smaller batches, or a release path that is not a weekly window. Measure both touch time and elapsed lead time or you will optimize the wrong clock.",
      },
      {
        q: "Which of these is toil: a daily manual restart of a worker on every host, or a one-time design of a restore drill?",
        a: "The daily manual restart is toil. It is manual, repetitive, automatable, tactical, and it grows with the number of hosts. The restore drill is operational engineering: it produces enduring knowledge and a procedure you can reuse. Toil is not a synonym for operations. Calling all ops work toil hides the engineering and excuses the restarts.",
      },
    ],
    interview: [
      {
        q: "What problems is DevOps actually trying to solve?",
        a: "Long queues between teams, too much work in progress, environments that do not match, and toil that grows with the service. A change can be two hours of work and nine days of waiting because of handoffs and a release window. High WIP keeps many changes started and few finished. It worked on my machine usually means the laptop and production were never the same artifact or the same config. Toil is the manual repetitive work, like restarting a process every morning on every host. I would not say DevOps solves any technical problem by installing a product. It shortens feedback by making the path to production small and repeatable.",
      },
    ],
    takeaways: [
      "Lead time is often mostly queue time between handoffs, not typing time.",
      "High WIP keeps people busy and slows the finish of any single change.",
      "Local success fails when the artifact or config differs, and daily manual restarts are toil because they grow with the service instead of ending it.",
    ],
  },
  {
    slug: "team-roles",
    title: "Team roles",
    status: "primer",
    blocks: [
      { type: "h2", text: "Read the work, not the title" },
      {
        type: "p",
        text: "Companies use DevOps Engineer, SRE, Platform Engineer, Cloud Engineer, and Systems Administrator for overlapping work. A junior title at one company is a mid-level scope at another. Ask what you will change in the first six months, who is on call, and which systems you are allowed to touch. Those answers define the job. The badge does not.",
      },
      { type: "h3", text: "Junior scope and senior scope" },
      {
        type: "table",
        caption: "Realistic scope, not a maturity model",
        headers: ["Question", "Typical junior scope", "Typical senior scope"],
        rows: [
          [
            "Change size",
            "A pipeline fix, a small automation script, a doc, a narrowly scoped config change",
            "Cross-service design, migration plans, risk tradeoffs with stated rollback",
          ],
          [
            "Production",
            "Deploy with a buddy, shadow incidents, do not improvise commands on a live critical system",
            "Decide during an incident, including when to stop and roll back",
          ],
          [
            "Ownership",
            "Owns the ticket through review and follow-up notes",
            "Owns a service's operability: SLO, on-call quality, toil budget",
          ],
          [
            "Ambiguity",
            "Asks for the acceptance check and the forbidden actions",
            "Frames the problem when the ticket is wrong",
          ],
        ],
      },
      {
        type: "p",
        text: "A junior who is sole on-call for a business-critical system in week two is not being trusted in a useful way. They are uncovered risk. A senior who still asks for a second pair on a dangerous change is not slow. They are pricing the blast radius.",
      },
      { type: "h3", text: "SRE error budgets versus classic operations" },
      {
        type: "p",
        text: "Classic operations is often graded on uptime alone. That incentive says: refuse change, because every change can cause downtime. SRE, in the Google model, picks a service level objective and treats the gap as a budget. For a 99.9 percent availability SLO over a 30-day window, the error budget is 0.1 percent of 30 days. 30 times 24 times 60 is 43,200 minutes. One tenth of one percent is 43.2 minutes. If the service has used 10 minutes of user-visible downtime, most of the budget remains and planned releases can continue. If the service has used 50 minutes, the budget is exhausted and the rational next work is reliability, not another feature. The budget does not forbid emergencies, and it does not mean 99.9 is the right target for every system. It makes the reliability target explicit so release pace is a consequence of measured pain instead of a standing argument.",
      },
      {
        type: "code",
        lang: "bash",
        title: "Error budget arithmetic for a 30-day, 99.9 percent SLO",
        code: `python3 -c 'print(round(30 * 24 * 60 * 0.001, 1), "minutes")'`,
      },
      {
        type: "code",
        lang: "text",
        title: "Result of that arithmetic",
        code: `43.2 minutes`,
        note: "Illustrative output — not captured from a live run in this environment.",
      },
      { type: "h3", text: "Platform as a product" },
      {
        type: "p",
        text: "Platform engineering treats internal infrastructure as a product. The customers are product teams. The product is a paved path: a CI template, a deploy command, a logging default, a preview environment. Success is adoption and reduced cognitive load, not the number of tickets closed. A platform group that only fulfills tickets is a helpdesk with a new name. A platform group that forbids every other path on day one, before the paved path works, creates a shadow process. The product needs a documented happy path, a way to escape it when it does not fit, and a feedback channel that changes the platform.",
      },
      { type: "h3", text: "Cloud engineering sits beside that" },
      {
        type: "p",
        text: "Cloud engineering usually owns the landing zone: account or subscription structure, identity, network baselines, shared security controls, and cost guardrails. Product teams should not invent their own IAM model per service. Cloud engineering should not be a bottleneck that hand-builds every bucket. Where platform ends and cloud engineering begins is a company choice. In a small company one person does both, badly named as DevOps, and the junior's protection is a written list of what they may apply without review.",
      },
      {
        type: "callout",
        tone: "tip",
        title: "Questions that reveal scope in an interview or a new team",
        text: "Ask who is on call, what a junior is forbidden to run in production, how a change reaches production, and which SLO or ticket queue defines success. If nobody can answer, the title is decorative. If the answer is the junior is on call alone for payments, the scope is senior risk with a junior safety net missing.",
      },
    ],
    exercise: {
      title: "Assign the work, not the badge",
      prompt:
        "You have three pieces of work and a 99.9 percent SLO. Decide who leads each one and what a junior does. Use a 30-day error budget of 43.2 minutes. The service has already spent 40 minutes this window.",
      steps: [
        "Work A: the invoices health check is red in CI. Name the lead role and the junior's task.",
        "Work B: product wants a risky schema change this week. Use the remaining error budget in the decision. State the remaining minutes.",
        "Work C: every team invents its own deploy script. Say whether this is platform work or a pile of tickets, and what a paved path would include.",
        "State one action a junior should not take in this window.",
      ],
      criteria: [
        "Remaining budget is 3.2 minutes, or an equivalent correct subtraction from 43.2.",
        "Work B is treated as over budget or nearly exhausted, so reliability wins over the risky schema change unless there is an explicit incident exception.",
        "Work C is described as a platform product, not as a request to grant the junior admin rights.",
        "The forbidden junior action is specific, such as applying the schema alone or force-changing production.",
      ],
    },
    checks: [
      {
        q: "A 99.9 percent SLO over 30 days allows about how much downtime, and what should happen when that budget is already spent?",
        a: "About 43.2 minutes. The arithmetic is 30 days times 24 hours times 60 minutes times 0.001. When the budget is spent, the SRE deal is to slow feature risk and spend the next changes on reliability until the window recovers. Classic uptime-only ops tends to refuse change all the time. An error budget refuses extra risk when users have already paid the downtime, and allows change when they have not.",
      },
      {
        q: "Why is a platform team that only closes infrastructure tickets not yet platform engineering?",
        a: "Platform engineering builds a product other teams adopt: a default pipeline, deploy path, and docs, with feedback that changes the product. A pure ticket queue scales linearly with requests, which is the shape of toil, and it keeps every team blocked on a person. Tickets can still exist for exceptions. They are not the product.",
      },
    ],
    interview: [
      {
        q: "How do you tell junior scope from senior scope, and how does an error budget change a release?",
        a: "I do not trust the title. I look at blast radius. A junior should take small tickets, fix a red pipeline, shadow incidents, and ask what they are forbidden to run. A senior owns the service's reliability tradeoff and can decide to roll back. On error budgets: a 99.9 percent SLO over 30 days is 43.2 minutes. If we have used 40, I would not push a risky schema change just because the sprint wants it. I would say the budget is almost gone, so the next change should reduce risk. Titles like DevOps, SRE, and platform differ by company, so I would ask who is on call and what the paved path is before I assumed the job.",
      },
    ],
    takeaways: [
      "Titles overlap. Junior scope is small reviewed changes and incident shadowing, not sole on-call for a critical system.",
      "A 99.9 percent SLO over 30 days is an error budget of 43.2 minutes. A spent budget means reliability work comes before risky features.",
      "Platform engineering is an internal product with a paved path. A ticket-only infrastructure queue is not that product.",
    ],
  },
  {
    slug: "culture-calms",
    title: "Culture and CALMS",
    status: "primer",
    blocks: [
      { type: "h2", text: "Blameless is not unaccountable" },
      {
        type: "p",
        text: "A blameless incident review assumes that the people involved had reasons: the tools they had, the alerts they saw, the incentive to ship, the missing test. The review asks how the system made the error likely and how to change the system. It does not ask who to humiliate. Accountability stays. Someone owns the follow-up, with a date. A person who bypassed a safety control on purpose still answers for that choice. Blameless is not nobody did anything and nothing changes. It is also not a document with the names deleted and the blame kept between the lines.",
      },
      { type: "h3", text: "What still has a name on it" },
      {
        type: "ul",
        items: [
          "The timeline of what the system did, with timestamps, not a story about personality.",
          "The repair: rollback, fix, test, or alert. Each item has an owner and a due date.",
          "The policy or tool that failed open: a missing review, a pipeline that was red and ignored, a runbook that was wrong.",
          "A deliberate violation, if one happened, handled as a management fact. Hiding it inside a blameless template teaches the team that the template is theater.",
        ],
      },
      { type: "h3", text: "Feedback loops" },
      {
        type: "p",
        text: "CALMS culture is the willingness to act on short loops. A unit test fails in seconds. A review comments on a diff the same day. A canary chart moves during the deploy. A quarterly postmortem of a surprise the team already forgot is a long loop. Long loops still matter for patterns across incidents. They are a bad place to learn that a query concatenates user input. Shorten the loop that can be short, and write down the loop that must be long. A loop that nobody is allowed to mention, because the last person who raised it was blamed, is not a loop. It is a silent failure.",
      },
      {
        type: "table",
        caption: "Blame language versus a usable record",
        headers: ["Blame sentence", "Usable record", "Accountable follow-up"],
        rows: [
          [
            "Alex was careless and broke invoices.",
            "14:02 deploy of commit a1b2c3d. 14:06 error rate on POST /invoices rose from 0.1 percent to 18 percent. 14:19 rollback to the previous artifact. Restored.",
            "Alex owns a regression test for apostrophes in names, due Friday. The pipeline must fail that test before deploy.",
          ],
          [
            "Ops should have caught it.",
            "The dashboard for that route existed. No alert fired because the threshold was 50 percent errors for 15 minutes.",
            "The on-call owner lowers the alert to 5 percent for 5 minutes and notes why, due this week.",
          ],
        ],
      },
      { type: "h3", text: "Psychological safety and code review" },
      {
        type: "p",
        text: "Psychological safety means a person can say I do not know, I broke it, or this design is unsafe without being humiliated. It does not mean low standards or permanent comfort. Code review is the everyday test. A useful comment names the behavior and the change: this query concatenates the customer name; bind it as a parameter so an apostrophe cannot change the statement. A useless comment attacks the person: be more careful, or this is sloppy. The first comment is a short feedback loop on the code. The second trains people to hide diffs. Reviewers are accountable for the tone and the specificity. Authors are accountable for the change that merges, including the comment they declined with a reason.",
      },
      {
        type: "callout",
        tone: "warn",
        title: "Safety is not secrecy",
        text: "Do not use blameless as a reason to skip the timeline, skip the owner, or keep production incidents off the record. A private scolding plus a public statement that we do not blame is the same blame culture with extra steps. Write the facts where the team can find them. Keep personnel issues in the management channel they belong in, not in the postmortem.",
      },
    ],
    exercise: {
      title: "Rewrite one blame sentence",
      prompt:
        "Start from: Sam was careless and took down checkout. Invent a short, plausible technical timeline and rewrite the review so it is blameless and still accountable.",
      steps: [
        "Write four timestamped facts: change, symptom, detection, restoration. Use fake hostnames only.",
        "Remove character judgments. Keep system behavior.",
        "Add one follow-up with an owner and a due date. The owner may be Sam. That is accountability, not blame.",
        "Add one review comment, specific enough that an author could act on it tomorrow.",
      ],
      criteria: [
        "The rewrite contains timestamps and a user-visible or metric symptom.",
        "No sentence attributes the outage to carelessness, stupidity, or ops should have.",
        "A named follow-up has a due date and would reduce the chance of the same failure.",
        "The review comment refers to code or config behavior, not to the author's personality.",
      ],
    },
    checks: [
      {
        q: "A postmortem deletes every name and assigns no follow-up. Is that blameless?",
        a: "No. Blameless means you do not humiliate people for a reasonable action taken with bad tools or bad information, and you look for the system condition. It does not mean no owners and no dates. A review with no follow-up changes nothing. If someone deliberately skipped a required control, that fact still belongs in a management conversation. Deleting names while keeping a sarcastic tone is still blame.",
      },
      {
        q: "What does a psychologically safe code review look like on a SQL injection bug?",
        a: "The comment states the mechanism and the fix: the name is concatenated into the SQL text, so a quote can break or alter the statement; pass it as a bound parameter and add a regression test. It does not say the author is careless. Safety here means the author can accept the comment, or disagree with a reason, without a personal attack. The standard does not drop. The unsafe query still cannot merge.",
      },
    ],
    interview: [
      {
        q: "What does blameless mean in an incident review?",
        a: "It means we write what the system did and assume people made the best call they could with the information they had. It does not mean nobody is accountable. I still want a timeline, a restore action, and follow-ups with names and dates. If I were reviewing a bad query, I would comment on the concatenation and the missing test, not on the person's character. Psychological safety is what lets someone say they broke it early enough to roll back. It is not a promise that sloppy changes merge.",
      },
    ],
    takeaways: [
      "Blameless reviews attack system conditions and still assign owners and dates. A review with no follow-up changes nothing.",
      "Short feedback loops, tests, review, and canary metrics, beat discovering the same bug in a quarterly story.",
      "Psychological safety in code review is a specific technical comment, not a softer standard.",
    ],
  },
  {
    slug: "sdlc-agile",
    title: "SDLC and Agile",
    status: "primer",
    blocks: [
      { type: "h2", text: "Waterfall sequences the risk" },
      {
        type: "p",
        text: "A software development lifecycle is the path from a request to a running change and its upkeep. Waterfall sequences that path as phases: requirements, design, implementation, verification, then maintenance. Each phase is supposed to finish before the next starts. Testing is a phase near the end. The model can fit a contract where the requirements are stable and the cost of discovery is low, which is rare for product software. When a requirement is wrong, the team learns it after the expensive part is built. Change control then treats the correction as a defect in the plan rather than as information.",
      },
      { type: "h3", text: "Agile is iterative delivery, not a meeting" },
      {
        type: "p",
        text: "Agile, named in the 2001 Agile Manifesto, delivers working software in small increments and uses feedback during the work, not only at the end. It does not mean no documentation, no design, or no dates. It means a document that no user has touched is a weaker signal than a small release they have. Agile does not require Scrum. A team can work in small batches with Kanban, or with Scrum, and still miss operability. The manifesto did not deploy your service.",
      },
      {
        type: "table",
        caption: "Scrum and Kanban are different controls on flow",
        headers: ["", "Scrum", "Kanban"],
        rows: [
          ["Timebox", "Sprint, often one or two weeks, with a sprint goal", "No required timebox. Flow is continuous"],
          ["WIP limit", "Implicit: the sprint backlog should fit the sprint", "Explicit caps on each column of the board"],
          ["Roles", "Product Owner, Scrum Master, Developers", "No required roles. Policies are explicit instead"],
          ["Planning rhythm", "Sprint planning, daily scrum, review, retrospective", "Replenish the ready queue as capacity appears. Cadence of retrospectives is chosen"],
          ["Fits badly when", "Interrupts exceed the sprint every day and the goal is theater", "Nobody enforces the WIP cap, so it is a whiteboard of chaos"],
        ],
      },
      { type: "h3", text: "Release cadence is not the sprint length" },
      {
        type: "p",
        text: "Release cadence is how often a change actually reaches users. Sprint length is how often a Scrum team plans. A two-week sprint can release daily if the path to production is safe. A two-week sprint can also release once a quarter if deploys are batched into a ceremony. Those are different facts. Report them separately. A team that sprints and then ships every three months is doing timeboxed planning with a slow release cadence. Calling it Agile does not change the queue.",
      },
      { type: "h3", text: "Definition of done includes operability" },
      {
        type: "p",
        text: "Code complete is not done. A useful definition of done is a list the team can check without a hero. For a service change, done usually means all of the following.",
      },
      {
        type: "ul",
        items: [
          "The change is merged to the shared mainline, not left on a long-lived branch.",
          "Automated tests for the change passed in CI, on the merge commit, not only on a laptop.",
          "You can tell from logs or metrics whether the new behavior works in the target environment.",
          "Rollback or a feature flag is named. Someone other than the author can execute it.",
          "Configuration is in the repo or the config system, not in a shell history.",
          "The runbook or user-facing note is updated if operators or users will see different behavior.",
          "Secrets did not enter the repository. A secret scanned in the diff blocks the merge.",
        ],
      },
      {
        type: "callout",
        tone: "info",
        title: "Operability is a requirement, not a favor to operations",
        text: "A story that is done except for logging, the alert, and the rollback is not done. Those are not polish. They are how you find out the story was wrong. Put them in the definition of done so they are not the first things cut when the sprint date arrives.",
      },
    ],
    exercise: {
      title: "Write a definition of done",
      prompt:
        "Write a definition of done for a small HTTP service your team deploys at least daily. Then state the sprint length and the release cadence as two different numbers.",
      steps: [
        "List at least six checkable items. Include tests, observability, rollback, and secrets.",
        "Mark which items a reviewer can verify from the pull request, and which require the pipeline or production.",
        "State a sprint length. State a release cadence. If they differ, say so in one sentence.",
        "Name one item people will pressure you to drop on a Friday, and why the definition keeps it.",
      ],
      criteria: [
        "Done includes an automated test in CI and a way to observe the change after deploy.",
        "Done includes a rollback or flag a second person can use.",
        "Sprint length and release cadence are stated separately.",
        "No item is only the phrase code complete or looks good.",
      ],
    },
    checks: [
      {
        q: "A team runs two-week sprints and ships to production every Friday only if the release manager is in. What is the release cadence, and is that the same thing as the sprint?",
        a: "The release cadence is weekly and gated on a person, or slower when that person is away. The sprint is a two-week planning box. They are not the same fact. Agile ceremonies do not imply continuous delivery. You can plan every two weeks and still batch deploys. Describe both numbers when you describe the team.",
      },
      {
        q: "Why is code merged an incomplete definition of done?",
        a: "Merged code can be untested in CI, invisible in logs, impossible to roll back, and dependent on a manual flag in someone's home directory. Operability checks exist so the team discovers failure from signals instead of from a user ticket days later. Done means the change is releasable and supportable, not merely present on the branch.",
      },
    ],
    interview: [
      {
        q: "How do Waterfall, Scrum, and Kanban differ, and where does operability fit?",
        a: "Waterfall runs phases in sequence and tests late, so a wrong requirement is expensive. Scrum plans in sprints, usually one or two weeks, with a sprint goal and a small set of roles. Kanban limits work in progress on a continuous board and does not need a sprint. Neither Scrum nor Kanban is DevOps. Release cadence is how often users get a change, and it can be daily inside a two-week sprint or quarterly with lots of standups. My definition of done includes CI green, a way to see the behavior in metrics or logs, and a rollback someone else can run. Code complete is not done.",
      },
    ],
    takeaways: [
      "Waterfall learns late. Agile delivers small increments so feedback arrives while change is still cheap.",
      "Scrum timeboxes planning and Kanban limits WIP. Neither one is your release cadence. A two-week sprint can still ship monthly.",
      "Definition of done includes tests, observability, rollback, and shared config, not only merged code.",
    ],
  },
  {
    slug: "ci-cd-terms",
    title: "CI and the two CDs",
    status: "primer",
    blocks: [
      { type: "h2", text: "Three practices, and two of them share a name" },
      {
        type: "p",
        text: "People say CI/CD as if it were one product feature. It is three practices, and the last two are both abbreviated CD. Continuous integration is about how often code joins a shared mainline and how it is verified. Continuous delivery is about keeping that mainline releasable, with a human decision to deploy. Continuous deployment is about removing that human decision so a green mainline goes to production by itself. If you cannot say which CD you mean, you do not yet have a release policy.",
      },
      { type: "h3", text: "Continuous integration" },
      {
        type: "p",
        text: "Continuous integration means developers merge small changes into a shared mainline frequently, at least daily, and each merge is verified by an automated build and tests. The point is to find integration failures in hours, not during a monthly merge. A CI server that builds a long-lived branch every Friday is an automated build. It is not continuous integration, because the integration is not continuous. Feature branches that live for three weeks and only then meet main are the failure mode CI was invented to shrink. The practice is the frequent merge plus the automated verification. The vendor is incidental.",
      },
      { type: "h3", text: "Continuous delivery" },
      {
        type: "p",
        text: "Continuous delivery means the mainline is always in a releasable state. Every change that passes the pipeline can be deployed with a boring, scripted path. A human still decides whether and when production gets it: a button, an approval on a change ticket, a release owner. You do not rebuild the artifact at release time. You promote the artifact that already passed. Delivery is what lets you ship Tuesday at 11:00 because the path was already proven, not because people stay late to assemble a build.",
      },
      { type: "h3", text: "Continuous deployment" },
      {
        type: "p",
        text: "Continuous deployment means every change that passes the automated pipeline on the trunk is deployed to production without a human release gate. There is no approval click between green tests and production. This requires a strong automated suite, observability, and a fast rollback or a feature flag, because the rate of production change equals the rate of green commits. It is not a moral upgrade over delivery. Regulated or high-blast-radius systems often want delivery, with a named human decision, on purpose. The failure mode is calling a manual monthly copy continuous deployment because a script was used at the end.",
      },
      {
        type: "table",
        caption: "How to tell the three apart",
        headers: ["Practice", "What must be true", "What is not enough"],
        rows: [
          [
            "Continuous integration",
            "Small changes reach a shared mainline at least daily, and an automated build and tests run on those merges",
            "A server exists, or branches are built in isolation for weeks",
          ],
          [
            "Continuous delivery",
            "Main is always releasable. Deploy is scripted. A person decides when production updates. The artifact is not rebuilt for the occasion",
            "A deploy document in a wiki, or a human who SSHes and copies files",
          ],
          [
            "Continuous deployment",
            "A green commit on the trunk deploys to production with no human approval",
            "Any automatic deploy to a dev sandbox, or a pipeline with a required reviewer",
          ],
        ],
      },
      { type: "h3", text: "Trunk and release branches, briefly" },
      {
        type: "p",
        text: "Trunk-based development keeps the shared branch releasable and keeps other branches short, hours or a day or two, not months. You integrate into the trunk constantly. A release branch is cut when a version must stabilize, for example release/2.4, while the trunk moves on. Fixes are cherry-picked onto the release branch. That is justified when you support shipped versions. It hurts when the release branch becomes a second long-lived trunk that diverges for weeks. CI is much harder if there is no single mainline that everyone integrates into.",
      },
      {
        type: "code",
        lang: "yaml",
        title: "CI only: verify main, do not ship",
        code: `name: ci
on:
  push:
    branches: [main]
jobs:
  test:
    runs-on: ubuntu-24.04
    steps:
      - uses: actions/checkout@v4
      - run: npm test`,
      },
      {
        type: "code",
        lang: "yaml",
        title: "A deploy job. The gate is not the YAML keyword.",
        code: `deploy:
  needs: test
  runs-on: ubuntu-24.04
  environment: production
  steps:
    - run: echo "Promote the artifact that passed test. Do not rebuild it."`,
      },
      {
        type: "callout",
        tone: "warn",
        title: "environment does not tell you which CD you have",
        text: "In GitHub Actions, a job can name an environment. If that environment has a required reviewer, a human still decides, which is continuous delivery. If nothing is required and the job runs on every green main push, the same snippet is continuous deployment. Read the protection rule. Do not read the word deploy and guess. Also do not confuse either CD with CI. You can integrate daily and still release by hand once a month. That is CI without CD.",
      },
    ],
    exercise: {
      title: "Classify three pipelines",
      prompt:
        "Label each description as CI only, continuous delivery, or continuous deployment. Cite the fact that decides it.",
      steps: [
        "Pipeline A: every merge to main runs unit tests. A release manager copies artifacts to production on the last Friday of the month using a checklist.",
        "Pipeline B: every merge to main runs tests and can be deployed by pressing Approve on the production environment. The artifact is the one CI built.",
        "Pipeline C: every merge to main that passes tests is deployed to production automatically. There is no approval.",
        "Say which CD, if any, pipeline A has. Say whether a three-week feature branch merged once would satisfy CI.",
      ],
      criteria: [
        "A is CI only if merges are daily and tested. The monthly checklist is neither delivery nor deployment. If merges are rare, A is not even CI.",
        "B is continuous delivery because a human approves and the path is scripted.",
        "C is continuous deployment because production updates with no human gate.",
        "The answer states that a branch living for three weeks fails the frequent-integration part of CI.",
      ],
    },
    checks: [
      {
        q: "What is the difference between continuous delivery and continuous deployment?",
        a: "Both require a releasable mainline and an automated deploy path, and both sit on top of CI. Continuous delivery keeps a human decision before production. Continuous deployment does not: a commit that passes the pipeline deploys itself. The difference is the approval gate, not the presence of a deploy script and not the phrase CI/CD in a job name.",
      },
      {
        q: "A team builds each feature branch in Jenkins and merges to main every three weeks. Do they have continuous integration?",
        a: "No. CI requires frequent integration into a shared mainline, at least daily, with automated build and tests on that integration. Building isolated branches proves each branch compiles. It does not prove they integrate. The three-week merge is the integration event, and it is not continuous. The Jenkins installation is irrelevant to the definition.",
      },
    ],
    interview: [
      {
        q: "Explain CI, continuous delivery, and continuous deployment without mixing them up.",
        a: "CI means we merge small changes into main at least daily and let an automated build and tests verify each merge. A build server by itself is not CI. Continuous delivery means main is always releasable, the deploy is scripted, and a person still decides when production gets that artifact. Continuous deployment means we remove that decision: green on main goes to production alone. I ask one question when someone says CD: after the pipeline is green, does a human approve production, or does it move by itself? Trunk-based development keeps branches short so CI is possible. A long-lived release branch is for stabilizing a shipped version, and it becomes a problem when it turns into a second main.",
      },
    ],
    takeaways: [
      "CI is frequent merges to a shared mainline plus automated verification, not the existence of a build server.",
      "Continuous delivery keeps a human decision before a scripted production deploy. Continuous deployment does not.",
      "The two CDs are not interchangeable. A protection rule, not the word deploy, tells you which one you have.",
    ],
  },
  {
    slug: "devops-lifecycle",
    title: "The DevOps lifecycle",
    status: "full",
    blocks: [
      { type: "h2", text: "Eight stages and a feedback arrow" },
      {
        type: "p",
        text: "The lifecycle is a loop: plan, code, build, test, release, deploy, operate, monitor, then back to plan. The infinity diagram draws that loop as a figure-eight. The left side is where a change is conceived and verified. The right side is where it meets users and teaches you the next change. Skipping the arrow, monitor back to plan, is how teams ship the same bug twice and call the second time unexpected.",
      },
      { type: "diagram", id: "infinity" },
      {
        type: "table",
        caption: "What each stage is for",
        headers: ["Stage", "Question it answers", "Artifact you can point at"],
        rows: [
          ["Plan", "What problem, for whom, and what does done mean?", "Ticket with an acceptance check and an explicit non-goal"],
          ["Code", "What is the smallest change that satisfies the check?", "Commit on a short-lived branch"],
          ["Build", "Can we produce the same artifact later?", "Immutable build identified by a commit SHA"],
          ["Test", "Does this commit fail the checks we already know how to run?", "CI result on that SHA"],
          ["Release", "Is this artifact allowed to be deployed?", "A releasable build, with or without a human approval"],
          ["Deploy", "Is that exact artifact now in the target environment?", "Deploy record: SHA, environment, time, actor"],
          ["Operate", "Is the service within its SLO right now?", "On-call action, rollback, or a note that nothing was required"],
          ["Monitor", "What will tell us, without a user ticket, if we were wrong?", "Dashboard, alert, or log query tied to the change"],
        ],
      },
      { type: "h3", text: "One bug, from ticket to production" },
      {
        type: "p",
        text: "Ticket PAY-142: POST /invoices returns HTTP 500 when the customer name contains an apostrophe, for example O'Brien. Users retry, which creates duplicates or more errors. The acceptance check is: a name containing an apostrophe is stored and the response is 201, and a regression test fails if the name is concatenated into SQL. Non-goal: redesigning invoicing.",
      },
      {
        type: "ol",
        items: [
          "Plan. A junior reads the ticket, reproduces the 500 locally or in a shared dev environment, and writes the expected status code in the ticket. A product owner confirms that apostrophes are valid in names. Nobody starts a new invoicing platform.",
          "Code. The developer writes a failing test first, then stops building SQL by concatenation. The name becomes a bound parameter. The change sits on branch feature/invoice-quote, which should live for a day, not a month.",
          "Build. CI compiles and packages the service the same way production does. The artifact is named by the commit SHA. Rebuilding from a dirty laptop directory is not the build stage.",
          "Test. The new test runs in CI against a disposable database, not against production. A reviewer reads the diff. If QA is involved, they add an exploratory check because the area is money-related. They do not start from zero after someone declares dev is done.",
          "Release. The pipeline marks that SHA releasable. Under continuous delivery, a person decides when production may take it. Under continuous deployment, the decision was already encoded in the pipeline. Either way, nobody recompiles.",
          "Deploy. The same artifact goes to production with the team's normal strategy, rolling or otherwise. Configuration and secrets come from the environment, not from the developer's shell. The deploy record names the SHA.",
          "Operate. For the next 15 to 30 minutes the person who deployed, or the on-call they paired with, watches error rate and latency for POST /invoices. If the 500s return, rollback is the previous artifact, which is already known. Improvised SQL in production is not operating. It is a new incident.",
          "Monitor. The graph that showed the 500s is the feedback arrow. If errors remain, a new ticket opens with the graph linked. If the runbook said retry the POST, and retries made duplicates, the junior updates that sentence the same day.",
        ],
      },
      {
        type: "code",
        lang: "sql",
        title: "The bug and the fix, as SQL",
        code: `-- Broken: O'Brien closes the string early and the statement is invalid.
select id from invoices where name = 'O'Brien';

-- Fixed: the name is data. In Postgres, $1 is the first bound parameter.
select id from invoices where name = $1;`,
      },
      { type: "h3", text: "Who does what on PAY-142" },
      {
        type: "p",
        text: "The junior can own the reproduction, the test, the patch, and the pull request. A peer or a senior reviews. CI owns the repetitive build and test. The production deploy is a button the junior may press if the service is in their team's policy, or a button a senior presses while the junior watches and narrates the dashboard. Operate and monitor are shared. The author does not vanish at deploy time. Product owns the acceptance check, not the SQL. QA owns risk information, not a ceremonial sign-off after the fact. If the team has SRE, they own whether this route's error budget can afford a bad deploy, not the apostrophe fix itself.",
      },
      { type: "h3", text: "Where juniors actually spend time" },
      {
        type: "ul",
        items: [
          "In code and test: small bugfixes, pipeline failures, flaky tests, missing logs.",
          "In deploy and operate: paired releases, taking notes during incidents, updating the runbook sentence that was wrong.",
          "In plan: asking for the acceptance check before writing a large patch.",
          "Less often in architecture: choosing regions, redesigning the platform, or writing the SLO for the whole company. Those are real stages. They are not week-two work.",
        ],
      },
      { type: "h3", text: "Lead time, cycle time, and MTTR" },
      {
        type: "p",
        text: "Lead time for changes, in the DORA sense, is the elapsed time from a commit landing on the trunk to that commit running in production; some teams start the clock at merge instead of at the first commit, so say which one you use. A broader product lead time starts earlier, when the request is accepted, and therefore includes the queue before anyone codes. Cycle time is the portion after work actually starts, from the ticket moving to in progress or from the first commit, until production; it excludes the queue before start, which is why cycle time is shorter than product lead time and why the team must publish the start event. MTTR, mean time to restore, is the average time from the start of user impact, or from detection if the start is unknown, until the service meets its SLO again, whether restoration was a rollback, a flag, or a fix, and it is not the time to write the postmortem or to ship the perfect root-cause patch.",
      },
      {
        type: "p",
        text: "Worked clocks for PAY-142, using hours from request acceptance. Request accepted Monday 09:00, which we call hour 0. Work starts Tuesday 10:00, hour 25. First commit Tuesday 11:30, hour 26.5. Production deploy Wednesday 11:00, hour 50. Product lead time is 50 hours. DORA-style lead time from first commit to production is 23.5 hours. Cycle time from start of work to production is 25 hours. Separately, imagine a bad deploy detected at 14:02 and restored by rollback at 14:19. That incident's restore time is 17 minutes. Shipping the apostrophe fix the next day does not change those 17 minutes.",
      },
      {
        type: "code",
        lang: "bash",
        title: "Hours from a single timeline",
        code: `python3 -c '
request = 0
start = 25
commit = 26.5
prod = 50
print("product lead hours", prod - request)
print("dora lead hours", prod - commit)
print("cycle hours", prod - start)
print("restore minutes", 17)
'`,
      },
      {
        type: "code",
        lang: "text",
        title: "Computed clocks",
        code: `product lead hours 50
dora lead hours 23.5
cycle hours 25
restore minutes 17`,
        note: "Illustrative output — not captured from a live run in this environment.",
      },
      {
        type: "callout",
        tone: "tip",
        title: "Do not optimize the wrong clock",
        text: "Cutting coding time from 90 minutes to 70 minutes does not move a 50-hour product lead time. Cutting MTTR by writing a rollback button does not shrink lead time either. Publish which clock you mean before you celebrate a number. A team can have a 20-minute MTTR and a 30-day lead time. Both facts matter, and they are not substitutes.",
      },
      { type: "h3", text: "The feedback arrow" },
      {
        type: "p",
        text: "Monitor feeds plan when an alert or a graph becomes the next ticket with the SHA attached. Operate feeds code when the rollback was harder than the fix, which means the next change is the rollback path itself. Test feeds plan when the regression test describes a user-visible behavior, not only a function name. If the only feedback is a customer email three days later, the right-hand loop is a person, not a system, and the junior's useful contribution is often the missing log line or the missing alert, not another feature.",
      },
    ],
    exercise: {
      title: "Walk a bugfix around the loop",
      prompt:
        "Choose a small bug you can explain in two sentences. Walk it through all eight stages. Then compute product lead time, DORA-style lead time from first commit, cycle time from start of work, and one restore time. Use invented timestamps, labeled as such.",
      steps: [
        "Write the ticket's acceptance check and one non-goal.",
        "For each stage, name the person and the artifact (test name, SHA, deploy record, graph).",
        "Give four timestamps: request accepted, work started, first commit, production deploy.",
        "Compute the three flow clocks in hours. State the start event you used for cycle time.",
        "Give a separate incident: detection time and restore time. State the restore method (rollback, flag, or fix). Explain why the later root-cause deploy is not part of that MTTR sample.",
        "Mark the stage where a junior would most likely spend the afternoon, and one stage they would not own.",
      ],
      criteria: [
        "All eight stages appear, each with an artifact you could open or query.",
        "The three flow clocks use the lesson's definitions and the arithmetic matches the timestamps.",
        "MTTR is computed from impact or detection to restoration, not to the postmortem.",
        "The junior's stage and the out-of-scope stage are both explicit.",
      ],
    },
    checks: [
      {
        q: "Put these in order for a normal change, and say which stage the infinity diagram's feedback arrow corresponds to: deploy, test, monitor, plan.",
        a: "Plan, then later test, then deploy, then monitor. The feedback arrow is monitor returning to plan: the graph or alert becomes the next piece of work. Deploy does not close the loop by itself. A change can be deployed and still be wrong, which is what operate and monitor exist to discover.",
      },
      {
        q: "Using the PAY-142 clocks (request hour 0, start hour 25, commit hour 26.5, production hour 50), what are product lead time, DORA-style lead time, and cycle time?",
        a: "Product lead time is 50 hours, from request acceptance to production. DORA-style lead time from the first commit to production is 23.5 hours. Cycle time from the start of work to production is 25 hours. If a team defines DORA lead time from merge rather than first commit, they must say so; the number would differ. None of these is MTTR.",
      },
      {
        q: "An incident is detected at 14:02 and the previous artifact is restored at 14:19. The root-cause fix ships the next morning at 09:00. What is the restore time, and what is it not?",
        a: "The restore time is 17 minutes. MTTR samples that interval: from detection, since that is the known timestamp, to service restored. The next morning's fix is a later change with its own lead time. Counting it as MTTR mixes time to restore with time to fully correct the code, and it makes incident response look slower than the user experience was.",
      },
      {
        q: "On PAY-142, which actions fit a junior, and which should they not do alone?",
        a: "Fit: reproduce the 500, add the regression test, replace string concatenation with a bound parameter, open the pull request, watch the dashboard during a paired deploy, update the runbook if retry advice was wrong. Not alone: invent a new invoicing architecture, apply ad-hoc SQL in production during the incident, or decide to ignore a blown error budget. Review belongs to a second person. CI runs the repetitive checks.",
      },
    ],
    interview: [
      {
        q: "Walk me through the DevOps lifecycle with a real change.",
        a: "I use eight stages. Plan is the ticket and the acceptance check. Code is a small commit. Build produces an artifact named by the SHA. Test is CI on that SHA, plus review. Release means that artifact is allowed to ship. Deploy puts that same artifact in production. Operate is watching and rolling back if needed. Monitor is the alert or graph that becomes the next ticket. For a bug like a 500 when a name contains an apostrophe, I would reproduce it, bind the SQL parameter, and let CI run the regression test. I would not rebuild from a laptop at deploy time. The feedback arrow is the error graph deciding whether the ticket is actually done.",
      },
      {
        q: "Define lead time, cycle time, and MTTR.",
        a: "DORA lead time for changes is commit, or sometimes merge, to production. I always say which start I mean. Product lead time includes the queue before coding, from request accepted to production. Cycle time starts when work starts, so it excludes that initial queue. MTTR is mean time to restore: from user impact, or from detection if that is all we have, until the SLO is met again. Rollback counts. The postmortem and the perfect fix the next day do not. On a recent example I would quote hours for lead time and minutes for restore so nobody thinks they are the same clock.",
      },
      {
        q: "Where should a junior spend time in that loop?",
        a: "On small code and test work, red pipelines, paired deploys, incident notes, and the runbook line that was wrong. I should be able to point at a SHA and a CI run. I should not spend my first months redesigning the platform or being the only person who can roll back production. If I am in monitor, my useful output is a ticket with the graph attached, not a silent hero fix on the server.",
      },
    ],
    takeaways: [
      "The loop is plan, code, build, test, release, deploy, operate, monitor, and back to plan.",
      "Each stage has an artifact: ticket, commit, immutable SHA, CI result, deploy record, or graph.",
      "Promote the built artifact. Do not recompile it on a laptop during deploy.",
      "Product lead time includes the queue before work starts. Cycle time does not. DORA lead time starts at commit or at merge; say which.",
      "MTTR ends when service is restored, including by rollback. It does not end when the perfect fix ships.",
    ],
  },
  {
    slug: "junior-role",
    title: "The junior role",
    status: "primer",
    blocks: [
      { type: "h2", text: "What the week actually contains" },
      {
        type: "p",
        text: "A junior DevOps, SRE, or platform week is mostly small, finishable work that reduces drag for the team. It is not designing the global platform, and it is not being the unnamed owner of production. Expect tickets, pipeline logs, a short script, a document that was wrong when you used it, and a lot of reading before you run anything against a shared environment.",
      },
      { type: "h3", text: "Day to day" },
      {
        type: "ul",
        items: [
          "Tickets with an acceptance check. If the check is missing, the first task is to write one and confirm it, not to start a large change.",
          "Pipelines. A red build has a log. Read the first failure, not the last hundred lines of a cascade. Reproduce the command locally when it does not touch production.",
          "Small automation. A script the team already wants, checked into the repo, with a dry run. Not a new framework.",
          "Shadowing incidents. Take the timeline. Fetch graphs when asked. Do not improvise restart, delete, or kill commands on production while people are still forming a hypothesis.",
          "Docs. Fix the runbook step that failed when you followed it. That is a production contribution.",
          "Access requests. Name the system, the role, the environment, and the ticket. Do not ask for admin because it is faster.",
        ],
      },
      { type: "h3", text: "A pipeline afternoon" },
      {
        type: "p",
        text: "A typical junior task is a main build that failed on a test you did not write. You open the CI log, find the assertion, reproduce it with the same command CI runs, and decide whether the test is wrong or the code is. You do not rerun the job ten times hoping for green. A flake that passes on retry is a bug in the test or in the isolation of the job. Record the rerun count. If you change CI config, the change is a pull request. Editing the pipeline only through the web UI, with no review, creates a snowflake of a different kind.",
      },
      {
        type: "code",
        lang: "text",
        title: "Access request that can be granted",
        code: `System: CI for example-org/invoices (fake org, example only)
Environment: continuous integration, not production
Role requested: read logs and rerun jobs
Why: ticket PAY-148, failing main build, need the full test log
Not requested: admin on the production account
Duration: while I am on this team, review in 90 days`,
      },
      { type: "h3", text: "What not to expect in 90 days" },
      {
        type: "ul",
        items: [
          "You will not be expert in Linux, CI, containers, a cloud, and Kubernetes because a curriculum said 90 days.",
          "You will not responsibly be sole on-call for a system that pages at 03:00.",
          "You will not choose the cloud provider, the regions, or the company SLO.",
          "You will not own the culture, the transformation roadmap, or a ban on every tool the team did not pick.",
          "You will not safely apply large infrastructure changes alone because the plan looked clean.",
        ],
      },
      {
        type: "p",
        text: "What 90 days can contain: you can follow a runbook, ship a small reviewed change, explain a red pipeline, and know who to call. That is a successful first quarter. Teams that promise ownership of the platform in a quarter are describing senior scope with junior consequences.",
      },
      {
        type: "callout",
        tone: "danger",
        title: "Production is not your sandbox",
        text: "Do not run destructive commands to see what happens: deleting volumes, killing databases, force-pushing main, or opening security groups to the world. If you do not know whether a command is destructive, it is forbidden until someone who owns the system says otherwise. Shadowing means your hands stay off the keyboard unless the incident lead assigns a specific command.",
      },
    ],
    exercise: {
      title: "Write a 90-day will and will-not",
      prompt:
        "Write the list you would actually use with a manager in week one. Six items you will do. Five you will not. One access request in the form shown in the lesson.",
      steps: [
        "Make each will item observable: a kind of pull request, a kind of document, or a kind of paired activity.",
        "Make each will-not item a specific production or culture overreach, not a vague I will try my best.",
        "Write the access request with system, environment, role, ticket, and what you are not asking for.",
        "Add the name of the person who is allowed to press a production deploy while you watch, or say that this team has not named them yet.",
      ],
      criteria: [
        "The will list includes pipelines, small reviewed changes, docs, and incident shadowing.",
        "The will-not list includes sole on-call, owning company culture, and unreviewed production mutation.",
        "The access request is narrower than admin on production.",
        "A human deploy partner is named or explicitly missing.",
      ],
    },
    checks: [
      {
        q: "You are shadowing an incident. The error rate is up after a deploy. What do you do, and what do you not do?",
        a: "You write the timeline: SHA, time, symptom, what the incident lead decides. You pull a graph if asked. You do not SSH in and restart or delete things on a hunch, and you do not announce a root cause you cannot show. Rollback, if it happens, is the lead's command or a documented button, not a creative idea from the newest person in the channel.",
      },
      {
        q: "What is a reasonable expectation for a junior's first 90 days?",
        a: "Follow a runbook, land small reviewed changes, explain why a pipeline is red, write down a doc fix, and request the minimum access a ticket needs. It is not reasonable to be sole on-call for a critical system, to pick the cloud design, or to be treated as the owner of DevOps culture. Those are senior or leadership scopes.",
      },
    ],
    interview: [
      {
        q: "What do you expect to do in your first 90 days as a junior?",
        a: "I expect tickets with a clear check, red pipelines, a small script or config change in review, runbook fixes, and incident shadowing where I take notes and do not freelance commands. I expect to request access per system and per role, not admin. I do not expect to be sole on-call, to choose the platform, or to own the company's culture. If the team cannot name who deploys production with me, I would ask for that name before I touched a live system.",
      },
    ],
    takeaways: [
      "Junior days are tickets, pipeline logs, small automation, docs, and incident notes. Do not improvise production commands while shadowing.",
      "Ask for the role and the environment a ticket needs. Do not ask for production admin to save time.",
      "Ninety days can make you useful on a team. It cannot make you the owner of the platform or the culture.",
    ],
  },
  {
    slug: "learning-milestones",
    title: "Learning milestones",
    status: "primer",
    blocks: [
      { type: "h2", text: "A sequence, not a 90-day expert badge" },
      {
        type: "p",
        text: "The honest order is comfort with Linux and Git, then one CI pipeline you can explain, then one containerized app you can run, then the ability to read a Terraform plan without applying it, then one deploy of that app to a local cluster. This is not expert in 90 days. People who already use a shell daily move faster. People whose first week is Kubernetes YAML, copied from a tutorial, learn to cargo-cult objects they cannot debug. The milestones are gates of evidence, not course certificates.",
      },
      { type: "h3", text: "The five gates" },
      {
        type: "ol",
        items: [
          "Linux and Git. You can navigate a filesystem, read permissions, pipe a command, and undo a local Git mistake without rewriting shared history. You know what rm -rf and git reset --hard destroy.",
          "One CI pipeline. A repository you can push to runs tests and turns red when a test fails. You can point at the failing line in the log.",
          "One containerized app. You can explain each instruction in the Dockerfile, run the image locally, and say what process is PID 1 inside it.",
          "Read a Terraform plan. You can explain what will be created, changed, and destroyed. Reading comes before writing modules. Applying comes after someone reviews the plan.",
          "Deploy to a local cluster. The same app runs on a local Kubernetes (kind or minikube) or, if you are not there yet, a local compose stack, and you can hit a health endpoint you defined.",
        ],
      },
      {
        type: "table",
        caption: "Evidence, not attendance",
        headers: ["Gate", "Evidence that counts", "Evidence that does not"],
        rows: [
          [
            "Linux and Git",
            "A small repo with a branch, a merge, and a recovered mistake, plus a shell transcript of the commands you understand",
            "A certificate that says Linux fundamentals",
          ],
          [
            "CI",
            "A red build you caused with a failing test, then a green build after the fix, both URLs saved",
            "A screenshot of a vendor's hello-world pipeline you cannot edit",
          ],
          [
            "Container",
            "docker image history or the Dockerfile, and a curl to the published port on localhost",
            "A pulled image you have never read",
          ],
          [
            "Terraform plan",
            "A saved plan where you annotated each create, change, and destroy in plain language",
            "An apply you ran because the tutorial said yes",
          ],
          [
            "Local cluster",
            "A health URL that returns 200 from the local cluster, and the command you used to see the pod or container logs",
            "A cluster icon in a cloud console for an account you do not understand",
          ],
        ],
      },
      { type: "h3", text: "Why the order is the lesson" },
      {
        type: "p",
        text: "CI assumes you can commit and read a log. Containers assume you know a process, a port, and a filesystem. Terraform plans assume you can tell a destructive change from a harmless one, which is a reading skill before it is a writing skill. A local cluster assumes the app already ran as a container, so when a pod crashes you debug the app and the probe, not the entire idea of scheduling. Reversing the order produces people who can paste a Deployment manifest and cannot explain why the container exits.",
      },
      {
        type: "p",
        text: "Time is uneven. A gate can take a week or a month of deliberate practice. Five gates are often more than a quarter if you are also doing a job. Finishing gate 1 and gate 2 for real is a better first quarter than touching all five in tutorials. There is no bonus for claiming Kubernetes in week three.",
      },
      {
        type: "callout",
        tone: "warn",
        title: "Do not apply plans you cannot read",
        text: "A Terraform apply can destroy data. Until you can explain every destroy line, you do not run apply against a shared account. A local cluster is the place to break scheduling. A company production cluster is not. The milestone says read a plan, not become the person who applies production at 17:00 on a Friday.",
      },
      {
        type: "code",
        lang: "text",
        title: "A gate log worth keeping",
        code: `Gate 2 evidence, fake repo example-org/invoices
Red:  2026-10-31 CI run 184 on commit a1b2c3d, test rejects unescaped apostrophe
Green: 2026-10-31 CI run 185 on commit d4e5f6a, same test passes
I can point to the assertion in src/invoice.test.ts`,
      },
    ],
    exercise: {
      title: "Write your evidence bar",
      prompt:
        "For each of the five gates, write the artifact you will be able to show. Then write the order you will do them in, and one gate you will not start this month.",
      steps: [
        "Copy the five gates in the required order.",
        "Under each, name a concrete artifact: a path, a command, or a URL you will have.",
        "Pick the first gate that is not yet true for you. Write the next three practice sessions as tasks, not as tools to install.",
        "Name one later gate you will not start until the previous evidence exists.",
      ],
      criteria: [
        "The order is Linux and Git, then CI, then a container, then reading a Terraform plan, then a local deploy.",
        "Each gate has an artifact, not a course name.",
        "A later gate is explicitly blocked on missing evidence.",
        "The writeup does not claim expert, job-ready in everything, or 90-day mastery.",
      ],
    },
    checks: [
      {
        q: "Why is reading a Terraform plan its own milestone, before writing modules or applying them?",
        a: "A plan states creates, changes, and destroys. Apply performs them, including destroying data stores if that is what the plan says. Reading is the skill that makes apply safe enough to learn. Writing new modules before you can explain a destroy line is how shared accounts get damaged. The milestone is deliberately read, not ship infrastructure to production.",
      },
      {
        q: "Why not start with Kubernetes if that is what job posts mention?",
        a: "Kubernetes schedules containers onto Linux machines and joins them with networking, probes, and logs. If you cannot explain a process, a port, a filesystem permission, or a Git commit, a crashing pod has too many layers to debug. You will copy manifests. Job posts list the tool. The milestone order lists the dependencies. A local cluster is gate five, after one containerized app already runs.",
      },
    ],
    interview: [
      {
        q: "How are you learning DevOps, and what do you refuse to pretend?",
        a: "I am following five gates: Linux and Git until I can work in a shell and undo a local mistake, then one CI pipeline I can turn red and green, then one container I can explain, then reading a Terraform plan including the destroy lines, then deploying that same app to a local cluster. I am not calling myself expert at 90 days. I will not apply a plan I cannot explain, and I will not start with a production cluster to look further along. Evidence is a commit, a CI URL, a Dockerfile, an annotated plan, and a health check, not a list of tool logos.",
      },
    ],
    takeaways: [
      "The order is Linux and Git, one CI pipeline, one containerized app, read a Terraform plan, then a local cluster deploy.",
      "Each gate is proven by an artifact you can open, not by a tutorial you finished.",
      "Reading a plan comes before apply. Apply can destroy resources.",
      "This sequence is not a promise of expertise in 90 days. Skipping ahead produces copied YAML and no diagnosis.",
    ],
  },
];
