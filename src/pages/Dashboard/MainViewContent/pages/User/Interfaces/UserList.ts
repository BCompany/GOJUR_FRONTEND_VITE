
  
  export interface CustomerData {
    cod_Cliente: number;

    cod_Pessoa: number;
    cod_Empresa: number;
    cod_SistemaUsuarioEmpresa: number;
    cod_SistemaUsuario: number;
    nom_Pessoa: string | null;
    cod_Senha: string | null;
    modulesIds: string | null;
    des_Email: string | null;
    cod_TokenPushNotificacaoAPP: string | null;
    des_AplicativoAparelhoSO: string | null;
    des_LogPrimeiroAcesso: string | null;
    flg_Ativo: boolean;
    tpo_Usuario: string | null;
    userTypeDescription: string | null;
}
  
export interface DefaultsProps {
    id: string;
    value: string;
  }
  
  export interface Tabs {
    mainTabActive: Boolean;
    documentTabActive: Boolean;
  }