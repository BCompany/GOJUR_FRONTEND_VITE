export interface JobSearchDTO {
  url: string;
  matterGojur: MatterDTO;
}

export interface MatterDTO {
  description: string;
  matterId: number;
  matterIdLoad?: number;
  sequence: number;
  personId: number;
  totalLines: number;
  followRows: number;
  matterCustomerDesc: string;
  matterOppossingDesc: string;
  matterPartDesc: string;
  advisoryDescription: string;
  adivisorySubject: string;
  matterFolder: string;
  matterNumber: string;
  matterNumberCNJ: string;
  forumName: string;
  status: string;
  statusCreation: string;
  includeDate: string;
  statusId?: number;
  error: string;
  typeAdivisor: string;
  typeAdvisorId?: number;
  judicialAction: string;
  judicialActionId?: number;
  courtFollow: string;
  hasEvent: boolean;
  isImportByGOJUR: boolean;
  rito: string;
  ritoId?: number;
  matterPartId: number;
  processualStage: string;
  processualStageId?: number;
  decision: string;
  decisionId?: number;
  num_WhatsApp: string;
  title: string;
  orderNumber: string;
  isFollowing: boolean;
  isFollowingLegalData: boolean;
  judicialNature: string;
  probabilyExito: string;
  probabilyExitoId?: number;
  currentInstance: string;
  currentCourt: string;
  privacity: string;
  desLastFollow: string;
  currentCourtDept: string;
  userInclude: string;
  userUpdate: string;
  isTempMatter: boolean;
  existsCurrentSearching: boolean;
  markers: string;
  flg_Robot: string;
  markersList: MarkersDTO[];
  jsonCalculator: string;
  matterEventTypeDesc: string;
  matterEventDate: string;
  matterEventTypeId: string;
  amazonS3Type: string;
  dateRelease?: string;
  dateInsert?: string;
  dateFinalization?: string;
  dateLastUpdate?: string;
  dtaWebFollow?: string;
  eventList: EventDTO[];
  customerList: PersonDTO[];
  lawyerList: PersonDTO[];
  opossingList: PersonDTO[];
  thirdyList: PersonDTO[];
  instanceList: InstanceDTO[];
  documentList: DocumentDTO[];
  orderList: OrderDTO[];
  followList: FollowsDTO[];
  matterValues: MatterValuesDTO[];
  matterResponsibleList: ValueDTO[];
  matterResponsibleFirst: string;
  matterResponsibleAll: string;
  matterUsersAll: string;
  matterEventTypeDescription: string;
  userCourt: string;
  passwordCourt: string;
  matterType: string;
  courtLink: string;
  dta_UltimaConsultaTribunal: string;
  des_StatusUltimaAtualizacaoTribunal: string;
  messageButton: string;
  matterLines: number;
  tempLines: number;
  cod_Credencial: number;
}

export interface MarkersDTO {
  id: string;
  text: string;
}

export interface EventDTO {
  eventId: number;
  status: string;
  recurrenceRule: string;
  description: string;
  eventNote: string;
  subjectId: number;
  subject: string;
  subjectColor: string;
  userCreator: string;
  allowEdit: string;
  allDay: string;
  blockUpdate: boolean;
  alertDescription: string;
  alertTitle: string;
  privateEvent: string;
  recurrent: string;
  publicationId: number;
  businessId: number;
  token: string;
  matter: MatterDTO;
  recurrentId: number;
  viewName: string;
  isConfirmSave: boolean;
}

export interface PersonDTO {
  personId: number;
  personName: string;
  personPart: string;
  partId: number;
  principal: boolean;
  lawyerType: string;
}

export interface InstanceDTO {
  forumDesc: string;
  varaDesc: string;
  varaNumber: string;
  number: string;
  instance: string;
  currentInstance: string;
}

export interface DocumentDTO {
  description: string;
  date?: string;
}

export interface OrderDTO {
  orderType: string;
  description: string;
  value: string;
  date?: string;
}

export interface FollowsDTO {
  id: number;
  date: string;
  description: string;
  typeFollow: string;
  forumName: string;
  numIntance: number;
  editEvent: boolean;
}

export interface MatterValuesDTO {
  id: number;
  calculationId: number;
  newItem: boolean;
  matterId: number;
  isMatterValue: boolean;
  isRiskValue: boolean;
  name: string;
  startDate: string;
  endDate: string;
  updateDate: string;
  originalValue: number;
  updateValue: number;
  jsonCalculator: string;
  typeValue: string;
}

export interface ValueDTO {
  id: string;
  value: string;
  count?: number;
}
