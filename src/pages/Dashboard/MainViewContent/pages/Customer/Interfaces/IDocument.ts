
export interface DocumentCustomerData{
  id: number;
  customerId: number;
  fileName: string;
  fileNameAmazon?:string;
  fileSize?: number;
  dateUpload: string;
  tokenPagination: string;
  Count:number;
}

export interface DocumentBusinessData{
  id: number;
  businessId: number;
  fileName: string;
  fileNameAmazon?:string;
  fileSize?: number;
  dateUpload?: string;
  tokenPagination: string;
  Count:number;
}