export interface IFinancialIntegrator {
    financialIntegratorId: number | undefined;
    companyId: number | undefined;
    financialIntegratorName: string;
    integratorType: string;
    financialToken: string;
    penaltyPercentage: number;
    lateInterestPercentage: number;
    token: string;
}