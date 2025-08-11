import React, { useCallback } from "react";
import type { Ticket } from "../../types";
import TicketItem from "./TicketItem";
import { useInfiniteScroll } from "../../hooks/useInfiniteScroll";

interface Props {
  tickets: Ticket[]; // visible tickets (already paged)
  query: string; // debounced query for highlighting
  onLoadMore: () => void;
  hasMore: boolean;
  onToggleStatus: (id: number) => void;
}

const TicketList: React.FC<Props> = ({ tickets, query, onLoadMore, hasMore, onToggleStatus }) => {
  // hook returns ref to attach to sentinel element for intersection observer
  const {ref: sentinelRef, observing: isLoading} = useInfiniteScroll({ enabled: hasMore, onLoad: onLoadMore });

  const renderItem = useCallback(
    (t: Ticket) => <TicketItem key={t.id} ticket={t} query={query} onToggleStatus={onToggleStatus} />,
    [query, onToggleStatus]
  );

  return (
    <div>
      {tickets.length === 0 ? (
        <div className="alert alert-light">No results found. Try changing filters or search terms.</div>
      ) : (
        <div className="d-grid gap-3">
          {tickets.map(renderItem)}
        </div>
      )}

      <div ref={sentinelRef as React.RefObject<HTMLDivElement>} style={{ height: 1, marginTop: 8 }} />

      {(hasMore || isLoading) && tickets.length > 0 && (
        <div className="text-center mt-2">
          <small className="text-muted">Loading more…</small>
        </div>
      )}
    </div>
  );
};

export default React.memo(TicketList);
