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
  id: string
  name: string
  partnerToken: string
  partnerId: string
  penaltyPackages: number
  ratesPackage: number
}

const FinancialIntegrationEdit: React.FC = () => {
  const formRef = useRef<HTMLFormElement>(null)
  const history = useHistory()
  const { handleUserPermission } = useDefaultSettings()
  const { addToast } = useToast()
  const { handleSubmit} = useForm<IPaymentSlipContractData>()
  const { pathname } = useLocation()
  const [isSaving , setisSaving] = useState<boolean>()
  const [token] = useState(localStorage.getItem('@GoJur:token'))
  const [bank, setBank] = useState("AS")
  const [paymentSlipContractId, setPaymentSlipContractId] = useState<string>("")
  const [paymentSlipContractDescription, setPaymentSlipContractDescription] = useState<string>("ASAAS Gestão Financeira Instituição de Pagamento S.A.")
  const [penaltyPackages, setPenaltyPackages] = useState<number>(0)
  const [ratesPackage, setRatesPackage] = useState<number>(0)
  const [bankToken, setBankToken] = useState<string>("")
  const [isValid, setIsValid] = useState<boolean>(false)

  const bankList = [
    { id:'AS', label: 'Asaas' },
  ]


  useEffect(() => {
    const id = pathname.substr(27)
    if ( id != '0')
      LoadFinancialIntegration()
  }, [])


  useEffect(() => {
    LoadDefaultProps();
  }, [handleUserPermission])


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


  const LoadFinancialIntegration = async() => {
    try {
      const id = pathname.substr(27)

      const response = await api.get<IPaymentSlipContractData>('/IntegracaoFinanceira/Editar', {
        params:{id, token}
      });
    
      setPaymentSlipContractId(response.data.id)
      setPaymentSlipContractDescription(response.data.name)
      setPenaltyPackages(response.data.penaltyPackages)
      setRatesPackage(response.data.ratesPackage)
      setBankToken(response.data.partnerToken)

      if(response.data.id)
        setIsValid(true)
    }
    catch (err) {
      console.log(err);
    }
  }


  const ValidateToken = useCallback(async() => {
    try {
      setisSaving(true)
      
      const response = await api.post('/IntegracaoFinanceira/Validar', { partnerToken: bankToken, token })
      
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


  const SavePaymentSlipContract = useCallback(async() => {
    try {

      // console.log(penaltyPackages)
      // if (penaltyPackages == 0) {
      //   addToast({type: "info", title: "Operação NÃO realizada", description: `Necessário definir um valor para a multa`})
      //   return;
      // }

      
      // console.log(ratesPackage)
      // if (ratesPackage == 0) {
      //   addToast({type: "info", title: "Operação NÃO realizada", description: `Necessário definir uma valor para os juros`})
      //   return;
      // }

      if (isSaving) {
        addToast({type: "info", title: "Operação NÃO realizada", description: `Já existe uma operação em andamento`})
        return;
      }

      if (isValid == false) {
        addToast({type: "info", title: "Operação NÃO realizada", description: `Necessário validar o token antes de salvar`})
        return;
      }

      const id = pathname.substr(27)
      const token = localStorage.getItem('@GoJur:token');
      setisSaving(true)
      
      await api.post('/IntegracaoFinanceira/Salvar', {
        id,
        name: paymentSlipContractDescription,
        partnerId: bank,
        penaltyPackages,
        ratesPackage,
        partnerToken: bankToken,
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
  }, [isSaving, paymentSlipContractId, paymentSlipContractDescription, penaltyPackages, ratesPackage, bankToken])


  const Close = () => { 
    history.push(`/FinancialIntegration/List`)
  }


  const Alert = () => { 
    addToast({type: "info", title: "Operação NÃO realizada", description: `É necessário validar o Token antes`})
  }


  const ChangeBank = (item) => {
    if (item)
      setBank(item.id)
    else
      setBank('')
  }


  const handleValuePenalty = (event, value, maskedValue) => {
    event.preventDefault();

    setPenaltyPackages(value)
  };


  const handleValueRates = (event, value, maskedValue) => {
    event.preventDefault();

    setRatesPackage(value)
  };

  return (
    <Container>
      <HeaderPage />
      <br />

      <Content>
        <Form ref={formRef} onSubmit={handleSubmit(SavePaymentSlipContract)}>
          <section id="dados">

            <div id='AutoCompleteSelectDiv' style={{width:'102.5%', marginLeft:'-8px'}}>
              <AutoCompleteSelect id='AutoCompleteSelect'>
                <p>Integrador Financeiro</p>
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
            </div>

            <label htmlFor="nameCarteira" className="required" style={{marginTop:'9px', height:'35px'}}>
              Nome do Integrador Financeiro
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
                onChange={handleValuePenalty}
                required
              />
            </label>

            <label htmlFor="jurosMora">
              Juros Mora (%)
              <IntlCurrencyInput
                currency="BRL"
                config={currencyConfig}
                value={ratesPackage}
                onChange={handleValueRates}
                required
              />
            </label>

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
                disabled={isValid}
              />
            </label>

            <div style={{float:'left', marginTop:'1px'}}>
              <div style={{float:'left', marginTop:'16px'}}>
                <button className="buttonClick" type='button' style={{width:'100px', height:'35px'}} onClick={()=> ValidateToken()} disabled={isValid}>
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
                
                {isValid && (
                  <button className="buttonClick" type="submit">
                    <FiSave />
                    Salvar
                    {isSaving ? <Loader size={5} color="#f19000" /> : null}
                  </button>
                )}

                {!isValid && (
                  <button type='button' className="buttonClick" onClick={() => Alert()} style={{opacity:0.5}}>
                    <FiSave />
                    Salvar
                  </button>
                )}
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
    </Container>
  )
}

export default FinancialIntegrationEdit;