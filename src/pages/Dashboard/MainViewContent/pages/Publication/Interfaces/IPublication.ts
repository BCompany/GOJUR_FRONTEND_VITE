
export interface DefaultsProps {
  id: string;
  value: string;
}

export type PropsPublicationIA = {
   publicationAI: PublicationAIAnalyserDTO; 
}

export type PropsPublicationDeadlineIA = {
   publicationAI: PublicationAIDeadlinesDTO; 
}


export interface PublicationAIAnalyserDTO
{
  Id: Number,
  Message: string;
  Area: string;
  Resumo: string;
  AvaliacaoPositiva:string;
  Partes: PublicationAIPartsDTO;  
  Prazos: PublicationAIDeadlinesDTO[];
  Audiencia:PublicationAIAudienceDTO;
  Tipo: string;
  legalResumeId: Number;
}

export interface PublicationAIPartsDTO{
  Demandante: string;
  Demandado: string;
}

export interface PublicationAIDeadlinesDTO{
  LegalResumeActionId: number;
  Prazo: string;
  TipoAcao: string;
  Destinatario: string;
  Finalidade: string;
  DeadlineDescription: string;
  DataCalculadaFormatada: string;
  DefinirDiasManualmente: boolean;
}

export interface PublicationAICalculatorDTO
{
    Message: string;
    FormatDate: string;
    DateCalculate: Date;
    SubjectName: string;
    SubjectId: number;
    MatterId: number;
}

export interface PublicationAIAudienceDTO{
  Data: string;
  Hora: string;
  Tipo: string;
  LegalResumeActionId: number;
}

export interface CompromissosData {
  eventId: string;
  startDate: Date;
  endDate: Date;
  status: string;
  description: string;
  eventNote: string;
  subjectId: number;
  subject: string;
  subjectColor: string;
  AllowEdit: string;
  allDay: string;
  privateEvent: string;
  recurrent: string;
  remindersList: {
    qtdReminder: string;
    dateNofity: boolean;
    notifyMatterCustomer: string;
  };
  responsibleList: {
    userName: string;
    userId: number;
    userType: string;
  };
  sharedList: [];
  matter: null;
  callbackValidation: null;
  remindersOptions: [];
  privacityOptions: [];
}

export interface PublicationData {
  id: number;
  matterId: number;
  releaseDate: string;
  publicationDate: string;
  customerName: string;
  description: string;
  matterNumber: string;
  subject: string;
  matterParts: string;
  read: boolean;
  hasLog: boolean;
  withMatter: boolean;
  judicialAction: string;
  searchTerm: string;
  hasEvent: boolean;
  totalRows: number;
  seeMore: boolean;
  eventList: CompromissosData[];
  matterResponsibleFirst: string;
  matterResponsibleAll: string;
  TIPO: string;
  meCod_Processo: number;
  meCod_ProcessoAcompanhamento: number;
  meDes_Acompanhamento: string;
  meDta_Acompanhamento: string;
  meDta_Inclusao: string;
  meFlg_PrimeiraCargaTribunal: string;
  readMatterEvent: boolean;
  hasMatterEventLog: boolean;
  meNum_Processo: string;
  meCod_Pasta: string;
  meDes_AcaoJudicial: string;
  meMatterParts: string;
  hasPublicationResumeAI: boolean;
  publicationResumeAI: PublicationAIAnalyserDTO | null;
}

export interface PublicationDto extends PublicationData {
  openMenu: boolean;
  publicationSelected: number;
}

export interface ProcessData {
  matterId: number;
  matterCustomerDesc: string;
  matterOppossingDesc: string;
  matterFolder: string;
  currentCourt: string;
  matterNumber: string;
  instanceList: Array<ProcessCourtData>
}

export interface ProcessCourtData{
  forumDesc: String;
  varaDesc: String;
  varaNumber: String;
  number: Number;
  startDate: String;
  instance: String;
  currentInstance: String;
}

export interface filterProps {
  value: string;
  label: string;
}

export interface usernameListProps {
  id: string;
  value: string;
}

export interface profileNameProps {
  cod_PublicacaoNome: string;
  cod_PublicacaoNomeUsuarioFiltro: string;
  nom_Pesquisa: string;
}

export interface processFilters {
  period: string;
  name: string;
  matter: filterProps[];
  term: string;
}

export interface PrintData {
  type: string;
  id: number;
}
