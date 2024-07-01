/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable no-console */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable no-return-assign */
/* eslint-disable no-alert */
import React, { useCallback, useEffect, useState, UIEvent, ChangeEvent, useRef } from 'react';
import { FiEdit, FiTrash, FiArrowLeft } from 'react-icons/fi'
import { FaFileAlt } from 'react-icons/fa'
import { Grid, Table } from '@devexpress/dx-react-grid-material-ui';
import { GridContainer , GridContainerMobile } from 'Shared/styles/GlobalStyle';
import { FcAbout} from 'react-icons/fc';
import { useAuth } from 'context/AuthContext';
import { useDevice } from "react-use-device";
import api from 'services/api';
import { useDefaultSettings } from 'context/defaultSettings';
import { useModal } from 'context/modal';
import { useHeader } from 'context/headerContext';
import { useHistory } from 'react-router-dom';
import { useToast } from 'context/toast';
import { languageGridEmpty } from 'Shared/utils/commonConfig';
import { HeaderPage } from 'components/HeaderPage';
import LoaderWaiting from 'react-spinners/ClipLoader';
import { Overlay } from 'Shared/styles/GlobalStyle';
import HolidayEdit from '../Modal';
import { Container, Content , ContentMobile } from './styles';

export interface IHolidayData{
    holidayId: string;
    holidayName: string;
    companyId: string;
    startDate: string;
    startDateString: string;
    endDate: string;
    endDateString: string;
    isPublic: boolean;
    isFixed: boolean;
    nameCity: string;
    nameCourt: string;
    idCourt: string;
    nameTypeCalculator: string;
    nameState: string;
    idState: string;
    idCity: string;
    description: string;
    accessCodes: string;
    allowDelete: boolean;
    typeHoliday: string;
    typeLocal: string;
    typeMatter: string;
    count: number;
}

export interface IDefaultsProps {
    id: string;
    value: string;
  }

