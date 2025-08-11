import React, { useCallback, useState } from "react";
import type { Priority, Status } from "../../types";

interface Props {
  onAddTicket: (data: { title: string; description: string; priority: Priority; status: Status }) => void;
}

const priorities: Priority[] = ["Low", "Medium", "High"];
const statuses: Status[] = ["Open", "Closed"];

const TicketForm: React.FC<Props> = ({ onAddTicket }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<Priority>("Low");
  const [status, setStatus] = useState<Status>("Open");
  const [touched, setTouched] = useState({ title: false, description: false });

  const reset = useCallback(() => {
    setTitle("");
    setDescription("");
    setPriority("Low");
    setStatus("Open");
    setTouched({ title: false, description: false });
  }, []);

  const submit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      setTouched({ title: true, description: true });
      if (!title.trim() || !description.trim()) return;
      onAddTicket({ title: title.trim(), description: description.trim(), priority, status });
      reset();
    },
    [title, description, priority, status, onAddTicket, reset]
  );

  return (
    <div className="card ticket-card">
      <div className="card-body">
        <h5 className="card-title">Create Ticket</h5>
        <form onSubmit={submit}>
          <div className="mb-2">
            <label className="form-label">Title</label>
            <input
              className={`form-control ${touched.title && !title.trim() ? "is-invalid" : ""}`}
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
              className={`form-control ${touched.description && !description.trim() ? "is-invalid" : ""}`}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              onBlur={() => setTouched((t) => ({ ...t, description: true }))}
              rows={4}
              placeholder="Describe the issue..."
            />
            <div className="invalid-feedback">Description is required.</div>
          </div>

          <div className="row mb-3">
            <div className="col-6">
              <label className="form-label">Priority</label>
              <select className="form-select" value={priority} onChange={(e) => setPriority(e.target.value as Priority)}>
                {priorities.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-6">
              <label className="form-label">Status</label>
              <select className="form-select" value={status} onChange={(e) => setStatus(e.target.value as Status)}>
                {statuses.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
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
  );
};

export default React.memo(TicketForm);
