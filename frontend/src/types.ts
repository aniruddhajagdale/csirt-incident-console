export type Severity = 'Critical' | 'High' | 'Medium' | 'Low'
export type Status = 'New' | 'Triaging' | 'Investigating' | 'Response drafted'
export interface Incident { id:string; title:string; severity:Severity; status:Status; owner:string; source:string; received:string; resource:string; requestedAction:string; summary:string; confidence:number; indicators:string[] }
