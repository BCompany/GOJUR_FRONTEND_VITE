/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable no-console */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable no-return-assign */
/* eslint-disable no-alert */
import React, { useState, ChangeEvent, useEffect } from 'react';
import { FaRegTimesCircle } from 'react-icons/fa';
import { useToast } from 'context/toast';
import { BsCheck } from 'react-icons/bs';
import { format } from 'date-fns';
import { ModalPublicationDate } from './styles';



const PublicationDateModal = (props) => {
  const { ClosePublicationDateModal, setDtaCustomStart, setDtaCustomEnd, setChangeDates, setShowCustomDates } = props.callbackFunction
  const { addToast } = useToast();
  const [dtaStart, setDtaStart] = useState<string>("")
  const [dtaEnd, setDtaEnd] = useState<string>("")

  useEffect(() => {
    setDtaStart(format(new Date(), 'yyyy-MM-dd'))
    setDtaEnd(format(new Date(), 'yyyy-MM-dd'))
  }, [])

  const SetFilterDates = () => {

    if (dtaStart === ""){
      addToast({type: "info", title: "Informe a data inicial", description: `A data de início não foi informada`})
      return;
    }
    
    if (dtaEnd === ""){
      addToast({type: "info", title: "Informe a data final", description: `A data final não foi informada`})
      return;
    }

    const startYear = dtaStart.substring(0, 4);
    const startMonth = dtaStart.split('-')[1];

    const endYear = dtaEnd.substring(0, 4);
    const endMonth = dtaEnd.split('-')[1];

    if(startYear == endYear && Number(startMonth) - Number(endMonth) > 0)
    {
      addToast({type: "info", title: "Datas incorretas", description: `A data final deve ser maior que a data inicial. Verifique o ano e o mês escolhido para prosseguir.`})
      return;
    }
    
    setDtaCustomStart(dtaStart)
    setDtaCustomEnd(dtaEnd)
    setChangeDates(true)
    setShowCustomDates(true)
    ClosePublicationDateModal()
  }

  return (
    <>
      
      <ModalPublicationDate show>

        <div style={{marginLeft:'15px', marginTop:'10px', marginRight:'10px'}}>
          Selecionar Datas

          <br />
          <br />

          <div style={{display:"flex"}}>
            <label htmlFor="dtaInicio" style={{width:"48%"}}>
              Data Início
              <input 
                type="date"
                style={{backgroundColor:"white"}}
                value={dtaStart}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setDtaStart(e.target.value)}
              />
            </label>

            <label htmlFor="dtaInicio" style={{width:"48%", marginLeft:"3%"}}>
              Data Final
              <input 
                type="date"
                style={{backgroundColor:"white"}}
                value={dtaEnd}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setDtaEnd(e.target.value)}
              />
            </label>
          </div>

          <br />

          <br />

          <div style={{float:'left', marginRight:'12px', marginLeft:"7px"}}>

            <div style={{float:'left'}}>
              <button 
                className="buttonClick"
                type='button'
                onClick={()=> SetFilterDates()}
                style={{width:'145x'}}
              >
                <BsCheck />
                Aplicar Data
              </button>
            </div>
           
               
            <div style={{float:'left', width:'100px', marginLeft:"60px"}}>
              <button 
                type='button'
                className="buttonClick"
                style={{width:'145px'}}
                onClick={()=> ClosePublicationDateModal()}
              >
                <FaRegTimesCircle />
                Fechar
              </button>
            </div>
          </div>
    
        </div>
      </ModalPublicationDate>
  
    </>
    
  )
  

}
export default PublicationDateModal;
