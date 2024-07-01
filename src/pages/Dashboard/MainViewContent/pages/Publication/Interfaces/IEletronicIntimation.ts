export interface IEletronicIntimation {
  id: string;
  nameId: string;
  name: string;
  desLogin: string;
  password: string;
  status: string;
  statusDesc: string;
  courtId: string;
  courtName: string;
  count: number;
}

export interface ISelectData {
  id: string;
  label: string;
}
  
export interface IName {
  id: string;
  value: string;
}

export interface ICourt {
  id: string;
  value: string;
}
