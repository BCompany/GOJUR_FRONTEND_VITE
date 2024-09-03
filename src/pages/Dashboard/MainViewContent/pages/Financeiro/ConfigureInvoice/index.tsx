/* eslint-disable radix *//* eslint-disable array-callback-return */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable radix */
/* eslint-disable no-console */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable no-return-assign */
/* eslint-disable no-alert */

import React, { ChangeEvent, useState, useEffect, useCallback } from 'react'
import api from 'services/api'
import { BiSave } from 'react-icons/bi'
import { BsClipboardData } from "react-icons/bs";
import { FaCheck, FaRegEye, FaRegFileImage, FaRegTimesCircle } from 'react-icons/fa';
import { MdCloudUpload } from "react-icons/md";
import { Overlay } from 'Shared/styles/GlobalStyle';
import LoaderWaiting from 'react-spinners/ClipLoader';
import { useToast } from 'context/toast'
import { useHistory } from 'react-router-dom'
import { HeaderPage } from 'components/HeaderPage';
import { Container, Content, InvoiceHeader, InvoiceHeaderImage, InsertImage, InvoiceHeaderText, CircleLine, Circle, Buttons } from './styles'

export interface ICompanyData{
  companyId: number;
  companyName: string;
  companyType: string;
  des_Email: string;
  num_Telefone: string;
  num_CPF_CNJP: string;
  num_CEP: string;
  des_Endereco: string;
  des_Bairro: string;
  cod_Municipio: string;
  nom_Municipio: string;
}

