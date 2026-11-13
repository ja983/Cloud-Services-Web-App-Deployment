# Cloud-Services-Web-App-Deployment

🏗️ Objective 1: Core Cloud Infrastructure & Services

Compute Services Paradigms Cloud compute abstracts physical hardware into flexible, on-demand processing units. Choosing the right abstraction level dictates your operational overhead and cost profile:
Infrastructure as a Service (IaaS): Provisioning raw virtual machines (e.g., AWS EC2, GCP Compute Engine). You retain full root/administrative control over the OS, runtime environment, and patches, but manage security hardening and scaling manually.

Platform as a Service (PaaS): Managed application environments (e.g., Heroku, AWS Elastic Beanstalk). You deploy source code or containers while the cloud provider manages OS provisioning, load balancing, and runtime patching.

Serverless / Function as a Service (FaaS): Event-driven execution (e.g., AWS Lambda, Google Cloud Functions). Code runs in stateless containers triggered by HTTP requests or events; you pay only for exact execution millisecond counts with zero server management.

Object Storage Object storage (e.g., AWS S3, Google Cloud Storage) organizes data as discrete, immutable "objects" within flat "buckets" rather than a hierarchical file system.
Scalability & Durability: Designed for near-infinite horizontal scaling and extremely high durability (e.g., 99.999999999% or "11 nines" durability).

Access Control & Security: Relies on bucket policies, Access Control Lists (ACLs), and explicit "Block Public Access" settings to prevent accidental data leaks.

Metadata & Lifecycle Rules: Objects store custom key-value metadata and can automatically transition to cheaper cold storage tiers (like Glacier or Archive) or expire after set periods.

Managed Databases Unlike self-hosted databases where you handle backups, replication, and failovers, Managed Relational Databases (e.g., AWS RDS, Cloud SQL) automate operational burdens:
High Availability (HA): Automated multi-region or multi-AZ standby replicas for instant failover if a primary node crashes.

Automated Maintenance: Scheduled rolling security patches, minor version upgrades, and automated point-in-time backups.

Isolation: Databases are typically deployed inside private subnets with no direct public internet exposure, reachable only by authenticated compute instances.

Virtual Networking (Virtual Private Cloud - VPC) A VPC is your isolated, private network inside a public cloud provider. It partitions your infrastructure using several core components:
Subnets (Public vs. Private): Public subnets have a route table pointing to an Internet Gateway (IGW), housing resources like load balancers or bastion hosts. Private subnets have no direct route to the internet, housing sensitive components like databases and backend workers.

NAT Gateways: Allow resources in private subnets to initiate outbound connections (e.g., to fetch software updates) without exposing them to inbound internet traffic.

Security Groups & Network ACLs: Stateful firewall rules evaluated at the instance level (Security Groups) and stateless rules evaluated at the subnet level (Network ACLs) to enforce strict traffic whitelisting.

IAM (Identity and Access Management) IAM governs authentication (who you are) and authorization (what you can do).
Principle of Least Privilege: Users, services, and roles must only be granted the absolute minimum permissions required to perform their specific tasks.

IAM Roles vs. Users: Instead of embedding static user credentials into applications, compute instances assume an IAM Role dynamically via secure temporary security tokens.

Cloud Monitoring & Observability Observability provides visibility into system health across three core pillars:
Metrics: Numerical time-series data (e.g., CPU utilization, memory pressure, request latency).

Logs: Discrete textual events emitted by applications and infrastructure.

Traces: End-to-end tracking of requests as they traverse distributed microservices.

🔒 Objective 2: Secure Environment, Secrets, Logging, and Quotas

Environment Variables & Configuration Management Configuration should be strictly decoupled from application source code following The Twelve-Factor App methodology.
Separation of Concerns: Code remains identical across environments (dev, staging, production); only the environment variables change.

Injection: Configuration values (database URLs, feature flags, node environments) are injected into the runtime environment at startup rather than hardcoded into config files.

Secrets Management Hardcoding database passwords, API bearer tokens, or private keys in Git repositories is a critical security vulnerability.
Dedicated Vaults: Enterprise cloud providers use specialized secret management services (e.g., AWS Secrets Manager, GCP Secret Manager, HashiCorp Vault) featuring encryption at rest (using KMS keys), fine-grained IAM access control, and automated secret rotation.

Dynamic Fetching: Applications fetch secrets securely over encrypted channels at boot time or on-demand rather than storing them in plain text on disk.

Application Logging Best Practices Structured Logging (JSON): Emitting logs as structured JSON objects allows cloud log parsers to easily index keys (e.g., timestamp, level, userId, errorCode) for powerful querying and filtering.
Log Levels: Adhering strictly to log severity levels (DEBUG, INFO, WARN, ERROR, FATAL) prevents log pollution while ensuring critical failures are flagged.

Log Aggregation: Standard output (stdout/stderr) streams are captured by local logging daemons and forwarded asynchronously to centralized logging backends (e.g., CloudWatch Logs, Datadog, ELK stack).

Resource Quotas & Cost Governance Cloud environments can easily accumulate runaway costs due to misconfigured autoscaling or orphaned resources.
Service Quotas / Limits: Hard upper boundaries imposed by cloud providers on resources (e.g., maximum active EC2 instances, database IOPS limits) to prevent accidental resource exhaustion or malicious denial-of-wallet attacks.

Budget Alerts: Automated cost anomaly detection and notification thresholds that alert engineering teams when spending exceeds predicted trajectories.

# Cloud Services & Web Application Deployment

A practical demonstration of deploying a 3-tier Node.js and PostgreSQL web application on cloud compute infrastructure with virtual networking, managed databases, object storage, and security best practices.

## Architecture Diagram
`Application Code (EC2) <---> Managed Database (RDS PostgreSQL) <---> Object Storage (S3)`

## Features
- Fully configured VPC with public and private subnets.
- Managed PostgreSQL integration with restricted Security Group access.
- Systemd/PM2 process management with Nginx reverse proxy.
- Health check monitoring endpoint (`/health`).

## Setup & Deployment Steps
1. Provision cloud networking and database instances.
2. Clone repository: `git clone https://github.com/<your-username>/cloud-webapp-deployment.git`
3. Configure environment parameters in `.env`.
4. Install dependencies and start server: `npm install && pm2 start server.js`
5. Configure Nginx reverse proxy to forward traffic to port `3000`.

## Health Check
Access http://<SERVER_IP>/health to view system operational metrics.
