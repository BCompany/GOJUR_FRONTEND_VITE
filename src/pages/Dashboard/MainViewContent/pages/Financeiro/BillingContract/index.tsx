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
import LoaderWaiting from 'react-spinners/ClipLoader';
import { useMenuHamburguer } from 'context/menuHamburguer'
import { format } from 'date-fns';
import { FaFileAlt, FaFileContract, FaFileInvoiceDollar, FaRegEdit } from 'react-icons/fa';
import { AiOutlineArrowLeft, AiOutlinePrinter } from 'react-icons/ai';
import { HeaderPage } from 'components/HeaderPage';
import BillingContractDocumentModal from './BIllingContractDocumentModal';
import { Container, Content, Form, BillingContractItem, TollBar, TaskBar} from './styles';
import { IBillingContractListData } from '../../Interfaces/IBIllingContract'

const BillingContractList: React.FC = () => {
  const history = useHistory();
  const [isEndPage, setIsEndPage] = useState(false);
  const [pageNumber, setPageNumber] = useState(1);
  const {captureText, handleLoadingData} = useHeader();
  const [totalPageCount, setTotalPageCount] = useState<number>(0);
  const [lastPage , setLastPage] = useState<number>(1)
  const [isLoading, setIsLoading]= useState<boolean>(false);
  const [isPagination, setIsPagination] = useState(false);
  const [billingContractId, setBillingContractId] = useState<string>("")
  const [showBillingContractDocumentModal, setShowBillingContractDocumentModal] = useState<boolean>(false);
  const [billingContractList, setBillingContractList] = useState<IBillingContractListData[]>([])
  const [isLoadingPage , setIsLoadingPage] = useState<boolean>(false)
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setBillingContractList([])
    LoadBillingContract('initialize')

  },[captureText])

  useEffect(() => {

    if (isLoadingPage && isPagination){
      setPageNumber(pageNumber + 1)
    }

  }, [isPagination,isLoadingPage])

  useEffect(() => {

    if (pageNumber > 1 && isPagination){
      LoadBillingContract();
    }

  }, [pageNumber])

  const LoadBillingContract = useCallback(async(state = '') => {
  
    if (isEndPage && state != 'initialize'){
      return;
    }
    setIsLoading(true)

    const token = localStorage.getItem('@GoJur:token');
    const page = state == 'initialize'? 1: pageNumber;

    const response = await api.get<IBillingContractListData[]>('/Financeiro/Contratos/ListarContratos', { 
      params:{  
        page,
        rows: 20,
        filterClause: captureText,
        token
      }
    })

     // first page result - when change betwwen matter types pass initialize params to reset pagination, filter etc
     if (!isPagination || state === 'initialize'){
      setBillingContractList(response.data)
      setTotalPageCount(0)
      if (response.data.length > 0)
        setTotalPageCount(response.data[0].count)
    }
    else
    {
      setBillingContractList([...billingContractList, ...response.data])      // second or > page result -> append old results with new
      if (response.data.length == 0){
        setIsEndPage(true)
      }
    }

    handleLoadingData(false)
    setIsLoadingPage(false)
    setIsLoading(false)
    setIsPagination(false)

  }, [pageNumber, captureText, isPagination, lastPage, billingContractList])

  const handleEditBillingContract = (billingContractId: string) => {
    history.push(`/financeiro/billingcontract/edit/${billingContractId}`)
  };

  const handleNewBillingContract = () => {
    history.push(`/financeiro/billingcontract/edit/0`)
  };

  const CloseBillingContractDocumentModal = () => {
    setShowBillingContractDocumentModal(false)
  }

  const handleClickDocument = (billingContractId: string) => {
    localStorage.setItem('@GoJur:documentLocation', 'billingContractList');
    setShowBillingContractDocumentModal(true)
    setBillingContractId(billingContractId)
  };

  const handleClickReturn = () => {
    history.push(`/financeiro`)
  }

  const handleScrool = (e: UIEvent<HTMLDivElement>) => {

    const element = e.target as HTMLTextAreaElement;

    if (isEndPage || billingContractList.length == 0) return;

    const isEndScrool = ((element.scrollHeight - element.scrollTop)-10) <= element.clientHeight

    if (isEndScrool && !isLoadingPage) {
      setIsLoadingPage(true)
      setIsPagination(true)
    }
  }

  return (

    <Container onScroll={handleScrool} ref={scrollRef}>

      {(showBillingContractDocumentModal) && <Overlay /> }
      {(showBillingContractDocumentModal) && <BillingContractDocumentModal callbackFunction={{billingContractId, CloseBillingContractDocumentModal}} /> }

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
              title="Clique para incluir um novo contrato"
              type="submit"
              onClick={handleNewBillingContract}
            >
              <FaFileAlt />
              <span>Incluir Contrato</span>

            </button>
          </div>
          
        </div>

           
        <TollBar>

          <div className='total'>
            Nº de Contratos:&nbsp;
            {totalPageCount}
          </div>

        </TollBar>
      </TaskBar>
      
      
      <Content>

        <header>

          <div style={{display:"flex"}}>

            <div>      
              <button
                type='button'
                onClick={console.log}
              >
                <div className='Active' style={{display:"flex"}}>
                  <FaFileContract style={{width:"22px", height:"22px"}} />
                  <p style={{marginLeft:"5px", marginTop:"5px", marginBottom:"auto"}}>Contratos</p> 
                </div>
                
                
              </button>

            </div>
            
            <div style={{marginLeft:"1%"}}>
              
              <button
                type='button'
                onClick={() => history.push(`/financeiro/billinginvoice/list`)}  
              >  

                <div className='Desactive' style={{display:"flex"}}>
                  <FaFileInvoiceDollar style={{width:"22px", height:"22px"}} />
                  <p style={{marginLeft:"5px", marginTop:"5px", marginBottom:"auto"}}>Faturamento</p> 
                </div> 

                
              </button>
            </div>
            
          </div>

        </header>

        <Form>

          <section>

            {billingContractList.map((item) => {
              return(

                <BillingContractItem>
                  <header>
                    {item.nom_Pessoa}
                  </header>

                  <div>

                    <div className='billingContractDetailsLeft'>
                      <div style={{marginTop:"1%"}}>
                        Nº Contrato:
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
                        Status Contrato:
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
                          {item.vlr_TotalContrato}
                        </span>
                      </div>

                      <div style={{marginTop:"4%"}}>
                        Pagamento:
                        {' '}
                        {item.tpo_Pagamento == "U" && (
                          <span>
                            Único
                          </span>
                        )}
                        {item.tpo_Pagamento == "R" && (
                          <span>
                            Recorrente
                          </span>
                        )}
                        {item.tpo_Pagamento == "P" && (
                          <span>
                            Parcelado
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
                        Inicio:
                        {' '}
                        <span>
                          {item.dta_Inicio && (
                            <>
                              {format(new Date(item.dta_Inicio), 'dd/MM/yyyy')}
                            </>
                          )}
                        </span>
                      </div>

                    </div>
                    
                    <div className="matterMenu">

                      <div className="menu">

                        <div>

                          <section>

                            <p onClick={(e) => handleEditBillingContract(item.cod_ContratoFinanceiro)}>
                              <FaRegEdit />
                              <span>Editar</span>                             
                            </p>

                            <p onClick={() => handleClickDocument(item.cod_ContratoFinanceiro)}>
                              <AiOutlinePrinter />
                              <span>Emitir Contrato</span>
                            </p>

                          </section>

                        </div>

                      </div>

                    </div>

                  </div>

                </BillingContractItem>
              )
              })}

          </section>

        </Form>

      </Content>
      
        
    </Container>
    
  
  );
};

export default BillingContractList;
