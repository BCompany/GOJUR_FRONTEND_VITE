/* eslint-disable array-callback-return */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable no-return-assign */
/* eslint-disable radix */

import React, { useState, useEffect, useCallback, UIEvent, useRef  } from 'react';
import api from 'services/api';
import { useHeader } from 'context/headerContext'
import { useHistory } from 'react-router-dom';
import { Overlay } from 'Shared/styles/GlobalStyle';
import { ImMenu3, ImMenu4 } from 'react-icons/im';
import LoaderWaiting from 'react-spinners/ClipLoader';
import { useMenuHamburguer } from 'context/menuHamburguer'
import { useToast } from 'context/toast';
import ConfirmBoxModal from 'components/ConfirmBoxModal';
import { useConfirmBox } from 'context/confirmBox';
import MenuHamburguer from 'components/MenuHamburguer';
import { format } from 'date-fns';
import { FaFileAlt, FaFileContract, FaFileInvoiceDollar, FaRegEdit } from 'react-icons/fa';
import { AiOutlineArrowLeft, AiOutlineMail, AiOutlinePrinter } from 'react-icons/ai';
import { HeaderPage } from 'components/HeaderPage';
import BillingInvoiceParameterModal from '../ParameterModal'
import BillingInvoiceDocumentModal from '../BillingInvoiceDocumentModal';
import ShippingFileModal from '../ShippingFileModal'
import { IlistInstallments, IBillingInvoiceListData, IEmailOptions } from '../../../Interfaces/IBIllingContract'
import BillingInvoiceEmailModal from '../BillingInvoiceEmailModal'
import { Container, Content, Form, BillingInvoiceItem, TollBar, TaskBar, OverlayModal} from './styles';


