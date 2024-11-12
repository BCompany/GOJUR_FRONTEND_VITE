export interface ISelectData {
  id: string;
  label: string;
}

export interface IPaymentFormData {
  id: string;
  label: string;
  type: string;
}

export interface IAccount {
  id: string;
  value: string;
  cod_Conta: string
}

export interface IFinancialTotal {
  openingBalance: number;
  totalExpectedIncome: number;
  totalExpectedDebit: number;
  totalPaidIncome: number;
  totalPaidDebit: number;
  totalOverdueIncome: number;
  totalNetExpected: number;
  totalNetPaid: number;
}

export interface IFinancial {
  cod_Movimento: string;
  dta_Movimento: string;
  dta_Liquidacao: string;
  des_Movimento: string;
  nom_Categoria: string;
  tpo_Movimento: string;
  vlr_Movimento_Contabil: string;
  vlr_Liquidacao_Contabil: string;
  qtd_Parcelamento: string;
  num_Parcela: string;
  matterCustomerDesc: string;
  matterOpposingDesc: string;
  userNames: string;
  num_Processo: string;
  totalRecords: number;
  cod_FaturaParcela: number;
  cod_Acordo: string;
}

export interface IFinancialMovement {
  cod_Movimento: string;
  dta_Movimento: string;
  dta_Liquidacao: string;
  des_Movimento: string;
  nom_Categoria: string;
  tpo_Movimento: string;
  vlr_Movimento_Contabil: string;
  vlr_Liquidacao_Contabil: string;
  qtd_Parcelamento: string;
  num_Parcela: string;
  matterCustomerDesc: string;
  matterOpposingDesc: string;
  userNames: string;
  num_Processo: string;
  totalRecords: number;
}

export interface MatterData {
  matterId: number;
  matterCustomerDesc: string;
  matterOppossingDesc: string;
  matterFolder: string;
  matterNumber: string;
  matterForumName:string;
  matterVaraName: string;
  matterVaraNum: string;
  num_WhatsApp: string;
  typeAdvisorId?: number;
}

export interface IMovementUploadFile{
  id: number;
  holidayId: number;
  fileName: string;
  fileNameAmazon: string;
  fileType?:string;
  fileSize?: number;
  dateUpload: string;
  tokenPagination: string;
  Count:number;
  installmentIdNum: string;
  movementIdNum: string;
  userInclude?: string;
  userUpdate?: string;
  shared?: string
}

export interface IFinancialDeal {
  dta_Movimento1: string;
  dta_Movimento2: string;
  dta_Movimento3: string;

  des_Movimento1: string;
  des_Movimento2: string;
  des_Movimento3: string;

  nom_Categoria1: string;
  nom_Categoria2: string;
  nom_Categoria3: string;

  vlr_MovimentoStr1: string;
  vlr_MovimentoStr2: string;
  vlr_MovimentoStr3: string;

  vlr_LiquidacaoStr1: string;
  vlr_LiquidacaoStr2: string;
  vlr_LiquidacaoStr3: string;

  cod_AcordoDetalhe1: string;
  cod_AcordoDetalhe2: string;
  cod_AcordoDetalhe3: string;

  num_Parcela1: string;
  num_Parcela2: string;
  num_Parcela3: string;
 
  cod_Acordo: string;
  cod_Movimento: string;
  dta_Liquidacao: string;
  des_Movimento: string;
  nom_Categoria: string;
  tpo_Movimento: string;
  vlr_Movimento_Contabil: string;
  vlr_Liquidacao_Contabil: string;
  qtd_Parcelamento: string;
  num_Parcela: string;
  matterCustomerDesc: string;
  matterOpposingDesc: string;
  userNames: string;
  num_Processo: string;
  totalRecords: number;
  cod_FaturaParcela: number;
}