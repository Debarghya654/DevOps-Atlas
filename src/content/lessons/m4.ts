import type { Lesson } from "../types";

export const lessons: Lesson[] = [
  {
    slug: "bash-scripting-fundamentals",
    title: "Bash scripting fundamentals",
    status: "full",
    blocks: [
      {
        type: "h2",
        text: "A script is a program with a bad default",
      },
      {
        type: "p",
        text: "Bash is the default glue on Linux CI agents and servers. It starts in a mode that keeps going after a failed command, splits unquoted variables on spaces, and treats an unset variable as an empty string. Those defaults are how a health check reports success after curl was not found. This lesson turns on the strict options, quotes every expansion, and builds one health-check script you can run on a laptop.",
      },
      {
        type: "h2",
        text: "set -euo pipefail",
      },
      {
        type: "p",
        text: "Put the strict header under the shebang. set -e (errexit) exits the script when a command returns non-zero. set -u (nounset) exits when you expand a variable that was never set, which catches typos such as $ulr. set -o pipefail makes a pipeline fail when any command in it fails, not only the last one. Without pipefail, curl | jq can hide a curl failure because jq still exits 0 on empty input. $? is the exit status of the most recent command. Read it on the next line or it will be overwritten. $# is the number of positional parameters. $1 is the first argument after the script name ($0). shift discards $1 and renumbers the rest; $# drops by one. shift with no parameters left returns non-zero, and under set -e that exits the script.",
      },
      {
        type: "code",
        lang: "bash",
        title: "Strict header and a bounded loop",
        code: `#!/usr/bin/env bash
set -euo pipefail

for region in us-east eu-west; do
  printf 'plan %s\\n' "$region"
done

attempt=0
while [[ "$attempt" -lt 3 ]]; do
  attempt=$((attempt + 1))
  printf 'attempt %s\\n' "$attempt"
done`,
      },
      {
        type: "callout",
        tone: "warn",
        title: "-e does not mean every failure exits",
        text: "errexit is suspended for the test in if, while, and until, and for every command in an && or || list except the one that finally decides the list. A failing curl inside if curl; then does not exit the script. A pipeline without pipefail still reports only the last status, so set -e never sees the earlier failure. Commands in a variable assignment of the form local file=\"$(cmd)\" can also hide a failure on some Bash versions. Prefer local file on its own line, then file=\"$(cmd)\".",
      },
      {
        type: "p",
        text: "Capture a status that you intend to handle. status=0 followed by curl || status=\"$?\" works under set -e because a failure on the left of || does not abort, and $? on the right is still curl's status. If you write if ! curl; then status=\"$?\"; fi, the value in $? is not curl's status anymore. Functions inherit errexit: a failing command inside a function aborts the whole script unless the function itself was called in a conditional.",
      },
      {
        type: "h2",
        text: "Quoting: double, single, and unquoted",
      },
      {
        type: "p",
        text: "An unquoted expansion is words, not a value. Bash splits it on IFS (space, tab, and newline by default) and then expands any remaining glob characters against filenames. Double quotes expand $variables and $(commands) but suppress splitting and globbing. Single quotes are literal: no variables, no commands, no escapes. Inside [[ ]], the right-hand side of == is a glob pattern, not a regex, and you should still quote the left-hand side. Use =~ only when you mean a regular expression, and quote the left side so an empty value does not become a syntax error under set -u.",
      },
      {
        type: "code",
        lang: "bash",
        title: "The same characters, three quoting modes",
        code: `#!/usr/bin/env bash
set -euo pipefail

item="web api"
# Unquoted expansion is the defect. It is here so you can see two words.
echo unquoted: $item
echo "double: $item"
echo "single: " '$item'`,
      },
      {
        type: "table",
        caption: "Which quotes to type",
        headers: ["Form", "Expands variables", "Word-splitting and globs", "Use"],
        rows: [
          ["\"$item\"", "Yes", "No", "Default for every parameter, path, and URL"],
          ["'$item'", "No", "No", "Literal text, including a password pattern or a menu string"],
          ["$item", "Yes", "Yes", "Almost never. Filenames with spaces will split"],
        ],
      },
      {
        type: "h2",
        text: "Arrays, tests, loops, and functions",
      },
      {
        type: "p",
        text: "Assign an array with services=(api web \"web api\"). A quoted \"$services\" prints only the first element. To pass every element as its own word, quote the at-form written with a dollar sign, an open brace, services[@], and a close brace. The matching length form puts a hash before the name. The star form, quoted, joins elements with the first character of IFS, which is rarely what you want. if [[ -z \"$url\" ]]; then treats a missing URL as an error without forking test. for name in api web; do is the right loop for a fixed list. while is for a condition, including retries. A function is name() { ... } with no parentheses at the call. Variables inside are global unless declared local. Log with printf '%s\\n' \"message\" >&2 so stdout stays available for data and stderr carries diagnostics. Operators read stderr; piping the script to another program does not swallow the log.",
      },
      {
        type: "code",
        lang: "bash",
        title: "healthcheck.sh",
        code: `#!/usr/bin/env bash
set -euo pipefail

log() {
  printf '%s\\n' "$*" >&2
}

usage() {
  log "usage: healthcheck URL"
  exit 2
}

if [[ "$#" -lt 1 ]]; then
  usage
fi

url="$1"
shift
if [[ "$#" -ne 0 ]]; then
  log "unexpected extra arguments"
  exit 2
fi

attempt=1
status=0
while [[ "$attempt" -le 3 ]]; do
  status=0
  curl --fail --silent --show-error --max-time 5 --output /dev/null "$url" || status="$?"
  if [[ "$status" -eq 0 ]]; then
    printf 'healthy %s\\n' "$url"
    exit 0
  fi
  log "attempt $attempt failed status=$status"
  attempt=$((attempt + 1))
  sleep 1
done

log "unhealthy url=$url status=$status"
exit "$status"`,
      },
      {
        type: "callout",
        tone: "tip",
        title: "Logs go to stderr",
        text: "printf to stdout is the result (healthy plus the URL). log() writes to stderr with >&2. If you echo errors to stdout, a later pipeline will treat the error text as data, and a cron mailer may not show it separately from the payload.",
      },
      {
        type: "p",
        text: "Walk the health check. The shebang selects Bash via PATH rather than assuming /bin/bash is the only location. The strict header is next, before any command that could fail silently. usage exits 2, the conventional status for bad arguments, which is distinct from 1 for an unhealthy target. [[ \"$#\" -lt 1 ]] is the condition set -e will not abort on; usage aborts explicitly. url=\"$1\" is quoted. shift then requires $# to be 0 so a second accidental argument is rejected instead of ignored. The while loop retries a GET-shaped probe. curl --fail makes HTTP 4xx and 5xx into non-zero statuses, --max-time 5 bounds the wait, and --output /dev/null keeps the body off stdout. The || status capture is required because the curl line is allowed to fail. sleep 1 is a fixed backoff, not a strategy for production load; the Python lesson adds exponential backoff. The final exit passes curl's status through so a caller can tell a timeout from an HTTP error.",
      },
      {
        type: "h2",
        text: "When Bash is the wrong tool",
      },
      {
        type: "ul",
        items: [
          "JSON or YAML. Field splitting and jq pipelines break on nested data, empty arrays, and strings that contain spaces. Use Python's json module.",
          "HTTP APIs beyond a single curl. You will reimplement status handling, retries, and headers in strings.",
          "Any logic you need to unit test: parsers, date math, state machines, or more than a few branches.",
          "Untrusted input concatenated into a shell command. Pass arguments as a list from Python with shell=False instead.",
        ],
      },
      {
        type: "p",
        text: "Stay in Bash for process supervision glue, short CI steps, and wrapping commands you already trust. Cross the line to Python when the script starts storing structured data in strings. The next lesson does that with the standard library only.",
      },
    ],
    exercise: {
      title: "Write a strict health check",
      prompt: "On your laptop, with Bash and curl installed, write healthcheck.sh that probes one URL. No cluster and no extra packages. This site does not run the script for you.",
      steps: [
        "Create healthcheck.sh with the shebang and set -euo pipefail before any other command.",
        "Require exactly one argument. If it is missing or if extras remain after shift, print a usage line to stderr and exit 2.",
        "Call curl with --fail, --silent, --show-error, --max-time 5, and --output /dev/null. Quote the URL. Capture a non-zero status with || so set -e does not abort before you log it.",
        "Retry at most 3 times. Log each failure to stderr. On success print a single healthy line to stdout and exit 0.",
        "Run it against https://example.com and then against http://127.0.0.1:9 (nothing should be listening). Confirm the second run is non-zero and that the error text is on stderr.",
      ],
      criteria: [
        "bash -n healthcheck.sh reports no syntax errors.",
        "A missing argument exits 2 and does not call curl.",
        "https://example.com exits 0.",
        "The closed port exits non-zero, and the log line contains the status.",
        "No unquoted expansion of the URL, and no set +e left on at the end of the file.",
      ],
    },
    checks: [
      {
        q: "What does set -o pipefail change?",
        a: "A pipeline's status becomes the rightmost non-zero status instead of only the last command's status, so set -e can see an earlier failure.",
      },
      {
        q: "Why does if curl --fail \"$url\"; then not abort under set -e when curl fails?",
        a: "The command is in a conditional test. errexit is suspended there so the if can handle the failure. You must record $? yourself if you need curl's status.",
      },
      {
        q: "What is the difference between \"$name\" and '$name'?",
        a: "Double quotes expand the variable and prevent word-splitting. Single quotes produce the literal characters dollar-name.",
      },
      {
        q: "What do $1, $#, and shift do?",
        a: "$1 is the first positional parameter, $# is how many there are, and shift drops the first and renumbers the remainder.",
      },
    ],
    interview: [
      {
        q: "Explain set -euo pipefail and one case -e will not save you.",
        a: "-e exits on a non-zero command, -u exits on an unset expansion, and pipefail fails a pipeline if any stage fails. -e does not fire for a command used as an if or while test, and without pipefail a failing command early in a pipeline is ignored when the last stage exits 0.",
      },
      {
        q: "A deploy script does rm -rf \"$dest\" && cp -a \"$src\" \"$dest\". What do you want to see before this runs unattended?",
        a: "Both variables quoted and rejected when empty (set -u is not enough if they are set to empty), a dry-run mode, an absolute path check so dest cannot be /, and a timeout around the copy. Blind rm -rf is not idempotency.",
      },
      {
        q: "When would you refuse to extend a Bash script and rewrite it in Python?",
        a: "When it parses JSON, calls several HTTP endpoints, or has branching that needs tests. Quoting and pipelines become the program. Python with the standard library keeps arguments in lists and errors in exceptions.",
      },
    ],
    takeaways: [
      "Start every Bash script with set -euo pipefail and quote every expansion.",
      "-e ignores failures in if tests and does not see pipeline failures unless pipefail is on.",
      "Capture $? on the next line. $1, $#, and shift are the whole argument API you should need.",
      "Log to stderr. Leave stdout for the result.",
      "Stop using Bash when the data is JSON or the control flow needs real tests.",
    ],
  },
  {
    slug: "python-for-devops",
    title: "Python for DevOps",
    status: "full",
    blocks: [
      {
        type: "h2",
        text: "Use Python when the data has structure",
      },
      {
        type: "p",
        text: "Python is the default language for DevOps scripts that read JSON or YAML, call HTTP, or must fail with a stack trace a colleague can read. This lesson stays on the standard library: pathlib, json, logging, urllib, and subprocess. It does not install requests. The health client talks to a Spring Boot actuator endpoint, conceptually http://127.0.0.1:8080/actuator/health, and treats a non-UP status as failure. Verify library and runtime versions against current official docs before you pin them in a shared repository.",
      },
      {
        type: "table",
        caption: "Bash versus Python for the same job",
        headers: ["Job", "Bash", "Python"],
        rows: [
          ["JSON body", "jq pipeline, easy to break on nested fields", "json.loads returns dicts and lists"],
          ["HTTP", "curl plus a separate parser", "urllib.request in the standard library"],
          ["Arguments", "Word-splitting unless you quote perfectly", "A list of strings, no shell"],
          ["Failure", "Exit codes you must capture", "Exceptions you can chain and log"],
          ["Where it shines", "Short glue around commands already on PATH", "Anything you will test or retry"],
          ["Cost", "Tiny startup, awkward tests", "A venv to create, straightforward tests"],
        ],
      },
      {
        type: "h2",
        text: "A virtual environment and pinned requirements",
      },
      {
        type: "p",
        text: "python3 -m venv .venv creates an interpreter that is not the system one. Activate it with source .venv/bin/activate in a shell, or call .venv/bin/python directly from CI so you do not depend on activation. pip install -r requirements.txt installs exactly the lines you listed. Pin direct dependencies as name==version. Do not write a bare package name and do not use a range that can float during a build. The health script below imports nothing outside the standard library, so its requirements file documents that choice and shows the pin format you will use the moment you add a package. Verify every version against current official docs; a pin copied from a blog can be a known-vulnerable release.",
      },
      {
        type: "code",
        lang: "text",
        title: "requirements.txt",
        code: `# Stdlib-only health client. No third-party packages are installed.
# When you add one, pin an exact version and verify it against current docs:
# PyYAML==6.0.2`,
      },
      {
        type: "callout",
        tone: "tip",
        title: "Commit the pin file, not the venv",
        text: ".venv is local and large. Commit requirements.txt. In CI, create the venv in the job and install from that file. A floating install without pins is a different program every week.",
      },
      {
        type: "h2",
        text: "pathlib, json, logging, and urllib",
      },
      {
        type: "p",
        text: "pathlib.Path handles separators and encoding. Path.read_text(encoding=\"utf-8\") is the fixture path for tests so you can develop the parser without a server. json.loads turns a health body into a dict; catch json.JSONDecodeError instead of treating a parse error as a connection error. logging writes to stderr by default. Use logger.error(\"health failed: %s\", exc) so you do not build the message when the level is disabled, and so arbitrary response text cannot look like a format string. urllib.request.urlopen(url, timeout=5) is the HTTP client. timeout is mandatory: the default can block a pipeline until the agent is killed. urllib.error.HTTPError is a subclass of URLError and is raised for non-success statuses. Catch URLError, log it, and re-raise or translate it. Do not use a bare except.",
      },
      {
        type: "code",
        lang: "python",
        title: "check_health.py",
        code: `import json
import logging
import sys
import urllib.error
import urllib.request
from pathlib import Path

logging.basicConfig(level=logging.INFO, format="%(levelname)s %(message)s")
log = logging.getLogger("health")

def read_fixture(path: Path) -> dict:
    return json.loads(path.read_text(encoding="utf-8"))

def fetch_health(url: str, timeout: float = 5.0) -> dict:
    request = urllib.request.Request(url, method="GET")
    try:
        with urllib.request.urlopen(request, timeout=timeout) as response:
            body = response.read().decode("utf-8")
    except urllib.error.URLError as exc:
        log.error("health request failed: %s", exc)
        raise
    try:
        payload = json.loads(body)
    except json.JSONDecodeError as exc:
        log.error("health body was not JSON: %s", exc)
        raise
    if not isinstance(payload, dict):
        raise ValueError("health JSON must be an object")
    return payload

def main(argv: list[str]) -> int:
    if len(argv) != 2:
        log.error("usage: check_health.py URL_OR_FILE")
        return 2
    target = argv[1]
    if target.startswith("http://") or target.startswith("https://"):
        payload = fetch_health(target)
    else:
        payload = read_fixture(Path(target))
    status = payload.get("status")
    if status == "UP":
        log.info("status=UP")
        return 0
    log.error("status=%s", status)
    return 1

if __name__ == "__main__":
    sys.exit(main(sys.argv))`,
      },
      {
        type: "h2",
        text: "Timeouts, retries, backoff, and subprocess",
      },
      {
        type: "p",
        text: "A health GET is idempotent: repeating it does not change the service. Retry idempotent reads on timeout, connection reset, and HTTP 429 or 503. Do not blindly retry a POST that creates an order unless the API accepts an idempotency key and you send the same key again. Cap the attempts. Exponential backoff doubles the wait (0.5s, 1s, 2s) and should stop at a ceiling. Add jitter in real outages so every agent does not retry on the same millisecond. Always pass timeout to urlopen and to subprocess.run. subprocess.run(args, check=True, timeout=600, shell=False) runs one program. check=True raises CalledProcessError on a non-zero exit. timeout kills the child and raises TimeoutExpired so a stuck Maven cannot occupy an agent forever. shell=False takes a list, performs no globbing, and does not interpret metacharacters. shell=True with a formatted string is a command injection bug as soon as any part of the string is data.",
      },
      {
        type: "code",
        lang: "python",
        title: "Retry an idempotent GET, then run Maven without a shell",
        code: `import subprocess
import time
import urllib.error
import urllib.request

def fetch_with_backoff(url: str, attempts: int = 3, timeout: float = 5.0) -> bytes:
    delay = 0.5
    last_error = None
    for _ in range(attempts):
        try:
            with urllib.request.urlopen(url, timeout=timeout) as response:
                return response.read()
        except urllib.error.URLError as exc:
            last_error = exc
            time.sleep(delay)
            delay = min(delay * 2, 8.0)
    raise RuntimeError("health endpoint failed") from last_error

def run_unit_tests() -> None:
    subprocess.run(
        ["mvn", "-B", "test"],
        check=True,
        timeout=600,
        shell=False,
    )`,
      },
      {
        type: "callout",
        tone: "warn",
        title: "shell=False is the default you should keep",
        text: "Passing a single string with shell=True sends that string to /bin/sh. A branch name or a URL that contains a semicolon becomes a second command. Build a list. If you think you need a pipe, call the two programs yourself or use a purpose-built library.",
      },
      {
        type: "ul",
        items: [
          "Idempotent script: running it twice leaves the same end state. mkdir -p is idempotent. Appending a line unconditionally is not.",
          "Check the current state before mutating, or call an API that is create-if-absent.",
          "Deleting and recreating as a shortcut is destructive, not elegant. Refuse to do it for data directories.",
          "Surface the final exception with raise ... from exc so the log keeps the original URLError.",
        ],
      },
      {
        type: "p",
        text: "The actuator JSON for a healthy Spring Boot 3 process looks like a small object whose status field is UP. Confirm the path and the JSON shape against the Spring Boot version you run; the default actuator path is /actuator/health when the actuator starter is on the classpath. The script returns 2 for usage errors, 1 for a down or unexpected status, and 0 only for UP. That matches how a pipeline should treat the step: non-zero fails the job.",
      },
    ],
    exercise: {
      title: "Stdlib health client in a venv",
      prompt: "Create a virtual environment and a health script that uses only the Python standard library. Free tools already on most laptops: python3 and a text editor. This site does not execute it for you.",
      steps: [
        "Run python3 -m venv .venv and write a requirements.txt whose only package lines, if any, are exact name==version pins. The script itself must import no third-party modules.",
        "Implement fetch_health with urllib.request.urlopen, an explicit timeout, and logging on URLError. Parse the body with json.loads.",
        "Accept either an http(s) URL or a local JSON file path. Return exit code 0 only when status is UP, 1 when the JSON loaded but status is not UP, and 2 when the arguments are wrong.",
        "Write health.json containing a JSON object with status set to UP. Run .venv/bin/python check_health.py health.json and confirm exit 0.",
        "Change the fixture status to DOWN, run again, and confirm exit 1 and a log line on stderr.",
      ],
      criteria: [
        "python3 -m py_compile check_health.py succeeds using the venv interpreter.",
        "The UP fixture exits 0 and the DOWN fixture exits 1.",
        "urlopen is called with a timeout, and subprocess is not invoked with shell=True.",
        "requirements.txt contains no unpinned package name.",
        "A missing argument exits 2 without opening a network connection.",
      ],
    },
    checks: [
      {
        q: "Why pass timeout to urlopen and to subprocess.run?",
        a: "Without a timeout the call can block until the CI agent is killed. timeout fails the script while you still control the error.",
      },
      {
        q: "What does subprocess.run(..., check=True, shell=False) do on a non-zero exit?",
        a: "It raises CalledProcessError. shell=False treats the argument list as the program and its argv, with no shell parsing.",
      },
      {
        q: "Which HTTP calls are safe to retry with backoff?",
        a: "Idempotent calls such as a health GET. Do not retry a non-idempotent create unless you reuse an idempotency key the server understands.",
      },
      {
        q: "Why pin requirements.txt if this script uses only the standard library?",
        a: "The file records that there are no third-party packages today, and it is the place exact name==version pins go before anyone adds an unpinned install later.",
      },
    ],
    interview: [
      {
        q: "Walk through how you would call a JSON health endpoint from Python without adding requests.",
        a: "Create a venv, use urllib.request.urlopen with a timeout, decode the body, json.loads it, and check the status field. Catch URLError and JSONDecodeError separately, log to stderr, and exit non-zero if status is not UP.",
      },
      {
        q: "Why is shell=True with an f-string dangerous in a deploy script?",
        a: "The shell parses the string. Data that contains quotes, globs, or semicolons changes the command. A list with shell=False does not give the shell a chance to reinterpret arguments.",
      },
      {
        q: "What is the difference between a retry and an idempotent operation?",
        a: "A retry repeats a call after a failure. Idempotency means the repetition does not create a second side effect. Retries without idempotency duplicate orders, users, or messages.",
      },
    ],
    takeaways: [
      "Use Python, not Bash, for JSON, HTTP, and logic you must test.",
      "Create a venv and pin third-party versions as name==version. Verify versions against current official docs.",
      "urllib, json, pathlib, and logging cover a health client without requests.",
      "subprocess.run needs check=True, a timeout, and shell=False.",
      "Retry only idempotent calls, with a cap and exponential backoff.",
    ],
  },
  {
    slug: "safe-automation",
    title: "Safe automation",
    status: "primer",
    blocks: [
      {
        type: "h2",
        text: "A job that can run twice",
      },
      {
        type: "p",
        text: "Automation runs again. Cron overlaps, people rerun failed pipelines, and a retry loop repeats the last mutation. An idempotent step leaves the system in the same end state when it succeeds twice. mkdir -p and a create-if-absent API call are idempotent. Appending a row with no unique key is not. Deleting a directory and recreating it is not a clever form of idempotency; it is data loss that happens to converge.",
      },
      {
        type: "h3",
        text: "Dry-run, timeouts, retries, backoff",
      },
      {
        type: "p",
        text: "A dry-run prints the mutation and exits 0 without performing it. Destructive scripts should also refuse to act unless the caller passes an explicit apply flag, so a half-typed command does nothing. Every network call and every child process needs a timeout. Retry only idempotent steps, a small fixed number of times, with exponential backoff and preferably jitter. A retry of a non-idempotent POST duplicates the side effect. Quote every expansion. Least privilege means the cron user, the CI token, and the SSH key can do the job and nothing wider: a linter does not need permission to push to main.",
      },
      {
        type: "ul",
        items: [
          "Do not parse ls. Its output is for humans. Filenames may contain spaces or newlines. Loop over a quoted glob instead.",
          "Set -euo pipefail in Bash jobs, or check return codes in Python, so a failed middle step is not reported as success.",
          "Cap retries. An unbounded loop turns a bad deploy into a self-inflicted outage.",
          "Log the action, the target, and the exit status to stderr. Do not log secrets.",
        ],
      },
      {
        type: "callout",
        tone: "danger",
        title: "rm -rf is not a retry strategy",
        text: "Removing a tree and copying it again will wipe local state, including data you meant to keep, if the destination variable is wrong or empty. Block empty paths, prefer absolute paths, and require an apply flag. There is no undo on a production host.",
      },
      {
        type: "h3",
        text: "Do not parse ls",
      },
      {
        type: "p",
        text: "for path in /var/log/app/*.log; do is the replacement. Test -e \"$path\" so a directory with no matches does not process the literal glob, or enable nullglob in Bash. cut, awk, and column layouts change between ls implementations and break when a filename contains a space. The same rule applies to parsing docker ps or kubectl get without a machine-readable flag. If a tool offers JSON or -z output, use that.",
      },
      {
        type: "h2",
        text: "Cron is not your interactive shell",
      },
      {
        type: "p",
        text: "Cron runs with a short PATH, a minimal environment, and a working directory that is often the home directory, not your repo. It does not source .bashrc, so direnv, nvm, and exported cloud credentials from your laptop session are absent. The shell may be /bin/sh, not Bash, unless the crontab line says otherwise. Set PATH inside the script, use absolute paths to binaries, cd to a known directory, and redirect stdout and stderr to a file you actually read. A script that works when you type it and fails at 02:00 is almost always an environment bug. Mail from cron is easy to ignore; write a log line with a timestamp.",
      },
      {
        type: "code",
        lang: "bash",
        title: "Dry-run and a cron-safe PATH",
        code: `#!/usr/bin/env bash
set -euo pipefail
PATH="/usr/bin:/bin"

dry_run=0
if [[ "$#" -ge 1 && "$1" == "--dry-run" ]]; then
  dry_run=1
  shift
fi

if [[ "$#" -ne 1 ]]; then
  printf '%s\\n' "usage: restart-app [--dry-run] name" >&2
  exit 2
fi

name="$1"
if [[ "$dry_run" -eq 1 ]]; then
  printf 'dry-run: would restart %s\\n' "$name"
  exit 0
fi

printf 'restart %s\\n' "$name"`,
      },
      {
        type: "table",
        caption: "Habit versus failure mode",
        headers: ["Habit", "What breaks", "Safer default"],
        rows: [
          ["Rely on the login PATH", "Cron cannot find python or mvn", "Set PATH in the script"],
          ["Parse ls", "Spaces in names become extra fields", "Quoted glob or JSON output"],
          ["Retry every error", "Duplicate creates during an outage", "Retry only idempotent calls, with a cap"],
          ["Run as root", "A bug has full host power", "A dedicated user with write access only where needed"],
          ["Unquoted $dest", "rm receives extra words", "\"$dest\" and reject empty values"],
        ],
      },
      {
        type: "callout",
        tone: "warn",
        title: "Least privilege applies to tokens",
        text: "A scheduled job's cloud key and a CI token are part of the program. Scope them to the one API call the job makes. A token that can administer the account will eventually leak through a debug log or a pulled dependency.",
      },
    ],
    exercise: null,
    checks: [
      {
        q: "Why is the environment under cron different from your terminal?",
        a: "Cron does not source your shell rc files. PATH is minimal, the working directory is not your repo, and credentials you exported interactively are missing.",
      },
      {
        q: "What should a dry-run do, and which operations are safe to retry?",
        a: "Dry-run prints the change and does not perform it. Retry only idempotent operations, with a timeout, a capped attempt count, and backoff.",
      },
    ],
    interview: [
      {
        q: "A nightly cleanup works in your shell and deletes nothing under cron. What do you inspect first?",
        a: "The cron environment: PATH, working directory, shell, and whether the script assumed variables from .bashrc. Then confirm it is not parsing ls and that a dry-run mode shows the intended paths before any delete.",
      },
    ],
    takeaways: [
      "Make steps idempotent, support a dry-run, and put a timeout on every external call.",
      "Do not parse ls. Quote expansions. Retry only idempotent work, with backoff and a cap.",
      "Cron is a clean environment. Set PATH yourself and do not run jobs as root unless the operation requires it.",
    ],
  },
];
