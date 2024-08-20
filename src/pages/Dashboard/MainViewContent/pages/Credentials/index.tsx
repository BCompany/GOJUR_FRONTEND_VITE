import React, { useCallback, useState, ChangeEvent, useEffect, useRef } from 'react';
import api from 'services/api';
import LoaderWaiting from 'react-spinners/ClipLoader';
import { FaRegTimesCircle, FaFileAlt, FaRegEdit, FaAddressCard  } from 'react-icons/fa';
import { FiTrash} from 'react-icons/fi';
import { useDevice } from "react-use-device";
import { useToast } from 'context/toast';
import { languageGridEmpty, languageGridPagination } from 'Shared/utils/commonConfig';
import { PagingState, CustomPaging, IntegratedPaging, SortingState, IntegratedSorting } from '@devexpress/dx-react-grid';
import { Grid, Table, TableHeaderRow, PagingPanel } from '@devexpress/dx-react-grid-material-ui';
import { CredentialsModal, GridSubContainer, Overlay, Overlay2 } from './styles';
import CredentialsDataSourceModal from './EditModal';
import { OverlayPermission } from './EditModal/styles';
import { MdCancel, MdCheckCircle, MdNewReleases } from 'react-icons/md';

interface SelectData {
  id: string;
  label: string;
}

export interface ICredentialData {
  id_Credential: string;
  des_Credential: string;
  des_Username: string;
  flg_Status: string;
  id_Court: string;
  courtName: string;
}

