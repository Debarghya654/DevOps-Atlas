import type { Lesson } from "../types";

export const lessons: Lesson[] = [
  {
    slug: "ip-subnetting",
    title: "IP and subnetting",
    status: "primer",
    blocks: [
      { type: "h2", text: "Addresses name interfaces, not people" },
      {
        type: "p",
        text: "An IP address identifies a network interface at layer 3, the Internet layer, so packets can be forwarded between networks. IPv4 addresses are 32 bits, written as four decimal octets from 0 to 255, for example 203.0.113.10. That is about 4.29 billion values, and a large fraction is reserved, which is why public IPv4 ran out. IPv6 addresses are 128 bits, written as eight hexadecimal groups separated by colons. One run of zero groups can be compressed with ::, and only one such compression is allowed. 2001:db8::10 is a documentation address in the prefix 2001:db8::/32. It is not a host for you to scan.",
      },
      { type: "h3", text: "Public and private" },
      {
        type: "p",
        text: "A public address is globally routable. Registries allocate it, and routers on the Internet are willing to carry it. A private address is for networks that are not the public Internet. RFC 1918 reserves three IPv4 ranges, and operators are expected not to route them between organizations: 10.0.0.0/8, 172.16.0.0/12 (172.16.0.0 through 172.31.255.255, not merely 172.16.0.0/16), and 192.168.0.0/16. Loopback is 127.0.0.0/8, used to talk to yourself. Link-local 169.254.0.0/16 appears when a host failed to get a DHCP lease. 192.0.2.0/24, 198.51.100.0/24, and 203.0.113.0/24 are documentation ranges (TEST-NET). Use them in examples. Do not treat them as your office LAN, and do not publish real addresses from a production network in tickets.",
      },
      { type: "h3", text: "CIDR and a worked /24 versus /26" },
      {
        type: "p",
        text: "CIDR writes a prefix length after a slash. The prefix is the network part. The remaining bits are the host part. A /24 leaves 8 host bits: 2 to the 8th is 256 addresses. In a classic IPv4 subnet the all-zeros address is the network address and the all-ones address is the broadcast, so 256 minus 2 is 254 usable hosts. A /26 leaves 6 host bits: 2 to the 6th is 64 addresses, 62 usable. The older dotted mask for /24 is 255.255.255.0. For /26 it is 255.255.255.192, because the block size in the last octet is 256 minus 192, which is 64. Exception worth knowing later: a /31 used as a point-to-point link (RFC 3021) can use both addresses, and IPv6 has no broadcast address, so do not subtract 2 there. The worked example below is the classic rule.",
      },
      {
        type: "table",
        caption: "10.1.8.0/24 split into four /26 subnets",
        headers: ["Prefix", "Network", "First host", "Last host", "Broadcast", "Usable"],
        rows: [
          ["10.1.8.0/24", "10.1.8.0", "10.1.8.1", "10.1.8.254", "10.1.8.255", "254"],
          ["10.1.8.0/26", "10.1.8.0", "10.1.8.1", "10.1.8.62", "10.1.8.63", "62"],
          ["10.1.8.64/26", "10.1.8.64", "10.1.8.65", "10.1.8.126", "10.1.8.127", "62"],
          ["10.1.8.128/26", "10.1.8.128", "10.1.8.129", "10.1.8.190", "10.1.8.191", "62"],
          ["10.1.8.192/26", "10.1.8.192", "10.1.8.193", "10.1.8.254", "10.1.8.255", "62"],
        ],
      },
      {
        type: "p",
        text: "10.1.8.10/26 sits in the first block. Its network is 10.1.8.0, its broadcast is 10.1.8.63, and 10.1.8.64 is a different network even though the third octet matches. Hosts that share a prefix and a link can talk at layer 2. Hosts in another prefix need a router. All of 10.1.8.0/24 is still RFC 1918 private space. Splitting it does not make it public.",
      },
      { type: "h3", text: "MAC, IP, and ARP" },
      {
        type: "p",
        text: "A MAC address is a layer-2 address, 48 bits on Ethernet, usually written as six hex bytes. It identifies an interface on a local segment. Switches forward frames by MAC. Routers forward packets by IP and rewrite the frame for the next hop, so the MAC you see changes at every hop while the IP, until NAT, stays the endpoint address. ARP, the Address Resolution Protocol, fills the gap on an IPv4 LAN: the sender broadcasts who has 10.1.8.10, the owner replies with its MAC, and the pair is cached. You can inspect the cache on Linux with ip neigh, from iproute2. ARP is not a routing protocol, and it is not used to reach other subnets. Those frames go to the gateway's MAC. IPv6 does not use ARP. It uses Neighbor Discovery. ARP can be spoofed on a local segment because the first reply wins unless the switch is doing dynamic ARP inspection. That is a local-network attack, not a reason to confuse MAC with IP.",
      },
      { type: "h3", text: "Why NAT exists" },
      {
        type: "p",
        text: "Network Address Translation rewrites addresses as packets cross a boundary. The common form on an office router or a cloud NAT gateway is source NAT, often port address translation: many private hosts share one public IPv4 address. The translator records the original source IP and source port, substitutes the public IP and a chosen port, and uses that table to send replies home. It exists because there are not enough public IPv4 addresses for every laptop and pod. Hiding internal addresses is a side effect, not a security boundary. NAT does not by itself block an inbound port forward, and it breaks protocols that assume end-to-end addressing. IPv6's size removes the shortage reason. Many networks still NAT IPv4 because that is how their public edge is built. When you draw a diagram, mark which addresses are private, which hop performs NAT, and which address the outside actually sees.",
      },
      {
        type: "code",
        lang: "text",
        title: "Prefix arithmetic you should be able to do on paper",
        code: `/24 host bits = 32 - 24 = 8;  addresses = 2^8 = 256;  usable = 254
/26 host bits = 32 - 26 = 6;  addresses = 2^6 = 64;   usable = 62
/26 block size in the last octet = 64
mask /26 = 255.255.255.192`,
      },
      {
        type: "callout",
        tone: "warn",
        title: "172.16 is not the whole private range",
        text: "172.16.0.0/16 is only the first slice of the RFC 1918 block 172.16.0.0/12. 172.24.5.10 is also private. 172.32.0.1 is not in that block. If a security group or a filter says 172.16.0.0/16 and the network uses 172.20.0.0/16, the filter does not match the traffic you think it matches.",
      },
    ],
    exercise: {
      title: "Split a /24 on paper",
      prompt:
        "Without a calculator app's subnet button, split 10.4.20.0/24 into /26 networks. Then answer the NAT and ARP questions in one sentence each.",
      steps: [
        "List four rows: network, first host, last host, broadcast, usable count.",
        "State the dotted mask for /26.",
        "Say whether 10.4.20.70 and 10.4.20.50 are in the same /26. Show the block boundary you used.",
        "Say why a laptop with only 10.4.20.50 cannot be reached from the public Internet until something rewrites addresses or assigns a public IP.",
        "In one sentence, say what ARP returns, and what it does not return.",
      ],
      criteria: [
        "The four networks are .0, .64, .128, and .192, with 62 usable hosts each.",
        "10.4.20.50 is in .0/26 and 10.4.20.70 is in .64/26, so they are not the same subnet.",
        "The mask is 255.255.255.192.",
        "NAT is described as address sharing caused by IPv4 scarcity, not as a firewall.",
        "ARP is described as IP to MAC on the local link only.",
      ],
    },
    checks: [
      {
        q: "How many usable IPv4 hosts are in a /26, and why is the answer not 64?",
        a: "62. A /26 has 6 host bits, so 64 addresses. In a classic subnet the first is the network address and the last is the broadcast, and neither is assigned to a host. The exception is not the /26: point-to-point /31s can use both addresses, and IPv6 does not reserve a broadcast the same way. For this lesson's /26, use 62.",
      },
      {
        q: "Is 172.24.1.5 a private address? Is 10.1.8.10/26 inside 10.1.8.0/24?",
        a: "172.24.1.5 is private because it falls in RFC 1918 172.16.0.0/12, which runs through 172.31.255.255. 10.1.8.10/26 is inside 10.1.8.0/24. Its own subnet is 10.1.8.0/26, whose broadcast is 10.1.8.63. Being inside the /24 does not mean it can ARP for 10.1.8.200. That address is in 10.1.8.192/26, so it is a routing decision, not an ARP decision.",
      },
    ],
    interview: [
      {
        q: "Explain private IP addresses, a /26, and why NAT showed up.",
        a: "RFC 1918 reserves 10.0.0.0/8, 172.16.0.0/12, and 192.168.0.0/16. Those are not globally routed between companies. A /26 has 64 addresses and 62 usable hosts, because one address is the network and one is the broadcast. The mask is 255.255.255.192 and the blocks step by 64. I would place 10.1.8.10 in 10.1.8.0/26, not in the .64 block. NAT exists so many private hosts can share a scarce public IPv4 address by rewriting source IP and port. I do not treat NAT as a firewall. ARP only maps an IPv4 address to a MAC on the local link. The gateway's MAC is what you use to leave the subnet.",
      },
    ],
    takeaways: [
      "IPv4 is 32 bits. IPv6 is 128 bits. RFC 1918 private ranges are 10/8, 172.16/12, and 192.168/16.",
      "A classic /24 has 254 usable hosts. A classic /26 has 62. Blocks of a /26 are 64 addresses wide.",
      "ARP maps IPv4 to a MAC on the local link only. NAT shares scarce public IPv4 addresses and is not a firewall.",
    ],
  },
  {
    slug: "tcp-udp-dns-http",
    title: "TCP, UDP, DNS, and HTTP",
    status: "full",
    blocks: [
      { type: "h2", text: "What a transport is for" },
      {
        type: "p",
        text: "IP delivers packets toward an interface. It does not tell two programs on that interface apart, and it does not promise order or delivery. TCP and UDP are transport protocols. They add ports so many conversations can share one IP. A port is a number from 0 to 65535. The pair of IP and port is one end of a conversation. A TCP connection is identified by a 4-tuple: source IP, source port, destination IP, destination port. Two browsers on the same laptop can both talk to 203.0.113.10 port 443 because their source ports differ.",
      },
      { type: "diagram", id: "http" },
      {
        type: "p",
        text: "The HTTP diagram is the request path: a client names a host, resolves it, opens a transport connection, and sends an HTTP message. The sections below are the part the picture cannot say precisely: handshake, UDP's reason to exist, DNS order, status codes, and TLS. Do not skip them because the arrows look familiar.",
      },
      { type: "h3", text: "The TCP three-way handshake" },
      {
        type: "ol",
        items: [
          "The client sends SYN with an initial sequence number. It is asking to synchronize state.",
          "The server sends SYN-ACK: it acknowledges the client's sequence and sends its own initial sequence number. The server now has a connection in progress.",
          "The client sends ACK of the server's sequence. Both sides now agree the connection exists, and data can flow in both directions.",
        ],
      },
      {
        type: "p",
        text: "After the handshake, TCP gives a reliable ordered byte stream. Sequence numbers detect loss and reordering. The receiver acknowledges bytes it has. The sender retransmits what was not acknowledged. A window limits how much unacknowledged data may be in flight, which is flow control. Congestion control, separate from the window the receiver advertises, slows the sender when the path is overloaded. None of that is free. Setup costs a round trip before the first byte of application data, and the kernel keeps state for every connection. Closing is its own exchange of FIN and ACK. RST aborts instead of closing cleanly. On a host you will see this as sockets in LISTEN, ESTABLISHED, and TIME_WAIT. TIME_WAIT on the side that closed is the protocol waiting to absorb delayed packets. A large TIME_WAIT count is often normal, not a leaked process.",
      },
      { type: "h3", text: "Why UDP exists" },
      {
        type: "p",
        text: "UDP sends datagrams. There is no handshake, no kernel-level retransmission, and no ordering. The header is short: source port, destination port, length, checksum. Message boundaries stay intact, which TCP does not promise, because TCP is a stream. UDP exists because some applications would rather drop a late packet than wait, and because a one-packet query should not pay for a connection. DNS queries usually use UDP port 53 for that reason. If the response is too big and the truncation bit is set, or if the exchange is a zone transfer, DNS uses TCP port 53 instead. So DNS is mostly UDP, not UDP by law. Metrics and logs often use UDP because losing one sample is cheaper than blocking the sender (StatsD is the classic example). Interactive video and voice send RTP over UDP because a retransmitted frame that arrives 400 milliseconds late is useless. QUIC, which carries HTTP/3, is built on UDP but adds its own reliability and congestion control. Do not hear UDP and conclude that HTTP/3 is an unreliable HTTP. The reliability moved into the application protocol.",
      },
      { type: "h3", text: "Ports and sockets" },
      {
        type: "ul",
        items: [
          "0-1023 are well-known ports. Binding them on Linux typically requires extra privilege. 22 is SSH, 53 is DNS, 80 is HTTP, 443 is HTTPS.",
          "1024-49151 are registered ports. 5432 for Postgres is in this range. Registration is a convention, not a lock. Any program can bind an unused port it is allowed to bind.",
          "Ephemeral ports are what clients use as source ports. On modern Linux the default range is often 32768-60999. It is a sysctl, not a law of networking.",
          "A listening socket accepts new connections. An established socket is one 4-tuple. ss shows these on the local host only.",
          "0.0.0.0:443 means every IPv4 interface on this host. 127.0.0.1:443 means only local clients. Those are different exposure decisions.",
        ],
      },
      { type: "h3", text: "DNS resolution order" },
      {
        type: "p",
        text: "Applications that call the system resolver, getaddrinfo, do not all walk the DNS hierarchy themselves. A stub resolver on the host follows Name Service Switch. On Linux that is the hosts line in /etc/nsswitch.conf. A common line is hosts: files dns, which means check /etc/hosts and then DNS. Ubuntu with systemd-resolved may list resolve earlier. The file on the machine wins. Read it. After the hosts file misses, the stub sends a query to the recursive resolver in /etc/resolv.conf, or to a local forwarder such as 127.0.0.53. That recursive resolver answers from cache or does the walk: a root name server, then the TLD servers for .com or whichever suffix, then the authoritative name servers for the zone. The answer carries a TTL. The recursive resolver caches it. dig does not follow nsswitch. dig asks a DNS server directly and ignores /etc/hosts. A green dig and a failing application can be the same name mapped in the hosts file, or a different resolver than the one dig used.",
      },
      {
        type: "ol",
        items: [
          "Application calls the stub resolver (getaddrinfo), unless the tool speaks DNS itself.",
          "NSS consults /etc/hosts if the hosts line says files before dns.",
          "Stub queries the configured recursive resolver.",
          "Recursive cache hit returns immediately, with whatever TTL remains.",
          "On a miss, recursive queries root, receives a referral to the TLD, then queries the authoritative servers.",
          "The record is cached for the TTL and returned to the stub. A second lookup inside the TTL should not repeat the walk.",
        ],
      },
      {
        type: "table",
        caption: "Record types you will actually debug",
        headers: ["Type", "Contains", "Typical mistake"],
        rows: [
          ["A", "An IPv4 address", "Expecting it to honor /etc/hosts when you used dig"],
          ["AAAA", "An IPv6 address", "Forgetting the client may prefer AAAA and reach a different path than the A record"],
          ["CNAME", "An alias to another name", "Putting other records next to a CNAME at the same name. Traditional DNS does not allow that. A zone apex usually cannot be a CNAME"],
          ["MX", "Mail exchanger: a priority and a hostname", "Pointing MX at an IP address. The target should be a name that itself has an A or AAAA"],
          ["TXT", "Text, used for SPF, DKIM, and ownership checks", "Splitting a long SPF across records incorrectly so receivers fail closed or pass the wrong policy"],
          ["NS", "Name servers authoritative for the zone", "Changing NS at the registrar and forgetting the glue or the delegation lag"],
        ],
      },
      {
        type: "callout",
        tone: "info",
        title: "dig is not the application",
        text: "dig example.com A asks a DNS resolver and prints what that resolver said. It does not read /etc/hosts, and it does not use whatever library policy the application uses. To see the system answer, use getent hosts example.com. If those two differ, believe both: they answered different questions.",
      },
      { type: "h3", text: "HTTP request and response" },
      {
        type: "p",
        text: "An HTTP request has a method, a target path, a version, headers, and sometimes a body. A response has a version, a status code, headers, and sometimes a body. HTTP/1.1 is text. HTTP/2 is binary frames and concurrent streams on one connection. HTTP/3 uses QUIC. Methods and status codes mean the same thing across those versions. GET retrieves a representation and is safe and idempotent. POST processes a body and is not idempotent: sending it twice can create two invoices. PUT replaces the resource at the URL and is idempotent. PATCH applies a partial change and is not defined as idempotent. DELETE is idempotent in intent: deleting again leaves the resource gone. HEAD is GET without a body. OPTIONS asks what the server allows. Idempotent means the effect of one successful request and several identical ones is the same. It does not mean the request is free of side effects.",
      },
      {
        type: "table",
        caption: "Status codes named individually",
        headers: ["Code", "Class", "Meaning you can defend"],
        rows: [
          ["200", "2xx success", "The request succeeded and the body, if any, is the representation"],
          ["201", "2xx success", "A resource was created. A Location header should point at it"],
          ["204", "2xx success", "Success and no body. Common for a delete or a saved form with nothing to show"],
          ["301", "3xx redirect", "Moved permanently. Clients and caches may store the new URL"],
          ["302", "3xx redirect", "Found, a temporary redirect. Historical clients turned POST into GET when following it"],
          ["304", "3xx redirect", "Not modified. A conditional GET validated the cache. The body is empty on purpose"],
          ["400", "4xx client", "The server could not parse or validate the request"],
          ["401", "4xx client", "Authentication is missing or invalid. The name Unauthorized is unfortunate. This is unauthenticated"],
          ["403", "4xx client", "The server refuses, even if it knows who you are. It is not 401"],
          ["404", "4xx client", "No resource at this URL. Sometimes used instead of 403 so existence is not leaked"],
          ["409", "4xx client", "The request conflicts with current state, such as a duplicate unique key"],
          ["429", "4xx client", "Too many requests. You are being rate limited. Retry-After may say when to try"],
          ["500", "5xx server", "The origin application failed while handling the request"],
          ["502", "5xx server", "A gateway or proxy got an invalid response from the upstream"],
          ["503", "5xx server", "Temporarily unavailable: overload, maintenance, or no healthy upstream"],
          ["504", "5xx server", "A gateway or proxy timed out waiting for the upstream"],
        ],
      },
      {
        type: "p",
        text: "2xx means the server did the thing. 3xx means look elsewhere or use your cache. 4xx means the client should not retry the same bytes unchanged, except for 429 where waiting is the point, and except for 408 which this table does not need. 5xx means the client may retry if the method is safe, because the server or a proxy failed. Retrying a POST after a 500 can duplicate a payment if the first attempt actually committed. That is why idempotency keys exist. 502 and 504 are proxy errors: the thing you connected to is not the thing that crashed, or not the only thing. 500 is the upstream application itself. 503 is a refusal to serve right now, sometimes honest capacity protection.",
      },
      { type: "h3", text: "HTTPS is HTTP over TLS" },
      {
        type: "p",
        text: "HTTPS is not a different HTTP. It is HTTP on top of TLS. For HTTP/1.1 and HTTP/2 the stack is TCP, then a TLS handshake, then HTTP. TLS 1.3 can resume faster, but the model is the same: confidentiality and integrity for the bytes, plus authentication of the server via a certificate. The certificate chain is how the client decides to trust that certificate. The leaf is the server certificate. Its subject alternative names must match the hostname you asked for. An intermediate certificate authority signs the leaf. A root certificate authority signs the intermediate and lives in the client's trust store. The server sends the leaf and the intermediates. It usually does not send the root, because the client already has roots, and a root sent on the wire is not why you trust it. SNI, Server Name Indication, is a TLS extension in the ClientHello that carries the hostname so one IP can present the certificate for the name you asked for, before any HTTP Host header exists.",
      },
      {
        type: "callout",
        tone: "danger",
        title: "SSL and TLS are not two names for one generation",
        text: "SSL 2.0 and SSL 3.0 are obsolete protocols. SSL 3.0 is forbidden by RFC 7568. TLS 1.0 and TLS 1.1 are deprecated by RFC 8996. Current practice is TLS 1.2 or TLS 1.3. People still say SSL certificate for an X.509 certificate used by TLS. The certificate is not the protocol. If a scanner says SSL 3.0 is enabled, that is a defect, not a synonym for encrypted.",
      },
      { type: "h3", text: "curl and dig" },
      {
        type: "p",
        text: "These examples assume a Linux userland with curl and bind's dig, which is the usual package on Debian, Ubuntu, and Fedora. The addresses in the sample output are documentation addresses, not a lookup you should expect to reproduce. example.com is reserved for documentation, and 203.0.113.0/24 is TEST-NET-3.",
      },
      {
        type: "code",
        lang: "bash",
        title: "Fetch response headers, discard the body",
        code: `curl -sS -D - -o /dev/null --max-time 10 https://example.com/`,
      },
      {
        type: "code",
        lang: "text",
        title: "What a successful header dump looks like",
        code: `HTTP/2 200
content-type: text/html; charset=UTF-8
date: Fri, 31 Oct 2026 12:00:00 GMT`,
        note: "Illustrative output — not captured from a live run in this environment.",
      },
      {
        type: "code",
        lang: "bash",
        title: "Ask a resolver for an A record and ignore /etc/hosts",
        code: `dig app.internal.example A +noall +answer`,
      },
      {
        type: "code",
        lang: "text",
        title: "An answer section, using a documentation address",
        code: `app.internal.example.  60  IN  A  203.0.113.10`,
        note: "Illustrative output — not captured from a live run in this environment.",
      },
      {
        type: "p",
        text: "curl proving HTTP/2 200 proves that name resolution, TCP, TLS, and an HTTP response all worked for that URL, from this host, at this moment. It does not prove the rest of the product is healthy. A 200 on /healthz can sit next to a database that is down if the probe does not check the database. dig proving an A record proves the resolver you asked returned that record with a 60-second TTL. It does not prove the host is reachable, and it does not prove getaddrinfo will return the same address.",
      },
      { type: "h3", text: "Forward proxy, reverse proxy, load balancer" },
      {
        type: "table",
        caption: "Three middleboxes people mix up",
        headers: ["Kind", "Who points at it", "What the client thinks", "What it decides"],
        rows: [
          [
            "Forward proxy",
            "The client, or a policy that forces the client",
            "I am sending this to my proxy so it will fetch the origin",
            "Egress allow lists, caching, which outside host may be contacted",
          ],
          [
            "Reverse proxy",
            "The service owner, via DNS for the public name",
            "I am talking to the origin",
            "Host and path routing, TLS termination, hiding internal addresses",
          ],
          [
            "Load balancer",
            "The service owner, via a virtual address",
            "I am talking to one service",
            "Which healthy backend gets this connection",
          ],
        ],
      },
      {
        type: "p",
        text: "A layer-7 load balancer is usually also a reverse proxy: it speaks HTTP, can route on the path, and can present the certificate. A layer-4 load balancer forwards TCP or UDP without understanding HTTP, so it cannot route on a URL path and it is not an HTTP reverse proxy. Health checks decide membership in the backend pool. A forward proxy is the opposite direction: it is how an inside client leaves, not how outside clients enter. Adding a reverse proxy inserts a new place for 502 and 504. When those appear, the proxy reached an upstream that answered badly or not in time. The proxy process itself is up, which is why you got an HTTP response at all.",
      },
    ],
    exercise: {
      title: "Read one failure without guessing",
      prompt:
        "You are on a Debian or Ubuntu host with curl, dig, and getent. A user says the app is down. You have only the illustrative results below, clearly not from production: dig returns 203.0.113.10 for app.internal.example, getent hosts returns 10.1.8.10 for the same name, and curl to https://app.internal.example/invoices returns HTTP 502 from a proxy header. Write what each fact proves.",
      steps: [
        "State what dig proved and why it did not consult /etc/hosts.",
        "State why getent and dig disagree, in terms of NSS versus a DNS query.",
        "Give the 4-tuple fields of a TCP connection from your laptop to the proxy on port 443. Use 10.1.8.50 as a fake client address and 51514 as a fake ephemeral port.",
        "Classify 502, and say how it differs from 500 and from 504.",
        "Say whether this evidence proves the database is down.",
      ],
      criteria: [
        "dig is described as a direct DNS query that skips the hosts file.",
        "The disagreement is explained by getent using system resolution, which can hit /etc/hosts or a different resolver.",
        "The 4-tuple is 10.1.8.50, 51514, the proxy address you chose, and 443, with protocol TCP.",
        "502 is an invalid upstream response to a proxy, 500 is the application, 504 is an upstream timeout.",
        "The writeup explicitly says the database is not proven down.",
      ],
    },
    checks: [
      {
        q: "List the TCP three-way handshake and one reason DNS usually uses UDP anyway.",
        a: "SYN, SYN-ACK, ACK. TCP then provides an ordered, retransmitted byte stream, which costs a round trip and connection state. DNS queries are small and numerous, so the common case is one UDP datagram to port 53 and one reply, with no handshake. If the answer is truncated, DNS retries over TCP 53. UDP's lack of reliability is acceptable for a query the stub can simply resend. It is not a statement that every protocol on UDP is unreliable: QUIC adds reliability on top.",
      },
      {
        q: "What is the difference between 401, 403, 404, and 409?",
        a: "401 means valid authentication credentials were not provided. The status text says Unauthorized, but the condition is unauthenticated. 403 means the server refuses to fulfill the request. It may know exactly who you are and still refuse. 404 means nothing at that URL, and some servers return it instead of 403 to avoid confirming the resource exists. 409 means the request is understood and the current state conflicts, such as creating a row that violates a unique key. Retrying a 401 without credentials will not help. Retrying a 409 without changing the request usually will not either.",
      },
      {
        q: "A reverse proxy returns 504 for POST /invoices. What failed, and what does the TLS certificate chain have to do with it?",
        a: "504 means the proxy did not receive a timely response from the upstream. The proxy process is answering you, so this is not a TCP failure to the proxy and not automatically a 500 inside application code you never reached. The certificate chain is how your client trusted the proxy, if you used HTTPS: leaf for the name, intermediates sent by the server, root already in the trust store. SNI told the proxy which certificate to use. A successful TLS handshake can still end in 504, because TLS ended before the upstream was slow. The chain does not explain the timeout. It explains why you were willing to send the POST.",
      },
      {
        q: "Why can dig return an address the application does not use?",
        a: "dig queries DNS directly and ignores /etc/hosts and the rest of Name Service Switch. Applications use getaddrinfo, which follows nsswitch.conf. If hosts: files dns lists a different address in /etc/hosts, or if the stub resolver is systemd-resolved and dig was pointed at another server, the answers differ. TTL and multiple A records add another split: dig printed one answer, and the application is free to try them in its own order. Check getent hosts when the question is what this host will call.",
      },
    ],
    interview: [
      {
        q: "Walk through what happens when you open https://app.example/invoices.",
        a: "The system resolver checks nsswitch, often the hosts file first, then a recursive DNS resolver, which may walk root, TLD, and authoritative servers for an A or AAAA record. My client opens TCP to that IP on port 443: SYN, SYN-ACK, ACK. Then TLS runs. SNI carries the hostname so the server can pick a certificate. I trust a leaf because an intermediate signs it and a root in my trust store signs that chain. Only then does HTTP go out: GET /invoices. A 200 is success. A 401 means I did not authenticate. A 403 means I am refused. A 502 or 504 means a proxy had trouble with the upstream, invalid response versus timeout. HTTPS is HTTP over TLS, not a separate HTTP, and SSL 3.0 is not the current version of that handshake. TLS 1.2 or 1.3 is.",
      },
      {
        q: "When would you choose UDP instead of TCP?",
        a: "When a handshake and retransmission would cost more than they are worth. DNS queries are the everyday case, UDP 53, with TCP 53 as the fallback for large answers. Voice and video would rather drop a packet than stall for a retransmission. Some metrics agents use UDP for the same reason. I would not choose UDP for an invoice payment API. I also would not say HTTP/3 is unreliable just because QUIC runs over UDP. QUIC implements reliability itself.",
      },
      {
        q: "What is the difference between a forward proxy, a reverse proxy, and a load balancer?",
        a: "A forward proxy is configured by the client. Traffic leaves through it, and it enforces egress policy. A reverse proxy sits in front of servers. The client thinks it is the origin. It terminates HTTP or TLS and routes by host and path. A load balancer chooses a healthy backend for a virtual address. At layer 7 it is usually also a reverse proxy. At layer 4 it only forwards TCP or UDP and does not understand URLs. 502 and 504 are signs I reached a proxy and the upstream failed or timed out. They are not synonyms for 500.",
      },
    ],
    takeaways: [
      "TCP's handshake is SYN, SYN-ACK, ACK, then a reliable ordered stream. UDP is datagrams without that machinery, which is why DNS and realtime media use it.",
      "A connection is a 4-tuple. Ports separate programs. dig is not the system resolver and skips /etc/hosts.",
      "DNS record types in this lesson: A, AAAA, CNAME, MX, TXT, NS. The recursive resolver walks root, TLD, then authoritative servers on a cache miss.",
      "401 is unauthenticated, 403 is refused, 404 is missing, 409 conflicts, 429 is rate limit. 500 is the app. 502 and 504 are proxy upstream failures.",
      "HTTPS is HTTP over TLS. Trust is leaf, intermediate, root. SSL 3.0 is not a generation of TLS. SNI carries the hostname in the handshake.",
    ],
  },
  {
    slug: "routing-nat-security",
    title: "Routing, NAT, and security",
    status: "primer",
    blocks: [
      { type: "h2", text: "A host forwards by its routing table" },
      {
        type: "p",
        text: "When a host sends a packet, it picks a route with longest prefix match. More specific prefixes beat less specific ones. A connected route for 10.1.8.0/26 on eth0 beats a default route for 0.0.0.0/0. The default gateway is the next hop used when the only match is the default route: traffic that is not on-link and not covered by a more specific static or dynamic route. The gateway must itself be reachable on a connected network, otherwise you cannot ARP for it. On Linux you print this table with ip route, from iproute2, not with the legacy route command from net-tools, which may be uninstalled.",
      },
      {
        type: "code",
        lang: "text",
        title: "A small table and the match for 203.0.113.10",
        code: `10.1.8.0/26 dev eth0 proto kernel scope link src 10.1.8.10
10.8.0.0/16 via 10.1.8.1 dev eth0
0.0.0.0/0 via 10.1.8.1 dev eth0`,
        note: "Illustrative output — not captured from a live run in this environment.",
      },
      {
        type: "p",
        text: "A packet to 10.1.8.20 matches the connected /26 and is ARPed directly. A packet to 10.8.4.4 matches 10.8.0.0/16 and is sent to 10.1.8.1, even though the default route points at the same gateway. A packet to 203.0.113.10 matches only the default. If 10.8.0.0/16 disappeared, 10.8.4.4 would follow the default and might leave the building, which is how a missing route becomes a data leak or a black hole depending on the firewall upstream.",
      },
      { type: "h3", text: "Firewall, security group, and NACL" },
      {
        type: "p",
        text: "These are three different filters. A host firewall runs in the operating system. On Linux that is nftables, often still managed through iptables rules. It sees packets the host actually receives or sends. A cloud security group, in AWS terms, is attached to the network interface. It is stateful and allow-only: if you allow inbound TCP 443, the response packets are allowed because the connection is tracked. You do not write a separate outbound rule for that response. A network ACL in AWS is attached to the subnet, is stateless, and has numbered allow and deny rules. Return traffic is a separate direction. If you allow inbound 443 and forget outbound ephemeral ports, the handshake never completes even though the security group looks open. Other clouds split the same ideas under other names. Do not paste AWS NACL rules into a mental model of an Azure NSG, which is stateful and can deny. The host firewall still matters after the cloud filters. A security group that allows 443 does not start a process, and a process bound to 127.0.0.1 is still unreachable from the VPC.",
      },
      {
        type: "table",
        caption: "Where a packet can be dropped",
        headers: ["Control", "Attached to", "State", "Can deny explicitly?"],
        rows: [
          ["Host firewall (nftables)", "The operating system", "Depends on the rules you wrote. Connection tracking is available", "Yes"],
          ["AWS security group", "The elastic network interface", "Stateful", "No. The default is deny, and you add allows"],
          ["AWS network ACL", "The subnet", "Stateless", "Yes. First matching numbered rule wins"],
        ],
      },
      { type: "h3", text: "SSH is not a VPN" },
      {
        type: "p",
        text: "SSH is an authenticated, encrypted session to one host, TCP port 22 by default. You get a shell or a forwarded port. A local forward, ssh -L, tunnels one TCP port through that session. It does not put your laptop on the remote network. A VPN, such as WireGuard or IPsec, is a tunnel that routes prefixes. After it is up, packets to 10.8.0.0/16 go through the tunnel because your routing table says so. You still authenticate to each service behind it. A VPN is not a substitute for SSH keys, and SSH is not a substitute for a site-to-site tunnel when every developer needs routes, not one shell. Leaving SSH open to 0.0.0.0/0 and calling the VPN project later is how the host gets scanned continuously. Prefer a small source prefix, a bastion, or the VPN, plus keys.",
      },
      { type: "h3", text: "Least-open ports" },
      {
        type: "ul",
        items: [
          "Start from default deny inbound. Add a port only when a process must accept connections.",
          "Restrict the source. Port 443 may need the Internet. Port 22 and Postgres 5432 should not. Use a bastion prefix, a VPN prefix, or a security group that only the app tier holds.",
          "Bind intentionally. 127.0.0.1 when only local clients are valid. A private interface when only the VPC is valid.",
          "Opening a port does not prove a healthy service. It proves the filter allows packets. ss on the host proves something is listening. A curl from the real client network proves the path.",
          "Egress is part of least privilege too. A host that can talk to every address on the Internet can ship data there. Many teams start with inbound because that is where scans show up. Mature networks also limit outbound.",
        ],
      },
      {
        type: "callout",
        tone: "warn",
        title: "NAT still is not the firewall",
        text: "Source NAT hides internal addresses and shares a public IPv4 address. It does not replace a deny-inbound rule. A port forward through the same device is an inbound allow with extra steps. When you review a design, list the security group, the NACL if any, the host firewall, and the NAT mapping as separate lines. One of them being strict does not make the others strict.",
      },
    ],
    exercise: {
      title: "Match a route and a filter",
      prompt:
        "Use the routing table in this lesson. Decide the next hop, then choose the narrowest inbound rule you can defend.",
      steps: [
        "For destinations 10.1.8.20, 10.8.4.4, and 203.0.113.10, name the route that wins and why.",
        "The host serves HTTPS to the Internet and SSH to a VPN prefix 10.8.0.0/16 only. Write the two inbound allows. State what you do not open.",
        "Say whether an AWS NACL needs an explicit outbound rule for the SSH return traffic, and why a security group does not.",
        "A teammate suggests ssh -L instead of a VPN so laptops can reach the whole 10.8.0.0/16. Say why that does not meet the requirement.",
      ],
      criteria: [
        "10.1.8.20 is on-link. 10.8.4.4 uses 10.8.0.0/16 via 10.1.8.1. 203.0.113.10 uses the default route. Longest prefix is named.",
        "443 is allowed from the Internet only if the product must be public. 22 is allowed only from 10.8.0.0/16, not from 0.0.0.0/0. 5432 is not opened.",
        "The NACL is described as stateless, so return traffic needs an explicit rule. The security group is stateful.",
        "ssh -L is described as one TCP port through one session, not a routed prefix.",
      ],
    },
    checks: [
      {
        q: "Which route wins for 10.8.4.4 if the host has both 10.8.0.0/16 via 10.1.8.1 and a default route via 10.1.8.1?",
        a: "10.8.0.0/16 wins by longest prefix match, even though the next hop happens to be the same gateway. The default route is the fallback for destinations that match nothing longer. If the /16 were removed, 10.8.4.4 would follow the default, which may be a different security path entirely. Same next hop does not mean same route.",
      },
      {
        q: "You allow inbound TCP 443 in an AWS security group and in a subnet NACL. Clients still time out. What did the stateless control forget?",
        a: "The NACL must allow the return direction explicitly. Responses to clients use ephemeral destination ports and leave as outbound packets. A stateless NACL that allows only inbound 443 drops those replies. The security group does not need that extra rule because it is stateful and tracks the connection. Also check that something is listening, and that the host firewall agrees. The security group being open does not create a listener.",
      },
    ],
    interview: [
      {
        q: "How do a default route, a security group, and a NACL differ, and where does SSH fit?",
        a: "The routing table picks a next hop by longest prefix match. The default route, 0.0.0.0/0, is only used when nothing more specific matches. A security group in AWS is a stateful allow list on the interface. A NACL is a stateless allow and deny list on the subnet, so return traffic needs its own rule. I still want a host firewall. SSH is an encrypted login to one host, or a single port forward. It is not a VPN. A VPN installs routes so a whole prefix is reachable, and I would still restrict port 22 to that prefix instead of opening it to the world.",
      },
    ],
    takeaways: [
      "Longest prefix match picks the route. The default gateway is only the fallback.",
      "AWS security groups are stateful and allow-only. AWS NACLs are stateless and can deny. The host firewall is a third filter.",
      "SSH is one host session, not a VPN. Open the smallest port set from the smallest source. NAT does not do that for you.",
    ],
  },
  {
    slug: "network-commands",
    title: "Network commands",
    status: "primer",
    blocks: [
      { type: "h2", text: "Each command proves one fact" },
      {
        type: "p",
        text: "These commands are for a Debian or Ubuntu host with iproute2 and iputils, which is the normal case on Ubuntu 24.04. ip and ss come from iproute2. ping and tracepath come from iputils. dig comes from the bind9-dnsutils package on Debian and Ubuntu, and from bind-utils on Fedora. traceroute is a separate package, often not installed. netstat and ifconfig belong to net-tools. Prefer ss and ip. They are what current images ship. A command that fails because it is not installed proves nothing about the network.",
      },
      {
        type: "table",
        caption: "What the result is evidence of",
        headers: ["Command", "Proves, when it succeeds", "Does not prove"],
        rows: [
          ["ping", "ICMP echo reached something that replied, and the reply returned. You get an RTT", "That the host is down if ping fails. ICMP is often filtered. Not TCP, not DNS, not the application"],
          ["curl", "DNS if you used a name, TCP, TLS if HTTPS, and an HTTP status from whoever answered", "That the whole product is healthy. A 200 can be a shallow health URL"],
          ["dig", "The resolver you queried returned a DNS answer for that name and type", "What /etc/hosts or the application resolver will return. Reachability of the address"],
          ["ss", "Sockets on this host now. With privileges, the process", "A remote host's ports, or that a security group allows the port"],
          ["ip addr", "Addresses and prefix lengths configured on local interfaces", "That those addresses are reachable from anywhere else. Routes. That is ip route"],
          ["tracepath or traceroute", "Hops that replied to the probe, with a latency estimate", "The exact path of a TCP 443 flow. A silent hop may be filtering probes and still forwarding"],
        ],
      },
      { type: "h3", text: "ping" },
      {
        type: "code",
        lang: "bash",
        title: "ICMP echo to a documentation address",
        code: `ping -c 2 -n 203.0.113.10`,
      },
      {
        type: "code",
        lang: "text",
        title: "Two replies",
        code: `PING 203.0.113.10 (203.0.113.10) 56(84) bytes of data.
64 bytes from 203.0.113.10: icmp_seq=1 ttl=55 time=12.4 ms
64 bytes from 203.0.113.10: icmp_seq=2 ttl=55 time=11.9 ms

--- 203.0.113.10 ping statistics ---
2 packets transmitted, 2 received, 0% packet loss, time 1001ms`,
        note: "Illustrative output — not captured from a live run in this environment.",
      },
      {
        type: "p",
        text: "203.0.113.10 will not answer on the public Internet. The sample only shows the shape of a success. If your real ping prints 100 percent loss, you know ICMP did not come back. You do not know that SSH or HTTPS is down. If it prints replies, you know something at that address answered ICMP. You do not know a TLS certificate is valid.",
      },
      { type: "h3", text: "curl and dig" },
      {
        type: "code",
        lang: "bash",
        title: "Status line only, then a DNS answer",
        code: `curl -sS -D - -o /dev/null --max-time 10 https://example.com/
dig example.com A +noall +answer`,
      },
      {
        type: "code",
        lang: "text",
        title: "Header and answer, documentation data",
        code: `HTTP/2 200
content-type: text/html

example.com.    3600    IN    A    203.0.113.50`,
        note: "Illustrative output — not captured from a live run in this environment.",
      },
      {
        type: "p",
        text: "curl -D - prints response headers. -o /dev/null drops the body so you can see the status without a page of HTML. --max-time 10 stops a hang from becoming your afternoon. dig +noall +answer shows the records without the commentary. Add @127.0.0.53 or @1.1.1.1 when you need to say which resolver you asked. If you forget, dig uses the first nameserver in resolv.conf, which may be a stub that forwards elsewhere.",
      },
      { type: "h3", text: "ss and ip addr" },
      {
        type: "code",
        lang: "bash",
        title: "Listeners and local addresses",
        code: `sudo ss -lptn
ip -br addr show`,
      },
      {
        type: "code",
        lang: "text",
        title: "A host listening on SSH and HTTPS",
        code: `State  Recv-Q Send-Q Local Address:Port Peer Address:Port Process
LISTEN 0      4096      0.0.0.0:22        0.0.0.0:*    users:(("sshd",pid=812,fd=3))
LISTEN 0      511       0.0.0.0:443       0.0.0.0:*    users:(("nginx",pid=990,fd=6))

lo               UNKNOWN        127.0.0.1/8 ::1/128
eth0             UP             10.1.8.10/26`,
        note: "Illustrative output — not captured from a live run in this environment.",
      },
      {
        type: "p",
        text: "ss -l shows listening sockets, -p the process, -t TCP, -n numbers instead of names. Without sudo, -p is often blank for other users' processes. This output proves sshd and nginx are listening on all IPv4 interfaces of this host. It does not prove a security group allows 22 or 443, and it does not prove a remote client can route to 10.1.8.10. ip -br addr proves the address configuration. It does not print the default route. Use ip route for that. Prefer ss over netstat. On a minimal Ubuntu, netstat is simply absent.",
      },
      { type: "h3", text: "tracepath" },
      {
        type: "p",
        text: "tracepath is usually present via iputils and does not need a raw socket the way classic traceroute often does. traceroute may need sudo apt install traceroute on Debian or Ubuntu, or sudo dnf install traceroute on Fedora. Both show who answered a probe. They do not show a hop that chose to stay quiet.",
      },
      {
        type: "code",
        lang: "text",
        title: "tracepath -n 203.0.113.10",
        code: ` 1?: [LOCALHOST]                      pmtu 1500
 1:  10.1.8.1                           0.4ms
 2:  198.51.100.1                       8.1ms
 3:  no reply`,
        note: "Illustrative output — not captured from a live run in this environment.",
      },
      {
        type: "callout",
        tone: "tip",
        title: "Order the checks so each one rules something out",
        text: "If a name fails, start with getent hosts and dig so you know whether it is NSS or DNS. If the address is known, curl or a TCP client tells you about the port. ping is optional and inconclusive when it fails. ss belongs on the server, not on your laptop, because it shows the server's sockets. tracepath is for where along a path probes die, not for the first question.",
      },
    ],
    exercise: {
      title: "Pick the command that matches the claim",
      prompt:
        "For each claim, name the command you would run on Ubuntu 24.04 and the result that would still not make the claim true.",
      steps: [
        "Claim: DNS for app.internal.example is broken. Choose dig or ping, and say what you would compare it with.",
        "Claim: nothing is listening on port 443 on this server. Choose ss or curl from your laptop.",
        "Claim: this host has address 10.1.8.10/26. Choose ip addr or ip route.",
        "Claim: the default gateway is reachable at layer 3. Say what ping to the gateway proves, and why a later hop can still fail.",
        "Claim: the path to 203.0.113.10 is broken at hop 3 because tracepath printed no reply. Say why that claim is too strong.",
      ],
      criteria: [
        "DNS is checked with dig compared to getent, not with ping alone.",
        "A local listener is checked with ss on that host. A remote curl failing does not prove the process is down.",
        "The address is ip addr. The gateway is ip route.",
        "A silent traceroute hop is described as filtered probes, not automatically as the fault.",
        "Package assumptions mention iproute2, and do not depend on netstat being installed.",
      ],
    },
    checks: [
      {
        q: "ping to a host fails with 100 percent loss. What do you know?",
        a: "ICMP echo did not get a reply. You do not know that the host is down. Security groups, host firewalls, and upstream filters drop ICMP constantly while TCP 443 still works. You also do not know DNS was involved if you pinged an IP. The next check is the actual protocol, for example curl to the URL, or ss on the host if you can log in through another path.",
      },
      {
        q: "ss -lptn on the server shows 0.0.0.0:443. A teammate still cannot connect. Name two facts this does not prove.",
        a: "It does not prove a security group, NACL, or corporate firewall allows the teammate's source IP. It does not prove a route from their network to this address exists. It also does not prove TLS will succeed, because ss only shows the TCP listener. Listening on all interfaces is necessary and not sufficient. Check the path from the client that actually fails, not only from localhost.",
      },
    ],
    interview: [
      {
        q: "A user says the site is down. Which commands do you run, and what does each one fail to prove?",
        a: "I start with the URL: curl -D - so I can see a status or a DNS or TLS error. If the name looks wrong, I compare dig, which skips /etc/hosts, with getent hosts, which uses the system resolver. ping is optional. If it fails I do not declare the host dead, because ICMP is often filtered. On the server I run ss -lptn to see if anything listens, and ip -br addr plus ip route to see address and default gateway. tracepath is for a path question, and a hop that prints stars may be filtering probes rather than dropping traffic. I prefer ss and ip over netstat and ifconfig because minimal Ubuntu images ship iproute2, not net-tools.",
      },
    ],
    takeaways: [
      "ping proves ICMP replies only. Failure does not prove the service is down.",
      "curl proves an HTTP conversation. dig proves a DNS answer from the resolver you asked, not what /etc/hosts contains.",
      "ss and ip show this host's sockets and addresses. A silent traceroute hop is not automatically the broken router. Prefer them over netstat.",
    ],
  },
];
