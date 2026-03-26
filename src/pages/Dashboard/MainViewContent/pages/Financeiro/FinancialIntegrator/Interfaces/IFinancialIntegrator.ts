export interface IFinancialIntegrator {
    financialIntegratorId: number | undefined;
    companyId: number | undefined;
    financialIntegratorName: string;
    financialPartnerType: string;
    financialToken: string;
    penaltyPercentage: string;
    lateInterestPercentage: string;
}