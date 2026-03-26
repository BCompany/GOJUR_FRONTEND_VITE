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
import IntlCurrencyInput from "react-intl-currency-input";
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
import { selectStyles, FormatDate, currencyConfig, FormatCurrency, useDelay } from 'Shared/utils/commonFunctions';
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
import { IFinancialIntegrator} from './Interfaces/IFinancialIntegrator';

import { FcAlarmClock, FcCalendar } from "react-icons/fc";

const FinancialIntegrator: React.FC = () => {
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

  const [financialIntegratorId, setFinancialIntegratorId] = useState<Number>(0);
  const [originalWarnings, setOriginalWarnings] = useState<IBillingRulerWarning[]>([]);
const [penalty, setPenalty] = useState("0");
const [lateInterest, setLateInterest] = useState("0");



  type NotificationType = 'EMAIL' | 'WHATS' | 'EMAILWHATS' | 'NONE';


  const { handleSubmit, register, reset, setValue  } = useForm<IFinancialIntegrator>({
    defaultValues: {
        descriptionBillingRuler: '',
        financialIntegratorName: '',
        financialPartnerType: '',
        financialToken: '',
        penaltyPercentage: '0',
        lateInterestPercentage: '0'
    }
  });





  const handleSubmitFinancialIntegrator = async (data: IFinancialIntegrator) => {

    const params = new URLSearchParams(location.search);
    const financialIntegratorIdParam = Number(params.get('financialIntegratorId'));

    const finalfinancialIntegratorId =
      financialIntegratorIdParam && financialIntegratorIdParam > 0
        ? financialIntegratorIdParam
        : financialIntegratorId && Number(financialIntegratorId) > 0
          ? financialIntegratorId
          : 0;


    const payload: IFinancialIntegrator = {
      ...data,
      financialIntegratorId: finalfinancialIntegratorId,
      token,
      companyId: Number(companyId),
    };

    try {
      const response = await api.post('/IntegradorFinanceiro/Salvar', payload)

      //Recarrega Reguá de Cobrança

      const newId = Number(response.data);

      setFinancialIntegratorId(newId);


      addToast({
        type: "success",
        title: "Integrador Financeiro Salvo",
        description: Number(response.data) ? "As alterações feitas no integrador financeiro foram salvas" : "Integrador financeiro adicionado"
      })

      return reloadFinancialIntegrator(newId);

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



  const reloadFinancialIntegrator = useCallback(async (financialIntegratorId: number) => {
    try {
      const response = await api.get<IFinancialIntegrator>(
        '/IntegradorFinanceiro/Selecionar',
        {
          params: {
            id: financialIntegratorId,
            token,
          },
        }
      );

      const data = response.data;

      reset(data);
        
        setValue('penaltyPercentage', data.penaltyPercentage);
        setValue('lateInterestPercentage', data.lateInterestPercentage);

        setPenalty(data.penaltyPercentage);

        setLateInterest(data.lateInterestPercentage);

     console.log(data);

      return data;

    } catch (err) {
      console.error(err);
      return null;
    }
  }, [token, reset]);



  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const financialIntegratorIdParam = Number(params.get('financialIntegratorId'));

    if (financialIntegratorIdParam && financialIntegratorIdParam > 0) {
      reloadFinancialIntegrator(financialIntegratorIdParam);
    }

  }, [location.search]);

  return (
    <Container>
      <HeaderPage />

      {!isMOBILE && (
        <Content>
          <FormCenter>
            <FormCard>
              <FormTitle>Integrador Financeiro</FormTitle>

              <form onSubmit={handleSubmit(handleSubmitFinancialIntegrator)}>
                {/* DESCRIÇÃO */}
                <div className="autoComplete">
              
                   <label >
                    Nome
                  <input
                    type="text"
                    name="financialIntegratorName"
                    ref={register}
                    className="inputField"
                    maxLength={100}
                    required
                    placeholder='Digite o nome do integrador'

                  />
                  </label>

                </div>

                <div className="autoComplete">
              
                   <label >
                    API Key
                  <input
                    type="text"
                    name="financialToken"
                    ref={register}
                    className="inputField"
                    maxLength={100}
                    required
                    placeholder='Digite p Token do integrador'

                  />
                  </label>

                </div>

                 <div className="autoComplete">
              
                   <label >
                    Tipo de parceiro
                  <input
                    type="text"
                    name="financialPartnerType"
                    ref={register}
                    className="inputField"
                    maxLength={100}
                    required
                    placeholder='Digite o tipo de parceiro ex: Itaú, Bradesco, Asaas'

                  />
                  </label>

                </div>

                <br />

                <div className="section">
                 
                  <div className="row">

                    <span>Multa</span>

                        <IntlCurrencyInput
                        currency="BRL"
                        config={currencyConfig}
                        name="penaltyPercentage"
                        className="inputField"
                        value={penalty}
                        style={{ flex: '0 0 80px' }}
                        onChange={(event, value) => {
                            setPenalty(value);
                            setValue('penaltyPercentage', value);
                        }}
                        />
                                            
                    <span>Juros</span>

                   <IntlCurrencyInput
                        currency="BRL"
                        config={currencyConfig}
                        name="lateInterestPercentage"
                        className="inputField"
                        value={lateInterest}
                        style={{ flex: '0 0 80px' }}
                        onChange={(event, value) => {
                            setLateInterest(value);
                            setValue('lateInterestPercentage', value);
                        }}
                        />
                 

<input type="hidden" name="penaltyPercentage" ref={register} />
<input type="hidden" name="lateInterestPercentage" ref={register} />

                  </div>

                </div>



                {/* AÇÕES */}
                <FormActions>
                  <button className="buttonClick" type="submit">
                    <FiSave />
                    Salvar
                  </button>

                  <button className="buttonClick" type="button"  onClick={() => history.push('/financeiro/financialintegrator/list')}>
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

export default FinancialIntegrator;