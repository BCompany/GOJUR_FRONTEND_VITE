/* eslint-disable array-callback-return */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable radix */

import React, { ChangeEvent, useState, useEffect, useRef, useCallback } from 'react';
import api from 'services/api';
import { useDefaultSettings } from 'context/defaultSettings';
import { FaFileAlt } from 'react-icons/fa'
import { FiSave, FiArrowLeft, FiEdit, FiTrash } from 'react-icons/fi';
import { FormatDate} from 'Shared/utils/commonFunctions';
import { FcAbout} from 'react-icons/fc';
import { useToast } from 'context/toast';
import { useModal } from 'context/modal';
import { useDevice } from "react-use-device";
import { HeaderPage } from 'components/HeaderPage';
import LoaderWaiting from 'react-spinners/ClipLoader';
import { Tabs } from 'Shared/styles/Tabs';
import { Grid, Table, TableHeaderRow, PagingPanel } from '@devexpress/dx-react-grid-material-ui';
import { languageGridEmpty, languageGridPagination} from 'Shared/utils/commonConfig';
import { DataTypeProvider, PagingState, CustomPaging } from '@devexpress/dx-react-grid';
import { format } from 'date-fns';
import { Overlay, GridContainerEconomicIndexes, GridContainerEconomicIndexesMobile } from 'Shared/styles/GlobalStyle';
import {useHistory, useLocation } from 'react-router-dom'
import { useForm } from 'react-hook-form';
import EconomicIndexesValuesEdit from './ModalEconomicIndexesValues';
import { Container, Content, Form, Flags} from './styles';

export interface IEconomicIndexesData{
	economicIndexesId: number;
	economicIndexesDescription: string;
	flg_Public: string;
	allowDelete: boolean;
	flg_TypeValue: string;
	convertCoin: boolean;
	decimais: string;
	startDate: string;
	accessCodes: string;
  companyId: number;
	count: number;
}

export interface IDefaultsProps {
	id: string;
	value: string;
}

export interface IEconomicIndexesValuesData {
  economicIndexesValuesId: string;
  economicIndexesId: string;
  date: string;
  value: string;
  count: number;
  companyId: string;
}

export interface ISelectData {
  id: string;
  label: string;
}

