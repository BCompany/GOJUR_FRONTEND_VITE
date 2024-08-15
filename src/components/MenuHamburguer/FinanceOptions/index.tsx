/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
// eslint-disable-next-line jsx-a11y/click-events-have-key-events
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable react/jsx-one-expression-per-line */

import React, { useCallback, useEffect, useState } from 'react';
import api from 'services/api';
import Select from 'react-select';
import LoaderWaiting from 'react-spinners/ClipLoader';
import { useToast } from 'context/toast';
import { FiX } from 'react-icons/fi';
import { FaTools, FaRegTimesCircle, FaCheck, FaFileContract }from 'react-icons/fa';
import { AiOutlinePrinter, AiOutlineEnter } from 'react-icons/ai';
import { useDevice } from "react-use-device";
import { selectStyles, useDelay, currencyConfig, FormatDate } from 'Shared/utils/commonFunctions';
import { useMenuHamburguer } from 'context/menuHamburguer'
import { envProvider } from 'services/hooks/useEnv';
import { IDefaultsProps } from 'pages/Printers/Interfaces/Common/ICommon';
import { useSecurity } from 'context/securityContext';
import { SecurityModule } from 'context/Interfaces/ISecurity';
import { HeaderPageCustom } from '../HeaderPageOptions/HeaderPageCustom';
import { ServiceTypeCustom } from '../HeaderPageOptions/ServiceTypeCustom';
import { MenuHamburger, DealCategoryModal, OverlayConfirm, OverlaySave } from './styles';

export interface ISelectData{
  id: string;
  label: string;
};

