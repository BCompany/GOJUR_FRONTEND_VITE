/* eslint-disable no-param-reassign */
/* eslint-disable eqeqeq */
/* eslint-disable no-shadow */
/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable no-const-assign */
// ESLINT PAGE RULES
/* eslint-disable no-undef */
/* eslint-disable default-case */
/* eslint-disable radix */
/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable no-useless-return */
/* eslint-disable no-restricted-globals */
/* eslint-disable jsx-a11y/label-has-associated-control */

import React, {useEffect, useState, useCallback, ChangeEvent } from 'react';
import api from 'services/api';
import { FiEdit, FiTrash, FiX } from 'react-icons/fi';
import { FiSave } from 'react-icons/fi';
import { FaRegTimesCircle } from 'react-icons/fa';
import { useToast } from 'context/toast';
import { Modal } from './styles';

export interface LembretesData {
  qtdReminder: string;
  notifyMatterCustomer: string;
}

const CalendarReminderModal = (props) => {
  const { handleCloseReminderModal, setAppointmentNotifyMatterCustomer, setAppointmentRemindersList, appointmentRemindersList, appointmentNotifyMatterCustomer } = props.callbackFunction
  const token = localStorage.getItem('@GoJur:token');
  const [numberQtd, setNumberQtd] = useState<string>("1")
  const [typeDay, setTypeDay] = useState<string>("D")
  const { addToast } = useToast();


  const handleChangeMonthYear = () => {

    if(Number.isInteger(Number(numberQtd)) == false){
      addToast({
        type: 'info',
        title: 'Número Inválido',
        description:
          'Por favor, informe apenas um número inteiro.',
      });

      return
    }

    if(Number(numberQtd) > 99 || Number(numberQtd) < 1){
      addToast({
        type: 'info',
        title: 'Número Inválido',
        description:
          'Por favor, informe um número entre 1 e 99.',
      });

      return
    }

    setAppointmentNotifyMatterCustomer('N');

    const number = numberQtd + typeDay

    setAppointmentRemindersList([
      ...appointmentRemindersList,
      {
        qtdReminder: number,
        notifyMatterCustomer: appointmentNotifyMatterCustomer,
      },
    ]);

    if (
      appointmentRemindersList.findIndex(
        key => key.qtdReminder === number,
      ) != -1
    ) {
      const newdata: LembretesData[] = Array.from(appointmentRemindersList);
      const key = newdata.findIndex(
        item => item.qtdReminder === number,
      );
      newdata.slice(key, 1);

      setAppointmentRemindersList(newdata);
    }

    handleCloseReminderModal()
  }

  return(
    <>
      <Modal show>
        <div id='Header' style={{height:'30px'}}>
          <div className='menuTitle'>
            &nbsp;&nbsp;&nbsp;&nbsp;Lembrete Personalizado
          </div>
          <div className='menuSection'>
            <FiX onClick={(e) => handleCloseReminderModal()} />
          </div>
        </div>
        <br />


        <div style={{display:"flex", marginLeft:"10px"}}>

          <div style={{width:"22%"}}>
            <label htmlFor="qtd">
              <input 
                type="number" 
                id="qtd"
                autoComplete="off"
                value={numberQtd}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setNumberQtd(e.target.value)}
              />
            </label>
          </div>

          <div style={{width:"70%", marginLeft:"3%"}}>
            <label htmlFor="typeDay">   
              <select
                name="typeDay"
                value={typeDay}
                onChange={(e: ChangeEvent<HTMLSelectElement>) => setTypeDay(e.target.value)}
              >
                <option value="M">Minuto(s)</option>
                <option value="H">Hora(s)</option>
                <option value="D">Dia(s)</option>
                <option value="S">Semana(s)</option>
                <option value="E">Mês(es)</option>
              </select>
            </label>
          </div>   
   
        </div>
        
        <br />
        <br />

        <div id='Buttons' style={{marginRight:'22px', float:'right'}}>
          <div style={{float:'left'}}>
            <button 
              className="buttonClick"
              type='button'
              onClick={() => handleChangeMonthYear()}
              style={{width:'135px', height:'38px'}}
            >
              <FiSave />
              Criar Lembrete&nbsp;
            </button>
          </div>
                    
          <div style={{float:'left', width:'100px'}}>
            <button 
              type='button'
              className="buttonClick"
              onClick={() => handleCloseReminderModal()}
              style={{width:'100px', height:'38px'}}
            >
              <FaRegTimesCircle />
              Fechar&nbsp;
            </button>
          </div>
        </div>
        <br />
        <br />
        <br />

      </Modal>
    </>
  );
};

export default CalendarReminderModal;