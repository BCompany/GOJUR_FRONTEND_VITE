export interface IPayments {
    cod_Movimento: string;
    cod_MovimentoLiquidacao: string;
    dta_LiquidacaoStr?: string;
    vlr_Liquidacao: number;
    total_Restante: number;
    tpo_Movimento: string;
    action: string;
  }