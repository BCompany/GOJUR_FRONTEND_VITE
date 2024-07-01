/* eslint-disable react/jsx-curly-newline */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable eqeqeq */
/* eslint-disable react/void-dom-elements-no-children */
/* eslint-disable jsx-a11y/control-has-associated-label */
import { useCustomer } from 'context/customer';
import { useToast } from 'context/toast';
import Modal from 'react-modal'
import { FiSave } from 'react-icons/fi';
import { FaRegTimesCircle } from 'react-icons/fa';
import { FiX } from 'react-icons/fi';
import Select from 'react-select'
import React, { useEffect, useState, useRef } from 'react';
import api from 'services/api';
import { useForm } from 'react-hook-form';
import { AutoCompleteSelect } from 'Shared/styles/GlobalStyle';
import { ICustomerData } from 'pages/Dashboard/MainViewContent/pages/Customer/Interfaces/ICustomerList';
import ConfirmBoxModal from 'components/ConfirmBoxModal';
import { useConfirmBox } from 'context/confirmBox';
import { selectStyles } from 'Shared/utils/commonFunctions';
import Loader from 'react-spinners/PulseLoader';
import { loadingMessage, noOptionsMessage } from 'Shared/utils/commonConfig';
import { Container, CustomerMergeForm } from './style';

interface SelectData {
    id: string;
    label: string;
  }

