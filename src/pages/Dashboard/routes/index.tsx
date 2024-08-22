import React from 'react';
import { Switch } from 'react-router-dom';
import Route from './Route';


// views
import Dashboard from '../MainViewContent/pages/Dashboard';
import Calendar from '../MainViewContent/pages/Calendar';
import CalendarExport from '../MainViewContent/pages/Calendar/Export';
import Cadastro from '../MainViewContent/pages/Cadastro';
import Cliente from '../MainViewContent/pages/Customer/List';
import Conta from '../MainViewContent/pages/Conta';
import Financeiro from '../MainViewContent/pages/Financeiro';
import FinancialMovement from '../MainViewContent/pages/Financeiro/Movement';
import FinancialDeal from '../MainViewContent/pages/Financeiro/Deal';
import Matter from '../MainViewContent/pages/Matter/List';
import Publication from '../MainViewContent/pages/Publication';
import Coverages from '../../Coverages';
import APIDocumentation from '../../APIDocumentation';
import Subscriber from '../../Subscriber';
import FinancialInformation from '../../FinancialInformation';
import DocumentModel from '../MainViewContent/pages/DocumentModel/List';
import DocumentModelEdit from '../MainViewContent/pages/DocumentModel/Edit';
import DocumentModelVisualize from '../MainViewContent/pages/DocumentModel/Visualize';
import Usuario from '../MainViewContent/pages/Usuario';
import UserList from '../MainViewContent/pages/UserList';
import CreateUser from '../MainViewContent/pages/User';
import CreateCustomer from '../MainViewContent/pages/Customer/Edit';
import MatterEditLegal from '../MainViewContent/pages/Matter/EditLegal';
import MatterEditAdvisory from '../MainViewContent/pages/Matter/EditAdvisory';
import CreateCustomerBusiness from '../MainViewContent/pages/Customer/Business/Edit';
import SalesChannelList from "../MainViewContent/pages/Customer/CRM/Configuration/SalesChannel/List";
import SalesFunnelStepsList from "../MainViewContent/pages/Customer/CRM/Configuration/FunnelSteps/List";
import SalesFunnel from "../MainViewContent/pages/Customer/CRM/SalesFunnel";
import DashBoard from "../MainViewContent/pages/Customer/CRM/Dashboard";
import Subject from "../MainViewContent/pages/Calendar/Subject/List";
import LegalNature from "../MainViewContent/pages/Matter/LegalNature/List";
import Rite from "../MainViewContent/pages/Matter/Rite/List";
import CustomerLawyer from "../../CustomerLawyer";
import MatterPrint from '../../Printers/MatterCover';
import PrinterLabel from '../../Printers/MatterLabel';
import CustomerLabel from '../../Printers/CustomerLabel';
import MatterPhaseList from '../MainViewContent/pages/Matter/MatterPhase/List';
import MatterStatusList from '../MainViewContent/pages/Matter/MatterStatus/List';
import MatterProbabilityList from '../MainViewContent/pages/Matter/MatterProbability/List';
import MatterSolutionList from '../MainViewContent/pages/Matter/MatterSolution/List';
import CourtDeptList from '../MainViewContent/pages/Matter/CourtDept/List';
import CustomerGroupList from '../MainViewContent/pages/Customer/CustomerGroup/List';
import MatterEventTypeList from '../MainViewContent/pages/Matter/MatterEventType/List';
import LegalCauseList from '../MainViewContent/pages/Matter/LegalCause/List';
import MatterDemandTypeList from '../MainViewContent/pages/Matter/MatterDemandType/List';
import PositionList from '../MainViewContent/pages/Matter/Position/List';
import CourtList from '../MainViewContent/pages/Matter/Court/List';
import AdvisoryTypeList from '../MainViewContent/pages/Matter/AdvisoryType/List';
import ThirdPartyGroupList from '../MainViewContent/pages/Matter/ThirdPartyGroup/List';
import PaymentFormList from '../MainViewContent/pages/Financeiro/PaymentForm/List';
import CategoryList from '../MainViewContent/pages/Financeiro/Category/List';
import FinancialStatusList from '../MainViewContent/pages/Financeiro/FinancialStatus/List';
import AccountList from '../MainViewContent/pages/Financeiro/Account/List';
import ServiceTypeList from '../MainViewContent/pages/Financeiro/ServiceType/List';
import CitiesList from '../MainViewContent/pages/Cities/List';
import PaymentSlipContractList from '../MainViewContent/pages/Financeiro/PaymentSlipContract/List';
import PaymentSlipContractEdit from '../MainViewContent/pages/Financeiro/PaymentSlipContract/Edit';
import FinancialIntegrationList from '../MainViewContent/pages/Financeiro/FinancialIntegration/List';
import FinancialIntegrationEdit from '../MainViewContent/pages/Financeiro/FinancialIntegration/Edit';
import PeoplesList from '../MainViewContent/pages/Peoples/List';
import PeopleEdit from '../MainViewContent/pages/Peoples/Edit';
import EconomicIndexesList from '../MainViewContent/pages/EconomicIndexes/List';
import EconomicIndexessEdit from '../MainViewContent/pages/EconomicIndexes/Edit';
import HolidayList from '../MainViewContent/pages/Holiday/List';
import DocumentTypeList from '../MainViewContent/pages/Matter/DocumentType/List';
import MatterReportSimple from '../MainViewContent/pages/Matter/Report/Simple';
import MatterDemandReport from '../MainViewContent/pages/Matter/Report/MatterDemand';
import MatterReportBCO_ID4817 from '../MainViewContent/pages/Matter/Report/Custom/BCO_ID4817';
import AccountInformationList from '../MainViewContent/pages/AccountInformation';
import FinancialRefundList from '../MainViewContent/pages/Financeiro/Report/RefundList/Index';
import ReportParameters from '../MainViewContent/pages/ReportParameters';
import FinancialHonorariumSummaryList from '../MainViewContent/pages/Financeiro/Report/HonorariumSummaryList';
import FinancialHonorariumList from '../MainViewContent/pages/Financeiro/Report/HonorariumList';
import FinancialIncomeExpenseList from '../MainViewContent/pages/Financeiro/Report/IncomeExpenseList';
import CashFlowList from '../MainViewContent/pages/Financeiro/Report/CashFlowList';
import CostCenterList from '../MainViewContent/pages/Financeiro/CostCenter';
import CustomerConfiguration from '../MainViewContent/pages/Customer/Custom/BCO_ID1/CustomerConfiguration';
import PublicationNames from '../MainViewContent/pages/Customer/Custom/BCO_ID1/PublicationNames';
import BillingContractList from '../MainViewContent/pages/Financeiro/BillingContract';
import BillingContractEdit from '../MainViewContent/pages/Financeiro/BillingContract/Edit';
import BillingInvoiceList from '../MainViewContent/pages/Financeiro/BillingInvoice/List';
import BillingInvoiceEdit from '../MainViewContent/pages/Financeiro/BillingInvoice/Edit';
import EletronicIntimation from '../MainViewContent/pages/Publication/EletronicIntimation';
import PublicationConfiguration from '../MainViewContent/pages/Publication/Configuration';
import ChangePlan from '../MainViewContent/pages/AccountInformation/ChangePlan';
import SearchCNJBatch from '../MainViewContent/pages/Matter/SearchCNJBatch';
import CompanyInformation from '../MainViewContent/pages/AccountInformation/CompanyInformation';
import CompanyFiles from '../MainViewContent/pages/CompanyFiles';
import Monitoring from '../MainViewContent/pages/Matter/Monitoring';

