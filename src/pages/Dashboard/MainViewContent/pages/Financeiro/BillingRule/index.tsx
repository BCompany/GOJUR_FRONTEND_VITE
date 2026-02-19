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

import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useForm } from 'react-hook-form';
import api from 'services/api';
import { ImMenu3, ImMenu4 } from 'react-icons/im';
import { GoDash, GoPlus } from 'react-icons/go';
import { FiTrash, FiEdit, FiX, FiMail, FiSave, FiAlertTriangle } from 'react-icons/fi';
import { FaRegTimesCircle, FaCheck, FaFileContract, FaFileInvoiceDollar, FaHandshake, FaWhatsapp, FaPencilAlt } from 'react-icons/fa';
import { CgFileDocument } from 'react-icons/cg';
import { RiMoneyDollarBoxFill } from 'react-icons/ri';
import { MdBlock } from 'react-icons/md';
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
import { Container, Content, FormCenter, FormCard, FormActions, GridContainerFinancial, FormTitle, ModalDeleteOptions, OverlayFinancial, HamburguerHeader } from './styles';
import DealDefaultModal from '../Category/Modal/DealDefaultModal';
import { trigger } from 'swr';
import { Form } from '../BillingContract/styles';
import { IBillingRuler, IBillingRulerWarning } from './Interfaces/IBillingRuler';
import { FcAlarmClock, FcCalendar } from "react-icons/fc";

