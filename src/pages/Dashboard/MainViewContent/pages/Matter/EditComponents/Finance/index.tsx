/* eslint-disable react/jsx-indent */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable react/jsx-one-expression-per-line */

import React, { useEffect, useState, useCallback } from 'react';
import { DataTypeProvider, PagingState, IntegratedPaging } from '@devexpress/dx-react-grid';
import { Grid, Table, PagingPanel, TableHeaderRow } from '@devexpress/dx-react-grid-material-ui';
import Loader from 'react-spinners/ClipLoader';
import { useToast } from 'context/toast';
import LoaderWaiting from 'react-spinners/ClipLoader';
import { FaHandshake, FaRegTimesCircle, FaCheck } from 'react-icons/fa';
import { FiEdit, FiTrash, FiX } from 'react-icons/fi'
import { GoDash, GoPlus } from 'react-icons/go'
import { useHistory } from 'react-router-dom';
import { useDevice } from "react-use-device";
import { GridSubContainer, Overlay } from 'Shared/styles/GlobalStyle';
import { format } from 'date-fns';
import { languageGridEmpty, languageGridPagination } from 'Shared/utils/commonConfig';
import ConfirmBoxModal from 'components/ConfirmBoxModal';
import { useConfirmBox } from 'context/confirmBox';
import { Container } from './styles';
import { DeleteMatterFinance, ListMatterFinance } from '../Services/MatterFinanceData';
import { IMatterFinance } from '../../../Interfaces/IMatter';
import FinancialModal from '../../../Financeiro/Modal';

