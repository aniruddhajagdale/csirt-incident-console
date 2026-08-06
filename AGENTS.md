# CSIRT Incident Console contributor guide

## Architecture

- `frontend/`: React and TypeScript operational console. It calls only the API Gateway-backed backend.
- `backend/`: C# AWS Lambda services for authentication-aware API operations and integrations.
- `infrastructure/`: Terraform for AWS resources, IAM, networking, logging, and alarms.
- `workflows/`: AWS Step Functions definitions and orchestration documentation.
- `docs/`: architecture decisions, threat models, runbooks, and operational documentation.

The target flow is Microsoft Graph -> backend ingestion -> Step Functions -> Bedrock classification -> DynamoDB/S3 -> API Gateway -> React. Cognito authenticates console users.

## Security constraints

- Never commit credentials, access keys, tokens, secrets, private evidence, or real incident data.
- Never put AWS or Microsoft Graph credentials or tokens in frontend code. All integrations go through authenticated backend services.
- Treat email, attachments, AI prompts, and AI output as untrusted content. Validate inputs and avoid rendering raw HTML.
- An explicit CSIRT severity is authoritative; AI may recommend but must never override it.
- Remediation must require explicit human approval. Preserve evidence, decisions, actor identity, timestamps, and audit trails.
- Follow least privilege for IAM, Graph permissions, API authorization, and data access. Encrypt data in transit and at rest.

## Coding conventions

- Use TypeScript strict mode, functional React components, accessible semantic HTML, and small testable modules.
- Keep domain types explicit and mock data clearly separated from production integration code.
- Do not log secrets, tokens, email bodies, or sensitive evidence. Prefer structured, redacted logs.
- Add tests for behavior and security-sensitive rules. Run formatting, lint, tests, and builds before committing.
- Document architectural and security-impacting decisions in `docs/`.

