import { AreaHTMLAttributes } from "react";

export interface PublicacaoProps {
  title: string;
  idElement: string;
  visible: string;
  activePropagation: any;
  stopPropagation: any;
  xClick:any;
  handleClose: any;
  cursor: boolean;
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
  withMatter: boolean;
  judicialAction: string;
  hasEvent: boolean;
  HasMatter: boolean;
  totalRows: number;
  eventList: [];
}

export interface AlertsData {
  AllowEdit: string;
  description: string;
  eventId: number;
  recurrent: string;
  startDate: Date;
  status: string;
  alertDescription: string;
  alertTitle: string;
  subject: string;
}

export interface AlertsDataDTO {
  AllowEdit: string;
  description: string;
  eventId: number;
  recurrent: string;
  startDate: Date;
  status: string;
  subject: string;
  alertDescription: string;
  alertTitle: string;
  hover: boolean;
}

interface HeaderProps extends AreaHTMLAttributes<HTMLAreaElement> {
  title: string;
  cursor: boolean;
  action?: any;
}