/* eslint-disable array-callback-return */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable no-return-assign */
/* eslint-disable radix */

import React, { useState, useEffect, useCallback, ChangeEvent } from 'react';
import { HeaderPage } from 'components/HeaderPage';
import { useLocation, useHistory } from 'react-router-dom'
import api from 'services/api';
import { FaFileAlt, FaIdBadge} from 'react-icons/fa';
import { useToast } from 'context/toast';
import { ImMenu3, ImMenu4 } from 'react-icons/im';
import { GridSubContainer } from 'Shared/styles/GlobalStyle';
import { selectStyles, useDelay} from 'Shared/utils/commonFunctions';
import { AutoCompleteSelect } from 'Shared/styles/GlobalStyle';
import { useMenuHamburguer } from 'context/menuHamburguer'
import MenuHamburguer from 'components/MenuHamburguer';
import Select from 'react-select'
import { Overlay } from 'Shared/styles/GlobalStyle';
import LoaderWaiting from 'react-spinners/ClipLoader';
import { useConfirmBox } from 'context/confirmBox';
import { Grid, Table, TableHeaderRow } from '@devexpress/dx-react-grid-material-ui';
import ConfirmBoxModal from 'components/ConfirmBoxModal';
import { FiEdit } from 'react-icons/fi';
import { BiTimeFive } from 'react-icons/bi';
import { PagingState, CustomPaging } from '@devexpress/dx-react-grid';
import { languageGridEmpty, languageGridLoading } from 'Shared/utils/commonConfig';
import CoverageListModal from './CoverageModal';
import NewNameModal from './NewNameModal'
import {ICustomerInformation, ISelectData, IPublicationNamesData, ICustomerData} from '../../../../Interfaces/IPublicationNames';
import { Container, Content, Form, OverlayPublicationNames, TollBar} from './styles';

