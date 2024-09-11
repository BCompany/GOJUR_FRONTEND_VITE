/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/interactive-supports-focus */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/control-has-associated-label */
// eslint-disable-next-line jsx-a11y/label-has-associated-control
// eslint-disable-next-line jsx-a11y/interactive-supports-focus
// eslint-disable-next-line jsx-a11y/no-static-element-interactions
import React, { useState, useCallback, useEffect, UIEvent, useRef } from 'react';
import { useHistory } from 'react-router-dom';
import { HeaderPage } from 'components/HeaderPage';
import { useCustomer } from 'context/customer';
import Modal from 'react-modal';
import api from 'services/api';
import { GiReceiveMoney } from 'react-icons/gi';
import Loader from 'react-spinners/PulseLoader';
import LoaderWaiting from 'react-spinners/ClipLoader';
import { ImMenu3, ImMenu4 } from 'react-icons/im';
import { FaWhatsapp, FaFileAlt, FaFolderOpen, FaFilePdf } from 'react-icons/fa';
import { BsFunnel } from 'react-icons/bs';
import { FiEdit, FiFile, FiTrash } from 'react-icons/fi';
import { RiDashboardLine } from 'react-icons/ri';
import { FaUserCircle } from 'react-icons/fa';
import { RiNewspaperFill } from 'react-icons/ri';
import BirthdayModal from 'components/Modals/CustomerModal/BirthdayModal';
import { useAuth } from 'context/AuthContext';
import DocumentModal from 'components/Modals/CustomerModal/DocumentModal';
import CustomerListModal from 'components/Modals/CustomerModal/CustomerListModal';
import CustomerMergeModal from 'components/Modals/CustomerModal/CustomerMergeModal';
import { envProvider } from 'services/hooks/useEnv';
import { useHeader } from 'context/headerContext'
import { useToast } from 'context/toast';
import { useDocument } from 'context/document';
import { useConfirmBox } from 'context/confirmBox';
import ConfirmBoxModal from 'components/ConfirmBoxModal';
import { useMatter } from 'context/matter';
import { useMenuHamburguer } from 'context/menuHamburguer'
import MenuHamburguer from 'components/MenuHamburguer';
import DetailedReportModal from 'components/Modals/CustomerModal/DetailedReportModal';
import { useSecurity } from 'context/securityContext';
import { SecurityModule } from 'context/Interfaces/ISecurity';
import { Overlay } from 'Shared/styles/GlobalStyle';
import { Container, Content, TaskBar, ListCostumer, CostumerCard } from './styles';
import { CustomerCustomInformation, CustomerCustomButtons } from './CustomerCustom';
import { ICustomerData, ICustomInfos } from '../Interfaces/ICustomerList';

Modal.setAppElement('#root');

