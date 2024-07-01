import React, { useCallback, useEffect, useState } from 'react';
import { Grid, Table, TableHeaderRow,  } from '@devexpress/dx-react-grid-material-ui';
import api from 'services/api';
import { FaFileAlt } from 'react-icons/fa';
import { FiEdit, FiTrash, FiArrowLeft } from 'react-icons/fi'
import { GridContainer } from 'Shared/styles/GlobalStyle';
import { languageGridEmpty } from 'Shared/utils/commonConfig';
import { useToast } from 'context/toast';
import { useHistory } from 'react-router-dom';
import { useModal } from 'context/modal';
import { HeaderPage } from 'components/HeaderPage';
import ConfirmBoxModal from 'components/ConfirmBoxModal';
import { useConfirmBox } from 'context/confirmBox';
import { useDefaultSettings } from 'context/defaultSettings';
import { IDefaultsProps, ISalesChannelData } from '../../../../Interfaces/IBusiness';
import { ISelectData } from '../../../../Interfaces/ICustomerEdit';
import { Container } from './styles';
import SalesChannelEdit from '../Modal';

const SalesChannelList = () => {

  const { addToast } = useToast();
  const history = useHistory();
  const [salesChannelList, setSalesChannelList] = useState<ISelectData[]>([]); 
  const {isConfirmMessage, isCancelMessage, handleCancelMessage,handleConfirmMessage } = useConfirmBox();
  const { handleShowSalesChannelModal, showSalesChannelModal } = useModal();
  const [currentId, setCurrentId] = useState<number>(0); 
  const [isInitilize, setIsInitialize] = useState<boolean>(true); 
  const [checkMessage, setCheckMessage] = useState(false)
  const { handleUserPermission } = useDefaultSettings();
  
  const token = localStorage.getItem('@GoJur:token');

  useEffect(() => {
    
    LoadSalesChannel()
    setIsInitialize(false)

  }, [])
    
  useEffect(() => {
   
    async function handleDefaultProps() {
      try {
  
        const response = await api.post<IDefaultsProps[]>('/Defaults/Listar', { token })
        const userprops = response.data.find(item => item.id === "defaultModulePermissions");
        if (userprops)
          handleUserPermission(userprops.value.split('|'));

      } catch (err) {
        console.log(err);
      }
    }

    handleDefaultProps()
  
  },[handleUserPermission, token]) 

  const LoadSalesChannel = async() => {

    const response = await api.get<ISalesChannelData[]>('CanalDeVendas/Listar', { 
      params: {
        filterTerm: '',
        token
      }
    })

    setSalesChannelList(response.data)
  }

  const handleClick = (props: any) => {
  
    // call download function
      if (props.column.name === 'edit'){
        setCurrentId(props.row.id)
        handleEdit()
      }
  
      // call delete function
      if (props.column.name === 'remove'){
        handleDeleteCheck(props.row.id)
       // handleDeleteFile(props.row.fileName)
      }
  }

  const handleEdit = useCallback(async() => {
    
    handleShowSalesChannelModal(true)

  }, [currentId, showSalesChannelModal])
  
  const handleAddNewItem = useCallback(async() => {
    
    setCurrentId(0)
    handleShowSalesChannelModal(true)

  }, [currentId, showSalesChannelModal])

  useEffect(() => {

    if (!showSalesChannelModal && !isInitilize){
      LoadSalesChannel()
    }

  },[showSalesChannelModal])

    useEffect(() => {
  
    if (isCancelMessage){  
      setCheckMessage(false)
      handleCancelMessage(false)
      setCurrentId(0)
    }  
  }, [isCancelMessage])   
  
  useEffect(() => {
    
    if (isConfirmMessage){
      setCheckMessage(false)
      handleConfirmMessage(false)
      handleDelete(currentId)
    }

  }, [isConfirmMessage, currentId]) 

  const handleDeleteCheck  = async (id:number) =>{

    setCheckMessage(true)
    setCurrentId(id)
  }  
  
  const handleDelete = async (id: number) => {
    try
    {    
      const response = await api.delete<ISalesChannelData[]>('CanalDeVendas/Deletar', { 
        params:{
          token, 
          id 
        }
      })

      if (response.status == 200){
        addToast({
          type: "success",
          title: "Registro removido com sucesso",
          description: `O canal de vendas selecionado foi removido com sucesso`
        })

        LoadSalesChannel()
      }   
      
      setCurrentId(0)
    }
    catch(ex){
      addToast({
        type: "info",
        title: "Operação não realizada",
        description: `Não foi possível excluir o registro selecionado, tente novamente`
      })
      console.log(ex)
    }
  }

  const columns = [
    { name: 'label', title: ' ' },
    { name: 'edit',  title: ' '  },
    { name: 'remove',title: ' ' }
  ];
    
  
  const [tableColumnExtensions] = useState([
    { columnName: 'label',     width: '50%' },
    { columnName: 'btnEditar', width: '20%' },
    { columnName: 'btnRemover',width: '15%' },
  ]);

  const CustomCell = (props) => {
    
    const { column } = props;
    
    if (column.name === 'edit') {
      return (
        <Table.Cell onClick={(e) => handleClick(props)} {...props}>
          &nbsp;&nbsp;
          <FiEdit title="Clique para editar " />
        </Table.Cell>
      );
    }

    if (column.name === 'remove') {
      return (
        <Table.Cell onClick={(e) => handleClick(props)} {...props}>
          &nbsp;&nbsp;
          <FiTrash title="Clique para remover" />
        </Table.Cell>
      );
    }

    return <Table.Cell {...props} />;
  };
  
  return (

    <>
      <HeaderPage />

      { checkMessage && (
        <ConfirmBoxModal
          buttonCancelText="Cancelar"
          buttonOkText="Confirmar"
          message="Confirma a exclusão deste canal de vendas ?"
        />
      )}
      
      <Container>

        {showSalesChannelModal && <SalesChannelEdit id={currentId} />}

        <div className='buttonAdd'>
          <button 
            className="buttonClick" 
            title="Clique para incluir um novo canal de venda"
            onClick={() => handleAddNewItem()}
            type="submit"
          >
            <FaFileAlt />
            Adicionar
          </button>

          <button 
            className="buttonClick" 
            title="Clique para retornar a lista de clientes"
            type="submit"
            onClick={() => history.push(`/customer/list`)}
          >
            <FiArrowLeft />
            Retornar
          </button>
        </div>

        <br />

        <GridContainer>
          <Grid
            rows={salesChannelList}
            columns={columns}
          >
            <Table 
              cellComponent={CustomCell}
              columnExtensions={tableColumnExtensions}            
              messages={languageGridEmpty}
            />
            <TableHeaderRow />
          </Grid>

        </GridContainer>
    
      </Container>

    </>
    
  )
}

export default SalesChannelList;