const BillingRule: React.FC = () => {
  const { addToast } = useToast();
  const history = useHistory()
  const { signOut } = useAuth();
  const formRef = useRef<HTMLFormElement>(null);
  const { isMOBILE } = useDevice();
  const token = localStorage.getItem('@GoJur:token');
  const companyId = localStorage.getItem('@GoJur:companyId');
  const MDLFAT = localStorage.getItem('@GoJur:moduleCode');
  const [flgNotifyEmail1, setFlgNotifyEmail1] = useState<boolean>(true);
  const [flgNotifyWhatsApp1, setFlgNotifyWhatsApp1] = useState<boolean>(false);
  const [flgNotifyEmail2, setFlgNotifyEmail2] = useState<boolean>(true);
  const [flgNotifyWhatsApp2, setFlgNotifyWhatsApp2] = useState<boolean>(false);
  const [flgNotifyEmail3, setFlgNotifyEmail3] = useState<boolean>(true);
  const [flgNotifyWhatsApp3, setFlgNotifyWhatsApp3] = useState<boolean>(false);

  const [previoId, setPrevioId] = useState<Number>(0);
  const [vencimentoId, setVencimentoId] = useState<Number>(0);
  const [posteriorId, setPosteriorId] = useState<Number>(0);

  const [billingRulerId, setBillingRulerId] = useState<Number>(0);
  const [originalWarnings, setOriginalWarnings] = useState<IBillingRulerWarning[]>([]);


  type NotificationType = 'EMAIL' | 'WHATS' | 'EMAILWHATS' | 'NONE';


  const { handleSubmit, register, reset } = useForm<IBillingRuler>({
    defaultValues: {
      descriptionBillingRuler: '',
      billingRulerWarningDTOList: [
        {
          warningType: 'PREVIO',
          notificationType: 'EMAIL_WHATSAPP',
          daysOfWarning: 0
        },
        {
          warningType: 'VENCIMENTO',
          notificationType: 'EMAIL_WHATSAPP',
          daysOfWarning: 0
        },
        {
          warningType: 'POSTERIOR',
          notificationType: 'EMAIL_WHATSAPP',
          daysOfWarning: 0
        }
      ]
    }
  });


    const handleSubmitBillingRulerWarning = async (data: IBillingRuler) => {

    const params = new URLSearchParams(location.search);
    const billingRulerIdParam = Number(params.get('billingRulerId'));

    const finalBillingRulerId =
      billingRulerIdParam && billingRulerIdParam > 0
        ? billingRulerIdParam
        : billingRulerId && Number(billingRulerId) > 0
          ? billingRulerId
          : 0;


    const payload: IBillingRuler = {
      ...data,
      billingRulerId: finalBillingRulerId,
      token,
      companyId: Number(companyId),

      billingRulerWarningDTOList: data.billingRulerWarningDTOList.map(
        (item, index) => {

          const original = originalWarnings.find(
            w => w.warningType === item.warningType
          );

          return {
            ...item,

            billingRulerWarningId:
              index === 0
                ? previoId
                : index === 1
                  ? vencimentoId
                  : posteriorId,

            companyId: Number(companyId),
            billingRulerId: finalBillingRulerId,

            notificationType: resolveNotificationType(
              index === 0
                ? flgNotifyEmail1
                : index === 1
                  ? flgNotifyEmail2
                  : flgNotifyEmail3,
              index === 0
                ? flgNotifyWhatsApp1
                : index === 1
                  ? flgNotifyWhatsApp2
                  : flgNotifyWhatsApp3
            ),

            // 🔒 preserva os valores originais
            emailNotificationTitle:
              original?.emailNotificationTitle ?? item.emailNotificationTitle,

            emailNotificationDescription:
              original?.emailNotificationDescription ?? item.emailNotificationDescription,

            whatsAppNotificationDescription:
              original?.whatsAppNotificationDescription ?? item.whatsAppNotificationDescription
          };
        }
      )
    };

    try {
      const response = await api.post('/Financeiro/ReguaCobranca/Salvar', payload)

      //Recarrega Reguá de Cobrança

      const newId = Number(response.data);

      setBillingRulerId(newId);

      return reloadBillingRuler(newId);

    } catch (err: any) {

      console.error('STATUS ', err?.response?.status);
      console.error('ERRO API ', err?.response?.data);
      //alert(JSON.stringify(err?.response?.data, null, 2));


      addToast({
        type: 'info',
        title: 'Configure a Régua de Cobrança',
        description: err.response.data.Message
      });


      return null;

    }

  };



  const handleSubmitBillingRuler = async (data: IBillingRuler) => {

    const params = new URLSearchParams(location.search);
    const billingRulerIdParam = Number(params.get('billingRulerId'));

    const finalBillingRulerId =
      billingRulerIdParam && billingRulerIdParam > 0
        ? billingRulerIdParam
        : billingRulerId && Number(billingRulerId) > 0
          ? billingRulerId
          : 0;


    const payload: IBillingRuler = {
      ...data,
      billingRulerId: finalBillingRulerId,
      token,
      companyId: Number(companyId),

      billingRulerWarningDTOList: data.billingRulerWarningDTOList.map(
        (item, index) => {

          const original = originalWarnings.find(
            w => w.warningType === item.warningType
          );

          return {
            ...item,

            billingRulerWarningId:
              index === 0
                ? previoId
                : index === 1
                  ? vencimentoId
                  : posteriorId,

            companyId: Number(companyId),
            billingRulerId: finalBillingRulerId,

            notificationType: resolveNotificationType(
              index === 0
                ? flgNotifyEmail1
                : index === 1
                  ? flgNotifyEmail2
                  : flgNotifyEmail3,
              index === 0
                ? flgNotifyWhatsApp1
                : index === 1
                  ? flgNotifyWhatsApp2
                  : flgNotifyWhatsApp3
            ),

            // 🔒 preserva os valores originais
            emailNotificationTitle:
              original?.emailNotificationTitle ?? item.emailNotificationTitle,

            emailNotificationDescription:
              original?.emailNotificationDescription ?? item.emailNotificationDescription,

            whatsAppNotificationDescription:
              original?.whatsAppNotificationDescription ?? item.whatsAppNotificationDescription
          };
        }
      )
    };

    try {
      const response = await api.post('/Financeiro/ReguaCobranca/Salvar', payload)

      //Recarrega Reguá de Cobrança

      const newId = Number(response.data);

      setBillingRulerId(newId);


      addToast({
        type: "success",
        title: "Régua de Cobrança salva",
        description: Number(response.data) ? "As alterações feitas na Régua de Cobrança foram salvas" : "Régua de Cobrança adicionada"
      })

      return reloadBillingRuler(newId);

    } catch (err: any) {

      console.error('STATUS ', err?.response?.status);
      console.error('ERRO API ', err?.response?.data);
      //alert(JSON.stringify(err?.response?.data, null, 2));


      addToast({
        type: 'info',
        title: 'Operação NÃO realizada',
        description: err.response.data.Message
      });


      return null;

    }

  };



  const reloadBillingRuler = useCallback(async (billingRulerIdParam: number) => {
    try {
      const response = await api.get<IBillingRuler>(
        '/Financeiro/ReguaCobranca/Selecionar',
        {
          params: {
            id: billingRulerIdParam,
            token,
          },
        }
      );

      const data = response.data;

      reset(data);
        
      console.log(data);

      const previo = data.billingRulerWarningDTOList.find(
        x => x.warningType === 'PREVIO'
      );

      const vencimento = data.billingRulerWarningDTOList.find(
        x => x.warningType === 'VENCIMENTO'
      );

      const posterior = data.billingRulerWarningDTOList.find(
        x => x.warningType === 'POSTERIOR'
      );

      setPrevioId(previo?.billingRulerWarningId ?? 0);
      setVencimentoId(vencimento?.billingRulerWarningId ?? 0);
      setPosteriorId(posterior?.billingRulerWarningId ?? 0);
      
      console.log(data.billingRulerWarningDTOList); 
    
      const existeEmailPrevio = data.billingRulerWarningDTOList.some(
        x => (x.notificationType === 'EMAIL' || 
            x.notificationType === 'EMAILWHATS') &&
            x.warningType === 'PREVIO'
      );

       const existeWhatsPrevio = data.billingRulerWarningDTOList.some(
        x => (x.notificationType === 'WHATS' || 
            x.notificationType === 'EMAILWHATS') && 
            x.warningType === 'PREVIO'
      );

      const existeEmailVencimento = data.billingRulerWarningDTOList.some(
        x => (x.notificationType === 'EMAIL' || 
            x.notificationType === 'EMAILWHATS') &&
            x.warningType === 'VENCIMENTO'
      );

       const existeWhatsVencimento = data.billingRulerWarningDTOList.some(
        x => (x.notificationType === 'WHATS' || 
            x.notificationType === 'EMAILWHATS') && 
            x.warningType === 'VENCIMENTO'
      );

      const existeEmailPosterior = data.billingRulerWarningDTOList.some(
        x => (x.notificationType === 'EMAIL' || 
            x.notificationType === 'EMAILWHATS') &&
            x.warningType === 'POSTERIOR'
      );

       const existeWhatsPosterior = data.billingRulerWarningDTOList.some(
        x => (x.notificationType === 'WHATS' || 
            x.notificationType === 'EMAILWHATS') && 
            x.warningType === 'POSTERIOR'
      );

      setFlgNotifyEmail1(existeEmailPrevio)
      setFlgNotifyWhatsApp1(existeWhatsPrevio)

      setFlgNotifyEmail2(existeEmailVencimento) 
      setFlgNotifyWhatsApp2(existeWhatsVencimento)  

      setFlgNotifyEmail3(existeEmailPosterior) 
      setFlgNotifyWhatsApp3(existeWhatsPosterior)  
 
      setOriginalWarnings(data.billingRulerWarningDTOList);

      return data;

    } catch (err) {
      console.error(err);
      return null;
    }
  }, [token, reset]);




  const resolveNotificationType = (
    flgEmail: boolean,
    flgWhats: boolean
  ): NotificationType => {
    if (flgEmail && flgWhats) return 'EMAILWHATS';
    if (flgEmail) return 'EMAIL';
    if (flgWhats) return 'WHATS';
    return '';
  };



  const handlePersonalizarMensagem = (warningType: string) => {
    handleSubmit(async (data: IBillingRuler) => {

      const result = await handleSubmitBillingRulerWarning(data);

      const warning = result.billingRulerWarningDTOList.find(
        x => x.warningType === warningType
      );


      //history.push(
      //  `BillingRulesMessages?billingRulerWarningId=${warning?.billingRulerWarningId}&billingRulerId=${result.billingRulerId}&notificationType=${warning?.notificationType}`
      //);

      history.push(
        `BillingRulesMessages?billingRulerWarningId=${warning?.billingRulerWarningId}&billingRulerId=${result.billingRulerId}`
      );
       
    })();
  };


  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const billingRulerIdParam = Number(params.get('billingRulerId'));

    if (billingRulerIdParam && billingRulerIdParam > 0) {
      reloadBillingRuler(billingRulerIdParam);
    }

  }, [location.search]);

  return (
    <Container>
      <HeaderPage />

      {!isMOBILE && (
        <Content>
          <FormCenter>
            <FormCard>
              <FormTitle>Régua de Cobrança</FormTitle>

              <form onSubmit={handleSubmit(handleSubmitBillingRuler)}>
                {/* DESCRIÇÃO */}
                <div className="autoComplete">
              
                   <label >
                    Descrição
                  <input
                    type="text"
                    name="descriptionBillingRuler"
                    ref={register}
                    className="inputField"
                    maxLength={100}
                    required
                    placeholder='Ex: Régua padrão para clientes PJ'

                  />
                  </label>

                </div>
                <br />

                <div className="section">
                  <div className="section-title">
                    <FcCalendar />Antes do vencimento
                  </div>

                  <div className="row">

                    <span>Enviar aviso</span>

                    <input
                      type="number"
                      name="billingRulerWarningDTOList[0].daysOfWarning"
                      ref={register({ valueAsNumber: true })}
                      min={0}
                      step={1}
                      style={{ flex: '0 0 80px' }}
                      className="inputField"
                    />
                    <span>dias antes</span>

                    <input
                      type="hidden"
                      name="billingRulerWarningDTOList[0].billingRulerWarningId"
                      ref={register}
                      value={previoId}
                    />

                    <input
                      type="hidden"
                      name="billingRulerWarningDTOList[0].warningType"
                      ref={register}
                      value="PREVIO"
                    />

                  </div>

                  <div className="row channels">
                    <label className="channel">
                      <input type="checkbox" checked={flgNotifyEmail1} 
                        onChange={() => {
                          setFlgNotifyEmail1(!flgNotifyEmail1);
                        }}
                      ></input>

                      {flgNotifyEmail1 == true ? (
                        <FiMail className='notificationEmailActive' />
                      ) : (
                        <FiMail className='notificationEmailInactive' />
                      )}
                      Email
                    </label>

                    <label className="channel">
                      <input type="checkbox" checked={flgNotifyWhatsApp1} 
                          onChange={() => {
                            setFlgNotifyWhatsApp1(!flgNotifyWhatsApp1);
                          }}
                      >

                      </input>

                      {flgNotifyWhatsApp1 == true ? (
                        <FaWhatsapp className='notificationWhatsAppActive' />
                      ) : (
                        <FaWhatsapp className='notificationWhatsAppInactive' />
                      )}
                      WhatsApp

                    </label>


                    <button className="buttonLinkClick" type="button" onClick={() => handlePersonalizarMensagem("PREVIO")}>
                      <FaPencilAlt />
                      Personalizar Mensagem
                    </button>

                  </div>
                </div>


                <div className="section">
                  <div className="section-title"> <FcAlarmClock />No vencimento
                  </div>

                  <div className="row">

                    <span>Enviar aviso no dia do vencimento</span>

                    <input
                      type="hidden"
                      name="billingRulerWarningDTOList[1].billingRulerWarningId"
                      ref={register}
                      value={vencimentoId}
                    />

                    <input
                      type="hidden"
                      name="billingRulerWarningDTOList[1].warningType"
                      ref={register}
                      value="VENCIMENTO"
                    />

                    <input
                      type="hidden"
                      name="billingRulerWarningDTOList[1].daysOfWarning"
                      ref={register}
                      value="0"
                    />

                  </div>

                  <div className="row channels">
                    <label className="channel">
                      <input type="checkbox" checked={flgNotifyEmail2} 
                       onChange={() => { 
                        setFlgNotifyEmail2(!flgNotifyEmail2);
                      }}
                      ></input>
                      {flgNotifyEmail2 == true ? (
                        <FiMail className='notificationEmailActive' />
                      ) : (
                        <FiMail className='notificationEmailInactive' />
                      )}
                      Email
                    </label>

                    <label className="channel">
                      <input type="checkbox" checked={flgNotifyWhatsApp2} 
                      onChange={() => {
                        setFlgNotifyWhatsApp2(!flgNotifyWhatsApp2);
                      }}
                      ></input>
                      {flgNotifyWhatsApp2 == true ? (
                        <FaWhatsapp className='notificationWhatsAppActive' />
                      ) : (
                        <FaWhatsapp className='notificationWhatsAppInactive' />
                      )}
                      WhatsApp

                    </label>


                    <button className="buttonLinkClick" type="button" onClick={() => handlePersonalizarMensagem("VENCIMENTO")}>
                      <FaPencilAlt />
                      Personalizar Mensagem
                    </button>

                  </div>
                </div>

                <div className="section">
                  <div className="section-title"> <FiAlertTriangle />Após o vencimento</div>

                  <div className="row">

                    <span>Enviar aviso</span>

                    <input
                      type="number"
                      name="billingRulerWarningDTOList[2].daysOfWarning"
                      ref={register({ valueAsNumber: true })}
                      min={0}
                      step={1}
                      style={{ flex: '0 0 80px' }}
                      className="inputField"
                    />
                    <span>dias após</span>

                    <input
                      type="hidden"
                      name="billingRulerWarningDTOList[2].billingRulerWarningId"
                      ref={register}
                      value={posteriorId}
                    />

                    <input
                      type="hidden"
                      name="billingRulerWarningDTOList[2].warningType"
                      ref={register}
                      value="POSTERIOR"
                    />

                  </div>

                  <div className="row channels">
                    <label className="channel">  
                      <input type="checkbox" checked={flgNotifyEmail3}    
                      onChange={() => {
                        setFlgNotifyEmail3(!flgNotifyEmail3);
                      }}  
                      ></input> 
                      {flgNotifyEmail3 == true ? (
                        <FiMail className='notificationEmailActive' />
                      ) : (
                        <FiMail className='notificationEmailInactive' />
                      )}
                      Email

                    </label>

                    <label className="channel">
                      <input type="checkbox" checked={flgNotifyWhatsApp3} 
                      onChange={() => {
                        setFlgNotifyWhatsApp3(!flgNotifyWhatsApp3);
                      }}
                      ></input>
                      {flgNotifyWhatsApp3 == true ? (
                        <FaWhatsapp className='notificationWhatsAppActive' />
                      ) : (
                        <FaWhatsapp className='notificationWhatsAppInactive' />
                      )}
                      WhatsApp
                    </label>


                    <button className="buttonLinkClick" type="button" onClick={() => handlePersonalizarMensagem("POSTERIOR")}>
                      <FaPencilAlt />
                      Personalizar Mensagem
                    </button>

                  </div>
                </div>




                {/*
                <div className="form-row">
                  <label>Dias para aviso antes do vencimento</label>

                  <input
                    type="number"
                    name="billingRulerWarningDTOList[0].daysOfWarning"
                    ref={register({ valueAsNumber: true })}
                    min={0}
                    step={1}
                    style={{ flex: '0 0 100px' }}
                    className="inputField"
                  />

           
                  <input
                    type="hidden"
                    name="billingRulerWarningDTOList[0].warningType"
                    ref={register}
                    value="PREVIO"
                  />
                 

                {flgNotifyEmail1 == true ? (
                  <button type="button" onClick={() => {setFlgNotifyEmail1(false)}} title='O lembrete será enviado para o e-mail do cliente'>
                    <FiMail className='notificationEmailActive' />
                  </button>
                ) : (
                  <button type="button" onClick={() => {setFlgNotifyEmail1(true)}} title='O lembrete não será enviado para o e-mail do cliente'>
                    <FiMail className='notificationEmailInactive' />
                  </button>
                )}
              
                {flgNotifyWhatsApp1 == true ? (
                  <button type="button" onClick={() => {setFlgNotifyWhatsApp1(false)}} title='O lembrete será enviado para o WhatsApp do cliente'>
                    <FaWhatsapp className='notificationWhatsAppActive' />
                  </button>
                ) : (
                  <button type="button" onClick={() => {setFlgNotifyWhatsApp1(true)}} title='O lembrete não será enviado para o WhatsApp do cliente'>
                    <FaWhatsapp className='notificationWhatsAppInactive' />
                  </button>
                )}


                  <button type="button" className="buttonLinkClick">
                    Personalizar Mensagem
                  </button>

                </div>

                
                <div className="form-row">
                  <label>Dias para aviso no vencimento</label>

                  <input
                    type="number"
                    name="billingRulerWarningDTOList[1].daysOfWarning"
                    ref={register({ valueAsNumber: true })}
                    min={0}
                    step={1}
                    style={{ flex: '0 0 100px' }}
                    className="inputField"
                  />

                  <input
                    type="hidden"
                    name="billingRulerWarningDTOList[1].warningType"
                    ref={register}
                    value="VENCIMENTO"
                  />
                 
                {flgNotifyEmail2 == true ? (
                  <button type="button" onClick={() => {setFlgNotifyEmail2(false)}} title='O lembrete será enviado para o e-mail do cliente'>
                    <FiMail className='notificationEmailActive' />
                  </button>
                ) : (
                  <button type="button" onClick={() => {setFlgNotifyEmail2(true)}} title='O lembrete não será enviado para o e-mail do cliente'>
                    <FiMail className='notificationEmailInactive' />
                  </button>
                )}
              
                {flgNotifyWhatsApp2 == true ? (
                  <button type="button" onClick={() => {setFlgNotifyWhatsApp2(false)}} title='O lembrete será enviado para o WhatsApp do cliente'>
                    <FaWhatsapp className='notificationWhatsAppActive' />
                  </button>
                ) : (
                  <button type="button" onClick={() => {setFlgNotifyWhatsApp2(true)}} title='O lembrete não será enviado para o WhatsApp do cliente'>
                    <FaWhatsapp className='notificationWhatsAppInactive' />
                  </button>
                )}
                
                  <button type="button" className="buttonLinkClick">
                    Personalizar Mensagem
                  </button>

                </div>

                
                <div className="form-row">
                  <label>Dias para aviso após o vencimento</label>

                  <input
                    type="number"
                    name="billingRulerWarningDTOList[2].daysOfWarning"
                    ref={register({ valueAsNumber: true })}
                    min={0}
                    step={1}
                    style={{ flex: '0 0 100px' }}
                    className="inputField"
                  />

                  <input
                    type="hidden"
                    name="billingRulerWarningDTOList[2].warningType"
                    ref={register}
                    value="POSTERIOR"
                  />

                {flgNotifyEmail3 == true ? (
                  <button type="button" onClick={() => {setFlgNotifyEmail3(false)}} title='O lembrete será enviado para o e-mail do cliente'>
                    <FiMail className='notificationEmailActive' />
                  </button>
                ) : (
                  <button type="button" onClick={() => {setFlgNotifyEmail3(true)}} title='O lembrete não será enviado para o e-mail do cliente'>
                    <FiMail className='notificationEmailInactive' />
                  </button>
                )}
              
                {flgNotifyWhatsApp3 == true ? (
                  <button type="button" onClick={() => {setFlgNotifyWhatsApp3(false)}} title='O lembrete será enviado para o WhatsApp do cliente'>
                    <FaWhatsapp className='notificationWhatsAppActive' />
                  </button>
                ) : (
                  <button type="button" onClick={() => {setFlgNotifyWhatsApp3(true)}} title='O lembrete não será enviado para o WhatsApp do cliente'>
                    <FaWhatsapp className='notificationWhatsAppInactive' />
                  </button>
                )}
                

                  <button type="button" className="buttonLinkClick">
                    Personalizar Mensagem
                  </button>

                </div>

                {/* AÇÕES */}
                <FormActions>
                  <button className="buttonClick" type="submit">
                    <FiSave />
                    Salvar
                  </button>

                  <button className="buttonClick" type="button"  onClick={() => history.push('/financeiro/billingrule/list')}>
                    <MdBlock />
                    Fechar
                  </button>
                </FormActions>
              </form>
            </FormCard>
          </FormCenter>
        </Content>
      )}
    </Container>
  );
};

export default BillingRule;