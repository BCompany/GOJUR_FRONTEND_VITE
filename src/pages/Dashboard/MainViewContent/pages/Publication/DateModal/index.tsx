/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable no-console */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable no-return-assign */
/* eslint-disable no-alert */
/* eslint-disable no-param-reassign */
/* eslint-disable jsx-a11y/label-has-associated-control */

import React, {useEffect,useState,useCallback,ChangeEvent,UIEvent } from 'react';
import { FiX } from 'react-icons/fi';
import { useToast } from 'context/toast';
import { BiSave } from 'react-icons/bi';
import { FaRegTimesCircle } from 'react-icons/fa';
import { format } from 'date-fns';
import { ModalDateSelect } from './styles';

const DateModal = (props) => {
  const { CloseDateModal, dtaCustomStart, setDtaCustomStart, dtaCustomEnd, setDtaCustomEnd, setChangeDates, setShowCustomDates } = props.callbackFunction
  const { addToast } = useToast();
  const [dtaStart, setDtaStart] = useState<string>("")
  const [dtaEnd, setDtaEnd] = useState<string>("")

  useEffect(() => {
    setDtaStart(format(new Date(), 'yyyy-MM-dd'))
    setDtaEnd(format(new Date(), 'yyyy-MM-dd'))
  }, [])

  const CloseModal = () => {
    CloseDateModal()
  }

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
    CloseDateModal()
  }

  return(
    <>
      <ModalDateSelect show>

        <div id='Header' style={{height:'30px'}}>
          <div className='menuTitle'>
            &nbsp;&nbsp;&nbsp;&nbsp;Selecionar Datas
          </div>
          <div className='menuSection'>
            <FiX onClick={(e) => CloseModal()} />
          </div>
        </div>

        <br />

        <div style={{ marginLeft:'10%', width:"150px", float:"left"}}>
          <label htmlFor="data" style={{width:"20%"}}>
            Data Início
            <input 
              style={{backgroundColor:"white"}}
              type="date"
              value={dtaStart}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setDtaStart(e.target.value)}
            />
          </label>
        </div>

        <div style={{ marginRight:'10%', width:"150px", float:"right"}}>
          <label htmlFor="dataFinal" style={{width:"47%"}}>
            Data Final
            <input 
              style={{backgroundColor:"white"}}
              type="date"
              value={dtaEnd}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setDtaEnd(e.target.value)}
            />
          </label>
        </div>

        <br />
        <br />
        <br />
        <br />

        <div id='Buttons' style={{float:'right', marginRight:'25%', height:'60px'}}>
          <div style={{float:'left'}}>
            <button 
              className="buttonClick"
              type='button'
              onClick={()=> SetFilterDates()}
              style={{width:'100px', height:'28px'}}
            >
              {/* <BiSave /> */}
              Aplicar
            </button>
          </div>
                    
          <div style={{float:'left', width:'100px'}}>
            <button 
              type='button'
              className="buttonClick"
              onClick={() => CloseModal()}
              style={{width:'100px', height:'28px'}}
            >
              {/* <FaRegTimesCircle /> */}
              Cancelar
            </button>
          </div>
        </div>


      </ModalDateSelect>
    </>
  );
};

export default DateModal;