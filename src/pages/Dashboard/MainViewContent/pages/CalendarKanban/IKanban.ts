
export interface ICard {
  // a uuid generated on load, not a record id — the record is eventId
  id: string;
  eventId: number;
  phaseId: number;
  panelId: number;
  title: string;
  start: string;
  description: string;
  favorited?: boolean;
  backgroundColor: string;
  recurrence: string;
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
}

export interface IPhasePagination
{
  phaseId: number | any;
  skipRecordsQty: number | any;
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

// what /KanbanEtapa/SelecionarEvento actually returns — card-shaped, not the
// appointment-modal shaped `Data` from ICalendar.ts this call used to be typed with
export interface IKanbanEventData {
  id: number;
  title: string;
  subjectText: string;
  KanbanFavorite: 'S' | 'N';
  start: string;
  hasDone: boolean;
  backgroundColor: string;
  recurrence: 'S' | 'N';
}

// payload the shared recurrence DeleteModal expects
export interface IRecurrenceDelete {
  eventId: number;
  token: string | null;
  dateRecurrence: string;
  serieRecurrenceChange?: string | null;
}
