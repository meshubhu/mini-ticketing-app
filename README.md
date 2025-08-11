# Mini Ticketing App

## Explain – Architecture & Decisions

### 1. Component Structure  
The app is broken into reusable, focused components:  
- **TicketForm** – Handles creating tickets.  
- **TicketList** – Renders the list of tickets.  
- **TicketItem** – Displays a single ticket.  
- **SearchBar** – Filters tickets by keyword.  
- **TicketCounter** – Displays open ticket count.  

This separation ensures modularity, reusability, and easier maintainability.

---

### 2. State Management  
State is stored in the root component (`App.tsx`) using `useReducer` with a **generic reducer**.  
This allows centralized updates and predictable state transitions.  
We also persist state to `localStorage` so tickets remain after page refresh.

---

### 3. Performance Considerations  
If the app scaled to 1,000+ tickets:  
- Implement **pagination** or infinite scroll.  
- Use `React.memo` to prevent unnecessary re-renders.  
- Store search index in memory for faster lookups.  
- Consider debounced search input.

---

### 4. Search Behavior Improvements  
- Add **debouncing** to reduce filter calls.  
- Highlight matching keywords.  
- Provide filter by priority or status.  
- Show “No results” feedback.

---

### 5. GPT/Google Usage  
Used ChatGPT for:  
- Code scaffolding in React + TS + Vite.  
- Generic reducer logic.  
- LocalStorage persistence integration.

---

## Debug – Fix a Broken Ticket Counter

### Fixed Code
```tsx
type Ticket = { title: string; description: string; priority: string; status?: string };

function TicketCounter({ tickets }: { tickets: Ticket[] }) {
  const openCount = tickets.filter(ticket => ticket.status !== 'closed').length;
  return <div>You have {openCount} open tickets</div>;
}
