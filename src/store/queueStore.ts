import { create } from "zustand";
import {
  Ticket,
  TicketStatus,
  BusinessType,
  WindowState,
  DisplayEvent,
} from "@/types";
import {
  BUSINESS_TYPES,
  INITIAL_WINDOWS,
  generateInitialTickets,
  SEQUENCE_INITIAL,
} from "@/data/mockData";
import { playCallNotification } from "@/utils/audio";

interface QueueStore {
  tickets: Ticket[];
  windows: WindowState[];
  businessTypes: BusinessType[];
  sequenceCounters: Record<string, number>;
  displayEvents: DisplayEvent[];
  lastUpdated: number;

  takeTicket: (businessTypeCode: string) => Ticket | null;
  callNext: (windowId: number, withSound?: boolean) => Ticket | null;
  recall: (windowId: number) => void;
  startService: (windowId: number) => void;
  markPassed: (windowId: number) => void;
  completeService: (windowId: number) => void;
  reactivateTicket: (ticketId: string) => void;

  getTicketById: (ticketId: string) => Ticket | undefined;
  getWindowById: (windowId: number) => WindowState | undefined;
  getBusinessTypeByCode: (code: string) => BusinessType | undefined;
  getWaitingTickets: (businessTypeCode?: string) => Ticket[];
  getWaitingCount: (businessTypeCode?: string) => number;
  getPassedTickets: () => Ticket[];
  getWindowCurrentTicket: (windowId: number) => Ticket | undefined;
  getRecentDisplayEvents: (limit?: number) => DisplayEvent[];

  addDisplayEvent: (event: Omit<DisplayEvent, "id" | "timestamp">) => void;
  touch: () => void;
}

const generateId = () => Math.random().toString(36).substring(2, 11);

