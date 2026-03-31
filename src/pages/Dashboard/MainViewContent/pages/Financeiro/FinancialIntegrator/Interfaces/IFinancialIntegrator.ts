export interface IFinancialIntegrator {
    financialIntegratorId: number | undefined;
    companyId: number | undefined;
    financialIntegratorName: string;
    integratorType: string;
    financialToken: string;
    penaltyPercentage: string;
    lateInterestPercentage: string;
    token: string;
}