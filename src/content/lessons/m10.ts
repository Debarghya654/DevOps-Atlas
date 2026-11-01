import type { Lesson } from "../types";

export const lessons: Lesson[] = [
  {
    slug: "kubernetes-architecture",
    title: "Kubernetes architecture",
    status: "full",
    blocks: [
      {
        type: "h2",
        text: "What orchestration is for",
      },
      {
        type: "p",
        text: "Kubernetes schedules containers onto machines, restarts them when they die, rolls out a new image, and gives each set of pods a stable name so other pods can find them. That is the point of the orchestrator: scheduling, self-healing, rollouts, and service discovery. You still own the application, the manifests, the requests and limits, and the cluster's upgrades.",
      },
      {
        type: "p",
        text: "It is the wrong tool for a single small application and a team with nobody to run a cluster. The cost and the failure modes arrive before the benefits. The kubernetes-fit lesson states that choice plainly. This lesson assumes you need the vocabulary either way, because you will read manifests in job interviews and in other people's clusters.",
      },
      {
        type: "diagram",
        id: "k8s",
      },
      {
        type: "h2",
        text: "Control plane",
      },
      {
        type: "ul",
        items: [
          "kube-apiserver is the only front door. kubectl, controllers, and the scheduler talk to it. It authenticates, authorizes, and runs admission.",
          "etcd stores the cluster state. In a normal setup only the API server talks to etcd. Treat etcd disks and backups as production data.",
          "kube-scheduler binds pods that have no node yet, using requests, taints, and affinity.",
          "kube-controller-manager runs the control loops: Deployment, ReplicaSet, Node, Job, and the rest. They watch desired spec and write status back through the API.",
        ],
      },
      {
        type: "h2",
        text: "A node",
      },
      {
        type: "p",
        text: "A node is a worker machine. The kubelet is the agent that starts and stops containers so the pods assigned to that node match what the API asked for. kube-proxy programs the forwarding rules for Services, unless a container network dataplane replaces it. The container runtime, usually containerd, pulls images and runs containers. A node is replaceable. Do not store the only copy of data on its local disk.",
      },
      {
        type: "h2",
        text: "The pod",
      },
      {
        type: "p",
        text: "A pod is the smallest object you deploy. One or more containers share a network namespace, so they share one IP and can reach each other on localhost, and they can share volumes. Pods are ephemeral. A reschedule gets a new IP and a new name suffix. Nothing in the application should store that IP. Put a Service in front of the pods.",
      },
      {
        type: "h2",
        text: "Workloads you will see",
      },
      {
        type: "table",
        caption: "Controller kinds. Use a Deployment for a stateless app unless you have a reason not to.",
        headers: ["Kind", "Keeps", "Use"],
        rows: [
          ["ReplicaSet", "N pods matching a template", "Usually owned by a Deployment, not written by hand"],
          ["Deployment", "A ReplicaSet plus a rollout history", "Stateless services, rolling update, rollback"],
          ["StatefulSet", "Stable pod names and a volume per replica", "Workloads that need identity, such as a datastore you are prepared to operate"],
          ["DaemonSet", "One pod on every selected node", "Log agents and network agents"],
          ["Job", "Pods until a task succeeds", "A migration or a batch run"],
          ["CronJob", "A Job on a schedule", "Periodic work, with a policy for overlap"],
        ],
      },
      {
        type: "h2",
        text: "Services, labels, and namespaces",
      },
      {
        type: "p",
        text: "A Service has a stable cluster DNS name and a virtual IP. It selects pods by labels. ClusterIP, the default, is reachable only inside the cluster. NodePort opens a high port on every node. LoadBalancer asks the surrounding cloud for a load balancer and an address. Labels are free-form key-value pairs. Selectors must match the labels on the pod template, not a label you only put on the Deployment metadata. A namespace partitions names, quotas, and RBAC. It does not, by itself, block network traffic.",
      },
      {
        type: "h2",
        text: "kubectl you will use every day",
      },
      {
        type: "p",
        text: "kubectl get lists objects. kubectl describe shows events, conditions, and why a pod is not ready. kubectl apply creates or updates from a file. kubectl logs reads a container's stdout. Add a namespace flag every time so you are not looking at the default namespace by habit.",
      },
      {
        type: "code",
        lang: "bash",
        title: "Read a deployment before you change it",
        code: `kubectl get deploy,svc,po -n shop
kubectl describe deploy orders-api -n shop
kubectl logs deploy/orders-api -n shop --tail=50
kubectl apply -f orders-api.yaml`,
        note: "Illustrative commands. This page does not run them and does not attach to a cluster.",
      },
      {
        type: "h2",
        text: "A Spring Boot Deployment and Service",
      },
      {
        type: "p",
        text: "The manifest below is illustrative. It was not applied in this environment. It runs a made-up image as a non-root user, sets requests and limits, and probes the actuator health groups under /actuator/health. Spring Boot exposes /actuator/health/liveness and /actuator/health/readiness when management.endpoint.health.probes.enabled is true. Liveness should mean the process is alive. Readiness should mean the pod may take traffic. Sharing one dependency-heavy URL for both makes a database blip restart every pod. A read-only root filesystem needs a writable /tmp, which the emptyDir provides. The image name example.invalid is not a registry.",
      },
      {
        type: "code",
        lang: "yaml",
        title: "Illustrative orders-api manifest",
        code: `apiVersion: apps/v1
kind: Deployment
metadata:
  name: orders-api
  namespace: shop
  labels:
    app: orders-api
spec:
  replicas: 2
  selector:
    matchLabels:
      app: orders-api
  template:
    metadata:
      labels:
        app: orders-api
    spec:
      securityContext:
        runAsNonRoot: true
        runAsUser: 1000
        seccompProfile:
          type: RuntimeDefault
      containers:
        - name: orders
          image: example.invalid/shop/orders-api:1.4.2
          ports:
            - name: http
              containerPort: 8080
          securityContext:
            allowPrivilegeEscalation: false
            readOnlyRootFilesystem: true
            capabilities:
              drop: ["ALL"]
          resources:
            requests:
              cpu: "100m"
              memory: "256Mi"
            limits:
              cpu: "500m"
              memory: "512Mi"
          readinessProbe:
            httpGet:
              path: /actuator/health/readiness
              port: http
            periodSeconds: 10
          livenessProbe:
            httpGet:
              path: /actuator/health/liveness
              port: http
            periodSeconds: 15
          startupProbe:
            httpGet:
              path: /actuator/health/liveness
              port: http
            failureThreshold: 30
            periodSeconds: 5
          volumeMounts:
            - name: tmp
              mountPath: /tmp
      volumes:
        - name: tmp
          emptyDir: {}
---
apiVersion: v1
kind: Service
metadata:
  name: orders-api
  namespace: shop
spec:
  type: ClusterIP
  selector:
    app: orders-api
  ports:
    - name: http
      port: 80
      targetPort: http`,
        note: "Illustrative manifest. Not applied here. containerPort is documentation for humans and probes; the process must actually listen on 8080. Raise memory if the JVM OOMs.",
      },
      {
        type: "callout",
        tone: "warn",
        title: "A real cluster can cost money",
        text: "kind and minikube stay on your machine. Amazon EKS, AKS, and GKE bill a control plane, and a NAT gateway plus load balancers bill on top. Free tier is limited. Set a billing alarm and delete what you create. This website never creates clusters or cloud resources.",
      },
    ],
    exercise: {
      title: "Apply one Deployment on a local cluster",
      prompt:
        "Use kind or minikube. Do not create a cloud Kubernetes service. The Spring image in the lesson will not pull; practice the same object shape with a small public image, or with an image you built locally.",
      steps: [
        "Install kind or minikube and create a local cluster. Confirm kubectl config current-context points at it, not at a work cluster.",
        "Write a Deployment and ClusterIP Service. Use nginxinc/nginx-unprivileged or another image that listens as non-root. Set requests, limits, runAsNonRoot, and an HTTP readiness probe on a path the image actually serves.",
        "kubectl apply the file. kubectl get pods and kubectl describe the Deployment until the ready count matches replicas.",
        "Change the Service selector so it cannot match, apply, and kubectl get endpoints. Put the selector back when you have seen an empty address list.",
        "Delete the local cluster when you are done. Do not delete namespaces you do not own on any other cluster.",
      ],
      criteria: [
        "The context was a local kind or minikube cluster for the whole exercise.",
        "The Deployment has requests, limits, and a non-root securityContext.",
        "You can show an endpoints object that is empty when the selector is wrong and populated when it matches.",
        "No cloud load balancer and no EKS, AKS, or GKE cluster was created.",
        "You can say what liveness does differently from readiness.",
      ],
    },
    checks: [
      {
        q: "What talks to etcd in a standard cluster?",
        a: "The API server. Schedulers, controllers, and kubectl talk to the API server, which is the only component that should read and write etcd.",
      },
      {
        q: "Why is a pod IP a bad thing to configure into another application?",
        a: "Pods are ephemeral. A new pod gets a new IP. Clients should use the Service DNS name, which selects whatever pods are ready.",
      },
      {
        q: "What is the difference between a Deployment and a StatefulSet?",
        a: "A Deployment rolls interchangeable replicas. A StatefulSet gives each replica a stable name and is the usual controller when each replica needs its own volume.",
      },
      {
        q: "Does a namespace stop pods from connecting to each other?",
        a: "No. A namespace is a naming, quota, and RBAC boundary. Network isolation is a NetworkPolicy enforced by the CNI, and many clusters start with allow-all.",
      },
    ],
    interview: [
      {
        q: "Name the control plane components and what fails if the scheduler is down.",
        a: "The API server fronts the cluster, etcd stores objects, the scheduler assigns nodes to new pods, and the controller manager runs the reconciliation loops. kubelet and the runtime are on the nodes, not in that list. If the scheduler is down, existing pods keep running, and new pods stay Pending with no node. The API and the kubelets do not stop serving traffic that is already placed.",
      },
      {
        q: "Why do liveness and readiness hit different actuator paths?",
        a: "Readiness removes the pod from the Service when dependencies are not ready, which is what you want during startup or a brief downstream failure. Liveness kills the container. If liveness calls a check that fails whenever the database fails, every pod restarts together and the outage gets worse. On Spring Boot those paths are /actuator/health/liveness and /actuator/health/readiness once probe endpoints are enabled. A startup probe holds both off until a slow JVM has booted.",
      },
      {
        q: "What does a Service of type ClusterIP actually do?",
        a: "It allocates a virtual IP and a DNS name, and it keeps an endpoints list of pod IPs whose labels match the selector and whose readiness probes pass. kube-proxy, or a replacement dataplane, forwards that virtual IP to those pods. It does not create a cloud load balancer. LoadBalancer does that, and it costs money in a real cloud.",
      },
    ],
    takeaways: [
      "Kubernetes schedules, restarts, rolls out, and names pods. It is optional for a small system.",
      "API server, etcd, scheduler, and controller manager are the control plane. kubelet runs on the node.",
      "A pod is ephemeral. A Service and labels are how traffic finds the current pods.",
      "Use a Deployment for stateless apps, and split liveness from readiness.",
      "Practice on kind or minikube. A cloud control plane and a NAT gateway are a bill.",
    ],
  },
  {
    slug: "kubernetes-workloads",
    title: "Kubernetes workloads and configuration",
    status: "primer",
    blocks: [
      {
        type: "h2",
        text: "ConfigMap and Secret",
      },
      {
        type: "p",
        text: "A ConfigMap holds non-secret configuration: a file, or a set of environment keys. A Secret is the same shape for credentials. The difference is intent and RBAC, not strong protection. Secret values are base64-encoded in the manifest and, on many clusters, stored in etcd without encryption. Base64 is not encryption. Anyone who can get the Secret can decode it. Turn on encryption at rest for the cluster, or keep the real material in an external store (a cloud secrets manager, or an external-secrets controller) and let the cluster see only a short-lived copy.",
      },
      {
        type: "callout",
        tone: "danger",
        title: "Do not commit plaintext secrets",
        text: "Do not put a password, a cloud key, or a signing key in git, even inside a Secret manifest. The fake key id AKIAEXAMPLEINVALID is a placeholder, not a value to encode into a Secret. If a secret reached git, rotate it. Deleting the file from the latest commit does not remove it from history.",
      },
      {
        type: "h2",
        text: "Requests, limits, and probes",
      },
      {
        type: "p",
        text: "A request is what the scheduler reserves. A limit is what the node enforces. CPU limit throttles the container. Memory limit kills it if the process exceeds the cap. Set both. A JVM needs a limit above the heap, or the next garbage-collection spike is an OOMKill. Requests that are far above real use waste the cluster. Requests of zero make the pod the first candidate for eviction.",
      },
      {
        type: "table",
        caption: "What a failing probe does.",
        headers: ["Probe", "Question it asks", "On failure"],
        rows: [
          ["Startup", "Has the process finished booting?", "Other probes wait. Failure threshold kills a stuck start."],
          ["Liveness", "Is the process dead and in need of a restart?", "kubelet restarts the container."],
          ["Readiness", "Should this pod receive Service traffic?", "Pod is removed from the endpoints list. It is not restarted."],
        ],
      },
      {
        type: "h2",
        text: "Persistent storage",
      },
      {
        type: "p",
        text: "A PersistentVolumeClaim is the application's request for disk: size, access mode, and a StorageClass. The StorageClass names a provisioner, such as a cloud disk type, which creates a PersistentVolume. The pod mounts the claim. Deleting a pod does not necessarily delete the claim or the disk, and the disk keeps billing. Bind claims into a StatefulSet only when the data must survive the pod. Do not use a volume as a substitute for a backup.",
      },
      {
        type: "h2",
        text: "Ingress and the Gateway API",
      },
      {
        type: "p",
        text: "An Ingress object describes HTTP host and path routing to Services. It does nothing until an ingress controller is installed to implement it. The Gateway API is the newer set of objects: a GatewayClass, a Gateway, and HTTPRoute. It splits who may define the listener from who may attach routes, and it covers more than classic Ingress. Either way, the controller and any cloud load balancer it creates are real infrastructure with a cost. TLS terminates at the gateway or at the ingress controller, not magically because a YAML file mentions a hostname.",
      },
      {
        type: "callout",
        tone: "info",
        title: "Illustrative only",
        text: "Nothing in this primer is applied for you. On a cloud cluster, disks and load balancers cost money, free tier is limited, and you should delete what you create. This website never creates cloud resources.",
      },
    ],
    exercise: null,
    checks: [
      {
        q: "Are Kubernetes Secrets encrypted?",
        a: "Not by default. They are base64-encoded and may sit in plaintext in etcd. Encryption at rest or an external secrets store is a separate control. Do not commit them to git.",
      },
      {
        q: "A readiness probe fails. Does Kubernetes restart the container?",
        a: "No. The pod leaves the Service endpoints so it stops receiving traffic. A failing liveness probe is what restarts the container. A startup probe delays both until the app has booted.",
      },
    ],
    interview: [
      {
        q: "Your pods restart whenever the database blips. What is the likely probe bug?",
        a: "Liveness is calling a health URL that checks the database. Readiness should fail closed and take the pod out of service. Liveness should only fail when the process itself is stuck. I would point liveness and the startup probe at the process-up path, keep the dependency check on readiness, and set requests and limits so a restart loop is not also an OOM from a limit that is tighter than the heap.",
      },
    ],
    takeaways: [
      "Secrets are base64, not encryption, and do not belong in git as plaintext.",
      "Requests schedule, limits enforce, and only liveness restarts a container.",
      "A PVC is a billed disk. Ingress needs a controller; the Gateway API is the newer split of the same job.",
    ],
  },
  {
    slug: "kubernetes-troubleshooting",
    title: "Kubernetes troubleshooting",
    status: "full",
    blocks: [
      {
        type: "h2",
        text: "Evidence before fixes",
      },
      {
        type: "p",
        text: "Start with describe, logs, and events. describe shows the probe failures, the image error, and the scheduling message. logs --previous shows the container that already crashed, which the current logs often miss because the new process has not written anything. Events are the cluster's short-term diary. kubectl auth can-i tells you whether the identity you are using may do the thing you are about to attempt. Guessing with deletes is how a namespace full of other people's apps disappears.",
      },
      {
        type: "code",
        lang: "bash",
        title: "The first four commands",
        code: `kubectl describe pod orders-api-7f9c8d6b5c-k4m2p -n shop
kubectl logs orders-api-7f9c8d6b5c-k4m2p -n shop --previous
kubectl get events -n shop --sort-by=.lastTimestamp
kubectl auth can-i get pods -n shop`,
        note: "Illustrative commands. This page does not run them. Sample events later in the lesson are marked as output that was not captured from a live run.",
      },
      {
        type: "callout",
        tone: "danger",
        title: "Do not delete namespaces as a fix",
        text: "Deleting a namespace deletes every object in it. It is not a restart. Do not delete kube-system, do not delete a namespace because a pod is pending, and do not run a delete from the wrong kubeconfig context. Roll back the Deployment or fix the one object that is wrong.",
      },
      {
        type: "table",
        caption: "Four symptoms and the empty-Service case. Evidence comes from describe, logs, or endpoints, not from a hunch.",
        headers: ["What you see", "Evidence", "Fix"],
        rows: [
          ["CrashLoopBackOff", "logs --previous shows the process exiting", "Fix the configuration or roll back the image. Do not raise replicas."],
          ["ImagePullBackOff", "describe says the manifest or the auth failed", "Correct the name and tag, or the pull secret."],
          ["Pending", "FailedScheduling cites CPU, a volume, or a taint", "Change the request, the claim, or the toleration. Do not delete the namespace."],
          ["Restarted by a probe", "Unhealthy liveness events", "Point liveness at a process-up path and give slow starts a startup probe."],
          ["Service has no addresses", "endpoints is empty while pods are Ready", "Make the selector match the pod labels."],
        ],
      },
      {
        type: "h2",
        text: "CrashLoopBackOff",
      },
      {
        type: "p",
        text: "The process starts and exits. Kubernetes waits longer between restarts, which is the backoff. The status line shows restarts climbing and the container not becoming Ready. This is an application or configuration failure, not a reason to delete the Deployment.",
      },
      {
        type: "code",
        lang: "text",
        title: "Evidence: crash loop",
        code: `NAME                          READY   STATUS             RESTARTS   AGE
orders-api-7f9c8d6b5c-k4m2p   0/1     CrashLoopBackOff   6          4m

# kubectl logs ... --previous
Exception in thread "main" java.lang.IllegalStateException: Missing required configuration ORDERS_DB_URL`,
        note: "Illustrative output — not captured from a live run in this environment.",
      },
      {
        type: "p",
        text: "Fix the missing configuration with a Secret or ConfigMap the Deployment actually mounts, then roll the pod. Do not commit the database URL to git. If the previous logs show an exception on every start, a new replica count will not help. If you just shipped the image, roll back first and debug the config second.",
      },
      {
        type: "h2",
        text: "ImagePullBackOff",
      },
      {
        type: "p",
        text: "The kubelet cannot fetch the image. The pod never starts, so application logs do not exist. describe is the tool. Typical causes are a typo in the tag, a private registry with no imagePullSecret, or a node that has no network path to the registry.",
      },
      {
        type: "code",
        lang: "text",
        title: "Evidence: image pull",
        code: `Warning  Failed  kubelet  Failed to pull image "example.invalid/shop/orders-api:1.4.2": manifest unknown
Normal   BackOff kubelet  Back-off pulling image "example.invalid/shop/orders-api:1.4.2"`,
        note: "Illustrative output — not captured from a live run in this environment. example.invalid is not a registry.",
      },
      {
        type: "p",
        text: "Fix the repository and tag, or attach a pull secret that is allowed to read that repository. Pin an immutable tag or a digest. Do not switch the image to a public latest tag to make the error go away. If auth can-i says the CI user cannot list secrets in the namespace, the pull secret may exist and the deployer may still be unable to reference it.",
      },
      {
        type: "h2",
        text: "Pending",
      },
      {
        type: "p",
        text: "Pending means the scheduler has not bound the pod to a node, or the node cannot start it because a volume is missing. Read the FailedScheduling event. The usual reasons are requests the nodes cannot fit, a PersistentVolumeClaim that is unbound, or a taint no pod tolerates. Adding replicas makes a capacity problem worse.",
      },
      {
        type: "code",
        lang: "text",
        title: "Evidence: three different Pending reasons",
        code: `Warning  FailedScheduling  0/3 nodes are available: 3 Insufficient cpu.
Warning  FailedScheduling  0/3 nodes are available: 3 pod has unbound immediate PersistentVolumeClaims.
Warning  FailedScheduling  0/3 nodes are available: 3 node(s) had untolerated taint {dedicated: data}.`,
        note: "Illustrative output — not captured from a live run in this environment. A real event has one dominant reason; all three are shown so you can recognize them.",
      },
      {
        type: "p",
        text: "Lower the CPU request if it was a guess, add capacity if it was honest, or fix the StorageClass so the claim binds. Add a toleration only when the pod is supposed to run on that tainted pool. Do not remove taints from every node to force a fit, and do not delete the namespace.",
      },
      {
        type: "h2",
        text: "Probe failures",
      },
      {
        type: "p",
        text: "A container can be running and still restart forever because liveness fails. describe shows the probe URL, the status code, and the restart count. A 503 from a dependency check used as liveness is the bug from the workloads lesson. A connection refused often means the probe port is not the port the process listens on.",
      },
      {
        type: "code",
        lang: "text",
        title: "Evidence: liveness",
        code: `Warning  Unhealthy  Liveness probe failed: HTTP probe failed with statuscode: 503
  path=/actuator/health/liveness port=8080
Restart Count: 9`,
        note: "Illustrative output — not captured from a live run in this environment.",
      },
      {
        type: "p",
        text: "Point liveness at a path that fails only when the process is stuck, give a slow JVM a startup probe, and match the probe port to the listen port. Readiness may keep failing while a dependency is down; that should drop endpoints, not restart the process. After the manifest is fixed, a rollout replaces the pods. You do not need to delete the namespace to pick up a probe change.",
      },
      {
        type: "h2",
        text: "A Service with no endpoints",
      },
      {
        type: "p",
        text: "The pods are Ready and the Service still has no addresses. The selector does not match the pod labels, or you are looking at the wrong namespace. A second, quieter bug is a target port the container does not listen on: endpoints exist, but connections fail. The selector bug shows up as an empty endpoints object. The port bug shows up as endpoints that are populated and a connection refused inside the pod.",
      },
      {
        type: "code",
        lang: "text",
        title: "Evidence: selector mismatch",
        code: `kubectl get endpoints orders-api -n shop
NAME         ENDPOINTS   AGE
orders-api   <none>      2m

kubectl get pods -n shop --show-labels
NAME                          READY   LABELS
orders-api-7f9c8d6b5c-k4m2p   1/1     app=order`,
        note: "Illustrative output — not captured from a live run in this environment. The Service selects app=orders-api. The pod label is app=order.",
      },
      {
        type: "p",
        text: "Make the Service selector and the pod template labels identical, and make targetPort the container's listen port or the named port from the pod spec. Apply the fixed manifest. Do not create a second Service in front of the same pods and leave the broken one for clients to find.",
      },
      {
        type: "h2",
        text: "Roll back",
      },
      {
        type: "p",
        text: "A Deployment keeps a revision history. If the new revision is the bad one, undo it. Then find the cause. Undo is the mitigation, not the root-cause document.",
      },
      {
        type: "code",
        lang: "bash",
        title: "Return to the previous revision",
        code: `kubectl rollout history deployment/orders-api -n shop
kubectl rollout undo deployment/orders-api -n shop
kubectl rollout status deployment/orders-api -n shop`,
        note: "Illustrative commands. This page does not run them. Undo fails if the previous revision is missing because history was trimmed to 1.",
      },
    ],
    exercise: {
      title: "Break a selector on purpose, locally",
      prompt:
        "On a local kind or minikube cluster, create one working Service and then mis-label it. Diagnose with endpoints and describe. Do not use a cloud cluster.",
      steps: [
        "Confirm kubectl config current-context is your local cluster.",
        "Apply a Deployment and Service that match. Wait until endpoints show an address.",
        "Change only the Service selector to a label the pods do not have. Apply it.",
        "Record the output of kubectl get endpoints and kubectl describe service. That is the evidence.",
        "Restore the selector. Confirm endpoints return. Optional: set the image to a tag that does not exist, observe ImagePullBackOff with describe, then put the tag back.",
        "Delete the exercise objects or the local cluster. Do not delete unrelated namespaces.",
      ],
      criteria: [
        "You captured an endpoints object with no addresses and the pod labels that failed to match.",
        "You fixed it by editing the selector or the labels, not by deleting the namespace.",
        "If you tried the bad image, the evidence is a Failed pull event, not an application stack trace.",
        "The kubeconfig context never pointed at a production or cloud cluster.",
        "You can say what logs --previous is for, even though this exercise may not have crashed a process.",
      ],
    },
    checks: [
      {
        q: "A pod is in CrashLoopBackOff and kubectl logs shows almost nothing. What next?",
        a: "kubectl logs with --previous, then describe for the exit code and the last events. The current process may not have written yet. The previous process usually has the exception.",
      },
      {
        q: "Endpoints are empty and the pods are Ready. What is the first mismatch to check?",
        a: "The Service selector against the labels on the pod template. A label on the Deployment metadata does not count. The wrong container port is the follow-up once endpoints exist but connections fail.",
      },
      {
        q: "A pod stays Pending with Insufficient cpu. What does adding replicas do?",
        a: "It asks for even more CPU that the nodes do not have. Lower the request or add nodes. Do not delete the namespace.",
      },
      {
        q: "What does kubectl rollout undo change?",
        a: "It rolls the Deployment back to the previous revision in its history. It does not repair a bad Secret, a bad pull secret, or a cluster that is out of CPU.",
      },
    ],
    interview: [
      {
        q: "Walk through ImagePullBackOff versus CrashLoopBackOff.",
        a: "ImagePullBackOff means the node never started the container. describe shows a registry, tag, or auth error, and there are no application logs. I fix the image reference or the pull secret. CrashLoopBackOff means the container did start and then exited. I read logs --previous and the exit code, then fix the config or roll back the image. Deleting the pod is at most a way to retry. It is not a diagnosis.",
      },
      {
        q: "A Service has no endpoints. List the checks in order.",
        a: "Same namespace. Selector equals the pod labels. Pods are Ready, because a failing readiness probe removes them from endpoints even when labels match. Then the target port matches the listening port. I use get endpoints, get pods --show-labels, and describe. I do not recreate the namespace.",
      },
      {
        q: "When is rollout undo the wrong first move?",
        a: "When the failure is cluster-wide: no capacity, a broken StorageClass, or a registry outage. Undo helps when this revision of the Deployment is what introduced the bad image, the bad probe, or the bad command. I still look at events so I do not roll back a good app and leave the real cause, such as a taint or a missing Secret, untouched.",
      },
    ],
    takeaways: [
      "describe, logs --previous, events, and auth can-i beat random deletes.",
      "CrashLoopBackOff is a process that exits. ImagePullBackOff never started it. Pending is scheduling or storage.",
      "Empty endpoints are usually a selector or a readiness problem. A wrong port still has endpoints.",
      "Liveness failures restart pods. Fix the probe instead of raising the replica count.",
      "Roll a Deployment back by revision. Do not delete namespaces to clear an error.",
    ],
  },
  {
    slug: "helm-and-delivery",
    title: "Helm, autoscaling, and access",
    status: "primer",
    blocks: [
      {
        type: "h2",
        text: "Charts, values, and releases",
      },
      {
        type: "p",
        text: "A Helm chart is a package of Kubernetes manifests plus templates. values.yaml holds the inputs: image, replica count, resource sizes. A release is one install of that chart in a namespace, with its own value overrides. Templating lets one chart deploy many services without copying YAML. It also hides the YAML you are about to apply. Render it with helm template and read the output before helm upgrade. If you cannot explain the rendered Deployment, do not install the chart.",
      },
      {
        type: "code",
        lang: "yaml",
        title: "A values file, not a template",
        code: `replicaCount: 2
image:
  repository: example.invalid/shop/orders-api
  tag: "1.4.2"
service:
  port: 80`,
        note: "Illustrative. example.invalid is not a registry. Helm's placeholder syntax is omitted here on purpose; render the chart and read the YAML rather than trusting the values file alone.",
      },
      {
        type: "callout",
        tone: "tip",
        title: "Templates hide complexity",
        text: "A chart can create ClusterRoles, load balancers, and extra namespaces from a single true flag. Read helm template output in review. A values change that looks like a replica tweak can be a new public load balancer.",
      },
      {
        type: "h2",
        text: "Autoscaling and placement",
      },
      {
        type: "p",
        text: "A HorizontalPodAutoscaler changes the replica count of a Deployment from a metric. The common metric is CPU utilization as a percentage of the CPU request. If you did not set a request, that percentage is undefined and the scaler has nothing to scale on. HPA does not change the size of a pod. It does not fix a memory leak. Cap maxReplicas so a bad metric cannot order hundreds of pods.",
      },
      {
        type: "p",
        text: "A taint on a node repels pods that do not tolerate it. Use taints for dedicated pools, such as GPU nodes. Affinity is the other direction: a pod rule that prefers or requires certain nodes or the company of other pods. Prefer a required rule only when the pod must not run elsewhere. Preferred affinity is a hint and will be ignored when the cluster is tight.",
      },
      {
        type: "h2",
        text: "RBAC",
      },
      {
        type: "p",
        text: "A user is a human identity presented by the cluster's authentication. Kubernetes does not store user passwords. A ServiceAccount is a workload identity inside a namespace, which pods use when they call the API. A Role and a RoleBinding apply inside one namespace. A ClusterRole and a ClusterRoleBinding apply across the cluster. You can also bind a ClusterRole inside one namespace with a RoleBinding, which is how a reusable set of rules stays local. Give CI a Role in the application namespace, not cluster-admin.",
      },
      {
        type: "code",
        lang: "yaml",
        title: "Namespace-scoped deploy role",
        code: `apiVersion: rbac.authorization.k8s.io/v1
kind: Role
metadata:
  name: deployer
  namespace: shop
rules:
  - apiGroups: ["apps"]
    resources: ["deployments"]
    verbs: ["get", "list", "watch", "create", "update", "patch"]`,
        note: "Illustrative. It intentionally omits delete and omits secrets. Bind it to the CI ServiceAccount with a RoleBinding in the same namespace.",
      },
      {
        type: "h2",
        text: "NetworkPolicy starts as allow-all",
      },
      {
        type: "p",
        text: "On many clusters, no NetworkPolicy means every pod can reach every pod. That is the default. A policy only restricts pods it selects, and only if the CNI actually enforces NetworkPolicy. The first policy you add should be deliberate: once a pod is selected, traffic in that direction is denied except what the policy allows. Do not assume a namespace boundary is a firewall.",
      },
      {
        type: "callout",
        tone: "warn",
        title: "Cloud objects inside charts",
        text: "A chart that creates a LoadBalancer Service or a disk will spend money on a cloud cluster. Free tier is limited. Render the chart, set a billing alarm if you ever install it in a cloud account, and delete the release. This website never installs charts into a cloud.",
      },
    ],
    exercise: null,
    checks: [
      {
        q: "Why can a CPU-based HPA sit at the minimum replica count forever?",
        a: "Utilization is computed from CPU requests. Without requests, the metric is absent. With requests set far above real CPU, utilization never crosses the target.",
      },
      {
        q: "What is the default network behavior when a cluster has no NetworkPolicy objects?",
        a: "Allow all, on clusters whose CNI implements the usual default. A namespace does not imply isolation. Enforcement also depends on the CNI; a policy object on a CNI that ignores it does nothing.",
      },
    ],
    interview: [
      {
        q: "What do you review in a Helm chart before the first install?",
        a: "I run helm template with the values I intend to ship and I read the rendered objects. I look for ClusterRoleBindings, privileged pods, LoadBalancer Services, and image tags that float. I check that resource requests exist if an HPA is included, and that secrets are not baked into values.yaml in git. The release name and namespace are part of the review, because a second install with the same name is an upgrade, not a fresh sandbox.",
      },
    ],
    takeaways: [
      "A chart plus values becomes a release. Read the rendered YAML, because templates hide objects.",
      "HPA scales replicas from metrics and needs CPU requests. Taints repel; affinity attracts.",
      "RBAC binds roles to users or ServiceAccounts. NetworkPolicy default on many clusters is allow-all.",
    ],
  },
  {
    slug: "kubernetes-fit",
    title: "When Kubernetes fits",
    status: "primer",
    blocks: [
      {
        type: "h2",
        text: "Optional, and often too soon",
      },
      {
        type: "p",
        text: "This lesson is a decision, not another API tour. Kubernetes is an advanced platform. Use it when the product shape needs it and the team can operate it. Adopting it because a job posting listed it, for one service, is how you inherit etcd, upgrades, and a NAT bill.",
      },
      {
        type: "h2",
        text: "Use a cluster when all of these are true",
      },
      {
        type: "ul",
        items: [
          "You have many services that need the same rollout, scaling, and service-discovery pattern.",
          "You need rolling deploys with health checks and a way back, more than one copy at a time.",
          "Someone on the team can own upgrades, RBAC, backups of etcd or the managed control plane, and the on-call for Pending and CrashLoopBackOff.",
        ],
      },
      {
        type: "h2",
        text: "Prefer a smaller platform when the team is small",
      },
      {
        type: "p",
        text: "A PaaS, Amazon ECS, or a single well-managed virtual machine is the better default for one or two services and a handful of people. ECS still gives you a load balancer, a task definition, and replacement of unhealthy tasks without a Kubernetes control plane. A single VM plus a process supervisor is honest if the availability target allows it. You can move later, when the operational pain is real.",
      },
      {
        type: "h2",
        text: "Learn locally first",
      },
      {
        type: "p",
        text: "kind runs Kubernetes nodes as containers on your laptop. minikube runs a local node as a container or a VM. Both are enough to practice Deployments, Services, probes, and broken selectors. Do not start by creating a production-shaped EKS cluster. You will pay for the control plane while you are still learning what a Namespace is.",
      },
      {
        type: "callout",
        tone: "warn",
        title: "Control plane and NAT",
        text: "Managed Kubernetes bills the control plane hourly even when no requests arrive. Private nodes usually need a NAT gateway to pull images, and that NAT bills hourly and per gigabyte. Load balancers bill as well. Free tier is limited, set a billing alarm, and delete the cluster and the NAT when the lab ends. This website never creates them.",
      },
      {
        type: "h3",
        text: "A practical rule",
      },
      {
        type: "p",
        text: "If you cannot name who patches the cluster next quarter, you are not ready to run one. Learn the manifests anyway. Apply them on kind. Put the production traffic on a platform your team already operates.",
      },
    ],
    exercise: null,
    checks: [
      {
        q: "Name a case where ECS or a PaaS is the better recommendation.",
        a: "A small team, one or two services, and no one who will run cluster upgrades. You still get rolling deploys and a load balancer without operating Kubernetes.",
      },
      {
        q: "Why is a new EKS cluster a bad first lab?",
        a: "You pay for the control plane, usually a NAT gateway, and any load balancer, while you are still learning local objects that kind can teach for free.",
      },
    ],
    interview: [
      {
        q: "A startup with four engineers and one API wants Kubernetes. What do you say?",
        a: "I ask who will upgrade it and take the on-call. If the answer is nobody, I recommend a PaaS or ECS and a single pipeline with health checks. Kubernetes pays off when there are many services and a person or a platform team for the cluster. I still want them fluent in Deployments and probes, and I would have them practice on kind rather than standing up a managed cluster on day one.",
      },
    ],
    takeaways: [
      "Adopt Kubernetes for many services, real rollouts, and a team that can operate the cluster.",
      "A small team should prefer a PaaS, ECS, or one virtual machine.",
      "Practice on kind or minikube. A managed control plane plus NAT is a paid system, not a tutorial.",
    ],
  },
];
