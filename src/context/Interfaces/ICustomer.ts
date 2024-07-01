
export interface CustomerData {
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
  nom_PessoaFantasia: string | null;
  num_WhatsApp: string | null;
  hasCustomValues: boolean;
  customerIdCustom: number;
  matterQtty: number;
  count: number;
  status: string | null;
  lastAccessDate: string | null;
  lastAccessStr: string | null;
  customerPlan: string | null;
  robotInPlan: string | null;
  robotInUse: string | null;
  matterCourtImportQtty: number;
}

export interface MatterData {
  page: number|0;
  autoSizeCard: boolean|false;
  courtFollow: null;
  currentCourt: string;
  currentCourtDept: string;
  currentInstance: string;
  customerList: any;
  dateFinalization: string;
  dateInsert: string;
  dateLastUpdate: Date;
  dateRelease: string;
  decision: string;
  desLastFollow: null;
  forumName: null;
  hasEvent: boolean;
  instanceList: any;
  judicialAction: string;
  judicialNature: string;
  lawyerList: any;
  markers: string;
  matterCustomerDesc: string;
  matterFolder: string;
  matterId: number;
  matterNumber: string;
  matterNumberCNJ: null;
  matterOppossingDesc: string;
  opossingList: any;
  orderList: any;
  privacity: string;
  probabilyExito: string;
  processualStage: string;
  rito: string;
  status: string;
  thirdyList: any;
  title: null;
  userIncludeUpdate: null;
  followList:FollowsData[]
}

export interface FollowsData {
  date: string;
  description: string;
  forumName: string;
  id: string;
  numIntance: number;
  typeFollow: string;
  typeFollowDescription: string;
  userEditName: string;
  userIncludeName: string;
}


export interface ICustomerData {
  cod_Empresa: number;
  cod_Pessoa: number;
  nom_Pessoa: string;
  des_Email: string;
  tpo_EstadoCivil: string;
  cod_GrupoCliente: string;
  des_GrupoCliente: string;
  tpo_Telefone01: string;
  num_Telefone01: string;
  tpo_Telefone02: string;
  num_Telefone02: string;
  dta_Captacao:string;
  tpo_Pessoa: string;
  num_CPFCNPJ: string;
  CheckEndereco: number;
  cod_PessoaFisica: number;
  cod_Cliente: number;
  cod_PessoaJuridica: number;
  cod_SistemaUsuarioEmpresa: number;
  CheckLegalPerson: number;
  enderecolist: ICustomerAddress[];
}

export interface DefaultsProps {
  id: string;
  value: string;
}

export interface ISelectData{
    id: string;
    label: string;
  }

export interface ICustomerGroupData{
    id: string;
    value: string;
}

export interface ICustomerAddress {
  cod_Endereco: number | undefined;
  cod_PessoaEndereco: number | undefined;
  des_Endereco: string;
  des_Bairro: string
  cod_Municipio: number | undefined;
  nom_Municipio: string | undefined;
  num_CEP: string | undefined;
  tpo_Telefone01: string;
  num_Telefone01: string;
  tpo_Telefone02: string;
  num_Telefone02: string;
  flg_Correspondencia: boolean;
  cod_MunicipioIBGE: string;
}

export interface ICepProps {
  CEP: string;
  Logradouro: string;
  Bairro: string;
  Localidade: string;
  UF: string;
  Complemento: string;
  IBGE: string;
  Localidade_Cod: string;
  UF_Cod: string;
  Status: string;
}

export interface ICustomerMatterData {
  cod_Cliente: number;
  cod_Pessoa: number;
  nom_Pessoa: string;
  des_Email: string;
  tpo_EstadoCivil: string;
  cod_GrupoCliente: string;
  des_GrupoCliente: string;
  tpo_Telefone01: string;
  num_Telefone01: string;
  tpo_Telefone02: string;
  num_Telefone02: string;
  tpo_Pessoa: string;
  num_CPFCNPJ: string;
  enderecolist: ICustomerMatterAddress[];
  
  cod_PessoaFisica: number;
  cod_PessoaJuridica: number;
  des_Nacionalidade: string;
  nom_Responsavel: string;
  cod_Senha: string;
  des_Observacao: string;
  cod_Referencia: string;
  des_EmailFaturamento: string;
  nom_PessoaFantasia: string;
  num_WhatsApp: string;
  dta_Captacao: string;
  cod_CanalDeVendas: number;
  cod_SistemaUsuarioEmpresa: number;
}

export interface ICustomerMatterAddress {
  cod_Endereco: number;
  cod_PessoaEndereco: number;
  des_Endereco: string;
  des_Bairro: string;
  cod_UnidadeFederal: number;
  cod_Municipio: string;
  nom_Municipio: string;
  num_CEP: string;
  tpo_Telefone01: string;
  num_Telefone01: string;
  tpo_Telefone02: string;
  num_Telefone02: string;
  flg_Correspondencia: boolean;
  cod_MunicipioIBGE: string;
}

