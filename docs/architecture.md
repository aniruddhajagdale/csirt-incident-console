# Initial architecture

The MVP is a static React console backed by mock incidents. The target production boundary keeps all privileged operations behind API Gateway and C# Lambda services. Lambda will access Microsoft Graph, Bedrock, DynamoDB, S3, and Step Functions using narrowly scoped identities. Cognito-issued identity will be authorized at the API boundary.

Explicit severity supplied by CSIRT remains authoritative. AI classification and summaries are advisory and retain confidence/provenance. Any future remediation workflow pauses for recorded human approval and emits an immutable audit event.

