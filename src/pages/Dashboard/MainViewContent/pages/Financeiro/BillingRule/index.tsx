/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable no-constant-condition */
/* eslint-disable no-nested-ternary */
/* eslint-disable no-multi-assign */
/* eslint-disable no-alert */
/* eslint-disable no-param-reassign */
/* eslint-disable array-callback-return */
/* eslint-disable import/extensions */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable no-lonely-if */
/* eslint-disable react/jsx-one-expression-per-line */

import React, { useEffect, useState, useCallback } from 'react';
import api from 'services/api';
import { ImMenu3, ImMenu4 } from 'react-icons/im';
import { GoDash, GoPlus } from 'react-icons/go';
import { FiTrash, FiEdit, FiX, FiMail, FiSave } from 'react-icons/fi';
import { FaRegTimesCircle, FaCheck, FaFileContract, FaFileInvoiceDollar, FaHandshake, FaWhatsapp } from 'react-icons/fa';
import { CgFileDocument } from 'react-icons/cg';
import { RiMoneyDollarBoxFill } from 'react-icons/ri';
import { useDevice } from "react-use-device";
import { useToast } from 'context/toast';
import { envProvider } from 'services/hooks/useEnv';
import { useStateContext } from 'context/statesContext';
import { useHistory } from 'react-router-dom';
import { HeaderPage } from 'components/HeaderPage';
import { useAuth } from 'context/AuthContext';
import { useHeader } from 'context/headerContext';
import { AutoCompleteSelect, Overlay } from 'Shared/styles/GlobalStyle';
import { useMenuHamburguer } from 'context/menuHamburguer'
import MenuHamburguer from 'components/MenuHamburguer';
import Select from 'react-select';
import { Grid, Table, TableHeaderRow, PagingPanel } from '@devexpress/dx-react-grid-material-ui';
import { loadingMessage, noOptionsMessage } from 'Shared/utils/commonConfig';
import { selectStyles, FormatDate, FormatCurrency, useDelay } from 'Shared/utils/commonFunctions';
import { months, financialYears } from 'Shared/utils/commonListValues';
import { languageGridEmpty, languageGridLoading, languageGridPagination } from 'Shared/utils/commonConfig';
import { DataTypeProvider, PagingState, CustomPaging } from '@devexpress/dx-react-grid';
import LoaderWaiting from 'react-spinners/ClipLoader';
import { format } from 'date-fns';
import { IFinancialTotal, IAccount, ISelectData, IFinancial, IFinancialDeal } from '../Interfaces/IFinancial';
import FinancialDocumentModal from '../DocumentModal';
import FinancialPaymentModal from '../PaymentModal';
import { Container, Content, GridContainerFinancial, ModalDeleteOptions, OverlayFinancial, HamburguerHeader } from './styles';
import DealDefaultModal from '../Category/Modal/DealDefaultModal';
import { trigger } from 'swr';