export const useQueueStore = create<QueueStore>((set, get) => ({
  tickets: generateInitialTickets(),
  windows: INITIAL_WINDOWS,
  businessTypes: BUSINESS_TYPES,
  sequenceCounters: { ...SEQUENCE_INITIAL },
  displayEvents: [],
  lastUpdated: Date.now(),

  takeTicket: (businessTypeCode: string) => {
    const state = get();
    const bt = state.businessTypes.find((b) => b.code === businessTypeCode);
    if (!bt) return null;

    const currentSeq = state.sequenceCounters[businessTypeCode] || 1;
    const number = `${bt.prefix}${String(currentSeq).padStart(3, "0")}`;

    const newTicket: Ticket = {
      id: generateId(),
      number,
      businessTypeCode,
      status: "waiting",
      callCount: 0,
      createdAt: Date.now(),
    };

    set({
      tickets: [...state.tickets, newTicket],
      sequenceCounters: {
        ...state.sequenceCounters,
        [businessTypeCode]: currentSeq + 1,
      },
      lastUpdated: Date.now(),
    });

    return newTicket;
  },

  callNext: (windowId: number, withSound = true) => {
    const state = get();
    const window = state.windows.find((w) => w.id === windowId);
    if (!window) return null;

    if (window.currentTicketId) {
      const current = state.getTicketById(window.currentTicketId);
      if (current && current.status !== "completed" && current.status !== "passed") {
        return null;
      }
    }

    const waiting = state
      .getWaitingTickets()
      .sort((a, b) => a.createdAt - b.createdAt);

    if (waiting.length === 0) return null;

    const nextTicket = waiting[0];
    const now = Date.now();

    set({
      tickets: state.tickets.map((t) =>
        t.id === nextTicket.id
          ? {
              ...t,
              status: "called" as TicketStatus,
              windowId,
              callCount: 1,
              calledAt: now,
            }
          : t
      ),
      windows: state.windows.map((w) =>
        w.id === windowId
          ? { ...w, status: "busy", currentTicketId: nextTicket.id }
          : w
      ),
      lastUpdated: now,
    });

    if (withSound) {
      playCallNotification(nextTicket.number, window.name);
    }

    get().addDisplayEvent({
      ticketNumber: nextTicket.number,
      windowName: window.name,
      type: "call",
    });

    return get().getTicketById(nextTicket.id) || null;
  },

  recall: (windowId: number) => {
    const state = get();
    const window = state.windows.find((w) => w.id === windowId);
    if (!window || !window.currentTicketId) return;

    const ticket = state.getTicketById(window.currentTicketId);
    if (!ticket) return;

    if (ticket.callCount >= 3) {
      state.markPassed(windowId);
      return;
    }

    const newCallCount = ticket.callCount + 1;

    set({
      tickets: state.tickets.map((t) =>
        t.id === ticket.id
          ? { ...t, callCount: newCallCount, calledAt: Date.now() }
          : t
      ),
      lastUpdated: Date.now(),
    });

    playCallNotification(ticket.number, window.name);

    get().addDisplayEvent({
      ticketNumber: ticket.number,
      windowName: window.name,
      type: "recall",
    });

    if (newCallCount >= 3) {
      setTimeout(() => {
        const current = get().getTicketById(ticket.id);
        if (current && current.status === "called") {
          get().markPassed(windowId);
        }
      }, 0);
    }
  },

  startService: (windowId: number) => {
    const state = get();
    const window = state.windows.find((w) => w.id === windowId);
    if (!window || !window.currentTicketId) return;

    set({
      tickets: state.tickets.map((t) =>
        t.id === window.currentTicketId
          ? { ...t, status: "serving" as TicketStatus }
          : t
      ),
      lastUpdated: Date.now(),
    });
  },

  markPassed: (windowId: number) => {
    const state = get();
    const window = state.windows.find((w) => w.id === windowId);
    if (!window || !window.currentTicketId) return;

    set({
      tickets: state.tickets.map((t) =>
        t.id === window.currentTicketId
          ? { ...t, status: "passed" as TicketStatus }
          : t
      ),
      windows: state.windows.map((w) =>
        w.id === windowId ? { ...w, status: "idle", currentTicketId: undefined } : w
      ),
      lastUpdated: Date.now(),
    });
  },

  completeService: (windowId: number) => {
    const state = get();
    const window = state.windows.find((w) => w.id === windowId);
    if (!window || !window.currentTicketId) return;

    set({
      tickets: state.tickets.map((t) =>
        t.id === window.currentTicketId
          ? { ...t, status: "completed" as TicketStatus }
          : t
      ),
      windows: state.windows.map((w) =>
        w.id === windowId ? { ...w, status: "idle", currentTicketId: undefined } : w
      ),
      lastUpdated: Date.now(),
    });
  },

  reactivateTicket: (ticketId: string) => {
    const state = get();
    const ticket = state.getTicketById(ticketId);
    if (!ticket || ticket.status !== "passed") return;

    set({
      tickets: state.tickets.map((t) =>
        t.id === ticketId
          ? {
              ...t,
              status: "waiting" as TicketStatus,
              windowId: undefined,
              callCount: 0,
              calledAt: undefined,
              createdAt: Date.now(),
            }
          : t
      ),
      lastUpdated: Date.now(),
    });
  },

  getTicketById: (ticketId: string) => {
    return get().tickets.find((t) => t.id === ticketId);
  },

  getWindowById: (windowId: number) => {
    return get().windows.find((w) => w.id === windowId);
  },

  getBusinessTypeByCode: (code: string) => {
    return get().businessTypes.find((b) => b.code === code);
  },

  getWaitingTickets: (businessTypeCode?: string) => {
    return get().tickets.filter(
      (t) =>
        t.status === "waiting" &&
        (!businessTypeCode || t.businessTypeCode === businessTypeCode)
    );
  },

  getWaitingCount: (businessTypeCode?: string) => {
    return get().getWaitingTickets(businessTypeCode).length;
  },

  getPassedTickets: () => {
    return get()
      .tickets.filter((t) => t.status === "passed")
      .sort((a, b) => (b.calledAt || 0) - (a.calledAt || 0));
  },

  getWindowCurrentTicket: (windowId: number) => {
    const window = get().windows.find((w) => w.id === windowId);
    if (!window || !window.currentTicketId) return undefined;
    return get().getTicketById(window.currentTicketId);
  },

  getRecentDisplayEvents: (limit = 20) => {
    return get()
      .displayEvents.sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, limit);
  },

  addDisplayEvent: (event) => {
    set({
      displayEvents: [
        ...get().displayEvents,
        { ...event, id: generateId(), timestamp: Date.now() },
      ].slice(-50),
    });
  },

  touch: () => {
    set({ lastUpdated: Date.now() });
  },
}));
