/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable no-console */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable no-return-assign */
/* eslint-disable no-alert */
/* eslint-disable react/jsx-one-expression-per-line */

import React, { useCallback, useEffect, useState, UIEvent, ChangeEvent, useRef } from 'react';
import { usePublication } from 'context/publication';
import api from 'services/api';
import Select from 'react-select';
import { FiSave, FiEdit, FiTrash } from 'react-icons/fi';
import { AutoCompleteSelect } from 'Shared/styles/GlobalStyle';
import { selectStyles, useDelay, currencyConfig, FormatDate } from 'Shared/utils/commonFunctions';
import { Grid, Table, TableHeaderRow } from '@devexpress/dx-react-grid-material-ui';
import { languageGridEmpty } from 'Shared/utils/commonConfig';
import LoaderWaiting from 'react-spinners/ClipLoader';
import { useToast } from 'context/toast';
import { loadingMessage, noOptionsMessage } from 'Shared/utils/commonConfig';
import { OverlayPublicationConfiguration } from '../Configuration/styles';
import { Content, GridProfileNames } from './styles';

interface ISelectData {id: string; label: string}
interface IPeopleData {id: string; value: string}
interface profileNameProps { cod_PublicacaoNome: string; cod_PublicacaoNomeUsuarioFiltro: number; nom_Pesquisa: string}