const BillingInvoiceList = () => {
  const history = useHistory();
  const { addToast } = useToast();
  const {isMenuOpen, handleIsMenuOpen, isOpenMenuConfig} = useMenuHamburguer();
  const token = localStorage.getItem('@GoJur:token');
  const [isEndPage, setIsEndPage] = useState(false);
  const [pageNumber, setPageNumber] = useState(1);
  const {captureText, handleLoadingData} = useHeader();
  const [totalPageCount, setTotalPageCount] = useState<number>(0);
  const [lastPage , setLastPage] = useState<number>(1)
  const [isLoading, setIsLoading]= useState<boolean>(false);
  const [isPagination, setIsPagination] = useState(false);
  const [billingInvoiceList, setBillingInvoiceList] = useState<IBillingInvoiceListData[]>([])
  const [billingInvoiceId, setBillingInvoiceId] = useState<string>("")
  const [showBillingInvoiceDocumentModal, setShowBillingInvoiceDocumentModal] = useState<boolean>(false);
  const [showBillingInvoiceEmailModal, setShowBillingInvoiceEmailModal] = useState<boolean>(false);
  const [isLoadingPage , setIsLoadingPage] = useState<boolean>(false)
  const [openSendEmailModal, setOpenSendEmailModal] = useState(false);
  const [confirmSendEmail, setConfirmSendEmail] = useState(false);
  const {isConfirmMessage, isCancelMessage, handleCancelMessage, handleConfirmMessage, caller, handleCaller } = useConfirmBox();
  const [isSendEmail, setIsSendEmail] = useState<boolean>(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setBillingInvoiceList([])
    LoadBillingInvoice('initialize')

  },[captureText])

  useEffect(() => {

    if (isLoadingPage && isPagination){
      setPageNumber(pageNumber + 1)
    }

  }, [isPagination,isLoadingPage])

  useEffect(() => {

    if (pageNumber > 1 && isPagination){
      LoadBillingInvoice();
    }

  }, [pageNumber])

  useEffect(() => {

    if (isCancelMessage){
  
      if (caller === 'confirmOpenSendEmailModal')
      {
        setOpenSendEmailModal(false)
        handleCancelMessage(false)
        setBillingInvoiceId("")
      }
    }
  
  },[isCancelMessage, caller]);

  useEffect(() => {

    if(isConfirmMessage)
    {
      if (caller === 'confirmOpenSendEmailModal')
      {
        setConfirmSendEmail(true)
      }     
    }
  },[isConfirmMessage, caller]);

  useEffect(() => {

    if(confirmSendEmail)
    {  
      setConfirmSendEmail(false)
      setOpenSendEmailModal(false)
      handleCaller("")
      handleConfirmMessage(false)
      EmailOptions(billingInvoiceId)
    }
  },[confirmSendEmail]);

  const LoadBillingInvoice = useCallback(async(state = '') => {
  
    if (isEndPage && state != 'initialize'){
      return;
    }
    setIsLoading(true)

    const page = state == 'initialize'? 1: pageNumber;

    const response = await api.get<IBillingInvoiceListData[]>('/Financeiro/Faturamento/ListarFaturas', { 
      params:{  
        page,
        rows: 20,
        filterClause: captureText,
        token
      }
    })

     // first page result - when change betwwen matter types pass initialize params to reset pagination, filter etc
     if (!isPagination || state === 'initialize'){
      setBillingInvoiceList(response.data)
      setTotalPageCount(0)
      if (response.data.length > 0)
        setTotalPageCount(response.data[0].count)
    }
    else
    {
      setBillingInvoiceList([...billingInvoiceList, ...response.data])  // second or > page result -> append old results with new
      if (response.data.length == 0){
        setIsEndPage(true)
      }
    }

    handleLoadingData(false)
    setIsLoadingPage(false)
    setIsLoading(false)
    setIsPagination(false)

  }, [pageNumber, captureText, isPagination, lastPage, billingInvoiceList])


  const EmailOptions = useCallback(async(cod_Fatura: string) => {
    setIsLoading(true)

    setBillingInvoiceId(cod_Fatura)
    try {
   
      const response = await api.get<IEmailOptions>('/Financeiro/Faturamento/EnviarEmailOpcoes', {
        params:{
          billingInvoiceId: cod_Fatura,
          token
        }
      })

      if(response.data.invoiceHasSlipGenerated == true && response.data.listInstallments.length > 1){
        openEmailModal()
        setIsLoading(false)
      }
      else {
        SendEmail(response.data.listInstallments)
        setIsLoading(false)
      }
      
         
    } catch (err: any) {
      setIsLoading(false)
      console.log(err)
    }
  },[billingInvoiceId]);

  const SendEmail = useCallback(async(listInstallments: IlistInstallments[]) => {

    let slipsSelected = '';
    listInstallments.map((item) => {
      return slipsSelected += `${item.cod_faturaParcela},`;
    })

    try {

      setIsSendEmail(true)

      await api.post('/Financeiro/Faturamento/EnviarEmail', {  
        billingInvoiceId,
        slipsSelected,
        token
      })
 
      addToast({
        type: "success",
        title: "E-mail Enviado",
        description: "O e-mail foi enviado com sucesso."
      })

      setIsSendEmail(false)
      CloseBillingInvoiceEmailModal()

         
    } catch (err: any) {
      setIsSendEmail(false)
      addToast({
        type: "error",
        title: "Falha ao enviar e-mail.",
        description:  err.response.data.Message
      })
    }
  },[billingInvoiceId]);

  const handleEditBillingInvoice = (billingInvoiceId: string) => {
    history.push(`/financeiro/billinginvoice/edit/${billingInvoiceId}`)
  };

  const handleNewBillingInvoice = () => {
    history.push(`/financeiro/billinginvoice/edit/0`)
  };

  const handleClickDocument = (billingInvoiceId: string) => {
    localStorage.setItem('@GoJur:documentLocation', 'billingInvoiceList');
    setShowBillingInvoiceDocumentModal(true)
    setBillingInvoiceId(billingInvoiceId)
  };

  const openEmailModal = () => {
    setShowBillingInvoiceEmailModal(true)
  };

  const CloseBillingInvoiceDocumentModal = () => {
    setShowBillingInvoiceDocumentModal(false)
  }

  const CloseBillingInvoiceEmailModal = () => {
    setShowBillingInvoiceEmailModal(false)
  }

  const handleClickSendEmail = (cod_Fatura: string) => {
    setOpenSendEmailModal(true)
    setBillingInvoiceId(cod_Fatura)
  }

  const handleClickReturn = () => {
    history.push(`/financeiro`)
  }

  const handleScrool = (e: UIEvent<HTMLDivElement>) => {

    const element = e.target as HTMLTextAreaElement;

    if (isEndPage || billingInvoiceList.length == 0) return;

    const isEndScrool = ((element.scrollHeight - element.scrollTop)-10) <= element.clientHeight

    if (isEndScrool && !isLoadingPage) {
      setIsLoadingPage(true)
      setIsPagination(true)
    }
  }

  return (

    <Container onScroll={handleScrool} ref={scrollRef}>
      {isOpenMenuConfig && <BillingInvoiceParameterModal />}
      {isOpenMenuConfig && <ShippingFileModal />}

      {(showBillingInvoiceDocumentModal) && <OverlayModal /> }
      {(showBillingInvoiceDocumentModal) && <BillingInvoiceDocumentModal callbackFunction={{ cod_Fatura: billingInvoiceId, CloseBillingInvoiceDocumentModal}} /> }

      {(showBillingInvoiceEmailModal) && <Overlay /> }
      {(showBillingInvoiceEmailModal) && <BillingInvoiceEmailModal callbackFunction={{billingInvoiceId, CloseBillingInvoiceEmailModal}} /> }

      {openSendEmailModal && (
        <ConfirmBoxModal
          caller="confirmOpenSendEmailModal"
          title="Faturamento - Faturas"
          message="Confirma o envio desta fatura por email para todos os emails definidos no cliente e/ou no contrato financeiro ?"
        />
      )}
      
   
      {isLoading && (
        <>
          <Overlay />
          <div className='waitingMessage'>   
            <LoaderWaiting size={15} color="var(--blue-twitter)" /> 
            &nbsp;&nbsp;
            Carregando ...
          </div>
        </>
    )}

      {isSendEmail && (
        <>
          <Overlay />
          <div className='waitingMessage'>   
            <LoaderWaiting size={15} color="var(--blue-twitter)" /> 
            &nbsp;&nbsp;
            Enviando E-Mail ...
          </div>
        </>
      )}

      <div style={{marginLeft:"-2%"}}>
        <HeaderPage />
      </div>

      <TaskBar>

        <div>
          <div>
            <button
              className="buttonLinkClick buttonInclude"
              title="Clique para voltar a tela de financeiro"
              type="submit"
              onClick={handleClickReturn}
            >
              <AiOutlineArrowLeft />
              <span>Retornar</span>

            </button>
          </div>

          <div>
            <button
              className="buttonLinkClick buttonInclude"
              title="Clique para incluir uma nova fatura"
              type="submit"
              onClick={handleNewBillingInvoice}
            >
              <FaFileAlt />
              <span>Incluir Fatura</span>

            </button>
          </div>
          
        </div>

           
        <TollBar>

          <div className='total'>
            Nº de Faturas:&nbsp;
            {totalPageCount}
          </div>

          <div>
            <button id="options" type="button" onClick={() => handleIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <ImMenu4 /> : <ImMenu3 />}
            </button>

            {/* When is open hanburguer menu */}
            {isMenuOpen ? (              
              <MenuHamburguer name='BillingInvoice' />            
            ) : null}
          </div>
        </TollBar>
      </TaskBar>
      
      
      <Content>

        <header>

          <div style={{display:"flex"}}>

            <div>      
              <button
                type='button'
                onClick={() => history.push(`/financeiro/billingcontract/list`)}  
              >
                <div className='Desactive' style={{display:"flex"}}>
                  <FaFileContract style={{width:"22px", height:"22px"}} />
                  <p style={{marginLeft:"5px", marginTop:"5px", marginBottom:"auto"}}>Contratos</p> 
                </div>
                
                
              </button>

            </div>
            
            <div style={{marginLeft:"1%"}}>
              
              <button
                type='button'
                onClick={console.log}
              >  

                <div className='Active' style={{display:"flex"}}>
                  <FaFileInvoiceDollar style={{width:"22px", height:"22px"}} />
                  <p style={{marginLeft:"5px", marginTop:"5px", marginBottom:"auto"}}>Faturamento</p> 
                </div> 

                
              </button>
            </div>
            
          </div>

        </header>

        <Form>

          <section>

            {billingInvoiceList.map((item) => {
              return(

                <BillingInvoiceItem>
                  <header>
                    {item.nom_Pessoa}
                  </header>

                  <div>

                    <div className='billingContractDetailsLeft'>
                      <div style={{marginTop:"1%"}}>
                        Nº Fatura:
                        {' '}
                        <span>
                          {item.num_Sequencia}
                        </span>
                      </div>

                      <div style={{marginTop:"2%"}}>
                        Cliente:
                        {' '}
                        <span>
                          {item.nom_Pessoa}
                        </span>
                      </div>

                      <div style={{marginTop:"2%"}}>
                        Status Fatura:
                        {' '}
                        {item.tpo_StatusFinanceiro == "C" && (
                          <span style={{color:"red"}}>
                            {item.des_StatusFinanceiro}
                          </span>
                        )}
                        {item.tpo_StatusFinanceiro != "C" && (
                        <span>
                          {item.des_StatusFinanceiro}
                        </span>
                        )}
                      </div>

                      <div style={{marginTop:"2%"}}>
                        Vencimento:
                        {' '}
                        <span>
                          {item.dta_PrimeiroVencimento && (
                            <>
                              {format(new Date(item.dta_PrimeiroVencimento), 'dd/MM/yyyy')}
                            </>
                          )}
                        </span>
                      </div>

                      <div style={{marginTop:"2%"}}>
                        Resumo dos Serviços:
                        {' '}
                        <span>
                          {item.des_DescricaoServicos}
                        </span>
                      </div>

                    </div>

                    <div className='billingContractDetailsRight'>

                      <div style={{marginTop:"2%"}}>
                        Valor: R$:
                        {' '}
                        <span>
                          {item.vlr_Fatura}
                        </span>
                      </div>

                      <div style={{marginTop:"4%"}}>
                        Pagamento:
                        {' '}
                        {item.tpo_StatusLiquidacao == "P" && (
                          <span>
                            Pendente
                          </span>
                        )}
                        {item.tpo_StatusLiquidacao == "L" && (
                          <span>
                            Liquidado
                          </span>
                        )}                      
                      </div>

                      <div style={{marginTop:"4%"}}>
                        Forma Pagamento:
                        {" "}
                        <span>
                          {item.des_FormaPagamento}
                        </span>         
                      </div>

                      <div style={{marginTop:"4%"}}>
                        Carteira Cob.:
                        {' '}
                        <span>                        
                          {item.des_CarteiraCobranca}                       
                        </span>
                      </div>

                    </div>
                    
                    <div className="matterMenu">

                      <div className="menu">

                        <div>

                          <section>

                            <p onClick={(e) => (handleEditBillingInvoice(item.cod_Fatura))}>
                              <FaRegEdit />
                              <span>Editar</span>                             
                            </p>

                            <p onClick={() => handleClickDocument(item.cod_Fatura)}>
                              <AiOutlinePrinter />
                              <span>Emitir Fatura</span>
                            </p>

                            <p onClick={() => handleClickSendEmail(item.cod_Fatura)}>
                              <AiOutlineMail />
                              <span>Enviar E-mail</span>
                            </p>

                          </section>

                        </div>

                      </div>

                    </div>

                  </div>

                </BillingInvoiceItem>
              )
              })}

          </section>

        </Form>

      </Content>
      
        
    </Container>
    
  
  );
};

export default BillingInvoiceList;