const Routes: React.FC = () => {
  return (
    <Switch>
      <Route path="/dashboard" exact component={Dashboard} isPrivate /> 
      <Route path="/calendar" exact component={Calendar} isPrivate />
      <Route path="/cadastro" exact component={Cadastro} isPrivate />
      <Route path="/conta" exact component={Conta} isPrivate />
      <Route path="/financeiro" exact component={Financeiro} isPrivate />
      <Route path="/financeiro/movement/:type/:account/:id" exact component={FinancialMovement} isPrivate />
      <Route path="/financeiro/deal/:account/:installment/:id" exact component={FinancialDeal} isPrivate />
      <Route path="/matter/list" exact component={Matter} isPrivate />
      <Route path="/matter/printer/cover" exact component={MatterPrint} isPrivate />
      <Route path="/publication" exact component={Publication} isPrivate />
      <Route path="/publication/coverages/" exact component={Coverages} isPrivate />
      <Route path="/apidocumentation/" exact component={APIDocumentation} isPrivate />
      <Route path="/subscriber/" exact component={Subscriber} isPrivate />
      <Route path="/financialInformation" exact component={FinancialInformation} isPrivate />
      <Route path="/usuario" exact component={Usuario} isPrivate />
      <Route path="/createcustomer" exact component={CreateCustomer} isPrivate />
      <Route path="/createcustomer/:id" exact component={CreateCustomer} isPrivate />
      <Route path="/userlist" exact component={UserList} isPrivate />
      <Route path="/user/:id" component={CreateUser} isPrivate />
      <Route path="/customer/list" exact component={Cliente} isPrivate />
      <Route path="/documentModel/list" exact component={DocumentModel} isPrivate />
      <Route path="/documentModel/edit/:cod_DocumentoModelo" exact component={DocumentModelEdit} isPrivate />
      <Route path="/documentModel/visualize/:id" exact component={DocumentModelVisualize} isPrivate />
      <Route path="/customer/edit/:id" component={CreateCustomer} isPrivate />
      <Route path="/customer/business/edit/:id" component={CreateCustomerBusiness} isPrivate />
      <Route path="/CRM/configuration/salesChannel" exact component={SalesChannelList} isPrivate />
      <Route path="/matter/edit/legal/:id" exact component={MatterEditLegal} isPrivate />
      <Route path="/matter/edit/advisory/:id" exact component={MatterEditAdvisory} isPrivate />
      <Route path="/CRM/configuration/salesfunnelSteps" exact component={SalesFunnelStepsList} isPrivate />
      <Route path="/CRM/salesfunnel" exact component={SalesFunnel} isPrivate />
      <Route path="/CRM/dashboard" exact component={DashBoard} isPrivate />
      <Route path="/Subject" exact component={Subject} isPrivate />
      <Route path="/LegalNature" exact component={LegalNature} isPrivate />
      <Route path="/Rite" exact component={Rite} isPrivate />
      <Route path="/MatterPhase" exact component={MatterPhaseList} isPrivate />
      <Route path="/MatterStatus" exact component={MatterStatusList} isPrivate />
      <Route path="/MatterProbability" exact component={MatterProbabilityList} isPrivate />
      <Route path="/MatterSolution" exact component={MatterSolutionList} isPrivate />
      <Route path="/CourtDept" exact component={CourtDeptList} isPrivate />
      <Route path="/CustomerGroup" exact component={CustomerGroupList} isPrivate />
      <Route path="/MatterEventType" exact component={MatterEventTypeList} isPrivate />
      <Route path="/LegalCause" exact component={LegalCauseList} isPrivate />
      <Route path="/MatterDemandType" exact component={MatterDemandTypeList} isPrivate />
      <Route path="/Position" exact component={PositionList} isPrivate />
      <Route path="/Court" exact component={CourtList} isPrivate />
      <Route path="/AdvisoryType" exact component={AdvisoryTypeList} isPrivate />
      <Route path="/ThirdPartyGroup" exact component={ThirdPartyGroupList} isPrivate />
      <Route path="/PaymentForm" exact component={PaymentFormList} isPrivate />
      <Route path="/Category" exact component={CategoryList} isPrivate />
      <Route path="/FinancialStatus" exact component={FinancialStatusList} isPrivate />
      <Route path="/Account" exact component={AccountList} isPrivate />
      <Route path="/ServiceType" exact component={ServiceTypeList} isPrivate />
      <Route path="/Cities" exact component={CitiesList} isPrivate />
      <Route path="/PaymentSlipContract/list" exact component={PaymentSlipContractList} isPrivate />
      <Route path="/PaymentSlipContract/edit/:id" component={PaymentSlipContractEdit} isPrivate />
      <Route path="/FinancialIntegration/list" exact component={FinancialIntegrationList} isPrivate />
      <Route path="/FinancialIntegration/edit/:id" component={FinancialIntegrationEdit} isPrivate />
      <Route path="/People/List" exact component={PeoplesList} isPrivate />
      <Route path="/People/edit/:type/:id" exact component={PeopleEdit} isPrivate />
      <Route path="/EconomicIndexes/List" exact component={EconomicIndexesList} isPrivate />
      <Route path="/EconomicIndexes/edit/:id" component={EconomicIndexessEdit} isPrivate />
      <Route path="/Matter/report/simple" exact component={MatterReportSimple} isPrivate />
      <Route path="/Matter/report/MatterDemand" exact component={MatterDemandReport} isPrivate />
      <Route path="/Matter/report/BCO_ID4817" exact component={MatterReportBCO_ID4817} isPrivate />
      <Route path="/Holiday" exact component={HolidayList} isPrivate />
      <Route path="/DocumentType" exact component={DocumentTypeList} isPrivate />
      <Route path="/AccountInformation" exact component={AccountInformationList} isPrivate />
      <Route path="/financeiro/report/refundlist" exact component={FinancialRefundList} isPrivate />
      <Route path="/financeiro/report/honorariumsummarylist" exact component={FinancialHonorariumSummaryList} isPrivate />
      <Route path="/financeiro/report/honorariumlist" exact component={FinancialHonorariumList} isPrivate />
      <Route path="/financeiro/report/incomeexpenselist" exact component={FinancialIncomeExpenseList} isPrivate />
      <Route path="/financeiro/report/cashflowlist" exact component={CashFlowList} isPrivate />
      <Route path="/ReportParameters" exact component={ReportParameters} isPrivate />
      <Route path="/CustomerLawyer" exact component={CustomerLawyer} />
      <Route path="/CostCenter" exact component={CostCenterList} isPrivate />
      <Route path="/matter/printer/label" exact component={PrinterLabel} isPrivate />
      <Route path="/customer/configuration/:id" exact component={CustomerConfiguration} isPrivate />
      <Route path="/custom/BCO01PublicationNames/:id" exact component={PublicationNames} isPrivate />
      <Route path="/financeiro/billingcontract/list" exact component={BillingContractList} isPrivate />
      <Route path="/financeiro/billingcontract/edit/:id" exact component={BillingContractEdit} isPrivate />
      <Route path="/financeiro/billinginvoice/list" exact component={BillingInvoiceList} isPrivate />
      <Route path="/financeiro/billinginvoice/edit/:id" exact component={BillingInvoiceEdit} isPrivate />
      <Route path="/EletronicIntimation" exact component={EletronicIntimation} isPrivate />
      <Route path="/PublicationConfiguration" exact component={PublicationConfiguration} isPrivate />
      <Route path="/customer/printer/label" exact component={CustomerLabel} isPrivate />
      <Route path="/changeplan" exact component={ChangePlan} isPrivate />
      <Route path="/matter/searchcnj" exact component={SearchCNJBatch} isPrivate />
      <Route path="/companyinformation" exact component={CompanyInformation} isPrivate />
      <Route path="/companyfiles" exact component={CompanyFiles} isPrivate />
      <Route path="/matter/monitoring" exact component={Monitoring} isPrivate />
    </Switch>
  );
};

export default Routes;