const EconomicIndexessEdit: React.FC = () => {

  const formRef = useRef<HTMLFormElement>(null);
  const { handleUserPermission } = useDefaultSettings();
  const { addToast } = useToast();
  const [isDeleting, setIsDeleting] = useState(false);
  const { pathname } = useLocation();
  const { handleSubmit} = useForm<IEconomicIndexesData>();
  const { handleCaller, handleModalActive, handleModalActiveId, caller, modalActive } = useModal();
  const [appointmentBlockUpdate, setAppointmentBlockUpdate] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [isSaving , setisSaving] = useState<boolean>(); // set trigger for show loader
  const [isPublic , setisPublic] = useState<boolean>(false);
  const [economicIndexesId, setEconomicIndexesId] = useState<number>(0)
  const [economicIndexesDescription, setEconomicIndexesDescription] = useState<string>("")
  const [flg_TypeValue, setFlg_TypeValue] = useState<string>("")
  const [economicIndexesStartDate, setEconomicIndexesStartDate] = useState<string>("")
  const [convertCoin, setConvertCoin] = useState<boolean>(true)
  const [decimais, setDecimais] = useState<string>("")
  const [flg_Public, setFlg_Public] = useState<string>("N")
  const [companyId, setCompanyId] = useState<number>(0)
  const [allowDelete, setAllowDelete] = useState<boolean>(false)
  const history = useHistory();
  const [token] = useState(localStorage.getItem('@GoJur:token'));

  const [statePage, setStatePage] = useState<string>('')
  const [economicIndexesValuesList, setEconomicIndexesValuesList] = useState<IEconomicIndexesValuesData[]>([])
  const [totalCount, setTotalCount] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [pageSizes] = useState([5, 10, 20, 50, 100]);
  const [currentPage, setCurrentPage] = useState(0);
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const { isMOBILE } = useDevice(); 

  // EconomicIndexesValues Grid
  const columns = [
    { name: 'date',title: 'Mês Referência'},
    { name: 'value',title: ' Valor '},
    { name: 'edit',title: ' '},
    { name: 'remove',title: ' '}
  ];

  const [tableColumnExtensions] = useState([
    { columnName: 'date', width: '37%' },
    { columnName: 'value',width: '32%' },
    { columnName: 'edit', width: '13%' },
    { columnName: 'btnRemover',width: '4%' },
  ]);

  const [tableColumnExtensionsMobile] = useState([
    { columnName: 'date', width: '29%' },
    { columnName: 'value',width: '25%' },
    { columnName: 'edit', width: '15%' },
    { columnName: 'btnRemover',width: '5%' },
  ]);

  const [dateColumns] = useState(['date']);
  const DateFormatter = ({ value }) => format(new Date(value), 'dd/MM/yyyy');
  const DateTypeProvider = props => (
    <DataTypeProvider formatterComponent={DateFormatter} {...props} />
  );

  // Call default parameters by company 
  useEffect(() => {
    LoadDefaultProps();
  }, [handleUserPermission]);

  useEffect(() => {
    const id = pathname.substr(22)
    if ( id != '0'){
      LoadPaymentSlipContract();
      LoadEconomicIndexValues();
      setIsLoading(true);
      numberFormat(decimais)
    } 
  }, [])
  
  useEffect(() => {
    if (caller == 'economicIndexesValueModal' && modalActive){
      setShowModal(true)      
    }
  },[caller, modalActive,decimais])

  useEffect(() => {
    if (!modalActive && caller == 'economicIndexesValueModal'){
      LoadEconomicIndexValues('initialize')
    }
  }, [modalActive,decimais])

  useEffect(() => {
    setStatePage("pagination");
    LoadEconomicIndexValues();
    setIsLoading(true);
  }, [currentPage, pageSize,decimais])

  // Load default parameters by user
  const LoadDefaultProps = async () => {
    try {
      const response = await api.post<IDefaultsProps[]>('/Defaults/Listar', {
        token,
      });

      const userprops = response.data[4].value.split('|');

      handleUserPermission(userprops);
    } catch (err) {
      console.log(err);
    }
  }

  const LoadPaymentSlipContract = async() => {

    try {
      const id = pathname.substr(22)

      const response = await api.post<IEconomicIndexesData>('/IndicesEconomicos/Editar', { 
        id,
        token
      });
    
      setEconomicIndexesId(response.data.economicIndexesId)
      setEconomicIndexesDescription(response.data.economicIndexesDescription)
      setFlg_TypeValue(response.data.flg_TypeValue)
      setConvertCoin(response.data.convertCoin)
      setDecimais(response.data.decimais)
      setFlg_Public(response.data.flg_Public)
      setCompanyId(response.data.companyId)
      setAllowDelete(response.data.allowDelete)

      if (response.data.startDate != null)
      {
        setEconomicIndexesStartDate(FormatDate(new Date(response.data.startDate), 'yyyy-MM-dd'))  
      }

      if (response.data.allowDelete != false){
        setAppointmentBlockUpdate(false)
      }

      if (response.data.flg_Public == "S"){
        setisPublic(true)
      }
    } catch (err) {
      localStorage.removeItem('@GoJur:IndiceEconomico')
      console.log(err);
    }
  }

  const saveEconomicIndexes = useCallback(async() => {
    try {

      const id = pathname.substr(22)

      if (isSaving) {
        addToast({
          type: "info",
          title: "Operação NÃO realizada",
          description: `Já existe uma operação em andamento`
        })

        return;
      }

      const token = localStorage.getItem('@GoJur:token');
      
      setisSaving(true)

      const response = await api.post('/IndicesEconomicos/Salvar', {
        economicIndexesId: id,
        economicIndexesDescription,
        flg_TypeValue,
        decimais,
        convertCoin,
        startDate: economicIndexesStartDate,
        token
      })

      localStorage.setItem('@GoJur:IndiceEconomico', response.data.economicIndexesId)
      setisSaving(false)
      
      addToast({
        type: "success",
        title: "Índice Econômico salvo",
        description: "O índice econômico foi adicionado no sistema."
      })

      handleClose()

    } catch (err) {
      setisSaving(false)
      localStorage.removeItem('@GoJur:IndiceEconomico')
      addToast({
        type: "error",
        title: "Falha ao índice econômico.",
      })
    }
  },[isSaving, economicIndexesDescription, flg_TypeValue, decimais, convertCoin, economicIndexesStartDate]);

  const handleResetStates = () => { 
    setEconomicIndexesId(0)
    setEconomicIndexesDescription("")
    setFlg_TypeValue("")
    setConvertCoin(true)
    setDecimais("")
    setEconomicIndexesStartDate("")
    setFlg_Public("N")
    setCompanyId(0)
  }

  const handleClose = () => { 
    handleResetStates()
    history.push(`/EconomicIndexes/List`)
    localStorage.removeItem('@GoJur:IndiceEconomico')
  }

  // OPEN MODAL
  const handleOpenModal = () => {    
    handleModalActiveId(0)
    handleCaller('economicIndexesValueModal')
    handleModalActive(true)
  }

  const CustomCell = (props) => {

    const { column } = props;
    
    if (column.name === 'edit' && allowDelete == true) {
      return (
        <Table.Cell onClick={() => handleClick(props)} {...props}>
          &nbsp;&nbsp;
          <FiEdit title="Clique para edita o documento " />
        </Table.Cell>
      );
    }

    if (column.name === 'remove' && allowDelete == true) {
      return (
        <Table.Cell onClick={(e) => handleClick(props)} {...props}>
          &nbsp;&nbsp;
          <FiTrash title="Clique para remover" />
        </Table.Cell>
      );
    }

    return <Table.Cell {...props} />;
  };

  const handleClick = (props: any) => {

    if (props.column.name === 'edit'){
      handleEdit(props.row.economicIndexesValuesId)
    }

    if (props.column.name === 'remove'){
      deleteEconomicIndexesValues(props.row.economicIndexesValuesId)
    }
  }

  // EDIT
  const handleEdit = async(id: number) => {
    handleModalActiveId(id)
    handleCaller('economicIndexesValueModal')
    handleModalActive(true)
  };


  const numberFormat = (value) =>
  new Intl.NumberFormat('pt-BR', {
    currency: 'INR',
    minimumFractionDigits: Number(decimais),
  }).format(value);


  const LoadEconomicIndexValues = useCallback(async(state = '') => {
    try
    {
      const response = await ListEconomicIndexesValues(currentPage * pageSize, pageSize)

      // calculate pagination total as made today 

      setTotalCount(response.data.length >0? response.data[0].count: 0)
      

      const listValues: IEconomicIndexesValuesData[] = []

      response.data.map(item => {
        return listValues.push({
          economicIndexesValuesId: item.economicIndexesValuesId,
          value: numberFormat(item.value),
          companyId: item.companyId,
          date: item.date,
          economicIndexesId: item.economicIndexesId,
          count: item.count
        })
     
        
      })

      setEconomicIndexesValuesList(listValues)
      setIsLoading(false)
      setStatePage('')
    }
    catch(ex: any){
      console.log(ex)
      setIsLoading(false)
      setStatePage('')
    }
  }, [currentPage, pageSize, pageSizes, totalCount, decimais])

  const ListEconomicIndexesValues = async(page: number, rows: number) => {

    const id = pathname.substr(22)
    const token = localStorage.getItem('@GoJur:token');
    
    const response = await api.get<IEconomicIndexesValuesData[]>('/IndicesEconomicosValores/Listar', { 
      params:{
        page, 
        rows,
        indexId: id,
        token
      }
    })

    return response;  
  }

  // DELETE
  const deleteEconomicIndexesValues = async(id: number) => {
    try {
      setIsDeleting(true)
      const token = localStorage.getItem('@GoJur:token');
      
      await api.delete('/IndicesEconomicosValores/Deletar', {
        params:{
        id,
        token
        }
      })
      
      addToast({
        type: "success",
        title: "Valor do Índice Econômico excluído",
        description: "O valor do índice econômico foi excluído no sistema."
      })

      LoadEconomicIndexValues()
      setIsDeleting(false)

    } catch (err:any) {
      setIsDeleting(false)
      addToast({
        type: "error",
        title: "Falha ao excluir valor do índice econômico.",
        description:  err.response.data.Message
      })
    }
  };

  if(isLoading)
  {
    return (
      <Container>
        <HeaderPage />

        <Overlay />
        <div className='waitingMessage'>   
          <LoaderWaiting size={15} color="var(--blue-twitter)" /> 
          &nbsp;&nbsp; Aguarde...
        </div>

      </Container>
    )
  }

  return (

    <Container>

      <HeaderPage />

      {showModal &&  <EconomicIndexesValuesEdit decimals={decimais} date={economicIndexesStartDate}  /> }
      <br />

      {!isMOBILE &&(
        <div style={{marginLeft: '77%'}}>
          <button disabled={appointmentBlockUpdate} className="buttonClick" type="submit" onClick={()=> saveEconomicIndexes()}>
            <FiSave />
            Salvar
          </button>

          <button className="buttonClick" type="button" onClick={() => handleClose()}>
            <FiArrowLeft />
            Retornar
          </button>
        </div>
      )}

      {isMOBILE &&(
        <div style={{marginLeft: '27%'}}>
          <button disabled={appointmentBlockUpdate} className="buttonClick" type="submit" onClick={()=> saveEconomicIndexes()}>
            <FiSave />
            Salvar
          </button>

          <button className="buttonClick" type="button" onClick={() => handleClose()}>
            <FiArrowLeft />
            Retornar
          </button>
        </div>
      )}

      <br /><br />
      
      <Content style={{marginTop:"1%"}}>

        <Tabs>
          {!isMOBILE &&(
            <Form style={{height:"1%"}} ref={formRef} onSubmit={handleSubmit(saveEconomicIndexes)}> 
              <section id='dados'>
                <label htmlFor="name" className="required">
                  Nome
                  <input
                    disabled={appointmentBlockUpdate}
                    maxLength={100}
                    type="text" 
                    value={economicIndexesDescription}  
                    autoComplete="off"
                    name="name"
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setEconomicIndexesDescription(e.target.value)} 
                    required
                  />
                </label>

                <label htmlFor="type">
                  Tipo
                  <br />
                  <select
                    disabled={appointmentBlockUpdate}
                    name="Type"
                    value={flg_TypeValue}
                    onChange={(e: ChangeEvent<HTMLSelectElement>) => setFlg_TypeValue(e.target.value)}
                  >
                    <option value="P">Percentual</option>
                    <option value="V">Valor</option>
                    <option value="I">Valor / Indice Invertido</option>
                  </select>
                </label>

                <div style={{display:"flex"}}>
                  <label htmlFor="comecaEm" style={{marginTop:"auto", marginBottom:"auto", width:"50%"}}>
                    Começa em:
                    <input
                      disabled={appointmentBlockUpdate}
                      type="date"
                      autoComplete="off"
                      value={economicIndexesStartDate}
                      onChange={(e: ChangeEvent<HTMLInputElement>) => setEconomicIndexesStartDate(e.target.value)}
                    />
                  </label>

                  <label htmlFor="type" style={{marginTop:"auto", marginBottom:"auto", marginLeft:"3%", width:"50%"}}>
                    Casas Decimais
                    <select
                      disabled={appointmentBlockUpdate}
                      name="Type"
                      value={decimais}
                      onChange={(e: ChangeEvent<HTMLSelectElement>) => setDecimais(e.target.value)}
                    > 
                      <option value="2">2</option>
                      <option value="3">3</option>
                      <option value="4">4</option>
                      <option value="5">5</option>
                      <option value="6">6</option>
                      <option value="7">7</option>
                      <option value="8">8</option>
                      <option value="9">9</option>
                      <option value="10">10</option>
                      <option value="11">11</option>
                      <option value="12">12</option>
                    </select>
                  </label>
                </div>

                <div style={{display:"flex"}}>
                  <div>
                    <Flags>
                      <p style={{width:"240%"}}>Converter Moeda:</p>
                    </Flags>

                    <input
                      style={{marginTop:"20%", marginLeft:"60%"}}
                      disabled={appointmentBlockUpdate}
                      type="checkbox"
                      name="select"
                      checked={convertCoin}
                      onChange={() => setConvertCoin(!convertCoin)}
                    />
                  </div>

                  <div style={{marginLeft:"3%"}}>
                    {isPublic && (
                      <div className='bcompany' style={{marginLeft:"60%", width:"110%", marginTop:"-2%"}}>
                        Este indice é gerenciado pela BCompany&nbsp;&nbsp;
                        <FcAbout 
                          className='icons' 
                          title='Este indicador economico é cadastrado e atualizado automaticamente pela BCompany e disponibilizado para todos os clientes.'
                          style={{minWidth: '20px', minHeight: '20px'}}
                        /> 
                      </div>
                    )}  
                  </div>
                </div>

              </section>

              {allowDelete == true && (
                <button
                  style={{marginTop:"0.5%"}}
                  className="buttonLinkClick buttonInclude" 
                  title="Clique para adicionar um novo valor"
                  onClick={handleOpenModal}
                  type="button"
                  disabled={appointmentBlockUpdate}
                >
                  <FaFileAlt />
                  { !isMOBILE && <span> Adicionar novo valor</span>}
                  { isMOBILE && <span>Adicionar valor</span>}           
                </button>
              )}
            </Form>
          )} 

          {isMOBILE &&(
            <Form ref={formRef} onSubmit={handleSubmit(saveEconomicIndexes)}> 
              <section id='dados'>
                <label htmlFor="name" className="required">
                  Nome
                  <input
                    style={{width:"47%"}}
                    disabled={appointmentBlockUpdate}
                    maxLength={100}
                    type="text" 
                    value={economicIndexesDescription}  
                    autoComplete="off"
                    name="name"
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setEconomicIndexesDescription(e.target.value)} 
                    required
                  />
                </label>

                <label htmlFor="type">
                  Tipo
                  <br />
                  <select
                    style={{width:"47%"}}
                    disabled={appointmentBlockUpdate}
                    name="Type"
                    value={flg_TypeValue}
                    onChange={(e: ChangeEvent<HTMLSelectElement>) => setFlg_TypeValue(e.target.value)}
                  >
                    <option value="P">Percentual</option>
                    <option value="V">Valor</option>
                    <option value="I">Valor / Indice Invertido</option>
                  </select>
                </label>

                <div style={{display:"flex"}}>
                  <label htmlFor="comecaEm" style={{marginTop:"auto", marginBottom:"auto", width:"22%"}}>
                    Começa em:
                    <input
                      disabled={appointmentBlockUpdate}
                      type="date"
                      autoComplete="off"
                      value={economicIndexesStartDate}
                      onChange={(e: ChangeEvent<HTMLInputElement>) => setEconomicIndexesStartDate(e.target.value)}
                    />
                  </label>

                  <label htmlFor="type" style={{marginTop:"auto", marginBottom:"auto", marginLeft:"3%", width:"22%"}}>
                    Casas Decimais
                    <select
                      disabled={appointmentBlockUpdate}
                      name="Type"
                      value={decimais}
                      onChange={(e: ChangeEvent<HTMLSelectElement>) => setDecimais(e.target.value)}
                    > 
                      <option value="2">2</option>
                      <option value="3">3</option>
                      <option value="4">4</option>
                      <option value="5">5</option>
                      <option value="6">6</option>
                      <option value="7">7</option>
                      <option value="8">8</option>
                      <option value="9">9</option>
                      <option value="10">10</option>
                      <option value="11">11</option>
                      <option value="12">12</option>
                    </select>
                  </label>
                </div>

                <div style={{display:"flex"}}>
                  <div>
                    <Flags>
                      <p style={{width:"240%"}}>Converter Moeda:</p>
                    </Flags>

                    <input
                      style={{marginTop:"20%", marginLeft:"20%"}}
                      disabled={appointmentBlockUpdate}
                      type="checkbox"
                      name="select"
                      checked={convertCoin}
                      onChange={() => setConvertCoin(!convertCoin)}
                    />
                  </div>

                  <div>
                    {isPublic && (
                      <div className='bcompany' style={{marginLeft:"50%", width:"110%"}}>
                        Este indice é gerenciado pela BCompany&nbsp;&nbsp;
                      </div>
                    )}
                  </div>
                </div>
              </section>

              {allowDelete == true && (
                <button
                  style={{marginTop:"0.5%"}}
                  className="buttonLinkClick buttonInclude" 
                  title="Clique para adicionar um novo valor"
                  onClick={handleOpenModal}
                  type="button"
                  disabled={appointmentBlockUpdate}
                >
                  <FaFileAlt />
                  { !isMOBILE && <span> Adicionar novo valor</span>}
                  { isMOBILE && <span>Adicionar valor</span>}           
                </button>
              )} 
            </Form>
          )}

          {!isMOBILE && (
          <GridContainerEconomicIndexes style={{opacity:(statePage === 'editing'? '0.5': '1')}}>
            <Grid
              rows={economicIndexesValuesList}
              columns={columns}
            >
              <PagingState
                currentPage={currentPage}
                pageSize={pageSize}                
                onCurrentPageChange={setCurrentPage}
                onPageSizeChange={setPageSize}                
              />
              <CustomPaging totalCount={totalCount} />
              <DateTypeProvider for={dateColumns} />            
              <Table        
                cellComponent={CustomCell}  
                columnExtensions={tableColumnExtensions}    
                messages={languageGridEmpty}   
              />
              <TableHeaderRow />
              <PagingPanel
                messages={languageGridPagination}
                pageSizes={pageSizes}
              />
            </Grid>
          </GridContainerEconomicIndexes> 
          )}

          {isMOBILE && (
          <GridContainerEconomicIndexesMobile style={{opacity:(statePage === 'editing'? '0.5': '1')}}>
            <Grid
              rows={economicIndexesValuesList}
              columns={columns}
            >
              <PagingState
                currentPage={currentPage}
                pageSize={pageSize}                
                onCurrentPageChange={setCurrentPage}
                onPageSizeChange={setPageSize}                
              />
              <CustomPaging totalCount={totalCount} />
              <DateTypeProvider for={dateColumns} />            
              <Table        
                cellComponent={CustomCell}  
                columnExtensions={tableColumnExtensionsMobile}    
                messages={languageGridEmpty}   
              />
              <TableHeaderRow />
              <PagingPanel
                messages={languageGridPagination}
                pageSizes={pageSizes}
              />
            </Grid>
          </GridContainerEconomicIndexesMobile> 
          )}

        </Tabs>

      </Content>   

      {isSaving && (
        <>
          <Overlay />
          <div className='waitingMessage'>   
            <LoaderWaiting size={15} color="var(--blue-twitter)" /> 
            &nbsp;&nbsp;
            Salvando ...
          </div>
        </>
      )} 

      {isDeleting && (
        <>
          <Overlay />
          <div className='waitingMessage'>   
            <LoaderWaiting size={15} color="var(--blue-twitter)" /> 
            &nbsp;&nbsp; Deletando valor do índice econômico ...
          </div>
        </>
      )} 
          
    </Container>
  );
};

export default EconomicIndexessEdit;