const PublicationNames: React.FC = () => {
  const { addToast } = useToast();
  const history = useHistory();
  const {isMenuOpen,  handleIsMenuOpen, } = useMenuHamburguer();
  const [showCoverageModal, setShowCoverageModal] = useState<boolean>(false);
  const {isConfirmMessage, isCancelMessage, handleCancelMessage, handleConfirmMessage, caller, handleCaller } = useConfirmBox();
  const [showNewNameModal, setShowNewNameModal] = useState<boolean>(false);
  const [modalCourtesy, setModalCourtesy] = useState<boolean>(false)
  const [confirmCourtesy, setConfirmCourtesy] = useState<boolean>(false)
  const token = localStorage.getItem('@GoJur:token');
  const [isLoading, setIsLoading]= useState<boolean>(true);
  const { pathname } = useLocation();
  const [companyId, setCompanyId] = useState<string>("")
  const [companyName, setCompanyName] = useState<string>("")

  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(100);
  const [totalRows, setTotalRows] = useState<number>(0);

  const [publicationNamesList, setPublicationNamesList] = useState<IPublicationNamesData[]>([]);
  const [publicationNameId, setPublicationNameId] = useState<number>(0)
  const [editCaller, setEditCaller] = useState<string>("")

  // CustomerCompany Select Box
  const [customerCompanyValue, setCustomerCompanyValue] = useState('');
  const [customerCompanyId, setCustomerCompanyId] = useState('');
  const [customerCompanyTerm, setcustomerCompanyTerm] = useState(''); 
  const [customerCompany, setCustomerCompany] = useState<ISelectData[]>([]);
  const [isLoadingComboData, setIsLoadingComboData] = useState<boolean>(false);

  useEffect(() => {
    CustomerInformation()
  },[pathname])

  useEffect(() => {
    LoadCustomer()
  },[])

  useDelay(() => {
    if (customerCompanyTerm.length > 0){
      LoadCustomer()
    }
  }, [customerCompanyTerm], 500)

  useEffect(() => {

    if (isCancelMessage){
  
      if (caller === 'confirmCourtesy')
      {
        setModalCourtesy(false)
        handleCancelMessage(false)
      }
    }
  
  },[isCancelMessage, caller]);

  useEffect(() => {

    if(isConfirmMessage)
    {
      if (caller === 'confirmCourtesy')
      {
        setConfirmCourtesy(true)
      }
    }
  },[isConfirmMessage, caller]);

  useEffect(() => {

    if(confirmCourtesy)
    {  
      setConfirmCourtesy(false)
      setModalCourtesy(false)
      handleCaller("")
      handleConfirmMessage(false)
      EffectCourtesy()
    }
  },[confirmCourtesy]);


  // PublicationNames columns
  const columnsPublicationNames = [
    { name: 'nom_Pesquisa',             title: ' ' },
    { name: 'btnEditar',                title: ' ' },
    { name: 'btnCortesia',                title: ' ' },
  ];

  const [tableColumnExtensionsPublicationNames] = useState([
    { columnName: 'des_RecursoSistema',       width: '70%' },
    { columnName: 'btnEditar',                width: '10%' },
    { columnName: 'btnCortesia',              width: '10%' },
  ]);

  const CustomerInformation = useCallback(async() => {
    try {
    setIsLoading(true)

    const customerId = pathname.substr(30)

    const response = await api.get<ICustomerInformation>('/PublicacaoNomes/InformacoesCliente', {
      params:{
        customerId,
        token,
      } 
    })

    setCompanyId(response.data.id)
    setCompanyName(response.data.value)
    setcustomerCompanyTerm(response.data.value)
    setCustomerCompanyValue(response.data.value)
    setCustomerCompanyId(customerId)
    LoadPublicationNamesList(response.data.id);
    localStorage.setItem('@GoJur:customerId', customerId);

  } catch (err) {
    setIsLoading(false)
    console.log(err);
  }

  },[companyId, companyName, customerCompanyTerm, customerCompanyId, customerCompanyValue]);


  const LoadPublicationNamesList = useCallback(async(companyId: string) => {
    try {

      setIsLoading(true)

      const response = await api.get<IPublicationNamesData[]>('/PublicacaoNomes/ListarPublicacoesNomes', {
        params:{
        companyId,
        token,
        }
      });
      
      setPublicationNamesList(response.data)       
      setIsLoading(false)

    } catch (err) {
      setIsLoading(false)
      console.log(err);
    }

  },[]);


  const EffectCourtesy = useCallback(async() => {
    try {
      setIsLoading(true)

      await api.post('/PublicacaoNomes/EfetuarCortesia', {       
        cod_PublicacaoNome: publicationNameId,
        companyId,
        token,

      })
   
      addToast({
        type: "success",
        title: "Operação Concluída",
        description: "Cortesia Efetuada."
      })

      setPublicationNameId(0)
      CustomerInformation()
     
    } catch (err: any) {
      setPublicationNameId(0)
      setIsLoading(false)
      addToast({
        type: "error",
        title: "Falha ao efetivar cortesia.",
        description: err.response.data.Message
      })
    }
  },[publicationNameId]);

  const LoadCustomer = async (stateValue?: string) => {

    if (isLoadingComboData){
      return false;
    }

    // when is a first initialization get value from edit if not load from state as term typing
    let filter = stateValue == "initialize"? customerCompanyValue:customerCompanyTerm
    if (stateValue == 'reset'){
      filter = ''
    }

    try {
      const response = await api.post<ICustomerData[]>('/Clientes/ListarCombo', {
          rows: 50,
          filterClause: filter,
          token,
       
      });

      const listCustomerCompany: ISelectData[] = []

      response.data.map(item => {
        if(item.cod_Referencia != null && item.cod_Referencia != ""){
          return listCustomerCompany.push({
            id: item.cod_Cliente,
            label: item.nom_Pessoa
          })
        }
       
      })
      
      setCustomerCompany(listCustomerCompany)

      setIsLoadingComboData(false)
      
    } catch (err) {
      console.log(err);
    }
  }

  const CustomCell = (props) => {
        
    const { column } = props;

    let variationList: any = []
    variationList = props.row.nom_VariacaoList

  if (column.name === 'nom_Pesquisa') {
    return (
      
      <Table.Cell {...props}>
      
        <div style={{float:'left',width:'70%'}}>
          <span style={{color:'black', fontSize:'0.6rem', fontFamily:'Arial', fontWeight:600, }}>NOME PRINCIPAL:&nbsp;</span>
          <span style={{color:'black', fontSize:'0.7rem', fontFamily:'Arial'}}>{props.row.nom_Pesquisa}</span>
          <span style={{color:'black', fontSize:'0.6rem', fontFamily:'Arial', fontWeight:600, }}>  - OAB:&nbsp;</span>
          <span style={{color:'black', fontSize:'0.6rem', fontFamily:'Arial'}}>{props.row.num_OAB}</span>
          <span style={{color:'black', fontSize:'0.6rem', fontFamily:'Arial', fontWeight:600, }}>  - UF:&nbsp;</span>
          <span style={{color:'black', fontSize:'0.6rem', fontFamily:'Arial'}}>{props.row.des_UfOab}</span>
        
          <br />

          <span style={{color:'black', fontSize:'0.6rem', fontFamily:'Arial', fontWeight:600, }}>ABRANGÊNCIA:&nbsp;</span>
          <span style={{color:'black', fontSize:'0.75rem', fontFamily:'Arial'}}>{props.row.des_UfAbrangencia}</span>

          <br />
          <br />

          {variationList.map(item => (
            <>
              {item.tpo_Variacao != "P" && (
                <>
                  <span style={{color:'black', fontSize:'0.6rem', fontFamily:'Arial', fontWeight:600, marginLeft:"30px"}}>Variação:&nbsp;</span>
                  <span style={{color:'black', fontSize:'0.75rem', fontFamily:'Arial'}}>{item.des_TermoVariacao}</span>

                  {item.tpo_Variacao != "E" && (
                    <> 
                      <span style={{color:'black', fontSize:'0.6rem', fontFamily:'Arial', fontWeight:600}}> - TIPO:&nbsp;</span>
                      <span style={{color:'black', fontSize:'0.75rem', fontFamily:'Arial'}}>Variação</span>
                      <br />
                      <br />
                    </>
                  )}
    
                  {item.tpo_Variacao == "E" && (
                    <> 
                      <span style={{color:'black', fontSize:'0.6rem', fontFamily:'Arial', fontWeight:600}}> - TIPO:&nbsp;</span>
                      <span style={{color:'red', fontSize:'0.75rem', fontFamily:'Arial'}}>Exclusão</span>
                      <br />
                      <br />
                    </>
                  )}
                </>
                )}
              
            </>
          ))
        }

          {props.row.flg_Cortesia == "S" && (
            <> 
              <span style={{color:'black', fontSize:'0.6rem', fontFamily:'Arial', fontWeight:600, }}>CORTESIA:&nbsp;</span>
              <span style={{color:'black', fontSize:'0.75rem', fontFamily:'Arial'}}>
                Válida de:&nbsp;
                <b>{props.row.dta_CortesiaInicio}</b> 
                &nbsp;à&nbsp;
                <b>{props.row.dta_CortesiaTermino}</b> 
              </span>
              <br />
            </>
          )}
                 
        </div>
     
      </Table.Cell>
      );
    }
    
    if (column.name === 'btnEditar') {
      return (
        <Table.Cell onClick={(e) => handleClickEditNewName(props)} {...props}>
          &nbsp;&nbsp;
          <FiEdit title="Clique para editar " />
        </Table.Cell>
      );
    }

    if(column.name === 'btnCortesia' && props.row.flg_Cortesia == "S" && props.row.flg_Ativo == "S") {
      return (
        <Table.Cell onClick={(e) => handleClickEffectCourtesy(props)} {...props}>
          &nbsp;&nbsp;
          <BiTimeFive title="Clique para efetivar cortesia " />
        </Table.Cell>
      );
    }

    return <Table.Cell {...props} />;
  };

  const CloseCoverageModal = () => {
    setShowCoverageModal(false)
  }

  const OpenCoverageModal = () => {
    setShowCoverageModal(true)
  }

  const OpenNewNameModal = () => {
    setShowNewNameModal(true)
  }

  const handleClickEditNewName = (e) => { 
    setEditCaller("editNewName")
    setPublicationNameId(e.row.cod_PublicacaoNome)
    setShowNewNameModal(true)
  }

  const CloseNewNameModal = () => {
    setShowNewNameModal(false)
    setPublicationNameId(0)
  }

  const CloseNewNameModalAfterSave = () => {
    setShowNewNameModal(false)
    setPublicationNameId(0)
    CustomerInformation()
  }

  const handleClickEffectCourtesy = (e) => {
    setModalCourtesy(true) 
    setPublicationNameId(e.row.cod_PublicacaoNome)
  }
 
  // If CustomerCompany Change
  const handlCustomerSelected = (item) => { 
      
    if (item){
      setCustomerCompanyValue(item.label)
      setCustomerCompanyId(item.id)
      history.push(`/custom/BCO01PublicationNames/${item.id}`)
    }else{
      LoadCustomer('reset')
      setCustomerCompanyId('')
    }
  }
  
  return (

    <Container>

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

      {modalCourtesy && (
        <ConfirmBoxModal
          title="Efetivação de Cortesia"
          caller="confirmCourtesy"
          message="Confirma a liberação desta cortesia para que ela não expire após 15 dias e se torne permanente ?"
          useCheckBoxConfirm
        />
      )}

      <HeaderPage />

      {(showCoverageModal) && <OverlayPublicationNames /> }
      {(showCoverageModal) && <CoverageListModal callbackFunction={{ CloseCoverageModal}} /> }
      {(showNewNameModal) && <OverlayPublicationNames /> }
      {(showNewNameModal) && <NewNameModal callbackFunction={{ CloseNewNameModal, setEditCaller, CloseNewNameModalAfterSave, editCaller, companyId, publicationNameId}} /> }

      <div style={{display: "flex", fontSize:"16px"}}>
        <label htmlFor="companyName" className='accountInformationCompany'>
          <b>EMPRESA: &nbsp;</b>
        </label>
        <AutoCompleteSelect className="selectCompany">                    
          <Select
            isSearchable  
            isClearable 
            value={customerCompany.filter(options => options.id == customerCompanyId)}
            onChange={handlCustomerSelected}
            onInputChange={(term) => setcustomerCompanyTerm(term)}
            placeholder=""
            styles={selectStyles}              
            options={customerCompany}
          />
        </AutoCompleteSelect>

        <label htmlFor="companyId" className='accountInformation' style={{marginLeft:"10px"}}>
          <b>COD. REFERÊNCIA: &nbsp;</b>  
          {companyId}     
        </label>

      </div>

      <Content>

        <header style={{display:"flex"}}>

          <div className='headerButtons'>
            <button
              className="buttonLinkClick buttonInclude"
              type="submit"
              onClick={OpenNewNameModal}
            >
              <FaIdBadge />
              Incluir Novo Nome
            </button>
          </div>

          <div className='headerButtons'>
            <button
              className="buttonLinkClick buttonInclude"
              type="submit"
              onClick={OpenCoverageModal}
            >
              <FaFileAlt />
              Lista de Abrangências
            </button>
          </div>

        </header>

        <Form>

          <section>       
            <div>
              <GridSubContainer>
                <Grid
                  rows={publicationNamesList}
                  columns={columnsPublicationNames}
                >
                  <PagingState
                    currentPage={currentPage}
                    pageSize={pageSize}
                    onCurrentPageChange={setCurrentPage}
                    onPageSizeChange={setPageSize}
                  />
                  <CustomPaging totalCount={totalRows} />
                  <Table
                    cellComponent={CustomCell}
                    columnExtensions={tableColumnExtensionsPublicationNames}
                    messages={isLoading? languageGridLoading: languageGridEmpty}
                  />
                  <TableHeaderRow />
                </Grid>
              </GridSubContainer>
            </div>
          </section>


        </Form>

      </Content>
      
        
    </Container>
    
    
  );
};

export default PublicationNames;
