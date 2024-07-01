
export interface UserData {
  id: number;
  cod_Pessoa: number;
  cod_Empresa: number;
  cod_SistemaUsuarioEmpresa: number;
  cod_SistemaUsuario: number;
  nom_Pessoa: string;
  cod_Senha: string;
  modulesIds: string;
  des_Email: string;
  cod_TokenPushNotificacaoAPP: string;
  des_AplicativoAparelhoSO: string;
  des_LogPrimeiroAcesso: string;
  flg_Ativo: boolean;
  tpo_Usuario: string;
  userTypeDescription: string;
  value: string;
  accessCodes: string;
  countWorkTeamByUser: number;
  workTeamUserValues:WorkTeamAutocompleteItem[]
}

export interface DefaultsProps {
  id: string;
  value: string;
}

export interface TabsControl{
  tab1: boolean;
  tab2: boolean;
  tab3: boolean;
  activeTab: string;
}

export interface WorkTeamGroup {
  id: string;
  value: string;
}

export interface WorkTeamAutocompleteItem {
  workTeamAutocompleteItemId: string;
  workTeamAutocompleteItemValue: string;
}
