import React, { useCallback, useState, ChangeEvent, useEffect, useRef } from 'react';
import api from 'services/api';
import Select from 'react-select';
import LoaderWaiting from 'react-spinners/ClipLoader';
import { BiSearchAlt } from 'react-icons/bi';
import { BsImage } from 'react-icons/bs';
import { FaRegTimesCircle, FaFilePdf, FaFileAlt, FaKey, FaRegEdit } from 'react-icons/fa';
import { FiTrash, FiDownloadCloud } from 'react-icons/fi';
import { HiDocumentText } from 'react-icons/hi';
import { SiMicrosoftexcel } from 'react-icons/si';
import { useDevice } from "react-use-device";
import { add, format } from 'date-fns';
import { useToast } from 'context/toast';
import { useDelay, currencyConfig, selectStyles, FormatCurrency, FormatFileName, AmazonPost } from 'Shared/utils/commonFunctions';
import { languageGridEmpty, languageGridPagination } from 'Shared/utils/commonConfig';
import { DataTypeProvider, PagingState, CustomPaging, IntegratedPaging, SortingState, IntegratedSorting } from '@devexpress/dx-react-grid';
import { Grid, Table, TableHeaderRow, PagingPanel } from '@devexpress/dx-react-grid-material-ui';
import { CredentialsModal, GridSubContainer, Overlay } from './styles';
import CredentialsDataSourceModal from './EditModal';
import { OverlayPermission } from './EditModal/styles';

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

    const response = await api.get<ICredentialData[]>('/Credenciais/Listar', { 
      params:{
          token
        }
    })

    setCredentialsList(response.data)   
  
  }, [])

  
  const [tableColumnExtensionsUserLists] = useState([
    { columnName: 'des_Credential', width: '45%' },
    { columnName: 'des_Username', width: '40%' },
    { columnName: 'bntEditar', width: '4%' },
    { columnName: 'bntExcluir', width: '4%' },
  ]);

  const columnsUsrList = [
    { name: 'des_Credential', title: 'Descrição' },
    { name: 'des_Username', title: 'Usuario' },
    { name: 'bntEditar', title: ' ' },
    { name: 'bntExcluir', title: ' ' },
  ];

  const CustomCellUserList = (props) => {
    const { column } = props;

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
        <Table.Cell onClick={(e) => handleDeleteCredential(props.row.id_Credential)} {...props}>
          &nbsp;&nbsp;
          <FiTrash />
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

      LoadCredentials()
    }
    catch (error) {
      addToast({
        type: 'error',
        title: 'Erro ao excluir a credencial',
        description: 'Ocorreu um erro ao tentar excluir a credencial, tente novamente!'
      });
    }
  }

  return (
    <>
      {isChanging && (
        <>
          <OverlayPermission />
          <div className='waitingMessage' style={{ zIndex: 999999999 }}>
            <LoaderWaiting size={15} color="var(--blue-twitter)" />
            &nbsp;&nbsp; Carregando...
          </div>
        </>
      )}
      
      {showCredentialsDataSourceModal && <CredentialsDataSourceModal callbackFunction={{ handleCloseEditModal, credentialId}} />}
    
      {!isMOBILE && (
        <>
          <Overlay />
          <CredentialsModal show style={{ width: '55%', height: '55%', display: 'flex', flexDirection: 'column', border: '1px solid var(--blue-twitter)' }}>
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
      
      {isLoading && (
        <>
          <Overlay />
          <div className='waitingMessage'>
            <LoaderWaiting size={15} color="var(--blue-twitter)" />
            Aguarde...
          </div>
        </>
      )}
    </>
  );
};

export default CredentialModal;