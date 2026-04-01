import { HeaderPage } from 'components/HeaderPage';
import { useToast } from 'context/toast';
import React, { useCallback, useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { FiSave } from 'react-icons/fi';
import { MdBlock } from 'react-icons/md';
import IntlCurrencyInput from "react-intl-currency-input";
import { useHistory } from 'react-router-dom';
import Select from 'react-select';
import { useDevice } from "react-use-device";
import api from 'services/api';
import { currencyConfig, selectStyles } from 'Shared/utils/commonFunctions';
import { financialIntegratorTypes } from 'Shared/utils/commonListValues';
import { IFinancialIntegrator } from './Interfaces/IFinancialIntegrator';
import { Container, Content, FormActions, FormCard, FormCenter, FormTitle, SectionRow } from './styles';


const FinancialIntegrator: React.FC = () => {

  const { addToast } = useToast();
  const history = useHistory()
  const { isMOBILE } = useDevice();
  const token = localStorage.getItem('@GoJur:token');
  const apiKey = localStorage.getItem('@GoJur:apiKey');
  const companyId = localStorage.getItem('@GoJur:companyId');
  const [financialIntegratorId, setFinancialIntegratorId] = useState<number>(0);


  const { handleSubmit, register, reset, setValue, control } = useForm<IFinancialIntegrator>({
    defaultValues: {
      financialIntegratorName: '',
      integratorType: '',
      financialToken: '',
      penaltyPercentage: 0,
      lateInterestPercentage: 0
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
      apiKey,
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
            companyId,
            token,
            apiKey
          },
        }
      );

      const data = response.data;


      reset(data);


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

                  <Controller
                    name="integratorType"
                    control={control}
                    defaultValue=""
                    render={(props) => (
                      <Select
                        autoComplete="off"
                        isClearable
                        styles={selectStyles}
                        options={financialIntegratorTypes}
                        placeholder="Selecione"

                        value={financialIntegratorTypes.find(
                          option => option.id === props.value
                        )}

                        onChange={(item) => {
                          props.onChange(item ? item.id : '');
                        }}
                      />
                    )}
                  />
                </label>

                <SectionRow>

                  <label htmlFor="Multa">
                    Multa
                    <Controller
                      name="penaltyPercentage"
                      control={control}
                      defaultValue={0}
                      render={(props) => (
                        <IntlCurrencyInput
                          currency="BRL"
                          className="inputField"
                          config={currencyConfig}
                          value={Number(props.value) || 0}
                          onChange={(event, value) => {
                            props.onChange(Number(value) || 0);
                          }}
                        />
                      )}
                    />
                  </label>
                  <label htmlFor="Multa">
                    Juros
                    <Controller
                      name="lateInterestPercentage"
                      control={control}
                      defaultValue={0}
                      render={(props) => (
                        <IntlCurrencyInput
                          currency="BRL"
                          className="inputField"
                          config={currencyConfig}
                          value={Number(props.value) || 0}
                          onChange={(event, value) => {
                            props.onChange(Number(value) || 0);
                          }}
                        />
                      )}
                    />
                  </label>                  
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