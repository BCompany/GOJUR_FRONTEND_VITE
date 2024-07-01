/* eslint-disable react/jsx-indent */
/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useCallback, useEffect, useState } from 'react';
import { useModal } from 'context/modal';
import { FiSave } from 'react-icons/fi'
import IntlCurrencyInput from "react-intl-currency-input"
import { FiEdit, FiTrash } from 'react-icons/fi'
import { GoPlus } from 'react-icons/go'
import LoaderWaiting from 'react-spinners/ClipLoader';
import { useConfirmBox } from 'context/confirmBox';
import ConfirmBoxModal from 'components/ConfirmBoxModal';
import { DataTypeProvider, SelectionState, IntegratedSelection } from '@devexpress/dx-react-grid';
import { Grid, Table, TableHeaderRow, TableSelection } from '@devexpress/dx-react-grid-material-ui';
import { GridSubContainer, Overlay } from 'Shared/styles/GlobalStyle';
import { MdBlock } from 'react-icons/md'
import Loader from 'react-spinners/ClipLoader';
import Select from 'react-select'
import { languageGridEmpty, loadingMessage, noOptionsMessage } from 'Shared/utils/commonConfig';
import { currencyConfig, FormatDate, selectStyles, useDelay } from 'Shared/utils/commonFunctions';
import { useToast } from 'context/toast';
import { format } from 'date-fns';
import { Container } from './styles';
import { DeleteOrder, ListMatterOrder, ListOrderTypes, SaveOrder } from '../Services/MatterOrderData';
import { IMatterOrderData, ISelectData } from '../../../Interfaces/IMatter';
import MatterDemandTypeEdit from '../../MatterDemandType/Modal';

