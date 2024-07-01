/* eslint-disable no-nested-ternary */
/* eslint-disable no-param-reassign */
import React, { useCallback, useEffect, useState } from 'react'
import Modal from 'react-modal';
import Select from 'react-select';
import api from 'services/api';
import { useConfirmBox } from 'context/confirmBox';
import { MdBlock} from 'react-icons/md';
import { FcOk, FcCancel , FcSearch } from 'react-icons/fc';
import { BiSave } from 'react-icons/bi';
import { SiIfixit } from 'react-icons/si';
import { FiPlus, FiTrash } from 'react-icons/fi';
import { UFList } from 'Shared/utils/commonListValues';
import { selectStyles } from 'Shared/utils/commonFunctions';
import { noOptionsMessage } from 'Shared/utils/commonConfig';
import { useToast } from 'context/toast';
import LoaderWaiting from 'react-spinners/ClipLoader';
import { ILawyerList } from '../Interfaces/IMatter';
import { Container, OverlayOAB } from './styles';

export default function SearchOAB () {
  const { handleCancelMessage, handleCaller } = useConfirmBox(); 
  const [ lawyerList, setLawyerList ] = useState<ILawyerList[]>([])
  const [ isSaving, setIsSaving ] = useState<boolean>(false)
  const [ searchingInfo, setSearchingInfo ] = useState<string>('')
  const { addToast } = useToast();
  const token = localStorage.getItem('@GoJur:token');

  const lawywerOptions = [
    {id: 'A', label: 'Advogado'},
    {id: 'S', label: 'Suplementar'},
    {id: 'E', label: 'Estagiário'},
  ]
  

  useEffect(() => {
    Initialize()
  },[])


  // Add as default two lines of search OAB
  const Initialize = () => {
    const newData: ILawyerList[] = [];
    newData.push( {
      name:'',
      OAB: '',
      UF: 'SP',
      type: 'A',
      searchStatus:'P',
      isSearching:false,
      disabledName: true,
      pushes: '',
      index: 0 
    })

    setLawyerList(newData)
  }

  
  const Validate = () => {
    const hasCurrentSearch = lawyerList.filter(item=> item.isSearching)

    if (hasCurrentSearch.length > 0){
      addToast({type: 'info', title: 'Operação não realizada', description: 'Existe uma busca por OAB em execução, aguarde finalizar'});
      return false;
    }

    return true;
  }


  const handleSave = useCallback(async () => {
    if (!Validate()) return;
    
    try
    {
      const hasEmptyValues = lawyerList.filter((item) => item.name === '' || item.OAB === '' || item.name == null);
      if (hasEmptyValues.length > 0) {
        addToast({
          type: 'info',
          title: 'Operação não realizada',
          description: 'Verifique se o nome do advogado e/ou OAB foram informados',
        });

        return false;
      }

      setIsSaving(true)

      const OABsJson = JSON.stringify(lawyerList);

      await api.post('/BuscaAutomatica/SalvarPesquisaOAB', {
        token,
        OABsJson
      })

      handleCloseModal();
      setIsSaving(false);
    }
    catch(err:any){
      console.log(err)
      setIsSaving(false)
      addToast({type: 'error', title: 'Operação não realizada', description: err.response.data.Message});
    }
  },[lawyerList])

  
  const handleCloseModal = () => {
    if (!Validate()) return;

    handleCaller('matterSearchOAB')
    handleCancelMessage(true)
  }

  
  const handleDeleteLine = (lawyer:ILawyerList) => {
    const lawyerListRefresh = lawyerList.filter(item => item.index != lawyer.index);
    setLawyerList(lawyerListRefresh)
  }


  const handleAddNewOAB = useCallback(() => {
    if (!Validate()) return;

    const newData: ILawyerList[] = [];
    newData.push( {
      name: '',
      OAB: '',
      UF: 'SP',
      type: 'A',
      searchStatus: 'P',
      isSearching: false,
      disabledName: true,
      pushes: '',
      index: lawyerList.length + 1 
    })

    setLawyerList([...lawyerList, ...newData])
  
  },[lawyerList])


  const handleSearchOAB = async(lawyer: ILawyerList) => {
    if (!Validate()) return;
    
    try
    {
      if (lawyer.OAB == '') return;
      
      setSearchingInfo('validando')

      // update to searching state
      if (!lawyer.isSearching)
      {
        const newData = lawyerList.map(item =>
          item.index === lawyer.index ? {
            ...item,
            isSearching: true,
            disabledName:true
          } : item
        )
        
        setLawyerList(newData)
      }
    
      const response = await api.get('/BuscaAutomatica/PesquisaPorOABLegalData', {
        params:{OAB: lawyer.OAB, UF: lawyer.UF, TipoInscricao: lawyer.type, token}
      })
      
      // Update search result with Validate or UnValidated
      const newData = lawyerList.map(item =>
        item.index === lawyer.index ?
        {
          ...item,
          isSearching:false,
          name:response.data[0].nome_Advogado,
          disabledName:response.data[0].status_Validacao === 'V',
          searchStatus:response.data[0].status_Validacao
        } : item
      )
          
      setLawyerList(newData)
      setSearchingInfo('')
    }
    catch(err:any){
      const newData = lawyerList.map(item =>
        item.index === lawyer.index ? {
          ...item,
          isSearching: false,
          disabledName: true
        } : item
      )
      
      setLawyerList(newData)
      setSearchingInfo('')
      console.log(err)
      addToast({type: 'error', title: 'Operação não realizada', description: err.response.data.Message});
    }  
  }


  const handleLawyerType = useCallback((e, lawyer:ILawyerList) => {
    const newData = lawyerList.map(item =>
      
      item.index === lawyer.index?
      {
        ...item,
        type: e.id,
      }:
      item
    ) 

    setLawyerList(newData)
  },[lawyerList])


  const handleLawyerUF = useCallback((e, lawyer:ILawyerList) => {
    const newData = lawyerList.map(item =>
      
      item.index === lawyer.index?
      {
        ...item,
        UF: e.id,
      }:
      item
    ) 

    setLawyerList(newData)
  },[lawyerList])


  const handleLawyerOAB = useCallback((e, lawyer:ILawyerList) => {
    const newData = lawyerList.map(item =>
      item.index === lawyer.index?
      {
        ...item,
        OAB: e.target.value,
      }:
      item
    ) 

    setLawyerList(newData)
  },[lawyerList])


  const handleLawyerName =  useCallback((e, lawyer:ILawyerList) => {
    const newData = lawyerList.map(item =>
      
      item.index === lawyer.index?
      {
        ...item,
        name: e.target.value,
      }:
      item
    ) 

    setLawyerList(newData)
  },[lawyerList])

  
  return (
    <>
      <Modal
        isOpen
        overlayClassName="react-modal-overlay2"
        className="react-modal-content-OAB"
      >
        <Container>
            
          <header>
            <h1>Busca automático de processos por OAB</h1>
            <h5>Para que possamos automaticamente pesquisar os seus processos, nos informe as OABs dos advogados de sua equipe</h5>
          </header>

          {lawyerList.map(item => (
            <div key={item.index}>
              <FiTrash onClick={() => handleDeleteLine(item)} />

              <Select               
                id="searchOAB_type"     
                styles={selectStyles}      
                value={lawywerOptions.filter(options => options.id == item.type)}        
                options={lawywerOptions}
                onChange={(e) => { handleLawyerType(e, item)}}
                noOptionsMessage={noOptionsMessage}
                placeholder=""
                isDisabled={item.searchStatus == 'V'}
              />
        
              <Select 
                id="searchOAB_UF"     
                styles={selectStyles}         
                value={UFList.filter(options => options.id == item.UF)}        
                options={UFList}
                onChange={(e) => { handleLawyerUF(e, item) }}
                noOptionsMessage={noOptionsMessage}
                placeholder=""
                isDisabled={item.searchStatus == 'V'}
              />

              <input 
                type='text' 
                placeholder='Nº OAB' 
                onChange={(e) => handleLawyerOAB(e, item)}
                onBlur={() => handleSearchOAB(item)}
                value={item.OAB}  
                disabled={item.searchStatus == 'V'}
                className='numOAB'
              />
        
              <input 
                type='text' 
                placeholder='Nome do Advogado'
                onChange={(e) => handleLawyerName(e, item)}
                value={item.name}
                disabled={item.disabledName == true}
                className='nomAdvogado'
              />     

              <FcSearch onClick={() => handleSearchOAB(item)} title='Clique para realizar a busca por OAB' /> 

              <div id='text'>
                {item.searchStatus == 'V' && (
                  <>
                    <div style={{marginTop:'6px'}}>
                      <div style={{float:'left', marginTop:'4px'}}><FcOk title='A OAB informada foi validada com sucesso' /></div>
                      <div style={{float:'left', marginTop:'1px'}}>&nbsp;OAB validada</div>
                    </div>
                  </>
                )}
                {item.searchStatus == 'I' && (
                  <>
                    <div style={{marginTop:'6px'}}>
                      <div style={{float:'left', marginTop:'4px'}}><SiIfixit title='A OAB informada não foi encontrada' style={{color:'red'}} /></div>
                      <div style={{float:'left', marginTop:'1px'}}>&nbsp;OAB inválida</div>
                    </div>
                  </>
                )}
                {item.searchStatus == 'P' && <span style={{width: '30px'}}>&nbsp;&nbsp;</span> }
              </div>
            </div>
          ))}
      
          {lawyerList.length == 0 && (
            <div className='messageEmpty'>
              Deseja realmente não informar a sua OAB ?
              <br />
              Desta forma o GOJUR não conseguirá realizar a busca automática dos seus processos. 
            </div>
          )}

          <button 
            className="buttonLinkClick buttonAddNew" 
            onClick={()=> handleAddNewOAB()}
            title="Clique para adicionar uma nova pesquisa por OAB"
            type="submit"
          >
            <FiPlus />
            Adicionar nova OAB
          </button>
              
          <footer>
            <button 
              className="buttonClick" 
              type="button"
              onClick={handleSave}
              title="Clique para salvar o parâmetro"
            >
              <BiSave />
              {isSaving && <span>Salvando...</span> }
              {!isSaving && <span>Salvar</span>}
            </button>   

            <button 
              className="buttonClick" 
              type="button"
              onClick={handleCloseModal}
              title="Clique para retornar a listagem de processos"
            >
              <MdBlock />
              <span>Fechar</span> 
            </button>  
          </footer>
        </Container>
      </Modal>

      {searchingInfo.length > 0 && (
        <>
          <OverlayOAB />
          <div className='waitingMessage'>
            <LoaderWaiting size={15} color="var(--blue-twitter)" />
              &nbsp;&nbsp; Aguarde...
          </div>
        </>
      )}

      {isSaving && (
        <>
          <OverlayOAB />
          <div className='waitingMessage'>
            <LoaderWaiting size={15} color="var(--blue-twitter)" />
              &nbsp;&nbsp; Aguarde...
          </div>
        </>
      )}

    </>
  )
}