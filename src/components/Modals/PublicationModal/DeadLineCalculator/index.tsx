/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useState, useEffect, ChangeEvent, useCallback } from 'react';
import {  FiX } from 'react-icons/fi';
import { usePublication } from 'context/publication';
import api from 'services/api';
import { format } from 'date-fns';
import DatePicker from 'components/DatePicker';
import { useDevice } from "react-use-device";
import Loader from 'react-spinners/PulseLoader';
import { useModal } from 'context/modal';
import HolidayModal from 'components/Modals/Holiday';
import { useToast } from 'context/toast';
import { CourtData, ResultValueDates, PublicationData, CalculatorData, ListValueData, ProcessData } from 'components/Interfaces/IDeadLineCalc';
import CompanyAccessDenied from 'components/CompanyAccessDenied';
import { VerifyCompanyPlanAccess } from 'Shared/utils/commonFunctions';
import { Container, Modal, Content, Footer, DayValid, DayOff, DayInformation, DayResultText, ModalMobile, ContentMobile } from './styles';

const DeadLineCalculator: React.FC = () => {
  const { handlePublicationModal, data } = usePublication();
  const { modalActive, isOpenModal, handleDeadLineCalculatorText, handleCaptureTextPublication, selectProcess,handleModalActive  } = useModal();
  const [isLoading, setIsLoading] = useState(true)
  const [isCalculating, setIsCalculating] = useState(false)
  const [blockAccess, setBlockAccess] = useState(false)
  const [calculatorId, setCalculatorId] = useState(1)
  const [dateCalculator, setDateCalculator] = useState<string>('')
  const [daysCalculator, SetDaysCalculator] = useState<number>(15)
  const [instanceCourt, setInstanceCourt] = useState('1')
  const [typeMatter, setTypeMatter] = useState('E')
  const [courtSelectedId, setCourtSelectedId] = useState<number>(0)
  const [courtList, setCourtList] = useState<CourtData[]>([])
  const [typesCalculatorList, setTypesCalculatorList] = useState<ListValueData[]>([])
  const [resultDetails, setResultDetails] = useState<ResultValueDates[]>([])
  const [resultDateText, setResultDateText] = useState<string>()
  const [resultDate, setResultDate] = useState<string>('')
  const [currentDayInfo, setCurrentDayInfo] = useState<ResultValueDates>()
  const [publicationData, setPublicationData] = useState<PublicationData>()
  const [showHolidayDetails, setShowHolidayDetails] = useState<boolean>(false)
  const { addToast } = useToast();
  const { isMOBILE } = useDevice();

  // Start page
  useEffect(() => {

    Initialize();

  },[])

  const Initialize = async () =>
  {
    // validate company plan access
    // if free plan and more than 30 days use, block access to deadline
    const permissionAccessPlan = await VerifyCompanyPlanAccess()

    if (permissionAccessPlan != 'blocked')
    {
      LoadTypesCalculator()
      LoadCourt(calculatorId)

      if (data === undefined || data === null){
        setDateCalculator(format(new Date(), 'yyyy-MM-dd'))
      }
      else{
        setDateCalculator(format(new Date(data.publicationDate), 'yyyy-MM-dd'))
        setPublicationData(data)
      }
    }
    else{
      setBlockAccess(true)  // when true show modal warning fir free plan
    }
  }


  const handleDaysCalculator = (evt) => {

    if(evt.target.validity.valid)
    {
      SetDaysCalculator(evt.target.value)
      setResultDetails([])
    }
  }

  useEffect(() => {

    if (!modalActive){
      setShowHolidayDetails(false)
    }

  },[modalActive])

  const handleCalculator = async () => {
    try
    {
      setIsCalculating(true)
      setCurrentDayInfo(undefined)
      setResultDetails([])

      if (courtSelectedId === 0){
        setIsCalculating(false)
        return;
      }

      if (daysCalculator > 180){
        addToast({
          type: 'info',
          title: 'Não foi possível executar esta operação',
          description: 'Não é permitido o cálculo de prazo para mais de 180 dias'
        });

        setIsCalculating(false)
        return
      }

      if (daysCalculator === 0){
        addToast({
          type: 'info',
          title: 'Não foi possível executar esta operação',
          description: 'Informe a quantidade de dias para efetuar o cálculo do prazo.',
        });

        setIsCalculating(false)
        return
      }

      const response = await api.post<CalculatorData>("CalculadoraPrazo/Calcular", {
        days:daysCalculator,
        instance: instanceCourt,
        idCourtDeadLine: courtSelectedId,
        date:dateCalculator,
        typeMatterDeadLine: typeMatter,
        typeCalculatorId: calculatorId,
        token:localStorage.getItem('@GoJur:token')
      })

      setResultDate(response.data.resultDate)
      setResultDateText(response.data.resultDateText)
      setResultDetails(JSON.parse(response.data.detailsList))
      setIsCalculating(false)

      localStorage.removeItem('@GoJur:PublicationId')
    }
    catch {
      addToast({
        type: 'error',
        title: 'Não foi possível executar esta operação',
        description: 'Houve uma falha no cálculo do prazo, tente novamente',
      });
    }
  }

  // get list of type calculator
  const LoadTypesCalculator = async() => {

      const response = await api.post<ListValueData[]>("CalculadoraPrazo/ListarTiposDeCalculo", {
        token: localStorage.getItem('@GoJur:token')
      })

      setTypesCalculatorList(response.data);
  }

  // get list of calculator by type
  const LoadCourt = async (calcId: Number) => {

    const response = await api.post<CourtData[]>("CalculadoraPrazo/ListarTribunalPorTipoDeCalculo", {
        days: daysCalculator,
        typeCalculatorId: calcId,
        token: localStorage.getItem('@GoJur:token')
    })

    setCourtList(response.data)
    GetRelevanteCourt(calcId)
    setIsLoading(false)
  }

  // Get more important court to appear first when select list
  const GetRelevanteCourt = async (calcId: Number) => {

    const response = await api.post<CourtData>("/CalculadoraPrazo/ListarTribunalPorRelevancia", {
       typeCalculatorId: calcId,
       token: localStorage.getItem('@GoJur:token')
    })

    setCourtSelectedId(response.data.courtId)
  }

  // Executes when change type calculator
  useEffect(() => {

    if (!isLoading) return;

    LoadCourt(calculatorId)

  },[isLoading])

  useEffect(() => {

    LoadCourt(calculatorId)

  },[calculatorId])

  // state for change type calculator
  const handleCourtList = (calculatorId: number) => {

    setCalculatorId(calculatorId)
    setResultDetails([])
    setCurrentDayInfo(undefined)
    LoadCourt(calculatorId);
  }

  // state for change court id
  const handleCourtChange = (e: any) => {

    const courtId = e.target.options[e.target.selectedIndex].value;

    setCourtSelectedId(courtId)
    setResultDetails([])
  }

  const handleDateCalculator = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      setDateCalculator(event.target.value);
      setResultDetails([])
      setCurrentDayInfo(undefined)
    },[]);

  const matterInformation = async (id: number, publicationText: string) => {
    let matterText = '';
    if (id > 0)
    {
        const response = await api.post<ProcessData>('/Processo/SelecionarProcesso',{
            matterId: id,
            token: localStorage.getItem('@GoJur:token'),
            companyId: localStorage.getItem('@GoJur:companyId'),
            apiKey: localStorage.getItem('@GoJur:apiKey')
          }
        );

        let courtDesc = "";
        let courtDeptDesc = "";

        if(response.data.instanceList.length > 0){
          const court = response.data.instanceList[0];

          courtDesc = `${court.forumDesc.toString()} - ${court.instance.toString()} Instância`;
          courtDeptDesc = `${court.varaNumber.toString()}ª ${court.varaDesc.toString()}`;
        }

        const matter = response.data;

        // set object modal to context object
        selectProcess({
          matterId: id,
          matterCustomerDesc: matter.matterCustomerDesc,
          matterOppossingDesc: matter.matterOppossingDesc,
          matterFolder: matter.matterFolder,
          matterNumber: matter.matterNumber,
        })

        matterText = `Pasta: ${matter.matterFolder} - Proc: ${matter.matterNumber}`

        if (matter.matterCustomerDesc){
          matterText += `\n${matter.matterCustomerDesc}`
        }

        if (matter.matterOppossingDesc){
          matterText += ` X ${matter.matterOppossingDesc}`
        }

        if (courtDesc){
          matterText += `\n${courtDesc}`
        }

        if (courtDeptDesc){
          matterText += `\n${courtDeptDesc}`
        }
    }

    return `${matterText}\n\n${publicationText}`;
  }

  const handleOpenModalAppointment = async () => {

    // close calc modal deadline
    handlePublicationModal('None')

    // build a description based on calculated just realized
    const courtSelected = courtList.find(item => item.courtId == courtSelectedId)
    let textDeadLine = "";

    if (courtSelected){
      textDeadLine = `${courtSelected.courtName}, ${daysCalculator} dias de prazo`
    }

    const calculatorSelected = typesCalculatorList.find(item => item.id == calculatorId)
    // let publicationText = '';

    if (calculatorSelected){
      textDeadLine += ` ${calculatorSelected.value} `
    }

    const date = dateCalculator.replaceAll('-', '/')
    textDeadLine += `, publicado em: ${date.substring(8,10)}/${date.substring(5,7)}/${date.substring(0,4)} `

    // build description based to matter and publication
    let  matterDescription = ""

    if (publicationData){
      matterDescription = await matterInformation(publicationData.matterId, publicationData.description)
     // publicationText = publicationData.description

      // save temp publication id to vinculete in save appointment
      localStorage.setItem('@GoJur:PublicationId', publicationData.id.toString());
    }

    // save temp object json with calc details
    localStorage.setItem('@GoJur:DeadLineJson', JSON.stringify({
      dateResult: resultDate,
      days:daysCalculator,
      instance: instanceCourt,
      idCourtDeadLine: courtSelectedId,
      date:dateCalculator,
      typeMatterDeadLine: typeMatter,
      typeCalculatorId: calculatorId,
      token: localStorage.getItem('@GoJur:token')
    }));

    // concatened deadline text + matter text and publication text
    const appointmentDescription = `${textDeadLine}\n ${matterDescription}\n `

    // set publication as empty to avoid errors
    handleCaptureTextPublication(null)

    // define in deadline context state a new complement based on calculator
    handleDeadLineCalculatorText(appointmentDescription)

    handleModalActive(true);

    isOpenModal('0')
  }

  const handleTypeMatter = (value: string) => {
    setResultDetails([])
    setTypeMatter(value)
  }

  const handleInstance = (value: string) => {
    setResultDetails([])
    setInstanceCourt(value)
  }

  const OnShowHolidayDetails = () => {
    handleModalActive(true)
    setShowHolidayDetails(true)
  }

  const handleCloseModal = () => {
    localStorage.removeItem('@GoJur:PublicationId')
    handlePublicationModal('None')
  }

  if (isLoading){
    return (
      <Container>
        <Modal>
          <Loader size={10} color="var(--blue-twitter)" />
        </Modal>
      </Container>
    )
  }

  if (blockAccess){

    return (
      <CompanyAccessDenied
        description="Com a calculadora de prazos do Gojur você conseguirá calcular prazos automaticamente.
        Além disso, será possível salva-los na agenda, receber lembretes, associar processos e gerenciar melhor os seus prazos."
        handleCloseModal={handleCloseModal}
      />
    )

  }

  return (
    <Container>

      {!isMOBILE && (
        <Modal>
          <header>
            <p>Calculadora de prazos</p>
            <button type="button" onClick={() => handleCloseModal()}>
              <FiX />
            </button>
          </header>

          <Content style={{width: '50vw', marginLeft: '10vw'}}>
            <div>
              <label htmlFor="days" style={{ marginLeft: '5px'}}>
                Dias de Prazo:
                {/* <input pattern="[0-9]+$" type="text" id="days" value={daysCalculator} maxLength={3} onChange={(e) => handleDaysCalculator(Number(e.target.value))} /> */}
                <input pattern="[0-9]*" type="text" id="days" value={daysCalculator} maxLength={3} onChange={(e) => handleDaysCalculator((e))} />
              </label>

              <label htmlFor="calc">
                Tipo de cálculo:
                <select id="calculatorId" onChange={(e) => handleCourtList(Number(e.target.value))}>
                  {typesCalculatorList.map((type) => <option key={type.id} value={type.id}>{type.value}</option>)}
                </select>
              </label>

              <DatePicker
                title="Data "
                onChange={handleDateCalculator}
                value={dateCalculator}
                style={{
                  border: '1px solid',
                  borderBottom:'none',
                  padding:'2px',
                  borderRadius:'3px',
                }}
              />

              <label htmlFor="court" style={{ marginLeft: '5px'}}>
                Tribunal:
                <select id="courtId" value={courtSelectedId} onChange={(e) => handleCourtChange(e)}>
                  {courtList.map((court) => <option value={court.courtId}>{court.courtName}</option>)}
                </select>
              </label>

              <label htmlFor="process">
                Tipo do Processo:
                <select id="process" onChange={(e) => handleTypeMatter(e.target.value)}>
                  <option value="E">Eletrônico</option>
                  <option value="F">Fisico</option>
                </select>
              </label>

              <label htmlFor="inst" style={{width: '15.4rem'}}>
                Processo Em:
                <select id="inst" onChange={(e) => handleInstance(e.target.value)}>
                  <option value="1">1° Instância</option>
                  <option value="2">2° Instância</option>
                </select>
              </label>

            </div>

          </Content>

          {resultDetails.length > 0 && (
            <DayResultText>{resultDateText}</DayResultText>
          )}

          { currentDayInfo != undefined &&
            (
              <>
                <DayInformation>
                  {currentDayInfo.detailsDate}
                  &nbsp;
                  {" - "}
                  &nbsp;
                  {currentDayInfo.informationText}
                  {currentDayInfo.holidayId > 0 && <button type='button' onClick={() => OnShowHolidayDetails()}>- Mais Detalhes</button>}
                  <button type="button" onClick={() => setCurrentDayInfo(undefined)}>Fechar</button>
                </DayInformation>
              </>
            )
          }

          { showHolidayDetails && (
            <HolidayModal data={currentDayInfo?.holidayDetails} />
          )}

          <Content style={{marginLeft:'0rem'}}>

            {/* { isCalculating && <Loader size={4} color="var(--blue-twitter)" /> } */}

            <table style={{marginLeft:'1rem'}}>
              <body>
                <tr>
                  {
                    resultDetails.map( (item) => {

                      const dateDay = format(new Date(item.date), 'dd/MM')
                      const dayWeek = item.dayWeek.substring(0,3)

                      // if is invalid day shows red square
                      if(!item.dayOff){
                        return (
                          <DayValid onClick={() => setCurrentDayInfo(item)}>
                            <span title={item.informationText}>
                              {dateDay}
                              <br />
                              {dayWeek}
                            </span>
                          </DayValid>
                        )
                      }

                      // if is invalid day shows blue square
                      return (
                        <DayOff onClick={() => setCurrentDayInfo(item)}>
                          <span title={item.informationText}>
                            {dateDay}
                            <br />
                            {dayWeek}
                          </span>
                        </DayOff>
                      )
                    })
                  }
                </tr>
              </body>

            </table>

          </Content>

          <Footer style={{pointerEvents:(showHolidayDetails?'none':'all')}}>
            {!isCalculating && <button type="button" onClick={() => handleCalculator()}>Calcular</button> }
            {isCalculating &&  <button type="button">Calculando...</button> }
            <button type="button" onClick={() => handleCloseModal()}>Cancelar</button>
            {resultDetails.length > 0 &&
              <button type="button" style={{backgroundColor:'#ff9000'}} onClick={() => handleOpenModalAppointment()}> Salvar Prazo</button>
            }
          </Footer>
        </Modal>
      )}

      {isMOBILE && (
        <ModalMobile>
          <header>
            <p>Calculadora de prazos</p>
            <button type="button" onClick={() => handleCloseModal()}>
              <FiX />
            </button>
          </header>

          <ContentMobile style={{width: '75vw', marginLeft: '7vw'}}>
            <div>
              <label htmlFor="days" style={{ marginLeft: '5px'}}>
                Dias de Prazo:
                {/* <input pattern="[0-9]+$" type="text" id="days" value={daysCalculator} maxLength={3} onChange={(e) => handleDaysCalculator(Number(e.target.value))} /> */}
                <input pattern="[0-9]*" type="text" id="days" value={daysCalculator} maxLength={3} onChange={(e) => handleDaysCalculator((e))} />
              </label>

              <label htmlFor="calc">
                Tipo de cálculo:
                <select id="calculatorId" onChange={(e) => handleCourtList(Number(e.target.value))}>
                  {typesCalculatorList.map((type) => <option key={type.id} value={type.id}>{type.value}</option>)}
                </select>
              </label>

              <DatePicker
                title="Data "
                onChange={handleDateCalculator}
                value={dateCalculator}
                style={{
                  border: '1px solid',
                  borderBottom:'none',
                  padding:'2px',
                  borderRadius:'3px',
                }}
              />

              <label htmlFor="court" style={{ marginLeft: '5px'}}>
                Tribunal:
                <select id="courtId" value={courtSelectedId} onChange={(e) => handleCourtChange(e)}>
                  {courtList.map((court) => <option value={court.courtId}>{court.courtName}</option>)}
                </select>
              </label>

              <label htmlFor="process">
                Tipo do Processo:
                <select id="process" onChange={(e) => handleTypeMatter(e.target.value)}>
                  <option value="E">Eletrônico</option>
                  <option value="F">Fisico</option>
                </select>
              </label>

              <label htmlFor="inst" style={{width: '15.4rem'}}>
                Processo Em:
                <select id="inst" onChange={(e) => handleInstance(e.target.value)}>
                  <option value="1">1° Instância</option>
                  <option value="2">2° Instância</option>
                </select>
              </label>

            </div>

          </ContentMobile>

          {resultDetails.length > 0 && (
            <DayResultText>{resultDateText}</DayResultText>
          )}

          { currentDayInfo != undefined &&
            (
              <>
                <DayInformation>
                  {currentDayInfo.detailsDate}
                  &nbsp;
                  {" - "}
                  &nbsp;
                  {currentDayInfo.informationText}
                  {currentDayInfo.holidayId > 0 && <button type='button' onClick={() => OnShowHolidayDetails()}>- Mais Detalhes</button>}
                  <button type="button" onClick={() => setCurrentDayInfo(undefined)}>Fechar</button>
                </DayInformation>
              </>
            )
          }

          { showHolidayDetails && (
            <HolidayModal data={currentDayInfo?.holidayDetails} />
          )}

          <Content style={{marginLeft:'0rem'}}>

            {/* { isCalculating && <Loader size={4} color="var(--blue-twitter)" /> } */}

            <table style={{marginLeft:'1rem'}}>
              <body>
                <tr>
                  {
                    resultDetails.map( (item) => {

                      const dateDay = format(new Date(item.date), 'dd/MM')
                      const dayWeek = item.dayWeek.substring(0,3)

                      // if is invalid day shows red square
                      if(!item.dayOff){
                        return (
                          <DayValid onClick={() => setCurrentDayInfo(item)}>
                            <span title={item.informationText}>
                              {dateDay}
                              <br />
                              {dayWeek}
                            </span>
                          </DayValid>
                        )
                      }

                      // if is invalid day shows blue square
                      return (
                        <DayOff onClick={() => setCurrentDayInfo(item)}>
                          <span title={item.informationText}>
                            {dateDay}
                            <br />
                            {dayWeek}
                          </span>
                        </DayOff>
                      )
                    })
                  }
                </tr>
              </body>

            </table>

          </Content>

          <Footer style={{pointerEvents:(showHolidayDetails?'none':'all')}}>
            {!isCalculating && <button type="button" onClick={() => handleCalculator()}>Calcular</button> }
            {isCalculating &&  <button type="button">Calculando...</button> }
            <button type="button" onClick={() => handleCloseModal()}>Cancelar</button>
            {resultDetails.length > 0 &&
              <button type="button" style={{backgroundColor:'#ff9000'}} onClick={() => handleOpenModalAppointment()}> Salvar Prazo</button>
            }
          </Footer>
        </ModalMobile>
      )}
    </Container>
  );
};

export default DeadLineCalculator;
