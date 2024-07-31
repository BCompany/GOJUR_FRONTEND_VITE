/* eslint-disable array-callback-return */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable radix */

import React, { ChangeEvent, useState, useEffect, useRef, useCallback } from 'react';
import Modal from 'react-modal';
import api from 'services/api';
import Select from 'react-select';
import { useDefaultSettings } from 'context/defaultSettings';
import { Overlay } from 'Shared/styles/GlobalStyle';
import LoaderWaiting from 'react-spinners/ClipLoader';
import IntlCurrencyInput from "react-intl-currency-input"
import { currencyConfig, selectStyles } from 'Shared/utils/commonFunctions';
import { AutoCompleteSelect } from 'Shared/styles/GlobalStyle';
import { useToast } from 'context/toast';
import { HeaderPage } from 'components/HeaderPage';
import { FiSave } from 'react-icons/fi';
import { FaRegTimesCircle, FaCheck } from 'react-icons/fa';
import { useHistory, useLocation  } from 'react-router-dom'
import Loader from 'react-spinners/PulseLoader';
import { useForm } from 'react-hook-form';
import { Container, Content, Form, Flags} from './styles';

export interface DefaultsProps {
  id: string
  value: string
}

export interface IPaymentSlipContractData{
  paymentSlipContractId: string
  paymentSlipContractDescription: string
  penaltyPackages: string
  ratesPackage: string
  flg_Default: boolean
  bankToken: string
}

Modal.setAppElement('#root');

