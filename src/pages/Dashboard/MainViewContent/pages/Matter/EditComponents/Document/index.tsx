/* eslint-disable react/jsx-indent */
/* eslint-disable jsx-a11y/label-has-associated-control */
import ConfirmBoxModal from 'components/ConfirmBoxModal';
import Select from 'react-select';
import React, { useEffect, useState } from 'react';
import { Grid, Table, TableHeaderRow, TableSelection } from '@devexpress/dx-react-grid-material-ui';
import { DataTypeProvider, SelectionState, IntegratedSelection } from '@devexpress/dx-react-grid';
import { format } from 'date-fns';
import { FiEdit, FiTrash, FiSave } from 'react-icons/fi'
import { MdBlock } from 'react-icons/md'
import Loader from 'react-spinners/ClipLoader';
import LoaderWaiting from 'react-spinners/ClipLoader';
import { GridSubContainer, Overlay } from 'Shared/styles/GlobalStyle';
import { languageGridEmpty, loadingMessage, noOptionsMessage } from 'Shared/utils/commonConfig';
import { FormatDate, selectStyles, useDelay } from 'Shared/utils/commonFunctions';
import { useToast } from 'context/toast';
import { useConfirmBox } from 'context/confirmBox';
import { Container } from './styles';
import { DeleteDocument, ListDocumentType, ListMatterDocuments, SaveDocument } from '../Services/MatterDocumentData';
import { IMatterDocumentData, ISelectData } from "../../../Interfaces/IMatter"

