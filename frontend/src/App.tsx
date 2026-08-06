import { useMemo, useState } from 'react'
import { incidents as initialIncidents } from './incidents'
import type { Incident, Severity, Status } from './types'

const severities: Severity[] = ['Critical','High','Medium','Low']

export default function App() {
 const [incidents,setIncidents] = useState(initialIncidents)
 const [selectedId,setSelectedId] = useState(initialIncidents[0].id)
 const [search,setSearch] = useState('')
 const [severity,setSeverity] = useState<Severity|'All'>('All')
 const selected = incidents.find(i=>i.id===selectedId) ?? incidents[0]
 const filtered = useMemo(()=>incidents.filter(i=>(severity==='All'||i.severity===severity)&&`${i.id} ${i.title} ${i.resource}`.toLowerCase().includes(search.toLowerCase())),[incidents,search,severity])
 const update = (patch:Partial<Incident>) => setIncidents(items=>items.map(i=>i.id===selected.id?{...i,...patch}:i))
 const setStatus = (status:Status) => update({status})
 return <div className="app">
  <header><div className="brand"><span className="brandmark">C</span><div><strong>CSIRT</strong><small>INCIDENT CONSOLE</small></div></div><div className="environment"><span>●</span> MOCK ENVIRONMENT</div><div className="analyst"><span className="avatar">AR</span><div><strong>Alex Rivera</strong><small>On-call analyst</small></div></div></header>
  <main><section className="intro"><div><p className="eyebrow">OPERATIONS / INCIDENTS</p><h1>Incident command center</h1><p>Review, investigate, and coordinate response to security reports.</p></div><div className="updated">Data source <strong>Mock incidents</strong><small>Updated just now</small></div></section>
   <section className="stats" aria-label="Severity summary">{severities.map(s=><button key={s} className={`stat ${s.toLowerCase()}`} onClick={()=>setSeverity(s)}><span>{s}</span><strong>{incidents.filter(i=>i.severity===s).length}</strong><small>{s==='Critical'?'Immediate response':s==='High'?'Action required':s==='Medium'?'Review needed':'Monitor'}</small></button>)}</section>
   <section className="workspace"><aside className="queue"><div className="queue-title"><div><h2>Incident queue</h2><span>{filtered.length} incidents</span></div><button className="icon" aria-label="Refresh incidents">↻</button></div><div className="filters"><label><span>⌕</span><input aria-label="Search incidents" value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search incidents or resources" /></label><select aria-label="Filter by severity" value={severity} onChange={e=>setSeverity(e.target.value as Severity|'All')}><option>All</option>{severities.map(s=><option key={s}>{s}</option>)}</select></div><div className="incident-list">{filtered.map(i=><button className={`incident ${i.id===selected.id?'active':''}`} key={i.id} onClick={()=>setSelectedId(i.id)}><div><span className={`badge ${i.severity.toLowerCase()}`}>{i.severity}</span><time>{i.received}</time></div><h3>{i.title}</h3><p>{i.id} · {i.source}</p><footer><span>⌁ {i.resource.split(' · ')[0]}</span><span>{i.owner==='Unassigned'?'○':'●'} {i.owner}</span></footer></button>)}{!filtered.length&&<p className="empty">No incidents match your filters.</p>}</div></aside>
    <article className="detail"><div className="detail-head"><div><div className="detail-labels"><span className={`badge ${selected.severity.toLowerCase()}`}>{selected.severity}</span><span className="status">● {selected.status}</span></div><h2>{selected.title}</h2><p>{selected.id} · Reported by {selected.source} · {selected.received}</p></div><button className="more" aria-label="More actions">•••</button></div>
     <div className="detail-body"><section className="ai-card"><div className="ai-title"><span className="spark">✦</span><div><h3>AI-generated assessment</h3><p>Advisory analysis · CSIRT severity preserved</p></div><div className="confidence"><strong>{selected.confidence}%</strong><span>CONFIDENCE</span></div></div><p>{selected.summary}</p><div className="indicators"><strong>Key indicators</strong>{selected.indicators.map(x=><span key={x}>{x}</span>)}</div></section>
      <div className="columns"><section><h3>INCIDENT DETAILS</h3><dl><div><dt>Status</dt><dd><select aria-label="Incident status" value={selected.status} onChange={e=>setStatus(e.target.value as Status)}><option>New</option><option>Triaging</option><option>Investigating</option><option>Response drafted</option></select></dd></div><div><dt>Owner</dt><dd>{selected.owner}</dd></div><div><dt>Affected AWS resource</dt><dd><code>{selected.resource}</code></dd></div></dl></section><section><h3>CSIRT REQUESTED ACTION</h3><div className="request"><span>!</span><p>{selected.requestedAction}</p></div><p className="safe">✓ No remediation will run without human approval.</p></section></div>
     </div><div className="actions"><button onClick={()=>update({owner:'Alex Rivera',status:'Triaging'})}>♙ Assign to me</button><button className="secondary" onClick={()=>setStatus('Investigating')}>⌕ Run investigation</button><button className="primary" onClick={()=>setStatus('Response drafted')}>✦ Draft response with AI</button></div>
    </article></section>
  </main>
 </div>
}
