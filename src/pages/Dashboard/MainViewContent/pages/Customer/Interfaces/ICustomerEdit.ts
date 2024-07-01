
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

export interface ICustomerLegalPerson {
  action: any;
  cod_Empresa: number;
  cod_EnderecoLegalPerson: number;
  cod_MunicipioLegalPerson: number;
  cod_PessoaEnderecoLegalPerson: number;
  cod_PessoaFisicaRepresentanteLegal: number;
  cod_PessoaRepresentado: any;
  cod_PessoaRepresentanteLegal: number;
  cod_RepresentanteLegal: number;
  des_BairroLegalPerson: string;
  des_EnderecoLegalPerson: string;
  des_ProfissaoRepresentante: string;
  des_Qualificacao: string;
  flg_EnderecoRepresentado: boolean;
  nom_MunicipioLegalPerson: string;
  nom_RepresentanteLegal: string;
  num_CEPLegalPerson: string;
  num_CpfRepresentante: string;
  num_RGRepresentante: string;
  tpo_EstadoCivilRepresentante: string;
}

export interface IBusinessData {
  id: number;
  customerId: number;
  companyId: number;
  salesFunnelId: number;
  responsibleUserId: number;
  description: number;
  startDate: number;
  finishDate: number;
  status: number;
  totalLines: number;
}

export interface ICustomerGroup {
  id: string;
  value: string;
}

export interface ISelectData {
  id: string;
  label: string;
}

export interface ICustomerData {
  cod_Empresa: number;
  cod_Pessoa: number;
  nom_Pessoa: string;
  nom_PessoaFantasia: string;
  des_Email: string;
  cod_Senha: string;
  cod_GrupoCliente: string;
  des_GrupoCliente: string;
  tpo_Telefone01: string;
  num_Telefone01: string;
  tpo_Telefone02: string;
  num_Telefone02: string;
  des_Nacionalidade: string;
  dta_Captacao:string;
  tpo_Pessoa: string;
  num_CPFCNPJ: string;
  num_WhatsApp: string;
  CheckEndereco: number;
  cod_PessoaFisica: number;
  num_RG: string;
  tpo_Sexo: string;
  tpo_EstadoCivil: string;
  dta_Nascimento: string;
  des_Profissao: string;
  num_CTPS: string;
  flg_Status:string;
  num_SerieCTPS: string;
  vlr_UltimoSalario: number;
  num_BeneficioINSS: string;
  num_PIS: string;
  nom_Pai: string;
  nom_Mae: string;
  cod_Cliente: number;
  nom_Responsavel: string;
  des_Observacao: string;
  cod_PessoaJuridica: number;
  num_IE: string;
  dta_Abertura: string | Date;
  cod_SistemaUsuarioEmpresa: number;
  doubleCheck: boolean;
  des_EmailFaturamento: string;
  cod_Referencia: string;
  cod_CanalDeVendas: string;
  CheckLegalPerson: number;
  legalPerson: ICustomerLegalPerson[];
  enderecolist: ICustomerAddress[];
}

export interface IDefaultsProps {
  id: string;
  value: string;
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

export interface ITabsControl{
  tab1: boolean;
  tab2: boolean;
  tab3: boolean;
  tab4: boolean;
  activeTab: string;
}