const Document = (props) => {

  const { matterId, load } = props;
  const { addToast } = useToast();
  const { handleConfirmMessage, handleCancelMessage, isCancelMessage, isConfirmMessage } = useConfirmBox();
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [statePage, setStatePage] = useState<string>('')
  const [documentId, setDocumentId] = useState<number>(0)
  const [documentTerm, setDocumentTerm] = useState<string>('')
  const [documentType, setDocumentType] = useState<number>(0)
  const [documentDate, setDocumentDate] = useState<string>(FormatDate(new Date(), 'yyyy-MM-dd'))
  const [documentDesc, setDocumentDesc] = useState<string>('')
  const [selection, setSelection] = useState<Array<number | string>>([])
  const [documentTypeList, setDocumentTypeList] = useState<ISelectData[]>([])
  const [documentMatterList, setDocumentMatterList] = useState<IMatterDocumentData[]>([])
  const accessCode = localStorage.getItem('@GoJur:accessCode')

  useEffect(() => {

    if (load && isLoading){
      LoadMatterDocuments()
      LoadDocumentType()
    }
  }, [isLoading, load])

  const LoadMatterDocuments = async () => {

    const response = await ListMatterDocuments(matterId)
    setDocumentMatterList(response.data)
    setIsLoading(false)
  }

  const LoadDocumentType = async () => {

    const response = await ListDocumentType(documentTerm)

    const listDocumentTypeList: ISelectData[] = [];
    response.data.map((item) => {
      listDocumentTypeList.push({ id: item.documentTypeId, label: item.documentTypeDescription })
      return listDocumentTypeList;
    })

    setDocumentTypeList(listDocumentTypeList)
    setIsLoading(false)
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

  const CustomCell = (props) => {

    const { column } = props;

    if (column.name === 'edit') {
      return (
        <Table.Cell onClick={() => handleClick(props)} {...props}>
          &nbsp;&nbsp;
          <FiEdit title="Clique para edita o documento " />
        </Table.Cell>
      );
    }

    if (column.name === 'forumVara'){
      return (
        <Table.Cell onClick={() => handleClick(props)} {...props}>
          <td>
            {props.row.nomCourt}
            {' '}
            -
            {' '}
            {props.row.nomVara}
          </td>
        </Table.Cell>
      );
    }

    return <Table.Cell {...props} />;
  };

  const handleClick = (props: any) => {

    if (props.column.name === 'edit'){
      handleEditDocument(props.row.id)
    }
  }

  const handleEditDocument = async(id: number) => {

    if (statePage.length > 0) return;

    const document = documentMatterList.find(item => item.id === id)
    if (document){
      setStatePage('editing')
      setDocumentId(document.id)
      setDocumentDesc(document.description)
      documentTypeList.push({
        id: document.documentTypeId.toString(),
        label: document.documentTypeDesc??""
      });
      setDocumentType(document.documentTypeId)
      if (document.date) setDocumentDate(FormatDate(new Date(document.date), "yyyy-MM-dd"))
    }
  };

  const ResetStates = () => {
    setDocumentId(0)
    setDocumentType(0)
    setDocumentDate(FormatDate(new Date(), 'yyyy-MM-dd'))
    setDocumentDesc('')
    setSelection([])
    setIsLoading(false)
    setStatePage('')
  }

  const handleSave = async () => {

    try
    {
      if ((matterId??0) == 0){
        addToast({
          type: "info",
          title: "Operação NÃO realizada",
          description:  'É necessário salvar o processo antes de gravar o pedido'
        })
        return false;
      }

      if (documentType == 0){
        addToast({
          type: "info",
          title: "Operação NÃO realizada",
          description:  'O campo Tipo de documento deve ser preenchido'
        })
        return false;
      }

      if (!documentDate){
        addToast({
          type: "info",
          title: "Operação NÃO realizada",
          description:  'O campo data deve ser preenchido'
        })
        return false;
      }

      if (documentDesc.length == 0){
        addToast({
          type: "info",
          title: "Operação NÃO realizada",
          description:  'O campo descrição deve ser preenchido'
        })
        return false;
      }

    // build save object
    let token = localStorage.getItem('@GoJur:token')
    if (!token) token = "";

    const data: IMatterDocumentData = {
      id: documentId,
      matterId,
      documentTypeId: documentType || 0,
      date: documentDate,
      description: documentDesc,
      token
    }

    // mark flag as saving
    setStatePage('saving')

    // save
    await SaveDocument(data)

    // reload
    await LoadMatterDocuments()

    addToast({
      type: "success",
      title: "Operação realizada com sucesso",
      description:  'O Documento foi salvo com sucesso'
    })

    ResetStates();

  }catch(e: any){
      addToast({
        type: "info",
        title: "Operação NÃO realizada",
        description:  "Houve uma falha na gravação do pedido do processo"
      })

      ResetStates();

      return;
    }
  }

  const handleDelete = async() => {

    try {

      setStatePage('deleting')

      let documentIds = "";
      selection.map(item => {

        const order = documentMatterList[item]
        if (order){
          documentIds += `${order.id},`
        }

        return;
      })

      // delete lot
      await DeleteDocument(documentIds)

      // reload page
      await LoadMatterDocuments();

      // clear state
      ResetStates();

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

  const handleCheckDelete = () => {

    // validation
    if (selection.length == 0){
      addToast({
        type: "info",
        title: "Operação NÃO realizada",
        description:  "Não existem documentos selecionados para exclusão"
      })

      return;
    }

    setStatePage('checkDeleting')
  }

  useDelay(() => {

    if (documentTerm.length > 0)
    LoadDocumentType()

  }, [documentTerm], 750)

  const handleDocumentTypeTermChange = async (item) => {

    if (item){
      setDocumentType(item.id)
    }else{
      setDocumentType(0)
      await LoadDocumentType()
    }
  }

  const columns = [
    { name: 'description',    title: ' Descrição '},
    { name: 'date',           title: ' Data '},
    { name: 'edit',           title: ' Editar '}
  ];

  const [tableColumnExtensions] = useState([
    { columnName: 'description',    width: '67%' },
    { columnName: 'date',           width: '15%' },
    { columnName: 'edit',           width: '10%' },
  ]);

  const [dateColumns] = useState(['date']);
  const DateFormatter = ({ value }) => format(new Date(value), 'dd/MM/yyyy');
  const DateTypeProvider = props => (
    <DataTypeProvider formatterComponent={DateFormatter} {...props} />
  );

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

        <section>

          <label className='comboData'>
            Tipo do Documento
            <Select
              isSearchable
              isClearable
              value={documentType == 0? null: documentTypeList.find(item => item.id === documentType.toString())}
              onChange={handleDocumentTypeTermChange}
              onInputChange={(term) => setDocumentTerm(term)}
              placeholder="Selecione um tipo"
              loadingMessage={loadingMessage}
              noOptionsMessage={noOptionsMessage}
              styles={selectStyles}
              options={documentTypeList}
            />
          </label>

          <label>
            Data do Pedido
            <input
              type='date'
              value={documentDate}
              onChange={(e) => setDocumentDate(e.target.value)}
            />
          </label>

        </section>

        <section>

          <label>
            Descrição
            <textarea
              rows={5}
              value={documentDesc}
              onChange={(e) => setDocumentDesc(e.target.value)}
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
            rows={documentMatterList}
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
          title="Exclusão de Documentos do Processo"
          caller="matterOrderDocuments"
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

export default Document