const PaymentSlipContractConfig: React.FC = () => {
  const formRef = useRef<HTMLFormElement>(null)
  const history = useHistory()
  const { handleUserPermission } = useDefaultSettings()
  const { addToast } = useToast()
  const { handleSubmit} = useForm<IPaymentSlipContractData>()
  const { pathname } = useLocation()
  const [isSaving , setisSaving] = useState<boolean>()
  const [token] = useState(localStorage.getItem('@GoJur:token'))
  const [bank, setBank] = useState('AS')
  const [paymentSlipContractId, setPaymentSlipContractId] = useState<string>("")
  const [paymentSlipContractDescription, setPaymentSlipContractDescription] = useState<string>("")
  const [penaltyPackages, setPenaltyPackages] = useState<string>("")
  const [ratesPackage, setRatesPackage] = useState<string>("")
  const [flg_Default, setFlg_Default] = useState<boolean>(false)
  const [bankToken, setBankToken] = useState<string>("")
  const [isValid, setIsValid] = useState<boolean>(false)

  const bankList = [
    { id:'AS', label: 'Asaas' },
  ]
  

  useEffect(() => {
    LoadDefaultProps();
  }, [handleUserPermission])


  useEffect(() => {
    const id = pathname.substr(28)
    if ( id != '0')
      LoadPaymentSlipContract()
  }, [])


  const Close = () => { 
    history.push(`/PaymentSlipContract/List`)
  }


  const LoadPaymentSlipContract = async() => {
    try {
      const id = pathname.substr(28)

      const response = await api.post<IPaymentSlipContractData>('/CarteiraDeCobrança/Editar', {
        id,
        token
      });
    
      setPaymentSlipContractId (response.data.paymentSlipContractId)
      setPaymentSlipContractDescription(response.data.paymentSlipContractDescription)
      setPenaltyPackages(response.data.penaltyPackages)
      setRatesPackage(response.data.ratesPackage)
      setFlg_Default(response.data.flg_Default)
      setBankToken(response.data.bankToken)
    }
    catch (err) {
      console.log(err);
    }
  }

  
  const SavePaymentSlipContract = useCallback(async() => {
    try {
      if (isSaving) {
        addToast({type: "info", title: "Operação NÃO realizada", description: `Já existe uma operação em andamento`})
        return;
      }

      if (isValid == false) {
        addToast({type: "info", title: "Operação NÃO realizada", description: `Necessário validar o token antes de salvar`})
        return;
      }

      const id = pathname.substr(28)
      const token = localStorage.getItem('@GoJur:token');
      setisSaving(true)
      
      await api.post('/CarteiraDeCobrança/Salvar', {
        paymentSlipContractId: id,
        paymentSlipContractDescription,
        penaltyPackages,
        ratesPackage,
        flg_Default,
        bankToken,
        token
      })
      
      addToast({type: "success", title: "Carteira de cobrança salva", description: "A carteira de cobrança foi adicionada no sistema."})
      setisSaving(false)
      Close()
    }
    catch (err:any) {
      setisSaving(false)
      addToast({type: "error", title: "Falha ao salvar carteira de cobrança.", description: err.response.data.Message})
    }
  }, [isSaving, paymentSlipContractId, paymentSlipContractDescription, penaltyPackages, ratesPackage, flg_Default, bankToken])


  // Load default parameters by user
  const LoadDefaultProps = async () => {
    try {
      const response = await api.post<DefaultsProps[]>('/Defaults/Listar', {
        token,
      });

      const userprops = response.data[4].value.split('|');

      handleUserPermission(userprops);
    } catch (err) {
      console.log(err);
    }
  }


  const ChangeBank = (item) => {
    if (item)
      setBank(item.id)
    else
      setBank('')
  }


  const ValidateToken = useCallback(async() => {
    try {
      setisSaving(true)
      
      const response = await api.post('/CarteiraDeCobrança/Validar', {
        bankToken,
        token
      })
      
      if(response.data == true){
        addToast({type: "success", title: "Operação realizada", description: "O token foi validado com sucesso."})
        setIsValid(true)
      }

      setisSaving(false)
    }
    catch (err:any) {
      setisSaving(false)
      addToast({type: "error", title: "Falha ao validar o token.", description: err.response.data.Message})
    }
  }, [isSaving, bankToken])
  

  return (
    <Container>
      <HeaderPage />
      <br />
     
      <Content>
        <Form ref={formRef} onSubmit={handleSubmit(SavePaymentSlipContract)}>
          <section id="dados">

            <AutoCompleteSelect id='AutoCompleteSelect'>
              <p>Banco</p>
              <Select
                style={{backgroundColor:'#FFFFFF'}}
                isSearchable
                value={bankList.filter(options => options.id == bank)}
                onChange={ChangeBank}
                required
                placeholder="Selecione"
                styles={selectStyles}
                options={bankList}
              />
            </AutoCompleteSelect>

            <label htmlFor="nameCarteira" className="required">
              Nome Carteira
              <input  
                maxLength={100}
                type="text" 
                value={paymentSlipContractDescription}  
                autoComplete="off"
                name="nameCarteira"
                onChange={(e: ChangeEvent<HTMLInputElement>) => setPaymentSlipContractDescription(e.target.value)} 
                required
              />
            </label>

            <label htmlFor="multa%">
              Multa (%)
              <IntlCurrencyInput
                currency="BRL"
                config={currencyConfig}
                value={penaltyPackages}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setPenaltyPackages(e.target.value)}
              />
            </label>

            <label htmlFor="jurosMora">
              Juros Mora (%)
              <IntlCurrencyInput
                currency="BRL"
                config={currencyConfig}
                value={ratesPackage}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setRatesPackage(e.target.value)}
              />
            </label>

            <div>
              <div style={{float:'left', marginLeft: '0px', width: '90px'}}>
                <Flags>
                  Padrão
                </Flags>
              </div>
              <div style={{float:'left', marginTop:'3px', width: '10px'}}>
                <input
                  type="checkbox"
                  name="select"
                  checked={flg_Default}
                  onChange={() => setFlg_Default(!flg_Default)}
                  style={{minWidth:'15px', minHeight:'15px'}}
                />
              </div>
            </div>
            <br />

            <label htmlFor="token">
              TOKEN (Valide o token antes de salvar)
              <input 
                maxLength={150}
                style={{width: '100%'}}
                type="text"
                name="msg1"
                autoComplete="off"
                value={bankToken}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setBankToken(e.target.value)}
              />
            </label>
            <div style={{float:'left', marginTop:'1px'}}>
              <div style={{float:'left', marginTop:'16px'}}>
                <button className="buttonClick" type='button' style={{width:'100px', height:'35px'}} onClick={()=> ValidateToken()}>
                  <FaCheck />
                  Validar
                </button>
              </div>

              {isValid ? (
                <div style={{float:'left', marginTop:'25px', color:'green'}}>Token válido</div>
              ) : (
                <div style={{float:'left', marginTop:'25px', color:'red'}}>Aguardando validação...</div>
              )}
            </div>
            <br />

            <div>
              &nbsp;
            </div>

            <div id="Buttons" style={{justifySelf:'right', marginRight:'10px'}}>
              <div style={{float:'left'}}>
                <button className="buttonClick" type="submit" disabled={!isValid}>
                  <FiSave />
                  Salvar
                  {isSaving ? <Loader size={5} color="#f19000" /> : null}
                </button>
              </div>
                    
              <div style={{float:'left'}}>
                <button type='button' className="buttonClick" onClick={() => Close()}>
                  <FaRegTimesCircle />
                  Fechar
                </button>
              </div>
            </div>
            <br />

          </section>
        </Form>
      </Content>

      {isSaving && (
        <>
          <Overlay />
          <div className='waitingMessage'>   
            <LoaderWaiting size={15} color="var(--blue-twitter)" /> 
            &nbsp;&nbsp;
            Salvando  ...
          </div>
        </>
      )}   
          
    </Container>
  );
};

export default PaymentSlipContractConfig;
