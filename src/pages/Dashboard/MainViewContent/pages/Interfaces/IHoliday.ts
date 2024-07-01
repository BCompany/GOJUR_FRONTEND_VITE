export interface IHolidayData{
  holidayId: string;
  holidayName: string;
  companyId: string;
  startDate: string;
  startDateString: string;
  endDate: string;
  isPublic: boolean;
  isFixed: boolean;
  nameCity: string;
  nameCourt: string;
  idCourt: string;
  nameTypeCalculator: string;
  nameState: string;
  idState: string;
  idCity: string;
  description: string;
  accessCodes: string;
  allowDelete: boolean;
  typeHoliday: string;
  typeLocal: string;
  typeMatter: string;
  typeCalculator: string;
  count: number;
}

export interface ISelectData {
  id: string;
  label: string;
}

export interface IFederalUnitData{
  id: string;
  value: string;
}

export interface IAutoCompleteData {
  id: string;
  label: string;
  idState: string;
}

export interface ICities {
  citiesId: string;
  citiesDescription: string;
}

export interface ICourtDeadLineData{
  id: string;
  courtName: string;
  idState: string;
}

export interface IHolidayUploadFile{
  id: number;
  holidayId: number;
  fileName: string;
  fileNameAmazon: string;
  fileType?:string;
  fileSize?: number;
  dateUpload: string;
  tokenPagination: string;
  Count:number;
  userInclude?: string;
  userUpdate?: string;
  shared?: string
}
