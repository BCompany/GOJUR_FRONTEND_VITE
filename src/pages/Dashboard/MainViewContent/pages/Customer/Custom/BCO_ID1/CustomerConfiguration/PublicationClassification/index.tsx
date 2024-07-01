/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable no-console */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable no-return-assign */
/* eslint-disable no-alert */
/* eslint-disable react/jsx-one-expression-per-line */

import React, { useCallback, useEffect, useState, UIEvent, ChangeEvent, useRef } from 'react';
import api from 'services/api';
import Select from 'react-select';
import LoaderWaiting from 'react-spinners/ClipLoader';
import Search from 'components/Search';
import { selectStyles, useDelay, currencyConfig, FormatDate } from 'Shared/utils/commonFunctions';
import { format } from 'date-fns';
import { GridSubContainer, Overlay, AutoCompleteSelect } from 'Shared/styles/GlobalStyle';
import { Grid, Table, TableHeaderRow, PagingPanel } from '@devexpress/dx-react-grid-material-ui';
import { PagingState, CustomPaging } from '@devexpress/dx-react-grid';
import { useToast } from 'context/toast';
import { languageGridEmpty, languageGridPagination, languageGridLoading } from 'Shared/utils/commonConfig';
import { Container} from './styles';

export interface PublicationData {
  id: number;
  publicationDate: string;
  description: string;
  classificationId: number;
  totalRows: number;
  showMore: boolean;
  openMenu: boolean;
  label: string;
  classificationIdStr: number;
  classificationValue: string;
}

export interface ISelectData{
  id: string;
  label: string;
}

