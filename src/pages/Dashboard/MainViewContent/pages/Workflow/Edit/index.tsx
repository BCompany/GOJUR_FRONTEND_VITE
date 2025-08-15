/* eslint-disable array-callback-return */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable radix */
import React, {ChangeEvent, useCallback, useEffect , useRef, useState, UIEvent} from 'react'
import {useHistory, useLocation  } from 'react-router-dom'
import { useForm } from 'react-hook-form';
import { FiLock, FiPlus, FiSave, FiTrash } from 'react-icons/fi';
import { FiPlusCircle, FiXCircle } from "react-icons/fi";
import { RiCloseLine, RiNewspaperFill } from 'react-icons/ri';
import { MdBlock } from 'react-icons/md';
import { formatField, selectStyles, useDelay, currencyConfig} from 'Shared/utils/commonFunctions';
import { useDefaultSettings } from 'context/defaultSettings';
import { useToast } from 'context/toast';
import { Clear, Tab, Tabs } from 'Shared/styles/Tabs';
import api from 'services/api';
import { useMatter } from 'context/matter';
import Select from 'react-select'
import { useSecurity } from 'context/securityContext';
import { SecurityModule } from 'context/Interfaces/ISecurity';
import { useModal } from 'context/modal';
import { useDocument } from 'context/document';
import DocumentModal from 'components/Modals/CustomerModal/DocumentModal';
import { useCustomer } from 'context/customer';
import { Card, Container, Content, Form, ListCards, CardMatter, MatterListCards} from './styles';
import { IWorkflowTriggers, IWorkflowData} from '../Interfaces/IWorkflowEdit';
import { workflowTriggerTypes } from 'Shared/utils/commonListValues';
import ConfirmBoxModal from 'components/ConfirmBoxModal';
import { useConfirmBox } from 'context/confirmBox';
import { trigger } from 'swr';