const HolidayList = () => {
  // STATES
  const { addToast } = useToast();
  const history = useHistory();
  const scrollRef = useRef<HTMLDivElement>(null);
  const {captureText, handleLoadingData} = useHeader();
  const { handleUserPermission } = useDefaultSettings();
    const [holidayList, setHolidayList] = useState<IHolidayData[]>([]);
  const token = localStorage.getItem('@GoJur:token');
  const [showModal, setShowModal] = useState(false);
  const { handleCaller, handleModalActive, handleModalActiveId, caller, modalActive } = useModal();
  const [totalPageCount, setTotalPageCount] = useState<number>(0);
  const [isLoadingSearch, setIsLoadingSearch]= useState<boolean>(false);
  const [isLoading, setIsLoading]= useState<boolean>(true);
  const [pageNumber, setPageNumber] = useState(1);
  const [isEndPage, setIsEndPage] = useState(false);
  const [isPagination, setIsPagination] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const { signOut } = useAuth();
  const { isMOBILE } = useDevice();
  
  const columns = [
    { name: 'holidayName', title: ' '},
    { name: 'edit',  title: ' '},
    { name: 'remove',title: ' '}
  ];

  const [tableColumnExtensions] = useState([
    { columnName: 'holidayName', width: '75%' },
    { columnName: 'btnEditar', width: '5%' },
    { columnName: 'btnRemover',width: '5%' },
  ]);

  const [tableColumnExtensionsMobile] = useState([
    { columnName: 'holidayName', width: '45%' },
    { columnName: 'btnEditar', width: '2%' },
    { columnName: 'btnRemover',width: '2%' },
  ]);

  // USE EFFECT
  useEffect(() => {
    LoadDefaultProps()
  }, [])

  useEffect(() => {
    if (!modalActive && caller == 'holidayModal'){
        LoadHoliday('initialize')
    }
  }, [modalActive])

  
  useEffect(() => {
    if (caller == 'holidayModal' && modalActive){
      setShowModal(true)      
    }
  },[caller, modalActive])

  useEffect(() => {
    setHolidayList([])
    setIsLoadingSearch(true);
    setIsLoading(true);
    setPageNumber(1)
    setIsEndPage(false)
    LoadHoliday('initialize')

  },[captureText])

  useEffect(() => {
    LoadHoliday();
  },[pageNumber])


  // METHODS
  const LoadHoliday = useCallback(async(state = '') => {
    try {
      if (isEndPage && state != 'initialize'){
        return;
      }

      const token = localStorage.getItem('@GoJur:token');
      const page = state == 'initialize'? 1: pageNumber;

      const response = await api.get<IHolidayData[]>('/Feriados/ListarFeriados', { 
        params:{page, rows:20, filterClause: captureText, token}
      })

      if(response.data.length > 0 && state == 'initialize')
        setTotalPageCount(response.data[0].count)

      if(response.data.length == 0 && state == 'initialize')
        setTotalPageCount(0)

      if (response.data.length == 0 || state === 'initialize')
      {
        setIsLoadingSearch(false)
        setIsEndPage(true)
        setIsLoading(false)
        setPageNumber(1)      
        handleLoadingData(false)
        if (state != 'initialize') return ;
      }

      if (!isPagination || state === 'initialize'){
        setIsEndPage(false)
        setHolidayList(response.data)    
      }
      else{
        response.data.map((item)=> holidayList.push(item))
        setHolidayList(holidayList)    
      }

      handleLoadingData(false)
      setIsLoadingSearch(false)
      setIsLoading(false)
      handleCaller('')
      handleModalActiveId(0)
    }
    catch (err:any)
    {
      if (err.response.data.statusCode == 1002){
        addToast({type: 'info', title: 'Permissão negada', description: 'Seu usuário não tem permissão para acessar esse módulo, contate o administrador do sistema'});
        signOut()
      }
    }
  }, [pageNumber, captureText, isPagination, isEndPage])


  const LoadDefaultProps = async() => {
    try {
      const response = await api.post<IDefaultsProps[]>('/Defaults/Listar', { token });

      const permissionAccessCode = response.data.find(item => item.id === 'accessCode')
      if (permissionAccessCode)
        localStorage.setItem('@GoJur:accessCode', permissionAccessCode.value)
      
      const userPermissions = response.data.filter(item => item.id === 'defaultModulePermissions')
      handleUserPermission(userPermissions[0].value.split('|'));

    } catch (err) {
      console.log(err);
    }
  }

  const CustomCell = (props) => { 

    const { column } = props;

    if (column.name === 'holidayName') {
        return (
          
          <Table.Cell {...props} style={{paddingLeft:'5px'}}>
            <div style={{float:'left',width:'60%'}}>
              <span style={{color:'black', fontSize:'0.6rem', fontFamily:'Arial', fontWeight:600, }}>Feriado:&nbsp;</span>
              <span style={{color:'black', fontSize:'0.68rem', fontFamily:'Arial'}}>{props.row.holidayName}</span>
              
              {props.row.isPublic && (
              <>
                <span style={{color:'blue-twister', fontSize:'0.68rem', fontFamily:'Arial'}}>&nbsp;&nbsp;(Feriado Público)</span>
                <FcAbout style={{marginLeft:'0.5rem'}} title="Este Feriado/Recesso Judicial é cadastrado e atualizado automaticamente pela BCompany e disponibilizado para todos os clientes." />
              </>
              )}

              <br />
              
              {props.row.nameCity && (
              <>
                <span style={{color:'black', fontSize:'0.6rem', fontFamily:'Arial', fontWeight:600, }}>Cidade:&nbsp;</span>
                <span style={{color:'black', fontSize:'0.6rem', fontFamily:'Arial'}}>{props.row.nameCity}</span>
                <br />
              </>
              )}

              {props.row.nameState && (
              <>
                <span style={{color:'black', fontSize:'0.6rem', fontFamily:'Arial', fontWeight:600, }}>Estado:&nbsp;</span> 
                <span style={{color:'black', fontSize:'0.6rem', fontFamily:'Arial'}}>{props.row.nameState}</span>
                <br />
              </>
              )}

              {props.row.nameCourt && (
              <>
                <span style={{color:'black', fontSize:'0.6rem', fontFamily:'Arial', fontWeight:600, }}>Tribunal:&nbsp;</span> 
                <span style={{color:'black', fontSize:'0.6rem', fontFamily:'Arial'}}>{props.row.nameCourt}</span>
                <br />
              </>
              )}

              {props.row.nameTypeCalculator && (
              <>
                <span style={{color:'black', fontSize:'0.6rem', fontFamily:'Arial', fontWeight:600, }}>Código Processual:&nbsp;</span> 
                <span style={{color:'black', fontSize:'0.6rem', fontFamily:'Arial'}}>{props.row.nameTypeCalculator}</span>
                <br />
              </>
              )}

              <span style={{color:'black', fontSize:'0.6rem', fontFamily:'Arial', fontWeight:600, }}>Data:&nbsp;</span> 
              <span style={{color:'black', fontSize:'0.6rem', fontFamily:'Arial'}}>{props.row.startDateString}</span>

              {props.row.endDate && (
              <>
                <span style={{color:'black', fontSize:'0.6rem', fontFamily:'Arial'}}>&nbsp;até&nbsp;</span>
                <span style={{color:'black', fontSize:'0.6rem', fontFamily:'Arial'}}>{props.row.endDateString}</span>
              </>
              )}
            </div>
            
          </Table.Cell>
          );
        }

    if (column.name === 'edit') {
      return (
        <Table.Cell onClick={(e) => handleClick(props)} {...props}>
          &nbsp;&nbsp;
          <FiEdit title="Clique para editar " />
        </Table.Cell>
      );
    }

    
    if (column.name === 'remove' && props.row.allowDelete === true) {
      return (
        <Table.Cell onClick={(e) => handleClick(props)} {...props}>
          &nbsp;&nbsp;
          <FiTrash title="Clique para remover" />
        </Table.Cell>
      );
    }

    return <Table.Cell {...props} />;
  };

  const CustomCellMobile = (props) => { 

    const { column } = props;

    if (column.name === 'holidayName') {
        return (
          
          <Table.Cell {...props} style={{paddingLeft:'5px'}}>
            <div style={{float:'left',width:'60%'}}>
              <span style={{color:'black', fontSize:'0.6rem', fontFamily:'Arial', fontWeight:600, }}>Feriado:&nbsp;</span>
              <span style={{color:'black', fontSize:'0.68rem', fontFamily:'Arial'}}>{props.row.holidayName}</span>
              
              {props.row.isPublic && (
              <>
                <span style={{color:'blue-twister', fontSize:'0.68rem', fontFamily:'Arial'}}>&nbsp;&nbsp;(Feriado Público)</span>
                <FcAbout style={{marginLeft:'0.5rem'}} title="Este Feriado/Recesso Judicial é cadastrado e atualizado automaticamente pela BCompany e disponibilizado para todos os clientes." />
              </>
              )}

              <br />
              
              {props.row.nameCity && (
              <>
                <span style={{color:'black', fontSize:'0.6rem', fontFamily:'Arial', fontWeight:600, }}>Cidade:&nbsp;</span>
                <span style={{color:'black', fontSize:'0.6rem', fontFamily:'Arial'}}>{props.row.nameCity}</span>
                <br />
              </>
              )}

              {props.row.nameState && (
              <>
                <span style={{color:'black', fontSize:'0.6rem', fontFamily:'Arial', fontWeight:600, }}>Estado:&nbsp;</span> 
                <span style={{color:'black', fontSize:'0.6rem', fontFamily:'Arial'}}>{props.row.nameState}</span>
                <br />
              </>
              )}

              {props.row.nameCourt && (
              <>
                <span style={{color:'black', fontSize:'0.6rem', fontFamily:'Arial', fontWeight:600, }}>Tribunal:&nbsp;</span> 
                <span style={{color:'black', fontSize:'0.6rem', fontFamily:'Arial'}}>{props.row.nameCourt}</span>
                <br />
              </>
              )}

              {props.row.nameTypeCalculator && (
              <>
                <span style={{color:'black', fontSize:'0.6rem', fontFamily:'Arial', fontWeight:600, }}>Código Processual:&nbsp;</span> 
                <span style={{color:'black', fontSize:'0.6rem', fontFamily:'Arial'}}>{props.row.nameTypeCalculator}</span>
                <br />
              </>
              )}

              <span style={{color:'black', fontSize:'0.6rem', fontFamily:'Arial', fontWeight:600, }}>Data:&nbsp;</span> 
              <span style={{color:'black', fontSize:'0.6rem', fontFamily:'Arial'}}>{props.row.startDateString}</span>

              {props.row.endDate && (
              <>
                <span style={{color:'black', fontSize:'0.6rem', fontFamily:'Arial'}}>&nbsp;até&nbsp;</span>
                <span style={{color:'black', fontSize:'0.6rem', fontFamily:'Arial'}}>{props.row.endDateString}</span>
              </>
              )}
            </div>
            
          </Table.Cell>
          );
        }

    if (column.name === 'edit') {
      return (
        <div style={{width:'56px', float:'left'}}>
          <Table.Cell onClick={(e) => handleClick(props)} {...props}>
            &nbsp;&nbsp;
            <FiEdit title="Clique para editar " />
          </Table.Cell>
        </div>
      );
    }

    if (column.name === 'remove') {
      return (
        <div style={{width:'40px', float:'left'}}>
          <Table.Cell onClick={(e) => handleClick(props)} {...props}>
            &nbsp;&nbsp;
            <FiTrash title="Clique para remover" />
          </Table.Cell>
        </div>
      );
    }

    return <Table.Cell {...props} />;
  };

  // CELL CLICK
  const handleClick = (props: any) => {

    if (props.column.name === 'edit'){
      handleEdit(props.row.holidayId, props.row.companyId)
    }

    if (props.column.name === 'remove'){
      deleteHoliday(props.row.holidayId)
    }
  }

  // EDIT
  const handleEdit = async(id: number, modalCompanyId: string) => {
    handleModalActiveId(id)
    localStorage.setItem('@GoJur:modalCompanyId', modalCompanyId)
    handleCaller('holidayModal')
    handleModalActive(true)
  };

  // OPEN MODAL
  const handleOpenModal = () => {    
    handleModalActiveId(0)
    handleCaller('holidayModal')
    handleModalActive(true)
  }

  // DELETE
  const deleteHoliday = async(id: number) => {
   
    try {
      const token = localStorage.getItem('@GoJur:token');
      setIsDeleting(true)
      
      await api.delete('/Feriados/Deletar', {
        params:{
        id,
        token
        }
      })
      
      addToast({
        type: "success",
        title: "Feriado excluído",
        description: "O feriado foi excluído no sistema."
      })

      LoadHoliday('initialize')
      setIsDeleting(false)

    } catch (err: any) {
      setIsDeleting(false)

      console.log(err)

      addToast({
        type: "error",
        title: "Falha ao excluir feriado.",
        description:  err.response.data.Message
      })
    }
  };

  // PAGE SCROOL
  function handleScroll(e: UIEvent<HTMLDivElement>){
    const element =  e.target as HTMLTextAreaElement;

    if (isEndPage || holidayList.length == 0) return;

    const isEndScrool = ((element.scrollHeight - element.scrollTop)-20) <= element.clientHeight
    
    // calculate if achieve end of scrool page
    if (isEndScrool) {

      if (!isLoadingSearch){
        setPageNumber(pageNumber + 1)
      }

      setIsLoadingSearch(true)
      setIsPagination(true)        
    }
  }

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

  // HTML CODE
  return (
    <>

      <Container>

        <HeaderPage />

        {showModal &&  <HolidayEdit /> }

        {!isMOBILE &&(
          <div style={{width:'100%', marginTop:'20px'}}>

            <div style={{float:'left', marginLeft:'150px', marginTop:'12px', fontSize:'13px'}}>
              Número de Feriados:&nbsp;
              {totalPageCount}
            </div>

            <div style={{float:'right', marginRight:'170px'}}>
              <div style={{float:'left'}}>
                <button 
                  className="buttonClick" 
                  title="Clique para incluir um feriado"
                  type="submit"
                  onClick={handleOpenModal}
                >
                  <FaFileAlt />
                  Adicionar
                </button>
              </div>

              <div style={{float:'left'}}>
                <button 
                  className="buttonClick" 
                  title="Clique para retornar a dashboard"
                  type="submit"
                  onClick={() => history.push(`/dashboard`)}
                >
                  <FiArrowLeft />
                  Retornar
                </button>
              </div>

            </div>  
          </div>
        )}

        {isMOBILE &&(
          <div style={{width:'100%', marginTop:'20px'}}>

            <div style={{float:'left', marginLeft:'15px', marginTop:'-20px', fontSize:'10px'}}>
              Número de Feriados:&nbsp;
              {totalPageCount}
            </div>

            <div style={{float:'right', marginRight:'25px'}}>
              <div style={{float:'left'}}>
                <button 
                  className="buttonClick" 
                  title="Clique para incluir um feriado"
                  type="submit"
                  onClick={handleOpenModal}
                >
                  <FaFileAlt />
                  Adicionar
                </button>
              </div>

              <div style={{float:'left'}}>
                <button 
                  className="buttonClick" 
                  title="Clique para retornar a dashboard"
                  type="submit"
                  onClick={() => history.push(`/dashboard`)}
                >
                  <FiArrowLeft />
                  Retornar
                </button>
              </div>
            </div>  
          </div>
        )}

        <div style={{width:'100%', height:'25px'}}><></></div> 

        {!isMOBILE &&(
          <Content onScroll={handleScroll} ref={scrollRef}>

            <GridContainer>
              <Grid
                rows={holidayList}
                columns={columns}
              >
                <Table
                  cellComponent={CustomCell}
                  columnExtensions={tableColumnExtensions}            
                  messages={languageGridEmpty}
                />
                {/* <TableHeaderRow /> */}
              </Grid>
            </GridContainer>
          
          </Content>
        )}

        {isMOBILE &&(
          <ContentMobile onScroll={handleScroll} ref={scrollRef}>

            <GridContainerMobile>
              <Grid
                rows={holidayList}
                columns={columns}
              >
                <Table
                  cellComponent={CustomCellMobile}
                  columnExtensions={tableColumnExtensionsMobile}
                  messages={languageGridEmpty}
                />
                {/* <TableHeaderRow /> */}
              </Grid>
            </GridContainerMobile>
          
          </ContentMobile>
        )}

      </Container>

      {isDeleting && (
        <>
          <Overlay />
          <div className='waitingMessage'>   
            <LoaderWaiting size={15} color="var(--blue-twitter)" /> 
            &nbsp;&nbsp; Deletando ...
          </div>
        </>
      )}

    </>
  )

}
export default HolidayList;