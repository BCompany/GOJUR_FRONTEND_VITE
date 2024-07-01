export interface IFinancialInformationData{
  cod_Empresa: number;
  cod_Fatura: number;
  cod_FaturaParcela: number;
  num_DiasVencimento: number;
  vlr_Fatura: Number;
  dta_Vencimento: string;
  tpo_StatusLiquidacao: string;
  num_DiasVencimentoSlip: number;
}

export interface IValueData {
  id: string;
  value: string;
}