/* eslint-disable no-param-reassign */
/* eslint-disable react/jsx-one-expression-per-line */
/* eslint-disable react/jsx-indent */
/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useCallback, useEffect, useState } from 'react';
import { useModal } from 'context/modal';
import { FiSave } from 'react-icons/fi'
import { FiEdit, FiTrash } from 'react-icons/fi'
import { GoPlus } from 'react-icons/go'
import LoaderWaiting from 'react-spinners/ClipLoader';
import { useConfirmBox } from 'context/confirmBox';
import { useDevice } from "react-use-device";
import ConfirmBoxModal from 'components/ConfirmBoxModal';
import { Controller, useForm } from 'react-hook-form';
import { DataTypeProvider, SelectionState, IntegratedSelection } from '@devexpress/dx-react-grid';
import { Grid, Table, TableHeaderRow, TableSelection } from '@devexpress/dx-react-grid-material-ui';
import { GridSubContainer, Overlay } from 'Shared/styles/GlobalStyle';
import { MdBlock } from 'react-icons/md'
import Loader from 'react-spinners/ClipLoader';
import Select from 'react-select'
import { languageGridEmpty, loadingMessage, noOptionsMessage } from 'Shared/utils/commonConfig';
import { FormatDate, selectStyles, useDelay } from 'Shared/utils/commonFunctions';
import { useToast } from 'context/toast';
import { format } from 'date-fns';
import { Container } from './styles';
import { IMatterCourtData, ISelectData } from '../../../Interfaces/IMatter';
import { DeleteCourt, ListCourt, ListMatterCourt, ListVara, SaveCourt } from '../Services/MatterCourtData';
import CourtEdit from '../../Court/Modal';