const PublicationClassification = () => {
  const token = localStorage.getItem('@GoJur:token')
  const { addToast } = useToast()
  const [publication, setPublication] = useState<PublicationData[]>([])
  const [isLoading, setIsLoading]= useState<boolean>(false);
  const [pageSizePublication, setPageSizPublication] = useState(10)
  const [totalPublications, setTotalPublications] = useState(0)
  const [changePage, setChangePage] = useState<boolean>(false)
  const [publiPageNumber, setPublicPageNumber] = useState(0)
  const [pageSizes] = useState([10, 20, 30, 50])
  const [classificationList, setClassificationList] = useState<ISelectData[]>([])
  const [classificationId, setClassificationId] = useState('')
  const [classificationValue, setClassificationValue] = useState('')
  const [classificationTerm, setClassificationTerm] = useState('')
  const [classificationFilter, setClassificationFilter] = useState('NC')
  const [filterPeriod, setFilterPeriod] = useState('7d')
  const [filterTerm, setFilterTerm] = useState('')
  const [changeFilter, setChangeFilter] = useState<boolean>(false)
  const columnsPublication = [{name: 'publicationDate', title: 'Data'}, {name: 'description', title: 'Descrição'}, {name: 'classification', title: 'Classificação'}]
  const [tableColumnExtensionsPublication] = useState([{columnName: 'publicationDate', width: '10%'}, {columnName: 'description', width: '70%'}, {columnName: 'classification', width: '20%'}])
  const classificationFilterList = [{ id:'CL', label: 'Classificadas' }, { id:'NC', label: 'Não Classificadas' }, { id:'AM', label: 'Ambos' }]


  useEffect(() => {
    LoadPublications('')
    LoadNotificationLegalCategory('reset');
  },[])


  useEffect(() => {
    if (changePage == true){
      LoadPublications('')
    }
  },[pageSizePublication, publiPageNumber])


  useEffect(() => {
    if (changeFilter == true){
      LoadPublications('date')
    }
  },[changeFilter, filterPeriod])


  useDelay(() => {
    if (classificationTerm.length > 0)
    LoadNotificationLegalCategory()
  }, [classificationTerm], 500)


  const LoadNotificationLegalCategory = async (stateValue?: string) => {
    let filter = stateValue == "initialize" ? classificationValue : classificationTerm;

    if (stateValue == 'reset')
      filter = ''
    
    try {
      const  response = await api.get<ISelectData[]>('NotificacaoLegalCategoria/Listar', {
        params:{filter, token}
      })

      setClassificationList(response.data)

    } catch (err:any) {
      addToast({ type: "error", title: "Operação não realizada", description: err.response.data.Message })
    }
  }


  const handleCurrentPagePublication = (value) => {
    setPublicPageNumber(value)
    setChangePage(true)
  }


  const handlePageSizePublication = (value) => {
    setPageSizPublication(value)
    setChangePage(true)
  }


  const LoadPublications = useCallback(async(filter) => {
    try {
      let filterClassification = ''
      let filterSearch = ''
      let filterPeriodSearch = '7d'
      let pageNumber = 0

      if(filter == 'refresh'){
        filterClassification = 'NC'
        filterSearch = ''
      }
      else if(filter == 'search'){
        filterClassification = classificationFilter
        filterSearch = filterTerm
        filterPeriodSearch = filterPeriod
      }
      else if(filter == 'date'){
        filterClassification = classificationFilter
        filterSearch = filterTerm
        filterPeriodSearch = filterPeriod
      }
      else if(filter != ''){
        filterClassification = filter
        filterPeriodSearch = filterPeriod
      }
      else {
        filterClassification = classificationFilter
        pageNumber = publiPageNumber
        filterSearch = filterTerm
        filterPeriodSearch = filterPeriod
      }

      setIsLoading(true)

      const response = await api.get<PublicationData[]>(`/CustomBCO_ID1/ConfiguracaoCliente/ListarPublicacaoClassificacao`, {
        params:{
          page: pageNumber + 1,
          rows: pageSizePublication,
          period: filterPeriodSearch,
          filterDesc: filterSearch,
          classifiedType: filterClassification,
          token
        }
      })

      // fill data values
      const newData = response.data.map(
        publications =>
          publications && {
            ...publications,
            openMenu: false
          },
      )

      setTotalPublications(newData.length === 0 ? 0 : newData[0].totalRows)
      setPublication(newData)
      setIsLoading(false)
      setChangePage(false)
      setChangeFilter(false)
    
    } catch (err:any) {
      setIsLoading(false)
      setChangePage(false)
      setChangeFilter(false)
      addToast({ type: "error", title: "Operação não realizada", description: err.response.data.Message })
    }
  },[publiPageNumber, pageSizePublication, totalPublications, publication, changePage, classificationFilter, filterPeriod, filterTerm])


  const handleClassificationFilter = (item) => {
    if (item){
      setPublicPageNumber(0)
      setClassificationFilter(item.id)
      LoadPublications(item.id)
    }else{
      setClassificationFilter('')
    }
  }


  const CustomCellPublication = (props:any) => {
    const { column } = props;

    if (column.name === 'publicationDate') {
      return (
        <Table.Cell {...props}>
          {props.row.tpo_Status == "A" && (
            <span style={{color:'black', fontWeight:500}}>{format(new Date(props.row.publicationDate), 'dd/MM/yyyy')}</span>
          )}
          {props.row.tpo_Status == "D" && (
            <span style={{color:'#a0a0a0'}}>{format(new Date(props.row.publicationDate), 'dd/MM/yyyy')}</span>
          )}
        </Table.Cell>
      );
    }

    if (column.name === 'description') {
      return (
        <Table.Cell {...props}>

          {String(props.row.description).length >= 1750 && (props.row.openMenu == false) && (props.row.tpo_Status == "A" || props.row.tpo_Status == "P") && (
            <div>
              <span title={props.row.description} style={{color:'black', fontWeight:500}}>
                {String(props.row.description).substring(0, 1749)}
                ... 
                <div>
                  <button
                    className="buttonLinkClick buttonInclude"
                    type="button"
                    onClick={(e) => handleClickMessage(props)} 
                    {...props} 
                  >
                    Ver Mais
                  </button>
                </div>
              </span>
            </div>
          )}

          {String(props.row.description).length >= 1750 && (props.row.openMenu == false) && (props.row.tpo_Status == "D") && (
            <div>
              <span title={props.row.description} style={{color:'#a0a0a0'}}>
                {String(props.row.description).substring(0, 1749)}
                ... 
                <div>
                  <button
                    className="buttonLinkClick buttonInclude"
                    type="button"
                    onClick={(e) => handleClickMessage(props)} 
                    {...props} 
                  >
                    Ver Mais
                  </button>
                </div>
              </span>
            </div>
          )}

          {String(props.row.description).length >= 1750 && (props.row.openMenu == true) && (props.row.tpo_Status == "A" || props.row.tpo_Status == "P") && (
            <div>
              <span style={{color:'black', fontWeight:500}}>
                {props.row.description}
                <div>
                  <button
                    className="buttonLinkClick buttonInclude"
                    type="button"
                    onClick={(e) => handleClickMessage(props)} 
                    {...props} 
                  >
                    Ver Menos
                  </button>
                </div>
              </span>
            </div>
          )}

          {String(props.row.description).length >= 1750 && (props.row.openMenu == true) && (props.row.tpo_Status == "D") && (
            <div>
              <span style={{color:'#a0a0a0'}}>
                {props.row.description}
                <div>
                  <button
                    className="buttonLinkClick buttonInclude"
                    type="button"
                    onClick={(e) => handleClickMessage(props)} 
                    {...props} 
                  >
                    Ver Menos
                  </button>
                </div>
              </span>
            </div>
          )}

          {String(props.row.description).length < 1750 && (props.row.tpo_Status == "A" || props.row.tpo_Status == "P") && (
            <div>
              <span style={{color:'black', fontWeight:500}}>
                {props.row.description}
              </span>
            </div>
          )}

          {String(props.row.description).length < 1750 && (props.row.tpo_Status == "D") && (
            <div>
              <span style={{color:'#a0a0a0'}}>
                {props.row.description}
              </span>
            </div>
          )}

        </Table.Cell>
      );
    }

    if (column.name === 'classification') {
      
      if(props.row.classificationIdStr != '')
      {
        return (
          <Table.Cell {...props}>
            <div style={{height:'250px'}}>
              <Select
                isSearchable
                value={{id: props.row.classificationIdStr, label: props.row.classificationValue}}
                onChange={(item) => handleClassificationSelected(item, props.row.id)}
                onInputChange={(term) => setClassificationTerm(term)}
                isClearable
                placeholder="Selecione..."
                styles={selectStyles}
                options={classificationList}
                required
              />    
            </div>
            
          </Table.Cell>
        )
      }
      
      return (
        <Table.Cell {...props}>
          <div style={{height:'250px'}}>
            <Select
              isSearchable
              onChange={(item) => handleClassificationSelected(item, props.row.id)}
              onInputChange={(term) => setClassificationTerm(term)}
              isClearable
              placeholder="Selecione..."
              styles={selectStyles}
              options={classificationList}
              required
            />
          </div>
        </Table.Cell>
      )
    }

    return <Table.Cell {...props} />
  }


  const handleClassificationSelected = (item:any, publicationId:number) => {
    if (item){
      Save(publicationId, item.id, item.label)
    }
    else{
      setClassificationId('')
      setClassificationValue('')
      LoadNotificationLegalCategory('reset')
    }
  }


  const handleClickMessage = (props) => {
    publication.map((item) => {
      if (item.id == props.row.id){
        if (props.row.openMenu == false) {
          item.openMenu = true // eslint-disable-line no-param-reassign
        }
        else {
          item.openMenu = false // eslint-disable-line no-param-reassign
        }

        const newArrayPublication = [...publication]
        setPublication(newArrayPublication)
      }       
      return;
    })
  }


  const Save = async (publicationId, id, label) => {
    try {
      const response = await api.post<ISelectData[]>('/NotificacaoLegalCategoria/SalvarClassificacao', {
        publicationId, id, token
      })

      const select = publication.map(item =>
        item.id === publicationId ? {
          ...item,
          classificationIdStr: id,
          classificationValue: label,
        } : item)

        setPublication(select);

    } catch (err:any) {
      addToast({ type: "error", title: "Operação não realizada", description: err.response.data.Message })
    }
  }


  const Reload = () => {
    setClassificationFilter('NC')
    setFilterTerm('')
    setPublicPageNumber(0)
    setChangePage(true)
    setFilterPeriod('7d')
    LoadPublications('refresh')
  }


  const handleChangeFilterDate = (period: string) =>  {
    setFilterPeriod(period)
    setChangeFilter(true)
  }


  return(
    <Container id='Container'>
      <div id='Filters' style={{width:'100%', height:'50px', marginTop:'5px'}}>
        <div id='ComboFilter' style={{width:'25%', float:'left'}}>
          <AutoCompleteSelect>
            <Select
              isSearchable
              value={classificationFilterList.filter(options => options.id == classificationFilter)}
              onChange={handleClassificationFilter}
              required
              placeholder=""
              styles={selectStyles}
              options={classificationFilterList}
            />
          </AutoCompleteSelect>
        </div>

        <div id='DateFilter' style={{width:'29%', float:'left', marginLeft:'20px', marginTop:'7px', textAlignLast:'center'}}>
          <div id="DateItem" className='ButtonItems'>
            <button
              type="button"
              style={{backgroundColor:`${filterPeriod}` === '7d' ? '#2C8ED6' : '#f7f7f8',}}
              title='Realiza o filtro nas publicações na data de 7 dias atrás'
              onClick={() => handleChangeFilterDate('7d')}
            >
              7 Dias
            </button>
            &nbsp;&nbsp;
            <button
              type="button"
              style={{backgroundColor:`${filterPeriod}` === '30d' ? '#2C8ED6' : '#f7f7f8',}}
              title='Realiza o filtro nas publicações na data de 30 dias atrás'
              onClick={() => handleChangeFilterDate('30d')}
            >
              30 Dias
            </button>
            &nbsp;&nbsp;
            <button
              type="button"
              style={{backgroundColor:`${filterPeriod}` === 'year' ? '#2C8ED6' : '#f7f7f8',}}
              title='Realiza o filtro nas publicações na data de 1 ano atrás'
              onClick={() => handleChangeFilterDate('year')}
            >
              1 Ano
            </button>
            &nbsp;&nbsp;
            <button
              type="button"
              style={{backgroundColor:`${filterPeriod}` === 'allPeriod' ? '#2C8ED6' : '#f7f7f8',}}
              title='Realiza o filtro nas publicações em todo o período'
              onClick={() => handleChangeFilterDate('allPeriod')}
            >
              Todas
            </button>
          </div>
        </div>

        <div id='SearchFilter' style={{width:'29%', float:'left', marginLeft:'20px', marginTop:'-4px'}}>
          <label htmlFor="searchPublications">
            <input type="text" style={{display: "none"}} />
            <Search
              onKeyPress={(e: React.KeyboardEvent) => {
                if (e.key === 'Delete' || e.key === 'Backspace' || e.which === 8) { e.preventDefault() }
                if (e.key == 'Enter'){ LoadPublications('search')}}
              }
              placeholder='Pesquise Publicações...  (Utilize tecla Enter)'
              title='Realiza a busca no texto da publicação. Utilize a tecla Enter para realizar a busca.'
              className='searchPublications'
              name='searchPublications'
              value={filterTerm}
              style={{width:'95%', minWidth:'90%', marginLeft:'0px'}}
              onChange={(e) => setFilterTerm(e.target.value)}
            />
          </label>
        </div>

        <div id='ButtonRefresh' style={{width:'11%', float:'left', marginLeft:'20px', marginTop:'7px'}}>
          <button 
            className="buttonClick"
            type='button'
            style={{height:'37px'}}
            title='Redefine a busca para os padrões:
Não Classificadas
Período de 7 dias 
Sem filtro por descrição'
            onClick={(e) => Reload()}
          >
            Atualizar
          </button>
        </div>
      </div>

      <GridSubContainer>
        <Grid
          rows={publication}
          columns={columnsPublication}
        >
          <PagingState
            currentPage={publiPageNumber}
            pageSize={pageSizePublication}
            onCurrentPageChange={(e) => handleCurrentPagePublication(e)}
            onPageSizeChange={(e) => handlePageSizePublication(e)}
          />
          <CustomPaging totalCount={totalPublications} />
          <Table
            cellComponent={CustomCellPublication}
            columnExtensions={tableColumnExtensionsPublication}
            messages={isLoading? languageGridLoading: languageGridEmpty}
          />
          <TableHeaderRow />
          <PagingPanel
            messages={languageGridPagination}
            pageSizes={pageSizes}
          />
        </Grid>
      </GridSubContainer>

      {isLoading && (
        <>
          <Overlay />
          <div className='waitingMessage'>   
            <LoaderWaiting size={15} color="var(--blue-twitter)" /> 
            &nbsp;&nbsp;
            Carregando ...
          </div>
        </>
      )}
    </Container>
  )
}

export default PublicationClassification;    