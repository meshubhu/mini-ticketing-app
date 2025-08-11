import React from 'react'
import type { Ticket } from '../../types'
import TicketItem from './TicketItem'

interface Props {
  tickets: Ticket[]
}

const TicketList: React.FC<Props> = ({ tickets }) => {
  if (tickets.length === 0) {
    return <div className="alert alert-light">No tickets found.</div>
  }

  return (
    <div className="d-grid gap-3">
      {tickets.map((t) => (
        <TicketItem key={t.id} ticket={t} />
      ))}
    </div>
  )
}

export default TicketList
