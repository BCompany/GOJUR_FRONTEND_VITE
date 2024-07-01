import { ComboSelectType } from "../Matter/EditComponents/Services/MatterData";

export interface IDefaultsProps {
  id: string;
  value: string;
}

export interface ICustomerContactInfo {
  des_Email:string;
  num_Telefone01: string;
  num_Telefone02: string;
  num_WhatsApp: string;
  num_Documento: string;
  nom_Pessoa: string;
}

export interface IComboSelect {
  identity: ComboSelectType,
  id?: string,
  term?: string
}

export interface IMatterFinance
{
  id: number;
  cod_Categoria:number;
  cod_Movimento: number;
  des_Movimento: string;
  vlr_MovimentoStr: string;
  vlr_LiquidacaoStr: string;
  flg_Efetivado: string;
  qtde_Installment: number;
  type: string;
  accountDesc: string;
  totalReceita: string;
  totalDespesa: string;
  installmentNum: number;
  accountId: number;
  dealDetailId:number;
}

export interface ValuesDTO {
  id: string;
  value: string;
}

export interface ISelectData {
  id: string;
  label: string;
}

export interface IPersonListData {
  index?: number
  personId?: number
  partId?: number
  matterPartId?: number
  matterPartPersonId?: number
  type: string;
  personTerm?: string
  personListData: ISelectData[]
  partsListData: ISelectData[]
  disableCheck?:boolean;
  disableDelete?: boolean;
  principal: boolean;
  lawyerType?: string;
  deleteMarker: boolean;
}

export interface IMatterParts {
  index?: number;
  personId?: number;
  matterPartId?: number;
  matterPartPersonId?: number;
  partId?: number;
  matterId?: number;
  partType?: string;
  address?: string;
  matterPartPersonName?: string;
  matterPartName?: string;
  document?: string;
  phoneNumber?: string;
  lawyerType?: string;
  principal?: boolean
}

export interface IKeyValueDTO {
  id: string;
  name: string;
}

export interface IMatterOrderData {
  id:number;
  orderTypeId: number;
  orderTypeDesc?: string;
  orderValue: number;
  orderDate: Date;
  orderDetails: string;
  matterId?: number;
  flg_condenacao: string;
  token?: string;
}

export interface ICourtData {
  forumId: string;
  forumName: string;
}

export interface IMatterCourtData {
  id: number;
  matterId: number;
  court: ISelectData,
  vara: ISelectData,
  instance: ISelectData,
  numVara: number;
  numAndar: number;
  numberInstance: string;
  courtName: string;
  isCurrentInstance: boolean;
  startDate?: Date;
  endDate: Date;
  description: string;
  token: string;
}

export interface IMatterDemandTypeData{
  id: string;
  value: string;
  count: number;
}

export interface IMatterDocumentType {
  documentTypeDescription: string;
  documentTypeId: string;
}

export interface IMatterDocumentData {
  id: number;
  description: string;
  date: string;
  matterId: number;
  documentTypeId: number;
  documentTypeDesc?: string;
  token:string;
}

export interface IMatterAttachValues {
  matterAttachId: number;
  matterOriginalId: number;
  matterAditionalId: number;
  customerName: string;
  opossingName: string;
  folderName: string;
  matterNumber: string;
}

export interface IMatterEventTypeData{
  id: string;
  value: string;
  count: number;
}

export interface MatterUsersDTO {
  id: string;
  value: string;
  accessType: string;
  isInProcess: boolean;
}

export interface MatterValueCalculationResult {
  updateValue: number,
  dateLastIndex: string,
  valueMoratory: number,
  valueCompensatory: number,
  valuePunishment: number,
  updateDate: string,
}

export interface ISelectUserData {
  id: string;
  label: string;
  accessType: string;
  isInProcess: boolean;
}

export interface IMarkerList {
  id: string;
  text: string;
}

export interface IParameterData {
  parameterId: number;
  parameterName: string;
  parameterValue: string;
  message: string;
}

export interface IMatterPartData {
  partName:string;
  partId: number;
  personId: number;
  matterId: number;
  isSelected: boolean;
  isDeleted: boolean;
  isCustomer: boolean;
  isMoved: boolean;
}

