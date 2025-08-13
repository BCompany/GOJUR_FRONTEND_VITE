
export interface IWorkflowTriggers {
    workflowTriggerId: number | undefined;
    companyId: number | undefined;
    workflowId: number | undefined;
    triggerType: string;
    configuration: {
        label: string;
    } | null;
}



export interface IWorkflowData {
    workflowId: number | undefined;
    name: string;
    companyId: number | undefined;
    triggers: IWorkflowTriggers[];
}
