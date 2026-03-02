/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable no-console */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable no-return-assign */
/* eslint-disable no-alert */
/* eslint-disable no-param-reassign */
/* eslint-disable jsx-a11y/label-has-associated-control */

import React, {useEffect, useState, useCallback, ChangeEvent} from 'react';
import api from 'services/api';
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
import { currencyConfig } from 'Shared/utils/commonFunctions';
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
  cod_Fatura2Movimento?:string;
  flg_MovimentoExccluido?: string;  
}

const FinancialInvoicingModal = (props) => {

  const {movementIdEdit, invoice, movementType, movementList, ClosePaymentModal} = props.callbackFunction
  const token = localStorage.getItem('@GoJur:token');
  const { addToast } = useToast();
  const [paymentList, setPaymentList] = useState<IPayments[]>([]);
  const [showPostBackValidation, setShowPostBackValidation] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [paymentFormList, setPaymentFormList] = useState<ISelectData[]>([]);
  const [paymentFormTerm, setPaymentFormTerm] = useState('');
  const [paymentFormId, setPaymentFormId] = useState('');
  const [paymentFormDescription, setPaymentFormDescription] = useState<string>("")
  const [movementParcelas, setMovementParcelas] = useState('1');
  const [movement, setMovement] = useState<IFinancial>();
  const [movementDate, setMovementDate] = useState<string>('');
  const [movementValue, setMovementValue] = useState<number | null>(null);

  useEffect(() => {
    LoadMovement()
    LoadPaymentForm()
  },[])


  const LoadMovement = async () => {

    const movement = movementList.find(
      item => item.cod_Movimento === Number(movementIdEdit)
    );

    setMovement(movement);
    //console.log(movementList);
    //console.log(movement);

  }

  const LoadPayments = async () => {

    try {
      const response = await api.get<IPayments[]>('/Financeiro/ObterPagamentos', {
        params:{
          token,
          movementId
        }
      });

      const paymentListReturn = response.data.map(payment => payment && {
        ...payment,
        action: 'UPDATE'
      })

      setPaymentList(paymentListReturn)
      
    } catch (err) {
      console.log(err);
    }
  }


  const NewPayment = () => {
    const id = Math.random()
    const newPayment: IPayments = {
      cod_Movimento: movementId,
      cod_MovimentoLiquidacao: id.toString(),
      dta_LiquidacaoStr:format(new Date(), 'yyyy-MM-dd'),
      vlr_Liquidacao: 0,
      total_Restante: 0,
      tpo_Movimento: '',
      action:'NEW',
    }

    setPaymentList(oldPayment => [...oldPayment, newPayment])
  }


  const ChangeDate = useCallback((value, paymentId) => {
   
    const newPayment = paymentList.map(payment => payment.cod_MovimentoLiquidacao === paymentId ? {
      ...payment,
      dta_LiquidacaoStr: value
    }: payment)

    setPaymentList(newPayment)

  },[paymentList]);


  const ChangeValue = (value, paymentId) => {
    
    const newPayment = paymentList.map(payment => payment.cod_MovimentoLiquidacao === paymentId ? {
      ...payment,
      vlr_Liquidacao: Number(value)
    }: payment)

    setPaymentList(newPayment)
  };


  const RemovePayment = useCallback((paymentId) => {

    const payment = paymentList.map(i => i.cod_MovimentoLiquidacao === paymentId ? {
      ...i,
      action: 'DELETE'
    }: i);
    setPaymentList(payment)

  },[paymentList]);

  
  const CloseModal = () => {
    ClosePaymentModal()
  }


  const SavePayments = useCallback(async(item) => {
    try {
      setIsLoading(true)
      setShowPostBackValidation(false)

      if (!Validate(paymentList)) return;
    
      const response = await api.post<IPayments[]>('/Financeiro/SalvarPagamentos', {
        
        movementId,
        paymentList,
        postBackValidation: item,
        token
      });

      setIsLoading(false)
      CloseModal()
      
    } catch (err) {
      setShowPostBackValidation(true)
      setIsLoading(false)
      console.log(err);
    }
  },[paymentList]);


  const Validate =(paymentList) => {

    let isValid = true;
    
    if(invoice != 0 && invoice != undefined)
    {
      addToast({
        type: "info",
        title: "AVISO",
        description: "Esta movimentação esta vinculada diretamente a uma fatura, as alterações devem ser realizadas em sua fatura de origem."
      })
      
      isValid = false;
      setIsLoading(false)
    }

    paymentList.map((item) => {
      
      if(item.vlr_Liquidacao <= 0)
      {
        addToast({
          type: "info",
          title: "Valor não permitido",
          description: "Os valores dos pagamentos devem ser maiores que zero"
        })

        isValid = false;
        setIsLoading(false)
      }

      return;
    })
    
    return isValid;
  }


  const LoadPaymentForm = async () => {
      try {
        const  response = await api.get<ISelectData[]>('FormaDePagamento/ListarPorFiltro', { params:{filterClause: paymentFormTerm, token}})
        setPaymentFormList(response.data)
      }
      catch (err:any) {
        addToast({type: "info", title: "Operação não realizada", description: err.response.data})
      }
    }


  const handlePaymentFormSelected = (item) => {
    if (item){
      setPaymentFormId(item.id)
      setPaymentFormDescription(item.label)
    }else{
      setPaymentFormId('')
      setPaymentFormDescription('')
      LoadPaymentForm()
    }
  }



  const handleChangeParcelas = (id: string) => {
    setMovementParcelas(id)
    //setShowParcelasDatas(id != '1')

  }


useEffect(() => {
  if (movement?.dta_Movimento) {
    setMovementDate(convertBRToISO(movement.dta_Movimento));
    console.log(movement);
  }
  if (movement?.vlr_Movimento) {
    setMovementValue(Number(movement.vlr_Movimento));
  }
  
}, [movement]);


const convertBRToISO = (dateBR: string) => {
  if (!dateBR) return '';

  const [day, month, year] = dateBR.split('/');
  return `${year}-${month}-${day}`;
};


  return(
    <>
      <Modal show>

        <div id='Header' style={{height:'30px'}}>
          <div className='menuTitle'>
            {movementType == "R" && (
              <>
                &nbsp;&nbsp;&nbsp;&nbsp;Liquidar Receita
              </>
            )}
            {movementType == "D" && (
              <>
                &nbsp;&nbsp;&nbsp;&nbsp;Liquidar Despesa
              </>
            )} 
          </div>
          <div className='menuSection'>
            <FiX onClick={(e) => CloseModal()} />
          </div>
        </div>

        <div id='Labels' style={{marginLeft:'5%', marginTop:'5px', height:'30px'}}>
          <div style={{float:'left', width:'40%'}}>
            Vencimento:
          </div>
          <div style={{float:'left', width:'42%'}}>
            Valor:
          </div>
          <div style={{float:'left', width:'18%'}}>
            
          </div>
        </div>

        <div id='Elements' style={{marginLeft:'4.5%', height:'40px'}}>
               
          <div style={{float:'left', width:'35%'}}>
           <input
              type="date"
              value={movementDate}
              onChange={(e) => setMovementDate(e.target.value)}
              style={{ width: '90%' }}
            />
          </div>

          <div style={{float:'left', width:'35%', marginTop:'3px'}}>
            <IntlCurrencyInput
  currency="BRL"
  config={currencyConfig}
  value={movementValue}
  onChange={(event, value) => {
    setMovementValue(value);
  }}
/>
          </div>
        </div>


        <div id='Labels' style={{marginLeft:'5%', marginTop:'5px', height:'30px'}}>
          <div style={{float:'left', width:'40%'}}>
            Forma Pagto:
          </div>
          <div style={{float:'left', width:'42%'}}>
            Parcelas:
          </div>
          <div style={{float:'left', width:'18%'}}>
            
          </div>
        </div>


        <div id='Elements' style={{marginLeft:'4.5%', height:'40px'}}>
               
          <div style={{float:'left', width:'35%'}}>
              <Select
                isSearchable
                isClearable
                value={{ id: paymentFormId, label: paymentFormDescription }}
                onChange={handlePaymentFormSelected}
                onInputChange={(term) => setPaymentFormTerm(term)}
                required
                placeholder=""
                options={paymentFormList}
              />
          </div>

          <div style={{float:'left', width:'35%'}}>
            <Select
              autoComplete="off"
              value={parcelas.filter(options => options.id === movementParcelas)}
              onChange={(item) => handleChangeParcelas(item? item.id: '')}
              options={parcelas}
            />
          </div>
        </div>


        
        <div id='Labels' style={{marginLeft:'5%', marginTop:'5px', height:'30px'}}>
          <div style={{float:'left', width:'40%'}}>
            Observação
          </div>
         
        </div>


        <div id='Elements' style={{marginLeft:'4.5%', height:'40px'}}>
               
          <div style={{float:'left', width:'70%'}}>
            <input
              type='text'
              title=""
              style={{width:'100%'}}
            />
          </div>

       
        </div>


        <br />
        <br />

        <div id='Buttons' style={{float:'right', marginRight:'7%', height:'60px'}}>
          <div style={{float:'left'}}>
            <button 
              className="buttonClick"
              type='button'
              onClick={()=> SavePayments(false)}
              style={{width:'100px'}}
            >
              <BiSave />
              Salvar
            </button>
          </div>
                    
          <div style={{float:'left', width:'100px'}}>
            <button 
              type='button'
              className="buttonClick"
              onClick={() => CloseModal()}
              style={{width:'100px'}}
            >
              <FaRegTimesCircle />
              Cancelar
            </button>
          </div>
        </div>

      </Modal>

      {(showPostBackValidation) && <OverlayFinancialPayment /> }
      {showPostBackValidation && (
        <ModalPostBackValidation>
          <div className='menuSection'>
            <FiX onClick={(e) => setShowPostBackValidation(false)} />
          </div>
          <div style={{marginLeft:'5%'}}>
            {/* A soma dos pagamentos totalizam: R$ 15,00, este valor excede o total da parcela de: ( R$ 10,00 ). Deseja continuar mesmo assim ? */}
            A soma dos pagamentos excedem o total da parcela. Deseja continuar mesmo assim ?
            <br />
            <br />
            <div style={{float:'right', marginRight:'7%', bottom:0}}>
              <div style={{float:'left'}}>
                <button 
                  className="buttonClick"
                  type='button'
                  onClick={()=> SavePayments(true)}
                  style={{width:'100px'}}
                >
                  <FaCheck />
                  Sim
                </button>
              </div>
                       
              <div style={{float:'left', width:'100px'}}>
                <button 
                  type='button'
                  className="buttonClick"
                  onClick={() => setShowPostBackValidation(false)}
                  style={{width:'100px'}}
                >
                  <FaRegTimesCircle />
                  Não
                </button>
              </div>
            </div>
          </div>

        </ModalPostBackValidation>
      )}

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

export default FinancialInvoicingModal;
