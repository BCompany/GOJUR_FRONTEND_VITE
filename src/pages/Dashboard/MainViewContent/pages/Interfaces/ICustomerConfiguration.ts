export interface IUserData{
    nom_Pessoa: string;
    des_Email: string;
    flg_Ativo: string;
    tpo_Usuario: string;
    cod_SistemaUsuarioEmpresa: string;
    cod_Empresa: number;
    count: string;
  }
  
  export interface ICustomerPendingData{
    matterTempId: string;
    matterTempDate: string;
    matterNumber: string;
    tpo_Usuario: string;
    matterTempType: string;
    matterTempError: string;
  }
  
  export interface ICustomerListData{
    lastAccessDate: string;
    customerId: string;
    peopleCompanyName: string;
    matterQtty: string;
    robotPlanQtty: string;
    robotOnQtty: string;
    customer_Plan: string;
    cadastro: string;
    matterCourtImportQtty: string;
    des_Plan: string;
    des_Status: string;
    count: number;
  }
  
  export interface ICustomerInformation{
    des_Status: string;
    des_Plan: string;
    nom_Company: string;
    cod_Empresa: number;
    tpo_StatusAcesso: string;
    dta_Ativo: string;
    dta_Teste: string;
    cod_PlanReference: string;
  }
  
  export interface ICustomerPlanData{
    cod_RecursoSistema: string;
    des_RecursoSistema: string;
    tpo_ItemList: string;
    qtd_RecursoIncluso: string;
    tpo_Recurso: string;
    cod_ResourceReference: string;
    cod_PlanReference: string;
    flg_PermiteAdicional: string;
  }
  
  export interface IPlanData {
    cod_PlanoComercial: string;
    des_PlanoComercial: string;
    cod_PlanReference: string;
  }
  
  export interface IResourcesData {
    cod_RecursoSistema: string;
    des_RecursoSistema: string;
    tpo_Recurso: string;
    cod_ResourceReference: string;
  }
  
  export interface ICustomerData {
    cod_Cliente: string;
    nom_Pessoa: string;
    cod_Referencia: string;
  }
  
  export interface ISelectPlanData {
    id: string;
    label: string;
    cod_PlanReference: string;
  }

  export interface ISelectResourcesData {
    id: string;
    label: string;
    tpo_Recurso: string;
    cod_ResourceReference: string;
  }

  export interface ISelectData {
    id: string;
    label: string;
  }

  export interface IEmailData {
    referenceId: number;
    companyId: number;
    tokem: string;
  }