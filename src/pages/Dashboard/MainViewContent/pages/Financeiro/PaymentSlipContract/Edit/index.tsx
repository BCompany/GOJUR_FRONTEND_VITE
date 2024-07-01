/* eslint-disable array-callback-return */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable radix */

import React, { ChangeEvent, useState, useEffect, useRef, useCallback } from 'react';
import Modal from 'react-modal';
import api from 'services/api';
import { useDefaultSettings } from 'context/defaultSettings';
import { Overlay } from 'Shared/styles/GlobalStyle';
import LoaderWaiting from 'react-spinners/ClipLoader';
import IntlCurrencyInput from "react-intl-currency-input"
import { FcAbout} from 'react-icons/fc';
import { currencyConfig } from 'Shared/utils/commonFunctions';
import { useToast } from 'context/toast';
import { useDevice } from "react-use-device";
import { HeaderPage } from 'components/HeaderPage';
import { FiSave } from 'react-icons/fi';
import {FaRegTimesCircle } from 'react-icons/fa';
import {useHistory, useLocation  } from 'react-router-dom'
import Loader from 'react-spinners/PulseLoader';
import { useForm } from 'react-hook-form';
import { Container, Content, Form, FormMobile, Flags} from './styles';



export interface DefaultsProps {
    id: string;
    value: string;
  }

  export interface IPaymentSlipContractData{
    paymentSlipContractId: string;
    paymentSlipContractDescription: string;
    bankId: string;
    bankName: string;
    agencyNumber: string;
    agencyDigitNumber: string;
    accountNumber: string;
    accountDigitNumber: string;
    assignorId: string;
    assignorDigitId: string;
    bankWalletId: string;
    transmissionId: string;
    invoiceName: string;
    remittanceFileName: string;
    beneficiaryCNPJNumber: string;
    beneficiaryName: string;
    beneficiaryAdress: string;
    befeniciaryCEP: string;
    seqDocumentNumber: string;
    seqRemitenceNumber: string;
    penaltyLevyDaysNumber: string;
    penaltyPackages: string;
    ratesPackage: string;
    shippingLevyDaysNumber: string;
    typeBankWalletShipping: string;
    typeBankWalletReturn: string;
    flg_Default: boolean;
    messageDescription1: string;
    messageDescription2: string;
    messageDescription3: string;
    messageDescription4: string;
    messageDescription5: string;
}

Modal.setAppElement('#root');