export interface IMatterData {
  matterId:number;
  sequence?: number;
  personId: number;
  matterCustomerDesc: string;
  matterOppossingDesc: string;
  matterFolder: string;
  matterNumber: string;
  matterNumberCNJ:string;
  advisoryDescription: string;
  adivisorySubject:string;
  forumName: string;
  status: string;
  statusId: number;
  judicialAction:string;
  judicialActionId:number;
  courtFollow:string;
  existsCurrentSearching: boolean;
  hasEvent:boolean;
  rito: string;
  ritoId: number;
  processualStage:string;
  processualStageId:number;
  decision:string;
  decisionId: number;
  title: string;
  judicialNature:string;
  probabilyExito:string;
  probabilyExitoId:number;
  typeAdvisorId: number;
  typeAdivisor: string;
  currentInstance: string;
  currentCourt: string;
  privacity: string;
  desLastFollow: string;
  currentCourtDept: string;
  userIncludeUpdate:string;
  markers:string;
  editMarker: boolean;
  dateRelease: Date;
  dateInsert: Date;
  dateFinalization: Date;
  dateLastUpdate: Date;
  isFollowing: boolean;
  totalLines: number;
  matterEventTypeId: string;
  matterEventTypeDesc: string;
  matterEventDescription: string;
  matterEventDate: string;
  followRows: number;
  eventList: IMatterEventData[];
  followList: IMatterFollowData[];
  matterResponsibleList: ValuesDTO[];
  isTempMatter: boolean;
  isImportByGOJUR:boolean;
  endFollowList: boolean;
  orderNumber:string;
  userCourt: string;
  amazonS3Type: string;
  matterResponsibleAll: string;
  passwordCourt: string;
  markersList:IMarkerList[];
}

export interface IMatterValuesData {
  id: number,
  calculationId?: number,
  matterId:number,
  name: string,
  newItem?:boolean,
  isMatterValue?: boolean,
  isRiskValue?: boolean,
  startDate?: string,
  endDate?: string,
  updateDate?: string,
  lastIndexDate?: string,
  updateValue?: number,
  originalValue?: number,
  typeValue?: string,
  blockValue?: boolean,
  jsonCalculator?: string,
  calculatorObject?:IMatterCalculationData | undefined;
}

export interface IMatterCalculationData {

  id: number,
  indexId: string,
  startDate: string,
  endDate?: string,
  updateDate: string,
  proRataIndex:boolean;
  lastIndexDate: string,
  originalValue: number,
  updateValue: number,
  automaticatly: boolean,
  tpo_Moratory: string,
  tpo_MoratoryDate: string,
  dateMoratory: string,
  valueMoratory: number,
  totalMoratory: string,
  proRataMoratory: boolean,
  tpo_Compensatory: string,
  tpo_CompensatoryObject?: ISelectData,
  tpo_CompensatoryDate: string,
  dateCompensatory: string,
  valueCompensatory: number,
  totalCompensatory: string,
  proRataCompensatory: boolean,
  tpo_Punishment: string,
  valuePunishment: number,
  totalPunishment: string,
  applyToRiskValue: boolean,
  punishmentWithJuro: boolean
  economicIndex?: ISelectData,
  moratoryType?: ISelectData,
  moratoryDate?: ISelectData,
  compensatoryType?: ISelectData,
  compensatoryDate?: ISelectData
  punishmentType?: ISelectData,
}

export interface IMatterFollowListData {
  id: number;
  matterId: number;
  rowNumber: number;
  totalRowFactor: number;
  recordType: string;
  eventDesc:string;
  nomCourt: string;
  eventDate: Date;
  nom_PersonInclude: string;
  nom_PersonEdit: string;
  numInstance: number;
  numCourt: number;
  instanceCourt: string;
  followType:string;
  tpoFollowType:string;
  securityType: string;
  recurrentId: number;
  token: string;
  subjectDesc: string;
  calendarEventStatus: string;
}

export interface IMatterCourtLink {
  forumLinkCourtId: number;
  url: string;
  forumLinkCourtLink: string;
  uf: string;
}