const CustomerList: React.FC = () => {
  const { signOut } = useAuth();
  const scrollRef = useRef<HTMLDivElement>(null);
  const history = useHistory();
  const {addToast } = useToast();
  const {handleLoadInitialPropsFromDocument } = useDocument();
  const {isMenuOpen, handleIsMenuOpen } = useMenuHamburguer();
  const {handleOpenCustomerDocumentModal, isCustomerListModalOpen, isBirthdayModalOpen, isReportModalOpen, isCustomerMergeModalOpen, isCustomerDocumentModalOpen} = useCustomer();
  const {isConfirmMessage, isCancelMessage, caller, handleCancelMessage,handleConfirmMessage,handleCheckConfirm, handleCaller } = useConfirmBox();
  const {captureText, handleCaptureText, handleLoadingData } = useHeader()
  const {permissionsSecurity, handleValidateSecurity } = useSecurity();
  const [isEndPage, setIsEndPage] = useState<boolean>(false);
  const [isPagination, setIsPagination] = useState(false);
  const [page, setPage] = useState(1);
  const [currentCustomerId, setCurrentCustomerId] = useState<number>(0);
  const [customerList, setCustomerList] = useState<ICustomerData[]>([]);
  const [customerCustomInfos, setCustomerCustomInfos] = useState<ICustomInfos[]>([]);
  const [customerCustomIds, setCustomerCustomIds] = useState<number[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDeletingCustomer, setIsDeletingCustomer] = useState(false);
  const [isInitialize, setIsInitialize] = useState(false)
  const [totalPage, setTotalPage] = useState(0)
  const {handleOpenCardBox, handleMatterReferenceId } = useMatter();
  const [hasCustomization, setHasCustomization] = useState<boolean>(false)
  const [isGeneratingReport, setIsGeneratingReport] = useState<boolean>(false)
  const [idReportGenerate, setIdReportGenerate] = useState<number>(0)
  const token = localStorage.getItem('@GoJur:token');
  const checkpermissionDocument = permissionsSecurity.find(item => item.name === "CFGDCMEM");

  // Call security permission - passing module
  useEffect(() => {
    handleValidateSecurity(SecurityModule.configuration)
    Initialize();
  }, [])

  const Initialize = () => {
    handleValidateSecurity(SecurityModule.customer)
    handleLoadingData(false)
  }

  const LoadCustomer =  async(initialize = false)  => {
    try {
      // api request list customer as Gpjweb does
      const response = await api.get<ICustomerData[]>('/Clientes/Listar', {
        params:{
          page: initialize? 1:page,
          rows: 20,
          filterClause: captureText,
          token,
        }      
      });

      // when is initialize page force pagination = 1
      setPage(initialize? 1: page)

      // total page by main request
      if (!isPagination){
        setTotalPage(response.data.length > 0? response.data[0].count: 0)
      }

      // create new collection with no custom values defined
      const listCustomer = response.data.map(item  =>  {
        return {
          ...item,
          hasCustomValues: false,
        }
      })

      if (!isPagination)
      {
        // verify if exists customer just saved or include
        const customerId = localStorage.getItem('@GoJur:NC');

        if (customerId)
        {
          // remove customer saved from list and append in front of all itens
          const customerSaved = await GetCustomerById(customerId)
          if (customerSaved.length > 0){
            const customerListRefresh = listCustomer.filter(cust => cust.cod_Pessoa !== customerSaved[0].cod_Pessoa);
            setCustomerList([...customerSaved, ...customerListRefresh])
          }
        }
        else{
          setCustomerList(listCustomer);    // append first initialization list normally
        }
      }
      else
      {
        // set customer list paginate append on current list
        const nData = [...customerList, ...response.data]
        setCustomerList(nData)

        // if is a pagination and there is no item finish
        if (listCustomer.length == 0){
          setIsEndPage(true)
          setIsLoadingData(false)
          setIsPagination(false)
        }
      }

      // reset constrols page
      handleLoadingData(false)
      setIsLoadingData(false)
      setIsPagination(false)
      setIsInitialize(false)
      handleIsMenuOpen(false)

      // verify custom component module -> today used by bcompany base 1
      const hasCustomerCustomization = await VerifyCustomizationCompany()
      if (hasCustomerCustomization){
          const customerIds = response.data.map(i => i.cod_Cliente)
          await LoadPlanInformation(customerIds, initialize)
      }

      // remove localstorage filtre and new customer
      localStorage.removeItem('@GoJur:CustomerFilter')
      localStorage.removeItem('@GoJur:NC')

      // reset constrols of matter list card
      handleOpenCardBox(false)
      handleMatterReferenceId(0)

    } catch (err: any) {

      setIsLoadingData(false)
      setIsPagination(false)
      setIsInitialize(false)
      handleLoadingData(false)

      console.log(err)
      if (err.response.data.statusCode == 1002){
        addToast({
          type: 'info',
          title: 'Permissão negada',
          description: 'Seu usuário não tem permissão para acessar esse módulo, contate o administrador do sistema',
        });
        signOut()
      }
    }
  }

  // Verify if exists customization for current company
  const VerifyCustomizationCompany = async () => {
    try {

      const response = await api.post<boolean>('/Customizacoes/Listar', {
        module: 'CUSTOMERLIST',
        token
      });

      setHasCustomization(response.data)

      return response.data;

    } catch (err) {
      console.log(err);
      return false;
    }
  }

  const LoadPlanInformation = async (customerIds: number[], initialize = false) => {
    try {

      if (customerIds.length === 0){
        return;
      }

      const response = await api.post<ICustomInfos[]>(
        '/InformacoesClientes/Listar',
        {
          customerIds,
          token
        },
      )

      // ids customer
      const idsCustom = response.data.map(i => i.customerIdCustom)
      setCustomerCustomIds([...idsCustom, ...customerCustomIds])

      // customer information
      let infoCustom: ICustomInfos[] = []
      if (!initialize){
        infoCustom = [...response.data, ...customerCustomInfos]
      }else{
        infoCustom = response.data
      }

      setCustomerCustomInfos(infoCustom)

    } catch (err) {

      setIsLoadingData(false)

      console.log(err);
    }
  }

  const GetCustomerById = async (customerId: string) => {

    const response = await api.get<ICustomerData[]>('/Clientes/Listar', {
      params:{
        page: 1,
        rows: 1,
        filterClause: `customerId${customerId}`,
        token,
      }   
    });

    return response.data;
  }

  const handleOpenWhatsApp = useCallback(number => {
    const message = 'Olá,';
    window.open(
      `https://web.whatsapp.com/send?phone=+55${number}&text=${message}`,
      '_blank',
    );
  }, []); // inicia a conversa no whatsapp

  // save businessCustomerId to redirect to tab business automatically
  const handleBusinessCustomer = (customerId) => {
    localStorage.setItem('@GoJur:businessCustomerId', customerId.toString())
    const href = `/customer/edit/${customerId.toString()}`
    history.push(href)
  }

  const handleMatterCustomer = (customerId) => {
    localStorage.setItem('@GoJur:matterCustomerId', customerId.toString())
    const href = `/customer/edit/${customerId.toString()}`
    history.push(href)
  }

  const handleDocumentCustomer = (customerId) => {
    localStorage.setItem('@GoJur:documentCustomerId', customerId.toString())
    const href = `/customer/edit/${customerId.toString()}`
    history.push(href)
  }

  const handleCheckBoxDeleteCustomer = (customerId: number) => {
    setIsDeleting(true)
    setCurrentCustomerId(customerId);
  }

  const handleDeleteCustomer = async (customerId: number) => {
    try {

      setIsDeletingCustomer(true)

      // remove from backend
      await api.post('/Clientes/Apagar', {
        id: customerId,
        token,
      });

      const customer = customerList.find(cust => cust.cod_Cliente === customerId);
      if (customer){
        const customerListRefresh = customerList.filter(cust => cust.cod_Cliente !== customerId);
        // customerListRefresh = customerList.filter(cust => cust.nom_Pessoa.toLowerCase() !== customer.nom_Pessoa.toLowerCase());
        setCustomerList(customerListRefresh);
      }

      addToast({
        type: 'success',
        title: 'Cliente Deletado',
        description: 'O cliente selecionado foi deletado do catálogo',
      });

      setIsDeleting(false)
      setIsDeletingCustomer(false)
      setCurrentCustomerId(0)

    } catch (err) {
      addToast({
        type: 'info',
        title: 'Falha ao apagar cliente',
        description: err.response.data.Message
      });

      setIsDeletingCustomer(false)
      setIsDeleting(false)
      setCurrentCustomerId(0)
    }
  }

  const handleScrool = (e: UIEvent<HTMLDivElement>) => {

    const element = e.target as HTMLTextAreaElement;

    if (isEndPage || customerList.length == 0) return;

    const isEndScrool = ((element.scrollHeight - element.scrollTop)-50) <= element.clientHeight

    if (isEndScrool && !isLoadingData) {
      setIsLoadingData(true);
      setIsPagination(true)
    }
  }

  // When is pagination increments page number
  useEffect(() => {

    if (isLoadingData && isPagination){
      setPage(page + 1)
    }

  }, [isPagination])

  useEffect(() => {

    handleCaptureText('')
    handleLoadingData(false)

  }, [permissionsSecurity])

  // render search by term
  useEffect(() => {

    setCustomerList([])
    setCustomerCustomInfos([])
    setIsEndPage(false)
    setIsInitialize(true)
    LoadCustomer(true)

  },[captureText])

  // when page number is than 1 load customer as pagination
  useEffect(() => {

    if (page > 1 && !isInitialize){
      LoadCustomer();
    }

  }, [page])

  useEffect(() => {

    if (isCancelMessage){
      setIsDeleting(false)
      handleCancelMessage(false)
    }
  }, [isCancelMessage])

  useEffect(() => {
    if (isConfirmMessage && caller=="customerList"){

      if (!isDeleting){
        window.open(`${envProvider.redirectUrl}ReactRequest/Redirect?token=${token}&route=customer/list`)
      }
      else{
        handleDeleteCustomer(currentCustomerId)
      }

      setIsDeleting(false)
      handleConfirmMessage(false)
      handleCaller('')
      handleCheckConfirm(false)
    }

  }, [isConfirmMessage])

  // when exists report id verify if is avalaliable every 2 seconds
  useEffect(() => {
    if (idReportGenerate > 0){
      const checkInterval = setInterval(() => {
        CheckReportPending(checkInterval)
      }, 2000);
    }
  },[idReportGenerate])

  // Check is report is already
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
  
      if (response.data == "E"){
        clearInterval(checkInterval);
        setIsGeneratingReport(false)
  
        addToast({
          type: "error",
          title: "Operação não realizada",
          description: "Não foi possível gerar o relatório."
        })
  
      }
    }
  },[isGeneratingReport, idReportGenerate])

  // Open link with report
  const OpenReportAmazon = async() => {

    const response = await api.post(`/ProcessosGOJUR/Editar`, {
      id: idReportGenerate,
      token: localStorage.getItem('@GoJur:token')
    });

    setIdReportGenerate(0)
    window.open(`${response.data.des_Parametro}`, '_blank');
    setIsGeneratingReport(false)
  }

  const handleDetailsCustomer = useCallback(async customerId => {
    try {

      setIsGeneratingReport(true)

      const token = localStorage.getItem('@GoJur:token');
      const response = await api.post('/Clientes/FichaDetalhada', {
        id: customerId,
        token,
      });
      setIdReportGenerate(response.data)

      // handleOpenReportModal()

    } catch (err) {
      setIsGeneratingReport(false)
      console.log(err);
    }
  }, []);

  // accessCodes Permissions
  const showSalesFunnelMenu = permissionsSecurity.find(item => item.name === "CFGSFUNI");
  const showBusinessDashboard = permissionsSecurity.find(item => item.name === "CFGSDASH");

  return (
    <>
      <Container>

        <HeaderPage />

        <TaskBar>

          {/* fixed information list page */}
          <p>
            Total clientes: &nbsp;
            <>{totalPage}</>
          </p>

          <div>

            {showSalesFunnelMenu && (
              <button
                className="buttonLinkClick"
                onClick={() => history.push('/CRM/salesFunnel')}
                title="Clique para visualizar o funil de vendas (CRM)"
                type="submit"
              >
                <BsFunnel />
                Funil de Vendas
              </button>
            )}

            {showBusinessDashboard && (
              <button
                className="buttonLinkClick"
                onClick={() => history.push('/CRM/Dashboard')}
                title="Clique para visualizar o DashBoard do CRM"
                type="submit"
              >
                <RiDashboardLine />
                DashBoard
              </button>
            )}

            <button
              className="buttonLinkClick"
              onClick={() => history.push('/customer/edit/0')}
              title="Clique para incluir um novo cliente"
              type="submit"
            >
              <FaFileAlt />
              Incluir novo cliente
            </button>

            <button id="options" type="button" onClick={() => handleIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <ImMenu4 /> : <ImMenu3 />}
            </button>

          </div>

          {/* When is open hanburguer menu */}
          {isMenuOpen ? (

            <MenuHamburguer name='customerOptions' />

          ) : null}

        </TaskBar>

        <Content onScroll={handleScrool} ref={scrollRef} id='customerList'>

          <ListCostumer onClick={() => handleIsMenuOpen(false)}>

            { customerList.map(customer => (

              <CostumerCard key={customer.cod_Cliente}>

                {/* header buttons for each card customer */}
                <header>

                  {(isDeleting && customer.cod_Cliente === currentCustomerId) && (
                    <span>
                      <Loader size={8} color="var(--blue-twitter)" />
                    </span>
                  )}

                  <button
                    type="button"
                    title="Editar"
                    onClick={() => history.push(`/customer/edit/${customer.cod_Cliente}`)}
                  >
                    <FiEdit />
                  </button>

                  <button
                    type="button"
                    title="Processo"
                    onClick={() => handleMatterCustomer(customer.cod_Cliente)}
                  >
                    <FaFolderOpen />
                  </button>

                  {showSalesFunnelMenu && (
                    <button
                      type="button"
                      title="Negócios"
                      onClick={() => handleBusinessCustomer(customer.cod_Cliente)}
                    >
                      <GiReceiveMoney />
                    </button>
                  )}

                  <button
                    type="button"
                    title="Anexar Documentos"
                    onClick={() => handleDocumentCustomer(customer.cod_Cliente)}
                  >
                    <FaFilePdf />
                  </button>

                  <button
                    type="button"
                    title="Ficha Detalhada"
                    onClick={() => handleDetailsCustomer(customer.cod_Cliente)}
                  >
                    <FiFile />
                  </button>

                  {checkpermissionDocument && (
                    <button
                      type="button"
                      title="Emitir Documento"
                      onClick={() => {
                        handleOpenCustomerDocumentModal();
                        handleLoadInitialPropsFromDocument(customer.cod_Pessoa);
                      }}
                    >
                      <RiNewspaperFill />
                    </button>
                  )}

                  <button
                    type="button"
                    title="Excluir"
                    onClick={() => handleCheckBoxDeleteCustomer(customer.cod_Cliente)}
                  >
                    <FiTrash />
                  </button>

                  {/* Render buttons custom */}
                  {hasCustomization && (
                  <CustomerCustomButtons
                    customer={customer}
                    customObject={customerCustomInfos}
                  />
                )}
                </header>

                {/* customer common information */}
                <div>

                  <section>

                    <article>
                      <>
                        <b>
                          {customer.nom_Pessoa}
                          {' '}
                          <span>
                            (
                            {customer.cod_Cliente}
                            )
                            {' '}
                          </span>
                          {customer.flg_Status == 'A' && <span>Ativo</span> }
                          {customer.flg_Status == 'I' && <span style={{color:'var(--red)'}}>Inativo</span> }
                        </b>
                      </>
                      <p>
                        {customer.nom_PessoaFantasia}
                      </p>
                    </article>

                    <article>
                      <p style={{ display: 'flex' }}>
                        <b>Telefone:</b>
                        {customer.num_Telefone01}
                        <br />
                        {customer.num_Telefone02}
                      </p>
                    </article>

                  </section>

                  <section>

                    <article>
                      <p id="mail">{customer.des_Email}</p>
                    </article>

                    <article>
                      <p>
                        <b>Grupo:</b>
                        {customer.des_GrupoCliente}
                      </p>
                    </article>
                  </section>

                  <section>

                    <article>
                      {customer.cod_Senha !== null && (
                      <p>
                        <b>Senha:</b>
                        {customer.cod_Senha}
                      </p>
                            )}
                    </article>

                    <article id="whats">
                      <p>
                        <b>Whatsapp:</b>
                        {customer.num_WhatsApp}
                      </p>
                      {customer.num_WhatsApp !== null && (
                      <button
                        type="button"
                        style={{cursor: "pointer"}}
                        onClick={() => handleOpenWhatsApp(customer.num_WhatsApp)}
                        title="Clique aqui para enviar mensagem para o WhatsApp do seu cliente"
                      >
                        <FaWhatsapp />
                      </button>
                            )}
                    </article>

                  </section>

                </div>

                {/* Render fields custom */}

                {hasCustomization && (
                  <CustomerCustomInformation
                    customer={customer}
                    customObject={customerCustomInfos}
                  />
                )}

              </CostumerCard>

            ))}

          </ListCostumer>

          {/* show message whem there is no customer find */}
          { (customerList.length == 0 && !isLoadingData && captureText.length > 0 && !isInitialize) && (
            <div className='messageEmpty'>
              <FaUserCircle />
              {' '}
              Nenhum cliente foi encontrado com o termo:
              {' '}
              <br />
              <b>{captureText}</b>
            </div>
          )}

          {/* show message when is loading more customer by pagination */}
          { (isPagination) && (
            <div className='paginationPage'>
              {/* Aguarde - carregando mais clientes */}
              <Loader size="0.5rem" color="var(--blue-twitter)" />
            </div>
          )}

        </Content>

      </Container>

      {/* report components - open modals */}
      {isBirthdayModalOpen && <BirthdayModal />}
      {isCustomerListModalOpen && <CustomerListModal />}
      {isCustomerMergeModalOpen && <CustomerMergeModal />}
      {isCustomerDocumentModalOpen && <DocumentModal />}

      {isDeleting && (

        <ConfirmBoxModal
          title="Deletar Registro"
          useCheckBoxConfirm
          caller="customerList"
          message="Confirma a exclusão deste cliente ?"
        />

      )}

      {isReportModalOpen && <DetailedReportModal />}

      {isDeletingCustomer && (
        <>
          <Overlay />
          <div className='waitingMessage'>
            <LoaderWaiting size={15} color="var(--blue-twitter)" />
            &nbsp;&nbsp; Deletando Cliente...
          </div>
        </>
      )}

      {(isLoadingData && !isPagination) && (
        <>
          <Overlay />
          <div className='waitingMessage'>
            <LoaderWaiting size={15} color="var(--blue-twitter)" />
            &nbsp;&nbsp; Aguarde...
          </div>
        </>
      )}

      {isGeneratingReport && (
        <>
          <Overlay />
          <div className='waitingMessage'>
            <LoaderWaiting size={15} color="var(--blue-twitter)" />
            &nbsp;&nbsp; Gerando Relatório...
          </div>
        </>
      )}

    </>
  );
}

export default CustomerList;
