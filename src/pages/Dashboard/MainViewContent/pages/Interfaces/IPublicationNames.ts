export interface ICustomerInformation{
    id: string;
    value: string;
  }
  
  export interface ISelectData {
    id: string;
    label: string;
  }
  
  export interface IPublicationNamesData{
    cod_PublicacaoNome: string;
    cod_Empresa: string;
    nom_Pesquisa: string;
    des_UfAbrangencia: string;
    des_Abrangencia: string;
    num_OAB: string;
    flg_Cortesia: string;
    dta_CortesiaInicio: string;
    dta_CortesiaTermino: string;
    des_UfOab: string;
    flg_Ativo: string;
    cod_PublicacaoNomeVariacao: string;
    des_TermoVariacao: string;
    tpo_Variacao: string;
    abc: string;
  }
  
  export interface ICustomerData {
    cod_Cliente: string;
    nom_Pessoa: string;
    cod_Referencia: string;
  }
  
  export interface ICoveragesData{
    cod_SiglaUF: string;
    nom_Diario: string;
  }

  export interface IAutoCompleteData {
    id: string;
    label: string;
  }
  
  export interface IPublicationNamesData{
    cod_PublicacaoNome: string;
    cod_Empresa: string;
    nom_Pesquisa: string;
    des_UfAbrangencia: string;
    des_Abrangencia: string;
    num_OAB: string;
    flg_Cortesia: string;
    dta_CortesiaInicio: string;
    dta_CortesiaTermino: string;
    des_UfOab: string;
    flg_Ativo: string;
    cod_PublicacaoNomeVariacao: string;
    des_TermoVariacao: string;
    tpo_Variacao: string;
    cod_PublicacaoNomeParceiroPublicacao: string;
    abrangenciaStrList: []
    variationStrList: []
    exclusionStrList: []
  }