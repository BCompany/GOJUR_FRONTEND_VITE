
export interface ICard {
  id: number;
  eventId: number;
  phaseId: number;
  panelId: number;
  title: string;
  start: string;
  description: string;
  dateTime: string;
  favorited?: boolean;
  backgroundColor: string;
  recurrence: string
  hasDone:boolean;
}

export interface IPhase {
  id: number;
  panelId: number;
  name: string;
  color: string;
  order: number;
  showButtonMore: boolean
}

export interface IPanel {
  id: number;
  name: string;
  hasKanbanPermission: boolean;
}

export interface IPhasePagination
{
  phaseId: number | any;
  lastIdEvent: number | any;
  lastDateEvent: Date | any;
  lastIdRecurrency: number | any;
  lastDateRecurrency: number | any;
}

/* ─── Colors for auto-assignment ─── */
export const PHASE_COLORS = [
  '#ffc9c9',
  '#fde68a',
  '#bbf7d0',
  '#bfdbfe',
  '#e9d5ff',
  '#fed7aa',
  '#a5f3fc',
];