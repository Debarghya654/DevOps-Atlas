import type { Lesson } from "../types";

export const lessons: Lesson[] = [
  {
    slug: "interview-prep-freshers",
    title: "Interview prep for freshers and juniors",
    status: "full",
    blocks: [
      { type: "h2", text: "What hiring managers actually test" },
      {
        type: "p",
        text: "A fresher or junior DevOps interview is not a hunt for someone who has carried a pager for a bank. Interviewers want to see that you can operate the basics without theater, and that you will say when you have not done the production version. The bar below is what people keep asking for. It is not a promise that meeting it produces an offer.",
      },
      {
        type: "ul",
        items: [
          "Linux comfort: files, permissions, processes, and how to read a log without deleting it.",
          "Git: branch, commit, diff, and the ability to explain a pull request you opened.",
          "One CI system you have actually configured, not five logos.",
          "Docker: build, run, logs, and why an image layer is not a virtual machine.",
          "Reading a cloud diagram: a load balancer, a private subnet, a compute tier, a database.",
          "Curiosity: you tried the thing that failed, and you can say what you checked second.",
          "Honesty about production. 'I have not run this with real customers' is a valid sentence.",
        ],
      },
      { type: "h2", text: "A checklist with three honest levels" },
      {
        type: "table",
        caption: "Job-ready here means you can defend a fresher interview. It does not mean a company owes you a role.",
        headers: ["Level", "You can defend this"],
        rows: [
          [
            "Beginner",
            "Use the shell, commit and branch in Git, explain HTTP status codes you have seen, and read a Dockerfile line by line.",
          ],
          [
            "Intermediate",
            "Point at one CI config you wrote, build and run an image, read logs when a container exits, and describe a diagram with a load balancer and a private subnet.",
          ],
          [
            "Job-ready (fresher)",
            "Demo one project end to end, explain a trade-off, debug a crash loop from evidence, describe a rollback, and name the skills you have not used in production.",
          ],
        ],
      },
      { type: "h2", text: "How to explain a project" },
      {
        type: "p",
        text: "Pick one project and practice it out loud until it fits in a few minutes. Memorizing a tool list is less useful than this order, because the follow-up questions walk the same path.",
      },
      {
        type: "ol",
        items: [
          "Problem: who was stuck, even if the user was you in a lab.",
          "Architecture: the request path, the build, the runtime, and where data sits.",
          "Your decisions: what you chose, not what the tutorial chose while you watched.",
          "A trade-off: what you gave up. Cost, complexity, or a production gap all count.",
          "An incident or a bug: the symptom, the evidence, the fix. If it was a lab, say lab.",
          "What you would do differently: secrets, health checks, a digest pin, a backup. Future tense is allowed. Fiction is not.",
        ],
      },
      { type: "h2", text: "The resume rule" },
      {
        type: "callout",
        tone: "warn",
        title: "Only list what you can defend for two minutes",
        text: "Kubernetes after a single hello-world pod is a trap if you cannot explain a Service, a probe, or a crash loop. Drop the word. The interviewer will believe the smaller list. They will not believe the padded one after the first follow-up.",
      },
      {
        type: "p",
        text: "A strong bullet names a system you built and the behavior you can demo. A weak bullet is a comma-separated catalog. If the experience is a lab, the bullet can still be good. It just cannot borrow production words like on-call, SLO, or customer traffic you did not have.",
      },
      {
        type: "code",
        lang: "text",
        title: "The same experience, two resumes",
        code: `Weak: Kubernetes, Docker, AWS, Terraform, Jenkins, Prometheus, Kafka.

Strong: Lab project. A pipeline compiles a Spring Boot service, publishes an image tagged with the git SHA, and deploys that digest to a local Kubernetes cluster. I can walk through the Dockerfile and the rollback command. I have not run this for real customers.`,
      },
      { type: "h2", text: "Weak answers and strong answers" },
      {
        type: "p",
        text: "Do not memorize buzzwords. A definition you cannot connect to a command or a lab will fall apart. The strong column is the shape of the answer, not a script.",
      },
      {
        type: "table",
        caption: "Interviewers hear the weak column every week. The strong column admits scope.",
        headers: ["Prompt", "Weak", "Strong"],
        rows: [
          [
            "What is a container?",
            "A lightweight virtual machine that contains a whole operating system.",
            "A process started from an image, isolated with namespaces and cgroups, sharing the host kernel. Not a VM.",
          ],
          [
            "CI versus CD?",
            "They are the same thing. It means automation.",
            "CI builds and tests every change. Delivery keeps a releasable artifact and a person approves production. Deployment ships with no manual gate.",
          ],
          [
            "What happens when you push to main?",
            "Jenkins deploys to production automatically, I think. We use DevOps.",
            "In my lab, CI runs tests, tags an image with the commit, deploys that digest to staging, and production waits for approval.",
          ],
          [
            "Debug a CrashLoopBackOff?",
            "Delete the pod until it stays up, or raise the memory.",
            "Read describe and the previous logs. Change one cause. Roll back if the last version was healthy.",
          ],
        ],
      },
      { type: "h3", text: "A full answer: push to main" },
      {
        type: "p",
        text: "In the project I can defend, main is protected. I open a pull request, continuous integration runs the Maven tests, and a Docker image is tagged with the git commit SHA. I do not deploy production from my laptop. After the image exists, a deploy job updates the staging service to that digest and calls a health endpoint. Production is a separate manual approval in my lab, which is continuous delivery rather than continuous deployment. If the pipeline is green and staging is sick, I do not assume production is fine. I check which digest actually rolled out. What I have not done is operate this with real customers, an on-call rotation, or a change board. If a team uses trunk-based development or a different tool, I would follow their system instead of insisting on the layout from my lab.",
      },
      { type: "h2", text: "Commands you should be able to explain" },
      {
        type: "code",
        lang: "bash",
        title: "Crash loop, read before you delete",
        code: `kubectl get pod payments-api-7d4f -n lab -o wide
kubectl describe pod payments-api-7d4f -n lab
kubectl logs payments-api-7d4f -n lab --previous`,
      },
      {
        type: "p",
        text: "describe shows events, the exit reason, and the probe or image pull failure. logs with the previous flag shows the container that already died, which is the one that usually has the stack trace. get confirms you are looking at the pod you think you are looking at. None of these fix the process. They stop you from restarting in a circle. Say 'in my lab' if that is where you ran them.",
      },
      {
        type: "p",
        text: "Practice by speaking the answer once, then letting a friend interrupt with 'why'. If the second sentence is a slogan, replace it with a command, a file, or a limit. You are not trying to sound like a principal engineer. You are trying to sound like a junior who has actually done the lab and will not invent the rest.",
      },
    ],
    exercise: {
      title: "Defend one project out loud",
      prompt:
        "Rewrite one resume bullet and outline a ninety-second answer to what happens when you push to main in your project. Use only work you have done. Label labs as labs.",
      steps: [
        "Cross out every tool you cannot explain for two minutes, including tools that only appeared in a tutorial you watched.",
        "Rewrite one bullet with the problem, what the pipeline produces, and the fact that it is a lab if it is a lab.",
        "Write the push-to-main answer: trigger, tests, artifact identity, where it deploys, and whether a person approves production.",
        "Add one trade-off or one limit you will say before the interviewer asks.",
        "Read it aloud and cut any sentence you cannot connect to a file in your repository.",
      ],
      criteria: [
        "No skill remains that you cannot define and demonstrate.",
        "The push-to-main answer names a digest or a commit and says whether production is automatic.",
        "Lab work is labeled as a lab in the first few sentences.",
        "The answer includes one trade-off or an explicit gap.",
        "It does not claim a job offer, a senior title, or production ownership you did not have.",
      ],
    },
    checks: [
      {
        q: "Why is a long tool list a risky resume for a fresher?",
        a: "Every name is a question the interviewer is allowed to ask next. If Kubernetes is listed and you cannot explain why a pod is Pending or how a Service selects pods, the rest of the resume becomes doubtful too. A shorter list you can demo builds trust. You can mention a tool you have only read about when they ask what you want to learn. You cannot list it as if you operate it.",
      },
      {
        q: "How should lab experience sound different from production experience?",
        a: "Say lab in the first sentence, then describe what you actually did. You may claim the commands, the design, and the bug you hit. You may not claim customer impact, an on-call rotation, an SLO you never measured, or a team process you only read about. Interviewers are not punishing the lab. They are punishing a story that changes when they ask who was paged.",
      },
      {
        q: "What is the first evidence you collect for CrashLoopBackOff, and why not delete the pod?",
        a: "The pod events and the previous container logs: exit code, probe failures, missing configuration, or an out-of-memory kill. Deleting the pod throws away the current object and starts the same crash again if the spec has not changed. You might need to delete later. You do not start there. If the previous revision was healthy, rollback is the mitigation and the logs are still the investigation.",
      },
      {
        q: "Why is naming a gap a stronger ending than a buzzword?",
        a: "A gap you name cannot be used as a surprise follow-up. 'I have not tuned this under real traffic' tells the interviewer where the lab ends. A closing line of product names tells them you are hoping they will not pick one. Juniors are hired partly for whether they will ask for help before they guess in production. Honesty is evidence of that, not a confession.",
      },
    ],
    interview: [
      {
        q: "What is a container?",
        a: "A container is not a small virtual machine. It is a process, started from an image, with its own view of the filesystem, network, and resource limits, while still sharing the host kernel. The image is the package: layers that hold the runtime, the application, and its libraries. Namespaces and cgroups are what make that isolation. In my lab I wrote a Dockerfile that copies a Spring Boot jar and starts it on port 8080, then I ran that image locally and in a local Kubernetes cluster. If it failed, the usual cause was a missing file in the image or a config value baked in at build time that should have been an environment variable. I have not operated a company production cluster, so I would not claim I have tuned production CPU limits under real traffic.",
      },
      {
        q: "What is the difference between CI and CD?",
        a: "Continuous integration means every change is merged into a shared branch only after an automatic build and tests. In my project, a pull request runs Maven tests and fails the check if they fail. Continuous delivery means the output of that pipeline is an artifact you could release at any time, but a person still approves production. Continuous deployment means a green pipeline deploys to production with no manual gate. I have built the first and practiced the second in a lab. I have not run unattended production deploys. The part I care about is identity: the image digest that passed tests is the digest that gets promoted. Rebuilding later from the same git tag can pull a different base layer. Skipping tests to get a green badge is not continuous integration.",
      },
      {
        q: "How would you debug a CrashLoopBackOff?",
        a: "CrashLoopBackOff means the kubelet started the container, the process exited, and Kubernetes is waiting longer between retries. The status is a symptom. I start with kubectl describe on the pod and read the last exit code, the restart count, and events. An out-of-memory kill is different from a probe failure or an image pull error. Then I read kubectl logs and, if the current container is already dead, the previous logs. In labs I have hit a missing environment variable, the app listening on a different port than the readiness probe, and a bad entrypoint. I change one variable, redeploy, and watch. If the last revision was healthy, rolling back is the mitigation and the logs are the investigation. This is lab experience, not an on-call shift I have worked.",
      },
    ],
    takeaways: [
      "Freshers are expected to show Linux, Git, one CI system, Docker, diagram reading, curiosity, and honesty about production.",
      "Move from beginner to intermediate to interview-ready by what you can demo, not by how many logos fit on a line.",
      "Explain a project as problem, architecture, decisions, a trade-off, a bug, and what you would change.",
      "Only list skills you can defend. Label labs as labs.",
      "Strong answers define the term, tie it to your project, and stop before they invent production experience.",
    ],
  },
  {
    slug: "roadmap-30-60-90",
    title: "A 30-60-90 day study plan",
    status: "primer",
    blocks: [
      { type: "h2", text: "A pace, and the promise this plan does not make" },
      {
        type: "callout",
        tone: "info",
        title: "Read this before the calendar",
        text: "The plan assumes about eight hours a week. It does not make you a senior, an expert, or employable on day 90. Nobody is guaranteed a job because a study plan ended. Full-time study moves the calendar faster. It does not remove the need to practice.",
      },
      {
        type: "p",
        text: "Eight hours a week is about thirty-two hours in a month. That is enough to get competent at one layer if you spend the time breaking a lab and fixing it. It is not enough to collect every cloud certification outline. If you can study full time, you may finish the topics in fewer weeks. You still need the same reps: type the commands, read the errors, and explain the result to someone who will interrupt you. Watching videos at higher speed is not the rep.",
      },
      { type: "h2", text: "Days 1 to 30: Linux, Git, and the network path" },
      {
        type: "ul",
        items: [
          "Shell every session: files, permissions, processes, and finding a line in a log.",
          "Git until a branch, a commit, a diff, and a merge are boring. Read someone else's pull request, not only your own.",
          "Networking basics: what a port is, what DNS returns, what an HTTP status you caused actually means, and what TLS is for. You are not learning to break TLS. You are learning why an expired certificate stops clients.",
          "Exit criterion: you can draw a request from a browser to a process and say where a name lookup happens, without notes.",
        ],
      },
      { type: "h2", text: "Days 31 to 60: automation, Maven, CI, and Docker" },
      {
        type: "ul",
        items: [
          "A small amount of bash or Python that parses a log or checks a health URL. One language is enough.",
          "Maven on a Spring Boot service: compile, test, package. You should know where the jar came from.",
          "One CI system that runs those tests on a pull request and fails when they fail.",
          "Docker: a Dockerfile you wrote, an image you can run, logs, and a port mapping you can explain. Pin a base image instead of hoping latest stays still.",
          "Exit criterion: a push to a branch produces a test result and an image you can name by commit.",
        ],
      },
      { type: "h2", text: "Days 61 to 90: one cloud, Terraform at read and plan, local Kubernetes" },
      {
        type: "ul",
        items: [
          "One cloud path, not five. Learn to read a diagram of a network, a load balancer, compute, and a database. Use the free tier carefully and destroy labs you are done with so the bill is not the lesson.",
          "Terraform: read a small module and run plan. Explain the diff in sentences. Do not apply sample code you do not understand against an account that can spend money, and do not skip the destroy plan for what you did apply.",
          "Local Kubernetes: a Deployment, a Service, configuration, a crash loop you caused, and a rollout undo.",
          "One project you can explain: problem, architecture, a trade-off, and how you would productionize it. The repository is the evidence.",
        ],
      },
      {
        type: "p",
        text: "At the end of this quarter you should be a beginner who can demo one path and describe the edges of it. That is a credible fresher position to interview from. It is not seniority, and it is not an offer. Hiring depends on the market, on how you talk about the work, and on skills this plan did not pretend to finish. If a week collapses, repeat the week. Sliding the calendar is healthier than skipping the lab to protect the date.",
      },
      { type: "diagram", id: "cicd" },
      {
        type: "p",
        text: "When you are tempted to add a new tool in week eleven, ask whether you can still explain week five without a search tab. Fundamentals first. The optional platform and FinOps topics in the previous module can wait until this plan is something you have done, not something you have scheduled.",
      },
    ],
    exercise: null,
    checks: [
      {
        q: "You have forty hours a week instead of eight. What changes, and what does not?",
        a: "The calendar can shrink because you have more hours for the same labs. What does not change is the work: you still have to cause a failed deploy and read it, and you still have to explain the project without notes. Full-time study is not a skip button, and finishing early still does not make you a senior or guarantee employment. Use the extra hours for a second pass through the project, not for ten extra tool logos.",
      },
      {
        q: "Why does the plan say one cloud and Terraform plan, not five providers and an immediate apply?",
        a: "Depth in one diagram beats a shallow account on every provider. plan shows you the diff before you create resources that cost money. Apply belongs after you can explain that diff and how you will destroy the lab. A fresher who can read one network diagram and one plan is easier to trust than one who recognizes five consoles and cannot say what a subnet is for.",
      },
    ],
    interview: [
      {
        q: "What will ninety days at about eight hours a week give you, and what will you not claim?",
        a: "At that pace the first month is Linux, Git, and networking until I can explain a request path without notes. The second month adds a little shell or Python, Maven, one CI system, and Docker, by building rather than only watching. The third month is one cloud, Terraform read and plan in a lab, local Kubernetes, and one project I can draw. If I studied full time I would move faster, and I would still need those reps. I would not call myself a senior, and I would not treat the calendar as a job offer. I would rather show a repository with a clear README than list ten tools I cannot operate.",
      },
    ],
    takeaways: [
      "About eight hours a week: month one Linux, Git, and networking; month two shell or Python, Maven, CI, and Docker; month three one cloud, Terraform plan, local Kubernetes, one project.",
      "Full-time study shortens the calendar. It does not replace practice and it does not create seniority.",
      "This plan does not guarantee a job. It makes a fresher able to demo one honest path.",
    ],
  },
  {
    slug: "explain-your-work",
    title: "Explain your work without inventing it",
    status: "primer",
    blocks: [
      { type: "h2", text: "Say the setting in the first sentence" },
      {
        type: "p",
        text: "Interviewers can forgive a lab. They cannot forgive a lab dressed up as a production outage. If the cluster was kind on your laptop, say that. If the only user was you, say that. You still get credit for the debugging. You lose credit the moment a follow-up asks for the customer count and you invent one.",
      },
      { type: "h2", text: "STAR, without fiction" },
      {
        type: "ol",
        items: [
          "Situation: where it happened and what broke. Include the word lab when it was a lab.",
          "Task: what you were responsible for. 'I owned the fix in my project' is enough. 'I was the on-call lead' is not, if you were not.",
          "Action: the evidence you read and the one change you made. Commands are more convincing than adjectives.",
          "Result: what got better, and what you would change next time. A result can be 'the pod stayed up and I wrote the symptom into the README.'",
        ],
      },
      {
        type: "p",
        text: "Do not borrow a famous outage from a blog and tell it in the first person. The interviewer may know the blog. A smaller true story beats a dramatic false one, because you can answer 'what did you try next' only for the true one.",
      },
      { type: "h2", text: "Trade-off language" },
      {
        type: "p",
        text: "A decision without a cost sounds like you never noticed the other option. Practice one sentence shape: I chose X over Y because Z, and the limit is W. That sentence works for a lab and for a job. It also stops you from claiming the choice was perfect.",
      },
      {
        type: "code",
        lang: "text",
        title: "Say the cost out loud",
        code: `I chose a local Kubernetes cluster over a cloud account because I wanted to practice rollouts without a bill.
The limit is that I did not see real network latency, identity policies, or a multi-node failure.
I would productionize it by pinning the image digest, reading secrets from a manager, and adding a readiness probe I have already broken on purpose once.`,
      },
      { type: "h2", text: "What a portfolio needs" },
      {
        type: "ul",
        items: [
          "A README that says what the project is in one paragraph, before the badges.",
          "An architecture paragraph: client, CI, image, runtime, and data. A box diagram you drew is enough.",
          "How to run it, including the command that failed for you the first time and the fix.",
          "How you would productionize it: no secrets in the image, health checks, a recorded digest, rollback, and backups if there is data worth keeping.",
          "No real credentials, tokens, customer data, or private endpoints. A portfolio leak is an incident.",
        ],
      },
      { type: "diagram", id: "cicd" },
      { type: "h2", text: "Score a mock interview on four lines" },
      {
        type: "table",
        caption: "Ask a friend to mark only these. A fifth category called confidence usually rewards volume over truth.",
        headers: ["Criterion", "A strong fresher"],
        rows: [
          ["Clarity", "Defines the term, then gives one example from their project. Short sentences."],
          ["Correctness", "Does not call a container a virtual machine, or CI and CD the same switch."],
          ["Troubleshooting method", "Symptom, evidence, one change, verify. Does not stack five fixes."],
          ["Honesty", "Labs are labs. Gaps are named. No borrowed on-call story."],
        ],
      },
      {
        type: "callout",
        tone: "warn",
        title: "Do not fabricate production",
        text: "If you did not carry a pager, do not describe the page. If you did not roll back a company's deploy, do not describe the customers. The STAR story from a lab is legitimate when the first word is lab.",
      },
      {
        type: "p",
        text: "Record yourself once. If you hear a tool name you cannot define, cut it. If you hear an apology that lasts longer than the explanation, cut the apology and keep the gap in one clause. The goal is a junior a team can trust with a lab, a review, and a question asked early. That is the whole target. It is not a performance of expertise you have not earned, and it is not a script that ends in a guaranteed offer.",
      },
    ],
    exercise: null,
    checks: [
      {
        q: "Where does the word lab belong in a STAR story about a crash loop you caused yourself?",
        a: "In the situation, immediately. Then task, action, and result can be specific and technical. Hiding the lab until the end, or hoping they will not ask, turns a solid story into a credibility problem. You do not need to apologize for the lab. You need to avoid production nouns you did not live: customers, pages, revenue.",
      },
      {
        q: "What is missing from 'I chose Kubernetes because it is industry standard'?",
        a: "The other option and the cost. A trade-off names both. 'I chose a local cluster over a cloud account so I would not leave a bill, and I did not see real identity rules' is a trade-off. 'Industry standard' is a reason that cannot be questioned because it does not describe your constraints. Interviewers ask what you gave up. Have the sentence ready.",
      },
    ],
    interview: [
      {
        q: "How do you describe a lab incident without pretending it was production?",
        a: "I say it was a lab in the first sentence. Then I use situation, task, action, and result. For example, my local cluster showed CrashLoopBackOff after I changed a probe. I was responsible for the fix. I read the pod events and the previous logs, changed the port, and wrote the symptom into the README. I also state a trade-off: I chose a local cluster over a cloud account to avoid a bill, and I did not see real latency or cloud identity rules. I do not borrow an outage from a blog. A README with an architecture paragraph, how to run it, and how I would productionize it gives the interviewer something to check besides my confidence.",
      },
    ],
    takeaways: [
      "Open with lab or production, whichever is true. STAR still works when the situation is small.",
      "Use the sentence 'I chose X over Y because Z, and the limit is W.'",
      "A portfolio README covers architecture, how to run, and how you would productionize, with no real secrets.",
    ],
  },
];