export default function Workflow() {

  const history = useHistory();
  const formRef = useRef<HTMLFormElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { handleUserPermission, permission} = useDefaultSettings();
  const {permissionsSecurity, handleValidateSecurity } = useSecurity();
  const { addToast } = useToast();
  const { pathname  } = useLocation();
  const { handleSubmit} = useForm<IWorkflowData>();
  const { handleReloadBusinesCard, reloadBusinessCard } = useCustomer();
  const [showSalesFunnelMenu, setShowSalesFunnelMenu] = useState<boolean>(true)
  const { showSalesChannelModal } = useModal();
  const [isLoading , setIsLoading] = useState(true); // objecto todo de do cliente
  const [isPagination , setIsPagination] = useState(false); // objecto todo de do cliente
  const [workflow , setWorkflow] = useState({} as IWorkflowData); // objecto todo de do cliente
  const [workflowTrigger , setWorkflowTrigger] = useState<IWorkflowTriggers[]>([]); // objeto de endereço que compoe o cliente
  const [customerLegalPerson , setCustomerLegalPerson] = useState<ICustomerLegalPerson[]>([]); // objeto de representante que compoe o cliente
  const [customerCitysDefault , setCustomerCitysDefault] = useState<ISelectData[]>([]); // count field for address block
  const [customerCitys , setCustomerCitys] = useState<ISelectData[]>([]); // count field for address block
  const [customerCitysLP , setCustomerCitysLP] = useState<ISelectData[]>([]); // count field for address block
  const [customerGroup , setCustomerGroup] = useState<ISelectData[]>([]); // count field for address block
  const [salesChannelList , setSalesChannelList] = useState<ISelectData[]>([]); // count field for address block
  const [workflowName , setWorkflowName] = useState(''); // field nome
  const [customerFantasia , setCustomerFantasia] = useState(''); // field nome fantasia
  const [customerEmail , setCustomerEmail] = useState(''); // field e-mail
  const [customerSenha , setCustomerSenha] = useState(''); // field senha
  const [customerRef , setCustomerRef] = useState(''); // field Referencia
  const [customerWhatsapp , setCustomerWhatsapp] = useState(''); // field whatsapp
  const [customerGroupValue , setCustomerGroupValue] = useState(''); // group field value
  const [customerGroupId , setCustomerGroupId] = useState(''); // group field id
  const [customerSalesChannelId , setCustomerSalesChannelId] = useState(''); // group field id
  const [customerType , setCustomerType] = useState('F'); //  field type
  const [customerRepresent , setCustomerRepresent] = useState(''); //  field Representado
  const [customerNumDoc , setCustomerNumDoc] = useState(''); //  field num doc
  const [customerSex , setCustomerSex] = useState('F'); //  field Sexo
  const [customerNacionalidade , setCustomerNacionalidade] = useState(''); //  field nacionalidade
  const [customerNasc , setCustomerNasc] = useState(''); //  field Nascimento
  const [customerAbertura , setCustomerAbertura] = useState(''); //  field Abertura
  const [customerRg , setCustomerRg] = useState(''); //  field Rg
  const [customerPis , setCustomerPis] = useState(''); //  field Pis
  const [customerECivil , setCustomerECivil] = useState('I'); //  field estado civil
  const [customerMae , setCustomerMae] = useState(''); //  field mae
  const [customerProf , setCustomerProf] = useState(''); //  field profissao
  const [customerPai , setCustomerPai] = useState(''); //  field pai
  const [customerInss , setCustomerInss] = useState(''); //  field Inss
  const [customerCtps , setCustomerCtps] = useState(''); //  field Ctps
  const [customerSCtps , setCustomerSCtps] = useState(''); //  field Serie Ctps
  const [customerSalary , setCustomerSalary] = useState<number>(); //  field Salário
  const [customerIE , setCustomerIE] = useState(''); //  field numero insc estadual
  const [groupSearchTerm , setGroupSearchTerm] = useState('');
  const [salesChannelSearchTerm , setSalesChannelSearchTerm] = useState('');
  const [customerObs , setCustomerObs] = useState(''); //  field observação
  const [customerStatus , setCustomerStatus] = useState('A'); //  field customerStatus
  const [customerEmailFinanAdd , setCustomerEmailFinanAdd] = useState<string>(''); //  field email de faturamento add
  const [customerCityValue , setCustomerCityValue] = useState(''); //  field city
  const [isSaving , setisSaving] = useState<boolean>(); // set trigger for show loader
  const [isDeleting , setIsDeleting] = useState<boolean>(); // set trigger for show loader
  const [customerActivePassword , setCustomerActivePassword] = useState(false); //  field email de faturamento
  const [customerActiveModalDoubleCheck , setCustomerActiveModalDoubleCheck] = useState(false); //  modal double check
  const [matterList , setMatterList] = useState<IMatterData[]>([]);
  const [businessList , setBusinessList] = useState<IBusinessData[]>([]);
  const {isOpenCardBox, matterReferenceId } = useMatter();
  const [hasMatter, setHasMatter] = useState<boolean>(false);
  const [isLoadingComboData, setIsLoadingComboData] = useState<boolean>(false);
  const [isInitialize, setIsInitialize] = useState<boolean>(true);
  const [searchTermBusinnes, setSearchTermBusiness] = useState<string>('');
  const [isLoadingSearchTerm, setIsLoadingSearchTerm] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [customerStartDate, setCustomerStartDate] = useState<string>('')
  const [currentCustomerId, setCurrentCustomerId] = useState<number>(0);
  const [permissionCRM, setPermissionCRM] = useState<boolean>(false)
  const [businessTotal, setBusinessTotal] = useState<number>(0)
  const [tabsControl, setTabsControl] = useState<ITabsControl>({tab1: true, tab2: false, tab3: false, tab4: false, activeTab: 'customer'});
  const [changeCEPCustomer, setChangeCEPCustomer] = useState<boolean>(false)
  const [changeCEPLP, setChangeCEPLP] = useState<boolean>(false)
  const [isGeneratingReport, setIsGeneratingReport] = useState<boolean>(false)
  const [idReportGenerate, setIdReportGenerate] = useState<number>(0)
  const {handleLoadInitialPropsFromDocument } = useDocument();
  const {handleOpenCustomerDocumentModal, handleOpenReportModal, handleCloseReportModal, isReportModalOpen} = useCustomer();
  const token = localStorage.getItem('@GoJur:token');
  const companyId = localStorage.getItem('@GoJur:companyId');
  const apiKey = localStorage.getItem('@GoJur:apiKey');
  const checkpermissionDocument = permissionsSecurity.find(item => item.name === "CFGDCMEM");
  const [confirmDeleteModal, setConfirmDeleteModal] = useState<boolean>(false);
  const {isConfirmMessage, isCancelMessage, caller, handleCancelMessage,handleConfirmMessage,handleCheckConfirm, handleCaller } = useConfirmBox();
  const [currentWorkflowId, setCurrentWorkflowId] = useState<number>(0);
  const [isDeletingTrigger, setIsDeletingTrigger] = useState(false);
  const [painelAberto, setPainelAberto] = useState<number | null>(null);

  // Initialization
  useEffect (() => {
    //handleValidateSecurity(SecurityModule.configuration)
    LoadWorkflow()
  },[])

  // Insert new sales chanel and update combo


  const LoadWorkflow = async () => {

    let workflowId = pathname.substr(15)
    let hasFilterSaved = false;
    const filterStorage = localStorage.getItem('@GoJur:CustomerFilter')

    // verify if exists filter saved
    if (Number.isNaN(Number(workflowId))){
      if (filterStorage == null) {
        return false;
      }
      // if exists filter exists associate to specific variables and rebuild page
      const filterJSON = JSON.parse(filterStorage)
      workflowId = filterJSON.workflowId;
      hasFilterSaved = true;
    }

    // when is id
    if (Number(workflowId) === 0){
      handleNewTrigger();
      return;
    }

 
    try {

      const response = await api.get<IWorkflowData[]>('/Workflow/Selecionar', {
        params:{
          id: Number(workflowId),
          token
        }
      })
    
      setWorkflow(response.data)

      setWorkflowName(response.data.name);
     

      if(response.data.triggers.length < 1) {
        const id = Math.random()

        const newTrigger: IWorkflowTriggers = {
          workflowTriggerId: id,
          companyId,
          workflowId: 0,
          triggerType: 'data',
          configuration: { label: "" }
        }

        setWorkflowTrigger(oldState => [...oldState, newTrigger])

      }
      else{
        setWorkflowTrigger(response.data.triggers)
      }

      
      setIsLoading(false)
      setIsInitialize(false)

      
      } catch (err) {
        setIsLoading(false)
        history.push('/workflow/list')
        console.log(err)
      }
  }



const handleSubmitWorkflow = useCallback(async () => {
  // Valida apenas gatilhos do tipo "data"
  const isValid = workflowTrigger.every(t => {
    if (t.triggerType === "data") {
      return Boolean(t.configuration?.label?.trim());
    }
    return true; // outros tipos não precisam de label
  });

  if (!isValid) {
    addToast({
      type: "error",
      title: "Erro de validação",
      description: "Gatilhos do tipo 'data' precisam ter um label preenchido."
    });
    return;
  }

  // Se passou na validação, prossegue
  const triggerList = workflowTrigger.map(i => ({
    ...i,
    // cod_Endereco: 0
  }));

  
    try {
      const response = await api.put('/Workflow/Salvar', {
        token,
        apiKey,
        workflowId: workflow.workflowId  ? workflow.workflowId : 0, // cod Workflow
        name: workflowName, // nome do Workflow
        companyId, // Cod Empresa   
        triggers: triggerList // Listagem de gatilhos
      })

      addToast({
        type: "success",
        title: "Workflow salvo",
        description: workflow.workflowId ? "As alterações feitas no workflow foram salvas" : "Workflow adicionado"
      })


      history.push('/workflow/list')

    } catch (err: any) {

      // eslint-disable-next-line no-alert
      if(err.response.data.statusCode !== 500) {

        addToast({
          type: "error",
          title: "Falha ao cadastrar workflow",
          description:  err.response.data.Message
        })
      }

      if(err.response.data.statusCode === 1011) {
       setCustomerActiveModalDoubleCheck(true)
      }

      setisSaving(false)
      localStorage.removeItem('@GoJur:businessCustomerId')
    }

  },[workflowTrigger, workflow.name, workflow.tpo_Telefone01, workflow.num_Telefone01, workflow.tpo_Telefone02, workflow.num_Telefone02, workflow.cod_PessoaFisica, workflow.cod_Cliente, workflow.cod_PessoaJuridica, workflow.cod_SistemaUsuarioEmpresa, workflow.doubleCheck, workflow.cod_Empresa, workflowName, addToast, history]);




  const handleNewTrigger = useCallback(() => {
 
    const id = Math.random()
    const newAddress: IWorkflowTriggers = {
      workflowTriggerId: id,
      companyId,
      workflowId: 0,
      triggerType: 'data',
      configuration: { label: "" }
    }

    setWorkflowTrigger(oldAddress => [...oldAddress, newAddress])
  },[]); // adiciona um novo endereço na interface



  const handleDeleteTrigger = useCallback((triggerId) => {
      const address = workflowTrigger.filter(item => item.workflowTriggerId !== triggerId);
      if(address.length >=1) {
        setWorkflowTrigger(address)
      }else{
        addToast({
          type:"info",
          title: "Operação invalida",
          description: "Só é possivel excluir quando há mais de um gatilho cadastrado"
        })
      }
  },[addToast, workflowTrigger]); // remove um endereço da interface



  const handleChangeTriggerType = useCallback((value, triggerId) => {

    const newTypePhone = workflowTrigger.map(trigger => trigger.workflowTriggerId=== triggerId ? {
      ...trigger,
      triggerType: value,
      configuration: {
            ...trigger.configuration,
            label: ""
          }
    }: trigger)

    setWorkflowTrigger(newTypePhone)

  },[workflowTrigger]); // atualiza o tipo de telefone 1



const handleChangeTrigger = useCallback((value: string, triggerId: number) => {
  const newPhone = workflowTrigger.map(trigger =>
    trigger.workflowTriggerId === triggerId
      ? {
          ...trigger,
          configuration: {
            ...trigger.configuration,
            label: trigger.triggerType === "acaoconcluida" ? "" : value
          }
        }
      : trigger
  );

  setWorkflowTrigger(newPhone);
}, [workflowTrigger]);


 
 
  // pagination for load more customer
  const handleScroolSeeMore = (e: UIEvent<HTMLDivElement>) => {
    const element = e.target as HTMLTextAreaElement;

    const isEndScrool = ((element.scrollHeight - element.scrollTop)-50) <= element.clientHeight

    if (isEndScrool && !isLoading) {
      setIsPagination(true)
    }
  }

  
    useEffect(() => {
  
      if (isConfirmMessage && caller=="WorkflowList"){
  
        if (!isDeleting){
          window.open(`${envProvider.redirectUrl}ReactRequest/Redirect?token=${token}&route=workflow/list`)
        }
        else{
          handleDeleteWorkflowGatilho(currentWorkflowId)
        }
  
        setIsDeleting(false)
        handleConfirmMessage(false)
        handleCaller('')
        handleCheckConfirm(false)
      }
  
    }, [isConfirmMessage])


     const handleDeleteWorkflowGatilho = async (workflowtriggerId: number) => {
      try {
        setIsDeletingTrigger(true)
     
        await api.delete('/Workflow/DeletarGatilho', { params:{
          id: workflowtriggerId,
          token
        }})
  
        handleDeleteTrigger(workflowtriggerId)

        addToast({
          type: 'success',
          title: 'Gatilho Deletado',
          description: 'O gatilho selecionado foi deletado',
        });
  
        setIsDeleting(false)
        setIsDeletingTrigger(false)
        setCurrentWorkflowId(0)
  
      } catch (err) {
        addToast({
          type: 'info',
          title: 'Falha ao apagar Gatilho',
          description: err.response.data.Message
        });
  
        handleDeleteTrigger(workflowtriggerId)

        setIsDeletingTrigger(false)
        setIsDeleting(false)
        setCurrentWorkflowId(0)
      }
    }


  useEffect(() => {
    if (isCancelMessage){
      setIsDeleting(false)
      handleCancelMessage(false)
    }
  }, [isCancelMessage])


  const handleCheckBoxDeleteCustomer = (workflowId: number) => {
    setIsDeleting(true)
    setCurrentWorkflowId(workflowId);
  }

const abrirPainel = (id: number) => {
  setPainelAberto(prev => (prev === id ? null : id)); // alterna abrir/fechar
};

  return (
    <Container>

      <Content onScroll={handleScroolSeeMore} ref={scrollRef}>

        <Tabs>

          <div>
            
            <button
              type='button'
              onClick={() => history.push('/workflow/list')}
            >
              <RiCloseLine />
              Fechar
            </button>

          </div>

          {/* CUSTOMER TAB */}
          <Tab active={tabsControl.tab1}>

            <Form ref={formRef} onSubmit={handleSubmit(handleSubmitWorkflow)}>

              <section id="dados">

                <label htmlFor="name" className="required">
                  Nome Workflow*
                  <input
                    type="text"
                    value={workflowName}
                    autoComplete="off"
                    name="nome"
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setWorkflowName(e.target.value)}
                    required
                    maxLength={100}
                  />
                </label>

              </section>

              <br /><br /><br /> <br />

              <label htmlFor="endereco" style={{marginTop:'-55px'}}>
                <p>Gatilho(s)</p>
                {workflowTrigger.map(trigger => (

                  <section id="endereco" key={trigger.workflowTriggerId}>

                   
                    <label htmlFor="telefone" id="contact">
                     
                      <Select
                        isSearchable
                        id="contactSelect"
                        styles={selectStyles}
                        value={workflowTriggerTypes.filter(options => options.id === trigger.triggerType)}
                        onChange={(item) => handleChangeTriggerType(item?.id, trigger.workflowTriggerId)}
                        options={workflowTriggerTypes}
                        isDisabled={true}
                        placeholder="Selecione"
                      />
                      <input
                        type="text"
                        autoComplete="off"
                        value={trigger.configuration?.label || ""}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => handleChangeTrigger(e.target.value, trigger.workflowTriggerId)}
                        maxLength={30}
                      />
                    </label>

                    <div>
                     {/* 
                      <button type="button" className='buttonLinkClick' onClick={() => handleDeleteTrigger(trigger.workflowTriggerId)}>
                     */}    
                      <button type="button" className='buttonLinkClick' onClick={() => handleCheckBoxDeleteCustomer(trigger.workflowTriggerId)}>
                        <FiTrash />
                        Apagar este gatilho
                      </button>

                      <button
                        type="button"
                        className="buttonLinkClick"
                        onClick={() => abrirPainel(trigger.workflowTriggerId as number)}
                      >
                        {painelAberto === trigger.workflowTriggerId ? (
                          <>
                            <FiXCircle />
                            Fechar ações
                          </>
                        ) : (
                          <>
                            <FiPlusCircle />
                            Incluir ação
                          </>
                        )}
                      </button>
          
                    </div>


{/* Painel de ações */}
      {painelAberto === trigger.workflowTriggerId && (
          <div
              style={{
                marginTop: "8px",
                padding: "16px",
                borderRadius: "12px",
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
                transition: "all 0.3s ease",
              }}
            >
          <label htmlFor="telefone" id="contact">
            <Select
              isSearchable
              id="contactSelect"
              styles={selectStyles}
              value={workflowTriggerTypes.filter(options => options.id === trigger.triggerType)}
              onChange={(item) => handleChangeTriggerType(item?.id, trigger.workflowTriggerId)}
              options={workflowTriggerTypes}
              isDisabled={true}
              placeholder="Selecione"
            />
            <input
              type="text"
              autoComplete="off"
              value={trigger.configuration?.label || ""}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                handleChangeTrigger(e.target.value, trigger.workflowTriggerId)
              }
              maxLength={30}
            />
          </label>
        </div>
      )}

                  </section>

                 ))}

              </label>

              <button type="button" className='buttonLinkClick' id="addEnd" onClick={handleNewTrigger}>
                <FiPlus />
                Incluir outro gatilho
              </button>


              <footer>

                <div>
                  <button className="buttonClick" type="submit">
                    <FiSave />
                    Salvar
                  </button>

          
                  <button className="buttonClick" type="button" onClick={() => history.push('/workflow/list')}>
                    <MdBlock />
                    Fechar
                  </button>

                </div>

              </footer>

            </Form>

          </Tab>


        </Tabs>

   
      </Content>

      
    {isDeleting && (
        
                <ConfirmBoxModal
                  title="Excluir Registro"
                  caller="WorkflowList"
                  message="Confirma a exclusão deste workflow ?"
                />
        
        )}
        

    </Container>
  );


};

