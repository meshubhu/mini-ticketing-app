import React, { useCallback, useEffect, useMemo, useState } from 'react'
import TicketForm from './components/TicketForm/TicketForm'
import TicketList from './components/TicketList/TicketList'
import SearchBar from './components/SearchBar/SearchBar'
import type { Ticket } from './types'

const STORAGE_KEY = 'mini-ticketing:tickets-v1'

const raw = localStorage.getItem(STORAGE_KEY)
const init = raw ? JSON.parse(raw) as Ticket[] : []

const App: React.FC = () => {
  const [tickets, setTickets] = useState<Ticket[]>(init)
  const [query, setQuery] = useState('')

  // persist on tickets change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tickets))
    } catch (err) {
      console.error('Failed to save tickets to localStorage', err)
    }
  }, [tickets])

  const addTicket = useCallback((ticket: Omit<Ticket, 'id' | 'createdAt'>) => {
    const newTicket: Ticket = {
      id: Date.now() + Math.floor(Math.random() * 1000),
      createdAt: Date.now(),
      ...ticket,
    }
    setTickets((prev) => [newTicket, ...prev])
  }, [])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return tickets
    return tickets.filter(
      (t) =>
        t.title.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q)
    )
  }, [tickets, query])

  return (
    <div className="app-container">
      <div className="card shadow-sm">
        <div className="card-body">
          <h2 className="card-title mb-3">Mini Ticketing App</h2>

          <div className="mb-3">
            <SearchBar value={query} onChange={setQuery} />
          </div>

          <div className="row">
            <div className="col-md-5 mb-3">
              <TicketForm onAddTicket={addTicket} />
            </div>

            <div className="col-md-7">
              <TicketList tickets={filtered} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
