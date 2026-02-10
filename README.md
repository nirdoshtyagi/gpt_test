# DataForSEO SERP Enterprise Platform (MongoDB)

Production-oriented starter platform for managing DataForSEO SERP tasks with a local MongoDB backend, user/project governance, and postback-based result ingestion.

## What this build includes

- User management (role-based: `admin`, `manager`, `analyst`).
- Project management (owner + members).
- SERP task submission for **Google Organic** through DataForSEO `task_post`.
- Postback receiver endpoint (`/webhooks/dataforseo/postback`) that stores payloads and matches callbacks to local tasks.
- Dashboard with operational metrics.
- Session auth persisted in MongoDB.
- Enterprise-oriented structure (`models`, `routes`, `middleware`, `services`, `config`).

## DataForSEO design notes used

This implementation follows the SERP v3 workflow concept from DataForSEO overview docs:
1. Create tasks with `task_post`.
2. Include a `postback_url` in each task request.
3. Receive asynchronous results via postback and reconcile by external task id.

The app currently wires:
- `POST /v3/serp/google/organic/task_post` for submission.
- `POST /webhooks/dataforseo/postback` for callback ingestion.

## Quick start

### 1) Start local MongoDB

```bash
mongod --dbpath /tmp/mongo-data
```

### 2) Install dependencies

```bash
npm install
```

### 3) Configure environment

```bash
cp .env.example .env
```

Set these values in `.env`:
- `DATAFORSEO_LOGIN`
- `DATAFORSEO_PASSWORD`
- `SESSION_SECRET`
- `BASE_URL` (must be publicly reachable by DataForSEO for postbacks in real deployments)

### 4) Seed initial admin user

```bash
npm run seed:admin
```

Default admin credentials unless overridden:
- `admin@example.com`
- `Admin123!`

### 5) Run app

```bash
npm run dev
```

Open: `http://localhost:3000/login`

## Core routes

- `POST /login`, `POST /logout`
- `GET/POST /users`
- `GET/POST /projects`
- `GET/POST /tasks`
- `POST /webhooks/dataforseo/postback`
- `GET /postbacks`

## Enterprise hardening checklist (next steps)

- Add SSO (OIDC/SAML) and MFA.
- Add audit trails and immutable event logs.
- Add retries + DLQ for webhook processing.
- Verify webhook authenticity (signature/IP allowlist when available).
- Add RBAC policy matrix and per-project ACL checks.
- Add background workers (BullMQ/SQS) for high-volume processing.
- Add API pagination, filtering, and export.
- Add unit/integration tests and CI.
- Add observability (OpenTelemetry, structured logs, metrics).
- Add rate-limits and WAF rules.

## Notes about postbacks in local mode

DataForSEO cannot post back to `localhost` directly from public internet.
For end-to-end postback tests, use a tunnel (ngrok/cloudflared) and set `BASE_URL` to that public URL.
