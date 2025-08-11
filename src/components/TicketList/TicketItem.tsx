import React, { useMemo } from "react";
import type { Ticket } from "../../types";

/** utility: escape regex special characters */
const escapeRegExp = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/** highlight occurrences of any token from query in text */
const highlight = (text: string, query: string) => {
  if (!query.trim()) return text;
  const tokens = Array.from(new Set(query.toLowerCase().split(/\W+/).filter(Boolean)));
  if (tokens.length === 0) return text;
  const pattern = tokens.map(escapeRegExp).join("|");
  const re = new RegExp(`(${pattern})`, "ig");
  const parts = text.split(re);
  return parts.map((part, i) =>
    re.test(part) ? (
      <mark key={i} className="badge bg-warning text-dark" style={{ padding: "0 .25rem" }}>
        {part}
      </mark>
    ) : (
      <span key={i}>{part}</span>
    )
  );
};

const shortDesc = (s: string, len = 240) => (s.length > len ? s.slice(0, len) + "…" : s);

const priorityClass = (p: Ticket["priority"]) =>
  p === "Low" ? "priority-badge-low" : p === "Medium" ? "priority-badge-medium" : "priority-badge-high";

const TicketItem: React.FC<{ ticket: Ticket; query: string; onToggleStatus: (id: number) => void }> = ({
  ticket,
  query,
  onToggleStatus,
}) => {
  const { id, title, description, priority, createdAt, status } = ticket;
  const date = new Date(createdAt).toLocaleString();

  const highlightedTitle = useMemo(() => highlight(title, query), [title, query]);
  const highlightedDesc = useMemo(() => highlight(shortDesc(description), query), [description, query]);

  return (
    <div className="card ticket-card">
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-start">
          <div style={{ minWidth: 0 }}>
            <h5 className="card-title mb-1">{highlightedTitle}</h5>
            <p className="mb-1 text-muted small">{date}</p>
          </div>

          <div className="d-flex flex-column align-items-end gap-2">
            <span className={`badge ${priorityClass(priority)} px-3 py-2`} style={{ borderRadius: 8 }}>
              {priority}
            </span>
            <button
              className={`btn btn-sm ${status === "Open" ? "btn-outline-success" : "btn-outline-secondary"}`}
              onClick={() => onToggleStatus(id)}
            >
              {status}
            </button>
          </div>
        </div>

        <p className="card-text mt-3 short-desc">{highlightedDesc}</p>
      </div>
    </div>
  );
};

export default React.memo(TicketItem, (prev, next) => {
  // shallow compare useful props to avoid rerender
  return prev.ticket.id === next.ticket.id && prev.query === next.query && prev.ticket.status === next.ticket.status && prev.ticket.priority === next.ticket.priority && prev.ticket.title === next.ticket.title && prev.ticket.description === next.ticket.description;
});
