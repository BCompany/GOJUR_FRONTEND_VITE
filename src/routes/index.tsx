/* eslint-disable react/no-children-prop */
import React from 'react';
import { Switch } from 'react-router-dom';
import Login from 'pages/Login';
import LoginPlugin from 'pages/LoginPlugin';
import LoginWL from 'pages/LoginWL';
import ForgotPassword from 'pages/ForgotPassword';
import NewUser from 'pages/NewUser';
import NewFirstAccess from 'pages/NewFirstAccess';
import Validate from 'pages/Validate';
import ClientRedirect from 'pages/ClientRedirect';
import AbortAccess from 'pages/AbortAccess';
import Financeiro from 'pages/Dashboard';
import Matter from 'pages/Dashboard';
import MatterPrintCover from 'pages/Printers/MatterCover';
import PrinterLabel from 'pages/Printers/MatterLabel';
import Publication from 'pages/Dashboard';
import Covarages from 'pages/Coverages';
import Subscriber from 'pages/Subscriber';
import FinancialInformation from 'pages/FinancialInformation';
import CustomerLawyer from 'pages/CustomerLawyer';
import DashboardPath from 'pages/Dashboard';
import Dashboard from 'pages/Dashboard';
import Agenda from 'pages/Dashboard';
import Cadastro from 'pages/Dashboard';
import Conta from 'pages/Dashboard';
import DashBoard from 'pages/Dashboard';
import EletronicIntimation from 'pages/Dashboard';
import PublicationConfiguration from 'pages/Dashboard';
import Route from './Route';

// This route file configuration config the name of route and should be the same from file
// srcpages/dashboard/routes/index.ts