const CredentialModal = (props) => {
  const { addToast } = useToast();
  const { handleCloseCredentialModal } = props.callbackFunction;
  const { isMOBILE } = useDevice();
  const [pageSize, setPageSize] = useState(10);
  const [showCredentialsDataSourceModal , setShowCredentialsDataSourceModal] = useState<boolean>(false)
  const [currentPage, setCurrentPage] = useState(0);
  const [totalRows, setTotalRows] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [credentialId, setCredentialId] = useState<number>(0);
  const [isChanging, setIsChanging] = useState<boolean>(false);

  const token = localStorage.getItem('@GoJur:token')

  const [credentialsList, setCredentialsList] = useState<ICredentialData[]>([]);

  useEffect(() => {
    LoadCredentials()
    },[])

  const LoadCredentials = useCallback(async() => {
    try{
      
      setIsLoading(true)

      const response = await api.get<ICredentialData[]>('/Credenciais/Listar', { 
        params:{
            token
          }
      })
  
      setCredentialsList(response.data)

      setIsLoading(false)

    }
    catch (error) {
      addToast({
        type: 'error',
        title: 'Erro ao carregar as credenciais',
        description: 'Ocorreu um erro ao tentar carregar as credenciais, tente novamente!'
      });
    }

    setIsLoading(false)
 
  }, [])

  
  const [tableColumnExtensionsUserLists] = useState([
    { columnName: 'des_Credential', width: '40%' },
    { columnName: 'des_Username', width: '30%' },
    { columnName: 'flg_Status', width: '17%' },
    { columnName: 'bntEditar', width: '4%' },
    { columnName: 'bntExcluir', width: '4%' },
  ]);

  const columnsUsrList = [
    { name: 'des_Credential', title: 'Descrição' },
    { name: 'des_Username', title: 'Usuario' },
    { name: 'flg_Status', title: 'Status' },
    { name: 'bntEditar', title: ' ' },
    { name: 'bntExcluir', title: ' ' },
  ];

  const CustomCellUserList = (props) => {
    const { column, row } = props;
  
    if (column.name === 'bntEditar') {
      return (
        <Table.Cell onClick={(e) => handleOpenEditModal(props)} {...props}>
          &nbsp;&nbsp;
          <FaRegEdit />
        </Table.Cell>
      );
    }
  
    if (column.name === 'bntExcluir') {
      return (
        <Table.Cell onClick={(e) => handleDeleteCredential(row.id_Credential)} {...props}>
          &nbsp;&nbsp;
          <FiTrash />
        </Table.Cell>
      );
    }
  
    if (column.name === 'flg_Status') {
      let icon;
  
      switch (row.flg_Status) {
        case 'D':
          icon = (
            <div style={{ display: 'flex' , marginBottom: "12px"}}>
              <FaAddressCard style={{ color: 'red', height: '20px' }} title="Credencial negada pelo tribunal" />
              <span style={{ color: 'red', marginLeft: '5px' }}>Recusada</span>
            </div>
          );
          break;
        case 'N':
          icon = (
            <div style={{ display: 'flex' , marginBottom: "12px"}}>
              <FaAddressCard style={{ color: 'blue', height: '20px' }} title="Em processo de autenticação de credencial" />
              <span style={{ color: 'blue', marginLeft: '5px' }}>Em Validação</span>
            </div>
          );
          break;
        case 'S':
          icon = (
            <div style={{ display: 'flex', marginBottom: "12px"}}>
              <FaAddressCard style={{ color: 'green', height: '20px' }} title="Credencial autenticada com sucesso" />
              <span style={{ color: 'green', marginLeft: '5px' }}>Válida</span>
            </div>
          );
          break;
        default:
          icon = null;
      }
  
      return (
        <Table.Cell {...props}>
          &nbsp;&nbsp;
          {icon}
        </Table.Cell>
      );
    }
  
    return <Table.Cell {...props} />;
  };

  const handleAddNewCredential = async () => {
    setShowCredentialsDataSourceModal(true)
  };
 
  const handleOpenEditModal = async (props) => {
    setCredentialId(props.row.id_Credential)
    setShowCredentialsDataSourceModal(true)
  };

  const handleCloseEditModal = async () => {
    setShowCredentialsDataSourceModal(false)
    setCredentialId(0)
    LoadCredentials()
  };

  const handleDeleteCredential = async (id: number) => {

    try {
      setIsLoading(true)
      const response = await api.delete('/Credenciais/Excluir', { 
        params:{
            id_Credential: id,
            token
          }
      })

      addToast({
        type: 'success',
        title: 'Credencial excluída',
        description: 'A credencial foi excluída com sucesso!'
      });

      setIsLoading(false)

      LoadCredentials()
    }
    catch (error) {
      addToast({
        type: 'error',
        title: 'Erro ao excluir a credencial',
        description: 'Ocorreu um erro ao tentar excluir a credencial, tente novamente!'
      });
    }

    setIsLoading(false)
  }

  return (
    <>
      {isLoading && (
        <>
          <Overlay2 />
          <div className='waitingMessage' style={{ position: 'fixed', bottom: '10px', right: '10px', zIndex: 999999999 }}>
            <LoaderWaiting size={15} color="var(--blue-twitter)" />
            &nbsp;&nbsp; Carregando...
          </div>
        </>
      )}
      
      {showCredentialsDataSourceModal && <CredentialsDataSourceModal callbackFunction={{ handleCloseEditModal, credentialId}} />}
    
      {!isMOBILE && (
        <>
          <Overlay />
          <CredentialsModal show style={{ width: '65%', height: '55%', display: 'flex', flexDirection: 'column', border: '1px solid var(--blue-twitter)' }}>
            <div className='header' style={{ flex: '0 0 auto', padding: '2px 5px' }}>
              <p className='headerLabel'>Credenciais</p>
            </div>
      
            <GridSubContainer style={{ flex: '1 1 auto', overflowY: 'auto' }}>
              <Grid
                rows={credentialsList}
                columns={columnsUsrList}
              >
                <SortingState
                  defaultSorting={[{ columnName: 'flg_Ativo', direction: 'asc' }]}
                />
                <IntegratedSorting />
                <PagingState
                  currentPage={currentPage}
                  pageSize={pageSize}
                  onCurrentPageChange={setCurrentPage}
                  onPageSizeChange={setPageSize}
                />
                <IntegratedPaging />
                <CustomPaging totalCount={totalRows} />
      
                <Table
                  cellComponent={CustomCellUserList}
                  columnExtensions={tableColumnExtensionsUserLists}
                  messages={languageGridEmpty}
                />
                <TableHeaderRow showSortingControls />
                <PagingPanel
                  messages={languageGridPagination}
                />
              </Grid>
            </GridSubContainer>
      
            <div style={{ flex: '0 0 auto', padding: '10px'}}>
              <div style={{ float: 'right', marginRight: '1%' }}>
                <button
                  type='button'
                  className="buttonClick"
                  onClick={() => handleCloseCredentialModal()}
                  style={{ width: '100px' }}
                >
                  <FaRegTimesCircle />
                  Fechar
                </button>
              </div>
  
              <div style={{ float: 'right', marginRight: '10px' }}>
                <button 
                  className="buttonClick" 
                  title="Clique para incluir uma ação judícial"
                  type="submit"
                  onClick={handleAddNewCredential}
                >
                  <FaFileAlt />
                  Adicionar
                </button>
              </div>
            </div>
          </CredentialsModal>
        </>
      )}      
    </>
  );
};

export default CredentialModal;