const Court = (props) => {

  const { matterId, load, handleReloadFollowTab } = props;

  const { addToast } = useToast();
  const { isMOBILE } = useDevice();
  const { register, handleSubmit, reset, setValue, control } = useForm()
  const { handleConfirmMessage, handleCancelMessage, isCancelMessage, isConfirmMessage } = useConfirmBox();
  const { handleCaller, handleModalActive, handleModalActiveId } = useModal();

  // control
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [statePage, setStatePage] = useState<string>('')
  const [courtTerm, setCourtTerm] = useState('');
  const [varaTerm, setVaraTerm] = useState('');

  // collectons
  const [currentItem, setCurrentItem] = useState<IMatterCourtData | null>()
  const [selection, setSelection] = useState<Array<number | string>>([])
  const [courtDataList, setCourtDataList] = useState<ISelectData[]>([])
  const [varaDataList, setVaraDataList] = useState<ISelectData[]>([])
  const [matterCourtDataList, setMatterCourtDataList] = useState<IMatterCourtData[]>([])
  const accessCode = localStorage.getItem('@GoJur:accessCode')

  useEffect(() => {

    if (load && isLoading) {
      LoadCourtData('');
      LoadVaraData('')
      ListMatterCourtData()
    }

  }, [isLoading, load])

  const ListMatterCourtData = async () => {

    const response = await ListMatterCourt(matterId)

    setMatterCourtDataList(response.data)

    // default instance
    setValue('instance', { label: 'Primeira', id: 1 })

    setIsLoading(false)
  }

  const LoadCourtData = async (term) => {

    const response = await ListCourt(term)

    const listCourtResult: ISelectData[] = [];

    response.data.map((item) => {
      listCourtResult.push({ id: item.forumId, label: item.forumName })
      return listCourtResult;
    })

    setCourtDataList(listCourtResult)
  }

  const LoadVaraData = async (term: string) => {

    const response = await ListVara(term)

    const listCourtResult: ISelectData[] = [];
    response.data.map((item) => {
      listCourtResult.push({ id: item.id, label: item.value })
      return listCourtResult;
    })

    setVaraDataList(listCourtResult)

    setIsLoading(false)
  }

  const instanceOptions = [
    { id: '1', label: ' Primeira ' },
    { id: '2', label: ' Segunda ' },
    { id: '3', label: ' Terceira ' },
    { id: '4', label: ' Quarta ' },
  ];

  const columns = [
    { name: 'description', title: ' Fórum / Vara ' },
    { name: 'startDate', title: ' Início ' },
    { name: 'edit', title: ' Editar ' }
  ];

  const [tableColumnExtensions] = useState([
    { columnName: 'forumVara', width: '67%' },
    { columnName: 'startDate', width: '15%' },
    { columnName: 'edit', width: '10%' },
  ]);

  const [dateColumns] = useState(['startDate']);
  const DateFormatter = ({ value }) => value ? format(new Date(value), 'dd/MM/yyyy') : '';
  const DateTypeProvider = props => (
    <DataTypeProvider formatterComponent={DateFormatter} {...props} />
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

    if (column.name === 'forumVara') {
      return (
        <Table.Cell onClick={() => handleClick(props)} {...props}>
          <td>{props.row.nomCourt} - {props.row.nomVara}</td>
        </Table.Cell>
      );
    }

    return <Table.Cell {...props} />;
  };

  const handleClick = (props: any) => {

    if (props.column.name === 'edit') {
      handleEditCourt(props.row.id)
    }
  }

  const handleMatterCourtCallBack = useCallback((response: any) => {

    // append new item to combobox and keep it selected
    const newItem = { id: response.forumId, label: response.forumName }
    courtDataList.push(newItem);
    setValue('court', newItem)

  }, [courtDataList, setValue])

  const handleInputTextChange = (type: string, term: string) => {

    if (type === 'court') {
      setCourtTerm(term)
    }

    if (type === 'vara') {
      setVaraTerm(term)
    }

    return;
  }

  useDelay(() => {

    if (!isLoading)
      LoadCourtData(courtTerm)

  }, [isLoading, courtTerm], 750)

  useDelay(() => {

    if (!isLoading)
      LoadVaraData(varaTerm)

  }, [isLoading, varaTerm], 750)

  const handleCheckDelete = () => {

    // validation
    if (selection.length == 0) {
      addToast({
        type: "info",
        title: "Operação NÃO realizada",
        description: "Não existem fórum / instância selecionados para exclusão"
      })

      return;
    }

    setStatePage('checkDeleting')
  }

  const handleEditCourt = async (id: number) => {

    if (statePage.length > 0) return;

    const matterCourt = matterCourtDataList.find(item => item.id === id)
    if (matterCourt) {

      setStatePage('editing')

      setCurrentItem(matterCourt);

      if (matterCourt.court)
        setValue('court', {
          id: matterCourt.court.id,
          label: matterCourt.court.label
        })


      if (matterCourt.vara)
        setValue('vara', {
          id: matterCourt.vara.id,
          label: matterCourt.vara.label
        })

      if (matterCourt.instance)
        setValue('instance', {
          id: matterCourt.instance.id,
          label: matterCourt.instance.label
        })

      setValue('numVara', matterCourt.numVara)
      setValue('numAndar', matterCourt.numAndar)
      setValue('numberInstance', matterCourt.numberInstance)
      setValue('isCurrentInstance', matterCourt.isCurrentInstance)

      if (matterCourt.startDate)
        setValue('startDate', FormatDate(new Date(matterCourt.startDate), "yyyy-MM-dd"))

      if (matterCourt.endDate)
        setValue('endDate', FormatDate(new Date(matterCourt.endDate), "yyyy-MM-dd"))
    }
  };

  const handleCancel = () => {
    ResetValues();
  }

  const handleSave = async (data) => {

    try {
      // validate type order
      if ((matterId ?? 0) == 0) {
        addToast({
          type: "info",
          title: "Operação NÃO realizada",
          description: 'É necessário salvar o processo antes de gravar um fórum / instância'
        })
        return false;
      }

      if (!data.court) {
        addToast({
          type: "info",
          title: "Operação NÃO realizada",
          description: 'o campo Fórum deve ser definido'
        })
        return false;
      }

      if (!data.instance) {
        addToast({
          type: "info",
          title: "Operação NÃO realizada",
          description: 'o campo Instância deve ser definido'
        })
        return false;
      }

      if (!data.vara) {
        addToast({
          type: "info",
          title: "Operação NÃO realizada",
          description: 'o campo Vara deve ser definido'
        })
        return false;
      }

      // mark flag as saving
      setStatePage('saving')

      // associate matter id
      data.matterId = matterId;

      // associate id if is a edition
      if (currentItem) {
        data.id = currentItem.id
      }

      // save
      await SaveCourt(data)

      // reload
      await ListMatterCourtData()

      addToast({
        type: "success",
        title: "Operação realizada com sucesso",
        description: 'O Fórum/instância foi salvo com sucesso'
      })

      // clear fields
      ResetValues();

      // reload follow list
      handleReloadFollowTab()

    }
    catch (ex: any) {
      addToast({
        type: "info",
        title: "Operação NÃO realizada",
        description: "Houve uma falha na gravação do Fórum/Instância"
      })

      setStatePage('')

      return;
    }
  }

  const handleDelete = async () => {

    try {

      setStatePage('deleting')

      let ordersDeleteIds = "";
      selection.map(item => {

        const order = matterCourtDataList[item]
        if (order) {
          ordersDeleteIds += `${order.id},`
        }

        return;
      })

      // delete lot
      await DeleteCourt(ordersDeleteIds)

      // reload page
      await ListMatterCourtData();

      // clear fields
      ResetValues();

      // reload follow list
      handleReloadFollowTab()

    } catch (err: any) {
      console.log(err)

      addToast({
        type: "error",
        title: "Falha ao excluir grupo de terceiro.",
        description: err.response.data.Message
      })

      setStatePage('')
    }
  };

  const ResetValues = () => {
    reset();
    setStatePage('')
    setSelection([])
    setValue('court', null)
    setValue('vara', null)
    setValue('instance', null)
    setCurrentItem(null)
  }

  useEffect(() => {

    if (isConfirmMessage) {

      if (statePage === 'checkDeleting') {
        handleDelete()
      }

      handleConfirmMessage(false)
    }

  }, [isConfirmMessage])

  useEffect(() => {
    if (isCancelMessage) {
      setStatePage('')
    }

    handleCancelMessage(false)

  }, [isCancelMessage])

  if (isLoading) {

    return (
      <Container>
        <div className="waiting">
          <Loader size={30} color="var(--blue-twitter)" />
        </div>
      </Container>
    )
  }

  const handleOpenModal = () => {
    handleModalActiveId(0)
    handleCaller('courtModal')
    handleModalActive(true)
  }

  // Matter legal details screeen
  return (
    <>

      <Container>

        <CourtEdit
          callerOrigin='courtModal'
          callbackFunction={{ handleMatterCourtCallBack }}
        />

        <form onSubmit={handleSubmit(handleSave)}>

          <section>

            <label className='comboData'>
              Fórum
              <Controller
                as={Select}
                isClearable
                onInputChange={(term) => handleInputTextChange("court", term)}
                placeholder="Selecione um fórum"
                loadingMessage={loadingMessage}
                noOptionsMessage={noOptionsMessage}
                styles={selectStyles}
                options={courtDataList}
                control={control}
                name="court"
                ref={register}
              />
              {(((accessCode ?? "").includes('CFGCOURT') || (accessCode ?? "") == 'adm')) && (
                <GoPlus onClick={handleOpenModal} title='Clique para incluir um novo fórum' />
              )}
            </label>

            <label className='comboData'>
              Instância
              <Controller
                as={Select}
                onInputChange={(term) => handleInputTextChange("court", term)}
                placeholder="Selecione um fórum"
                loadingMessage={loadingMessage}
                noOptionsMessage={noOptionsMessage}
                styles={selectStyles}
                options={instanceOptions}
                control={control}
                name="instance"
                ref={register}
              />
            </label>

            <label>
              Número Vara
              <input
                type='number'
                name="numVara"
                ref={register}
              />
            </label>

            <label className='comboData'>
              Vara
              <Controller
                as={Select}
                isClearable
                onInputChange={(term) => handleInputTextChange("vara", term)}
                placeholder="Selecione um fórum"
                loadingMessage={loadingMessage}
                noOptionsMessage={noOptionsMessage}
                styles={selectStyles}
                options={varaDataList}
                control={control}
                name="vara"
                ref={register}
              />
            </label>

          </section>

          <section>

            <label>
              Número Novo
              <input
                type='text'
                ref={register}
                name="numberInstance"
              />
            </label>

            <label>
              Andar Vara
              <input
                type='number'
                ref={register}
                name="numAndar"
              />
            </label>

            <label>
              Data Inicial
              <input
                type='date'
                ref={register}
                name="startDate"
              />
            </label>

            <label>
              Data Final
              <input
                type='date'
                ref={register}
                name="endDate"
              />
            </label>

          </section>

          {!isMOBILE && (
            <div className='instance'>
              <label>
                Instância Atual ?
                <input
                  type='checkbox'
                  ref={register}
                  name="isCurrentInstance"
                />
              </label>
            </div>
          )}

          <footer>

            {(accessCode?.includes('MATCONS') || accessCode?.includes('MATLEGAL') || accessCode === 'adm') && (
              <>
                <button
                  type='submit'
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

        </form>

        <GridSubContainer style={{ opacity: (statePage === 'editing' ? '0.5' : '1') }}>
          <Grid
            rows={matterCourtDataList}
            columns={columns}
          >
            <SelectionState
              selection={selection}
              onSelectionChange={(e) => setSelection(e)}
            />

            <DateTypeProvider for={dateColumns} />
            <Table
              cellComponent={CustomCell}
              columnExtensions={tableColumnExtensions}
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
          title="Exclusão de fórum / vara"
          caller="matterCourtDelete"
          useCheckBoxConfirm
          message="ATENÇÃO: Você está removendo uma instância do processo, todos os andamentos que estão atribuidos a ela ficarão sem o fórum associado. Esta operação é IRREVERSÍVEL."
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

export default Court
