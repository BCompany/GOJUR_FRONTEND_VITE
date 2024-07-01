export interface ISelectData{
    id: string;
    label: string;
  }
  
  export interface IServiceTypeSelectData{
    id: string;
    label: string;
    calculationType: string;
    flgMultipleUnit: string;
    standardValue: string;
    flgExpire: string;
  }
  
  export interface IPaymentFormSelectData{
    id: string;
    label: string;
    paymentFormType: string;
  }
  
  export interface IPeopleData{
    id: string;
    value: string;
  }
  
  export interface ICategoryData{
    id: string;
    label: string;
    categoryId: string;
  }
  
  export interface IFinancialStatusData{
    financialStatusId: string;
    financialStatusDescription: string;
    financialStatusType: string;
  }
  
  export interface IServiceTypeData{
    serviceTypeId: string;
    serviceTypeDescription: string;
    calculationType: string;
    flgMultipleUnit: string;
    standardValue: string;
    flgExpire: string;
  }
  
  export interface IBillingContractServiceData{
    cod_ContratoFinanceiroServico: string;
    cod_ContratoFinanceiro: string;
    cod_TipoServico: string;
    tpo_Calculo: string;
    des_TipoServico: string;
    des_Observacao: string;
    pct_Desconto: string;
    qtd_Servico: string;
    vlr_Servico: string;
    des_TipoServicoView: string;
    vlr_Liquido: string;
    dta_Expiracao: string;
    flg_Expira: string;
    flgMultipleUnit: string;
  }
  
  export interface IPaymentFormData{
    paymentFormId: string;
    paymentFormDescription: string;
    paymentFormType: string;
  }
  
  export interface ICostCenterData{
    id: string;
    label: string;
  }
  
  export interface IPaymentSlipContractData{
    paymentSlipContractId: string;
    paymentSlipContractDescription: string;
  }
  
  export interface IBillingContractData{
    cod_CarteiraCobranca: string;
    des_CarteiraCobranca: string;
    cod_CentroCusto: string;
    cod_ContratoFinanceiro: string;
    cod_FormaPagamento: string;
    tpo_FormaPagamento: string;
    cod_Pessoa: string;
    nom_Pessoa: string;
    cod_Processo: string;
    cod_StatusFinanceiro: string;
    des_StatusFinanceiro: string;
    tpo_StatusFinanceiro: string;
    des_EmailFaturamentoPessoa: string;
    flg_FaturaEmail: boolean;
    tpo_Pagamento: string;
    tpo_ClassePessoa: string;
    tpo_Parcelamento: string;
    tpo_Recorrencia: string;
    num_Sequencia: string;
    qtd_Recorrencia: string;
    qtd_Parcela: string;
    qtd_DiasFaturamento: string;
    cod_Fatura: string;
    num_SequenciaFatura: string;
    des_Processo: string;
    tpo_Contrato: string;
    dta_Inicio: string;
    dta_Encerramento: string;
    des_Objeto: string;
    dta_PrimeiroVencimento: string;
    des_EmailFaturamento: string;
    tpo_FluxoFaturamentoFiscal: string;
    qtd_DiasFaturamentoFiscal: string;
  }

  export interface IBillingContractListData{
    cod_ContratoFinanceiro: string;
    cod_Empresa: string;
    cod_Pessoa: string;
    nom_Pessoa: string;
    num_Sequencia: string;
    dta_PrimeiroVencimento: string;
    qtd_DiasFaturamento: string;
    cod_FormaPagamento: string;
    des_FormaPagamento: string;
    des_DescricaoServicos: string;
    qtd_Recorrencia: string;
    tpo_Recorrencia: string;
    generatedInvoices: string;
    des_StatusFinanceiro: string;
    tpo_StatusFinanceiro: string;
    vlr_TotalContrato: number;
    tpo_ClassePessoa: string;
    tpo_Contrato: string;
    tpo_Pagamento: string;
    qtd_Parcela: string;
    tpo_Parcelamento: string;
    dta_Inicio: string;
    cod_Referencia: string;
    count: number;
}


export interface IAccount {
  id: string;
  value: string;
  cod_Conta: string
}