const Order = (props) => {

  const { matterId, load } = props;
  const { addToast } = useToast();
  const { handleConfirmMessage, handleCancelMessage, isCancelMessage, isConfirmMessage } = useConfirmBox();
  const { handleCaller, handleModalActive, handleModalActiveId } = useModal();

  // form
  const [ orderId, setOrderId] = useState<number>(0)
  const [ orderTypeId, setOrderTypeId] = useState<number>(0)
  const [ orderValue, setOrderValue] = useState<number>(0)
  const [ orderDate, setOrderDate] = useState<string>(FormatDate(new Date(), 'yyyy-MM-dd'))
  const [ orderDetails, setOrderDetails] = useState<string>('')
  const [ flg_condenacao, setFlg_condenacao] = useState<boolean>(false)

  // control
  const [ isLoading, setIsLoading] = useState<boolean>(true)
  const [ statePage, setStatePage] = useState<string>('')
  const [ orderTypeTerm , setOrderTypeTerm] = useState('');

  // collectons
  const [ selection, setSelection] = useState<Array<number | string>>([]);
  const [ matterOrderDataList, setMatterOrderDataList] = useState<IMatterOrderData[]>([])
  const [ listOrderTypes, setListOrderTypes ] = useState<ISelectData[]>([])
  const accessCode = localStorage.getItem('@GoJur:accessCode')

  useEffect(() => {

    if (load && isLoading){
      LoadMatterOrders();
      LoadOrdersType()
    }

  }, [isLoading, load])

  const handleClick = (props: any) => {

    if (props.column.name === 'edit'){
      handleEditOrder(props.row.id)
    }
  }

  const LoadMatterOrders = async () => {

    const response = await ListMatterOrder(matterId)
    setMatterOrderDataList(response.data)

    setIsLoading(false)
  }

  const ResetStates = () => {
    setStatePage('')
    setOrderId(0)
    setOrderValue(0)
    setFlg_condenacao(false)
    setOrderTypeId(0)
    setOrderDate(FormatDate(new Date(), 'yyyy-MM-dd'))
    setOrderDetails('')
    setSelection([])
  }

  const LoadOrdersType = async () => {

    const response = await ListOrderTypes(orderTypeTerm)

    const listOrderTypes: ISelectData[] = [];
    response.data.map((item) => {
      listOrderTypes.push({ id: item.id, label: item.value })
      return listOrderTypes;
    })

    setListOrderTypes(listOrderTypes)
  }

  useDelay(() => {

    if (orderTypeTerm.length > 0)
      LoadOrdersType()

  }, [orderTypeTerm], 750)

  const handleEditOrder = async(id: number) => {

    if (statePage.length > 0) return;

    const order = matterOrderDataList.find(item => item.id === id)
    if (order){
      setStatePage('editing')
      setOrderId(order.id)
      setOrderValue(order.orderValue)
      setFlg_condenacao(order.flg_condenacao === "Sim")

      // if not exists on list add
      const exists = listOrderTypes.find(item => item.id === order.orderTypeId.toString())
      if (!exists){
        listOrderTypes.push({
          id: order.orderTypeId.toString(),
          label: order.orderTypeDesc??""
        });
      }

      setOrderTypeId(order.orderTypeId)

      setOrderDetails(order.orderDetails)
      if (order.orderDate) setOrderDate(FormatDate(new Date(order.orderDate), "yyyy-MM-dd"))
    }
  };

  const columns = [
    { name: 'orderTypeDesc',        title: ' Descrição '},
    { name: 'orderValue',           title: ' Valor '},
    { name: 'orderDate',            title: ' Data '},
    { name: 'flg_condenacao',       title: ' Condenação '},
    { name: 'orderDetails',         title: ' Observações '},
    { name: 'edit',                 title: ' Editar '}
  ];

  const [dateColumns] = useState(['orderDate']);
  const [currencyColumns] = useState(['orderValue']);

  // format value to date format
  const DateFormatter = ({ value }) => format(new Date(value), 'dd/MM/yyyy');
  const DateTypeProvider = props => (
    <DataTypeProvider formatterComponent={DateFormatter} {...props} />
  );

  // format value to monetary format
  const CurrencyFormatter = ({ value }) => ( <td style={{color:'var(--secondary)'}}>{value.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})}</td> );
  const CurrencyTypeProvider = props => (
    <DataTypeProvider
      formatterComponent={CurrencyFormatter}
      {...props}
    />
  );

  const CustomCell = (props) => {

    const { column } = props;

    if (column.name === 'edit') {
      return (
        <Table.Cell onClick={() => handleClick(props)} {...props}>
          &nbsp;&nbsp;
          <FiEdit title="Clique para editar " />
        </Table.Cell>
      );
    }

    return <Table.Cell {...props} />;
  }

  const handleCheckDelete = () => {

    // validation
    if (selection.length == 0){
      addToast({
        type: "info",
        title: "Operação NÃO realizada",
        description:  "Não existem pedidos selecionados para exclusão"
      })

      return;
    }

    setStatePage('checkDeleting')
  }

  const handleSave = useCallback(async() => {

    try{

        // validate type order
        if ((matterId??0) == 0){
          addToast({
            type: "info",
            title: "Operação NÃO realizada",
            description:  'É necessário salvar o processo antes de gravar o pedido'
          })
          return false;
        }


      // validate type order
      if (orderTypeId  == 0){
        addToast({
          type: "info",
          title: "Operação NÃO realizada",
          description:  'O campo Tipo de Pedido deve ser preenchido'
        })
        return false;
      }

      // validate date
      if (orderDate.length == 0){
        addToast({
          type: "info",
          title: "Operação NÃO realizada",
          description:  'Data inválida ou não definida'
        })
        return false;
      }

      // build save object
      let token = localStorage.getItem('@GoJur:token')
      if (!token) token = "";

      const data: IMatterOrderData = {
        id: orderId,
        matterId,
        orderTypeId,
        orderValue,
        orderDate: new Date(orderDate),
        flg_condenacao: flg_condenacao? "S": "N",
        orderDetails,
        token
      }

      // mark flag as saving
      setStatePage('saving')

      // save
      await SaveOrder(data)

      // reload
      await LoadMatterOrders();

      addToast({
        type: "success",
        title: "Operação realizada com sucesso",
        description:  'O Pedido salvo com sucesso'
      })

      ResetStates();
    }
    catch(e: any){
      addToast({
        type: "info",
        title: "Operação NÃO realizada",
        description:  "Houve uma falha na gravação do pedido do processo"
      })

      ResetStates();

      return;
    }

  }, [flg_condenacao, matterId, orderDate, orderDetails, orderId, orderTypeId, orderValue])

  const handleDelete = async() => {

    try {

      setStatePage('deleting')

      let ordersDeleteIds = "";
      selection.map(item => {

        const order = matterOrderDataList[item]
        if (order){
          ordersDeleteIds += `${order.id},`
        }

        return;
      })

      // delete lot
      await DeleteOrder(ordersDeleteIds)

      // reload page
      await LoadMatterOrders();

      setStatePage('')
      setSelection([])

    } catch (err:any) {
      console.log(err)

      addToast({
        type: "error",
        title: "Falha ao excluir grupo de terceiro.",
        description:  err.response.data.Message
      })

      setStatePage('')
    }
  };

  const handleCancel = () => {

    ResetStates();
  }

  const handleOrderTypeChange = async (item) => {

    if (item){
      setOrderTypeId(item.id)
    }else{
      setOrderTypeId(0)
      await LoadOrdersType()
    }
  }

  useEffect(() => {

  if (isConfirmMessage){

    if (statePage === 'checkDeleting'){
      handleDelete()
    }

    handleConfirmMessage(false)
  }

  },[isConfirmMessage])

  useEffect(() => {
    if (isCancelMessage){
      setStatePage('')
    }

    handleCancelMessage(false)

  },[isCancelMessage])

  const handleMatterOrderTypeCallBack = useCallback((response: any) => {

    listOrderTypes.push({
      id: response.id,
      label: response.value
    });

    setListOrderTypes(listOrderTypes)
    setOrderTypeId(Number(response.id));

  }, [])

  const handleOpenModal = () => {
    handleModalActiveId(0)
    handleCaller('matterDemandTypeModal')
    handleModalActive(true)
  }

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

        <MatterDemandTypeEdit
          callerOrigin='matterOrder'
          callbackFunction={{handleMatterOrderTypeCallBack}}
        />

        <section>

          <label className='comboData'>
            Tipo do Pedido
            <Select
              isSearchable
              isClearable
              value={orderTypeId == 0? null: listOrderTypes.find(item => item.id === orderTypeId.toString())}
              onChange={handleOrderTypeChange}
              onInputChange={(term) => setOrderTypeTerm(term)}
              placeholder="Selecione um tipo"
              loadingMessage={loadingMessage}
              noOptionsMessage={noOptionsMessage}
              styles={selectStyles}
              options={listOrderTypes}
            />
            {((accessCode??"").includes('CFGMDETP') || (accessCode??"") == 'adm') && (
              <GoPlus onClick={handleOpenModal} title='Clique para incluir um novo tipo de pedido' />
            )}
          </label>

          <label>
            Valor do Pedido
            <IntlCurrencyInput
              currency="BRL"
              config={currencyConfig}
              onChange={(e, value) => setOrderValue(value)}
              value={orderValue}
            />
          </label>

          <label>
            Data do Pedido
            <input
              type='date'
              value={orderDate}
              onChange={(e) => setOrderDate(e.target.value)}
            />
          </label>

          <label style={{textAlign: 'center'}}>
            Condenação
            <input
              type='checkbox'
              onChange={() => setFlg_condenacao(!flg_condenacao)}
              checked={flg_condenacao}
            />
          </label>

        </section>

        <section>

          <label>
            Observações
            <input
              onChange={(e) => setOrderDetails(e.target.value)}
              value={orderDetails}
              maxLength={100}
              // style={{minHeight: '3rem'}}
            />
          </label>

        </section>

        <footer>

          {(accessCode?.includes('MATCONS') || accessCode?.includes('MATLEGAL') || accessCode === 'adm') && (
            <>
              <button
                type='submit'
                onClick={handleSave}
                className='buttonLinkClick'
              >
                <FiSave />
                Salvar
              </button>

              {statePage == '' && (
                <button
                  type='button'
                  onClick={handleCheckDelete}
                  className='buttonLinkClick'
                >
                  <FiTrash />
                  Excluir
                </button>
              )}
            </>
          )}

          {statePage == 'editing' && (
            <button
              type='button'
              onClick={handleCancel}
              className='buttonLinkClick'
            >
              <MdBlock />
              Cancelar
            </button>
          )}

        </footer>

        <GridSubContainer style={{opacity:(statePage === 'editing'? '0.5': '1')}}>
          <Grid
            rows={matterOrderDataList}
            columns={columns}
          >
            <SelectionState
              selection={selection}
              onSelectionChange={(e) => setSelection(e)}
            />

            <DateTypeProvider for={dateColumns} />
            <CurrencyTypeProvider for={currencyColumns} />
            <Table
              cellComponent={CustomCell}
              messages={languageGridEmpty}
            />
            <TableHeaderRow />
            <IntegratedSelection />
            <TableSelection showSelectAll />
          </Grid>

        </GridSubContainer>

      </Container>

      {statePage === 'checkDeleting' && (
        <ConfirmBoxModal
          title="Exclusão de Pedidos do Processo"
          caller="matterOrderDelete"
          message="Confirma a exclusão de todos os itens selecionados ?"
        />
      )}

      {(statePage === 'deleting' || statePage === 'saving') && (
        <>
          <Overlay />
          <div className='waitingMessage'>
            <LoaderWaiting size={15} color="var(--blue-twitter)" />
            &nbsp;&nbsp;
            {statePage === 'deleting' && <span>Deletando...</span>}
            {statePage === 'saving' && <span>Salvando...</span>}
          </div>
        </>
      )}

    </>
  )
}

export default Order
