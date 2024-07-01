export interface LawyerData{
cod_Advogado: string;
  nom_Pessoa: string;
  num_OAB: string;
  flg_Escritorio: boolean;
}

export interface OpposingPartyData {
  id: string;
  value: string;
}

export interface IThirdPartyData{
  cod_Terceiro: number;
  cod_GrupoTerceiro: number;
  value: string;
}

export interface IThirdPartyGroupData{
  id: string;
  value: string;
}

export interface ISelectData{
  id: string;
  label: string;
}