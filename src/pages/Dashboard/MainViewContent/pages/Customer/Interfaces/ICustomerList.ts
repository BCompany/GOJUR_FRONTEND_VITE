
export interface ICustomInfos {
  customerIdCustom: number;
  matterQtty: number | undefined;
  status: string | undefined;
  lastAccessDate: string | undefined;
  lastAccessStr: string | undefined;
  customerPlan: string | undefined;
  robotInPlan: string | undefined;
  robotInUse: string | undefined;
  matterCourtImportQtty: number | undefined;
}

export interface ICustomerData extends ICustomInfos {
  cod_Pessoa: number;
  cod_Empresa: number;
  nom_Pessoa: string;
  des_Email: string | null;
  cod_Cliente: number;
  des_GrupoCliente: string;
  tpo_Telefone01: string | null;
  tpo_Telefone02: string | null;
  num_Telefone01: string | null;
  num_Telefone02: string | null;
  cod_Senha: string | null;
  flg_Status: string;
  nom_PessoaFantasia: string | null;
  num_WhatsApp: string | null;
  count: number;
  CheckEndereco: null
  CheckLegalPerson: null
  addressDTOList: null
  cod_GrupoCliente: number;
  cod_PessoaFisica: number;
  cod_PessoaJuridica: number;
  cod_Referencia:  number;
  cod_SistemaUsuarioEmpresa: number;
  des_EmailFaturamento: string | null;
  des_Nacionalidade: string | null;
  des_Observacao: string | null;
  des_Profissao: string | null;
  doubleCheck: false
  dta_Abertura: null
  dta_Nascimento: null
  legalPersonDTOList: null
  nom_Mae: string | null;
  nom_Pai: string | null;
  nom_Responsavel: string | null;
  num_BeneficioINSS: string | null;
  num_CPFCNPJ: string | null;
  num_CTPS: string | null;
  num_IE: string | null;
  num_PIS: string | null;
  num_RG: string | null;
  num_SerieCTPS: string | null;
  tpo_EstadoCivil: string | null;
  tpo_Pessoa: string | null;
  tpo_Sexo: string | null;
  hasCustomValues: boolean;
}

export interface IDefaultsProps {
  id: string;
  value: string;
}

export interface ITabs {
  mainTabActive: Boolean;
  documentTabActive: Boolean;
}
