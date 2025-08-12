
export interface IWorkflowTriggers {
    workflowTriggerId: number | undefined;
    companyId: number | undefined;
    workflowId: number | undefined;
    triggerType: string;
    configuration: {
        label: string;
    };
}



