export interface IMatterData {
  page: number|0;
  autoSizeCard: boolean|false;
  courtFollow: null;
  currentCourt: string;
  currentCourtDept: string;
  currentInstance: string;
  customerList: any;
  dateFinalization: string;
  dateInsert: string;
  dateLastUpdate: Date;
  dateRelease: string;
  decision: string;
  desLastFollow: null;
  forumName: null;
  hasEvent: boolean;
  instanceList: any;
  judicialAction: string;
  judicialNature: string;
  lawyerList: any;
  markers: string;
  matterCustomerDesc: string;
  matterFolder: string;
  matterId: number;
  matterNumber: string;
  matterNumberCNJ: null;
  matterOppossingDesc: string;
  opossingList: any;
  orderList: any;
  privacity: string;
  probabilyExito: string;
  processualStage: string;
  rito: string;
  status: string;
  thirdyList: any;
  title: null;
  userIncludeUpdate: null;
  userInclude: string;
  userUpdate: string;
  followList:IFollowsData[]
}

export interface IFollowsData {
  date: string;
  description: string;
  forumName: string;
  id: string;
  numIntance: number;
  typeFollow: string;
  typeFollowDescription: string;
  userEditName: string;
  userIncludeName: string;
}
