export type TicketStatus = "waiting" | "called" | "serving" | "passed" | "completed";

export interface BusinessType {
  code: string;
  name: string;
  prefix: string;
  color: string;
  description: string;
}

export interface Ticket {
  id: string;
  number: string;
  businessTypeCode: string;
  status: TicketStatus;
  windowId?: number;
  callCount: number;
  createdAt: number;
  calledAt?: number;
}

export interface WindowState {
  id: number;
  name: string;
  status: "idle" | "busy";
  currentTicketId?: string;
}

export interface DisplayEvent {
  id: string;
  ticketNumber: string;
  windowName: string;
  timestamp: number;
  type: "call" | "recall";
}
