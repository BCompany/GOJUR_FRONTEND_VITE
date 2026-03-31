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
import { FiTrash, FiEdit, FiX, FiMail, FiSave, FiAlertTriangle } from 'react-icons/fi';
import { MdBlock } from 'react-icons/md';
import { useDevice } from "react-use-device";
import { useToast } from 'context/toast';
import { integratorTypes } from 'Shared/utils/commonListValues';
import { useHistory } from 'react-router-dom';
import { HeaderPage } from 'components/HeaderPage';
import { useAuth } from 'context/AuthContext';
import Select from 'react-select';
import { selectStyles, FormatDate, currencyConfig, FormatCurrency, useDelay } from 'Shared/utils/commonFunctions';
import { Container, Content, FormCenter, FormCard, FormActions, FormTitle, SectionRow } from './styles';
import { IFinancialIntegrator } from './Interfaces/IFinancialIntegrator';


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

  const [previoId, setPrevioId] = useState<number>(0);
  const [vencimentoId, setVencimentoId] = useState<number>(0);
  const [posteriorId, setPosteriorId] = useState<number>(0);
  const [integratorsTypeId, setInegratorTypeId] = useState("ASAAS");

  const [financialIntegratorId, setFinancialIntegratorId] = useState<number>(0);
  const [originalWarnings, setOriginalWarnings] = useState<IBillingRulerWarning[]>([]);
  const [penalty, setPenalty] = useState("0");
  const [lateInterest, setLateInterest] = useState("0");



  type NotificationType = 'EMAIL' | 'WHATS' | 'EMAILWHATS' | 'NONE';


  const { handleSubmit, register, reset, setValue } = useForm<IFinancialIntegrator>({
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





                <label htmlFor="Integrador">
                  Integrador / Banco
                  <Select
                    autoComplete="off"
                    isClearable
                    styles={selectStyles}
                    value={integratorTypes.filter(options => options.id === integratorsTypeId)}
                    onChange={(item) => setInegratorTypeId(item ? item.id : '')}
                    options={integratorTypes}
                    placeholder="Selecione"
                  />
                </label>

                <SectionRow>
                  <label htmlFor="Multa">
                    Multa
                    <IntlCurrencyInput
                      currency="BRL"
                      config={currencyConfig}
                      name="penaltyPercentage"
                      className="inputField"
                      value={penalty}
                      onChange={(event, value) => {
                        setPenalty(value);
                        setValue('penaltyPercentage', value);
                      }}
                    />

                  </label>
                  <label htmlFor="Juros">
                    Juros

                    <IntlCurrencyInput
                      currency="BRL"
                      config={currencyConfig}
                      name="lateInterestPercentage"
                      className="inputField"
                      value={lateInterest}
                      onChange={(event, value) => {
                        setLateInterest(value);
                        setValue('lateInterestPercentage', value);
                      }}
                    />
                  </label>

                  <input type="hidden" name="penaltyPercentage" ref={register} />
                  <input type="hidden" name="lateInterestPercentage" ref={register} />


                </SectionRow>




                {/* AÇÕES */}
                <FormActions>
                  <button className="buttonClick" type="submit">
                    <FiSave />
                    Salvar
                  </button>

                  <button className="buttonClick" type="button" onClick={() => history.push('/financeiro/financialintegrator/list')}>
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