export interface ILawyerList {
  name:string;
  UF: string;
  OAB: string;
  type: string;
  index:number;
  isSearching:boolean;
  searchStatus: string;
  disabledName:boolean;
  pushes: string;
}


export interface ISearchCNJ {
  matterNumberCNJ: string;
  userCourt: string;
  passwordCourt: string;
  isSecret: boolean;
  index: number;
}

export interface IMatterFollowData {
  id:string;
  date:Date;
  description: string;
  typeFollowDescription:string;
  typeFollowId:string;
  seeMore:boolean;
  editEvent:boolean;
  isSaving: boolean;
  userEditName: string;
  userIncludeName:string;
  imageUserInclude:string;
  imageUserEdit:string;
  }

export interface ProcessData {
  matterId: number;
  matterCustomerDesc: string;
  matterOppossingDesc: string;
  matterFolder: string;
  currentCourt: string;
  currentCourtDept?: string;
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

export interface IMatterEventData {
  eventId: number;
  appointmentId: number;
  description: string;
  startDate: Date;
  subject: string;
  status: string;
}

export interface ITabsControl{
  tab1: boolean;
  tab2: boolean;
  activeTab: string;
}

export interface ITabsEditMatterLegal{
  tab1: boolean;
  tab2: boolean;
  tab3: boolean;
  tab4: boolean;
  tab5: boolean;
  tab6: boolean;
  tab7:boolean;
  activeTab: string;
}

export interface ITabsEditMatterAdvisory{
  tab1: boolean;
  tab2: boolean;
  tab3: boolean;
  tab4: boolean;
  tab5: boolean;
  tab6: boolean;
  activeTab: string;
}

export interface IMatterCoverData{
  matterId: number;
  content:string;
  acessCodes: string;
}

export interface IMatterFollowRobotLog{
  cod_Processo: number;
  dta_InicioPesquisa: Date;
  dta_FimPesquisa: Date;
  nom_PessoaInicioPesquisa: string;
  nom_PessoaFimPesquisa: string;
}

export interface IMatterReportData{
  matterType: string;
	privateEvent: string;
	matterEventQty: string;
	calendarEventQty: string;
	customerId: string;
	customerGroupId: string;
	customerPositionId: string;
	opposing: string;
	lawyer: string;
	legalCause: string;
	matterStatus: string;
	matterDecision: string;
	matterProbab: string;
	court: string;
	matterPhase: string;
	legalNature: string;
	matterEventType: string;
	matterDemand: string;
	matterResponsible: string;
	matterTitle: string;
	daysWithoutQty: string;
	daysWithQty: string;
	dtaEventStart: string;
	dtaEventEnd: string;
	distributionStart: string;
	distributionEnd: string;
	entradaStart: string;
	entradaEnd: string;
	encerramentoStart: string;
	encerramentoEnd: string;
	state: string;
	reportLayout: string;
}

export interface ISubject {
  id: string;
  value: string;
}

export interface ICustomerGroup {
  id: string;
  value: string;
}

export interface ICustomerPosition {
  positionId: string;
  positionName: string;
}

export interface IAutoCompleteData {
  id: string;
  label: string;
}

export interface IAutoCompleteCourtData {
  id: string;
  label: string;
  federalUnitName
}

export interface IOpposing {
  id: string;
  value: string;
}

export interface ILawyer {
  id: string;
  value: string;
}

export interface ILegalCause {
  id: string;
  value: string;
}

export interface IMatterStatus {
  id: string;
  value: string;
}

export interface IMatterSolution {
  id: string;
  value: string;
}

export interface IMatterProbability {
  id: string;
  value: string;
}

export interface ICourt {
  forumId: string;
  forumName: string;
  federalUnitName: string;
}

export interface IMatterPhase {
  id: string;
  value: string;
}

export interface ILegalNature {
  id: string;
  value: string;
}

export interface IMatterEventType {
  id: string;
  value: string;
}

export interface IMatterDemandType {
  id: string;
  value: string;
}

export interface IResponsible {
  id: string;
  value: string;
}

export interface IAdvisoryType {
  id: string;
  value: string;
}
