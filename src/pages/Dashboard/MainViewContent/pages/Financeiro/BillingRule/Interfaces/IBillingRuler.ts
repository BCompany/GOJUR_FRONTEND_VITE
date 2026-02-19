
export interface IBillingRuler {
    billingRulerId: number | undefined;
    companyId: number | undefined;
    descriptionBillingRuler: string;
    inclusionDate: string;
    token: string | null;
    billingRulerWarningDTOList:IBillingRulerWarning[]; 
}

export interface IBillingRulerWarning {
    billingRulerWarningId: number | undefined;
    billingRulerId: number | undefined;
    companyId: number | undefined;
    warningType: string;
    daysOfWarning: number | undefined;
    notificationType: string;
    inclusionDate: string;
    emailNotificationTitle: string;
    emailNotificationDescription: string;
    whatsAppNotificationDescription: string;
}








