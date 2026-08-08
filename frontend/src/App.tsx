import { useMemo, useState } from 'react'
import { dashboardTotals, incidents as initialIncidents } from './incidents'
import type { Incident, Severity, Status } from './types'

const severities: Severity[] = ['Critical', 'High', 'Medium', 'Low']
const statuses: Status[] = ['New', 'Acknowledged', 'Investigating', 'Awaiting approval', 'Resolved']

function Icon({ name }: { name: string }) {
  const paths: Record<string, React.ReactNode> = {
    grid: <><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></>,
    search: <><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/></>,
    bell: <><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9"/><path d="M10 21h4"/></>,
    mail: <><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></>,
    clock: <><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></>,
    user: <><circle cx="12" cy="8" r="4"/><path d="M4 21c1-5 4-7 8-7s7 2 8 7"/></>,
    play: <><path d="m9 7 8 5-8 5z"/></>,
    reply: <><path d="m9 17-5-5 5-5"/><path d="M4 12h9c4 0 7 2 7 6"/></>,
    check: <path d="m5 12 4 4L19 6"/>,
  }
  return <svg className="svg-icon" aria-hidden="true" viewBox="0 0 24 24">{paths[name]}</svg>
}

export default function App() {
  const [incidents, setIncidents] = useState(initialIncidents)
  const [selectedId, setSelectedId] = useState(initialIncidents[0].id)
  const [search, setSearch] = useState('')
  const [severity, setSeverity] = useState<Severity | 'All'>('All')
  const [activeTab, setActiveTab] = useState<'overview' | 'email' | 'conversation' | 'evidence'>('overview')
  const [toast, setToast] = useState('')
  const selected = incidents.find((incident) => incident.id === selectedId) ?? incidents[0]
  const filtered = useMemo(() => incidents.filter((incident) =>
    (severity === 'All' || incident.severity === severity) &&
    `${incident.id} ${incident.reference} ${incident.title} ${incident.resource} ${incident.owner}`.toLowerCase().includes(search.toLowerCase())), [incidents, search, severity])

  const update = (patch: Partial<Incident>, message?: string) => {
    setIncidents((items) => items.map((item) => item.id === selected.id ? { ...item, ...patch } : item))
    if (message) { setToast(message); window.setTimeout(() => setToast(''), 2400) }
  }

  const chooseSeverity = (value: Severity | 'All') => {
    setSeverity(value)
    if (value !== 'All') {
      const first = incidents.find((incident) => incident.severity === value)
      if (first) setSelectedId(first.id)
    }
  }

  return <div className="app-shell">
    <aside className="sidebar">
      <div className="logo"><span className="logo-mark">C</span><span><strong>CSIRT</strong><small>INCIDENT CONSOLE</small></span></div>
      <nav aria-label="Primary navigation">
        <a className="active" href="#incidents"><Icon name="grid"/> Incidents <b>46</b></a>
        <a href="#messages"><Icon name="mail"/> Messages</a>
        <a href="#investigations"><Icon name="search"/> Investigations</a>
        <a href="#approvals"><Icon name="check"/> Approvals <b className="amber">3</b></a>
      </nav>
      <div className="sidebar-label">OPERATIONS</div>
      <nav><a href="#audit"><Icon name="clock"/> Audit history</a><a href="#runbooks"><Icon name="play"/> Runbooks</a></nav>
      <div className="system-status"><span></span><div><strong>All systems operational</strong><small>Last sync 12 seconds ago</small></div></div>
    </aside>

    <div className="main-area">
      <header className="topbar"><div className="breadcrumb"><span>Operations</span><b>/</b> Incidents</div><div className="top-actions"><button aria-label="Search"><Icon name="search"/></button><button aria-label="Notifications" className="notify"><Icon name="bell"/><i>3</i></button><div className="analyst"><span>AR</span><div><strong>Alex Rivera</strong><small>On-call analyst</small></div><b>⌄</b></div></div></header>
      <main>
        <section className="page-heading"><div><h1>Incident dashboard</h1><p>Monitor, investigate, and respond to security incidents.</p></div><div className="live"><span></span> LIVE · AUTO-REFRESH</div></section>

        <section className="stats" aria-label="Incident summary">
          {severities.map((item) => <button key={item} className={`stat-card ${item.toLowerCase()} ${severity === item ? 'selected' : ''}`} onClick={() => chooseSeverity(severity === item ? 'All' : item)}><span><i></i>{item}</span><strong>{dashboardTotals[item]}</strong><small>{item === 'Critical' ? '2 due within 4 hours' : item === 'High' ? '5 due today' : item === 'Medium' ? '8 awaiting review' : 'No SLA breaches'}</small></button>)}
          <button className="stat-card unassigned" onClick={() => setSearch('Unassigned')}><span><Icon name="user"/>Unassigned</span><strong>{dashboardTotals.Unassigned}</strong><small>Require an owner</small></button>
        </section>

        <section className="workspace" id="incidents">
          <aside className="incident-queue">
            <div className="queue-heading"><div><h2>Incident queue</h2><span>{filtered.length} shown · 46 total</span></div><button aria-label="Refresh incidents">↻</button></div>
            <div className="filters"><label><Icon name="search"/><input aria-label="Search incidents" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search ID, resource, reference…"/></label><select aria-label="Filter by severity" value={severity} onChange={(event) => chooseSeverity(event.target.value as Severity | 'All')}><option>All</option>{severities.map((item) => <option key={item}>{item}</option>)}</select></div>
            <div className="queue-list">{filtered.map((incident) => <button key={incident.id} className={`incident-row severity-${incident.severity.toLowerCase()} ${incident.id === selected.id ? 'active' : ''}`} onClick={() => { setSelectedId(incident.id); setActiveTab('overview') }}>
              <div className="row-meta"><span className={`severity-pill ${incident.severity.toLowerCase()}`}>{incident.severity}</span><time>{incident.received.split(' · ')[1]}</time></div>
              <h3>{incident.title}</h3><p>{incident.id} <b>·</b> {incident.reference}</p>
              <div className="row-bottom"><span><code>{incident.resource}</code></span><span className={incident.owner === 'Unassigned' ? 'owner missing' : 'owner'}><i></i>{incident.owner}</span></div>
            </button>)}{filtered.length === 0 && <p className="empty">No incidents match this view.</p>}</div>
          </aside>

          <article className="detail">
            <div className="detail-header"><div className="detail-topline"><span className={`severity-pill ${selected.severity.toLowerCase()}`}>{selected.severity}</span><span className="status-pill">● {selected.status}</span><span className="sla"><Icon name="clock"/> SLA {selected.deadline}</span></div><div className="title-row"><div><h2>{selected.title}</h2><p>{selected.id} · {selected.reference}</p></div><button aria-label="More incident actions">•••</button></div></div>
            <div className="tabs" role="tablist">{(['overview','email','conversation','evidence'] as const).map((tab) => <button key={tab} role="tab" aria-selected={activeTab === tab} onClick={() => setActiveTab(tab)}>{tab === 'email' ? 'Original email' : tab}{tab === 'conversation' && <span>3</span>}</button>)}</div>

            <div className="detail-content">
              {activeTab === 'overview' && <>
                <section className="assessment"><div className="assessment-title"><span className="ai-symbol">✦</span><div><h3>AI assessment</h3><p>Advisory analysis · explicit CSIRT severity preserved</p></div><div className="confidence"><strong>{selected.confidence}%</strong><small>CONFIDENCE</small></div></div><p>{selected.summary}</p><div className="indicator-list"><b>EXTRACTED INDICATORS</b>{selected.indicators.map((item) => <code key={item}>{item}</code>)}</div></section>
                <div className="detail-grid"><div>
                  <section className="panel"><div className="panel-title"><h3>Incident details</h3><button>Edit</button></div><dl><div><dt>Severity</dt><dd><span className={`severity-pill ${selected.severity.toLowerCase()}`}>{selected.severity}</span> <small>Sender specified</small></dd></div><div><dt>Status</dt><dd><select aria-label="Incident status" value={selected.status} onChange={(event) => update({ status: event.target.value as Status })}>{statuses.map((item) => <option key={item}>{item}</option>)}</select></dd></div><div><dt>Owner</dt><dd>{selected.owner}</dd></div><div><dt>AWS account</dt><dd>{selected.account}</dd></div><div><dt>Region</dt><dd><code>{selected.region}</code></dd></div><div><dt>Resource</dt><dd><code>{selected.resource}</code></dd></div></dl></section>
                  <section className="panel requested"><div className="panel-title"><h3>Requested remediation</h3><span>Human approval required</span></div><p>{selected.requestedAction}</p><small><Icon name="check"/> Automation cannot execute remediation without explicit approval.</small></section>
                </div><div>
                  <section className="panel timeline"><div className="panel-title"><h3>Activity & audit timeline</h3><button>View full audit</button></div>{selected.timeline.map((event) => <div className="timeline-event" key={event.id}><span className={event.tone}>{event.tone === 'ai' ? '✦' : event.tone === 'person' ? 'AR' : '✓'}</span><div><strong>{event.action}</strong><p>{event.detail}</p><small>{event.actor}</small></div><time>{event.time}</time></div>)}</section>
                  <section className="panel related"><div className="panel-title"><h3>Related incidents</h3><span>{selected.related.length}</span></div>{selected.related.length ? selected.related.map((item) => <a href="#related" key={item}>{item} <b>↗</b></a>) : <p>No related incidents found.</p>}<small>Matched by reference, conversation, resource, then AI similarity.</small></section>
                </div></div>
              </>}
              {activeTab === 'email' && <section className="panel email-view"><div className="panel-title"><h3>Original Outlook email</h3><span>Sender validated ✓</span></div><dl><div><dt>From</dt><dd>{selected.sender}</dd></div><div><dt>Received</dt><dd>{selected.received}</dd></div><div><dt>Conversation ID</dt><dd><code>{selected.conversationId}</code></dd></div><div><dt>Subject</dt><dd>{selected.severity}: {selected.title}</dd></div></dl><div className="email-body"><p>Hello CSIRT team,</p><p>{selected.requestedAction}</p><p>Regards,<br/>Cloud Security CSIRT</p></div></section>}
              {activeTab === 'conversation' && <section className="panel placeholder"><Icon name="mail"/><h3>Conversation history</h3><p>Original alert, urgent notification, and incident activity are linked to this Outlook conversation.</p></section>}
              {activeTab === 'evidence' && <section className="panel placeholder"><Icon name="search"/><h3>Investigation results</h3><p>No investigation artifacts have been attached yet. Run an approved, read-only investigation to begin.</p></section>}
            </div>
            <div className="action-bar"><div><button onClick={() => update({ status: 'Acknowledged' }, 'Incident acknowledged')}><Icon name="check"/> Acknowledge</button><button onClick={() => update({ owner: 'Alex Rivera', status: 'Acknowledged' }, 'Incident assigned to you')}><Icon name="user"/> Assign to me</button><button onClick={() => update({ status: 'Investigating' }, 'Investigation started')}><Icon name="play"/> Run investigation</button></div><div><button onClick={() => setActiveTab('conversation')}><Icon name="reply"/> Draft response</button><button className="primary" onClick={() => update({ status: 'Awaiting approval' }, 'Approval requested')}><Icon name="check"/> Request approval</button></div></div>
          </article>
        </section>
      </main>
    </div>
    {toast && <div className="toast" role="status"><Icon name="check"/>{toast}</div>}
  </div>
}
