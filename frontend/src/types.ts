export type Severity = 'Critical' | 'High' | 'Medium' | 'Low'
export type Status = 'New' | 'Acknowledged' | 'Investigating' | 'Awaiting approval' | 'Resolved'

export interface TimelineEvent {
  id: string
  actor: string
  action: string
  detail: string
  time: string
  tone: 'system' | 'ai' | 'person'
}

export interface Incident {
  id: string
  reference: string
  title: string
  severity: Severity
  status: Status
  owner: string
  source: string
  sender: string
  received: string
  deadline: string
  account: string
  region: string
  resource: string
  requestedAction: string
  summary: string
  confidence: number
  indicators: string[]
  related: string[]
  conversationId: string
  timeline: TimelineEvent[]
}