const PublicationNames = () => {
  const { handleSetFilterName } = usePublication();
  const { addToast } = useToast();
  const token = localStorage.getItem('@GoJur:token');
  const [isLoadingComboData, setIsLoadingComboData] = useState<boolean>(false);
  const [profileList, setProfileList] = useState<profileNameProps[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [currentId, setCurrentId] = useState(0);

  const [peopleList, setPeopleList] = useState<ISelectData[]>([]);
  const [peopleId, setPeopleId] = useState('');
  const [peopleValue, setPeopleValue] = useState('');
  const [peopleTerm, setPeopleTerm] = useState('');

  const columns = [{name: 'name', title: 'Nome'}, {name: 'edit', title: 'Editar'}, {name: 'remove', title: 'Apagar'}];
  const [tableColumnExtensions] = useState([{columnName: 'name', width: '70%'}, {columnName: 'edit', width: '15%'}, {columnName: 'remove', width: '15%'}]);

  useEffect(() => {
    LoadPeople('reset')
    LoadProfilesName()
  }, [])


  useDelay(() => {
    if (peopleTerm.length > 0)
      LoadPeople()
  }, [peopleTerm], 500)


  const handlePeopleSelected = (item) => {
    if (item){
      setPeopleId(item.id)
      setPeopleValue(item.label)
    }
    else{
      setPeopleId('')
      LoadPeople('reset')
      setPeopleValue('')
    }
  }


  const LoadPeople = async (stateValue?: string) => {
    if (isLoadingComboData)
      return false

    let filter = stateValue == "initialize"? peopleValue : peopleTerm
    if (stateValue == 'reset')
      filter = ''

    try {
      const response = await api.post<IPeopleData[]>('/PublicacaoNome/Listar', {token})

      const listPeople: ISelectData[] = []

      response.data.map(item => {
        return listPeople.push({ id: item.id, label: item.value })
      })

      setPeopleList(listPeople)
      setIsLoadingComboData(false)
    }
    catch (err:any) {
      console.log(err.response.data.Message)
    }
  }


  const LoadProfilesName = async () => {
    try {
      const response = await api.post<profileNameProps[]>('/PublicacaoNome/ListarFiltroNome',
        {
          page: 1,
          rows: 10,
          filterClause: '',
          token
        },
      )

      setProfileList(response.data)

      if(response.data.length > 0)
        localStorage.setItem('@GoJur:PublicationFilterName', 'filterNameTrue');
      else
        localStorage.setItem('@GoJur:PublicationFilterName', 'filterNameFalse');

    } catch (err) {
      console.log(err)
    }
  }


  const CustomCell = (props) => {
    const { column } = props

    if (column.name === 'name') {
      return (
        <Table.Cell onClick={(e) => console.log(e)} {...props}>
          <div title={props.row.nom_Pesquisa} style={{fontSize:'12px'}}>
            {props.row.nom_Pesquisa}
          </div>
        </Table.Cell>
      )
    }

    if (column.name === 'edit') {
      return (
        <Table.Cell onClick={(e) => Edit(props.row.cod_PublicacaoNomeUsuarioFiltro)} {...props}>
          <FiEdit title="Clique para editar" />
        </Table.Cell>
      )
    }

    if (column.name === 'remove') {
      return (
        <Table.Cell onClick={(e) => Delete(props.row.cod_PublicacaoNomeUsuarioFiltro)} {...props}>
          <FiTrash title="Clique para remover" />
        </Table.Cell>
      )
    }

    return <Table.Cell {...props} />
  }


  const Edit = async (id) => {
    try
    {
      const itemSelected = profileList.find(item => item.cod_PublicacaoNomeUsuarioFiltro == id)

      if(itemSelected){
        setPeopleId(itemSelected.cod_PublicacaoNome)
        setPeopleValue(itemSelected.nom_Pesquisa)
        setCurrentId(itemSelected.cod_PublicacaoNomeUsuarioFiltro)
      }
    }
    catch (err:any)
    {
      setIsLoading(false)
      addToast({type: "error", title: "Operação não realizada", description: err.response.data.Message})
    }
  }


  const Delete = async (item) => {
    try
    {
      setIsLoading(true)
      await api.post('/PublicacaoNome/Apagar', {publicationNameFilterId: item, token})
      LoadProfilesName()
      addToast({ type: "success", title: "Operação realizada com sucesso", description: "Filtro por nome removido" })
      setIsLoading(false)
    }
    catch (err:any)
    {
      setIsLoading(false)
      addToast({type: "error", title: "Operação não realizada", description: err.response.data.Message})
    }
  }


  const Save = useCallback(async () => {
    try
    {
      if(peopleValue == ''){
        ResetValues()
        addToast({type: "info", title: "Operação não realizada", description: 'Favor selecionar um nome para salvar'})
        return
      }

      const save = profileList.filter(dest => dest.cod_PublicacaoNome == peopleId)

      if(save.length > 0){
        ResetValues()
        addToast({type: "info", title: "Operação não realizada", description: 'O registro já existe na lista'})
        return
      }

      setIsLoading(true)

      await api.post('/PublicacaoNome/Salvar', {
        publicationNameFilterId: currentId > 0 ? currentId : 0,
        publicationNameId: peopleId,
        publicationName: peopleValue,
        token
      })

      LoadProfilesName()
      ResetValues()
      setIsLoading(false)
      localStorage.setItem('@GoJur:PublicationFilterName', 'filterNameTrue');
    }
    catch (err:any)
    {
      setIsLoading(false)
      addToast({type: "error", title: "Operação não realizada", description: err.response.data.Message})
    }
  }, [currentId, peopleId, peopleValue])


  const ResetValues = () => {
    setCurrentId(0)
    setPeopleId('')
    setPeopleValue('')
    setPeopleTerm('')
  }


  return (
    <>
      <Content id='Content'>
        <div id='BoxName' className='box'>
          <div className='boxText'>Filtro por nome</div>
          <div>Esta configuração ira exibir por padrão os nomes selecionados na lista de publicações. <br /><br /></div>

          <div id='Elements' style={{width:'100%', height:'85px'}}>
            <div style={{marginLeft:'30%', float:'left', width:'30%', height:'80px'}}>
              <AutoCompleteSelect>
                <p>Nome</p>
                <Select
                  isSearchable
                  value={{ id: peopleId, label: peopleValue }}
                  onChange={handlePeopleSelected}
                  onInputChange={(term) => setPeopleTerm(term)}
                  isClearable
                  placeholder=""
                  isLoading={isLoadingComboData}
                  loadingMessage={loadingMessage}
                  noOptionsMessage={noOptionsMessage}
                  styles={selectStyles}
                  options={peopleList}
                />
              </AutoCompleteSelect>
            </div>
            <div style={{float:'left', width:'30%', height:'80px'}}>
              <button type="submit" className="buttonClick" title="Clique para salvar o filtro por nome" style={{marginLeft:'10px', marginTop:'25px'}} onClick={() => Save()}>
                <FiSave />
                Salvar
              </button>
            </div>
          </div>

          <GridProfileNames id='GridProfileNames'>
            <Grid rows={profileList} columns={columns}>
              <Table
                cellComponent={CustomCell}
                columnExtensions={tableColumnExtensions}            
                messages={languageGridEmpty}
              />
              <TableHeaderRow />
            </Grid>
          </GridProfileNames>
        </div>
      </Content>

      {isLoading && (
        <>
          <OverlayPublicationConfiguration />
          <div className='waitingMessage'>
            <LoaderWaiting size={15} color="var(--blue-twitter)" />
            Aguarde...
          </div>
        </>
      )}
    </>
  )
}    

export default PublicationNames;