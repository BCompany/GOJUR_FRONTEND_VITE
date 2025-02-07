export interface IPlanData {
    cod_PlanoComercial: string;
    des_PlanoComercial: string;
    cod_PlanReference: string;
    planValue: string;
  }
  
  export interface ISelectPlanData {
    id: string;
    label: string;
    cod_PlanReference: string;
    planValue: string;
  }
  
  export interface ISelectResourcesData {
    id: string;
    label: string;
    tpo_Recurso: string;
    cod_ResourceReference: string;
    resourceValue: string;
  }
  
  export interface IResourcesData {
    cod_RecursoSistema: string;
    des_RecursoSistema: string;
    tpo_Recurso: string;
    cod_ResourceReference: string;
    resourceValue: string;
  }
  
  export interface ISelectData {
    id: string;
    label: string;
  }
  
  export interface ICustomerPlanData{
    cod_RecursoSistema: string;
    des_RecursoSistema: string;
    tpo_ItemList: string;
    qtd_RecursoIncluso: string;
    tpo_Recurso: string;
    cod_ResourceReference: string;
    cod_PlanReference: string;
    resourceValue: string;
    cod_PlanoComercial: number;
  }