const BillingRule: React.FC = () => {
  const { addToast } = useToast();
  const { signOut } = useAuth();
  const { isMenuOpen, handleIsMenuOpen, isOpenMenuDealDefaultCategory, handleIsOpenMenuDealDefaultCategory } = useMenuHamburguer();
  const baseUrl = envProvider.redirectUrl;
  const { handleJsonStateObject, handleStateType, jsonStateObject, stateType } = useStateContext();
  const history = useHistory();
  const { captureText, captureType, handleLoadingData, handleCaptureText, handleCaptureType } = useHeader();
  const [isLoadingComboData, setIsLoadingComboData] = useState<boolean>(false);
  const [account, setAccount] = useState<ISelectData[]>([]);
  const [accountId, setAccountId] = useState('');
  const [accountValue, setAccountValue] = useState('');
  const [accountTerm, setAccountTerm] = useState('');
  const [visualizeType, setVisualizeType] = useState('V');
  const [movementList, setMovementList] = useState<IFinancial[]>([]);
  const [dealList, setDealList] = useState<IFinancialDeal[]>([]);
  const [month, setMonth] = useState<string>(FormatDate(new Date(), 'MM'));
  const [year, setYear] = useState<string>(FormatDate(new Date(), 'yyyy'));
  const [movementId, setMovementId] = useState('');
  const [dealDetailId, setDealDetailId] = useState('');
  const [invoice, setInvoice] = useState('');
  const [showConfirmDelete, setShowConfirmDelete] = useState<boolean>(false);
  const [showDeleteOptions, setShowDeleteOptions] = useState<boolean>(false);
  const [showDeleteDealOptions, setShowDeleteDealOptions] = useState<boolean>(false);
  const [showDeleteDealInstallmentOptions, setShowDeleteDealInstallmentOptions] = useState<boolean>(false);
  const [showDocumentModal, setShowDocumentModal] = useState<boolean>(false);
  const [loadByFilter, setLoadByFilter] = useState<boolean>(false);
  const [showPaymentModal, setShowPaymentModal] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isInitialize, setIsInitialize] = useState<boolean>(true);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const { isMOBILE } = useDevice();
  const token = localStorage.getItem('@GoJur:token');
  const MDLFAT = localStorage.getItem('@GoJur:moduleCode');
  const [checkBillingContract, setCheckBillingContract] = useState<boolean>(false);
  const [parcelaAtual, setParcelaAtual] = useState('');
  const [isDeal, setIsDeal] = useState<boolean>(false);
  const [movementType, setMovementType] = useState("");

  // GRID
  const [pageSizes] = useState([10, 20, 30, 50]);
  const [dateColumns] = useState(['date']);
  const DateFormatter = ({ value }) => format(new Date(value), 'dd/MM/yyyy');
  const DateTypeProvider = props => (<DataTypeProvider formatterComponent={DateFormatter} {...props} />);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(50);
  const [totalCount, setTotalCount] = useState(0);

  // RESUME
  const [openingBalance, setOpeningBalance] = useState<number>(0);
  const [totalExpectedDebit, setTotalExpectedDebit] = useState<number>(0);
  const [totalExpectedIncome, setTotalExpectedIncome] = useState<number>(0);
  const [totalOverdueIncome, setTotalOverdueIncome] = useState<number>(0);
  const [totalPaidDebit, setTotalPaidDebit] = useState<number>(0);
  const [totalPaidIncome, setTotalPaidIncome] = useState<number>(0);
  const [totalNetExpected, setTotalNetExpected] = useState<number>(0);
  const [totalNetPaid, setTotalNetPaid] = useState<number>(0);


  return (
    <Container>

      <HeaderPage />

     

      {!isMOBILE && (
        <Content>

          <div style={{ height: '300px' }}>

          <div style={{ float: 'left', width: '50%', height: '280px' }}>
 
            <h3>Régua de Cobrança</h3><br/>

              <div className='autoComplete'>

                <p style={{ height: '27px' }}>Descrição</p>
                <input
                  type="text"
                  className='inputField'
                  maxLength={20}
                />

              </div>

              <div className="form-row">
                <label>Dias para aviso antes do vencimento</label>
                <input
                  type="number"
                  className='inputField'
                  maxLength={20}
                  min={0}
                  step={1}
                  style={{ flex: '0 0 100px' }}
                />
                <button type="button" title='O lembrete não será enviado para o e-mail do cliente'>
                  &nbsp;&nbsp;&nbsp;<FiMail className='notificationEmailInactive' />
                </button>
                 <button type="button" title='O lembrete não será enviado para o WhatsApp do cliente'>
                    <FaWhatsapp className='notificationWhatsAppInactive' />
                  </button> 
                  <button type="button" className='buttonLinkClick' style={{ width: "200px" }}>
                    Personalizar mensagens
                  </button>
              </div>

               <div className="form-row">
                <label>Dias para aviso no vencimento</label>
                <input
                  type="number"
                  className='inputField'
                  maxLength={20}
                  min={0}
                  step={1}
                  style={{ flex: '0 0 100px' }}
                />
                <button type="button" title='O lembrete não será enviado para o e-mail do cliente'>
                  &nbsp;&nbsp;&nbsp;<FiMail className='notificationEmailInactive' />
                </button>
                 <button type="button" title='O lembrete não será enviado para o WhatsApp do cliente'>
                    <FaWhatsapp className='notificationWhatsAppInactive' />
                  </button> 
                  <button type="button" className='buttonLinkClick' style={{ width: "200px" }}>
                    Personalizar mensagens
                  </button>
              </div>

              <div className="form-row">
                <label>Dias para aviso após o vencimento</label>
                <input
                  type="number"
                  className='inputField'
                  maxLength={20}
                  min={0}
                  step={1}
                  style={{ flex: '0 0 100px' }}
                />
                <button type="button" title='O lembrete não será enviado para o e-mail do cliente'>
                  &nbsp;&nbsp;&nbsp;<FiMail className='notificationEmailInactive' />
                </button>
                 <button type="button" title='O lembrete não será enviado para o WhatsApp do cliente'>
                    <FaWhatsapp className='notificationWhatsAppInactive' />
                  </button> 

                   <button type="button" className='buttonLinkClick' style={{ width: "200px" }}>
                    Personalizar mensagens
                  </button>

              </div>

                <div className="form-row">
                  <button className="buttonClick" type="submit">
                    <FiSave />
                    Salvar
                  </button>

                </div>

            </div>
          </div>

        
       
         
         
        </Content>
      )}


    </Container>
  );
};

export default BillingRule;