const Finance = (props) => {
  const { matterId, load } = props;
  const history = useHistory();
  const { handleCaller, caller, isCancelMessage, isConfirmMessage } = useConfirmBox();
  const [ isLoading, setIsLoading] = useState<boolean>(true)
  const { addToast } = useToast();
  const { isMOBILE } = useDevice();
  const [ movementId, setMovementId] = useState<number>(0);
  const [ typeMovement, setTypeMovement] = useState<string>('');
  const [ statePage, setStatePage] = useState<string>('');
  const [ currentObject, setCurrentObject] = useState<IMatterFinance|null>(null);
  const [ showMessageDelete, setShowMessageDelete] = useState<boolean>(false);
  const [ listFinance, setListFinance] = useState<IMatterFinance[]>([]);
  const [ accountId, setAccountId] = useState<number>(0);
  const [ totalReceita, setTotalReceita] = useState<string>('');
  const [ totalDespesa, setTotalDespesa] = useState<string>('');
  const [ pageSize, setPageSize] = useState(10);
  const [ pageSizes] = useState([10, 50, 100, 0]);
  const [ isDeal, setIsDeal] = useState<boolean>(false);
  const [ installmentNum, setInstallmentNum] = useState<number>(0);
  const [ dealDetailId, setDealDetailId] = useState<number>(0);

  useEffect(() => {
    if (load)
      LoadFinance()
  }, [load])


  useEffect(() => {
    if(caller == 'deal' && isCancelMessage)
      setIsDeal(false);
  }, [isCancelMessage, caller]);


  useEffect(() => {
    if(caller == 'deal' && isConfirmMessage)
    {
      setIsDeal(false);  
      handleRedirect();
    }
  }, [isConfirmMessage, caller]);


  const LoadFinance = async () => {
    setStatePage('loading')

    const response = await ListMatterFinance(matterId, 0, 0, 0)
    setListFinance(response.data)

    if (response.data.length > 0){
      setTotalDespesa(response.data[0].totalDespesa)
      setTotalReceita(response.data[0].totalReceita)
    }else{
      setTotalDespesa('R$ 0.00')
      setTotalReceita('R$ 0.00')
    }

    setIsLoading(false)
    setStatePage('')
  }


  useEffect(() => {
    if (accountId > 0)
      LoadFinance();
  }, [accountId])


  const EditFinance = async (id: number) => {
    const mov = listFinance.find(item => item.id === id)

    if (mov){
      setMovementId(id)
      setTypeMovement(mov.type)
    }
  }


  const DeleteFinance = async (id: number) => {
    const item = listFinance.find(item => item.id == id);

    if (item){
      handleCaller('matterFinanceDelete')
      setCurrentObject(item)
    }
  }


  const handleDelete = async (id: number, deleteAll: boolean) => {
    if (currentObject)
    {
      setStatePage('deleting')
      Reset();
      DeleteMatterFinance(currentObject.id, deleteAll).then(() => {
        LoadFinance()
      })
    }
  }


  useEffect(() => {
    if (currentObject && caller == 'matterFinanceDelete'){
      if (currentObject.qtde_Installment > 1)
        setShowMessageDelete(true)
      else
        handleDelete(currentObject.id, false)
    }
  },[caller, currentObject])


  useEffect(() => {
    if (currentObject && showMessageDelete && isConfirmMessage && caller == 'matterFinanceDelete'){
        handleDelete(currentObject.id, false)
    }else if (caller === 'hasCanceled'){
      Reset()
    }
  },[caller, currentObject, showMessageDelete, isConfirmMessage])


  useEffect(() => {
    if (currentObject && showMessageDelete && isCancelMessage && caller == 'matterFinanceDelete'){
        handleDelete(currentObject.id, true)
    }else if (caller === 'hasCanceled'){
      Reset()
    }
  },[caller, currentObject, showMessageDelete, isCancelMessage])


  const Reset = () => {
    setShowMessageDelete(false)
    handleCaller('')
    setCurrentObject(null)
    setTypeMovement('')
  }


  const columns = [
    { name: 'date',         title: ' Vencimento '},
    { name: 'description',  title: ' Descrição '},
    { name: 'categoryName', title: ' Categoria '},
    { name: 'value',        title: ' Valor '},
    { name: 'valuePayment', title: ' Pago/Recebido '},
    { name: 'accountDesc',  title: ' Conta Bancária'},
    { name: 'edit',         title: ' Editar'},
    { name: 'delete',       title: ' Deletar'}
  ];


  const [tableColumnExtensions] = useState([
    { columnName: 'date',         width: '10%' },
    { columnName: 'description',  width: '25%' },
    { columnName: 'categoryName', width: '15%' },
    { columnName: 'value',        width: '8%' },
    { columnName: 'valuePayment', width: '10%' },
    { columnName: 'accountDesc',  width: '17%' },
    { columnName: 'edit',         width: '7%' },
    { columnName: 'delete',       width: '7%' },
  ]);


  const [tableColumnExtensionsDevice] = useState([
    { columnName: 'date',         width: '20%' },
    { columnName: 'description',  width: '30%' },
    { columnName: 'categoryName', width: '20%' },
    { columnName: 'value',        width: '10%' },
    { columnName: 'valuePayment', width: '10%' },
    { columnName: 'accountDesc',  width: '20%' },
  ]);


  const [dateColumns] = useState(['date']);

  // format value to date format
  const DateFormatter = ({ value }) => format(new Date(value), 'dd/MM/yyyy');
  const DateTypeProvider = props => (
    <DataTypeProvider formatterComponent={DateFormatter} {...props} />
  );


  const CustomCell = (props) => {
    const { column } = props;

    let textColor = "green"
    if (props.row.type === 'D') textColor = "red"

    if (column.name === 'value'){
      return (
        <Table.Cell {...props}>
          <td style={{ color: textColor }}>{props.row.value}</td>
        </Table.Cell>
      );
    }

    if (column.name === 'valuePayment'){
      return (
        <Table.Cell {...props}>
          <td style={{ color: textColor }}>{props.row.valuePayment}</td>
        </Table.Cell>
      );
    }

    if (column.name === 'delete') {
      return (
        <Table.Cell onClick={() => handleClick(props)} {...props}>
          &nbsp;&nbsp;
          <FiTrash title="Clique para deletar este movimento " />
        </Table.Cell>
      );
    }

    if (column.name === 'description') {
      return (
        <Table.Cell {...props}>
        <td title={props.row.description}>{props.row.description}</td>
        </Table.Cell>
      );
    }

    if (column.name === 'edit') {
      if(props.row.dealDetailId == null)
      {
        return (
          <Table.Cell onClick={() => handleClick(props)} {...props}>
            &nbsp;&nbsp;
            <FiEdit title="Clique para editar este movimento " />
          </Table.Cell>
        );
      }

      return (
        <Table.Cell onClick={() => handleClick(props)} {...props}>
          &nbsp;&nbsp;
          <FaHandshake title="Clique para editar este acordo " />
        </Table.Cell>
      );
    }

    return <Table.Cell {...props} />;
  }


  const handleClick = (props: any) => {
    if (props.column.name === 'edit')
    {
      if(props.row.dealDetailId == null)
        EditFinance(props.row.id)
      else
      {
        setAccountId(props.row.accountId)
        setInstallmentNum(props.row.installmentNum)
        setDealDetailId(props.row.dealDetailId)
        setIsDeal(true)
      }
    }

    if (props.column.name === 'delete')
      DeleteFinance(props.row.id)
  }


  const handleCloseModalAndReload = () => {
    setTypeMovement('')
    setMovementId(0)
    setStatePage('')
    LoadFinance()
  }


  const handleCloseModal = () => {
    setTypeMovement('')
    setStatePage('')
    setMovementId(0)
  }


  const handleIsSaving = (state: boolean) => {
    setStatePage(state? "saving": "")
  }


  const handleOpenModal = (typeMoviment: string) => {
    // validate type order
    if ((matterId??0) == 0){
      addToast({
        type: "info",
        title: "Operação NÃO realizada",
        description:  'É necessário salvar o processo antes de gravar o pedido'
      })
      setTypeMovement('')
      return false;
    }

    if (isMOBILE){
      addToast({
        type: "info",
        title: "Operação NÃO realizada",
        description:  'Este módulo não esta disponível na versão mobile. Para utilizar é necessário estar em um computador ou notebook'
      })
      setTypeMovement('')
      return false;
    }

    setTypeMovement(typeMoviment)
  }


  const handleRedirect = useCallback(async() => {
    history.push(`/financeiro/deal/account=${accountId}/installment=${installmentNum}/id=${dealDetailId}`);
  }, [accountId, installmentNum, dealDetailId]);


  if (isLoading) {
    return (
      <Container>
        <div className="waiting">
          <Loader size={30} color="var(--blue-twitter)" />
        </div>
      </Container>
    )
  }


  return (
    <>
      <Container>
        <header>
          <div className='buttons'>
            <button
              className="buttonLinkClick"
              title="Clique para incluir uma nova despesa"
              type="submit"
              onClick={() => handleOpenModal('R')}
            >
              <GoPlus />
              Nova Receita
            </button>

            <button
              className="buttonLinkClick"
              title="Clique para incluir uma nova receita"
              type="submit"
              onClick={() => handleOpenModal('D')}
            >
              <GoDash />
              Nova Despesa
            </button>
          </div>

          <div className='totals'>
            Receitas:
            <span>
              &nbsp;&nbsp;&nbsp;
              {totalReceita}
            </span>
            &nbsp;&nbsp;&nbsp;
            Despesas:
            <span>
              &nbsp;
              {totalDespesa}
            </span>
          </div>
        </header>
        <br />

        <GridSubContainer>
          <Grid
            rows={listFinance}
            columns={columns}
          >
            <PagingState
              defaultCurrentPage={0}
              pageSize={pageSize}
              onPageSizeChange={setPageSize}
            />
            <IntegratedPaging />
            <DateTypeProvider for={dateColumns} />
            <Table
              cellComponent={CustomCell}
              messages={languageGridEmpty}
              columnExtensions={(isMOBILE?tableColumnExtensionsDevice: tableColumnExtensions)}
            />
            <TableHeaderRow />
            <PagingPanel
              messages={languageGridPagination}
              pageSizes={pageSizes}
            />
          </Grid>
        </GridSubContainer>

        {typeMovement != '' && (
          <FinancialModal callbackFunction={{
              movementId,
              matterId,
              accountId,
              typeMovement,
              handleCloseModalAndReload,
              handleCloseModal,
              handleIsSaving
            }}
          />
        )}
      </Container>

      {showMessageDelete && (
        <ConfirmBoxModal
          title="Deletar Financeiro"
          caller="matterFinanceDelete"
          buttonOkText='Excluir Este'
          buttonCancelText='Excluir Todos'
          showButtonCancel
          message="Este movimento está parcelado, deseja excluir também as outras parcelas ? "
        />
      )}

      {isDeal && (
        <ConfirmBoxModal
          title="Abrir Acordo"
          caller="deal"
          buttonOkText='Sim'
          buttonCancelText='Não'
          message="Este movimento faz parte de um acordo, deseja ser direcionado para a tela de edição de acordos ? "
        />
      )}

      {(statePage != '') && (
        <>
          <Overlay />
          <div className='waitingMessage'>
            <LoaderWaiting size={15} color="var(--blue-twitter)" />
            &nbsp;&nbsp;
            Aguarde..
          </div>
        </>
      )}

      {(typeMovement) && <Overlay /> }
    </>
  )
}

export default Finance
