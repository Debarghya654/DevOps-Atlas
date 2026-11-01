import type { Lesson } from "../types";

export const lessons: Lesson[] = [
  {
    slug: "git-fundamentals-branching",
    title: "Git fundamentals and branching",
    status: "full",
    blocks: [
      { type: "h2", text: "Four places a change can be" },
      {
        type: "p",
        text: "Git is a distributed version control system. The copy on your disk is a full repository, not a view onto a server. A change moves through four places. The working tree is the files you edit. The index, also called the staging area, is the snapshot you are assembling for the next commit. The local repository is the object database and the refs under .git. A remote is another repository, often named origin, on a server you push to. A commit records the index in the local repository. It does not upload anything. A push copies commits to the remote. Confusing those two steps is how people think they published work that only exists on their laptop.",
      },
      { type: "diagram", id: "git" },
      {
        type: "p",
        text: "The Git diagram is that path: working tree, index, local repository, remote. Commands are moves between those boxes. If you cannot say which box a command reads and which box it writes, do not run it on a shared branch.",
      },
      { type: "h3", text: "The everyday commands" },
      {
        type: "ul",
        items: [
          "git init creates a repository in the current directory. You rarely need it if you cloned.",
          "git clone copies a remote repository, including history, and names that remote origin.",
          "git status compares the working tree, the index, and HEAD, which is the commit your branch currently points at.",
          "git add copies changes into the index. Adding a file does not commit it.",
          "git commit writes the index as a new commit on the current branch and moves the branch pointer. It still does not push.",
          "git log shows history. git log --oneline -n 10 is the readable form.",
          "git diff shows unstaged changes, working tree versus index. git diff --staged shows what the next commit would record, index versus HEAD.",
          "git show prints one commit: the message and the diff. git show HEAD is the latest.",
          "git restore file discards unstaged edits in that file. Those bytes are gone. git restore --staged file removes the file from the index and leaves the working tree alone.",
        ],
      },
      {
        type: "p",
        text: "git switch and git restore exist since Git 2.23. Ubuntu 24.04 ships a newer Git than that. On older clients the equivalents are git checkout -b and git checkout -- file. Prefer the new verbs when you have them, because checkout used to mean both switch branch and discard changes, which is a bad pair of meanings for one command. Discarding with git restore file has no trash folder. If you might want the edit, commit it or stash it first.",
      },
      {
        type: "code",
        lang: "bash",
        title: "A commit stays local until you push",
        code: `git status
git add src/invoice.ts
git commit -m "Reject invoice names that break the SQL text"
git switch -c feature/invoice-quote`,
      },
      {
        type: "code",
        lang: "text",
        title: "git status after a partial add",
        code: `On branch feature/invoice-quote
Your branch is up to date with 'origin/feature/invoice-quote'.

Changes to be committed:
  (use "git restore --staged <file>..." to unstage)
        modified:   src/invoice.ts

Changes not staged for commit:
  (use "git add <file>..." to update what will be committed)
  (use "git restore <file>..." to discard changes in working directory)
        modified:   README.md

Untracked files:
  (use "git add <file>..." to include in what will be committed)
        notes.tmp`,
        note: "Illustrative output — not captured from a live run in this environment.",
      },
      {
        type: "p",
        text: "That status is a later moment, not the printout of the four commands above. One file is staged, one is modified but not staged, and notes.tmp is untracked. None of those three is a commit, so a push would not publish them.",
      },
      {
        type: "table",
        caption: "Which box each command touches",
        headers: ["Command", "Reads", "Writes"],
        rows: [
          ["git add", "Working tree", "The index only. Nothing is committed."],
          ["git commit", "The index", "A new commit in the local repository. The branch pointer moves."],
          ["git push", "Local commits the remote does not have", "The remote branch. Uncommitted edits stay on the laptop."],
          ["git fetch", "The remote", "Remote-tracking refs such as origin/main. Your current branch does not move."],
          ["git restore FILE", "HEAD or the index", "The working tree. Unstaged edits in that file are discarded."],
        ],
      },
      { type: "h3", text: "Branches and merge" },
      {
        type: "p",
        text: "A branch is a movable pointer to a commit, plus a name. git switch -c feature/invoice-quote creates the pointer at your current commit and checks it out, which updates the working tree to match. Commits you make now advance that pointer and do not move main. git switch main moves your working tree back to main. If you have uncommitted changes that would be overwritten, Git refuses. That refusal is protecting the only copy of those edits.",
      },
      {
        type: "p",
        text: "git merge feature/invoice-quote, while you are on main, joins that work into main. If main has not moved, Git can fast-forward: it only slides the pointer. If both sides have new commits, Git creates a merge commit with two parents, unless you passed --ff-only, in which case it refuses instead of merging. --ff-only is a useful safety check when you expected to be up to date and you are not. A merge does not delete the feature branch. Deleting a merged branch is a local cleanup, git branch -d feature/invoice-quote, and -d refuses if the branch is not merged. -D deletes it anyway. Do not use -D because the branch is in your way. That is how unmerged work disappears.",
      },
      { type: "h3", text: "Rebase, without rewriting shared history" },
      {
        type: "p",
        text: "Rebase takes commits that are on your branch and not on the target, and replays them on top of a new base. The result is a straight line instead of a merge bubble. The replayed commits have new hashes. They are not the commits you had. For local work you have not pushed, git fetch and then git rebase origin/main is a normal way to catch up a feature branch. If you have already pushed the branch and anyone else has pulled it, rebasing rewrites the commits they have. Their next pull becomes a conflict with a history you discarded. Do not rebase main. Do not rebase a release branch other people are deploying. Rebase is a tool for private or not-yet-shared commits, not a way to make the shared trunk look tidy after the fact.",
      },
      { type: "h3", text: "A conflict, line by line" },
      {
        type: "p",
        text: "If both sides edited the same lines, merge or rebase stops and writes conflict markers into the file. Nothing is committed yet. The file looks like this when you were on main and merged feature/change-port.",
      },
      {
        type: "code",
        lang: "text",
        title: "Conflict markers in src/config.ts",
        code: `<<<<<<< HEAD
const port = 8080;
=======
const port = 3000;
>>>>>>> feature/change-port`,
      },
      {
        type: "ol",
        items: [
          "The line of left angle brackets and HEAD starts your side. HEAD is the branch you have checked out, the one receiving the merge.",
          "The lines after that, up to the equals signs, are the current branch version. Here, port 8080.",
          "The line of equals signs is only a separator. It is not code.",
          "The lines after it, up to the right angle brackets, are the incoming branch named on that last line. Here, feature/change-port set the port to 3000.",
          "You edit the file until the markers are gone and the code is what you actually want. That might be one side, the other, or a combination.",
          "git add src/config.ts marks the conflict resolved. For a merge, git commit completes the merge. For a rebase, git rebase --continue continues the replay. git status tells you which of those you are in.",
        ],
      },
      {
        type: "p",
        text: "Do not leave the markers in the file and commit them. They are text. The program will try to parse them and fail, or worse, a build will not fail and production will. If you are lost, git merge --abort or git rebase --abort returns you to the state before you started that operation, provided you have not told Git to continue. Abort is the safe exit. It is not a failure of character.",
      },
      { type: "h3", text: "fetch, pull, and force-push" },
      {
        type: "p",
        text: "git fetch origin downloads new objects and updates remote-tracking refs such as origin/main. Your current branch and working tree stay where they are. You can then look at git log HEAD..origin/main before you integrate. git pull fetches and then integrates into the current branch. The integration is a merge unless pull.rebase is set, or you passed --rebase. Git will warn on recent versions if you have not chosen a pull strategy. Check git config --get pull.rebase. If you did not mean to change your branch yet, you wanted fetch, not pull.",
      },
      {
        type: "callout",
        tone: "danger",
        title: "Force-push to main is not a normal step",
        text: "git push --force overwrites the remote branch with your history. On main, that deletes teammates' commits from the shared branch and breaks anyone who already pulled. Protected branches should reject it. If you rebased a feature branch that only you use, git push --force-with-lease is the less dangerous rewrite: it refuses if the remote moved since your last fetch, so you do not overwrite someone else's push. It is still a history rewrite. It is not something you do to main to make a mistake disappear. If the commit is already on main, revert it. The safety lesson covers revert versus reset.",
      },
      {
        type: "code",
        lang: "bash",
        title: "See remote commits before you merge them",
        code: `git fetch origin
git log --oneline HEAD..origin/main
git merge --ff-only origin/main`,
      },
    ],
    exercise: {
      title: "Create a conflict and resolve it",
      prompt:
        "In a temporary directory, not in a shared repository, create a repository with two commits that conflict on one line. Resolve the markers. Do not push, and do not use --force.",
      steps: [
        "git init, set user.name and user.email if this machine has none, and make a first commit with const port = 8080.",
        "Create branch feature/change-port, commit const port = 3000, switch back to main, and commit a different comment on that same line so the histories diverge.",
        "Merge the feature branch. Open the file and label each marker line: which side is HEAD, which side is incoming.",
        "Leave one correct port, delete the markers, git add, and git commit.",
        "Run git status and write what it would mean if this repository had a remote and you had not pushed. State why you will not push --force to main.",
      ],
      criteria: [
        "The final file contains no conflict markers.",
        "The explanation names HEAD as the branch you were on and the other marker as the incoming branch.",
        "git status is clean after the merge commit, or you can explain a remaining untracked file on purpose.",
        "No force-push is used or described as the way to finish a conflict on main.",
      ],
    },
    checks: [
      {
        q: "What do the working tree, the index, and a commit each hold, and which of them does git push read?",
        a: "The working tree is your files. The index is the staged snapshot for the next commit. A commit is that snapshot recorded in the local repository, pointed at by the branch. git push sends commits that the remote does not have yet. It does not push unstaged edits, and it does not push staged-but-uncommitted edits. If git status shows changes not staged or not committed, those bytes are only on your laptop, even after a successful push of older commits.",
      },
      {
        q: "You are on main and merge feature/change-port. The file contains <<<<<<< HEAD, a port of 8080, equals signs, a port of 3000, and >>>>>>> feature/change-port. Which side is which?",
        a: "HEAD is main, the branch you have checked out, so 8080 is the current branch. Between the equals signs and the right angle brackets is feature/change-port, so 3000 is the incoming change. You delete all three marker lines and keep the code you want, then git add and git commit. Leaving the markers in the file is not a resolution. If you want out, git merge --abort returns you to pre-merge main.",
      },
      {
        q: "How do fetch and pull differ?",
        a: "fetch updates remote-tracking branches such as origin/main and does not change your current branch. pull fetches and then merges, or rebases if you configured pull.rebase, into the current branch. Use fetch when you want to inspect what arrived. Use pull only when you mean to integrate it now. git config --get pull.rebase tells you which integration you would get.",
      },
      {
        q: "When is rebase appropriate, and why is git push --force to main not the way to publish it?",
        a: "Rebase rewrites commit hashes by replaying your unpushed local commits onto a new base, which is a reasonable way to update a private feature branch after git fetch. It is not appropriate for main or for any branch other people have based work on, because their histories no longer match. push --force overwrites the remote branch. On main that removes other people's commits. Protected main should reject it. The safe publication of a shared mistake is a new revert commit, not a rewritten trunk.",
      },
    ],
    interview: [
      {
        q: "Walk through working tree, index, commit, and push.",
        a: "I edit files in the working tree. git add puts those changes in the index. git commit writes a commit object in my local repository and moves my branch pointer. git push copies that commit to origin. Until I push, nobody else has it. git diff shows what is not staged. git diff --staged shows what I am about to commit. git restore throws away unstaged work, so I do not run it unless I mean it. status is how I check which of the four places still has something.",
      },
      {
        q: "How do you resolve a merge conflict?",
        a: "I open the file and read the markers. The top, under HEAD, is the branch I am on. The bottom is the branch I merged in. I delete the markers and leave the code that should exist, then git add and git commit. If I am in a rebase, I use git rebase --continue instead. If I made a mess, git merge --abort or git rebase --abort puts me back. I do not commit the marker lines. I do not force-push main to hide the conflict.",
      },
      {
        q: "What is the difference between fetch and pull, and when would you rebase?",
        a: "fetch only updates origin/main so I can look. pull integrates that into my current branch, merge by default unless pull.rebase is set. I rebase when I have local commits I have not shared and I want them replayed on the latest main. I do not rebase commits that teammates already pulled, and I do not force-push main. If a shared commit is wrong, I revert it so history grows forward.",
      },
    ],
    takeaways: [
      "Working tree, index, local repository, and remote are different. Commit does not push.",
      "A branch is a pointer. Merge joins histories. A conflict's HEAD side is the branch you have checked out.",
      "Rebase rewrites hashes. Use it on unpushed local commits, not on main and not on commits other people have.",
      "fetch does not touch your branch. pull fetches and then merges or rebases, depending on configuration.",
      "Force-pushing main is not a normal repair. It overwrites shared history. Revert shared mistakes instead.",
    ],
  },
  {
    slug: "github-collaboration",
    title: "GitHub collaboration",
    status: "primer",
    blocks: [
      { type: "h2", text: "The remote is not the review" },
      {
        type: "p",
        text: "GitHub hosts a remote repository and adds collaboration objects that Git itself does not have: pull requests, issues, reviews, and protected branches. GitLab calls the request a merge request. The ideas match. origin is only the default name of the remote you cloned. git remote -v prints the URL. git push -u origin feature/invoice-quote publishes the branch and sets the upstream so a later git push knows the destination. The -u is a convenience. It is not a review.",
      },
      { type: "h3", text: "Pull requests and reviews" },
      {
        type: "p",
        text: "A pull request proposes merging one branch into another, usually a short-lived feature branch into main. It holds the diff, the conversation, and the CI status for that diff. An issue tracks a bug or a task and is not itself a set of commits. A pull request can close an issue by mentioning it, for example Fixes PAY-142, when the project has that automation turned on. Review is someone reading the diff. A useful review comment names a behavior: this concatenates the customer name into SQL; bind a parameter. Approve means you would ship it. Request changes means you would not, and you say why. A review is not a spelling contest and not a substitute for CI.",
      },
      { type: "h3", text: "Branch protection and CODEOWNERS" },
      {
        type: "p",
        text: "Branch protection is a setting on the server. Typical rules for main: require a pull request, require one or more approvals, require named status checks to be green, and reject force-pushes and deletions. Include administrators if the rule should bind people who can otherwise bypass it. The check names must match the job names CI actually reports. A rule that requires a check named test does nothing useful if the workflow reports unit.",
      },
      {
        type: "p",
        text: "CODEOWNERS is a file, usually .github/CODEOWNERS, that maps paths to people or teams. A line like /infra/ @example-org/platform asks that team for review when a pull request touches infra. The file does not block a merge by itself. Protection must require review from code owners, or anyone with write access can merge past the suggestion. CODEOWNERS is not an authentication system. It does not hide the code. It routes review.",
      },
      { type: "h3", text: "Tags, releases, and versions" },
      {
        type: "p",
        text: "A tag points at a commit. An annotated tag, git tag -a v1.4.3, stores a message and a tagger. Use annotated tags for releases. A lightweight tag is only a name. A GitHub release is a page attached to a tag, with notes and sometimes build artifacts. The release is not a second kind of commit. Semantic versioning uses MAJOR.MINOR.PATCH. You increment PATCH for a backward-compatible bug fix, 1.4.2 to 1.4.3. You increment MINOR for a backward-compatible feature, 1.4.3 to 1.5.0, and you reset PATCH. You increment MAJOR when you break a public contract, 1.5.0 to 2.0.0. SemVer applies to a public API you promised to keep stable. It does not require every internal script to jump a major version when you rename a private function. Before 1.0.0, the public API is still unstable by that spec.",
      },
      { type: "h3", text: "Commit messages" },
      {
        type: "p",
        text: "Write the subject in the imperative, about 50 to 72 characters, as an order to the codebase: Reject unescaped invoice names. Not Fixed the bug and not Fixing names. Leave a blank line and then a body that says why. The diff already shows what. The body should say what would go wrong if someone reverted it. Mention the ticket. Do not paste secrets into the message. The message is permanent history even after the file is gone.",
      },
      {
        type: "code",
        lang: "text",
        title: "A message that says why",
        code: `Reject unescaped invoice names

POST /invoices returned 500 when the name contained an apostrophe
because the handler spliced the name into SQL text. Bind the name
as a parameter so the quote is data. Fixes PAY-142.`,
      },
      {
        type: "callout",
        tone: "info",
        title: "The pull request description is for the reviewer",
        text: "Say how to prove it, not only what you typed. Name the test, the risk, and the rollback. A description that says WIP or stuff is not reviewable. If the change is not ready, mark it draft so nobody merges it because CI happened to be green.",
      },
    ],
    exercise: {
      title: "Write the review packet",
      prompt:
        "For the invoice apostrophe bug, write a commit message, a pull request body, and a version decision. The current public API version is 1.4.2. The HTTP contract does not change. A regression test was added.",
      steps: [
        "Write a subject in the imperative and a body that explains why, including the 500 and the SQL concatenation.",
        "Write five lines a reviewer needs: risk, test, rollback, ticket, and what you did not change.",
        "Choose PATCH, MINOR, or MAJOR from 1.4.2 and say why the others are wrong.",
        "State what a CODEOWNERS entry does not do if branch protection is off.",
      ],
      criteria: [
        "The subject is imperative and the body contains the cause, not only the file name.",
        "The version becomes 1.4.3 because the change is a backward-compatible bug fix.",
        "MAJOR is rejected because the public contract did not break. MINOR is rejected because there is no new feature.",
        "CODEOWNERS without a required review is described as a suggestion, not a gate.",
      ],
    },
    checks: [
      {
        q: "Your public API is at 1.4.2. You fix a bug without changing the contract, and you add a regression test. What version do you release?",
        a: "1.4.3. That is a PATCH bump: backward-compatible bug fix. 1.5.0 would claim a new backward-compatible feature. 2.0.0 would claim a breaking change to the public API. The regression test is how you know the fix stays. It is not itself a feature that forces a minor bump. SemVer is about the promised interface, not about how many files you touched.",
      },
      {
        q: "What does branch protection add that a CODEOWNERS file does not?",
        a: "CODEOWNERS only selects reviewers for paths. Without a protection rule that requires a pull request, required approvals, required status checks, and code owner review, the file is advisory. Protection is what rejects a direct push, a force-push, and a merge while CI is red. The status check name has to match the job CI reports. A rule for a check that never runs does not protect anything.",
      },
    ],
    interview: [
      {
        q: "How do you use a pull request, and what does a version number mean?",
        a: "I push a short-lived branch with -u origin so it has an upstream, then I open a pull request into main. The description says why, how to test, and how to roll back. Reviewers comment on behavior. Protection on main should require that review and a green check, and should block force-push. CODEOWNERS routes who is asked. It does not enforce unless protection says so. For versions I use MAJOR.MINOR.PATCH. A compatible bug fix is a patch, 1.4.2 to 1.4.3. A compatible feature is a minor. A broken public contract is a major. My commit subject is imperative, and the body says why the change exists.",
      },
    ],
    takeaways: [
      "A pull request is a review of a branch. An issue is not a diff. Protection on main enforces review, green checks, and no force-push.",
      "CODEOWNERS routes reviewers. It blocks nothing unless branch protection requires code owner review.",
      "SemVer PATCH is a compatible fix, MINOR a compatible feature, MAJOR a breaking public change. Commit subjects are imperative and the body says why.",
    ],
  },
  {
    slug: "git-safety-workflows",
    title: "Git safety and workflows",
    status: "primer",
    blocks: [
      { type: "h2", text: "Pick a workflow by how fast main must integrate" },
      {
        type: "p",
        text: "A feature-branch workflow gives each change a branch and a pull request into main. It is the right default for a junior and for any team that wants review on every change. It hurts when branches live for weeks. The integration is late, conflicts pile up, and it worked on my branch returns. Trunk-based development keeps main releasable and integrates at least daily, with branches that live hours. Incomplete work stays behind a flag instead of on a long branch. Trunk-based hurts when CI is slow or shallow, because main stops being releasable and everyone is blocked. GitFlow adds main, develop, feature, release, and hotfix branches. It was aimed at software that stabilizes a version while other work continues. It hurts small web teams: fixes must land in several long-lived branches, develop and main drift, and the ceremony is larger than the change. GitFlow is not more professional. It is more branches. For a four-person service that deploys daily, short feature branches or trunk-based development fit. GitFlow does not.",
      },
      { type: "h3", text: "gitignore is not amnesia" },
      {
        type: "p",
        text: ".gitignore lists patterns Git should not offer as untracked files: .env, *.pem, node_modules/, dist/. It does not untrack a file that is already committed. The secret is already in a blob. Adding the pattern stops the next accidental add. It does not remove history. git rm --cached .env removes the file from the index and leaves your working copy on disk, which is what you want so the app still starts. You then commit that removal. Anyone who pulls gets the deletion of the file. They do not get a rewritten past.",
      },
      {
        type: "code",
        lang: "text",
        title: "Patterns for a small service",
        code: `.env
*.pem
node_modules/
dist/`,
      },
      { type: "h3", text: "A secret that was pushed" },
      {
        type: "p",
        text: "Assume the credential is compromised as soon as it was pushed, including to a private repository. Private remotes leak through clones, CI logs, forks, and people. Deleting the file in a new commit leaves the secret in older commits. Anyone can check out yesterday. The security fix is to revoke the credential at the issuer: delete the token, rotate the cloud key, invalidate the password. Do that before you admire your gitignore. After rotation, remove the file from the tree, ignore the path, and commit. Rewriting history with git filter-repo can scrub the blob, and it is optional cleanup. Every teammate has to re-clone or reset onto the rewritten history, and forks may still have the old objects. Rotation is what stops use of the key. History rewrite is what stops a scavenger hunt. Doing only the rewrite, or only the file delete, leaves a live credential.",
      },
      {
        type: "callout",
        tone: "danger",
        title: "Reset is local surgery. Revert is a new commit.",
        text: "git revert COMMIT creates a new commit that undoes that commit. History still contains both. This is the right tool on main and on any branch other people have. git reset --hard COMMIT moves the branch pointer and throws away uncommitted work in the index and working tree. Those edits are not in a trash folder. Abandoned commits may remain in your local reflog for a limited time, on the order of 30 days for entries that are no longer reachable from the branch, which is a personal safety net and not a backup. Reset does not change the remote. Making the remote match a reset requires a force-push, which main should reject. Do not use reset --hard to remove a secret that was already pushed. The remote still has it, and you may have destroyed uncommitted work on the way.",
      },
      { type: "h3", text: "Stash" },
      {
        type: "p",
        text: "git stash push -m \"wip invoice form\" shelves uncommitted changes and returns the working tree to HEAD. git stash pop applies the latest stash and removes it if the apply was clean. If the pop conflicts, the stash is kept. git stash list shows the stack. Stashes are local. They are not pushed, they are easy to forget, and they are a poor place to keep work you need next week. Make a commit on a branch instead. A stash is for a twenty-minute interruption, not for a feature.",
      },
      { type: "h3", text: "Protecting main" },
      {
        type: "ul",
        items: [
          "Server side: require a pull request, require approvals, require the CI checks by their real names, block force-push, block deletion.",
          "Local side: do not commit directly to main if the team agreed not to. A local habit without the server setting will be skipped on a Friday.",
          "Recovery side: revert bad commits. Do not reset main and force-push.",
          "Secret side: rotate first, then delete the file from the tree, then consider history rewrite.",
          "Branch side: delete feature branches after merge with -d, which refuses if unmerged. Do not -D a branch you have not identified.",
        ],
      },
      {
        type: "code",
        lang: "bash",
        title: "Undo a shared commit by adding history, not by erasing it",
        code: `git revert --no-edit a1b2c3d
git push origin main`,
      },
    ],
    exercise: {
      title: "Order the response to a leaked token",
      prompt:
        "A file named .env containing a fake token labeled example-only was committed and pushed to origin/main. Write the order of actions for a four-person team that deploys daily. Do not include a real token.",
      steps: [
        "State the first action at the issuer, and why deleting the file is not that action.",
        "Show the gitignore and git rm --cached steps after rotation.",
        "Say what git revert is for, and why git reset --hard plus force-push is the wrong fix on main.",
        "Choose feature branches or trunk-based development for this team, and say why GitFlow would hurt.",
        "Say where a stash must not be used as the archive of the .env file.",
      ],
      criteria: [
        "Rotation or revocation is step one, before history cleanup.",
        "gitignore alone is described as insufficient for a file already committed.",
        "revert is the shared-branch undo. reset --hard is described as destroying local uncommitted work and as requiring a force-push to change the remote.",
        "GitFlow is rejected for a four-person daily-deploy team because of long-lived branch overhead, with feature branches or trunk-based named as the fit.",
      ],
    },
    checks: [
      {
        q: "A secret was committed and pushed. You delete the file in a new commit. Is the secret gone?",
        a: "No. The new commit stops the file from appearing at the tip. Older commits still contain the blob, and anyone with a clone can read it. The credential must be revoked at the issuer first. Then remove it from the tree and add an ignore rule. Rewriting history is optional cleanup after rotation, and it does not by itself invalidate a key the issuer still accepts.",
      },
      {
        q: "How do git revert and git reset --hard differ on a commit that is already on origin/main?",
        a: "git revert adds a new commit that undoes the change and can be pushed normally. Shared history stays intact. git reset --hard moves your local branch and discards uncommitted changes. It does not update origin. Publishing that reset requires a force-push, which overwrites main and should be rejected by branch protection. Use revert for a bad commit others can already see. Use reset --hard only for local mistakes you have not shared, and only when you accept that uncommitted work in the tree is gone.",
      },
    ],
    interview: [
      {
        q: "A secret reached main, and your team deploys daily. What do you do?",
        a: "I treat the secret as public and revoke it at the issuer before I clean the repository. Deleting the file or editing gitignore does not remove it from old commits, and a history rewrite is cleanup after the key is dead, not instead of rotation. On main I undo bad commits with git revert so we push a new commit. I do not git reset --hard and force-push. For workflow I want short feature branches or trunk-based development with real CI, not GitFlow. GitFlow's long-lived develop and release branches are overhead we do not need if we ship every day. Stash is only for a brief local interruption, not for secrets and not for work I need to keep.",
      },
    ],
    takeaways: [
      "Long-lived feature branches integrate late. Trunk-based development needs a releasable main. GitFlow's extra long-lived branches hurt small teams that deploy daily.",
      "gitignore does not erase history. A pushed secret is revoked at the issuer first, then removed from the tree.",
      "git revert adds an undo commit and is safe on main. git reset --hard discards local work and does not repair a remote without a force-push.",
    ],
  },
];
