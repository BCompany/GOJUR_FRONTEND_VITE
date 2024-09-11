
export interface IFullCalendar {
  id: string;
  title: string;
  start:string;
  hasDone:boolean;
  editable:boolean;
  startEditable:boolean;
  backgroundColor:string;
  subjectText:string;
  dayOfWeek:string;
  totalPage:number;
  end:string;
  recorrencia:number;
  allDay: boolean;
  status:string;
}

export interface IDefaultsProps {
  id: string;
  value: string;
}

export interface ReportValueItens {
  id: string;
  value: string;
}

// DECLARAÇÃO DE TIPOS E INTERFACES
export interface ModalProps {
  isOpen?: boolean;
  isClosed?: any;
}

export interface MatterData {
  matterId: number;
  matterCustomerDesc: string;
  matterOppossingDesc: string;
  matterFolder: string;
  matterNumber: string;
  matterForumName:string;
  matterVaraName: string;
  matterVaraNum: string;
  num_WhatsApp: string;
  typeAdvisorId?: number;
}

export interface Data {
  eventId: number;
  startDate: Date;
  endDate: Date;
  blockUpdate: boolean;
  status: 'P' | 'L';
  description: string;
  eventNote: string;
  subjectId: number;
  subject: string;
  subjectColor: string;
  AllowEdit: 'S' | 'N';
  allDay: 'S' | 'N';
  privateEvent: 'S' | 'N';
  recurrent: 'S' | 'N';
  remindersList: [];
  responsibleList: [];
  sharedList: [];
  matter: MatterData;
  callbackValidation: null;
  remindersOptions: [];
  privacityOptions: [];
  userCreator: string;
  recurrenceRule: string;
}

export interface SelectValues {
  id: string;
  label: string;
}

export interface keyProps {
  i: string;
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface dataProps {
  idElement: number;
  name: string;
  positions: {
    i: string;
    x: number;
    y: number;
    w: number;
    h: number;
  };
  visible: string;
}

export interface userListData {
  id: string;
  value: string;
  accessType: string;
}

export interface LembretesData {
  qtdReminder: string;
  notifyMatterCustomer: string;
  whatsAppNotification: string;
  emailNotification: string;
}

export interface ResponsibleDTO {
  userName: string;
  userCompanyId: string;
  userType: string;
  allowEdit: string;
  accessType: string;
}

export interface ShareListDTO {
  userName: string;
  userCompanyId: string;
  userType: string;
  allowEdit: string;
  accessType: string;
}

export interface AppointmentPropsSave {
  eventId: any;
  startDate: any;
  endDate: any;
  dateRecurrence:any;
  description: any;
  eventNote?: any;
  subjectId: any;
  subject?: any;
  userCreator?: any;
  allDay?: any;
  token: any;
  subjectColor?: any;
  status?: any;
  publicationId?: any;
  AllowEdit?: any;
  privateEvent?: any;
  recurrent?: any;
  remindersList?: any[];
  responsibleList?: any[];
  sharedList?: any[];
  matter?: {
    matterId: number;
    matterCustomerDesc: string;
    matterFolder: string;
    matterNumber: string;
    matterOppossingDesc: string;
  };
  recurrenceRuleJSON:any;
  serieRecurrenceChange?: any;
  isConfirmSave:any;
}

export interface AppointmentPropsDelete {
  eventId: any;
  token: any;
  dateRecurrence:any;
  serieRecurrenceChange?: any;
}

export interface Settings {
  id: string;
  value: string;
}
export interface filterProps {
  value: string;
  label: string;
}


export interface ISubject {
  id: string;
  value: string;
}

export interface IAutoCompleteData {
  id: string;
  label: string;
}

export interface IParameter {
  parameterName: string;
  parameterValue: string;
  parameterDesc: string;
}

interface Props {
  id: string;
  value: string;
}

export interface ISelectData {
  id: string;
  label: string;
}

export interface IFilterDesc {
  desc: string;
  label: string;
}