const FinanceOptionsMenu = (props) => {
  const { handleMarkedPaid } = props.callbackList;
  const { handleIsOpenMenuConfig, handleIsMenuOpen, handleCaller, handleIsOpenMenuDealDefaultCategory, isOpenMenuDealDefaultCategory } = useMenuHamburguer();
  const [showConfigMenu, setShowConfigMenu] = useState<boolean>(false);
  const [showReportMenu, setShowReportMenu] = useState<boolean>(false);
  const {permissionsSecurity, handleValidateSecurity } = useSecurity();
  const token = localStorage.getItem('@GoJur:token');
  const MDLFAT = localStorage.getItem('@GoJur:moduleCode');
  const baseUrl = envProvider.redirectUrl;
  const { isMOBILE } = useDevice();
  const { addToast } = useToast();

  const checkFinancialIntegration = permissionsSecurity.find(item => item.name === "FININTEG");
  const markedPaid = permissionsSecurity.find(item => item.name === "FINBXPAG");
  const checkPaymentSlip = permissionsSecurity.find(item => item.name === "FINCARCO");
  const checkCategory = permissionsSecurity.find(item => item.name === "FINCATG");
  const checkCostCenter = permissionsSecurity.find(item => item.name === "FINCCUST");
  const checkAccount = permissionsSecurity.find(item => item.name === "FINACCO");
  const checkPaymentType = permissionsSecurity.find(item => item.name === "FINPAYFO");
  const checkServiceType = permissionsSecurity.find(item => item.name === "CFGSERTP");
  const checkFinancialStatus = permissionsSecurity.find(item => item.name === "FATFINST");

  // REPORT PERMISSIONS
  const checkIncomeExpense = permissionsSecurity.find(item => item.name === "FINRPT1");
  const checkHonorarium = permissionsSecurity.find(item => item.name === "FINRPT2");
  const checkHonorariumSumary = permissionsSecurity.find(item => item.name === "FINRPT3");
  const checkRefund = permissionsSecurity.find(item => item.name === "FINRPT4");
  const checkCashFlow = permissionsSecurity.find(item => item.name === "FINRPT5");

  const billingContract = permissionsSecurity.find(item => item.name === "FATCTTO");
  const [checkBillingContract, setCheckBillingContract] = useState<boolean>(false);

  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
 

  useEffect(() => {
    if(MDLFAT == 'MDLFAT#')
    {
      setCheckBillingContract(true)
    }
  }, [])


  useEffect(() => {
    handleValidateSecurity(SecurityModule.financial)
  }, [])


  useEffect(() => {
    LoadDefaultProps();
    setIsLoading(true);
  },[])


  const LoadDefaultProps = async () => {
    try {
      const response = await api.post<IDefaultsProps[]>('/Defaults/Listar', {
        token,
      });

      // get values from permission by user and set as true or false
      const userPermissions = response.data.filter(item => item.id === 'defaultModulePermissions')
      const permissiosnModule = userPermissions[0].value.split('|')
      const matterReportButton = permissiosnModule.find(item => item === 'matterReport' || item === 'adm')

    } catch (err) {
      console.log(err);
    }
  }


  const handleClickContracts = () => {
    handleRedirect(`/financeiro/billingcontract/list`)
  }


  // REPORTS
  const IncomeExpense = () => {
    handleRedirect(`/financeiro/report/incomeexpenselist`)
  }


  const Honorarium = () => {
    handleRedirect(`/financeiro/report/honorariumlist`)
  }


  const HonorariumSumary = () => {
    handleRedirect(`/financeiro/report/honorariumsummarylist`)
  }


  const Refund = () => {
    handleRedirect(`/financeiro/report/refundlist`)
  }


  const CashFlow = () => {
    handleRedirect(`/financeiro/report/cashflowlist`)
  }


  const handleRedirect = useCallback((url: string) => {
    window.location.href = url;
  }, []);


  const handlePaymentSlip = useCallback(() => {
    handleIsOpenMenuConfig(true)
    setShowConfigMenu(false)
    handleIsMenuOpen(false)
    handleRedirect(`/PaymentSlipContract/List`)
  }, []);
  


  const handleFinancialIntegration = useCallback(() => {
    handleIsOpenMenuConfig(true)
    setShowConfigMenu(false)
    handleIsMenuOpen(false)
    handleRedirect(`/FinancialIntegration/List`)
  }, []);


  const handleCategory = useCallback(() => {
    handleIsOpenMenuConfig(true)
    setShowConfigMenu(false)
    handleIsMenuOpen(false)
    handleRedirect(`/Category`)
  }, []);


  const handleCostCenter = useCallback(() => {
    handleIsOpenMenuConfig(true)
    setShowConfigMenu(false)
    handleIsMenuOpen(false)
    handleRedirect(`/CostCenter`)
  }, []);


  const handleAccount = useCallback(() => {
    handleIsOpenMenuConfig(true)
    setShowConfigMenu(false)
    handleIsMenuOpen(false)
    handleRedirect(`/Account`)
  }, []);


  const handlePaymentType = useCallback(() => {
    handleIsOpenMenuConfig(true)
    setShowConfigMenu(false)
    handleIsMenuOpen(false)
    handleRedirect(`/PaymentForm`)
  }, []);


  const handleServiceType = useCallback(() => {
    handleIsOpenMenuConfig(true)
    setShowConfigMenu(false)
    handleIsMenuOpen(false)
    handleRedirect(`/ServiceType`)
  }, []);


  const handleFinancialStatus = useCallback(() => {
    handleIsOpenMenuConfig(true)
    setShowConfigMenu(false)
    handleIsMenuOpen(false)
    handleRedirect(`/FinancialStatus`)
  }, []);


  return(
    <>
      {!isMOBILE &&(
        <MenuHamburger>
          <div className="menuSection" onClick={() => setShowConfigMenu(!showConfigMenu)}>
            <FaTools />
            &nbsp;Configurações
          </div>

          {checkPaymentSlip &&(
            <>
              <div style={{display:(showConfigMenu?'grid':'none')}}>
                <HeaderPageCustom callback={{handlePaymentSlip}} />
              </div>
            </>
          )}

          {checkFinancialIntegration &&(
            <>
              <div style={{display:(showConfigMenu?'grid':'none')}}>
                <hr />
                <button type="button" className="menuLink" onClick={() => {handleFinancialIntegration()}}
                >
                  Integrador Financeiro
                </button>
              </div>
            </>
          )}

          {markedPaid && (
            <>
              <div style={{display:(showConfigMenu?'grid':'none')}}>
                <hr />
                <button type="button" className="menuLink" onClick={() => {handleMarkedPaid()}}
                >
                  Realizar baixas
                </button>
              </div>
            </>
          )}

          {checkCategory &&(
            <>
              <div style={{display:(showConfigMenu?'grid':'none')}}>
                <hr />
                <button
                  type="button"
                  className="menuLink"
                  onClick={() => {
                    handleCategory();
                  }}
                >
                  Categoria
                </button>
              </div>
            </>
          )}

          {checkCategory &&(
            <>
              <div style={{display:(showConfigMenu?'grid':'none')}}>
                <hr />
                <button
                  type="button"
                  className="menuLink"
                  onClick={() => {
                    handleIsOpenMenuDealDefaultCategory(!isOpenMenuDealDefaultCategory)
                    handleIsMenuOpen(false)
                  }}
                >
                  Categoria do Acordo
                </button>
              </div>
            </>
          )}

          {checkCostCenter &&(
            <>
              <div style={{display:(showConfigMenu?'grid':'none')}}>
                <hr />
                <button
                  type="button"
                  className="menuLink"
                  onClick={() => {
                    handleCostCenter();
                  }}
                >
                  Centro de Custo
                </button>
              </div>
            </>
          )}

          {checkAccount &&(
            <>
              <div style={{display:(showConfigMenu?'grid':'none')}}>
                <hr />
                <button
                  type="button"
                  className="menuLink"
                  onClick={() => {
                    handleAccount();
                  }}
                >
                  Conta
                </button>
              </div>
            </>
          )}

          {checkPaymentType &&(
            <>
              <div style={{display:(showConfigMenu?'grid':'none')}}>
                <hr />
                <button
                  type="button"
                  className="menuLink"
                  onClick={() => {
                    handlePaymentType();
                  }}
                >
                  Forma de Pagamento
                </button>
              </div>
            </>
          )}

          {checkServiceType &&(
            <>
              <div style={{display:(showConfigMenu?'grid':'none')}}>
                <ServiceTypeCustom callback={{handleServiceType}} />
              </div>
            </>
          )}

          {checkFinancialStatus &&(
            <>
              <div style={{display:(showConfigMenu?'grid':'none')}}>
                <hr />
                <button
                  type="button"
                  className="menuLink"
                  onClick={() => {
                    handleFinancialStatus();
                  }}
                >
                  Status Financeiro
                </button>
              </div>
            </>
          )}

          <hr />

          <div className="menuSection" onClick={() => setShowReportMenu(!showReportMenu)}>
            <AiOutlinePrinter />
            &nbsp;Relatórios
          </div>

          {checkIncomeExpense &&(
            <div style={{display:(showReportMenu?'grid':'none')}}>
              <hr />
              <button
                type="button"
                className="menuLink"
                onClick={() => {IncomeExpense()}}
              >
                Movimentação Financeira
              </button>
            </div>
          )}

          {checkHonorarium &&(
            <div style={{display:(showReportMenu?'grid':'none')}}>
              <hr />
              <button
                type="button"
                className="menuLink"
                onClick={() => {Honorarium()}}
              >
                Honorários
              </button>
            </div>
          )}

          {checkHonorariumSumary &&(
            <div style={{display:(showReportMenu?'grid':'none')}}>
              <hr />
              <button
                type="button"
                className="menuLink"
                onClick={() => {HonorariumSumary()}}
              >
                Resumo Honorários
              </button>
            </div>
          )}

          {checkRefund &&(
            <div style={{display:(showReportMenu?'grid':'none')}}>
              <hr />
              <button
                type="button"
                className="menuLink"
                onClick={() => {Refund()}}
              >
                Reembolso
              </button>
            </div>
          )}

          {checkCashFlow &&(
            <div style={{display:(showReportMenu?'grid':'none')}}>
              <hr />
              <button
                type="button"
                className="menuLink"
                onClick={() => {CashFlow()}}
              >
                Fluxo de Caixa
              </button>
            </div>
          )}

        </MenuHamburger>
      )}

      {isMOBILE &&(
        <MenuHamburger>

          <div className="menuSection" onClick={() => setShowConfigMenu(!showConfigMenu)}>
            <FaTools />
            &nbsp;Configurações
          </div>

          {checkPaymentSlip &&(
            <>
              <div style={{display:(showConfigMenu?'grid':'none')}}>
                <HeaderPageCustom callback={{handlePaymentSlip}} />
              </div>
            </>
          )}

          {checkCategory &&(
            <>
              <div style={{display:(showConfigMenu?'grid':'none')}}>
                <hr />
                <button
                  type="button"
                  className="menuLink"
                  onClick={() => {
                    handleCategory();
                  }}
                >
                  Categoria
                </button>
              </div>
            </>
          )}

          {checkCategory &&(
            <>
              <div style={{display:(showConfigMenu?'grid':'none')}}>
                <hr />
                <button
                  type="button"
                  className="menuLink"
                  onClick={() => {
                    handleIsOpenMenuDealDefaultCategory(!isOpenMenuDealDefaultCategory)
                    handleIsMenuOpen(false)
                  }}
                >
                  Categoria do Acordo
                </button>
              </div>
            </>
          )}

          {checkCostCenter &&(
            <>
              <div style={{display:(showConfigMenu?'grid':'none')}}>
                <hr />
                <button
                  type="button"
                  className="menuLink"
                  onClick={() => {
                    handleCostCenter();
                  }}
                >
                  Centro de Custo
                </button>
              </div>
            </>
          )}

          {checkAccount &&(
            <>
              <div style={{display:(showConfigMenu?'grid':'none')}}>
                <hr />
                <button
                  type="button"
                  className="menuLink"
                  onClick={() => {
                    handleAccount();
                  }}
                >
                  Conta
                </button>
              </div>
            </>
          )}

          {checkPaymentType &&(
            <>
              <div style={{display:(showConfigMenu?'grid':'none')}}>
                <hr />
                <button
                  type="button"
                  className="menuLink"
                  onClick={() => {
                    handlePaymentType();
                  }}
                >
                  Forma de Pagamento
                </button>
              </div>
            </>
          )}

          {checkServiceType &&(
            <>
              <div style={{display:(showConfigMenu?'grid':'none')}}>
                <ServiceTypeCustom callback={{handleServiceType}} />
              </div>
            </>
          )}

          {checkFinancialStatus &&(
            <>
              <div style={{display:(showConfigMenu?'grid':'none')}}>
                <hr />
                <button
                  type="button"
                  className="menuLink"
                  onClick={() => {
                    handleFinancialStatus();
                  }}
                >
                  Status Financeiro
                </button>
              </div>
            </>
          )}
        </MenuHamburger>
      )}

      {isSaving && (
        <>
          <OverlaySave />
          <div className='waitingMessage'>
            <LoaderWaiting size={15} color="var(--blue-twitter)" />
            Salvando...
          </div>
        </>
      )}
    </>
  )

}

export default FinanceOptionsMenu