const ConfigureInvoice: React.FC = () => {
  // #region STATES
  const token = localStorage.getItem('@GoJur:token')
  const { addToast } = useToast()
  const history = useHistory()
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [isSaving, setIsSaving] = useState<boolean>(false)
  const [hasMark, setHasMark] = useState<string>('S')
  const [imageBackground, setImageBackground] = useState('#EEEEEE')
  const [textBackground, setTextBackground] = useState('#FFFFFF')
  const [fontColor, setFontColor] = useState('#000000')
  const [hasImage, setHasImage] = useState<string>("N")
  const [imageLink, setImageLink] = useState<string>("")
  
  const [idReportGenerate, setIdReportGenerate] = useState<number>(0)
  const [isGeneratingReport, setIsGeneratingReport] = useState<boolean>(false)

  const [companyName, setCompanyName] = useState<string>("")
  const [numTelefone, setNumTelefone] = useState<string>("")
  const [desEmail, setDesEmail] = useState<string>("")
  const [documentNumber, setDocumentNumber] = useState<string>("")
  const [cep, setCep] = useState('')
  const [bairro, setBairro] = useState('')
  const [endereco, setEndereco] = useState('')
  const [municipioDesc, setMunicipioDesc] = useState('')

  const [checkCircle01, setCheckCircle01] = useState<boolean>(false)
  const [checkCircle02, setCheckCircle02] = useState<boolean>(false)
  const [checkCircle03, setCheckCircle03] = useState<boolean>(false)
  const [checkCircle04, setCheckCircle04] = useState<boolean>(false)
  const [checkCircle05, setCheckCircle05] = useState<boolean>(false)
  const [checkCircle06, setCheckCircle06] = useState<boolean>(false)
  const [checkCircle07, setCheckCircle07] = useState<boolean>(false)
  const [checkCircle08, setCheckCircle08] = useState<boolean>(false)
  const [checkCircle09, setCheckCircle09] = useState<boolean>(false)
  const [checkCircle10, setCheckCircle10] = useState<boolean>(false)
  const [checkCircle11, setCheckCircle11] = useState<boolean>(false)
  const [checkCircle12, setCheckCircle12] = useState<boolean>(false)
  // #endregion


  useEffect(() => {
    LoadCompanyInformation()
  }, [])


  useEffect(() => {
    if (idReportGenerate > 0){
      const checkInterval = setInterval(() => {
        CheckReportPending(checkInterval)
      }, 2000);
    }
  }, [idReportGenerate])


  const CheckReportPending = useCallback(async (checkInterval) => {
    if (isGeneratingReport){
      const response = await api.post(`/ProcessosGOJUR/VerificarStatus`, {
        id: idReportGenerate,
        token: localStorage.getItem('@GoJur:token')
      })

      if (response.data == "F" && isGeneratingReport){
        clearInterval(checkInterval);
        setIsGeneratingReport(false)
        OpenReportAmazon()
      }
    }
  }, [isGeneratingReport, idReportGenerate])


  const OpenReportAmazon = async() => {
    const response = await api.post(`/ProcessosGOJUR/Editar`, {
      id: idReportGenerate,
      token: localStorage.getItem('@GoJur:token')
    });

    setIdReportGenerate(0)
    window.open(`${response.data.des_Parametro}`, '_blank');
    setIsGeneratingReport(false)
  }


  const LoadCompanyInformation = async () => {
    try {
      setIsLoading(true);

      const response = await api.get<ICompanyData>('/Empresa/InformacoesDaEmpresa', {params: {token}})

      setCompanyName(response.data.companyName)
      setDesEmail(response.data.des_Email)
      setNumTelefone(response.data.num_Telefone)
      setDocumentNumber(response.data.num_CPF_CNJP)
      setCep(response.data.num_CEP)
      setBairro(response.data.des_Bairro)
      setEndereco(response.data.des_Endereco)
      setMunicipioDesc(response.data.nom_Municipio)

      LoadBillingInvoiceModel()

      setIsLoading(false);
    }
    catch (err:any) {
      setIsLoading(false)
      addToast({type: "error", title: "Operação não realizada", description: err.response.data.Message})
    }
  }


  const LoadBillingInvoiceModel = async () => {
    try {
      setIsLoading(true);

      const response = await api.get('/Financeiro/Faturamento/EditarModeloFatura', {params: {token}})

      setHasMark(response.data.hasMark)
      setHasImage(response.data.hasImage)
      setImageLink(response.data.imageLink)
      setImageBackground(response.data.imageBackground)
      setTextBackground(response.data.textBackground)

      setIsLoading(false);
    }
    catch (err:any) {
      setIsLoading(false)
      addToast({type: "error", title: "Operação não realizada", description: err.response.data.Message})
    }
  }


  const RadioButtonClick = (e, option:string) => {
    setHasMark(option)
  }


  const CheckCircle = async (item:string) => {
    await CheckAllToFalse()
    
    if(item == "#0030B9"){
      setCheckCircle01(true)
      setTextBackground(item)
      setImageBackground("#001074")
      setFontColor("#FFFFFF")
    }
    if(item == "#FFFFFF"){
      setCheckCircle02(true)
      setTextBackground(item)
      setImageBackground("#EEEEEE")
      setFontColor("#000000")
    }
    if(item == "#1DA9DA"){
      setCheckCircle03(true)
      setTextBackground(item)
      setImageBackground("#007AB4")
      setFontColor("#FFFFFF")
    }
    if(item == "#FF4E7A"){
      setCheckCircle04(true)
      setTextBackground(item)
      setImageBackground("#D62B5D")
      setFontColor("#FFFFFF")
    }
    if(item == "#EEEEEE"){
      setCheckCircle05(true)
      setTextBackground(item)
      setImageBackground("#FFFFFF")
      setFontColor("#000000")
    }
    if(item == "#00D071"){
      setCheckCircle06(true)
      setTextBackground(item)
      setImageBackground("#00B865")
      setFontColor("#FFFFFF")
    }
    if(item == "#C5381A"){
      setCheckCircle07(true)
      setTextBackground(item)
      setImageBackground("#AB3116")
      setFontColor("#FFFFFF")
    }
    if(item == "#FF9A0A"){
      setCheckCircle08(true)
      setTextBackground(item)
      setImageBackground("#E68A09")
      setFontColor("#FFFFFF")
    }
    if(item == "#FFD33F"){
      setCheckCircle09(true)
      setTextBackground(item)
      setImageBackground("#e6BD39")
      setFontColor("#000000")
    }
    if(item == "#8D72CF"){
      setCheckCircle10(true)
      setTextBackground(item)
      setImageBackground("#735DA8")
      setFontColor("#FFFFFF")
    }
    if(item == "#B0B0B0"){
      setCheckCircle11(true)
      setTextBackground(item)
      setImageBackground("#969696")
      setFontColor("#FFFFFF")
    }
    if(item == "#333333"){
      setCheckCircle12(true)
      setTextBackground(item)
      setImageBackground("#000000")
      setFontColor("#FFFFFF")
    }
  }


  const CheckAllToFalse = () => {
    setCheckCircle01(false)
    setCheckCircle02(false)
    setCheckCircle03(false)
    setCheckCircle04(false)
    setCheckCircle05(false)
    setCheckCircle06(false)
    setCheckCircle07(false)
    setCheckCircle08(false)
    setCheckCircle09(false)
    setCheckCircle10(false)
    setCheckCircle11(false)
    setCheckCircle12(false)
  }


  const Generate = useCallback ( async() => {
    try{
      setIsGeneratingReport(true)
      // Save('')

      const response = await api.get('/Financeiro/Faturamento/GerarFaturaModeloPDF', {params: {token}})

      setIdReportGenerate(response.data)


      setIsLoading(false)
    }
    catch(err:any){
      setIsGeneratingReport(false)
      addToast({type: "error", title: "Falha ao gerar modelo de fatura.", description: err.response.data.Message})
    }
  }, [])


  const Save = useCallback ( async(caller:string) => {
    try{
      if(caller == "save")
        setIsSaving(true)
      
      const response = await api.post('/Financeiro/Faturamento/SalvarModeloFatura', {
        hasMark,
        hasImage,
        imageLink,
        imageBackground,
        textBackground,
        token
      })

      if(caller == "save"){
        addToast({type: "success", title: "Operação realizada com sucesso.", description: "O modelo de fatura foi salvo no sistema."})
        setIsSaving(false)
      }
    }
    catch(err:any){
      setIsSaving(false)
      addToast({type: "error", title: "Falha ao salvar modelo de fatura.", description: err.response.data.Message})
    }
  }, [hasMark, hasImage, imageLink, imageBackground, textBackground])


  const onFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      await UploadImage(file, e.target.files[0].name)
    }
  }


  const UploadImage = async (image: any, fileName: string) => {
    try{
      setIsLoading(true)

      const payload = {token: token, fileName: fileName}
      const file = new File([image], image)

      const headerImage = new FormData()
      headerImage.append('headerImage', file)
      headerImage.append('payload',  JSON.stringify(payload))  
      
      const response = await api.post('/Financeiro/Faturamento/UploadImagemModelo', headerImage)

      setImageLink(response.data)
      setHasImage("S")
      setIsLoading(false)
    }
    catch (err:any) {
      setIsLoading(false)
      addToast({type: "error", title: "Falha ao carregar imagem.", description: err.response.data.Message})
    }
  }


  const ChangeImage = () => {
    setHasImage("N")
    setImageLink("")
  }


  const ChangeCompanyInformation = () => {
    localStorage.setItem('@GoJur:ConfigureInvoice', 'configureInvoice')
    history.push('/companyinformation')
  }


  return (
    <Container id='Container' onContextMenu={(e) => e.preventDefault()}>
      <HeaderPage />

      <Content id='Content'>
        <header style={{fontSize:"18px", fontWeight:500}}>Configurar Fatura</header>
        <br />

        <div className="chartToolBar" style={{marginTop:'-10px'}}>
          <input type="radio" checked={hasMark === 'S'} onClick={(e) => RadioButtonClick(e, 'S')}  />
          {' '}
          <span style={{fontSize:'16px'}}>Com Logo</span>
          &nbsp;&nbsp;&nbsp;&nbsp;
          <input type="radio" checked={hasMark === 'N'} onClick={(e) => RadioButtonClick(e, 'N')}  />
          {' '}
          <span style={{fontSize:'16px'}}>Sem Logo</span>
        </div>
        
        <InvoiceHeader id='InvoiceHeader'>
          {hasMark == 'S' && (
            <InvoiceHeaderImage id='InvoiceHeaderImage' style={{backgroundColor:(imageBackground)}}>
              {hasImage == 'S' ? (
                <>
                  <img src={imageLink} alt="logo" style={{maxHeight:'180px', maxWidth:'180px'}} />
                </>
              ) : (
                <>
                  <InsertImage>
                    <label htmlFor="upload">
                      <MdCloudUpload />
                      <br />
                      Inserir imagem
                    </label>
                    <input id="upload" type="file" style={{display:'none'}} accept="image/*" onChange={onFileChange} />
                  </InsertImage>
                </>
              )}

            </InvoiceHeaderImage>
          )}

          <InvoiceHeaderText id='InvoiceHeaderText' style={{backgroundColor:(textBackground), width:(hasMark == "N" ? '100%' : '80%')}}>
            <p>&nbsp;</p>
            <p style={{fontSize:'18px', fontWeight:500, color:(fontColor)}}>{companyName}</p>
            <p style={{fontSize:'18px', fontWeight:500, color:(fontColor)}}>{documentNumber}</p>
            <p>&nbsp;</p>
            <p style={{color:(fontColor)}}>{desEmail}</p>
            <p style={{color:(fontColor)}}>{numTelefone}</p>
            <p style={{color:(fontColor)}}>{endereco}</p>
            <p style={{color:(fontColor)}}>{cep}</p>
            <p style={{color:(fontColor)}}>{bairro} - {municipioDesc}</p>
            <p>&nbsp;</p>
          </InvoiceHeaderText>
        </InvoiceHeader>
        <br />

        <CircleLine id='CircleLine1'>
          <Circle style={{backgroundColor:'#0030B9'}} onClick={() => CheckCircle("#0030B9")}>{checkCircle01 && <FaCheck className='checkWhite' />}</Circle>
          <Circle style={{backgroundColor:'#FFFFFF'}} onClick={() => CheckCircle("#FFFFFF")}>{checkCircle02 && <FaCheck className='checkBlack' />}</Circle>
          <Circle style={{backgroundColor:'#1DA9DA'}} onClick={() => CheckCircle("#1DA9DA")}>{checkCircle03 && <FaCheck className='checkWhite' />}</Circle>
          <Circle style={{backgroundColor:'#FF4E7A'}} onClick={() => CheckCircle("#FF4E7A")}>{checkCircle04 && <FaCheck className='checkWhite' />}</Circle>
          <Circle style={{backgroundColor:'#EEEEEE'}} onClick={() => CheckCircle("#EEEEEE")}>{checkCircle05 && <FaCheck className='checkBlack' />}</Circle>
          <Circle style={{backgroundColor:'#00D071'}} onClick={() => CheckCircle("#00D071")}>{checkCircle06 && <FaCheck className='checkWhite' />}</Circle>
        </CircleLine>

        <CircleLine id='CircleLine2'>
          <Circle style={{backgroundColor:'#C5381A'}} onClick={() => CheckCircle("#C5381A")}>{checkCircle07 && <FaCheck className='checkWhite' />}</Circle>
          <Circle style={{backgroundColor:'#FF9A0A'}} onClick={() => CheckCircle("#FF9A0A")}>{checkCircle08 && <FaCheck className='checkWhite' />}</Circle>
          <Circle style={{backgroundColor:'#FFD33F'}} onClick={() => CheckCircle("#FFD33F")}>{checkCircle09 && <FaCheck className='checkBlack' />}</Circle>
          <Circle style={{backgroundColor:'#8D72CF'}} onClick={() => CheckCircle("#8D72CF")}>{checkCircle10 && <FaCheck className='checkWhite' />}</Circle>
          <Circle style={{backgroundColor:'#B0B0B0'}} onClick={() => CheckCircle("#B0B0B0")}>{checkCircle11 && <FaCheck className='checkWhite' />}</Circle>
          <Circle style={{backgroundColor:'#333333'}} onClick={() => CheckCircle("#333333")}>{checkCircle12 && <FaCheck className='checkWhite' />}</Circle>
        </CircleLine>
        <br />

        <Buttons id='Buttons'>
          {hasImage == "S" && (
            <button className="buttonClick" type='button' onClick={()=> ChangeImage()}>
              <FaRegFileImage />
              Trocar Imagem
            </button>
          )}
          
          <button className="buttonClick" type='button' onClick={() => ChangeCompanyInformation()}>
            <BsClipboardData />
            Dados Empresa
          </button>
          
          <button className="buttonClick" type='button' onClick={()=> Generate()}>
            <FaRegEye />
            Visualizar Fatura
          </button>
          
          <button className="buttonClick" type='button' onClick={()=> Save('save')}>
            <BiSave />
            Salvar Modelo
          </button>

          <button className="buttonClick" type='button' onClick={()=> history.push(`/financeiro`)}>
            <FaRegTimesCircle />
            Fechar
          </button>
        </Buttons>
      </Content>
      
      {isLoading && (
        <>
          <Overlay />
          <div className='waitingMessage'>
            <LoaderWaiting size={15} color="var(--blue-twitter)" />
            &nbsp;&nbsp; Carregando...
          </div>
        </>
      )}

      {isSaving && (
        <>
          <Overlay />
          <div className='waitingMessage'>
            <LoaderWaiting size={15} color="var(--blue-twitter)" />
            &nbsp;&nbsp; Salvando...
          </div>
        </>
      )}

      {isGeneratingReport && (
        <>
          <Overlay />
          <div className='waitingMessage'>
            <LoaderWaiting size={15} color="var(--blue-twitter)" />
            &nbsp;&nbsp; Gerando fatura...
          </div>
        </>
      )}

    </Container>
  )
}

export default ConfigureInvoice;