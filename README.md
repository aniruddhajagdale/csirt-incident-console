# AWS CSIRT Incident Console

An initial operational dashboard for triaging SOC/CSIRT email reports. This milestone uses realistic local mock data only—there are no connections to Outlook, AWS accounts, Amazon Bedrock, or other external services.

## Repository layout

- `frontend/` – React + TypeScript MVP
- `backend/` – placeholder for C# AWS Lambda services
- `infrastructure/` – placeholder for Terraform
- `workflows/` – placeholder for Step Functions
- `docs/` – architecture and security documentation

## Local setup

Prerequisites: Node.js 20+ and npm 10+.

```bash
cd frontend
npm install
npm run dev
```

Open the URL printed by Vite (normally `http://localhost:5173`).

### Quality checks

```bash
cd frontend
npm run lint
npm test
npm run build
```

## Current scope

Queue filtering, incident selection, assignment, investigation state, and AI response drafting are browser-only interactions and reset on refresh. Authentication, APIs, persistence, email ingestion, AI classification, evidence storage, orchestration, and approval-controlled remediation are planned backend milestones.

