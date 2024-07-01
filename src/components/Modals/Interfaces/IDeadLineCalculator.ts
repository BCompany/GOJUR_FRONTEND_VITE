

export interface CourtData {
  courtId: number,
  courtName: string
}

export interface ListValueData {
  id: number,
  value: string
}

export interface CalculatorData {
  resultDate: string,
  resultDateText: string,
  textInformationRule: string,
  messageError: string,
  error: boolean,
  calculatorJson: string,
  detailsList:string
}

export interface HolidayData {
  name: string;
  tramitacao:string;
  type: string;
  initialDate: Date;
  finalDate: Date;
  abrangencia: string;
  documentList: Array<DocumentData>
}

export interface DocumentData {
  name: string;
  path: string;
}

export interface ResultValueDates {
  date: string;
  day: number;
  dayValid: number;
  dayWeek: string;
  holidayId: number;
  detailsDate: string;  
  dayOff: boolean;
  holidayDetails: HolidayData;
  informationText: string;
}

export interface PublicationData{
  id: number,
  matterId: number,
  description: string
}

export interface ProcessCourtData{
  forumDesc: String;
  varaDesc: String;
  number: Number;
  startDate: String;
  instance: String;
  currentInstance: String;
}

export interface ProcessData {
  matterId: number;
  matterCustomerDesc: string;
  matterOppossingDesc: string;
  matterFolder: string;
  currentCourt: string;
  matterNumber: string;
  instanceList: Array<ProcessCourtData>;
}
