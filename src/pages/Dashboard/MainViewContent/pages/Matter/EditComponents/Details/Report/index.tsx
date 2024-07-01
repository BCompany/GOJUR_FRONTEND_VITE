/* eslint-disable jsx-a11y/label-has-associated-control */

import React, { useCallback, useEffect, useState } from 'react';
import Select from 'react-select'
import Modal from 'react-modal';
import { Overlay } from 'Shared/styles/GlobalStyle';
import Loader from 'react-spinners/ClipLoader';
import { useToast } from 'context/toast';
import { FiSave } from 'react-icons/fi';
import { FaRegTimesCircle } from 'react-icons/fa';
import { loadingMessage, noOptionsMessage } from 'Shared/utils/commonConfig';
import { selectStyles } from 'Shared/utils/commonFunctions';
import { ISelectData } from 'pages/Dashboard/MainViewContent/pages/Interfaces/IMatter';
import { Container } from './styles';
import { ChekReportPending, GenerateReportMemoryCalcule, GenereReportJudicialDebits, GetReportAmazon } from '../../Services/MatterData';

const MatterValuesReport = (props: any) => {

  const { id, matterDataValues, jsonCalculator } = props.callbackFunction;

  const { addToast } = useToast();
  const [printOptions, setPrintOptions] = useState<ISelectData[]>([])
  const [idReportGenerate, setIdReportGenerate] = useState<number>(0)
  const [isGeneratingReport, setIsGeneratingReport] = useState<boolean>(false);
  const [selectedItem, setSelectedItem] = useState<string>('1')
  const { handleClosePrintValuesModal } = props.callbackFunction

  useEffect(() => {

    const printOptions: ISelectData[] = [
      { id: '1', label: 'Resumo - Débitos Judiciais' },
      { id: '2', label: 'Memória de Cálculo' }
    ]

    setPrintOptions(printOptions)
  },[])

  const handleOpenReport = useCallback(() => {

    if (selectedItem === '1'){
      GenerateJudicialDebitsReport()
    }
    if (selectedItem === '2'){
      GenerateMemoryReport()
    }

  },[selectedItem]);

  const GenerateJudicialDebitsReport = async () => {
    try
    {
      setIsGeneratingReport(true)
      const response = await GenereReportJudicialDebits(matterDataValues, id);
      setIdReportGenerate(response)
    }
    catch(err: any){

      addToast({
        type: 'info',
        title: 'Operação não realizada',
        description: 'Não foi possível gerar o relatório',
      });

      setIsGeneratingReport(false)
    }
  }

  const GenerateMemoryReport = async () => {
    try
    {
      setIsGeneratingReport(true)
      const response = await GenerateReportMemoryCalcule(jsonCalculator);
      setIdReportGenerate(response)
    }
    catch(err: any){

      addToast({
        type: 'info',
        title: 'Operação não realizada',
        description: 'Não foi possível gerar o relatório',
      });

      setIsGeneratingReport(false)
    }
  }

  const handleChangeOption = (item: string | undefined) => {
    setSelectedItem(item??"")
  }


  useEffect(() => {

    if (idReportGenerate > 0){

      const checkInterval = setInterval(() => {
        CheckReportPending(checkInterval) },
      2000);

    }

  },[idReportGenerate])

  const CheckReportPending = useCallback(async (checkInterval) => {

    if (isGeneratingReport){
        const response = await ChekReportPending(idReportGenerate)

        if (response.data == "F" && isGeneratingReport){

          clearInterval(checkInterval);
          OpenReportAmazon()

        }

        if (response.data == "E"){
          clearInterval(checkInterval);
          setIsGeneratingReport(false)
  
          addToast({
            type: "error",
            title: "Operação não realizada",
            description: "Não foi possível gerar o relatório."
          })
  
        }
    }
  },[isGeneratingReport, idReportGenerate])

  const OpenReportAmazon = async() => {
    const response = await GetReportAmazon(idReportGenerate)

    setIdReportGenerate(0)
    window.open(`${response.des_Parametro}`, '_blank');
    setIsGeneratingReport(false)
    handleClosePrintValuesModal()
  }

  return (

    <>

      <Modal
        isOpen
        overlayClassName="react-modal-overlay"
        className="react-modal-content"
      >

        <Container>

          <header>Relatório de Cálculo </header>

          <label>
            Opções de Impressão:
            <Select
              options={printOptions}
              value={printOptions.find(item => item.id == selectedItem)}
              onChange={(item) => handleChangeOption(item?.id)}
              placeholder="Selecione"
              loadingMessage={loadingMessage}
              noOptionsMessage={noOptionsMessage}
              styles={selectStyles}
            />
          </label>

          <br />
          <footer>

            <button
              disabled={isGeneratingReport}
              type='button'
              className='buttonClick'
              onClick={() => handleOpenReport()}
            >
              <FiSave />
              Gerar
            </button>

            <button
              disabled={isGeneratingReport}
              type='button'
              className='buttonClick'
              onClick={handleClosePrintValuesModal}
            >
              <FaRegTimesCircle />
              Fechar
            </button>

          </footer>

        </Container>

      </Modal>

      {isGeneratingReport && (
        <>
          <Overlay />
          <div className='waitingMessage'>
            <Loader size={15} color="var(--blue-twitter)" />
            &nbsp;&nbsp;
            Gerando Relatório...
          </div>
        </>

      )}

    </>
  )

}

export default MatterValuesReport;
