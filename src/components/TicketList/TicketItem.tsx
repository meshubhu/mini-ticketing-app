import React from 'react'
import type { Ticket } from '../../types'

const shortDesc = (s: string, len = 120) => (s.length > len ? s.slice(0, len) + '…' : s)

const priorityClass = (p: Ticket['priority']) =>
  p === 'Low' ? 'priority-badge-low' : p === 'Medium' ? 'priority-badge-medium' : 'priority-badge-high'

const TicketItem: React.FC<{ ticket: Ticket }> = ({ ticket }) => {
  const { title, description, priority, createdAt } = ticket
  const date = new Date(createdAt).toLocaleString()

  return (
    <div className="card ticket-card">
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-start">
          <div>
            <h5 className="card-title mb-1">{title}</h5>
            <p className="mb-1 text-muted small">{date}</p>
          </div>
          <div>
            <span className={`badge ${priorityClass(priority)} px-3 py-2`} style={{ borderRadius: 8 }}>
              {priority}
            </span>
          </div>
        </div>

        <p className="card-text mt-3 short-desc">{shortDesc(description)}</p>
      </div>
    </div>
  )
}

export default TicketItem
