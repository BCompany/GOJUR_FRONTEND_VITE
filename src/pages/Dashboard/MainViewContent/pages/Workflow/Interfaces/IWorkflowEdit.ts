
export interface IWorkflowTriggers {
    workflowTriggerId: number | undefined;
    companyId: number | undefined;
    workflowId: number | undefined;
    triggerType: string;
    configuration: {
        label: string;
    } | null;
    actions:IWorkflowActions[]; 
}

export interface IWorkflowActions {
    workflowactionId: number | undefined;
    companyId: number | undefined;
    workflowtriggerId: number | undefined;
    actionType: string;
    daysbeforeandafter: number | undefined;
    configDescription: string;
    configuration:{
        subject: string;
        starttime: string;
        description: string;
        reminders: string[];
        privacy:string;
        responsible:string;
        when: string;
    } | null;
}

export interface IWorkflowData {
    workflowId: number | undefined;
    name: string;
    companyId: number | undefined;
    triggers: IWorkflowTriggers[];
}


export interface ISelectValues {
  id: string;
  label: string;
}


export interface IReminder {
  qtdReminder: string; // "0M", "10M", etc
  notifyMatterCustomer: string | null;
  emailNotification: string | null;
  whatsAppNotification: string | null;
}

export interface IResponsible {
  userName: string; // "0M", "10M", etc
  userCompanyId: string | null;
  allowEdit: string | null;
  userType: string | null;
  accessType: string | null;
}

export interface ITriggerAction {
  eventId: number;
  startDate: string;       // ex: "2025-09-18T00:00:00"
  endDate: string;
  status: string | null;
  recurrenceRule: string | null;
  description: string;
  eventNote: string | null;
  subjectId: number;
  subject: string | null;
  subjectColor: string | null;
  userCreator: string | null;
  AllowEdit: string;       // "N" ou "S"
  allDay: string;          // "N" ou "S"
  blockUpdate: boolean;
  alertDescription: string | null;
  alertTitle: string | null;
  privateEvent: string;
  recurrent: string | null;
  publicationId: number;
  matterEventId: number;
  businessId: number;
  token: string | null;
  remindersList: IReminder[];
  responsibleList: IResponsible[];  
  sharedList: any[];
  matter: any;             
  serieRecurrenceChange: any;
  deadLineCalculatorJson: any;
  recurrentId: number;
  recurrenceRuleJSON: any;
  dateRecurrence: string | null;
  viewName: string | null;
  isConfirmSave: boolean;
}

export interface IWorkflowActionsExecDTO {
  workflowactionsexecId: number;
  companyId: number;
  workflowexecId: number;
  actionType: string;
  daysbeforeandafter: number;
  des_ExecParameters: string;
  sequence: number;
  relatedactionId?: number | null; // opcional, pode ser null
  statusType: string;
}