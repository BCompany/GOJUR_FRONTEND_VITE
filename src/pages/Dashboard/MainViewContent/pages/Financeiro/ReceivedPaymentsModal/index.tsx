/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable no-console */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable no-return-assign */
/* eslint-disable no-alert */
/* eslint-disable no-param-reassign */
/* eslint-disable jsx-a11y/label-has-associated-control */

import React, { useEffect, useState, useCallback, ChangeEvent } from 'react';
import api from 'services/api';
import ModalOptions from 'components/ModalOptions';
import ConfirmBoxModal from 'components/ConfirmBoxModal';
import { useConfirmBox } from 'context/confirmBox';
import { useMenuHamburguer } from 'context/menuHamburguer'
import Select from 'react-select';
import { format } from 'date-fns';
import { FaRegTimesCircle, FaCheck } from 'react-icons/fa';
import { BiSave } from 'react-icons/bi';
import { FiX, FiTrash } from 'react-icons/fi';
import { GoPlus } from 'react-icons/go';
import { useToast } from 'context/toast';
import { Overlay } from 'Shared/styles/GlobalStyle';
import LoaderWaiting from 'react-spinners/ClipLoader';
import IntlCurrencyInput from "react-intl-currency-input";
import { currencyConfig, selectStyles } from 'Shared/utils/commonFunctions';
import { IPayments } from '../Interfaces/IPayments';
import { Modal, ModalPostBackValidation, OverlayFinancialPayment } from './styles';

import { ISelectData, MatterData, IMovementUploadFile } from '../Interfaces/IFinancial';
import { parcelas, parcelasDatas, financialReminders } from 'Shared/utils/commonListValues';


const FinancialReceivedPaymentsModal = (props) => {

  const { isOpenMenuSettleReceipts, handleIsOpenMenuSettleReceipts } = useMenuHamburguer();
  const token = localStorage.getItem('@GoJur:token');
  const { addToast } = useToast();
   const {isConfirmMessage, isCancelMessage, handleCancelMessage, handleConfirmMessage, caller} = useConfirmBox();
  const [showPostBackValidation, setShowPostBackValidation] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showModalOptions, setShowModalOptions] = useState<boolean>(false);
  const companyId = localStorage.getItem('@GoJur:companyId');
  const [showChangeCustomer, setShowChangeCustomer] = useState<boolean>(false);
  const apiKey = localStorage.getItem('@GoJur:apiKey');
 const today = new Date();
today.setMinutes(today.getMinutes() - today.getTimezoneOffset());

const currentDate = today.toISOString().split('T')[0];
const [startDate, setStartDate] = useState<string>(currentDate);
const [endDate, setEndDate] = useState<string>(currentDate);

const handleCloseModal = () => {
    handleIsOpenMenuSettleReceipts(false)
  }

  const handleReceivedPayments = async () => {
    try {
      setIsLoading(true)
      await api.post('/Financeiro/Faturamento2/BaixarRecebimentos', {
        companyId: Number(companyId),
        startDate,
        endDate,
        token,
        apiKey,
      })
      addToast({ type: 'success', title: "Sucesso", description: 'Recebimentos processados com sucesso!' })
      handleCloseModal()
    } catch (err: any){
      addToast({ type: 'error', title: 'Operação não realizada.', description: err.response?.data?.Message })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <Modal show>

        <div id='Header' style={{ height: '30px' }}>
          <div className='menuTitle'>

            Processar Recebimentos
          </div>
          <div className='menuSection'>
            <FiX onClick={(e) => handleCloseModal()} />
          </div>
        </div>


        <div style={{ padding: '8px 30px' }}>

          <div style={{ display: 'flex', gap: '16px' }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '0.65rem', marginBottom: '3px' }}>Data Inicial:</div>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                style={{ width: '100%' }}
                className='inputField'
              />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '0.65rem', marginBottom: '3px' }}>Data Final:</div>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                style={{ width: '100%' }}
                className='inputField'
              />
            </div>
          </div>

         <div className="messageEmpty" >
            Processa os pagamentos recebidos através de boletos
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '5px', marginTop: '55px' }}>
            <button
              className="buttonClick"
              type='button'
              onClick={handleReceivedPayments}
              style={{ width: '90px' }}
            >
              <BiSave />
              Processar
            </button>
            <button
              type='button'
              className="buttonClick"
              onClick={() => handleCloseModal()}
              style={{ width: '90px', marginRight: '0px' }}
            >
              <FaRegTimesCircle />
              Cancelar
            </button>
          </div>
        </div>

      </Modal>

      {(showPostBackValidation) && <OverlayFinancialPayment />}

      {isLoading && (
        <>
          <Overlay />
          <div className='waitingMessage'>
            <LoaderWaiting size={15} color="var(--blue-twitter)" />
            &nbsp;&nbsp; Carregando...
          </div>
        </>
      )}

    </>
  );


};

export default FinancialReceivedPaymentsModal;
