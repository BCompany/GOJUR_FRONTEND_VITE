
export interface PublicationData {
  id: number;
  matterId: number;
  releaseDate: string;
  publicationDate: string;
  customerName: string;
  description: string;
  matterNumber: string;
  subject: string;
  matterParts: string;
  read: boolean;
  withMatter: boolean;
  judicialAction: string;
  hasEvent: boolean;
  totalRows: number;
  eventList: [];
}

export interface ModalType {
  type: 'Email' | 'Name' | 'Calc' | 'CalendarModal' | 'CalendarRead' | 'None';
}

export interface PublicationDto extends PublicationData {
  openMenu: boolean;
}

export interface CompromissosData {
  eventId: string;
  startDate: Date;
  endDate: Date;
  status: string;
  description: string;
  eventNote: string;
  subjectId: number;
  subject: string;
  subjectColor: string;
  AllowEdit: string;
  allDay: string;
  privateEvent: string;
  recurrent: string;
  remindersList: {
    qtdReminder: string;
    dateNofity: boolean;
    notifyMatterCustomer: string;
  };
  responsibleList: {
    userName: string;
    userType: string;
  };
  sharedList: [];
  matter: null;
  callbackValidation: null;
  remindersOptions: [];
  privacityOptions: [];
}
