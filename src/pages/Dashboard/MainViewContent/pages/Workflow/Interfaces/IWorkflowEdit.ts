
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
    workflowActionId: number | undefined;
    companyId: number | undefined;
    workflowTriggerId: number | undefined;
    actionType: string;
    daysbeforeandafter: number | undefined;
    configuration:{
        subject: string;
        starttime: string;
        description: string;
        reminders: string[];
        privacy:string;
        responsible:string;
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