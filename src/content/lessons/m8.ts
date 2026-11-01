import type { Lesson } from "../types";

export const lessons: Lesson[] = [
  {
    slug: "aws-core-services",
    title: "AWS core services",
    status: "full",
    blocks: [
      {
        type: "h2",
        text: "Shared responsibility",
      },
      {
        type: "p",
        text: "AWS operates the cloud. You operate what you put in it. AWS is responsible for the facilities, hardware, hypervisor, and the managed parts of each service. You are responsible for data, identity, network exposure, and the configuration of every resource you create. The split moves as you climb the stack. On Amazon EC2 you patch the guest operating system and your application. On a managed service such as Amazon S3 or AWS Lambda, AWS runs more of the platform, and you still own the data, the IAM policy, and the settings that make the service public or private.",
      },
      {
        type: "ul",
        items: [
          "Security of the cloud: physical sites, host hardware, and the service control plane. That is AWS.",
          "Security in the cloud: accounts, policies, encryption choices, security groups, application code, and customer data. That is you.",
          "A managed service does not review your bucket policy or your security group. Misconfiguration is still a customer incident.",
        ],
      },
      {
        type: "callout",
        tone: "warn",
        title: "Cost and what this site will not do",
        text: "The AWS free tier is limited, time-boxed, and easy to leave. Regions, NAT gateways, public IPv4 addresses, load balancers, and idle disks cost money. Set a billing alarm before you experiment in a real account, and delete what you create. This website never creates cloud resources and never asks you to paste credentials.",
      },
      {
        type: "h2",
        text: "Regions and Availability Zones",
      },
      {
        type: "p",
        text: "A Region is a separate geographic area, such as us-east-1, with its own API endpoints and mostly independent failure domain. An Availability Zone is one or more discrete data centers inside that Region, with independent power and networking, linked to the other zones by low-latency private links. You choose a Region for latency to users, data-residency rules, service availability, and price. You use at least two Availability Zones for anything that must survive the loss of one zone. Names such as us-east-1a are not the same physical zone in every AWS account, so do not treat the letter as a global identity.",
      },
      {
        type: "h2",
        text: "IaaS, PaaS, and SaaS",
      },
      {
        type: "table",
        caption: "How much of the stack you still operate. Boundaries are teaching labels, not billing categories.",
        headers: ["Model", "You still own", "Provider typically owns", "AWS example"],
        rows: [
          [
            "IaaS",
            "Guest OS, runtime, application, data, firewall rules",
            "Hardware, hypervisor, host network",
            "Amazon EC2",
          ],
          [
            "PaaS",
            "Application code, data, and access policy",
            "OS patching, runtime platform, much of the scaling machinery",
            "AWS Elastic Beanstalk; Amazon RDS is the same idea for a database engine",
          ],
          [
            "SaaS",
            "Users, data you upload, and tenant settings",
            "The whole application",
            "Amazon QuickSight as a vendor-hosted analytics app",
          ],
        ],
      },
      {
        type: "h2",
        text: "IAM: users, roles, and policies",
      },
      {
        type: "p",
        text: "IAM decides who can call which API on which resource. A policy is a JSON document of Allow and Deny statements. Users, groups, and roles do nothing until a policy is attached. Least privilege means the policy names the actions and the resource ARNs the workload actually needs, not a star for every action in the account.",
      },
      {
        type: "ul",
        items: [
          "IAM user: a long-lived identity for a person. Prefer IAM Identity Center (SSO) so humans do not keep passwords and keys in the account.",
          "IAM role: an identity that issues temporary credentials when it is assumed by a person, an AWS service, or a workload. EC2 uses an instance profile to deliver a role to the instance.",
          "Policy: the permission document. Identity-based policies attach to users and roles. Resource-based policies, such as an S3 bucket policy, attach to the resource.",
          "Temporary credentials come from AWS STS. They expire. A leaked short-lived token is a smaller window than a leaked access key.",
        ],
      },
      {
        type: "callout",
        tone: "danger",
        title: "Long-lived access keys",
        text: "An access key such as the obvious fake AKIAEXAMPLEINVALID does not expire. People copy keys into shell history, CI logs, laptops, and git. The key keeps working until someone notices and deactivates it. Do not create keys for day-to-day admin. Do not echo keys, paste them into tickets, or commit them. Humans use SSO. Workloads use roles. The account id 111122223333 used in examples on this page is a documentation placeholder, not a real account.",
      },
      {
        type: "code",
        lang: "json",
        title: "Least-privilege identity policy sketch",
        code: `{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "ReadOneExampleBucket",
      "Effect": "Allow",
      "Action": ["s3:ListBucket"],
      "Resource": "arn:aws:s3:::example-atlas-assets"
    },
    {
      "Sid": "ReadObjectsInThatBucket",
      "Effect": "Allow",
      "Action": ["s3:GetObject"],
      "Resource": "arn:aws:s3:::example-atlas-assets/*"
    }
  ]
}`,
        note: "Illustrative policy. It is not attached to any account. ListBucket belongs on the bucket ARN; GetObject belongs on the object ARN.",
      },
      {
        type: "h2",
        text: "EC2, images, and the two firewalls",
      },
      {
        type: "p",
        text: "Amazon EC2 is a virtual machine. An AMI is the image it boots: operating system plus whatever was baked in. An instance type is a fixed bundle of vCPU, memory, network, and sometimes local disk or a GPU. Key pairs are an SSH public key registered with EC2 and a private key you hold. Prefer AWS Systems Manager Session Manager over opening SSH. If you do use SSH, the private key is not an account password and it is not a reason to allow the world to reach port 22.",
      },
      {
        type: "p",
        text: "A security group is a stateful virtual firewall on the elastic network interface. If you allow an inbound connection, the return traffic is allowed without a matching outbound rule. A network ACL is stateless and sits on the subnet. It evaluates numbered rules in order, and you must allow both directions, including ephemeral return ports. Security groups are the tool you use every day. NACLs are a coarse extra gate, not a substitute for a tight security group.",
      },
      {
        type: "table",
        caption: "Security group versus network ACL.",
        headers: ["", "Security group", "Network ACL"],
        rows: [
          ["Attached to", "Network interface (the instance or load balancer)", "Subnet"],
          ["State", "Stateful. Return traffic is automatic.", "Stateless. You allow both directions."],
          ["Rule match", "All matching allows apply. A deny is expressed by the absence of an allow.", "Numbered rules, first match wins, explicit deny is possible."],
          ["Typical use", "Allow the app port only from the load balancer security group.", "Optional subnet-level deny of a known bad range."],
        ],
      },
      {
        type: "code",
        lang: "text",
        title: "Anti-pattern: SSH open to the internet",
        code: `IpProtocol: tcp
FromPort: 22
ToPort: 22
CidrIp: 0.0.0.0/0`,
        note: "Anti-pattern only. Do not add this rule. Admin access should be SSM Session Manager, or SSH from a named bastion or VPN security group, never from the whole internet.",
      },
      {
        type: "h2",
        text: "VPC: subnets, routes, IGW, and NAT",
      },
      {
        type: "p",
        text: "A VPC is your private network in one Region, with an address range you choose, such as 10.0.0.0/16. Subnets are slices of that range and each subnet lives in one Availability Zone. A route table decides the next hop. A public subnet is not public because of its name. It is public because its route table sends 0.0.0.0/0 to an internet gateway and the instances have public IPs or sit behind a load balancer that does. A private subnet has no route to the internet gateway.",
      },
      {
        type: "p",
        text: "An internet gateway is the VPC's door to the public internet. The gateway itself has no hourly charge; data transfer still does. A NAT gateway sits in a public subnet so instances in a private subnet can open outbound connections without accepting inbound ones. A NAT gateway is billed every hour it exists, plus a charge per gigabyte processed, and it belongs to one Availability Zone. Two zones of high availability means two NAT gateways if you want egress to survive a zone loss. That cost is the usual surprise in a first VPC.",
      },
      {
        type: "diagram",
        id: "vpc",
      },
      {
        type: "ul",
        items: [
          "Public route table: 10.0.0.0/16 local, and 0.0.0.0/0 target the internet gateway.",
          "Private route table: 10.0.0.0/16 local, and 0.0.0.0/0 target the NAT gateway in the same zone.",
          "App instances do not get public IPv4 addresses. They receive traffic only from the load balancer security group.",
          "Database instances stay in private subnets, with no public IP and a security group that allows the database port only from the application security group.",
        ],
      },
      {
        type: "h2",
        text: "A three-tier web application",
      },
      {
        type: "p",
        text: "Picture a shop in one Region and two Availability Zones. In the public subnets, an Application Load Balancer accepts HTTPS from the internet. The load balancer is the only intended public entry; a later lesson covers listeners and target groups. In the private application subnets, EC2 instances or containers run the application and register with the load balancer. In the private data subnets, Amazon RDS holds the database. This lesson does not configure RDS. The point of the picture is the path: internet, load balancer, application, database, and no shortcut from the internet to the database.",
      },
      {
        type: "diagram",
        id: "aws",
      },
      {
        type: "h2",
        text: "S3",
      },
      {
        type: "p",
        text: "S3 is object storage. A bucket name is globally unique and the bucket itself is created in one Region. New buckets start with Block Public Access enabled and with ACLs disabled (bucket-owner-enforced object ownership), so there is no public ACL by default. Keep all four Block Public Access settings on unless you have a reviewed reason to turn one off. A bucket policy can still grant public reads if Block Public Access is disabled, so the block is the guardrail, not a comment in a diagram. New objects are encrypted with SSE-S3 by default. Choose SSE-KMS when you need a customer-managed key and an audit trail of key use. Encryption does not replace an IAM policy: a principal who is allowed to GetObject can read the plaintext.",
      },
      {
        type: "h2",
        text: "CloudWatch",
      },
      {
        type: "p",
        text: "CloudWatch is the first place AWS records the health of your resources. Metrics are numeric time series, such as CPU utilization or a custom request counter. Logs are log groups and streams from applications, VPC flow logs, or Lambda. An alarm watches a metric for a threshold over several evaluation periods and can notify an SNS topic. Alarms have three states: OK, ALARM, and INSUFFICIENT_DATA. Treat missing data as a design choice, not as success. Billing metrics, if you enable them, are published in us-east-1 even when your workload is somewhere else.",
      },
      {
        type: "h2",
        text: "The CLI, named profiles, and quiet credentials",
      },
      {
        type: "p",
        text: "The AWS CLI reads a named profile from the local config files. Scripts should pass both the profile and the Region so a default profile in another account is not the one that gets changed. Never print access keys to confirm a profile. sts get-caller-identity shows the account and the principal without displaying a secret.",
      },
      {
        type: "code",
        lang: "bash",
        title: "Call one profile in one Region",
        code: `aws sts get-caller-identity --profile atlas-lab --region us-east-1`,
        note: "Illustrative output — not captured from a live run in this environment.\n{\n  \"UserId\": \"AROAEXAMPLEINVALID:atlas-lab\",\n  \"Account\": \"111122223333\",\n  \"Arn\": \"arn:aws:sts::111122223333:assumed-role/AtlasLab/atlas-lab\"\n}\nAccount 111122223333 and the ids above are fakes.",
      },
      {
        type: "callout",
        tone: "tip",
        title: "Do not echo keys",
        text: "Do not cat or echo credential files to debug the CLI. Do not commit ~/.aws/credentials. Do not set a secret access key in a shell command that will be saved in history. If a key was printed in a log, deactivate it and assume it is compromised.",
      },
      {
        type: "h2",
        text: "What keeps billing after the demo",
      },
      {
        type: "ul",
        items: [
          "NAT gateway: hourly charge plus data processing, per Availability Zone where you place one.",
          "Load balancer: an ALB or NLB bills hourly even when it has no traffic, plus capacity units.",
          "Unused EBS volumes: DeleteOnTermination is not always set, so a terminated instance can leave a billed disk.",
          "Public IPv4: in-use public addresses, including addresses on NAT gateways and load balancers, are billed.",
        ],
      },
    ],
    exercise: {
      title: "Design the three-tier network locally",
      prompt:
        "Write a one-page design for a two-AZ web app. Do not call AWS. Do not create resources. The page is a local file only.",
      steps: [
        "Pick one Region and two Availability Zones and write one sentence on latency or data residency, not on a guess.",
        "Sketch public, private application, and private data subnets in both zones. Mark the internet gateway, one NAT gateway per zone, and which route table sends default traffic where.",
        "Write three security group intentions: listeners on the load balancer from the internet on 443 only, the application port only from the load balancer security group, and the database port only from the application security group.",
        "Save a local JSON file with the least-privilege S3 policy shape from this lesson, aimed at a made-up bucket name. No stars in Action or Resource.",
        "List hourly costs hiding in the design: NAT gateways, the load balancer, public IPv4, and any disk that would survive instance termination.",
        "Put a banner on the page: free tier is limited, these resources cost money, set a billing alarm before any real account work, delete what you create, and this website never creates cloud resources.",
      ],
      criteria: [
        "The database subnet has no route to the internet gateway and no public address.",
        "Port 22 from 0.0.0.0/0 does not appear, even as a maybe.",
        "The IAM JSON allows only list and get on one bucket, with the bucket ARN and the object ARN separated.",
        "The cost list names NAT gateway and public IPv4.",
        "You did not need an access key to finish.",
      ],
    },
    checks: [
      {
        q: "Who patches the guest operating system on an EC2 instance?",
        a: "You do. AWS patches the host and hypervisor. The guest OS, the application, and the security group are in the customer's half of the shared-responsibility model.",
      },
      {
        q: "Why is a NAT gateway a common surprise on the bill?",
        a: "It is billed for every hour it exists and for data processed through it. It is also zonal, so a highly available private subnet design usually runs one per Availability Zone.",
      },
      {
        q: "How does a security group differ from a network ACL?",
        a: "A security group is stateful and attaches to a network interface. A network ACL is stateless, attaches to a subnet, and needs explicit rules for both directions.",
      },
      {
        q: "What should a human use instead of a long-lived access key?",
        a: "IAM Identity Center or another federation path that assumes a role and issues temporary credentials. Access keys do not expire and are easy to leak into git and logs.",
      },
    ],
    interview: [
      {
        q: "Explain the shared responsibility model with EC2 and S3.",
        a: "AWS secures the infrastructure that runs the services. On EC2 that means the hardware, the hypervisor, and the host network, while the customer patches the AMI's guest OS, configures security groups, and protects application credentials. On S3, AWS runs the storage platform and encrypts objects when you select or accept a server-side encryption mode, but the customer writes the bucket policy, keeps Block Public Access on, and decides who may call GetObject. The practical test is: if a setting in your account can expose the data, it is your responsibility.",
      },
      {
        q: "Why prefer an IAM role over an access key on an instance?",
        a: "A role vended through an instance profile gives the instance temporary credentials that rotate and expire. An access key on disk is long-lived, gets copied into images, and remains valid after the instance is gone until someone deactivates it. The instance should also require IMDSv2 so a simple SSRF bug cannot read the metadata service as easily. People should not use keys either: they should assume a role through SSO.",
      },
      {
        q: "Walk through a three-tier VPC and where you would not use 0.0.0.0/0.",
        a: "Two public subnets hold an internet-facing load balancer and the NAT gateways, with a default route to the internet gateway. Two private application subnets hold the app, default route to NAT, no public IP. Two private data subnets hold RDS, with only a local route. 0.0.0.0/0 belongs on the public route table and, for port 443, on the load balancer security group. It does not belong on SSH, on the application port, or on the database. Those rules should name the upstream security group.",
      },
    ],
    takeaways: [
      "AWS runs the cloud; you own identity, data, exposure, and guest configuration.",
      "Use more than one Availability Zone, and remember that a NAT gateway costs money in each zone.",
      "Security groups are stateful; network ACLs are stateless.",
      "Prefer roles and temporary credentials. Long-lived access keys are a standing leak.",
      "Keep S3 Block Public Access on, and delete idle load balancers, volumes, and public addresses.",
    ],
  },
  {
    slug: "aws-scaling-data-dns",
    title: "Scaling, data, and DNS on AWS",
    status: "primer",
    blocks: [
      {
        type: "h2",
        text: "Elastic Load Balancing",
      },
      {
        type: "p",
        text: "Elastic Load Balancing is the family name. You almost always choose an Application Load Balancer or a Network Load Balancer. An ALB is Layer 7. It terminates HTTP and HTTPS, routes by host and path, and sends traffic to target groups of instances, IPs, or Lambda. An NLB is Layer 4. It forwards TCP, UDP, or TLS at very high connection rates, can present a static IP per Availability Zone, and preserves the source address. Use an ALB for a typical web or API front door. Use an NLB when you need raw TCP, a static IP, or extreme throughput. The older Classic Load Balancer is legacy. A later lesson can go into listeners and health checks; this primer only fixes the choice.",
      },
      {
        type: "table",
        caption: "ALB and NLB in one glance.",
        headers: ["", "Application Load Balancer", "Network Load Balancer"],
        rows: [
          ["Layer", "HTTP and HTTPS", "TCP, UDP, TLS"],
          ["Routing", "Host, path, headers", "Port and protocol"],
          ["Typical front door", "Web apps and HTTP APIs", "Non-HTTP services, static IPs, PrivateLink-style patterns"],
        ],
      },
      {
        type: "h2",
        text: "Auto Scaling groups",
      },
      {
        type: "p",
        text: "An Auto Scaling group keeps a desired number of EC2 instances healthy from a launch template. You set minimum, desired, and maximum. It replaces instances that fail EC2 or load-balancer health checks, and it can change desired capacity from a target-tracking policy such as average CPU. It is not a backup, and it will not fix an application that crashes on every boot. Scale the stateless tier. Do not put the only copy of your data on instances that the group is allowed to terminate.",
      },
      {
        type: "h2",
        text: "Route 53 and ACM",
      },
      {
        type: "p",
        text: "Route 53 is DNS. An A or AAAA record points a name at an address. A standard CNAME points a name at another name and cannot sit on the zone apex. An alias record is the AWS extension that can point the apex at an ALB, CloudFront distribution, or similar target. AWS Certificate Manager issues public certificates used by those services. DNS validation is the method to prefer: ACM gives you a CNAME, you publish it, and you leave it in place so automatic renewal can succeed. A certificate on the load balancer does not make the instance safe to reach directly, and it has nothing to do with database exposure.",
      },
      {
        type: "h2",
        text: "RDS availability, replicas, and snapshots",
      },
      {
        type: "p",
        text: "Classic RDS Multi-AZ keeps a synchronous standby in another Availability Zone and fails over to it. That standby is for availability, not for serving your read traffic. A read replica is asynchronous. It can take read load or sit in another Region, and you can promote it, but it can lag. An RDS Multi-AZ DB cluster is a different deployment, with readable standbys; do not mix the two ideas in a design review. Automated backups and manual snapshots are stored until the retention or the snapshot is removed, and a restore creates a new instance. Snapshots are not free forever.",
      },
      {
        type: "ul",
        items: [
          "Put the database in private subnets only.",
          "Leave Publicly accessible set to false. A public address on RDS is not a convenience toggle.",
          "Allow the database port from the application security group, never from 0.0.0.0/0. That CIDR on a database is an anti-pattern.",
          "Decide the final snapshot before you delete an instance. Deleting without one throws the data away.",
        ],
      },
      {
        type: "callout",
        tone: "danger",
        title: "Do not expose the database",
        text: "No public IP, no internet route, no security group open to the world, no admin tool on your laptop connecting across the internet. Use the application tier, a bastion you actually operate, or SSM port forwarding. This website never creates databases.",
      },
      {
        type: "callout",
        tone: "warn",
        title: "These services bill",
        text: "Load balancers bill while idle. Multi-AZ doubles the database instance charge relative to a single instance. Snapshots and cross-AZ data transfer add up. Free tier is limited. Set a billing alarm, delete labs, and do not create any of this from this page.",
      },
    ],
    exercise: null,
    checks: [
      {
        q: "When would you pick an NLB instead of an ALB?",
        a: "When the workload is TCP or UDP, needs a static IP per zone, or needs higher connection performance than HTTP routing. Ordinary HTTPS host and path routing belongs on an ALB.",
      },
      {
        q: "Does classic RDS Multi-AZ give you a readable second database?",
        a: "No. The standby is for synchronous failover. Read scaling is a read replica, which is asynchronous and can lag. A Multi-AZ DB cluster is a separate mode that does have readable standbys.",
      },
    ],
    interview: [
      {
        q: "How do you expose a web app on your own domain without exposing RDS?",
        a: "Alias the domain to an ALB with an ACM certificate validated by DNS. The ALB target group points at the application tier in private subnets, fronted by an Auto Scaling group. RDS stays in private subnets, publicly accessible false, and its security group allows the database port only from the application security group. The certificate and the DNS name are not a reason to open the database.",
      },
    ],
    takeaways: [
      "ALB is HTTP routing; NLB is TCP and static IPs.",
      "An Auto Scaling group replaces unhealthy stateless instances. It is not a datastore.",
      "Use DNS-validated ACM on the load balancer, and never publish the database to the internet.",
    ],
  },
  {
    slug: "aws-containers-lambda-cli",
    title: "Containers, Lambda, and the AWS CLI",
    status: "primer",
    blocks: [
      {
        type: "h2",
        text: "ECR and Docker Hub",
      },
      {
        type: "p",
        text: "A container image has to live in a registry. Amazon ECR is a registry in your AWS account. You authenticate with IAM, you can keep repositories private, you can attach a lifecycle policy so old images do not pile up, and you can reach it through a VPC endpoint so nodes do not pull across the public internet. Docker Hub is a public registry with optional private repositories. It is fine for upstream base images you pin by digest. It is a poor production registry for your own images: anonymous pulls are rate-limited, access is not IAM, and a mutable tag such as latest can change under you. Pin a digest for anything you did not just build.",
      },
      {
        type: "table",
        caption: "Where an image should live.",
        headers: ["", "Amazon ECR", "Docker Hub"],
        rows: [
          ["Auth", "IAM", "Docker account, or anonymous"],
          ["Best fit", "Your built application images", "Public base images you pin"],
          ["Network", "Can stay on a VPC endpoint", "Public endpoint"],
        ],
      },
      {
        type: "h2",
        text: "ECS and EKS",
      },
      {
        type: "p",
        text: "Amazon ECS is AWS's own orchestrator. You write a task definition, run a service, and use either EC2 instances or Fargate. The control plane is AWS-operated and the model is smaller than Kubernetes. Amazon EKS is managed Kubernetes. AWS runs the control plane, and you still operate the cluster: version upgrades, add-ons, node groups or Fargate profiles, RBAC, and the Kubernetes objects themselves. Choose ECS when the workload can live in AWS-native definitions and you want less platform. Choose EKS when you need Kubernetes portability and you have people who will run it. Neither choice removes operations.",
      },
      {
        type: "h2",
        text: "Lambda is not every web app",
      },
      {
        type: "p",
        text: "AWS Lambda runs a function for a single event: an S3 upload, a queue message, a schedule, a short webhook. It fits small automation where you would rather not run a daemon. It is a poor default for every HTTP application. Invocations are limited in time, cold starts show up on sparse traffic, a steady high request rate can cost more than a small container, and opening a database connection per invocation will exhaust the database. Put request-driven product APIs on a long-running service unless the event shape truly matches a function.",
      },
      {
        type: "h2",
        text: "Session Manager instead of public SSH",
      },
      {
        type: "p",
        text: "SSM Session Manager opens a shell through the Systems Manager agent and IAM. There is no inbound port 22 and no internet path to the instance. Sessions can be logged. The instance profile needs the SSM permissions, and the operator needs ssm:StartSession on that instance only, not on every instance in the account. Public SSH is the exception, for a locked-down network, not the default.",
      },
      {
        type: "callout",
        tone: "tip",
        title: "Default admin path",
        text: "Use Session Manager for EC2 shells. Do not recommend a security group that allows SSH from 0.0.0.0/0. That CIDR is the anti-pattern from the core networking lesson.",
      },
      {
        type: "h2",
        text: "Profile and Region on every command",
      },
      {
        type: "p",
        text: "A laptop CLI often has several accounts. Pass --profile and --region on commands that change anything, and on commands you put in notes. The environment variables AWS_PROFILE and AWS_REGION exist; in a script, explicit flags are easier to review than an ambient shell.",
      },
      {
        type: "code",
        lang: "bash",
        title: "Read-only call, profile pinned",
        code: `aws ecr describe-repositories --profile atlas-lab --region us-east-1`,
        note: "Illustrative output — not captured from a live run in this environment. Do not run account-changing commands from this lesson. Account examples use the fake id 111122223333.",
      },
      {
        type: "callout",
        tone: "warn",
        title: "Registries and functions still cost money",
        text: "ECR storage, NAT data while images pull, EKS control planes, and Lambda requests are billed. Free tier is limited. Set a billing alarm and delete repositories and functions you only created to look. This website never creates them.",
      },
    ],
    exercise: null,
    checks: [
      {
        q: "What do you still operate if AWS runs the EKS control plane?",
        a: "Node capacity or Fargate profiles, add-ons, Kubernetes version upgrades, RBAC, and every workload manifest. Managed control plane is not a managed application platform.",
      },
      {
        q: "Why is Session Manager a better default than SSH from the internet?",
        a: "It uses IAM and the SSM agent, needs no inbound admin port, and can log the session. A world-open port 22 depends on a long-lived key and a security group you will eventually get wrong.",
      },
    ],
    interview: [
      {
        q: "ECS or EKS for a small team with two services?",
        a: "Start with ECS unless you already depend on Kubernetes APIs. ECS gives you a task definition, a service, and a load balancer without a cluster you must upgrade. EKS is justified when you need the Kubernetes ecosystem or portability and you accept the operational load. A single small service may not need either; a PaaS or one carefully run service can be the honest answer.",
      },
    ],
    takeaways: [
      "Keep your images in ECR and pin base-image digests from public hubs.",
      "ECS is the smaller AWS-native control plane. EKS is Kubernetes you still operate.",
      "Use Lambda for short events, SSM for shells, and pass --profile and --region.",
    ],
  },
  {
    slug: "aws-cost-and-other-clouds",
    title: "AWS cost habits and other clouds",
    status: "primer",
    blocks: [
      {
        type: "h2",
        text: "Awareness, not a second AWS course",
      },
      {
        type: "p",
        text: "This primer is optional awareness. It does not repeat IAM, VPC, or EC2. It covers the habits that keep a lab from becoming a bill, and it names the Azure and Google Cloud equivalents so a job description in another cloud is readable.",
      },
      {
        type: "h2",
        text: "Budgets, tags, and rightsizing",
      },
      {
        type: "ul",
        items: [
          "Create an AWS Budget with email at a threshold you will notice, and enable billing alerts. Billing metrics are published in us-east-1.",
          "Tag resources at creation time with owner, environment, and application. Untagged spend cannot be assigned after the fact with any confidence.",
          "Rightsize from a high percentile of CPU and memory, not from a guess and not from the average alone. Turn off non-production at night only when the business agrees.",
          "Look for idle load balancers, unattached volumes, unused Elastic IPs, and NAT gateways in accounts where the workload is already gone.",
        ],
      },
      {
        type: "h2",
        text: "Delete dependents first",
      },
      {
        type: "p",
        text: "AWS often refuses to delete a network object while something still uses it. Delete in dependency order, and decide on data before you delete it.",
      },
      {
        type: "ol",
        items: [
          "Application services, load balancers, and compute that hold network interfaces.",
          "NAT gateways and Elastic IPs, which bill hourly until released.",
          "Databases, after you choose whether to keep a final snapshot. Then unattached EBS volumes and snapshots you do not need.",
          "Empty the lab S3 buckets you created, then delete the buckets. A non-empty bucket will not delete.",
          "Subnets, route tables, detach the internet gateway, then the VPC. If the VPC remains, find the leftover network interface before you retry.",
        ],
      },
      {
        type: "callout",
        tone: "warn",
        title: "Money",
        text: "Free tier is limited and does not cover NAT gateways in any useful way. Resources cost money until they are deleted, not until you stop looking at them. Set a billing alarm. Delete what you create. This website never creates cloud resources.",
      },
      {
        type: "h2",
        text: "The same ideas on Azure and Google Cloud",
      },
      {
        type: "p",
        text: "On Azure, Microsoft Entra ID is the directory of people and applications, and Azure RBAC authorizes actions on resource groups and resources. Virtual Machines are the IaaS compute, a Virtual Network is the private network, Blob Storage is the object store, Azure Monitor holds metrics and logs, and AKS is the managed Kubernetes service. You still write the role assignment, the network security group, and the delete of the resource group. A resource group is a useful deletion boundary Azure gives you that AWS accounts do not copy one-for-one.",
      },
      {
        type: "p",
        text: "On Google Cloud, Cloud IAM binds roles to principals on a project or a resource. Compute Engine is the VM service. A VPC network is global, with regional subnets, which is different from an AWS VPC that lives in one Region. Cloud Storage is the object store, Cloud Monitoring is the metrics service, and GKE is managed Kubernetes with more than one mode of how much node operations you keep. Labels and budgets matter for the same reason tags and budgets matter on AWS. Do not learn three consoles by clicking. Learn the mapping, then read the service page before you create anything.",
      },
      {
        type: "table",
        caption: "Equivalent names. The products are not identical.",
        headers: ["Concern", "AWS", "Azure", "Google Cloud"],
        rows: [
          ["Identity", "IAM, often with IAM Identity Center", "Microsoft Entra ID and Azure RBAC", "Cloud IAM"],
          ["Virtual machine", "EC2", "Virtual Machines", "Compute Engine"],
          ["Private network", "VPC (regional)", "Virtual Network", "VPC (global)"],
          ["Object storage", "S3", "Blob Storage", "Cloud Storage"],
          ["Metrics and logs", "CloudWatch", "Azure Monitor", "Cloud Monitoring"],
          ["Managed Kubernetes", "EKS", "AKS", "GKE"],
        ],
      },
      {
        type: "callout",
        tone: "info",
        title: "Optional",
        text: "You do not need an Azure or Google Cloud account for this curriculum. If a lab in another cloud is ever required at work, apply the same rule: billing alarm first, least privilege, private data plane, delete what you created.",
      },
    ],
    exercise: null,
    checks: [
      {
        q: "Why tag resources when they are created rather than at the end of the month?",
        a: "Cost allocation uses the tags present while the charge accrues. A tag added later does not honestly describe spend you already incurred, and untagged resources stay unassigned.",
      },
      {
        q: "What is one real difference between an AWS VPC and a Google Cloud VPC?",
        a: "An AWS VPC is regional. A Google Cloud VPC network is global, and its subnets are regional.",
      },
    ],
    interview: [
      {
        q: "A lab VPC will not delete. What do you check, and what do you not do?",
        a: "I look for leftover network interfaces, NAT gateways, load balancers, and endpoints still in the subnets, and I delete those dependents first. I do not open security groups to the world to 'finish the lab', and I do not leave the NAT gateway overnight because the VPC delete failed. I also confirm I am in the account from the named CLI profile, not a production profile.",
      },
    ],
    takeaways: [
      "Budget alerts, tags, and rightsizing are how you notice spend before the invoice does.",
      "Delete compute, NAT, and public addresses before you try to delete the VPC.",
      "Azure and Google Cloud rename the same building blocks; a Google Cloud VPC is global, an AWS VPC is regional.",
    ],
  },
];