const PaymentSlipContractEdit: React.FC = () => {
  
  const formRef = useRef<HTMLFormElement>(null);
  const { handleUserPermission } = useDefaultSettings();
  const { addToast } = useToast();
  const { handleSubmit} = useForm<IPaymentSlipContractData>();
  const { pathname } = useLocation();
  const [isSaving , setisSaving] = useState<boolean>(); // set trigger for show loader
  const history = useHistory();
  const [token] = useState(localStorage.getItem('@GoJur:token'));
  const [paymentSlipContractId, setPaymentSlipContractId] = useState<string>("")
  const [paymentSlipContractDescription, setPaymentSlipContractDescription] = useState<string>("");
  const [beneficiaryCNPJNumber, setBeneficiaryCNPJNumber] = useState<string>("");
  const [bankName, setBankName] = useState<string>("");
  const [beneficiaryName, setBeneficiaryName] = useState<string>("");
  const [agencyNumber, setAgencyNumber] = useState<string>("");
  const [beneficiaryAdress, setBeneficiaryAdress] = useState<string>("");
  const [agencyDigitNumber, setAgencyDigitNumber] = useState<string>("");
  const [befeniciaryCEP, setBefeniciaryCEP] = useState<string>("");
  const [accountNumber, setAccountNumber] = useState<string>("");
  const [seqDocumentNumber, setSeqDocumentNumber] = useState<string>("");
  const [accountDigitNumber, setAccountDigitNumber] = useState<string>("");
  const [seqRemitenceNumber, setSeqRemitenceNumber] = useState<string>("");
  const [assignorId, setAssignorId] = useState<string>("");
  const [penaltyLevyDaysNumber, setPenaltyLevyDaysNumber] = useState<string>("");
  const [assignorDigitId, setAssignorDigitId] = useState<string>("");
  const [penaltyPackages, setPenaltyPackages] = useState<string>("");
  const [bankWalletId, setBankWalletId] = useState<string>("");
  const [ratesPackage, setRatesPackage] = useState<string>("");
  const [transmissionId, setTransmissionId] = useState<string>("");
  const [shippingLevyDaysNumber, setShippingLevyDaysNumber] = useState<string>("");
  const [invoiceName, setInvoiceName] = useState<string>("");
  const [typeBankWalletShipping, setTypeBankWalletShipping] = useState<string>("");
  const [remittanceFileName, setRemittanceFileName] = useState<string>("");
  const [typeBankWalletReturn, setTypeBankWalletReturn] = useState<string>("");
  const [messageDescription1, setMessageDescription1] = useState<string>("");
  const [messageDescription2, setMessageDescription2] = useState<string>("");
  const [messageDescription3, setMessageDescription3] = useState<string>("");
  const [messageDescription4, setMessageDescription4] = useState<string>("");
  const [messageDescription5, setMessageDescription5] = useState<string>("");
  const [flg_Default, setFlg_Default] = useState<boolean>(false);
  const { isMOBILE } = useDevice();

  
  // Call default parameters by company 
  useEffect(() => {
    LoadDefaultProps();
  }, [handleUserPermission]); 


  useEffect(() => {
    const id = pathname.substr(26)
    if ( id != '0'){
      LoadPaymentSlipContract()
    }
   
  }, [])

  const handleClose = () => { 
    handleResetStates();
    history.push(`/PaymentSlipContract/List`)

  }


  const LoadPaymentSlipContract = async() => {

    try {
      const id = pathname.substr(26)

      const response = await api.post<IPaymentSlipContractData>('/CarteiraDeCobrança/Editar', { 
        id,
        token
      });
    
    setPaymentSlipContractId (response.data.paymentSlipContractId)
    setPaymentSlipContractDescription(response.data.paymentSlipContractDescription)
    setBeneficiaryCNPJNumber(response.data.beneficiaryCNPJNumber)
    setBankName(response.data.bankName)
    setBeneficiaryName(response.data.beneficiaryName)
    setAgencyNumber(response.data.agencyNumber)
    setBeneficiaryAdress(response.data.beneficiaryAdress)
    setAgencyDigitNumber(response.data.agencyDigitNumber)
    setBefeniciaryCEP(response.data.befeniciaryCEP)
    setAccountNumber(response.data.accountNumber)
    setSeqDocumentNumber(response.data.seqDocumentNumber)
    setAccountDigitNumber(response.data.accountDigitNumber)
    setSeqRemitenceNumber(response.data.seqRemitenceNumber)
    setAssignorId(response.data.assignorId)
    setPenaltyLevyDaysNumber(response.data.penaltyLevyDaysNumber)
    setAssignorDigitId(response.data.assignorDigitId)
    setPenaltyPackages(response.data.penaltyPackages)
    setBankWalletId(response.data.bankWalletId)
    setRatesPackage(response.data.ratesPackage)
    setTransmissionId(response.data.transmissionId)
    setShippingLevyDaysNumber(response.data.shippingLevyDaysNumber)
    setInvoiceName(response.data.invoiceName)
    setTypeBankWalletShipping(response.data.typeBankWalletShipping)
    setRemittanceFileName(response.data.remittanceFileName)
    setTypeBankWalletReturn(response.data.typeBankWalletReturn)
    setMessageDescription1(response.data.messageDescription1)
    setMessageDescription2(response.data.messageDescription2)
    setMessageDescription3(response.data.messageDescription3)
    setMessageDescription4(response.data.messageDescription4)
    setMessageDescription5(response.data.messageDescription5)
    setFlg_Default(response.data.flg_Default)

    } catch (err) {
      console.log(err);
    }
  }


  
  const savePaymentSlipContract = useCallback(async() => {
    try {

      if (isSaving) {
        addToast({
          type: "info",
          title: "Operação NÃO realizada",
          description: `Já existe uma operação em andamento`
        })
  
        return;
      }

      const id = pathname.substr(26)
      const token = localStorage.getItem('@GoJur:token');
      setisSaving(true)
      
      await api.post('/CarteiraDeCobrança/Salvar', {

        paymentSlipContractId: id,
        paymentSlipContractDescription,
        beneficiaryCNPJNumber,
        bankName,
        beneficiaryName,
        agencyNumber,
        beneficiaryAdress,
        agencyDigitNumber,
        befeniciaryCEP,
        accountNumber,
        seqDocumentNumber,
        accountDigitNumber,
        seqRemitenceNumber,
        assignorId,
        penaltyLevyDaysNumber,
        assignorDigitId,
        penaltyPackages,
        bankWalletId,
        ratesPackage,
        transmissionId,
        shippingLevyDaysNumber,
        invoiceName,
        typeBankWalletShipping,
        remittanceFileName,
        typeBankWalletReturn,
        messageDescription1,
        messageDescription2,
        messageDescription3,
        messageDescription4,
        messageDescription5,
        flg_Default,
        token
      })

      
      addToast({
        type: "success",
        title: "Carteira de cobrança salva",
        description: "A carteira de cobrança foi adicionada no sistema."
      })

      setisSaving(false)
      handleResetStates()
      handleClose()

    } catch (err) {
      setisSaving(false)
      addToast({
        type: "error",
        title: "Falha ao salvar carteira de cobrança.",
      })
    }
  
  },[isSaving, paymentSlipContractId, paymentSlipContractDescription, beneficiaryCNPJNumber, bankName, beneficiaryName, agencyNumber, beneficiaryAdress, agencyDigitNumber, befeniciaryCEP, accountNumber, beneficiaryAdress, agencyDigitNumber, seqDocumentNumber, accountDigitNumber, seqRemitenceNumber, assignorId, penaltyLevyDaysNumber, assignorDigitId, penaltyPackages, bankWalletId, ratesPackage, transmissionId, shippingLevyDaysNumber, invoiceName, typeBankWalletShipping, remittanceFileName, typeBankWalletReturn, messageDescription1, messageDescription2, messageDescription3, messageDescription4, messageDescription5, flg_Default]);

  


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

  const handleResetStates = () => { 
    setPaymentSlipContractDescription("")
    setBeneficiaryCNPJNumber("")
    setBankName("")
    setBeneficiaryName("")
    setAgencyNumber("")
    setBeneficiaryAdress("")
    setAgencyDigitNumber("")
    setBefeniciaryCEP("")
    setAccountNumber("")
    setSeqDocumentNumber("")
    setAccountDigitNumber("")
    setSeqRemitenceNumber("")
    setAssignorId("")
    setPenaltyLevyDaysNumber("")
    setAssignorDigitId("")
    setPenaltyPackages("")
    setBankWalletId("")
    setRatesPackage("")
    setTransmissionId("")
    setShippingLevyDaysNumber("")
    setInvoiceName("")
    setTypeBankWalletShipping("")
    setRemittanceFileName("")
    setTypeBankWalletReturn("")
    setMessageDescription1("")
    setMessageDescription2("")
    setMessageDescription3("")
    setMessageDescription4("")
    setMessageDescription5("")
    setFlg_Default(false)
    setPaymentSlipContractId("") 
  }
  
  return (

    <Container>

      <HeaderPage />

      <br />
      
      <Content>

        {!isMOBILE &&(
        <Form ref={formRef} onSubmit={handleSubmit(savePaymentSlipContract)}> 
            
          <section id="dados">
            
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

            <label htmlFor="cnpjBeneficiario">
              CNPJ Beneficiário
              <input
                maxLength={18}
                type="text"
                autoComplete="off"
                value={beneficiaryCNPJNumber}
                name="cnpjBeneficiario"
                onChange={(e: ChangeEvent<HTMLInputElement>) => setBeneficiaryCNPJNumber(e.target.value)}
                required
              />
            </label>

            <label htmlFor="nomeBanco">
              Nome Banco
              <input 
                maxLength={100}
                type="text"
                name="nomeBanco"
                autoComplete="off"
                value={bankName}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setBankName(e.target.value)}
                required
              />
            </label>

            <label htmlFor="nomeBeneficiario">
              Nome Beneficiário
              <input
                maxLength={100} 
                type="text"
                name="nomeBeneficiario"
                autoComplete="off"
                value={beneficiaryName}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setBeneficiaryName(e.target.value)}
                required
              />
            </label>

            <label htmlFor="numAgencia">
              Número Agência
              <input 
                maxLength={6}
                type="text"
                name="numAgencia"
                autoComplete="off"
                value={agencyNumber}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setAgencyNumber(e.target.value)}
                required
              />
            </label>

            <label htmlFor="endBeneficiario">
              Endereço Beneficiário
              <input 
                maxLength={500}
                type="text"
                name="endBeneficiario"
                autoComplete="off"
                value={beneficiaryAdress}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setBeneficiaryAdress(e.target.value)}
                required
              />
            </label>

            <label htmlFor="dgtAgencia">
              Dígito Agência
              <input 
                maxLength={2}
                type="text"
                name="dgtAgencia"
                autoComplete="off"
                value={agencyDigitNumber}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setAgencyDigitNumber(e.target.value)}
                required
              />
            </label>

            <label htmlFor="cepBeneficiario">
              CEP Beneficiário
              <input
                maxLength={9}
                type="text"
                name="cepBeneficiario"
                autoComplete="off"
                value={befeniciaryCEP}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setBefeniciaryCEP(e.target.value)}
                required
              />
            </label>

            <label htmlFor="numConta">
              Número Conta
              <input 
                maxLength={20}
                type="text"
                name="numConta"
                autoComplete="off"
                value={accountNumber}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setAccountNumber(e.target.value)}
                required
              />
            </label>

            <label htmlFor="numSeqDoc">
              Núm Seq Documento
              <input 
                type="text"
                name="numSeqDoc"
                autoComplete="off"
                value={seqDocumentNumber}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setSeqDocumentNumber(e.target.value)}
              />
            </label>

            <label htmlFor="dgtConta">
              Dígito Conta
              <input 
                maxLength={2}
                type="text"
                name="dgtConta"
                autoComplete="off"
                value={accountDigitNumber}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setAccountDigitNumber(e.target.value)}
                required
              />
            </label>

            <label htmlFor="numSeqRemessa">
              Núm Seq Remessa
              <input 
                type="text"
                name="numSeqRemessa"
                autoComplete="off"
                value={seqRemitenceNumber}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setSeqRemitenceNumber(e.target.value)}
              />
            </label>

            <label htmlFor="cedConvenio">
              <div>
                Cedente/Convênio&nbsp;&nbsp;
                <FcAbout 
                  className='icons' 
                  title='Preencher o código do cedente ou o número do convênio em caso do Banco do Brasil'
                  style={{minWidth: '20px', minHeight: '20px'}}
                /> 

                <input 
                  maxLength={20}
                  type="text"
                  name="cedConvenio"
                  autoComplete="off"
                  value={assignorId}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setAssignorId(e.target.value)}
                  required
                />
              </div>
            </label>

            <label htmlFor="numDiasMulta">
              Número Dias Multa
              <input 
                type="text"
                name="numDiasMulta"
                autoComplete="off"
                value={penaltyLevyDaysNumber}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setPenaltyLevyDaysNumber(e.target.value)}
              />
            </label>

            <label htmlFor="dgtCedente">
              Dígito Cedente
              <input 
                maxLength={2}
                type="text"
                name="dgtCedente"
                autoComplete="off"
                value={assignorDigitId}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setAssignorDigitId(e.target.value)}
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

            <label htmlFor="codCarteira">
              Código Carteira
              <input 
                maxLength={5}
                type="text"
                name="codCarteira"
                autoComplete="off"
                value={bankWalletId}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setBankWalletId(e.target.value)}
                required
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

            <label htmlFor="codTransm">
              Código Transmissão
              <input 
                maxLength={20}
                type="text"
                name="codTransm"
                autoComplete="off"
                value={transmissionId}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setTransmissionId(e.target.value)}
              />
            </label>

            <label htmlFor="diaEnvCobran">
              Dias Envio Cobrança
              <input 
                type="text"
                name="diaEnvCobran"
                autoComplete="off"
                value={shippingLevyDaysNumber}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setShippingLevyDaysNumber(e.target.value)}
              />
            </label>

            <label htmlFor="nomeFaturaPDF">
              Nome Fatura (PDF):
              <input 
                maxLength={50}
                type="text"
                name="nomeFaturaPDF"
                autoComplete="off"
                value={invoiceName}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setInvoiceName(e.target.value)}
              />
            </label>

            <label htmlFor="type" style={{fontSize:'0.675rem'}}>
              Tipo Carteira Envio 
              <select 
                style={{width: '60%', fontSize:'15px'}}
                name="tipoCarteiraEnvio"
                value={typeBankWalletShipping}
                onChange={(e: ChangeEvent<HTMLSelectElement>) => setTypeBankWalletShipping(e.target.value)}
              >
                <option value="237400">Bradesco - Cnab 400</option>
                <option value="341400">Itaú - Cnab 400</option>
                <option value="033400">Santander - Cnab 400</option>
                <option value="001400">Banco do Brasil - Cnab 400</option>
              </select>
            </label>

            <label htmlFor="nomeRemessa">
              Nome Remessa:
              <input 
                type="text"
                name="nomeRemessa"
                autoComplete="off"
                value={remittanceFileName}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setRemittanceFileName(e.target.value)}
              />
            </label>

            <label htmlFor="type" style={{fontSize:'0.675rem'}}>
              Tipo Carteira Retorno 
              <select 
                style={{width: '60%', fontSize:'15px'}}
                name="tipoCarteiraRetorno"
                value={typeBankWalletReturn}
                onChange={(e: ChangeEvent<HTMLSelectElement>) => setTypeBankWalletReturn(e.target.value)}
              >
                <option value="237240">Bradesco - Cnab 400</option>
                <option value="341240">Itaú - Cnab 400</option>
                <option value="033240">Santander - Cnab 400</option>
                <option value="001240">Banco do Brasil - Cnab 400</option>
              </select>
            </label>

            <label htmlFor="msg1">
              Mensagem 1
              <input 
                maxLength={100}
                style={{width: '130%'}}
                type="text"
                name="msg1"
                autoComplete="off"
                value={messageDescription1}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setMessageDescription1(e.target.value)}
              />
            </label>
            <br />
            <label htmlFor="msg2">
              Mensagem 2
              <input 
                maxLength={100}
                style={{width: '130%'}}
                type="text"
                name="msg2"
                autoComplete="off"
                value={messageDescription2}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setMessageDescription2(e.target.value)}
              />
            </label>
            <br />
            <label htmlFor="msg3">
              Mensagem 3
              <input 
                maxLength={100}
                style={{width: '130%'}}
                type="text"
                name="msg3"
                autoComplete="off"
                value={messageDescription3}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setMessageDescription3(e.target.value)}
              />
            </label>
            <br />
            <label htmlFor="msg4">
              Mensagem 4
              <input 
                maxLength={100}
                style={{width: '130%'}}
                type="text"
                name="msg4"
                autoComplete="off"
                value={messageDescription4}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setMessageDescription4(e.target.value)}
              />
            </label>
            <br />
            <label htmlFor="msg5">
              Mensagem 5
              <input 
                maxLength={100}
                style={{width: '130%'}}
                type="text"
                name="msg5"
                autoComplete="off"
                value={messageDescription5}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setMessageDescription5(e.target.value)}
              />
            </label>
            <br />

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

            <div>
            &nbsp;
            </div>

            <div id="BtSvCl" style={{float:'right', marginLeft:'250px'}}>

              <div style={{marginLeft:'10px', float:'left'}}>
                <button className="buttonClick" type="submit">
                  <FiSave />
                  Salvar
                  {isSaving ? <Loader size={5} color="#f19000" /> : null}
                </button>                 
              </div>
                    
              <div style={{float:'left', width:'100px'}}>
                <button 
                  type='button'
                  className="buttonClick"
                  onClick={() => handleClose()}
                  style={{width:'90px'}}
                >
                  <FaRegTimesCircle />
                  Fechar
                </button>
              </div>

            </div>

                                                                                                                              
          </section>
    
        </Form>
      )}

        {isMOBILE &&(
        <FormMobile ref={formRef} onSubmit={handleSubmit(savePaymentSlipContract)}> 
            
          <section id="dados">
            
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

            <label htmlFor="cnpjBeneficiario">
              CNPJ Beneficiário
              <input 
                type="text"
                autoComplete="off"
                value={beneficiaryCNPJNumber}
                name="cnpjBeneficiario"
                onChange={(e: ChangeEvent<HTMLInputElement>) => setBeneficiaryCNPJNumber(e.target.value)}
                required
              />
            </label>

            <label htmlFor="nomeBanco">
              Nome Banco
              <input 
                maxLength={100}
                type="text"
                name="nomeBanco"
                autoComplete="off"
                value={bankName}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setBankName(e.target.value)}
                required
              />
            </label>

            <label htmlFor="nomeBeneficiario">
              Nome Beneficiário
              <input 
                maxLength={100}
                type="text"
                name="nomeBeneficiario"
                autoComplete="off"
                value={beneficiaryName}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setBeneficiaryName(e.target.value)}
                required
              />
            </label>

            <label htmlFor="numAgencia">
              Número Agência
              <input 
                maxLength={6}
                type="text"
                name="numAgencia"
                autoComplete="off"
                value={agencyNumber}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setAgencyNumber(e.target.value)}
                required
              />
            </label>

            <label htmlFor="endBeneficiario">
              Endereço Beneficiário
              <input
                maxLength={500} 
                type="text"
                name="endBeneficiario"
                autoComplete="off"
                value={beneficiaryAdress}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setBeneficiaryAdress(e.target.value)}
                required
              />
            </label>

            <label htmlFor="dgtAgencia">
              Dígito Agência
              <input
                maxLength={2}
                type="text"
                name="dgtAgencia"
                autoComplete="off"
                value={agencyDigitNumber}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setAgencyDigitNumber(e.target.value)}
                required
              />
            </label>

            <label htmlFor="cepBeneficiario">
              CEP Beneficiário
              <input 
                maxLength={9}
                type="text"
                name="cepBeneficiario"
                autoComplete="off"
                value={befeniciaryCEP}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setBefeniciaryCEP(e.target.value)}
                required
              />
            </label>

            <label htmlFor="numConta">
              Número Conta
              <input
                maxLength={20}
                type="text"
                name="numConta"
                autoComplete="off"
                value={accountNumber}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setAccountNumber(e.target.value)}
                required
              />
            </label>

            <label htmlFor="numSeqDoc">
              Núm Seq Documento
              <input 
                type="text"
                name="numSeqDoc"
                autoComplete="off"
                value={seqDocumentNumber}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setSeqDocumentNumber(e.target.value)}
              />
            </label>

            <label htmlFor="dgtConta">
              Dígito Conta
              <input
                maxLength={2}
                type="text"
                name="dgtConta"
                autoComplete="off"
                value={accountDigitNumber}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setAccountDigitNumber(e.target.value)}
                required
              />
            </label>

            <label htmlFor="numSeqRemessa">
              Núm Seq Remessa
              <input 
                type="text"
                name="numSeqRemessa"
                autoComplete="off"
                value={seqRemitenceNumber}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setSeqRemitenceNumber(e.target.value)}
              />
            </label>

            <label htmlFor="cedConvenio">
              <div>
                Cedente/Convênio&nbsp;&nbsp;
                <FcAbout 
                  className='icons' 
                  title='Preencher o código do cedente ou o número do convênio em caso do Banco do Brasil'
                  style={{minWidth: '20px', minHeight: '20px'}}
                /> 
                <input 
                  type="text"
                  name="cedConvenio"
                  autoComplete="off"
                  value={assignorId}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setAssignorId(e.target.value)}
                  required
                />
              </div>
            </label>

            <label htmlFor="numDiasMulta">
              Número Dias Multa
              <input 
                type="text"
                name="numDiasMulta"
                autoComplete="off"
                value={penaltyLevyDaysNumber}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setPenaltyLevyDaysNumber(e.target.value)}
              />
            </label>

            <label htmlFor="dgtCedente">
              Dígito Cedente
              <input 
                type="text"
                name="dgtCedente"
                autoComplete="off"
                value={assignorDigitId}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setAssignorDigitId(e.target.value)}
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

            <label htmlFor="codCarteira">
              Código Carteira
              <input 
                type="text"
                name="codCarteira"
                autoComplete="off"
                value={bankWalletId}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setBankWalletId(e.target.value)}
                required
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

            <label htmlFor="codTransm">
              Código Transmissão
              <input 
                type="text"
                name="codTransm"
                autoComplete="off"
                value={transmissionId}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setTransmissionId(e.target.value)}
              />
            </label>

            <label htmlFor="diaEnvCobran">
              Dias Envio Cobrança
              <input 
                type="text"
                name="diaEnvCobran"
                autoComplete="off"
                value={shippingLevyDaysNumber}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setShippingLevyDaysNumber(e.target.value)}
              />
            </label>

            <label htmlFor="nomeFaturaPDF">
              Nome Fatura (PDF):
              <input 
                type="text"
                name="nomeFaturaPDF"
                autoComplete="off"
                value={invoiceName}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setInvoiceName(e.target.value)}
              />
            </label>

            <label htmlFor="type" style={{fontSize:'0.675rem'}}>
              Tipo Carteira Envio 
              <select 
                style={{width: '60%', fontSize:'15px'}}
                name="tipoCarteiraEnvio"
                value={typeBankWalletShipping}
                onChange={(e: ChangeEvent<HTMLSelectElement>) => setTypeBankWalletShipping(e.target.value)}
              >
                <option value="237400">Bradesco - Cnab 400</option>
                <option value="341400">Itaú - Cnab 400</option>
                <option value="033400">Santander - Cnab 400</option>
                <option value="001400">Banco do Brasil - Cnab 400</option>
              </select>
            </label>

            <label htmlFor="nomeRemessa">
              Nome Remessa:
              <input 
                type="text"
                name="nomeRemessa"
                autoComplete="off"
                value={remittanceFileName}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setRemittanceFileName(e.target.value)}
              />
            </label>

            <label htmlFor="type" style={{fontSize:'0.675rem'}}>
              Tipo Carteira Retorno 
              <select 
                style={{width: '60%', fontSize:'15px'}}
                name="tipoCarteiraRetorno"
                value={typeBankWalletReturn}
                onChange={(e: ChangeEvent<HTMLSelectElement>) => setTypeBankWalletReturn(e.target.value)}
              >
                <option value="237240">Bradesco - Cnab 400</option>
                <option value="341240">Itaú - Cnab 400</option>
                <option value="033240">Santander - Cnab 400</option>
                <option value="001240">Banco do Brasil - Cnab 400</option>
              </select>
            </label>

            <label htmlFor="msg1">
              Mensagem 1
              <input 
                style={{width: '130%'}}
                type="text"
                name="msg1"
                autoComplete="off"
                value={messageDescription1}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setMessageDescription1(e.target.value)}
              />
            </label>
            <br />
            <label htmlFor="msg2">
              Mensagem 2
              <input 
                style={{width: '130%'}}
                type="text"
                name="msg2"
                autoComplete="off"
                value={messageDescription2}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setMessageDescription2(e.target.value)}
              />
            </label>
            <br />
            <label htmlFor="msg3">
              Mensagem 3
              <input 
                style={{width: '130%'}}
                type="text"
                name="msg3"
                autoComplete="off"
                value={messageDescription3}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setMessageDescription3(e.target.value)}
              />
            </label>
            <br />
            <label htmlFor="msg4">
              Mensagem 4
              <input 
                style={{width: '130%'}}
                type="text"
                name="msg4"
                autoComplete="off"
                value={messageDescription4}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setMessageDescription4(e.target.value)}
              />
            </label>
            <br />
            <label htmlFor="msg5">
              Mensagem 5
              <input 
                style={{width: '130%'}}
                type="text"
                name="msg5"
                autoComplete="off"
                value={messageDescription5}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setMessageDescription5(e.target.value)}
              />
            </label>
            <br />

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

            <div>
            &nbsp;
            </div>

            <div id="BtSvCl" style={{float:'right', marginLeft:'135px'}}>

              <div style={{marginLeft:'10px', float:'left'}}>
                <button className="buttonClick" type="submit">
                  <FiSave />
                  Salvar
                  {isSaving ? <Loader size={5} color="#f19000" /> : null}
                </button>                 
              </div>
                    
              <div style={{float:'left', width:'100px', }}>
                <button 
                  type='button'
                  className="buttonClick"
                  onClick={() => handleClose()}
                  style={{width:'90px'}}
                >
                  <FaRegTimesCircle />
                  Fechar
                </button>
              </div>

            </div>

                                                                                                                              
          </section>
    
        </FormMobile>
      )}
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

export default PaymentSlipContractEdit;
