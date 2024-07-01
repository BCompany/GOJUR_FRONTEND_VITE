/* eslint-disable no-param-reassign */
/* eslint-disable no-console */
/* eslint-disable jsx-a11y/label-has-associated-control */

import React, { useCallback, useEffect, useState } from 'react';
import Select from 'react-select'
import Modal from 'react-modal';
import { Overlay } from 'Shared/styles/GlobalStyle';
import Loader from 'react-spinners/ClipLoader';
import { useForm, Controller } from 'react-hook-form';
import IntlCurrencyInput from "react-intl-currency-input"
import { useToast } from 'context/toast';
import { MdHelp } from 'react-icons/md';
import ConfirmBoxModal from 'components/ConfirmBoxModal';
import { useConfirmBox } from 'context/confirmBox';
import { matterCalcDateList, matterCalcMultaType, matterCalcTypeList } from 'Shared/utils/commonListValues';
import { RiErrorWarningFill } from 'react-icons/ri';
import { FiTrash } from 'react-icons/fi';
import { FaCalculator } from 'react-icons/fa';
import { FaRegTimesCircle } from 'react-icons/fa';
import { loadingMessage, noOptionsMessage } from 'Shared/utils/commonConfig';
import { currencyConfig, selectStyles } from 'Shared/utils/commonFunctions';
import { IMatterCalculationData, ISelectData } from 'pages/Dashboard/MainViewContent/pages/Interfaces/IMatter';
import { VerifyCompanyPlanAccess } from 'Shared/utils/commonFunctions';
import CompanyAccessDenied from 'components/CompanyAccessDenied';
import { Container, Header } from './styles';
import { ListIndices } from '../../Services/MatterData'

