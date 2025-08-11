export type Priority = 'Low' | 'Medium' | 'High';

export interface Ticket {
  id: number;
  title: string;
  description: string;
  priority: Priority;
  createdAt: number;
}

export interface IState {
  tickets: Ticket[];
  query: string;
}