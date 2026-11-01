import type { Lesson } from "../types";

export const lessons: Lesson[] = [
  {
    slug: "terraform-fundamentals",
    title: "Terraform fundamentals",
    status: "full",
    blocks: [
      {
        type: "h2",
        text: "Why infrastructure as code",
      },
      {
        type: "p",
        text: "Clicking a console produces an account nobody can review and nobody can rebuild. Infrastructure as code puts the intended shape in files. Changes go through review. A second environment is the same definition with different inputs, not a memory of what someone clicked. The failure mode it targets is drift: the live system no longer matches the last thing a human thought they configured.",
      },
      {
        type: "ul",
        items: [
          "Reviewable change: a pull request shows the subnet, the policy, or the bucket setting before it exists.",
          "Repeatability: dev and prod start from the same modules, with different state and different variables.",
          "Drift becomes visible: the next plan reports what the console changed outside the files.",
        ],
      },
      {
        type: "h2",
        text: "Declarative, not a script of clicks",
      },
      {
        type: "p",
        text: "Terraform is declarative. You write the desired end state. Terraform reads that state, compares it with the last state it recorded, and builds a plan of creates, updates, and deletes. An imperative script says 'run these API calls in order' and does not know what already exists. You still need ordering. Terraform builds a graph. Referencing another resource's attribute is enough to order the two. An explicit depends_on is for a dependency the graph cannot see, such as a policy attachment that nothing else references.",
      },
      {
        type: "diagram",
        id: "terraform",
      },
      {
        type: "h2",
        text: "The language, in one pass",
      },
      {
        type: "ul",
        items: [
          "Provider: the plugin that talks to an API. hashicorp/random and hashicorp/local talk to nothing in a cloud. hashicorp/aws talks to AWS.",
          "Resource: something Terraform creates and then owns.",
          "Data source: a read of something that already exists. It does not create that thing.",
          "Variable: an input. Declare it, and pass values with a tfvars file, an environment variable, or a prompt.",
          "Local: a named expression inside the module, to avoid repeating yourself.",
          "Output: a value printed after apply and available to other configurations. Sensitive outputs are still stored in state.",
          "Module: a reusable folder of the above, with its own inputs and outputs. Do not wrap every resource on day one.",
        ],
      },
      {
        type: "h2",
        text: "State is the map, and it can hold secrets",
      },
      {
        type: "p",
        text: "terraform.tfstate is the source of truth for which real object belongs to which address in the configuration. Without it, Terraform cannot tell an update from a create. State stores attribute values, including passwords and access material a provider returns. Treat the file like a credential. Keep it in a remote backend with encryption and locking, not on a laptop and not in git. A common backend is an S3 bucket with versioning and encryption. Older Terraform releases locked that bucket with a DynamoDB table. Terraform 1.10 and later can lock with an S3 lock file (use_lockfile) so the extra table is optional. Confirm the behavior for the version you install. Locking matters because two applies at once corrupt the map.",
      },
      {
        type: "p",
        text: "Workspaces look like environments and are not a full strategy. They are separate state names sharing one backend configuration and usually one set of credentials. A wrong variable and the wrong workspace is how a lab plan touches production. Prefer a separate state key, and ideally a separate account, per environment.",
      },
      {
        type: "callout",
        tone: "danger",
        title: "Do not commit state or secret tfvars",
        text: "Never commit terraform.tfstate, terraform.tfstate.backup, or tfvars files that contain secrets. Commit a tfvars example with empty placeholders. A leaked state file is a leaked inventory of ids and often of credentials. The fake account 111122223333 and the fake key id AKIAEXAMPLEINVALID do not belong in state either; they are placeholders so this page does not show real secrets.",
      },
      {
        type: "h2",
        text: "The commands you actually run",
      },
      {
        type: "ol",
        items: [
          "terraform init downloads providers and wires the backend. Run it again when those change.",
          "terraform fmt rewrites layout. terraform validate checks the configuration is internally consistent. Validate does not call the cloud and does not prove the plan is safe.",
          "terraform plan prints the diff. Read it. Every destroy line is a data-loss question.",
          "terraform apply performs that diff. terraform destroy deletes what this state manages.",
          "terraform state mv and terraform state rm are surgery. mv renames an address. rm forgets an object without deleting it, so the next plan may try to create a twin or may leave an orphan. Prefer a moved block in configuration. Back up state first. Do not use them to hide a plan you dislike.",
        ],
      },
      {
        type: "table",
        caption: "What each command is allowed to change. Read the plan before any yes.",
        headers: ["Command", "Touches real infrastructure", "Use it for"],
        rows: [
          ["terraform init", "No", "Providers and the backend"],
          ["terraform fmt", "No", "Canonical layout"],
          ["terraform validate", "No", "Internal consistency, not a preview of the cloud"],
          ["terraform plan", "No", "The diff you are about to approve"],
          ["terraform apply", "Yes", "The reviewed plan only"],
          ["terraform destroy", "Yes, it deletes", "A deliberate teardown, never an undo"],
          ["terraform state rm", "Not immediately", "Forgetting an object. The next plan may recreate it"],
        ],
      },
      {
        type: "callout",
        tone: "tip",
        title: "Always read the plan",
        text: "Apply is not a save button. If the plan destroys a database, a bucket, or a security group that production uses, stop. This page never runs apply against a cloud.",
      },
      {
        type: "h2",
        text: "A local configuration you can actually run",
      },
      {
        type: "p",
        text: "The following configuration uses only hashicorp/random and hashicorp/local. It writes a file on disk. It does not need cloud credentials. Interpolation that would paste the random id into the file is omitted on purpose; the random resource still exists so you can see it in the plan. Add a normal reference later if you want the id in the file. This snippet is illustrative and was not executed to produce this lesson.",
      },
      {
        type: "code",
        lang: "hcl",
        title: "Local-only Terraform",
        code: `terraform {
  required_version = ">= 1.6.0"

  required_providers {
    random = {
      source  = "hashicorp/random"
      version = "~> 3.6"
    }
    local = {
      source  = "hashicorp/local"
      version = "~> 2.5"
    }
  }
}

resource "random_id" "suffix" {
  byte_length = 4
}

resource "local_file" "note" {
  filename = "atlas-note.txt"
  content  = "DevOps Atlas local Terraform example. No cloud resources."
}

output "note_path" {
  value = local_file.note.filename
}`,
        note: "Illustrative configuration. This page does not run Terraform. Pin provider versions you have reviewed; the constraints above are teaching pins, not a claim that they are the newest releases.",
      },
      {
        type: "h2",
        text: "Drift",
      },
      {
        type: "p",
        text: "Drift is any live change Terraform did not make: a console edit, a hotfix, an auto-remediation you forgot about. The next plan shows it as an update that would put the resource back, or as a difference you did not expect. If the console change was right, encode it and plan again. If it was not, apply to restore the reviewed configuration. Ignoring a noisy plan trains everyone to approve destroys.",
      },
      {
        type: "h2",
        text: "An AWS sketch you should not apply from this page",
      },
      {
        type: "p",
        text: "The next snippet shows an S3 bucket with all public access blocked, and a second bucket with prevent_destroy so a casual destroy cannot delete it. References use attribute names directly, which is normal Terraform, so the block does not need string interpolation. Do not apply this unless you intend to create a billed resource. This page does not apply it. Bucket names are global; the names below are examples and will fail or, worse, collide if you apply them unchanged. S3 storage, requests, and leftover buckets cost money. Free tier is limited. Set a billing alarm and delete what you create in any real account. This website never creates cloud resources.",
      },
      {
        type: "code",
        lang: "hcl",
        title: "Do not apply: S3 public access block and prevent_destroy",
        code: `# Do not apply unless you intend to create a billed resource.
# This page does not apply this configuration.
# Replace the bucket names. Do not commit state or secrets.

resource "aws_s3_bucket" "assets" {
  bucket = "example-atlas-do-not-apply"
}

resource "aws_s3_bucket_public_access_block" "assets" {
  bucket                  = aws_s3_bucket.assets.id
  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

resource "aws_s3_bucket" "kept" {
  bucket = "example-atlas-kept-do-not-apply"

  lifecycle {
    prevent_destroy = true
  }
}`,
        note: "Illustrative. prevent_destroy blocks terraform destroy until you remove the flag in a reviewed change. It does not stop someone with console admin from deleting the bucket.",
      },
    ],
    exercise: {
      title: "Apply only the local provider",
      prompt:
        "Create a directory and apply the random plus local_file example. Do not add the AWS provider. Do not create cloud resources.",
      steps: [
        "Install Terraform from the official distribution if you do not already have it. Confirm the version is at least 1.6.",
        "Write the local-only configuration from this lesson into main.tf. Keep the provider list to hashicorp/random and hashicorp/local.",
        "Run terraform init, then terraform fmt, then terraform validate.",
        "Run terraform plan and read every line. You should see a random id and a local file, and no AWS resources.",
        "Run terraform apply. Open the generated text file and confirm it contains no credentials.",
        "Run terraform apply a second time and confirm the plan is empty.",
        "Add terraform.tfstate, terraform.tfstate.backup, and atlas-note.txt to a local gitignore if the folder is a git repo. Do not commit state.",
        "Run terraform destroy so you are not surprised by a leftover file later.",
      ],
      criteria: [
        "The plan's resource list is only random_id.suffix and local_file.note.",
        "No AWS, Azure, or Google Cloud provider is in the directory.",
        "State files are gitignored.",
        "The note file contains no access key and no account secret.",
        "You can explain why validate is not a substitute for reading the plan.",
      ],
    },
    checks: [
      {
        q: "What problem does the state file solve?",
        a: "It maps each resource address in the configuration to the real object id Terraform created. Without that map, Terraform cannot plan an update instead of a second create. The file can also contain secrets, so it is not safe in git.",
      },
      {
        q: "Why is a Terraform workspace not enough to separate production?",
        a: "Workspaces are separate state names that usually share one backend and one set of credentials. A bad selection or a shared default variable can plan against the wrong environment. Separate state per environment, ideally in separate accounts, is the stronger boundary.",
      },
      {
        q: "What is the difference between terraform validate and terraform plan?",
        a: "Validate checks that the configuration is internally consistent. Plan compares that configuration with state and with the provider and shows the creates, changes, and destroys. Only the plan tells you what would happen to real objects.",
      },
      {
        q: "What does terraform state rm do, and why is it dangerous?",
        a: "It removes an object from state without deleting it. Terraform then forgets it owns the object. The next plan may create a duplicate or leave an orphaned resource that you still pay for. Back up state and prefer a moved block.",
      },
    ],
    interview: [
      {
        q: "Why do teams insist on a remote backend with locking?",
        a: "State is the inventory of real resource ids, and it often contains secrets, so a copy on one laptop will be stale or leaked. A remote backend gives one shared map with encryption and versioning. Locking stops two applies from writing that map at the same time, which corrupts the inventory and leads to destroyed or duplicated infrastructure. S3 with encryption and a lock, either DynamoDB or the newer S3 lock file depending on your Terraform version, is the usual AWS shape.",
      },
      {
        q: "A plan shows a change you did not make. What do you do?",
        a: "That is drift. I do not apply blindly and I do not dismiss the plan. I find out who changed the live object and whether that change should win. If it should, I encode it and plan again until the diff matches intent. If it should not, the apply puts the reviewed configuration back. I also check that I am in the right state and the right account before either choice.",
      },
      {
        q: "When do you write depends_on?",
        a: "Most of the time I do not. Referencing an attribute builds the edge in the graph, so a public access block that reads the bucket id already waits for the bucket. I add depends_on when the dependency is invisible, for example a service that assumes a role only after a policy attachment exists, and the service resource never mentions that attachment. Extra depends_on slows the graph and hides the real data flow, so it is not a default.",
      },
    ],
    takeaways: [
      "Terraform plans a diff from declared intent plus state. Read the plan before apply.",
      "State maps addresses to real ids, can contain secrets, and needs a locked remote backend.",
      "Separate state per environment. Workspaces are not that boundary.",
      "Use state mv, state rm, and destroy only with a backup and a reason.",
      "Practice with the local and random providers. An AWS bucket sketch on this page is not an invitation to apply.",
    ],
  },
  {
    slug: "ansible-fundamentals",
    title: "Ansible fundamentals",
    status: "full",
    blocks: [
      {
        type: "h2",
        text: "Configuration management, not provisioning",
      },
      {
        type: "p",
        text: "Ansible logs into machines and brings them toward a described setup. It is how you install nginx, drop a config file, and restart a service. Terraform creates the machine, the network, and the cloud record. Using Ansible to create a VPC, or Terraform to template every file inside a guest, fights the tool. Many stacks use both: Terraform for the cloud, Ansible or an image build for the OS.",
      },
      {
        type: "table",
        caption: "Provisioning versus configuration management.",
        headers: ["", "Terraform", "Ansible"],
        rows: [
          ["Primary job", "Create and change cloud resources", "Configure operating systems and apps"],
          ["Style", "Declarative graph and a stored state map", "A list of tasks, aimed at idempotent modules"],
          ["How it remembers", "State file mapping addresses to ids", "It inspects the host on each run; there is no second cloud state"],
          ["Typical transport", "Cloud API", "SSH or WinRM"],
        ],
      },
      {
        type: "h2",
        text: "Inventory, playbook, tasks, modules",
      },
      {
        type: "p",
        text: "An inventory lists hosts and groups. A playbook maps plays to those groups. Each play is a list of tasks. A task calls a module, such as ansible.builtin.apt, ansible.builtin.copy, ansible.builtin.template, or ansible.builtin.service. Variables come from group_vars, host_vars, the play, or extra vars. Extra vars override most other sources. Do not pass secrets as extra vars on the command line; they land in shell history and in the process list.",
      },
      {
        type: "code",
        lang: "ini",
        title: "A tiny inventory",
        code: `[web]
web-1.lab.example

[web:vars]
http_port=80`,
        note: "Illustrative. lab.example is a reserved documentation name, not a server you should own or scan.",
      },
      {
        type: "h2",
        text: "Handlers, templates, and roles",
      },
      {
        type: "p",
        text: "A handler is a task that runs at the end of the play, and only if some task notified it after reporting a change. That is how a config copy reloads nginx once, not on every run. The copy module writes the bytes you give it. The template module renders a Jinja file from variables, which is what you want when one setting differs per host. A role is a folder convention (tasks, handlers, templates, defaults) so a playbook can say 'apply the nginx role' instead of inlining fifty tasks. Start with one playbook. Extract a role when a second playbook needs the same tasks.",
      },
      {
        type: "h2",
        text: "Idempotency",
      },
      {
        type: "p",
        text: "A module is idempotent when a second run, with the same inputs, changes nothing and reports ok. ansible.builtin.apt with state present installs nginx if it is missing and does nothing if it is already there. A raw shell that always runs the package manager is harder to trust: it often reports changed every time, and a failed halfway command is your problem. Prefer the module. If you must use ansible.builtin.command, constrain it with creates or changed_when so a repeat run tells the truth.",
      },
      {
        type: "code",
        lang: "yaml",
        title: "Anti-pattern: shell where a module exists",
        code: `- name: Do not ship this
  ansible.builtin.shell: apt-get install -y nginx
  changed_when: true`,
        note: "Anti-pattern. changed_when true forces a change report on every run. Use ansible.builtin.apt instead.",
      },
      {
        type: "h2",
        text: "A playbook that will change a real server if you run it",
      },
      {
        type: "p",
        text: "This play installs nginx and writes a page. It is illustrative. It was not run against a host while writing this lesson. If your inventory points at a real machine and you run ansible-playbook without a check flag, that machine will change.",
      },
      {
        type: "code",
        lang: "yaml",
        title: "Install nginx and publish a page",
        code: `---
- name: Install nginx and publish a static page
  hosts: web
  become: true
  tasks:
    - name: Install nginx
      ansible.builtin.apt:
        name: nginx
        state: present
        update_cache: true

    - name: Publish the page
      ansible.builtin.copy:
        dest: /var/www/html/index.html
        mode: "0644"
        content: |
          <!DOCTYPE html>
          <html>
            <body><h1>DevOps Atlas</h1></body>
          </html>
      notify: Reload nginx

  handlers:
    - name: Reload nginx
      ansible.builtin.service:
        name: nginx
        state: reloaded`,
        note: "Illustrative playbook. Running it against a real inventory installs packages and writes files. This page does not run it.",
      },
      {
        type: "h2",
        text: "Check mode, host keys, and Vault",
      },
      {
        type: "p",
        text: "ansible-playbook playbook.yml --syntax-check parses the file and does not connect. ansible-playbook playbook.yml --check asks modules to report what they would change. Check mode is a dry run, not a promise: a few modules do not support it and a few still have side effects. Read the module docs before you trust a check run on a production fleet.",
      },
      {
        type: "p",
        text: "Ansible verifies SSH host keys. If a key changed, find out why. A reinstall explains it. A surprise redirect does not. Do not disable host key checking to silence the error. That setting trains the tool to accept a different machine than the one you meant.",
      },
      {
        type: "callout",
        tone: "warn",
        title: "Secrets and real hosts",
        text: "Ansible Vault can encrypt a variable file. This lesson does not walk through vault passwords. Do not commit a vault password, and do not put a plaintext secret in group_vars. Do not point the sample inventory at a server you care about. A real run will change that server.",
      },
      {
        type: "callout",
        tone: "info",
        title: "Cloud accounts are out of scope here",
        text: "You do not need AWS, Azure, or Google Cloud to learn Ansible. If a later lab creates a VM, free tier is limited, the VM costs money, you should set a billing alarm, and you should delete it. This website never creates cloud resources.",
      },
    ],
    exercise: {
      title: "Syntax-check a playbook locally",
      prompt:
        "Write the inventory and the nginx playbook on disk and syntax-check them. Do not aim them at a server you care about.",
      steps: [
        "Create a folder with the inventory and the playbook from this lesson. Leave the host name on lab.example.",
        "If Ansible is installed, run ansible-playbook playbook.yml --syntax-check from that folder.",
        "Read the play and mark which task would report changed on the second run if the package and the file were already correct. The expected answer is neither, if the handlers only reload after a real change.",
        "Do not set host_key_checking to false. Do not add a production IP to the inventory.",
        "Optional and only on a disposable local VM you can reimage: run with --check --diff first, then a real run, then a second run that should report ok. Skip this step if you do not have such a VM.",
      ],
      criteria: [
        "The playbook uses ansible.builtin.apt, copy, and a handler, not a raw apt-get shell.",
        "syntax-check passes, or you documented that Ansible is not installed and the YAML is still the one from the lesson.",
        "No inventory line points at a host you are not willing to reimage.",
        "Host key checking is still enabled in any ansible.cfg you created.",
        "No vault password or cloud key appears in the folder.",
      ],
    },
    checks: [
      {
        q: "Why is the apt module preferred over shell apt-get install?",
        a: "The apt module converges. A second run with the package present changes nothing. A shell task usually reports changed every time and makes handlers and reviews lie.",
      },
      {
        q: "When does a handler run?",
        a: "At the end of the play, and only after a task notifies it because that task reported a change. A clean second run does not reload nginx.",
      },
      {
        q: "What does ansible-playbook --check do, and what does it not do?",
        a: "It asks modules to simulate changes. It is not a syntax check, and it is not proof that every module is side-effect free. --syntax-check only parses.",
      },
      {
        q: "Why is disabling host key checking a bad fix?",
        a: "The warning means the machine you reached is not the machine you trusted last time. Turning the check off accepts whatever answers on that address, including an impostor.",
      },
    ],
    interview: [
      {
        q: "How do you split work between Terraform and Ansible?",
        a: "Terraform owns resources with a cloud API and a state map: VPC, instance, security group, load balancer, bucket. Ansible owns the inside of a long-lived machine: packages, config files, services. Image builds can take some of Ansible's job so instances boot already correct. I do not manage security group rules from a playbook if Terraform already owns them, because two writers drift.",
      },
      {
        q: "What does idempotent mean on a real play?",
        a: "Running it twice is safe, and the second run reports ok for tasks that were already satisfied. I get that by using modules with a desired state, notifying handlers instead of restarting every time, and refusing shell tasks that force changed. I prove it by running the play twice on a disposable host and reading the recap.",
      },
      {
        q: "Where do secrets go in an Ansible repo?",
        a: "Not in plaintext group_vars, and not on the command line. Ansible Vault or an external secret store holds them. The vault password is outside git. A playbook in this lesson does not include a worked vault setup because the failure mode is committing the password next to the encrypted file and calling it done.",
      },
    ],
    takeaways: [
      "Ansible configures hosts. Terraform provisions cloud resources. Do not swap them casually.",
      "Inventory, plays, tasks, and modules are the whole execution path.",
      "Prefer idempotent modules. A shell install that always reports changed is a defect.",
      "Handlers run after a real change. Check mode is a dry run, not a guarantee.",
      "Do not disable host key checking, and do not commit secrets next to the playbook.",
    ],
  },
  {
    slug: "iac-safety",
    title: "Infrastructure change safety",
    status: "primer",
    blocks: [
      {
        type: "h2",
        text: "The plan is the change",
      },
      {
        type: "p",
        text: "A green CI job that posts a Terraform plan is useful only if someone reads the destroys, the security-group replacements, and the account the plan targets. Validate and fmt do not do that. Approve a specific plan, then apply that plan, rather than running apply later against whatever the default branch has become.",
      },
      {
        type: "h2",
        text: "Least privilege for the runner",
      },
      {
        type: "p",
        text: "The identity that runs apply should be able to change the resources in this state and nothing else. AdministratorAccess on a laptop, reused for labs and production, is how a tutorial bucket lands in the production account. Prefer a CI job that assumes a role through workload identity federation, scoped to one account and one state. Humans approve. Humans do not keep long-lived admin keys in ~/.aws/credentials for daily apply.",
      },
      {
        type: "callout",
        tone: "danger",
        title: "Do not apply from a laptop admin key",
        text: "Break-glass access can exist. It should be rare, logged, and short-lived. The habit of terraform apply on a workstation with an admin access key is how state, secrets, and the wrong account meet. The fake key id AKIAEXAMPLEINVALID is not a credential. Do not invent a real one to follow this primer.",
      },
      {
        type: "h2",
        text: "Policy, backups, and the cost of destroy",
      },
      {
        type: "ul",
        items: [
          "Policy as code is a test in front of the plan: tools such as Conftest, Checkov, tfsec, or Trivy can reject a world-open admin port or an unencrypted bucket. They do not replace reading the plan.",
          "Version the state backend and restrict who can read it. State is a backup of the identity map and often of secrets. Practice a restore before you need one.",
          "Keep production state separate from every sandbox. A workspace name on one backend is not that separation.",
          "terraform destroy deletes what the state owns, including databases, unless prevent_destroy or a lifecycle exception stops it. Destroy is not an undo button for a bad afternoon.",
          "Separate state for data and for the network so a VPC rebuild is not also a database drop.",
        ],
      },
      {
        type: "h2",
        text: "cloud-init and Ansible do different jobs",
      },
      {
        type: "p",
        text: "cloud-init runs at first boot from instance user-data. Use it to set a hostname, write a one-time bootstrap, or pull the first config agent. It is not a convergence loop. If someone edits the server next week, cloud-init will not put it back. Ansible, or a rebuilt image, is how ongoing configuration stays true. Do not hide a long-lived configuration only in user-data that no second run will correct.",
      },
      {
        type: "callout",
        tone: "warn",
        title: "Billed resources",
        text: "A plan that says it will create a NAT gateway, a load balancer, or a database will spend money if you apply it. Free tier is limited. Set a billing alarm. Delete what you create. This website never applies plans and never creates cloud resources.",
      },
      {
        type: "h3",
        text: "A safe default loop",
      },
      {
        type: "ol",
        items: [
          "Change the files. Run fmt and validate locally.",
          "Open a pull request. CI runs plan with a read-mostly role and posts the diff.",
          "A human reads destroys, replacements, and IAM changes.",
          "The protected job assumes a narrow role and applies the reviewed plan.",
          "State stays in the locked backend. Nobody copies it to a laptop to 'fix it quickly'.",
        ],
      },
    ],
    exercise: null,
    checks: [
      {
        q: "Why is terraform apply from a laptop with an admin key a bad habit?",
        a: "The key is long-lived, the account is easy to get wrong, and there is no record that a second person saw the plan. A CI role scoped to one state, with a human approval, keeps the blast radius smaller.",
      },
      {
        q: "What does cloud-init not replace?",
        a: "Ongoing configuration management. It runs at first boot. Later drift is Ansible's job, or a new image, not another hope that user-data will run again.",
      },
    ],
    interview: [
      {
        q: "What do you check before approving a Terraform apply?",
        a: "I read the plan, not the summary line. I look for destroys, forces-replacement on stateful resources, security groups open to the world, and IAM actions with a star. I confirm the backend and the account. I want a policy-as-code check to have already failed the obvious mistakes, a versioned state backend, and a runner role that cannot touch a different environment. If the plan deletes data, the answer is no until there is a snapshot and a written reason.",
      },
    ],
    takeaways: [
      "Approve a specific plan. fmt and validate are not that review.",
      "The apply identity should be a narrow CI role, not a laptop admin key.",
      "Destroy deletes real data. Back up state, and use cloud-init only for first boot.",
    ],
  },
];