const MatterValues = (props) => {

  // resources
  const { addToast } = useToast();
  const { handleCaller, handleConfirmMessage, handleCancelMessage, caller, isCancelMessage, isConfirmMessage } = useConfirmBox();
  const {handleCloseValuesModal, handleCalculateValues, jsonCalculator, isMatterValue } = props.callbackFunction
  const data = jsonCalculator as IMatterCalculationData
  const [blockAccess, setBlockAccess] = useState(false)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [isRemoveCalc, setIsRemoveCalc] = useState<boolean>(false)
  const [moratoryDateType, setMoratoryDateType] = useState<ISelectData | undefined | null>({id:data.tpo_MoratoryDate, label: data.tpo_MoratoryDate === 'O'? 'Outra Data': 'Data de Início' })
  const [compensatoryDateType, setCompensatoryDateType] = useState<ISelectData | undefined | null>({id:data.tpo_CompensatoryDate, label: data.tpo_CompensatoryDate === 'O'? 'Outra Data': 'Data de Início' })
  const [moratoryValue, setMoratoryValue] = useState<number>(data.valueMoratory)
  const [compensatoryValue, setCompensatoryValue] = useState<number>(data.valueCompensatory)
  const [punishmentValue, setPunishmentValue] = useState<number>(data.valuePunishment)
  const [indiceList, setIndiceList] = useState<ISelectData[]>([])

  // react-hook-form config
  const {register, handleSubmit, control } = useForm({ defaultValues: data })

  useEffect(() => {

    Initialize();

  },[])

  const Initialize = async () => {

    // validate company plan access
    // if free plan and more than 30 days use, block access to deadline
    const permissionAccessPlan = await VerifyCompanyPlanAccess()

    if (permissionAccessPlan != 'blocked')
    {
      setIndiceList( await ListIndices())
      setIsLoading(false)
    }
    else{
      setIsLoading(false)
      setBlockAccess(true)
    }
  }

  const handleSave = useCallback((data: IMatterCalculationData) => {

    if (!Validate(data)) return;

    console.clear()
    console.log(data)

    if (moratoryDateType) data.moratoryDate = moratoryDateType
    if (compensatoryDateType) data.compensatoryDate = compensatoryDateType;
    if (moratoryValue) data.valueMoratory = moratoryValue;
    if (compensatoryValue) data.valueCompensatory = compensatoryValue;
    if (punishmentValue) data.valuePunishment = punishmentValue;
    if (moratoryDateType?.id != 'O') data.dateMoratory = "";
    if (compensatoryDateType?.id != 'O') data.dateCompensatory = "";


    handleCalculateValues(data)

  },[moratoryDateType, compensatoryDateType, moratoryValue, compensatoryValue, punishmentValue, data])

  useEffect(() => {

    if (isConfirmMessage && caller === 'matterCalculation'){

      handleCalculateValues(null)
      handleConfirmMessage(false)
      handleCloseValuesModal()
      handleCaller('')
    }

  },[caller, isConfirmMessage, isRemoveCalc])

  useEffect(() => {

    if (isCancelMessage && caller === 'matterCalculation'){
      setIsRemoveCalc(false)
      handleCancelMessage(false)
      handleCaller('')
    }

  },[caller, isCancelMessage, isRemoveCalc])

  function Validate(data: IMatterCalculationData) {

    if (!data.economicIndex){
      addToast({
        type: 'info',
        title: 'Operação NÃO realizada',
        description: "Informe o indicador econômico para aplicar a correção monetária"
      });

      return false
    }

    if ((data.startDate??"") == ""){
      addToast({
        type: 'info',
        title: 'Operação NÃO realizada',
        description: "Informe a data de inicio para a aplicação da correção através do indice econômico"
      });

      return false
    }

    if (moratoryDateType?.id === 'O' && (data.dateMoratory??"").length == 0){

      addToast({
        type: 'info',
        title: 'Operação NÃO realizada',
        description: "Informe a data de referência para a aplicação do juros moratórios"
      });

      return false
    }

    if (compensatoryDateType?.id === 'O' && (data.dateCompensatory??"").length == 0){

      addToast({
        type: 'info',
        title: 'Operação NÃO realizada',
        description: "Informe a data de referência para a aplicação do juros compensatórios"
      });

      return false
    }

    return true;
  }

  // Message when is loading or saving data
  if (isLoading){

    return (
      <>
        <Overlay />
        <div className='waitingMessage'>
          <Loader size={15} color="var(--blue-twitter)" />
            &nbsp;&nbsp;
          {' '}
          Aguarde...
        </div>
      </>
      )
  }

  const handleCloseModal = () => {
    handleCloseValuesModal()
  }

  if (blockAccess){

    return (
      <CompanyAccessDenied
        description="Com a calculadora de jurídica do Gojur você conseguirá executar diversos cálculos com base nos principais indices econômicos."
        handleCloseModal={handleCloseModal}
      />
    )

  }

  return (

    <>
      <Modal
        isOpen
        overlayClassName="react-modal-overlay"
        className="react-modal-content-large"
      >

        <Header>Calculadora Jurídica</Header>
        <div className='divisor' />

        <Container>

          <form onSubmit={handleSubmit(handleSave)}>

            <section style={{width:'94%'}}>

              <label style={{flex:'36%'}}>
                Indice
                <MdHelp title='Defina o indice econômico que será utilizado para a correção do valor' />
                <Controller
                  as={Select}
                  control={control}
                  options={indiceList}
                  placeholder="Selecione"
                  defaultValue={indiceList.find(item => item.id === data.indexId)}
                  loadingMessage={loadingMessage}
                  noOptionsMessage={noOptionsMessage}
                  styles={selectStyles}
                  name='economicIndex'
                  ref={register}
                />
              </label>

              <label style={{flex:'25%'}}>
                Iniciar Em
                <MdHelp title='Indique a data de ínicio que será utilizada como base para a aplicação do indice de correção.' />
                <input
                  className='inputField'
                  type='date'
                  name='startDate'
                  ref={register}
                />
                {/* <input className='inputField' type='date' /> */}
              </label>

              <label style={{flex:'25%'}}>
                Atualizar Até
                <MdHelp title='Indique uma data para limitar a atualização ou deixe em branco para atualizar até a data atual.' />
                <input
                  className='inputField'
                  type='date'
                  name='endDate'
                  ref={register}
                />
              </label>

            </section>

            <br />

            <section>

              <label style={{height:'1rem'}}>
                Proporcional (pró rata) &nbsp;
                <input
                  type='checkbox'
                  name='proRataIndex'
                  ref={register}
                />
                <MdHelp title="Marque esta opção se deseja calcular os proporcionalmente de acordo com o intervalo de dias, caso a data inicial e/ou final não sejam o dia 1º do mês " />
              </label>

              <label style={{height:'1rem'}}>
                Calcular diáriamente &nbsp;
                <input
                  type='checkbox'
                  name='automaticatly'
                  ref={register}
                />
                <MdHelp title="Marque esta opção se deseja que os valores sejam automaticamente atualizados quando um novo valor de indice for incluído." />
              </label>

              {isMatterValue && (
                <label style={{height:'1rem'}}>
                  Aplicar ao valor do risco &nbsp;
                  <input
                    type='checkbox'
                    name='applyToRiskValue'
                    ref={register}
                  />
                  <MdHelp title="Marque esta opção se que as configurações deste cálculo também sejam aplicas ao valor do risco." />
                  <RiErrorWarningFill title="Caso já exista um cálculo aplicado ao valor do risco o mesmo será substituido pelo cálculo definido no valor da causa." />
                </label>
              )}

            </section>

            <div className='divisor'>
              Juros / Multa
            </div>

            <section>
              <label>
                Valor Moratório
                <IntlCurrencyInput
                  className='inputField'
                  currency="BRL"
                  config={currencyConfig}
                  value={moratoryValue}
                  onChange={(e, value) => setMoratoryValue(value)}
                />
              </label>

              <label>
                Tipo
                <Controller
                  as={Select}
                  control={control}
                  options={matterCalcTypeList}
                  placeholder=""
                  loadingMessage={loadingMessage}
                  noOptionsMessage={noOptionsMessage}
                  styles={selectStyles}
                  defaultValue={matterCalcTypeList.find(item => item.id === data.tpo_Moratory)}
                  name='moratoryType'
                  ref={register}
                />
              </label>

              <label>
                Data
                <Select
                  options={matterCalcDateList}
                  defaultValue={matterCalcDateList.find(item => item.id === data.tpo_MoratoryDate)}
                  value={matterCalcDateList.find(item => item.id === moratoryDateType?.id)}
                  placeholder=""
                  loadingMessage={loadingMessage}
                  noOptionsMessage={noOptionsMessage}
                  styles={selectStyles}
                  onChange={(item) => setMoratoryDateType(item)}
                />
              </label>

              <label>
                <span>&nbsp;</span>
                <input
                  className='inputField'
                  type='date'
                  name='dateMoratory'
                  style={{opacity: (moratoryDateType?.id === 'O'? '1':'0')}}
                  ref={register}
                />
              </label>

              <label style={{height:'1rem'}}>
                Pró Rata &nbsp;
                <input
                  type='checkbox'
                  name='proRataMoratory'
                  ref={register}
                />
                <MdHelp
                  style={{marginTop:'30px'}}
                  title="Marque esta opção se deseja calcular o juros moratórios proporcionalmente de acordo com o intervalo de dias."
                />
              </label>

            </section>

            <section>

              <label>
                Valor Compensatório
                <IntlCurrencyInput
                  className='inputField'
                  currency="BRL"
                  config={currencyConfig}
                  value={compensatoryValue}
                  onChange={(e, value) => setCompensatoryValue(value)}
                />
              </label>

              <label>
                Tipo
                <Controller
                  as={Select}
                  control={control}
                  options={matterCalcTypeList}
                  placeholder=""
                  loadingMessage={loadingMessage}
                  noOptionsMessage={noOptionsMessage}
                  styles={selectStyles}
                  defaultValue={matterCalcTypeList.find(item => item.id === data.tpo_Compensatory)}
                  name='compensatoryType'
                  ref={register}
                />
              </label>

              <label>
                Data
                <Select
                  options={matterCalcDateList}
                  defaultValue={matterCalcDateList.find(item => item.id === data.tpo_CompensatoryDate)}
                  value={matterCalcDateList.find(item => item.id === compensatoryDateType?.id)}
                  placeholder=""
                  loadingMessage={loadingMessage}
                  noOptionsMessage={noOptionsMessage}
                  styles={selectStyles}
                  onChange={(item) => setCompensatoryDateType(item)}
                />
              </label>

              <label>
                <span>&nbsp;</span>
                <input
                  className='inputField'
                  type='date'
                  name='dateCompensatory'
                  style={{opacity: (compensatoryDateType?.id === 'O'? '1':'0')}}
                  ref={register}
                />
              </label>

              <label className='inputCheckBox' style={{height:'1rem'}}>
                Pró Rata &nbsp;
                <input
                  type='checkbox'
                  style={{marginTop:'30px'}}
                  name='proRataCompensatory'
                  ref={register}
                />
                <MdHelp title="Marque esta opção se deseja calcular o juros compensatórios proporcionalmente de acordo com o intervalo de dias." />
              </label>

            </section>

            <section style={{width:'59.5%', height:'6rem'}}>

              <label>
                Multa
                <IntlCurrencyInput
                  className='inputField'
                  currency="BRL"
                  config={currencyConfig}
                  value={punishmentValue}
                  onChange={(e, value) => setPunishmentValue(value)}
                />
              </label>

              <label>
                Tipo
                <Controller
                  as={Select}
                  control={control}
                  options={matterCalcMultaType}
                  placeholder=""
                  loadingMessage={loadingMessage}
                  noOptionsMessage={noOptionsMessage}
                  styles={selectStyles}
                  defaultValue={matterCalcMultaType.find(item => item.id === data.tpo_Punishment)}
                  name='punishmentType'
                  ref={register}
                />
              </label>

              <label style={{height:'1rem'}}>
                Sobre Juros&nbsp;
                <input
                  type='checkbox'
                  name='punishmentWithJuro'
                  ref={register}
                />

                <MdHelp
                  style={{marginTop:'30px'}}
                  title="Marque esta opção se desejar aplicar o calculo da multa sobre o valor total do calculo + juros moratórios"
                />
              </label>


            </section>

            <footer>

              <button
                type='submit'
                className='buttonClick'
              >
                <FaCalculator />
                Calcular
              </button>

              {data.indexId && (
                <button
                  type='button'
                  className='buttonClick'
                  onClick={() => setIsRemoveCalc(true)}
                >
                  <FiTrash />
                  Remover Calculo
                </button>
              )}

              <button
                type='button'
                className='buttonClick'
                onClick={handleCloseValuesModal}
              >
                <FaRegTimesCircle />
                Cancelar
              </button>

            </footer>

          </form>

        </Container>

      </Modal>

      {isRemoveCalc && (
        <ConfirmBoxModal
          title="Exclusão"
          caller="matterCalculation"
          message="Deseja realmente remover esta regra de cálculo ?"
        />
      )}

    </>

  )

}

export default MatterValues;
