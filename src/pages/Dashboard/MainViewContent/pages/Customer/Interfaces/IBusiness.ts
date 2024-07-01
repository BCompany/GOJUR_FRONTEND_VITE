export interface ISalesFunnelData{
  id: string;
  label: string;
  isDefault: string;
}

export interface ISalesFunnelDataSteps{
  id: string;
  salesFunnelId:number;
  sequence: number;
  sequencePrevious: number;
  sequenceMax: number;
  totalValue: number;  
  label: string;
}

export interface IUserResponsibleData{
  id: string;
  label: string;
}

export interface IDefaultsProps {
  id: string;
  value: string;
}

export interface ISalesChannelData{
  id: string;
  label: string;
}

export interface ICustomerListData{
  id: string;
  label: string;
}

export interface IBusinessData{
  id:number;
  salesFunnelId:number;
  salesFunnelStepId:number;
  responsibleUserId:number;
  nomSalesFunnel:string;
  nomCustomer:string;
  customerWhatsApp:string;
  customerPhone1:string;
  customerPhone2:string;
  customerId:number;
  description:string;
  nomUserResponsible: string;
  status: string;
  statusComplete: string;
  statusColor:string;
  businessValue: number;
  businessTotal: number;
  startDate: string;
  finishDate:string;
  lastUpdate:string;
  observation: string;
  phoneNumber: string;
  whatsAppNumber:string;
  email:string;
  token: string|null;
  numOrder: number;
  totalComments:number;
  totalDocuments:number;
  totalAppointments:number;
  openCustomerDetails:boolean;
}

export interface IBusinessActivityData {
  id:number;
  businessId:number;
  userCreateId:number;
  userUpdateId:number;
  userInclude: string;
  userUpdate: string;
  date: Date;
  newItem: boolean;
  description:string;
  dateDescription: string;
  userPhoto: string;
  useDefaultImage: boolean;
  userPhotoDefault: string;
  isOpen:boolean;
  updating: boolean;
  saving: boolean;
  deleting:boolean;
}

export interface IBusinessEventsData {
  id:number;
  businessId:number;
  companyId:number;
  description:string;
  subjectColor: string;
  subjectDescription:string;
  startDate:Date;
  blockDelete:boolean;
  endDate:Date;
  status:string
}

export interface IBusinessActivitiesReport{
  id:number;
  businessId:number;
  customerName: string;
  businessDescription: string;
  activityDescription:string;
  date: Date;
  lastBusinessUpdate: Date;
  tpo_Activity:string;
}