import type { Lesson } from "../types";

export const lessons: Lesson[] = [
  {
    slug: "linux-filesystem-commands",
    title: "Linux filesystem and commands",
    status: "full",
    blocks: [
      { type: "h2", text: "Kernel, distro, and shell are three layers" },
      {
        type: "p",
        text: "Linux, strictly, is the kernel: processes, memory, devices, the virtual filesystem, and system calls. A distribution packages that kernel with a userland, an installer, a package manager, and defaults. Ubuntu 24.04 and Debian 12 are not the same system as Fedora, even when both run a 6.x kernel. The shell is the program that reads your commands. On Ubuntu, bash is the usual interactive shell, and /bin/sh is dash, which does not accept every bash feature. The examples here assume Debian or Ubuntu with bash and GNU coreutils, Ubuntu 24.04 as the mental model. On Fedora the same coreutils commands behave the same way. Package install commands do not, and they are in a later lesson. macOS userland is BSD and will disagree on flags such as sed -i and some grep options.",
      },
      { type: "diagram", id: "linuxfs" },
      {
        type: "p",
        text: "The filesystem diagram is a single tree starting at /. There are no drive letters. A disk is mounted onto a directory. The important trick is that some branches are not disks at all. /proc and /sys are kernel interfaces that look like files. Deleting them is not how you free space, and writing to them can change live kernel state.",
      },
      { type: "h3", text: "The directories you will actually use" },
      {
        type: "table",
        caption: "Filesystem Hierarchy Standard, the paths that matter on day one",
        headers: ["Path", "What it is", "What people get wrong"],
        rows: [
          ["/", "The root of the tree", "Not a folder you clean up. Paths are absolute when they start here"],
          ["/etc", "Host-specific configuration", "Not a place for personal documents or for large data"],
          ["/home", "Home directories for human users", "Root's home is /root, not /home/root, on the usual layout"],
          ["/var", "Data that changes: databases, caches, spool, state", "Filling /var fills the root filesystem when /var is not a separate mount"],
          ["/var/log", "Log files", "A file deleted while a process still has it open does not free space"],
          ["/tmp", "Temporary files, often wiped on reboot", "Sticky bit: you cannot delete another user's files there"],
          ["/usr", "Programs and libraries meant to be shareable", "Not user homes. On Ubuntu 24.04, /bin is typically a symlink to /usr/bin after the /usr merge"],
          ["/opt", "Add-on software that is not part of the distro packages", "Vendor tarballs land here. They do not get apt upgrades unless someone packages them"],
          ["/proc", "procfs: processes and kernel info, not stored on disk", "pid directories disappear when the process exits. This is not a log archive"],
          ["/sys", "sysfs: devices and drivers, not stored on disk", "Not a backup target"],
        ],
      },
      { type: "h3", text: "Absolute, relative, hidden, . and .." },
      {
        type: "p",
        text: "An absolute path starts with / and does not depend on where you are. A relative path is resolved from the current working directory, which pwd prints. A name that starts with a dot is hidden from ls unless you pass -a. The directory entry . means the directory itself. The entry .. means its parent. The parent of the parent is ../.. and not a special token of three dots. ... is not a filesystem shortcut. A confused person can create a file whose name is three dots. The shell will not treat that name as a grandparent. Tab completion and ls -a are how you see what is actually there. ~ is expanded by the shell to your home directory before the command runs. It is not a kernel path.",
      },
      { type: "h3", text: "Commands that move you around and show you files" },
      {
        type: "ul",
        items: [
          "pwd prints the absolute working directory.",
          "ls lists names. ls -l adds type and permissions. ls -a includes hidden names. ls -h prints sizes in KiB or MiB when combined with -l.",
          "cd changes directory. cd with no argument goes home. cd - returns to the previous directory.",
          "mkdir creates a directory. mkdir -p creates parents and does not fail if the directory already exists.",
          "touch creates an empty file or updates its modification time if it exists.",
          "cp copies. cp -r is required for a directory. A copy onto an existing file overwrites it if you have permission. There is no trash can.",
          "mv renames or moves. Across filesystems it copies and then deletes the source. A mistake in the destination is how files disappear into a wrong directory.",
          "rm removes a name. Without -r it refuses to remove a directory. The next section treats -r and -f as dangerous.",
          "cat writes the whole file to stdout. Fine for a short config. A bad idea for a multi-gigabyte log.",
          "less pages a file. You can search. It does not load the entire file into the terminal scrollback the way cat does.",
          "head shows the start. head -n 20 is the first 20 lines. tail shows the end. tail -n 50 -f follows a file as it grows. Ctrl-C stops the follow.",
          "find walks a tree. find /var/log -name '*.log' -mtime -1 finds log names modified in the last day. Quote the pattern so the shell does not expand it first.",
          "grep prints matching lines. grep -n shows numbers. grep -R searches a tree. grep -R -n error /etc/atlas is a starting point, not a reason to grep the entire disk.",
        ],
      },
      {
        type: "code",
        lang: "bash",
        title: "A lab under /tmp, not under /",
        code: `mkdir -p /tmp/atlas-lab/logs
cd /tmp/atlas-lab
echo ok > logs/app.log
echo "ERROR disk" >> logs/app.log
pwd
ls -la logs
grep -n "ERROR" logs/app.log`,
      },
      {
        type: "code",
        lang: "text",
        title: "ls and grep from that lab",
        code: `/tmp/atlas-lab
total 12
drwxr-xr-x 2 ada ada 4096 Oct 31 09:12 .
drwxr-xr-x 3 ada ada 4096 Oct 31 09:12 ..
-rw-r--r-- 1 ada ada   14 Oct 31 09:12 app.log
2:ERROR disk`,
        note: "Illustrative output — not captured from a live run in this environment.",
      },
      { type: "h3", text: "Pipes, redirection, and exit codes" },
      {
        type: "p",
        text: "Every process starts with three standard streams: stdin is file descriptor 0, stdout is 1, stderr is 2. A pipe, the vertical bar, connects stdout of the left command to stdin of the right command. stderr does not enter the pipe unless you redirect it. grep ERROR app.log | head -n 20 sends matching lines onward, and head closes the pipe early, which can cause a SIGPIPE on the left command. That is normal.",
      },
      {
        type: "ul",
        items: [
          "> file truncates file and sends stdout there. The file is emptied even if the command then fails. This is destructive to the previous contents.",
          ">> file appends stdout. Use this when you meant to keep the old log.",
          "2> file sends stderr to a file. stdout still goes to the terminal.",
          "2>&1 sends stderr to wherever stdout is going at that moment. Order matters.",
          "cmd > file 2>&1 sends both to file, because stderr is pointed at stdout after stdout has been pointed at the file.",
          "cmd 2>&1 > file sends stderr to the terminal and stdout to the file. The 2>&1 happens while stdout is still the terminal.",
          "An exit code of 0 means success, by convention. Nonzero means failure. 127 usually means the command was not found. echo $? prints the previous code. true and false are commands whose only job is to exit 0 or 1.",
          "cmd1 && cmd2 runs cmd2 only if cmd1 exited 0.",
          "cmd1 || cmd2 runs cmd2 only if cmd1 exited nonzero.",
          "cmd1; cmd2 always runs cmd2. A failure does not stop the line.",
        ],
      },
      {
        type: "code",
        lang: "bash",
        title: "Redirect both streams, then stop on the first failure",
        code: `mkdir -p /tmp/atlas-lab && cd /tmp/atlas-lab
ls /no/such/path > ls.out 2>&1 || echo "ls failed, see ls.out"`,
      },
      {
        type: "p",
        text: "set -e in a script stops the script on an unhandled nonzero status. set -u treats an unset variable as an error, which is one defense against the empty-variable deletion below. set -o pipefail makes a pipeline fail if any command in it fails, not only the last one. Those three together, set -euo pipefail, belong at the top of bash scripts you intend to trust. They do not belong in an interactive shell you are exploring with, because a failed ls would log you out if your shell were running under set -e.",
      },
      {
        type: "callout",
        tone: "danger",
        title: "rm -rf does not have an undo",
        text: "rm -rf removes recursively and does not prompt. -f means it will not ask, and it ignores nonexistent operands. There is no trash directory. GNU rm refuses rm -rf / as a special case when --preserve-root is on, which is the default. That guard does not save you from rm -rf /etc, rm -rf /*, or rm -rf $VAR when VAR is empty or unset. An empty VAR in rm -rf $VAR/ expands to rm -rf /, which is the whole tree, and the preserve-root guard may not match because the argument is not exactly /. Quote expansions, test that the variable is non-empty, and prefer a relative path under a directory you just created. Echo the command before you run it. Deleting the wrong tree deletes other people's work and running services' data. It is not a reversible edit.",
      },
      {
        type: "code",
        lang: "bash",
        title: "Refuse to delete when the variable is empty",
        code: `# Do not run a bare rm -rf $VAR. If VAR is empty, the path collapses.
if [ -z "$VAR" ]; then
  echo "VAR is empty; refusing to delete" >&2
  exit 1
fi
rm -rf -- "$VAR"`,
      },
      {
        type: "p",
        text: "The double dash stops a filename that starts with a dash from being read as an option. The quotes stop the shell from splitting the path. Neither flag makes the deletion reversible. They only stop two common ways of aiming it at the wrong place. Practice this under /tmp/atlas-lab with VAR set to a directory you created, after printing it.",
      },
    ],
    exercise: {
      title: "Build a lab tree and do not touch /",
      prompt:
        "On a Linux machine or VM you are allowed to break, work only under /tmp/atlas-lab. Show pipes, both redirects, and a guarded delete. Assume bash and GNU coreutils.",
      steps: [
        "Create /tmp/atlas-lab/logs and a file with one ERROR line and one ok line.",
        "Run ls -la and grep -n on that file. Save stdout and stderr of a failing ls with the redirect order that captures both.",
        "Show the wrong redirect order in a comment next to the right one, and say where stderr goes in each.",
        "Set VAR to /tmp/atlas-lab/logs. Print the rm command you would run. Then unset VAR and show the guard refusing to run.",
        "Write one sentence on what rm -rf / would try to do, and why the preserve-root special case is not a general safety net.",
      ],
      criteria: [
        "All paths in commands that delete or overwrite are under /tmp/atlas-lab.",
        "The captured failing ls uses > file 2>&1, and the explanation of the swapped order is correct.",
        "The guard uses a non-empty test before rm -rf, and the variable is quoted.",
        "The writeup states that rm -rf is irreversible and that an empty variable can expand toward the root.",
      ],
    },
    checks: [
      {
        q: "What is the difference between /usr, /home, and /var/log, and which of /proc is on disk?",
        a: "/usr holds programs and libraries, not home directories. On a merged Ubuntu layout /bin points into /usr/bin. /home holds human users' homes. Root's home is /root. /var/log holds logs and can fill the disk. /proc is procfs, a kernel view of processes, not a disk filesystem. Removing files under /proc is not disk cleanup.",
      },
      {
        q: "What do > and 2>&1 do, and why does the order matter?",
        a: "> file redirects stdout to file and truncates it. 2>&1 redirects stderr to the current destination of stdout. In cmd > file 2>&1 both end up in the file. In cmd 2>&1 > file stderr was already sent to the terminal before stdout moved, so only stdout reaches the file. A pipe only carries stdout. stderr still prints on the terminal unless you merge it.",
      },
      {
        q: "Why is rm -rf $VAR unsafe when VAR might be unset, even though GNU rm refuses rm -rf /?",
        a: "An unset or empty VAR makes rm -rf $VAR/ expand to rm -rf /, or rm -rf $VAR expand to rm -rf with no path. The preserve-root check looks for the exact argument /. A slash produced by an empty expansion, a glob of /*, or a path like /etc is not that special case. -rf means recursive and no prompt, and there is no undelete. Test that the variable is non-empty, quote it, and never point it at a path you have not printed.",
      },
      {
        q: "What is .. , and is ... its parent?",
        a: ".. is the parent directory. . is the directory itself. The grandparent is ../.. . Three dots is not a special path. ls -a shows . and .. and other hidden names. A relative path is resolved from the directory pwd prints. An absolute path starts with / and ignores the current directory.",
      },
    ],
    interview: [
      {
        q: "How is the Linux filesystem laid out, and how do you inspect a log safely?",
        a: "Everything is under /, including other disks mounted on directories. /etc is config, /home is users, /var/log is logs, /tmp is scratch, /usr is programs, /opt is add-on software. /proc and /sys look like files and are not disk. I would use less or tail -n 50, not cat, on a large log, and grep -n for a specific error. head and tail limit how much I pull. I assume GNU coreutils on Ubuntu or Debian. I do not use three dots as a parent path. .. is the parent.",
      },
      {
        q: "Explain pipes, exit codes, and the two redirect orders.",
        a: "A pipe sends stdout to the next command's stdin. stderr stays on the terminal unless I merge it. Exit code 0 is success. Anything else is failure, and $? shows it. && continues only on success. || continues only on failure. Semicolon always continues. cmd > file 2>&1 captures both streams in the file. If I put 2>&1 first, stderr already went to the terminal. I also remember that > truncates. For a log I meant to keep, I want >> .",
      },
      {
        q: "When is rm -rf justified, and what do you check first?",
        a: "Only for a directory I created and can name exactly, usually under /tmp, after I have echoed the path. I refuse to run it if the variable is empty, because rm -rf $VAR/ can become rm -rf /. GNU rm blocking the literal argument / is not enough. -rf will not prompt, and the data is gone. I would not use it to clean /var/log or / . If a log is huge I truncate the open file or use logrotate instead of deleting the directory.",
      },
    ],
    takeaways: [
      "The kernel, the distro, and the shell are different. These commands assume bash and GNU coreutils on Debian or Ubuntu.",
      "/etc, /home, /var, /tmp, /usr, and /opt are on disk. /proc and /sys are kernel views. .. is the parent. ... is not.",
      "A pipe moves stdout only. > truncates. cmd > file 2>&1 captures stderr. The swapped order does not.",
      "Exit status 0 is success. &&, ||, and ; decide whether the next command runs.",
      "rm -rf is irreversible. An empty variable can aim it at /. Quote paths and refuse to run when the variable is empty.",
    ],
  },
  {
    slug: "linux-permissions-processes",
    title: "Permissions and processes",
    status: "full",
    blocks: [
      { type: "h2", text: "Every process runs as some user" },
      {
        type: "p",
        text: "A user is a numeric uid plus a name in /etc/passwd. A group is a gid plus a name in /etc/group. A user has one primary group and any number of supplementary groups. Root is uid 0. Discretionary permission checks do not apply to root in the usual way, which is why a root shell is a bigger blast radius than a sudo command. Files record an owner uid and a group gid. The kernel decides access by comparing the process's credentials to those ids, then to the permission bits.",
      },
      { type: "diagram", id: "permissions" },
      {
        type: "p",
        text: "The permissions diagram is the three classes: user, group, and other. Each class has read, write, and execute. The rest of this lesson turns that picture into the octal you pass to chmod, and then into processes, because a permission only matters relative to the uid of the process that is asking.",
      },
      { type: "h3", text: "sudo is not su" },
      {
        type: "p",
        text: "sudo runs one command as another user, root by default. You authenticate as yourself. The decision is in /etc/sudoers, and the attempt is logged. sudo -i starts a login shell as root through that same policy. su switches user and, when you are not already root, asks for the target user's password. su - starts a login shell, so you get root's environment rather than a half-updated copy of yours. On Ubuntu the root account is often locked and has no password, so su fails and sudo is the supported path. Neither command should be a habit you use to avoid learning which directory is yours. A script that only works because you ran it as root is a script with the wrong owner or the wrong mode.",
      },
      { type: "h3", text: "Bits, octal, chmod, chown" },
      {
        type: "table",
        caption: "What rwx means on a file and on a directory",
        headers: ["Bit", "Value", "On a file", "On a directory"],
        rows: [
          ["r", "4", "Read the bytes", "List the names in the directory"],
          ["w", "2", "Change the bytes", "Create or delete names in the directory"],
          ["x", "1", "Execute the file", "Traverse the directory and access an entry by name"],
        ],
      },
      {
        type: "p",
        text: "Write permission on a directory lets you remove a file in it even when you cannot write the file itself. The sticky bit changes that. /tmp is mode 1777: everyone can create names, and only the owner of a name can delete it. Execute on a directory is the permission people forget. A directory that is r-- but not x lets you see names and still denies you opening the files. A directory that is --x lets you open a file if you already know its name, without listing the directory.",
      },
      {
        type: "table",
        caption: "Modes you will set on purpose",
        headers: ["Octal", "Symbolic", "Use"],
        rows: [
          ["644", "rw-r--r--", "A normal file others may read and nobody else may edit"],
          ["755", "rwxr-xr-x", "A directory others may traverse, or a program others may execute"],
          ["600", "rw-------", "A private key or a secret file"],
          ["700", "rwx------", "A private directory, such as ~/.ssh"],
          ["777", "rwxrwxrwx", "Do not set this. Every local user can read, write, and execute"],
        ],
      },
      {
        type: "p",
        text: "chmod 644 file sets the mode absolutely. chmod u+x file flips one bit. chown ada:staff file changes owner and group. Changing the owner of a file you rely on can lock you out of it the moment the mode is 600. On a system directory, sudo chown is how a tired debugging session converts a package-managed path into something the next upgrade does not expect. Only chown trees you created.",
      },
      { type: "h3", text: "umask" },
      {
        type: "p",
        text: "umask is a mask of bits to clear, not the mode you want. A typical creation mask inside programs is 666 for files and 777 for directories, then the umask is cleared. With umask 022, files come out 644 and directories 755, because 666 with the write bits for group and other removed is 644. With umask 077, files come out 600 and directories 700. That is what you want for a directory of keys. Check it with umask. Set it in the shell that creates the files. A file that is already 644 does not change because you later set a stricter umask.",
      },
      {
        type: "callout",
        tone: "danger",
        title: "Do not chmod 777",
        text: "777 means every account on the machine can rewrite the file or, if it is a directory, replace the programs inside it. People reach for it when a service gets permission denied. The denial is information: the process uid is not the owner, and the group is wrong. 777 hides that bug and leaves a writable path an attacker can use if they get any local account. Fix the owner and the group. Keep 600 on private keys. If ssh refuses a key, the fix is usually chmod 600 on the private key and chmod 700 on ~/.ssh, not a wider mode.",
      },
      { type: "h3", text: "setuid, briefly and cautiously" },
      {
        type: "p",
        text: "The setuid bit, octal 4000, makes an executable run with the file owner's uid instead of the caller's. You see it as an s in the user execute position, for example rwsr-xr-x on a binary owned by root. That is how passwd changes a file you cannot write. It is also a privilege boundary: a bug in a setuid-root program is a path to root. Do not set the bit on a program you wrote to make a permission problem go away. Linux does not honor setuid on scripts that start with a shebang, because that pattern was too easy to race, but it does honor setuid on binaries. Finding unexpected setuid binaries is an audit task, find / -perm -4000, and it is not something you run as a casual cleanup. Leave the bit alone unless you are maintaining a program whose entire design is that transition.",
      },
      { type: "h3", text: "Processes, signals, and jobs" },
      {
        type: "p",
        text: "A process has a pid and a parent pid. PID 1 is the init system on a normal host, systemd on Ubuntu 24.04, and its parent is 0. ps -ef prints uid, pid, ppid, and the command. ps aux is the BSD-style view of the same table and also works with procps on Linux. top refreshes a summary. htop is easier to read and is not installed by default. Install it with the distro package manager if you want it. Do not assume it exists in a container.",
      },
      {
        type: "code",
        lang: "bash",
        title: "Parent and child",
        code: `ps -ef | head -n 5`,
      },
      {
        type: "code",
        lang: "text",
        title: "A short process table",
        code: `UID          PID    PPID  C STIME TTY          TIME CMD
root           1       0  0 Oct30 ?        00:00:12 /sbin/init
ada         2144    2101  0 09:12 pts/0    00:00:00 bash
ada         2201    2144  0 09:15 pts/0    00:00:01 python3 app.py`,
        note: "Illustrative output — not captured from a live run in this environment.",
      },
      {
        type: "p",
        text: "The python process 2201 was started by bash 2144, so its PPID is 2144. If bash exits, the child may be reparented to PID 1, depending on how it was started. A background job in an interactive shell is still a child of that shell. Ctrl-Z sends SIGTSTP and suspends it. jobs lists shell jobs. bg %1 continues job 1 in the background. fg %1 puts it back on the terminal. That is job control for an interactive session. It is not service management. The job dies when you log out unless a service manager or a terminal multiplexer owns it. Do not leave a production process running as a shell job.",
      },
      {
        type: "p",
        text: "kill 2201 sends signal 15, SIGTERM, which is the default. The process can catch it, flush files, and exit. kill -9 2201 sends SIGKILL. The kernel destroys the process. The process cannot catch SIGKILL, cannot run cleanup, and cannot flush buffers. A database that receives SIGKILL comes back through crash recovery, which can take minutes and can lose the last unflushed transactions if the storage itself is unhealthy. Prefer TERM, wait, and only then KILL if the process is stuck and you accept crash-style recovery. kill -9 does not unlock a stuck disk and it does not undo the damage the process already did. Do not send SIGKILL to PID 1. On a systemd host that is the system, and killing it is how you halt the machine.",
      },
      { type: "h3", text: "Load average is not a CPU percentage" },
      {
        type: "p",
        text: "top prints a load average of three numbers: the 1, 5, and 15 minute exponentially damped averages of tasks that are runnable or, on Linux, in uninterruptible sleep, which is usually disk or network I/O wait. It is a count of tasks, not a percent. Compare it to the number of CPUs from nproc. A load of 4 on a 4-CPU machine means the machine was roughly fully occupied. A load of 4 on a 16-CPU machine is light. A load of 20 with CPU percent near zero often means tasks stuck in I/O, the D state in ps, not a busy calculator. Linux top reports CPU percent per core as 100, so one hot thread shows about 100 percent and a process using two cores shows about 200 percent. That percentage and the load average are different instruments. Quoting load as if it were CPU utilization will send you to optimize the wrong thing.",
      },
      {
        type: "code",
        lang: "text",
        title: "How to read one top header",
        code: `load average: 0.85, 1.40, 4.20
nproc says this VM has 2 CPUs
4.20 over 15 minutes means about two extra tasks were waiting beyond the two CPUs
It does not mean 4.2 percent and it does not mean 420 percent`,
      },
    ],
    exercise: {
      title: "Set modes and name the signal",
      prompt:
        "In /tmp/perm-lab on a Linux VM, create a file and a directory, set the modes from this lesson, and write the signal policy you will use on a stuck process. Do not chmod 777 anything.",
      steps: [
        "Create /tmp/perm-lab, a file secret.txt, and a directory private.",
        "chmod 644 the file, then 600. chmod 755 the directory, then 700. Run ls -l and read the symbolic mode back.",
        "Explain, in one sentence each, what r and x mean on private as a directory.",
        "State the default signal for kill PID, what the process is allowed to do, and what kill -9 skips.",
        "Give the load average line a meaning on a 2-CPU machine if the 15-minute number is 4.20.",
      ],
      criteria: [
        "600 and 700 appear, and 777 does not.",
        "Directory r is listing names and directory x is traversal, not file execute.",
        "SIGTERM is named as the default and as catchable. SIGKILL is named as uncatchable, with cleanup skipped.",
        "Load 4.20 is compared to 2 CPUs and is not described as a percentage.",
      ],
    },
    checks: [
      {
        q: "What does chmod 644 do, and why is 777 the wrong fix for permission denied?",
        a: "644 sets rw-r--r--: the owner can read and write, and everyone else can read. 777 sets rwx for user, group, and other, so any local account can replace the file. On a directory, any local account can delete or plant files. Permission denied means the process uid does not match the owner and is not in a group that has the bit. Fix chown or the group bit. Widening to 777 hides the bug and leaves a writable path.",
      },
      {
        q: "What is the difference between sudo and su on Ubuntu?",
        a: "sudo runs a command as root after checking your identity against sudoers, and it logs the command. su asks for the target user's password. Ubuntu often locks root's password, so su to root fails and sudo is the path that works. sudo -i is a root login shell through sudo. su - is a root login shell through root's own credentials. Use the narrow sudo command when you can, not a standing root shell.",
      },
      {
        q: "A process ignores you. Compare kill PID and kill -9 PID.",
        a: "kill PID sends SIGTERM, signal 15. The process can catch it, close files, and exit. kill -9 sends SIGKILL, which the process cannot catch or ignore. The kernel removes it immediately, without flushing or cleanup. Databases then do crash recovery. Use TERM, wait, and use KILL only if it is stuck and you accept that recovery. Do not send SIGKILL to PID 1.",
      },
      {
        q: "top shows load average 4.20, 3.10, 1.05 on a 2-CPU VM, and CPU percent is low. What do you know?",
        a: "You know the 1-minute average says about 4.2 tasks were runnable or in uninterruptible sleep, against 2 CPUs, so the run queue or the I/O wait queue is backed up. You do not know the CPU is 420 percent busy or 4.2 percent busy. Low CPU percent plus high load on Linux points at tasks stuck in D state, often disk. Look at ps for state D and at disk metrics. Do not start by buying CPU.",
      },
    ],
    interview: [
      {
        q: "Explain file permissions and why you will not use 777.",
        a: "There are three classes, owner, group, and other, and three bits, read, write, execute, worth 4, 2, and 1. 644 is a normal file, 755 is a directory or an executable others may use, 600 is a secret, 700 is a private directory. On a directory, write means create or delete names, and execute means you may traverse it. 777 lets every local user rewrite the object. When something is permission denied I check the process uid and chown or the group. I do not open the mode to the world. umask 022 is why new files are often 644. setuid-root is a different thing entirely: the binary runs as root, and I do not set that bit to paper over a permission bug.",
      },
      {
        q: "What is the difference between SIGTERM and SIGKILL?",
        a: "SIGTERM is 15 and it is what kill sends by default. The process can handle it and exit cleanly. SIGKILL is 9. The process cannot catch it, so nothing flushes and nothing runs a shutdown hook. I use it only after TERM has failed and I accept crash recovery, especially for a database. I do not kill PID 1. Shell jobs with fg and bg are a separate idea: they are the terminal's job control, not a service manager.",
      },
      {
        q: "Why is load average not CPU percent?",
        a: "Load average is a count of runnable tasks, and on Linux also uninterruptible sleep, over 1, 5, and 15 minutes. I compare it to the CPU count from nproc. Load 4 on 2 CPUs is a backed-up machine. Load 4 on 16 CPUs is fine. A high load with low CPU percent usually means I/O wait, not a hot core. Linux top's CPU percent is per core, where 100 means one core, so I never quote the load number as a percentage.",
      },
    ],
    takeaways: [
      "Permissions are owner, group, and other. 644, 755, 600, and 700 are the modes to remember. 777 is not a fix.",
      "On a directory, write creates or deletes names and execute allows traversal. umask clears bits at creation time.",
      "sudo runs one logged command as root. su needs the target password. They are not interchangeable on Ubuntu.",
      "kill sends SIGTERM, which a process can handle. kill -9 cannot be handled and skips cleanup. Do not use it first, and do not send it to PID 1.",
      "Load average is a task count, including I/O wait on Linux, compared with CPU count. It is not a percentage.",
    ],
  },
  {
    slug: "systemd-packages-logs",
    title: "systemd, packages, and logs",
    status: "primer",
    blocks: [
      { type: "h2", text: "systemd is common on Linux and absent elsewhere" },
      {
        type: "p",
        text: "systemd is the init system and service manager on Ubuntu 24.04, Debian 12, Fedora, and RHEL. PID 1 is systemd. A unit is an object it manages: a service, a timer, a socket, a mount, or a target. systemctl talks to that PID 1 over a control socket. It does not exist as the service manager on macOS, which uses launchd. Alpine's default is OpenRC, with rc-service. A container whose PID 1 is your application has no systemd at all. Inside those environments systemctl fails with a message about not being booted with systemd, or it cannot connect to the bus. Do not write install docs that claim systemctl works on every Unix.",
      },
      { type: "h3", text: "status, start, and enable" },
      {
        type: "p",
        text: "systemctl status nginx prints whether the unit is active, the main pid, and the last log lines. It does not change anything. sudo systemctl start nginx starts it now and does not configure the next boot. sudo systemctl enable nginx links the unit into the boot target, usually multi-user.target, and does not start it now. sudo systemctl enable --now nginx does both. stop and disable are the reverses. restart sends a stop and a start. reload asks the process to reread config if the unit defines a reload, which nginx does. If you edit a unit file, sudo systemctl daemon-reload makes systemd reread unit files. Until you do, it is still running the old definition.",
      },
      {
        type: "code",
        lang: "bash",
        title: "Inspect, then start, then follow one unit",
        code: `systemctl status nginx
sudo systemctl enable --now nginx
journalctl -u nginx -n 50 --no-pager`,
      },
      {
        type: "p",
        text: "journalctl reads the journal, which is binary and structured, not a text file you tail by default. -u nginx limits the view to that unit. -n 50 is the last 50 lines. --no-pager is what you want in a script or a CI log so the command does not open less. -f follows. --since '1 hour ago' limits the window. Some distros also run rsyslog and write /var/log/syslog. If you only look at syslog, you can miss a unit that logs only to the journal. If you only look at the journal, you can miss an application that writes its own file under /var/log and never talked to stdout.",
      },
      { type: "h3", text: "What a unit file is" },
      {
        type: "p",
        text: "Vendor units live in /lib/systemd/system or /usr/lib/systemd/system. Local overrides and units you add live in /etc/systemd/system. Do not edit the vendor file in place if a drop-in will do. A service unit names the command, the user, and the restart policy. The example below is a complete minimal unit for a long-running process. It is not a production hardening guide. Type=simple means systemd considers the service started as soon as the ExecStart process is running. If that process daemonizes and the parent exits, simple is the wrong type, and status will claim the service is dead.",
      },
      {
        type: "code",
        lang: "ini",
        title: "A minimal service unit",
        code: `[Unit]
Description=Atlas demo
After=network.target

[Service]
Type=simple
ExecStart=/usr/local/bin/atlas
User=atlas
Restart=on-failure

[Install]
WantedBy=multi-user.target`,
      },
      { type: "h3", text: "apt and dnf are not the same ritual" },
      {
        type: "p",
        text: "On Debian and Ubuntu, sudo apt update only refreshes the package index. It installs nothing. sudo apt upgrade then installs newer versions of packages you already have, and it will not remove a package to satisfy a dependency. sudo apt full-upgrade may remove packages. Read the prompt before you accept it on anything you care about. On Fedora and RHEL, sudo dnf upgrade refreshes metadata and applies updates in one transaction. dnf update is an alias. You do not need a separate update step copied from apt, and you still read the transaction. dnf makecache only refreshes metadata if you want that split on purpose. Packages from outside the distro, a random shell script installer, are how you get a copy of software that neither apt nor dnf will patch. Prefer the distro package or a repository you meant to add.",
      },
      {
        type: "table",
        caption: "Package commands by family",
        headers: ["Action", "Debian or Ubuntu", "Fedora or RHEL"],
        rows: [
          ["Refresh metadata only", "sudo apt update", "sudo dnf makecache"],
          ["Upgrade installed packages", "sudo apt upgrade", "sudo dnf upgrade"],
          ["Search", "apt search nginx", "dnf search nginx"],
          ["Install", "sudo apt install nginx", "sudo dnf install nginx"],
        ],
      },
      {
        type: "callout",
        tone: "warn",
        title: "Upgrading production is a change",
        text: "apt upgrade and dnf upgrade restart services and can change behavior on a Tuesday. Read what will be upgraded. Do it in a window you can roll back from, with a snapshot or an image if the host is a pet. A container host upgrading the kernel still needs a reboot before that kernel is the one you are running. uname -r shows the running kernel, not the newest one installed on disk.",
      },
    ],
    exercise: {
      title: "Explain a unit without starting it on a laptop that has no systemd",
      prompt:
        "Write the commands you would use on Ubuntu 24.04 for a unit named atlas-demo.service, and write where those commands are the wrong tool.",
      steps: [
        "Give the status command, the enable --now command, and the journal command with a line limit.",
        "Say what enable does that start does not.",
        "Name two environments where systemctl will not manage the process.",
        "Give the apt pair and the dnf equivalent for upgrading already-installed packages.",
        "Say what daemon-reload is for, in one sentence.",
      ],
      criteria: [
        "enable is boot persistence and start is immediate. enable --now is both.",
        "journalctl -u atlas-demo.service is the log command, not only /var/log/syslog.",
        "macOS and a container without systemd are both named as places systemctl does not apply.",
        "apt update is not described as the upgrade itself. dnf upgrade is the Fedora upgrade command.",
      ],
    },
    checks: [
      {
        q: "What is the difference between systemctl start nginx and systemctl enable nginx?",
        a: "start runs the unit now and does not, by itself, start it on the next boot. enable creates the boot linkage and does not, by itself, start it now. enable --now does both. status only reports. After you change a unit file on disk, daemon-reload is required before systemd uses the new definition.",
      },
      {
        q: "Where will systemctl not work, and how do Debian and Fedora package upgrades differ?",
        a: "systemctl will not manage services on macOS, which uses launchd, or on Alpine's default OpenRC, or inside a container whose PID 1 is not systemd. On Debian and Ubuntu, apt update only refreshes indexes and apt upgrade installs updates. On Fedora and RHEL, dnf upgrade does the metadata refresh and the upgrade in one transaction. Neither command is safe to run blindly on a production pet server. Read the transaction.",
      },
    ],
    interview: [
      {
        q: "How do you start a service on Linux and read its logs?",
        a: "On Ubuntu or Fedora with systemd I use systemctl status to look, systemctl enable --now to start it now and on boot, and journalctl -u name to read its logs. I do not claim that works on macOS or in a container that is not running systemd. If I changed the unit file I run daemon-reload first. For packages, apt update then apt upgrade on Debian, and dnf upgrade on Fedora. I read what will change before I agree, because an upgrade can restart the service.",
      },
    ],
    takeaways: [
      "systemctl start affects now. enable affects boot. enable --now does both. status changes nothing.",
      "journalctl -u is the first log command on systemd hosts. The journal is not the same file as every log under /var/log.",
      "systemctl is not universal. macOS, OpenRC, and many containers do not have systemd as PID 1.",
    ],
  },
  {
    slug: "shell-ssh-scheduling",
    title: "Shell, SSH, and scheduling",
    status: "primer",
    blocks: [
      { type: "h2", text: "The shell finds commands by searching PATH" },
      {
        type: "p",
        text: "PATH is a colon-separated list of directories. When you type a command with no slash, the shell searches those directories in order and runs the first matching executable. which atlas or type -a atlas shows which one won. A relative or absolute path, ./backup.sh or /usr/local/bin/backup.sh, skips the search. export PATH=/home/ada/bin:$PATH puts a directory in front for the current shell and, because of export, for child processes. An assignment without export stays in the shell and is invisible to the programs it starts. Cron and systemd do not use your interactive PATH. Scripts they run should call programs by absolute path or set PATH themselves.",
      },
      { type: "h3", text: "bashrc and profile" },
      {
        type: "p",
        text: "bash reads different files depending on how it was started. An interactive non-login shell, which is what many terminal windows are, reads ~/.bashrc. A login shell reads the first file it finds among ~/.bash_profile, ~/.bash_login, and ~/.profile. Debian and Ubuntu's default ~/.profile sources ~/.bashrc when the shell is bash, so a PATH line in ~/.bashrc often works for both SSH logins and local terminals on those distros. Non-interactive scripts do not load your aliases. The stock ~/.bashrc returns immediately when the shell is not interactive. Put settings you need in cron into the crontab or the script, not into an alias in bashrc. Do not put secrets in either file. Both are copied into dotfile repositories by accident.",
      },
      { type: "h3", text: "SSH keys" },
      {
        type: "p",
        text: "Use an ed25519 key. ssh-keygen -t ed25519 -C ada@example.com writes a private key and a public key, by default ~/.ssh/id_ed25519 and ~/.ssh/id_ed25519.pub. The comment is a label, not an authentication factor. Set a passphrase so a stolen file is not immediately usable. The public key is one line. It belongs in the remote user's ~/.ssh/authorized_keys. The private key stays on the machine that will authenticate. Permissions: ~/.ssh is 700, the private key is 600, authorized_keys is 600. OpenSSH refuses a private key that other users can read. That refusal is a feature.",
      },
      {
        type: "callout",
        tone: "danger",
        title: "Never share the private key",
        text: "The private key is the secret. Pasting it into chat, email, a ticket, or a repository means whoever saw it can authenticate as you until that public key is removed from every authorized_keys file. Deleting the chat message does not undo copies. If it leaked, remove the public key from servers, generate a new pair, and treat the old key as burned. Send the .pub file, or the one line inside it, when someone needs to grant you access. Never send the file without the .pub suffix.",
      },
      {
        type: "code",
        lang: "bash",
        title: "Create a key and show only the public half",
        code: `ssh-keygen -t ed25519 -C "ada@example.com" -f /home/ada/.ssh/id_ed25519
chmod 700 /home/ada/.ssh
chmod 600 /home/ada/.ssh/id_ed25519
ssh-keygen -y -f /home/ada/.ssh/id_ed25519`,
      },
      { type: "h3", text: "Copying files and archives" },
      {
        type: "p",
        text: "scp copies a file over SSH. scp report.txt ada@203.0.113.10:/home/ada/report.txt uses a documentation address. Current OpenSSH scp often uses the SFTP protocol underneath. It is still the simple copy. rsync copies trees and skips data that is already the same. rsync -av -e ssh ./reports/ ada@203.0.113.10:/home/ada/reports/ is the usual shape. The trailing slash on the source means the contents, not the directory itself. rsync can delete files on the destination if you pass --delete. Do not add --delete until you have run a dry run with -n and read the file list. tar packs a tree into one archive. tar -czf reports.tar.gz reports creates a gzip-compressed tar. tar -tzf reports.tar.gz lists it. tar -xzf reports.tar.gz extracts it in the current directory, which will overwrite same-named files. The f flag must be followed by the archive name. c creates, x extracts, t lists, z filters through gzip.",
      },
      { type: "h3", text: "cron" },
      {
        type: "p",
        text: "A user crontab line has five time fields and then a command: minute, hour, day of month, month, day of week. 15 2 * * * /usr/local/bin/backup.sh runs at 02:15 every day, in the system's local timezone, not in your laptop's timezone. crontab -e edits your table. crontab -l prints it. Those jobs run as you, with a minimal environment. Use absolute paths. If both the day-of-month and day-of-week fields are restricted, classic cron runs the job when either field matches, which surprises people who expected both. Keep one of them as * unless you have read that rule on purpose. systemd timers are the other scheduler on Ubuntu and Fedora: a .timer unit starts a .service, logs go to the journal, and you can express dependencies. Prefer a timer when the job is part of the service manager. Prefer cron when the host already standardizes on it. Do not create both for the same backup and then wonder why it runs twice.",
      },
      {
        type: "code",
        lang: "text",
        title: "One crontab line, explained",
        code: `15 2 * * * /usr/local/bin/backup.sh
minute: 15
hour: 2
day of month: every
month: every
day of week: every
command: absolute path, because cron's PATH is minimal`,
      },
    ],
    exercise: {
      title: "Plan a key and a schedule without leaking the key",
      prompt:
        "Write the commands and the policy for an ed25519 key and a daily backup at 02:15. Use fake usernames and the documentation address 203.0.113.10 only.",
      steps: [
        "Give the ssh-keygen command and the chmod values for .ssh and the private key.",
        "State which file may be copied to a server, and what you do if the other file was pasted into chat.",
        "Write one crontab line with all five fields labeled.",
        "Give one rsync command and say what --delete would add.",
        "Say where PATH for that cron job comes from, and why an alias in bashrc will not run.",
      ],
      criteria: [
        "The private key is never the file being installed on the server. The public key is.",
        "A leaked private key is rotated by removing the public key and generating a new pair, not by deleting a message.",
        "The cron line is 15 2 * * * followed by an absolute path.",
        "rsync --delete is described as destructive to files on the destination that are absent from the source.",
      ],
    },
    checks: [
      {
        q: "Which file is the SSH secret, and what should you do if it was shared?",
        a: "The private key, id_ed25519 with no .pub suffix, is the secret. The .pub line is what belongs in authorized_keys. If the private key was pasted anywhere, treat it as compromised: remove that public key from every authorized_keys, generate a new ed25519 pair, and do not keep using the old one because the chat was deleted. A passphrase slows use of a stolen file. It does not make a published private key acceptable to keep.",
      },
      {
        q: "Why did your command work in a terminal and fail in cron, and what does 15 2 * * * mean?",
        a: "Interactive bash loaded ~/.bashrc, so PATH and aliases existed. Cron runs a non-interactive shell with a short PATH and does not load those aliases. Use an absolute path in the crontab. 15 2 * * * means minute 15, hour 2, every day of the month, every month, every day of the week, in the host's timezone. If you set both a day of month and a day of week, classic cron runs when either matches.",
      },
    ],
    interview: [
      {
        q: "How do you set up an SSH key and a scheduled job without leaking a secret?",
        a: "I generate an ed25519 key with ssh-keygen -t ed25519, put a passphrase on it, and chmod 700 the .ssh directory and 600 the private key. I install only the .pub line in authorized_keys. I never send the private key. If it leaked I would revoke the public key and make a new pair. For a daily job, a crontab line is five fields then an absolute path, so 15 2 * * * /usr/local/bin/backup.sh is 02:15. Cron does not use my bashrc PATH. On a systemd host I might use a timer instead so logs land in the journal. rsync over SSH copies trees, and I will not pass --delete without a dry run.",
      },
    ],
    takeaways: [
      "PATH is searched in order. export is what child processes inherit. Cron does not load your interactive bashrc.",
      "An ed25519 private key never leaves your machine. Share only the .pub line. If the private key leaked, revoke it and generate another.",
      "A user crontab has five fields: minute, hour, day of month, month, day of week. Use absolute paths. systemd timers are the other scheduler, not a second copy of the same job.",
    ],
  },
  {
    slug: "linux-troubleshooting",
    title: "Linux troubleshooting",
    status: "primer",
    blocks: [
      { type: "h2", text: "A method before a command" },
      {
        type: "p",
        text: "Start with the symptom in one sentence: who is affected, what they tried, the exact error text, and when it started. Then scope it. One user, one path, one service, or every service on the host? Then ask what changed: a deploy, a package upgrade, a full disk, a permission edit, a certificate expiry. Only then pick a command. The commands in this lesson assume GNU coreutils and systemd on Debian or Ubuntu. df and du are the disk tools. journalctl is the service log. ss is the socket table. If you skip scope and start killing processes, you will turn a full disk into two incidents.",
      },
      { type: "h3", text: "Four common shapes" },
      {
        type: "ul",
        items: [
          "Disk full. Writes fail, databases go read-only, or the service cannot write a log. df -h shows filesystems at 100 percent. du finds which directory grew.",
          "High load. The host is slow. Check load average against CPU count, then CPU percent, then tasks in D state. High load is not automatically a hot CPU.",
          "Permission denied. The process uid cannot do the thing. Check the path's owner and mode, and check which user the service runs as. Do not chmod 777.",
          "Service down. systemctl status says inactive or failed, or ss shows nothing listening. Read journalctl -u for the unit before you restart it in a loop.",
        ],
      },
      { type: "h3", text: "Disk full because of logs" },
      {
        type: "p",
        text: "A service starts returning errors. df -h shows / at 100 percent and /var is not a separate filesystem, so logs and the rest of the system share the space. sudo du -xh --max-depth=1 /var | sort -h shows /var/log as the large directory. -x stays on one filesystem so you do not descend into other mounts. A single app log is tens of gigabytes because rotation never ran. You confirm with ls -lh.",
      },
      {
        type: "code",
        lang: "bash",
        title: "Find the directory, do not start by deleting /var",
        code: `df -h
sudo du -xh --max-depth=1 /var | sort -h
ls -lh /var/log/atlas`,
      },
      {
        type: "code",
        lang: "text",
        title: "A full root filesystem and a large log directory",
        code: `Filesystem      Size  Used Avail Use% Mounted on
/dev/vda1        20G   20G     0 100% /
/dev/vda1        20G   20G     0 100% /

4.0G    /var/log
120M    /var/lib
20G     /var`,
        note: "Illustrative output — not captured from a live run in this environment.",
      },
      {
        type: "p",
        text: "If you rm a log that a process still has open, the directory entry disappears and the blocks stay allocated until the process closes the file or exits. df will still show 100 percent. lsof +L1 lists deleted files that are still open. lsof may need to be installed. The recovery that frees space while the process keeps the same file descriptor is to truncate the open file in place, for example : > /var/log/atlas/app.log, only after you have confirmed that path is the file you mean. Truncating destroys the log contents. It does not destroy the directory. Copy a sample of the error out first if you will need it for the ticket. Then fix rotation, logrotate or the journal's size limit, so the disk does not fill again tomorrow. Do not rm -rf /var/log. That removes logs you needed and can break syslog if you delete the files a daemon expects to reopen by name.",
      },
      { type: "h3", text: "The other three, shorter" },
      {
        type: "p",
        text: "High load: read the load line, run nproc, and look at top for CPU versus wa, the I/O wait percent. If wa is high, the disk is the suspect, which loops back to df and to a storage metric. Permission denied: sudo -u atlas touch /var/lib/atlas/x as a reproduction, then ls -ld on each parent. The service user is in the unit file, User=. Fix ownership on the data directory you created, not on /var. Service down: systemctl status atlas, then journalctl -u atlas -n 100 --no-pager, then ss -lptn to see if the port is gone. Restart once you have the error text. Restarting first erases the chance to see a crash loop's first message if you did not have persistent logs.",
      },
      {
        type: "callout",
        tone: "tip",
        title: "Recent change beats a deep theory",
        text: "If the host worked at 10:00 and failed at 10:20, the package upgrade or the deploy in between is the first hypothesis. Check /var/log/apt or the deploy record before you rewrite the network. A full disk is also a change. It just does not look like a deploy.",
      },
    ],
    exercise: {
      title: "Write the disk-full sequence",
      prompt:
        "A ticket says the API returns errors and ssh still works. You suspect a full disk. Write the ordered checks and the one deletion trap. Stay on GNU tools and systemd.",
      steps: [
        "State symptom, scope, and the recent-change question before any command.",
        "Give df -h and the du command you will run, including why -x is there.",
        "Explain why rm of an open log can leave df at 100 percent, and what truncation does instead.",
        "Name the follow-up that stops a repeat: rotation, not a bigger disk as the only answer.",
        "Say one command you will not run, and the consequence if you did.",
      ],
      criteria: [
        "df comes before du, and du is limited to a depth and one filesystem.",
        "The open-file behavior is correct: space returns when the process closes the descriptor, not when the name is unlinked.",
        "Truncation is aimed at a specific file, not at /var/log.",
        "rm -rf /var/log or rm -rf / is explicitly rejected with the consequence.",
      ],
    },
    checks: [
      {
        q: "You deleted a huge log and df -h still shows 100 percent. Why?",
        a: "The process that was writing the log still has the file open. Unlinking the name does not free the blocks until that file descriptor is closed or the process exits. df reports blocks, not directory entries. Truncate the file in place, or restart the process after you accept the logging gap, and confirm with lsof that you found the deleted open file. Then fix log rotation.",
      },
      {
        q: "Put these in order for a host that just got slow: kill -9 the database, df -h, ask what changed, check load average against nproc.",
        a: "Ask what changed and define the symptom first. Then df -h, because a full disk makes everything slow and makes databases refuse writes. Then compare load average to nproc and look at I/O wait. kill -9 of the database is last, if it appears at all, because SIGKILL skips cleanup and forces crash recovery. It is not a diagnostic step. Most slow-host tickets never need it.",
      },
    ],
    interview: [
      {
        q: "The disk is full and the app is failing. What do you do?",
        a: "I confirm the symptom and whether it is one host. I run df -h. If the root filesystem is at 100 percent I run du -xh --max-depth=1 on /var and sort it. Logs are the usual growth. I do not rm -rf /var/log. If I delete a file a process still has open, the space stays used, so I truncate that specific file or restart the writer after I have saved a sample. Then I fix logrotate so it happens again on a schedule, not as another emergency. I also ask what else changed, because a full disk and a bad deploy can land together.",
      },
    ],
    takeaways: [
      "Order the work: symptom, scope, recent change, then the command that distinguishes disk, load, permission, and a dead service.",
      "df -h shows which filesystem is full. du shows which directory grew. Deleting an open log does not free space until the process closes it.",
      "Do not chmod 777, do not rm -rf /var/log, and do not SIGKILL a database as a first diagnostic step.",
    ],
  },
];
