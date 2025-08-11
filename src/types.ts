export type Priority = "Low" | "Medium" | "High";
export type Status = "Open" | "Closed";

export interface Ticket {
  id: number;
  title: string;
  description: string;
  priority: Priority;
  status: Status;
  createdAt: number;
}
