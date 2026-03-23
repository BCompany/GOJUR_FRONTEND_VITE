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


interface IFinancial {
  cod_Movimento: string;
  dta_Movimento: string;
  dta_Liquidacao: string;
  des_Movimento: string;
  nom_Categoria: string;
  tpo_Movimento: string;
  cod_FormaPagamento: string;
  vlr_Movimento_Contabil: string;
  vlr_Liquidacao_Contabil: string;
  qtd_Parcelamento: string;
  num_Parcela: string;
  matterCustomerDesc: string;
  matterOpposingDesc: string;
  userNames: string;
  num_Processo: string;
  totalRecords: number;
  cod_FaturaParcela: number;
  cod_Acordo: string;
  parcelaFormatada?: string;
  cod_Fatura2Movimento?: string;
  flg_MovimentoExccluido?: string;
  des_Observacao?: string;
}


const FinancialBankSlipModal = (props) => {

  const { movementId, movementIdEdit, invoiceId, bankSlipURL, CloseBankSlipModal} = props.callbackFunction
  const token = localStorage.getItem('@GoJur:token');
  const { addToast } = useToast();
   const {isConfirmMessage, isCancelMessage, handleCancelMessage, handleConfirmMessage, caller} = useConfirmBox();
  const [paymentList, setPaymentList] = useState<IPayments[]>([]);
  const [showPostBackValidation, setShowPostBackValidation] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [paymentFormList, setPaymentFormList] = useState<ISelectData[]>([]);
  const [paymentFormTerm, setPaymentFormTerm] = useState('');
  const [paymentFormId, setPaymentFormId] = useState('');
  const [paymentFormDescription, setPaymentFormDescription] = useState<string>("")
  const [movementParcelas, setMovementParcelas] = useState('1');
  const [movementNumParcelas, setMovementNumParcelas] = useState('1');
  const [movement, setMovement] = useState<IFinancial>();
  const [movementDate, setMovementDate] = useState<string>('');
  const [movementValue, setMovementValue] = useState<number | null>(null);
  const [observation, setObservation] = useState<string>('');
  const [selectedPeopleList, setSelectedPeopleList] = useState<ISelectData[]>([]);
  const [currentInstallment, setCurrentInstallment] = useState('1');
  const [movementParcelasDatas, setMovementParcelasDatas] = useState('M');
  const [movementType, setMovementType] = useState('');
  const [movementParcelasFirst, setMovementParcelasFirst] = useState('1');
  const [codParcelamento, setCodParcelamento] = useState('0');
  const [categoryId, setCategoryId] = useState('');
  const [categoryDescription, setCategoryDescription] = useState('');
  const [centerCostId, setCenterCostId] = useState('');
  const [centerCostDescription, setCenterCostDescription] = useState<string>('')
  const [taxInvoice, setTaxInvoice] = useState<string>('');
  const [movementDescription, setMovementDescription] = useState('');
  const [flgNotifyPeople, setFlgNotifyPeople] = useState<boolean>(false);
  const [flgNotifyEmail, setFlgNotifyEmail] = useState<boolean>(true);
  const [flgNotifyWhatsApp, setFlgNotifyWhatsApp] = useState<boolean>(false);
  const [reminders, setReminders] = useState('00');
  const [showNotifyPeople, setShowNotifyPeople] = useState<boolean>(false);
  const [flgReembolso, setFlgReembolso] = useState<boolean>(false);
  const [flgStatus, setFlgStatus] = useState('A');
  const [showParcelasDatas, setShowParcelasDatas] = useState<boolean>(false);
  const [accountId, setAccountId] = useState('');
  const [paymentQtd, setPaymentQtd] = useState('');
  //const [invoice, setInvoice] = useState<number>(0);
  const [sequence, setSequence] = useState<string>('');
  const [enablePayments, setEnablePayments] = useState<boolean>(true);
  const [matterId, setMatterId] = useState('');
  const [processTitle, setProcessTitle] = useState('Associar Processo');
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [invoiceNumber, setInvoiceNumber] = useState<number>(0);
  const [actionSave, setActionSave] = useState<string>('');
  const [changeInstallments, setChangeInstallments] = useState<boolean>(false);
  const [changeCustomer, setChangeCustomer] = useState<boolean>(true);
  const [showChangeInstallments, setShowChangeInstallments] = useState<boolean>(false);
  const [showModalOptions, setShowModalOptions] = useState<boolean>(false);
  const companyId = localStorage.getItem('@GoJur:companyId');
  const [showChangeCustomer, setShowChangeCustomer] = useState<boolean>(false);
  const [movementdiscount, setMovementDiscount] = useState<number>();
  const [movementNetValue, setMovementNetValue] = useState<number>();
  const [pdfUrl, setPdfUrl] = useState('');
  

  return (
    <>
      <Modal show>

        <div id='Header' style={{ height: '30px' }}>
          <div className='menuTitle'>
       
            Visualização de Boleto
          </div>
          <div className='menuSection'>
            <FiX onClick={(e) => CloseBankSlipModal()} />
          </div>
        </div>

        <div style={{ height: '410px' }}>
            

        <iframe
            src={`${bankSlipURL}#toolbar=0&navpanes=0&scrollbar=0`}
            width="100%"
            height="100%"
            title="Boleto PDF"
            style={{ border: 'none' }}
        />


        </div>
        <br/>
        <br/>
        
        <div id='Buttons' style={{ float: 'right', marginRight: '7%', height: '60px' }}>
          <div style={{ float: 'left' }}>
            <button
              className="buttonClick"
              type='button'
              style={{ width: '100px' }}
            >
              <BiSave />
              Excluir
            </button>
          </div>

          <div style={{ float: 'left', width: '100px' }}>
            <button
              type='button'
              className="buttonClick"
              style={{ width: '100px' }}
               onClick={(e) => CloseBankSlipModal()}
            >
              <FaRegTimesCircle />
              Fechar
            </button>
          </div>
        </div>


        <br />
        <br />

      </Modal>

      {showModalOptions && (
        <ModalOptions
          description="Este movimento está parcelado, deseja atualizar também as outras parcelas ?"
          close={() => setShowModalOptions(false)}
          callback={handleCallback}
        />
      )}

       {showChangeInstallments && (
        <ConfirmBoxModal
          title="Alterar parcelas do movimento"
          caller="changeDefaultHeader"
          useCheckBoxConfirm
          message="Foi alterado o número de parcelas do movimento, o reparcelamento implica em alterar todas as parcelas considerando os dados do movimento atual. Eventuais liquidações serão mantidas desde que a parcela não seja removida (no caso de redução de parcelas)."
        />
      )}
      
      {showChangeCustomer && (
          <ConfirmBoxModal
              title="Alterar cliente da fatura"
              caller="changeDefaultHeader2"
              useCheckBoxConfirm
              message="Você esta alterando o cliente através da fatura, todos os movimentos serão alterados"
          />
      )}


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

export default FinancialBankSlipModal;