export default function CustomerMergeModal() {

  const { handleSubmit} = useForm();
  const formRef = useRef<HTMLFormElement>(null);
  const {isCustomerMergeModalOpen, handleCloseCustomerMergeModal } = useCustomer();
  const {addToast } = useToast();
  const [customerList , setCustomerList] = useState<SelectData[]>([]);
  const [isLoadingComboData, setIsLoadingComboData] = useState<boolean>(false);
  const [customerSearchTerm , setCustomerSearchTerm] = useState('');
  const [customerIdPrincipal , setCustomerIdPrincipal] = useState('');
  const [customerIdToMerge , setCustomerIdToMerge] = useState('');
  const [isGeneratingMerge, setIsGeneratingMerge] = useState<boolean>(false);
  const {isConfirmMessage, isCancelMessage, handleCancelMessage, handleConfirmMessage, handleCaller, caller, handleCheckConfirm } = useConfirmBox();
  
  useEffect(() => {
    LoadCustomer()
    changeText("Iniciar")
    changeButtonWidth(150)
    setIsGeneratingMerge(false)
  },[isCustomerMergeModalOpen]);

  useEffect(() => {
    if(isCancelMessage == true)
    {
      setIsGeneratingMerge(false)
    }
  },[isCancelMessage]);

  useEffect(() => {
    if(isConfirmMessage && caller == "customerMerge")
    {
      executeMerge('1', 'start')
      changeText("Executando processo " ) 
      changeButtonWidth(250)
      handleCancelMessage(true)
    }
  },[isConfirmMessage]);

  const LoadCustomer = async (stateValue?: string) => {
    try {
      const tokenapi = localStorage.getItem('@GoJur:token');

      const filter = stateValue == 'reset'? '': customerSearchTerm
      setIsLoadingComboData(true)

      const response = await api.post<ICustomerData[]>('/Clientes/ListarPorEmpresa', {
        filterClause: filter,
        token: tokenapi,
      });

      const listSelectData: SelectData[] = []; //
    
      response.data.map((item) => {
        listSelectData.push({
          id: item.cod_Cliente.toString(), 
          label:item.nom_Pessoa
        })

        return listSelectData
      })

      setCustomerList(listSelectData)
      setIsLoadingComboData(false)

    } catch (err) {
      console.log(err);
    }
  }

  const executeMerge = async(currentStep: string, stepStatus: string) => {
    try {

      changeButtonWidth(250)

      const token = localStorage.getItem('@GoJur:token');
      
      const response = await api.post('/Clientes/Mesclar ', {
  
        customerIdPrincipal,
        customerIdToMerge,
        currentStep,
        stepStatus,
        token
      })

      if (response.data.currentStep == 1 && response.data.stepStatus == 'processing'){
        executeMerge('1', 'processing')
      }
      else if (response.data.currentStep == 1 && response.data.stepStatus == 'finished'){
        changeText("Executando financeiro")
        executeMerge('2', 'start')
      }
      else if (response.data.currentStep == 2 && response.data.stepStatus == 'finished'){
        changeText("Executando negócios")
        executeMerge('3', 'start')
      }
      else if (response.data.currentStep == 3 && response.data.stepStatus == 'finished'){
        addToast({
          type: "success",
          title: "Clientes mesclados",
          description: "Os clientes foram mesclados"
        })
        
        changeText("Iniciar")
        handleCloseCustomerMergeModal()
        window.location.reload();
      }
      
    } catch (err:any) {
      changeText("Iniciar")
      setIsGeneratingMerge(false)
      handleConfirmMessage(false)
      handleCancelMessage(false)
      addToast({
        type: "info",
        title: "Falha ao mesclar clientes.",
        description:  err.response.data.Message
      })
    }
  };

  const handleLoadCustomersPrincipal = (item: any) => {
    if (item){
      setCustomerIdPrincipal(item.id)
    }else{
      setCustomerIdPrincipal('')
      LoadCustomer('')
    }
  }

  const handleLoadCustomersToMerge = (item: any) => {
    if (item){
      setCustomerIdToMerge(item.id)
    }else{
      setCustomerIdToMerge('')
      LoadCustomer('')
    }
  }

  const [buttonText, setButtonText] = useState("Iniciar");
  const changeText = (text) => setButtonText(text);

  const [buttonWidth, setButtonWidth] = useState(150);
  const changeButtonWidth = (size) => setButtonWidth(size);

  return (
    
    <>
      {isGeneratingMerge && (
        <ConfirmBoxModal
          title="Mesclar Cliente"
          caller="customerMerge"
          useCheckBoxConfirm
          message="Esta operação irá transferir todos os processos, financeiro, documentos e CRM do cliente mesclado para o principal. O cliente mesclado será REMOVIDO do GOJUR. Os dados de casdatro principal como endereço, telefone, etc... não serão mesclados. ESTA OPERAÇÃO É IRREVERSÍVEL."
        />
      )}

      <Modal
        isOpen={isCustomerMergeModalOpen}
        onRequestClose={handleCloseCustomerMergeModal}
        overlayClassName="react-modal-overlay"
        className="react-modal-content"
      >
    
        <button 
          type="button" 
          className="react-modal-close"
          onClick={handleCloseCustomerMergeModal} 
        >
          <FiX size={20} />
        </button>

        <Container>

          <CustomerMergeForm>

            <h1>Selecione os clientes que deseja mesclar</h1>

            <br />

            <AutoCompleteSelect className='autoSelect'>
              <p>
                <b>Principal</b>
                &nbsp;
                (este será mantido)
              </p>
              <Select
                isSearchable
                isClearable
                placeholder="Selecione"
                onChange={(item) => handleLoadCustomersPrincipal(item)}
                onInputChange={(term) => setCustomerSearchTerm(term)}
                loadingMessage={loadingMessage}
                noOptionsMessage={noOptionsMessage}
                isLoading={isLoadingComboData}
                styles={selectStyles}              
                options={customerList}
              />
            </AutoCompleteSelect>

            <br />

            <AutoCompleteSelect className='autoSelect'>
              <p>
                <b>Mesclado</b>
                &nbsp;
                (este será removido e os processos e demais registros transferidos para o principal)
              </p>
              <Select
                isSearchable
                isClearable
                placeholder="Selecione"
                onChange={(item) => handleLoadCustomersToMerge(item)}
                onInputChange={(term) => setCustomerSearchTerm(term)}
                loadingMessage={loadingMessage}
                noOptionsMessage={noOptionsMessage}
                isLoading={isLoadingComboData}
                styles={selectStyles}              
                options={customerList}
              />
            </AutoCompleteSelect>
      
            <br />
            <br />

            <div style={{marginLeft:'10px', float:'left', width:buttonWidth}}>
              <button 
                className="buttonClick"
                type='button'
                onClick={()=> setIsGeneratingMerge(true)}
              >
                <FiSave />
                {buttonText}
                {isGeneratingMerge && <Loader size={5} color="var(--orange)" />}
              </button>
            </div>
                      
            <div style={{marginLeft:'10px', float:'left', width:'150px'}}>
              <button 
                type='button'
                className="buttonClick"
                onClick={() => handleCloseCustomerMergeModal()}
              >
                <FaRegTimesCircle />
                Cancelar
              </button>
            </div>
            
          </CustomerMergeForm>

        </Container>

      </Modal>

    </>
  );
};
  
  