const Routes: React.FC = () => {
  return (
    <Switch>
      <Route path="/" exact component={Login} />
      <Route path="/forgot" component={ForgotPassword} />
      <Route path="/newuser" component={NewUser} exact />
      <Route path="/newfirstaccess" component={NewFirstAccess} exact />
      <Route path="/validate" component={Validate} />
      <Route path="/plugin/login" component={LoginPlugin} isPrivate />
      <Route path="/loginreject" component={LoginWL} />
      <Route
        path="/clientRedirect"
        exact
        component={ClientRedirect}
        isPrivate
      />
      <Route path="/AbortAccess" exact component={AbortAccess} isPrivate />
      <Route path="/dashboard" exact component={Dashboard} isPrivate />
      <Route path="/agenda" exact component={Agenda} isPrivate />
      <Route path="/cadastro" exact component={Cadastro} isPrivate />
      <Route path="/conta" exact component={Conta} isPrivate />
      <Route path="/financeiro" exact component={Financeiro} isPrivate />
      <Route
        path="/financeiro/movement/:type/:account/:id"
        exact
        component={DashboardPath}
        isPrivate
      />
      <Route
        path="/financeiro/deal/:account/:installment/:id"
        exact
        component={DashboardPath}
        isPrivate
      />
      <Route path="/matter/list" exact component={Matter} isPrivate />
      <Route
        path="/matter/printer/cover"
        exact
        component={MatterPrintCover}
        isPrivate
      />
      <Route path="/publication" exact component={Publication} isPrivate />
      <Route path="/documentModel/list" exact component={DashBoard} isPrivate />
      <Route
        path="/documentModel/edit/:cod_DocumentoModelo"
        exact
        component={DashBoard}
        isPrivate
      />
      <Route
        path="/documentModel/visualize/:id"
        exact
        component={DashBoard}
        isPrivate
      />
      <Route path="/calendar" exact component={DashboardPath} isPrivate />
      <Route path="/cadastro" exact component={DashboardPath} isPrivate />
      <Route path="/conta" exact component={DashboardPath} isPrivate />
      <Route path="/financeiro" exact component={DashboardPath} isPrivate />
      <Route path="/processo" exact component={DashboardPath} isPrivate />
      <Route
        path="/publication/coverages"
        exact
        component={Covarages}
        isPrivate
      />
      <Route path="/subscriber" exact component={Subscriber} isPrivate />
      <Route
        path="/financialInformation"
        exact
        component={FinancialInformation}
        isPrivate
      />
      <Route path="/userlist" exact component={DashboardPath} isPrivate />
      <Route path="/user/:id" exact component={DashboardPath} isPrivate />
      <Route path="/usuario" exact component={DashboardPath} isPrivate />
      <Route path="/customer/list" exact component={DashboardPath} isPrivate />
      <Route
        path="/customer/edit/:id"
        exact
        component={DashboardPath}
        isPrivate
      />
      <Route
        path="/customer/business/edit/:id"
        exact
        component={DashboardPath}
        isPrivate
      />
      <Route
        path="/CRM/configuration/salesChannel"
        exact
        component={DashboardPath}
        isPrivate
      />
      <Route
        path="/CRM/configuration/salesFunnelSteps"
        exact
        component={DashboardPath}
        isPrivate
      />
      <Route
        path="/CRM/salesFunnel"
        exact
        component={DashboardPath}
        isPrivate
      />
      <Route path="/CRM/dashboard" exact component={DashboardPath} isPrivate />
      <Route path="/Subject" exact component={DashboardPath} isPrivate />
      <Route path="/LegalNature" exact component={DashboardPath} isPrivate />
      <Route path="/Rite" exact component={DashboardPath} isPrivate />
      <Route path="/MatterPhase" exact component={DashboardPath} isPrivate />
      <Route path="/MatterStatus" exact component={DashboardPath} isPrivate />
      <Route
        path="/MatterProbability"
        exact
        component={DashboardPath}
        isPrivate
      />
      <Route path="/MatterSolution" exact component={DashboardPath} isPrivate />
      <Route path="/CourtDept" exact component={DashboardPath} isPrivate />
      <Route path="/CustomerGroup" exact component={DashboardPath} isPrivate />
      <Route
        path="/MatterEventType"
        exact
        component={DashboardPath}
        isPrivate
      />
      <Route path="/LegalCause" exact component={DashboardPath} isPrivate />
      <Route
        path="/MatterDemandType"
        exact
        component={DashboardPath}
        isPrivate
      />
      <Route path="/Position" exact component={DashboardPath} isPrivate />
      <Route path="/Court" exact component={DashboardPath} isPrivate />
      <Route path="/AdvisoryType" exact component={DashboardPath} isPrivate />
      <Route
        path="/ThirdPartyGroup"
        exact
        component={DashboardPath}
        isPrivate
      />
      <Route path="/PaymentForm" exact component={DashboardPath} isPrivate />
      <Route path="/Category" exact component={DashboardPath} isPrivate />
      <Route
        path="/FinancialStatus"
        exact
        component={DashboardPath}
        isPrivate
      />
      <Route path="/Account" exact component={DashboardPath} isPrivate />
      <Route path="/matter/edit/legal/:id" exact component={Matter} isPrivate />
      <Route
        path="/matter/edit/advisory/:id"
        exact
        component={Matter}
        isPrivate
      />
      <Route path="/ServiceType" exact component={DashboardPath} isPrivate />
      <Route
        path="/PaymentSlipContract/list"
        exact
        component={DashboardPath}
        isPrivate
      />
      <Route
        path="/PaymentSlipContract/edit/:id"
        exact
        component={DashboardPath}
        isPrivate
      />
      <Route path="/Cities" exact component={DashboardPath} isPrivate />
      <Route path="/People/list" exact component={DashboardPath} isPrivate />
      <Route
        path="/People/edit/:type/:id"
        exact
        component={DashboardPath}
        isPrivate
      />
      <Route
        path="/EconomicIndexes/list"
        exact
        component={DashboardPath}
        isPrivate
      />
      <Route
        path="/EconomicIndexes/edit/:id"
        exact
        component={DashboardPath}
        isPrivate
      />
      <Route
        path="/Matter/report/simple"
        exact
        component={DashboardPath}
        isPrivate
      />
      <Route
        path="/Matter/report/MatterDemand"
        exact
        component={DashboardPath}
        isPrivate
      />
      <Route
        path="/Matter/report/BCO_ID4817"
        exact
        component={DashboardPath}
        isPrivate
      />
      <Route path="/Holiday" exact component={DashboardPath} isPrivate />
      <Route path="/DocumentType" exact component={DashboardPath} isPrivate />
      <Route
        path="/AccountInformation"
        exact
        component={DashboardPath}
        isPrivate
      />
      <Route
        path="/financeiro/report/refundlist"
        exact
        component={DashboardPath}
        isPrivate
      />
      <Route
        path="/financeiro/report/honorariumsummarylist"
        exact
        component={DashboardPath}
        isPrivate
      />
      <Route
        path="/financeiro/report/honorariumlist"
        exact
        component={DashboardPath}
        isPrivate
      />
      <Route
        path="/financeiro/report/incomeexpenselist"
        exact
        component={DashboardPath}
        isPrivate
      />
      <Route
        path="/financeiro/report/cashflowlist"
        exact
        component={DashboardPath}
        isPrivate
      />
      <Route
        path="/ReportParameters"
        exact
        component={DashboardPath}
        isPrivate
      />
      <Route
        path="/CustomerLawyer"
        exact
        component={CustomerLawyer}
        isPrivate
      />
      <Route path="/CostCenter" exact component={DashboardPath} isPrivate />
      <Route
        path="/matter/printer/label"
        exact
        component={DashboardPath}
        isPrivate
      />
      <Route
        path="/customer/configuration/:id"
        exact
        component={DashboardPath}
        isPrivate
      />
      <Route
        path="/custom/BCO01PublicationNames/:id"
        exact
        component={DashboardPath}
        isPrivate
      />
      <Route
        path="/financeiro/billingcontract/list"
        exact
        component={DashboardPath}
        isPrivate
      />
      <Route
        path="/financeiro/billingcontract/edit/:id"
        exact
        component={DashboardPath}
        isPrivate
      />
      <Route
        path="/financeiro/billinginvoice/list"
        exact
        component={DashboardPath}
        isPrivate
      />
      <Route
        path="/financeiro/billinginvoice/edit/:id"
        exact
        component={DashboardPath}
        isPrivate
      />
      <Route
        path="/EletronicIntimation"
        exact
        component={EletronicIntimation}
        isPrivate
      />
      <Route
        path="/PublicationConfiguration"
        exact
        component={PublicationConfiguration}
        isPrivate
      />
      <Route
        path="/customer/printer/label"
        exact
        component={DashboardPath}
        isPrivate
      />
      <Route path="/changeplan" exact component={DashboardPath} isPrivate />
      <Route
        path="/matter/searchcnj"
        exact
        component={DashboardPath}
        isPrivate
      />
      <Route
        path="/companyinformation"
        exact
        component={DashboardPath}
        isPrivate
      />
      <Route path="/companyfiles" exact component={DashboardPath} isPrivate />
      <Route path="/matter/monitoring" exact component={Matter} isPrivate />
    </Switch>
  );
};

export default Routes;
