import React, { useCallback, useEffect, useMemo, useState } from "react";
import type { Ticket, Priority, Status } from "./types";
import TicketForm from "./components/TicketForm/TicketForm";
import TicketList from "./components/TicketList/TicketList";
import SearchBar from "./components/SearchBar/SearchBar";
import { useDebounce } from "./hooks/useDebounce";
// import "bootstrap/dist/css/bootstrap.min.css";
import "./index.css";
import TicketCounter from "./components/TicketCounter/TicketCounter";

/**
 * In-memory search index:
 * token -> Set(ticketId)
 * Very lightweight: tokenization by splitting on non-word chars, lowercased.
 */
type Index = Map<string, Set<number>>;

const PAGE_SIZE = 20;
const tokenize = (text: string) =>
  text
    .toLowerCase()
    // Match sequences of letters, numbers, or hashtags
    .match(/[#\w]+/g) // \w is [A-Za-z0-9_], plus we added # explicitly
    ?.filter(Boolean) || [];

const buildIndex = (tickets: Ticket[]): Index => {
  const idx = new Map<string, Set<number>>();

  const addToIndex = (token: string, id: number) => {
    if (!idx.has(token)) idx.set(token, new Set());
    idx.get(token)!.add(id);
  };

  for (const t of tickets) {
    // Tokenize title & description
    const tokens = new Set<string>([
      ...tokenize(t.title),
      ...tokenize(t.description),
    ]);

    // For partial matching: store every substring of each token (min length 2)
    for (const tok of tokens) {
      for (let len = 2; len <= tok.length; len++) {
        for (let start = 0; start <= tok.length - len; start++) {
          addToIndex(tok.substring(start, start + len), t.id);
        }
      }
    }

    // Also index priority & status for quick filter text matching
    addToIndex(t.priority.toLowerCase(), t.id);
    addToIndex(t.status.toLowerCase(), t.id);
  }

  return idx;
};

const App: React.FC = () => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 300);
  const [priorityFilter, setPriorityFilter] = useState<Priority | "All">("All");
  const [statusFilter, setStatusFilter] = useState<Status | "All">("All");

  // pagination state for infinite scroll
  const [page, setPage] = useState(1);
  const [pageSize] = useState(PAGE_SIZE);

  // search index memoized and rebuilt when tickets change
  const index = useMemo(() => buildIndex(tickets), [tickets]);

  // add ticket
  const addTicket = useCallback(
    (payload: Omit<Ticket, "id" | "createdAt">) => {
      const newTicket: Ticket = {
        id: Date.now() + Math.floor(Math.random() * 1000),
        createdAt: Date.now(),
        ...payload,
      };
      setTickets((prev) => [newTicket, ...prev]);
      // reset pagination to show newest
      setPage(1);
    },
    []
  );

  // simple edit status helper (toggle)
  const toggleTicketStatus = useCallback((id: number) => {
    setTickets((prev) => prev.map((t) => (t.id === id ? { ...t, status: t.status === "Open" ? "Closed" : "Open" } : t)));
  }, []);

  // search + filters logic using index for faster lookups
  const matchingIds = useMemo(() => {
    const q = debouncedQuery.trim().toLowerCase();
    if (!q) {
      // if no query, base set is all ids
      return new Set<number>(tickets.map((t) => t.id));
    }

    const qTokens = tokenize(q);
    if (qTokens.length === 0) return new Set<number>();

    // For each token, get set from index. Intersect sets for AND behavior.
    let result: Set<number> | null = null;
    for (const tok of qTokens) {
      if (index.has(tok)) {
        const s = index.get(tok)!;
        if (result === null) result = new Set(s);
        else {
          // intersect
          for (const id of Array.from(result)) {
            if (!s.has(id)) result.delete(id);
          }
        }
      } else {
        // token not found: no results
        return new Set<number>();
      }
    }
    return result ?? new Set<number>();
  }, [debouncedQuery, index, tickets]);

  // apply priority/status filters on top of matchingIds
  const filteredTickets = useMemo(() => {
    const ids = matchingIds;
    const filtered = tickets.filter((t) => {
      if (!ids.has(t.id)) return false;
      if (priorityFilter !== "All" && t.priority !== priorityFilter) return false;
      if (statusFilter !== "All" && t.status !== statusFilter) return false;
      return true;
    });
    return filtered;
  }, [tickets, matchingIds, priorityFilter, statusFilter]);

  // pagination slice
  const visibleTickets = useMemo(() => {
    const start = 0;
    const end = page * pageSize;
    return filteredTickets.slice(start, end);
  }, [filteredTickets, page, pageSize]);

  // callback for infinite scroll to load next page
  const loadNextPage = useCallback(() => {
    setPage((p) => {
      if (p * pageSize >= filteredTickets.length) return p; // no more
      return p + 1;
    });
  }, [pageSize, filteredTickets.length]);

  // reset page when filters/search change
  useEffect(() => {
    setPage(1);
  }, [debouncedQuery, priorityFilter, statusFilter]);

  // convenience: create some seed data when empty (for demo / testing)
  useEffect(() => {
    if (tickets.length === 0) {
      const seed: Ticket[] = Array.from({ length: 1500 }).map((_, i) => ({
        id: 1000 + i,
        title: `Sample ticket #${i + 1}`,
        description: `This is a seeded issue example number ${i + 1}. Use search to find "seed", "error", or number.`,
        priority: i % 3 === 0 ? "High" : i % 3 === 1 ? "Medium" : "Low",
        status: i % 2 === 0 ? "Open" : "Closed",
        createdAt: Date.now() - i * 1000 * 60 * 60,
      }));
      setTickets(seed);
    }
  }, [tickets.length]);

  return (
    <div className="app-container">
      <div className="card shadow-sm">
        <div className="card-body">
          <h2 className="card-title mb-3">Mini Ticketing App — Scalable</h2>

          <div className="row mb-3 g-2 align-items-center">
            <div className="col-md-6">
              <SearchBar value={query} onChange={setQuery} />
            </div>

            <div className="col-md-2">
              <select
                className="form-select"
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value as Priority | "All")}
                aria-label="Filter by priority"
              >
                <option value="All">All priorities</option>
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>

            <div className="col-md-2">
              <select
                className="form-select"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as Status | "All")}
                aria-label="Filter by status"
              >
                <option value="All">All statuses</option>
                <option value="Open">Open</option>
                <option value="Closed">Closed</option>
              </select>
            </div>

            <div className="col-md-2 text-end">
              <small className="text-muted">
                Showing <strong>{visibleTickets.length}</strong> / {filteredTickets.length} results
              </small>
            </div>
          </div>

          <div className="row">
            
            <div className="col-lg-4 mb-3">
              <TicketForm onAddTicket={addTicket} />
            </div>

            <div className="col-lg-8">
              <TicketCounter tickets={tickets} /> {/* ✅ Always up-to-date */}
              <TicketList
                tickets={visibleTickets}
                query={debouncedQuery}
                onLoadMore={loadNextPage}
                hasMore={visibleTickets.length < filteredTickets.length}
                onToggleStatus={toggleTicketStatus}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
