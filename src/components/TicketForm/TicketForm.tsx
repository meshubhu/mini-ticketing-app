import React, { useCallback, useState } from 'react'
import type { Priority } from '../../types';

interface Props {
  onAddTicket: (data: { title: string; description: string; priority: Priority }) => void
}

const priorities: Priority[] = ['Low', 'Medium', 'High']

const TicketForm: React.FC<Props> = ({ onAddTicket }) => {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [priority, setPriority] = useState<Priority>('Low')
  const [touched, setTouched] = useState({ title: false, description: false })

  const reset = () => {
    setTitle('')
    setDescription('')
    setPriority('Low')
    setTouched({ title: false, description: false })
  }

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault()
    setTouched({ title: true, description: true })

    if (!title.trim() || !description.trim()) return

    onAddTicket({ title: title.trim(), description: description.trim(), priority })
    reset()
  }, [description, onAddTicket, priority, title])

  return (
    <div className="card ticket-card">
      <div className="card-body">
        <h5 className="card-title">Create Ticket</h5>
        <form onSubmit={handleSubmit}>
          <div className="mb-2">
            <label className="form-label">Title</label>
            <input
              className={`form-control ${touched.title && !title.trim() ? 'is-invalid' : ''}`}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onBlur={() => setTouched((t) => ({ ...t, title: true }))}
              placeholder="Short summary..."
            />
            <div className="invalid-feedback">Title is required.</div>
          </div>

          <div className="mb-2">
            <label className="form-label">Description</label>
            <textarea
              className={`form-control ${touched.description && !description.trim() ? 'is-invalid' : ''}`}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              onBlur={() => setTouched((t) => ({ ...t, description: true }))}
              rows={4}
              placeholder="Describe the issue..."
            />
            <div className="invalid-feedback">Description is required.</div>
          </div>

          <div className="mb-3">
            <label className="form-label">Priority</label>
            <select className="form-select" value={priority} onChange={(e) => setPriority(e.target.value as Priority)}>
              {priorities.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>

          <div className="d-flex gap-2">
            <button type="submit" className="btn btn-primary">
              Save
            </button>
            <button type="button" className="btn btn-outline-secondary" onClick={reset}>
              Reset
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default TicketForm
