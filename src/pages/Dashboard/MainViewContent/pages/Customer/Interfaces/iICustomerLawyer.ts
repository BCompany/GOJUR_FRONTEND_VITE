
export interface IMatterLawyerData {
  cod_Processo: number;
  cod_Pasta: string;
  num_Processo: string;
  num_ProcessoCNJ: string;
  nomeClientePrincipal: string;
  nomeContrarioPrincipal: string;
  des_AcaoJudicial: string;
  isMatterLegal?: boolean;
  followList: IMatterLawyerFollowData[];
}

export interface IMatterLawyerFollowData {
  id:string;
  date:Date;
  description: string;
  showAll?: boolean;
}



