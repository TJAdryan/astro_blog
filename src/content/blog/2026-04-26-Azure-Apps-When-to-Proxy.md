---
title: "Azure Apps: When to Proxy and When to Steer"
description: "A comparison between Azure Front Door and Azure Traffic Manager for global traffic routing."
pubDate: "2026-04-26T00:00:00-04:00"
tags: ["Azure", "Architecture", "Networking", "Front Door", "Traffic Manager"]
category: "Cloud"
draft: false
---

When designing multi-region applications, the architectural choice for global traffic usually narrows down to two options. While the services overlap in intent, the mechanical distinctions are significant depending on the workload requirements. I usually run these types of architectural questions by my friend Aaron, but since we haven't crossed paths in a while, I had to dive into the documentation myself. When I eventually get a chance to grill him on this, I suspect a few revisions might follow, but the core divide is clear: it is a choice between a proxy and a navigator.

If you haven't thought about the OSI model in a while, you might want to brush up on how these layers dictate traffic flow. A solid refresher can be found at the [Cloudflare Learning Center](https://www.cloudflare.com/learning/ddos/glossary/open-systems-interconnection-model-osi/).

### The Proxy: Azure Front Door
Azure Front Door operates as a Layer 7 (HTTP/HTTPS) reverse proxy. It does not just point a user to a destination; it sits in the middle of the conversation.

When a client initiates a request, they aren't connecting to your origin server—they are connecting to the nearest Microsoft Point of Presence (POP). Front Door terminates the SSL/TLS handshake right there at the edge. This is what's known as Split TCP. By handling the heavy lifting of the connection setup locally and then using a warmed pool of connections to talk to your backend over Microsoft’s private fiber, it bypasses much of the congestion of the public internet.

Because it understands the application layer, it can perform tasks a simple router cannot:

* **Web Application Firewall (WAF):** It scrubs traffic for SQL injection or DDoS signatures before a single packet hits your internal network.
* **Path-Based Routing:** It can look at the URL and decide that `/api` should go to one cluster while `/static` content is served from a cache.
* **SSL Offloading:** Your backend servers are spared the compute overhead of managing certificates because the encryption is handled at the edge.

### The Navigator: Azure Traffic Manager
If Front Door is a proxy that stays in the room for the whole conversation, Azure Traffic Manager is a navigator that gives you directions and then leaves. It operates at the DNS level (Layer 4).

When a client asks for your application's address, Traffic Manager looks at the health and location of your endpoints and hands back an IP address. Once the client has that IP, they connect directly to your backend. Traffic Manager never touches the actual data.

This makes it the necessary choice for specific scenarios:

* **Non-Web Protocols:** If you are running gaming servers, SFTP, or custom TCP/UDP services, Front Door can’t help you. Traffic Manager is protocol-agnostic because it only cares about the DNS query.
* **Direct Connectivity:** If your architecture requires the backend to see the client's actual source IP without digging through headers like `X-Forwarded-For`, a direct connection is the only way.
* **Zero Overhead:** There is no proxy latency. Once the DNS resolution is finished, the connection is as fast as the path between the client and the server allows.

### Comparison of Technical Constraints

| Feature | Azure Front Door | Azure Traffic Manager |
| :--- | :--- | :--- |
| **OSI Layer** | Layer 7 (HTTP/HTTPS) | Layer 4 (DNS) |
| **Traffic Handling** | Reverse Proxy / Anycast | DNS redirection |
| **SSL/TLS Termination** | At the edge (Offloading) | At the backend (Passthrough) |
| **Failover Detection** | Near-instant via probe | Dependent on DNS TTL |

### Selecting the Path
The decision is essentially governed by the protocol. For modern web applications where security, caching, and SSL performance are priorities, Azure Front Door is the standard entry point. However, for any workload that moves outside the HTTP stack or requires the leanest possible connection path, Azure Traffic Manager provides the necessary steering.

In enterprise environments, these are often used in tandem: Front Door secures the web-facing application, while Traffic Manager manages the global health and failover of the underlying infrastructure services.