export interface IBillingInvoiceData {
  parcelas: IBillingInvoiceInstallmentData[];
  cod_Fatura: string;
  cod_FaturaParcela: string;
  cod_Pessoa: string
  nom_Pessoa: string
  des_EmailFaturamentoPessoa: string
  cod_Processo: string
  num_Processo: string
  cod_Pasta: string
  nom_ClientePrincipal: string
  nom_ContrarioPrincipal: string
  des_Processo: string
  num_Sequencia: string
  generateRemessa: boolean
  num_SequenciaContrato: string
  cod_Referencia: string
  des_EmailFaturamento: string
  qtd_DiasFaturamento: string
  cod_FormaPagamento: string
  des_FormaPagamento: string
  tpo_FormaPagamento: string
  cod_CarteiraCobranca: string
  des_CarteiraCobranca: string
  cod_ContratoFinanceiro: string
  cod_CentroCusto: string
  des_CentroCusto: string
  nom_Categoria: string
  cod_Categoria: string
  cod_Conta: string
  des_Conta: string
  cod_StatusFinanceiro: string
  des_StatusFinanceiro: string
  des_DescricaoServicos: string
  dta_PrimeiroVencimento: string
  tpo_StatusFinanceiro: string
  vlr_PrimeiraParcela: string
  count: string
  dta_Vencimento: string
  vlr_Fatura: string
  tpo_Pagamento: string
  tpo_ClassePessoa: string
  qtd_Parcela: string
  tpo_Parcelamento: string
  tpo_StatusLiquidacao: string
}

export interface IBillingInvoiceServiceData{
  cod_FaturaServico: string;
  cod_Fatura: string;
  cod_TipoServico: string;
  des_TipoServico: string;
  des_TipoServicoView: string;
  tpo_Calculo: string;
  vlr_Servico: string;
  vlr_Liquido: string;
  qtd_Servico: string;
  pct_Desconto: string;
  des_Observacao: string;
  flg_Expira: string;
  flgMultipleUnit: string;
}

export interface IBillingInvoiceInstallmentData{
  cod_FaturaParcela: string;
  cod_Fatura: string;
  num_Parcela: string;
  dta_Vencimento: string;
  vlr_Parcela: number;
  hasPaymentSlip: boolean;
  dta_VencimentoPaymentSlip: string;
  num_DiasVencimento: string;
  documentUrl: string;
  pct_Multa: string;
  cod_Movimento: string;
  pct_JurosMora: string;
  cod_Empresa: string;
  paymentDetails: IBillingInvoicePaymentData;
}

export interface IBillingInvoicePaymentData{
  cod_FaturaParcelaLiquidacao: string;
  dta_Liquidacao: string;
  vlr_Liquidacao: string;
  status: string;
}

export interface IlistInstallments {
  cod_faturaParcela: string;
  vlr_liquidacao: string;
  dta_liquidacao: string;
}

export interface IEmailOptions {
  invoiceHasSlipGenerated: boolean;
  listInstallments: IlistInstallments[];
}

export interface IPaymentSlipData{
  listInstallments: IInstallments[];
}

export interface IInstallments {
  cod_FaturaParcela: string;
  Descricao: string;
  selected: boolean;
}

export interface IPaymentData {
  vlr_Liquidacao: number;
  dta_Liquidacao: string;
  cod_FaturaParcela: string;
  cod_FaturaParcelaLiquidacao: string;
  total_Restante: number;
  action: string;
  
}

export interface IPositionData {
  positionId: string;
  positionDescription: string;
  positionType: string;
  opposingId: string;
  opposingDescription: string;
}

export interface IBillingInvoiceListData {
  cod_Fatura: string;
  cod_Empresa: string;
  cod_FormaPagamento: string;
  cod_Pessoa: string;
  cod_Referencia: string;
  cod_StatusFinanceiro: string;
  des_CarteiraCobranca: string;
  des_DescricaoServicos: string;
  des_FormaPagamento: string;
  des_StatusFinanceiro: string;
  dta_PrimeiroVencimento: string;
  nom_Pessoa: string;
  num_Sequencia: string;
  qtd_Parcela: string;
  count: number;
  tpo_ClassePessoa: string;
  tpo_FormaPagamento: string;
  tpo_Pagamento: string;
  tpo_Parcelamento: string;
  tpo_StatusFinanceiro: string;
  tpo_StatusLiquidacao: string;
  vlr_Fatura: number;
  vlr_PrimeiraParcela: string;
}

export interface IAutoCompleteData {
  id: string;
  label: string;
}

export interface IParametersData{
  emailSubject: string;
  emailSender: string;
  emailCopy: string;
  emailReplyTo: string;
  desEmailInvoiceModel: string;
  codEmailInvoiceModel: string;
  desEmailBodyHtml: string;
  codEmailBodyHtml: string;
  emailSMTP: string;
  userSMTP: string;
  hostSMTP: string;
  portSMTP: string;
  SSLSMTP: string;
  passwordSMTP: string;
}

export interface IPaymentSlipContractData{
  paymentSlipContractId: string;
  paymentSlipContractDescription: string;
}

export interface IShippingFileData{
  cod_RemessaBoleto: string;
  cod_CarteiraCobranca: string;
  des_CarteiraCobranca: string;
  dta_Remessa: string;
  fileName: string;
  cod_Empresa: number;
  count: number;
}

