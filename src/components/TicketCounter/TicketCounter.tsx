import { useMemo } from "react";
import type { Ticket } from "../../types";

type Props = {
  tickets: Ticket[];
};

export default function TicketCounter({ tickets }: Props) {
  const openCount = useMemo(
    () => tickets.reduce((count, t) => count + (t.status === "Open" ? 1 : 0), 0),
    [tickets]
  );

  return <div className="alert alert-primary text-center d-block mb-3">
      <strong>You have {openCount} open tickets</strong>
    </div>;
}