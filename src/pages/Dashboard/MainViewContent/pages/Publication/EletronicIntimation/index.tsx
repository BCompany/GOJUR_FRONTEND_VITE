/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable no-console */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable no-return-assign */
/* eslint-disable no-alert */
import React, { useCallback, useEffect, useState, UIEvent, ChangeEvent, useRef } from 'react';
import api from 'services/api';
import LoaderWaiting from 'react-spinners/ClipLoader';
import { FiEdit, FiTrash, FiArrowLeft, FiX } from 'react-icons/fi';
import { BiSave } from 'react-icons/bi';
import { FcAbout } from 'react-icons/fc';
import { ImCancelCircle } from 'react-icons/im';

import { AutoCompleteSelect, Overlay } from 'Shared/styles/GlobalStyle';
import Select from 'react-select';
import { useToast } from 'context/toast';
import { useConfirmBox } from 'context/confirmBox';
import ConfirmBoxModal from 'components/ConfirmBoxModal';
import { FormatDate, selectStyles, useDelay} from 'Shared/utils/commonFunctions';
import { loadingMessage, noOptionsMessage } from 'Shared/utils/commonConfig';
import { DataTypeProvider, PagingState, CustomPaging } from '@devexpress/dx-react-grid';
import { Grid, Table, TableHeaderRow, PagingPanel } from '@devexpress/dx-react-grid-material-ui';
import { languageGridEmpty,languageGridLoading, languageGridPagination } from 'Shared/utils/commonConfig';
import { format } from 'date-fns';
import { useHistory } from 'react-router-dom';
import { HeaderPage } from 'components/HeaderPage';
import CourtModal from '../CourtModal';
import { IEletronicIntimation, ISelectData, IName, ICourt } from '../Interfaces/IEletronicIntimation';
import { Container, Content, GridEletronicIntimation } from './styles';

const EletronicIntimation = () => {
  const history = useHistory();
  const { addToast } = useToast();
  const token = localStorage.getItem('@GoJur:token');
  const [isLoadingComboData, setIsLoadingComboData] = useState<boolean>(false);
  const [showCourtModal, setShowCourtModal] = useState<boolean>(false);
  const [readOnly, setReadOnly] = useState<boolean>(true);
  const [courtReadOnly, setCourtReadOnly] = useState<boolean>(true);
  const [eletronicIntimationId, setEletronicIntimationId] = useState('');
  const [desLogin, setDesLogin] = useState('');
  const [password, setPassword] = useState<string>('');
  const {isConfirmMessage, isCancelMessage, handleCancelMessage, handleConfirmMessage, caller, handleCaller } = useConfirmBox();
  const [saveWarning, setSaveWarning] = useState(false);
  const [deleteWarning, setDeleteWarning] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [isLoader, setIsLoader] = useState(false);
  const [loaderMessagem, setLoaderMessage] = useState('');
  const [showEditButton, setShowEditButton] = useState(false);
 
  // NAME
  const [nameTerm, setNameTerm] = useState(''); 
  const [nameId, setNameId] = useState('');
  const [nameValue, setNameValue] = useState('');
  const [name, setName] = useState<ISelectData[]>([]);

  // COURT
  const [courtTerm, setCourtTerm] = useState(''); 
  const [courtId, setCourtId] = useState('');
  const [courtValue, setCourtValue] = useState('');
  const [court, setCourt] = useState<ISelectData[]>([]);

  // GRID
  const [eletronicIntimationList, setEletronicIntimationList] = useState<IEletronicIntimation[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [pageSizes] = useState([10, 20, 30, 50]);
  const [dateColumns] = useState(['date']);
  const DateFormatter = ({ value }) => format(new Date(value), 'dd/MM/yyyy');
  const DateTypeProvider = props => (<DataTypeProvider formatterComponent={DateFormatter} {...props} />);
  const [totalCount, setTotalCount] = useState(0);

  const columnsPeriod = [
    { name: 'accessName',   title: 'Nome'},
    { name: 'accessCourt',  title: 'Tribunal'},
    { name: 'accessLogin',  title: 'Login'},
    { name: 'accessStatus', title: 'Status'},
    { name: 'edit',         title: ' '},
    { name: 'remove',       title: ' '}
  ];

  const [tableColumnExtensionsPeriod] = useState([
    { columnName: 'accessName',   width: '25%' },
    { columnName: 'accessCourt',  width: '40%' },
    { columnName: 'accessLogin',  width: '12%' },
    { columnName: 'accessStatus', width: '13%' },
    { columnName: 'edit',         width: '5%' },
    { columnName: 'remove',       width: '5%' },
  ]);


  useEffect(() => {
    LoadEletronicIntimations()
    LoadNames('reset')
  }, [])

  useEffect(() => {
    LoadEletronicIntimations()
  }, [currentPage, pageSize])


  useEffect(() => {
    if(!isEdit){
      if(nameId != "")
      {
        LoadCourts('reset')
        setCourtReadOnly(false)
      }
      else
      {
        setCourtReadOnly(true)
        setCourt([])
      }
    }
  }, [nameId, isEdit])


  useEffect(() => {
    if (isConfirmMessage){
      if (caller == "saveMessage")
      {
        Save()
      }
      if (caller == "deleteMessage")
      {
        Delete()
      }
    }
  }, [isConfirmMessage, caller])


  useEffect(() => {
    if (isCancelMessage){
      if (caller == "saveMessage")
      {
        setSaveWarning(false)
        handleCancelMessage(false)
      }
      if (caller == "deleteMessage")
      {
        setDeleteWarning(false)
        handleCancelMessage(false)
      }
    }
  }, [isCancelMessage, caller])


  useDelay(() => {
    if (nameTerm.length > 0){
      LoadNames()
    }
  }, [nameTerm], 1000)


  useDelay(() => {
    if (courtTerm.length > 0){
      LoadCourts()
    }
  }, [courtTerm], 1000)


  const LoadEletronicIntimations = useCallback(async () => {
    try {
      setLoaderMessage('Carregando')
      setIsLoader(true)
      const response = await api.get<IEletronicIntimation[]>('/IntimacoesEletronicas/Listar', {
        params: {
          page: currentPage + 1,
          rows: pageSize,
          token
        }
      });

      if (response.data.length > 0)
        setTotalCount(response.data[0].count)

      setEletronicIntimationList(response.data)
      setIsLoader(false)
    } catch (err) {
      setIsLoader(false)
      setLoaderMessage('')
      console.log(err);
    }
  }, [currentPage, pageSize]);


  const LoadNames = async (stateValue?: string) => {

    if (isLoadingComboData){
      return false;
    }

    // when is a first initialization get value from edit if not load from state as term typing
    let filter = stateValue == "initialize"? nameValue:nameTerm
    if (stateValue == 'reset'){
      filter = ''
    }

    try {
      const response = await api.post<IName[]>('/PublicacaoNome/Listar', {
        description: filter,
        token,
      });

      const listName: ISelectData[] = []

      response.data.map(item => {
        return listName.push({
          id: item.id,
          label: item.value
        })
      })
      
      setName(listName)
      setIsLoadingComboData(false)
    } catch (err) {
      console.log(err);
    }
  }


  const LoadCourts = useCallback(async (stateValue?: string) => {

    if(nameId == "")
    {
      addToast({
        type: "info",
        title: "Selecionar nome",
        description: "Pelo menos um nome deve ser selecionado"
      })

      return false;
    }
    
    if (isLoadingComboData){
      return false;
    }

    // when is a first initialization get value from edit if not load from state as term typing
    let filter = stateValue == "initialize"? courtValue:courtTerm
    if (stateValue == 'reset'){
      filter = ''
    }

    try {
      const response = await api.get<ICourt[]>('/Abrangencias/ListarIntimacaoEletronicaPorNomePesquisa', {
        params: {
          token,
          id: nameId
        }
      });

      const listCourt: ISelectData[] = []

      response.data.map(item => {
        return listCourt.push({
          id: item.id,
          label: item.value
        })
      })
      
      setCourt(listCourt)
      setIsLoadingComboData(false)
    } catch (err) {
      console.log(err);
    }
  }, [nameId]);


  const handleNameSelected = (item) => { 
    if (item){
      setNameValue(item.label)
      setNameId(item.id)
    }else{
      setNameValue('')
      LoadNames('reset')
      setNameId('')
    }
  }


  const handleCourtSelected = (item) => { 
    if (item){
      setCourtValue(item.label)
      setCourtId(item.id)
    }else{
      setCourtValue('')
      LoadCourts('reset')
      setCourtId('')
    }
  }


  const handleCurrentPage = (value) => {
    setIsLoading(true)
    setCurrentPage(value)
  }


  const handlePageSize = (value) => {
    setPageSize(value)
    setIsLoading(true)
  }


  const CustomCell = (props) => {

    const { column } = props;

    if (column.name === 'accessName') {
      return (
        <Table.Cell onClick={(e) => (e)} {...props}>
          <div title={props.row.name} style={{fontSize:'12px'}}>
            {props.row.name}
          </div>
        </Table.Cell>
      );
    }

    if (column.name === 'accessCourt') {
      return (
        <Table.Cell onClick={(e) => (e)} {...props}>
          <div title={props.row.courtName} style={{fontSize:'12px'}}>
            {props.row.courtName}
          </div>
        </Table.Cell>
      );
    }

    if (column.name === 'accessLogin') {
      return (
        <Table.Cell onClick={(e) => (e)} {...props}>
          <div title={props.row.desLogin} style={{fontSize:'12px'}}>
            {props.row.desLogin}
          </div>
        </Table.Cell>
      );
    }

    if (column.name === 'accessStatus') {
      return (
        <Table.Cell onClick={(e) => (e)} {...props}>
          <div title={props.row.status} style={{fontSize:'12px'}}>
            
            {(props.row.status == "AT" || props.row.status == "VL") && (
              <div id='InformationStatus' style={{float:'left'}}>
                {props.row.statusDesc}
              </div>
            )}
            {(props.row.status == "LF" || props.row.status == "FC") && (
              <div id='InformationStatus' style={{float:'left', color:'red'}}>
                {props.row.statusDesc}
              </div>
            )}

            {props.row.status == "AT" && (
              <div id='InformationIcon' style={{marginLeft:'-10px', float:'left', marginTop:'2px'}}>
                <FcAbout id="tipMesssage" title="A captura está ativa e operando normalmente." />
              </div>
            )}
            {props.row.status == "VL" && (
              <div id='InformationIcon' style={{marginLeft:'-10px', float:'left', marginTop:'2px'}}>
                <FcAbout id="tipMesssage" title="Estamos validando o login/senha no tribunal após alteração ou inclusão, captura não ativa." />
              </div>
            )}
            {props.row.status == "LF" && (
              <div id='InformationIcon' style={{marginLeft:'-10px', float:'left', marginTop:'2px'}}>
                <FcAbout id="tipMesssage" title="O login senha está inválido, captura não ativa." />
              </div>
            )}
            {props.row.status == "FC" && (
              <div id='InformationIcon' style={{marginLeft:'-10px', float:'left', marginTop:'2px'}}>
                <FcAbout id="tipMesssage" title="O monitor não está conseguindo efetuar a busca, captura não ativa." />
              </div>
            )}
          </div>
        </Table.Cell>
      );
    }
    
    if (column.name === 'edit') {
      return (
        <Table.Cell onClick={(e) => handleClick(props)} {...props}>
          <FiEdit title="Alterar movimento " />
        </Table.Cell>
      );
    }

    if (column.name === 'remove') {
      return (
        <Table.Cell onClick={(e) => handleClick(props)} {...props}>
          <FiTrash title="Excluir movimento" />
        </Table.Cell>
      );
    }

    return <Table.Cell {...props} />;
  }


  const handleClick = useCallback(async (props: any) => {
    
    setEletronicIntimationId(props.row.id)
    
    if (props.column.name === 'edit'){
      setIsLoadingComboData(true)
      setShowEditButton(true)
      Edit(props.row.id);
    }
    if (props.column.name === 'remove'){
      setDeleteWarning(true)
    }
  }, [currentPage, pageSize]);


  const Save = useCallback(async () => {
   
    handleCancelMessage(true)
    handleConfirmMessage(false)

    if(nameId == "" && nameValue == "")
    {
      addToast({
        type: "info",
        title: "Selecionar nome",
        description: "Pelo menos um nome deve ser selecionado"
      })
      return false;
    }
    if(courtId == "")
    {
      addToast({
        type: "info",
        title: "Selecionar tribunal",
        description: "Pelo menos um tribunal deve ser selecionado"
      })
      return false;
    }
    if(desLogin == "")
    {
      addToast({
        type: "info",
        title: "Informar o login",
        description: "O campo login deve ser preenchido"
      })
      return false;
    }
    if(password == "")
    {
      addToast({
        type: "info",
        title: "Informar a senha",
        description: "O campo senha deve ser preenchido"
      })
      return false;
    }

    try {
      setLoaderMessage('Salvando')
      setIsLoader(true)
      const response = await api.post<IName[]>('/IntimacoesEletronicas/Salvar', {
        id: eletronicIntimationId,
        nameId,
        courtId,
        desLogin,
        password,
        token
      });

      setIsLoadingComboData(false)
      handleCaller('')
      setSaveWarning(false)
      setNameId('')
      setNameValue('')
      setCourtId('')
      setCourtValue('')
      setDesLogin('')
      setPassword('')
      LoadEletronicIntimations()
      setIsLoader(false)
      setShowEditButton(false)
      
      if(isEdit)
        setIsEdit(false)

      addToast({
        type: "success",
        title: "Operação concluída",
        description: "O registro foi salvo em nosso sistema. Aguarde até que o nome seja validado."
      })
    } catch (err:any) {
      console.log(err.response.data.Message)
      setIsLoadingComboData(false)
      setShowEditButton(false)
      handleCaller('')
      setSaveWarning(false)
      setIsLoader(false)
      addToast({
        type: "error",
        title: "Não foi possível salvar a intimação eletrônica",
        description: err.response.data.Message
      })
    }
  },[token, eletronicIntimationId, nameId, nameValue, courtId, desLogin, password])


  const Edit = async (id) => {
    try {
      setLoaderMessage('Carregando')
      setIsLoader(true)

      const response = await api.get<IEletronicIntimation>('/IntimacoesEletronicas/Editar', {
        params:{
          id,
          token
        }
      });

      setCourtReadOnly(false)
      setIsEdit(true)
      setNameId(response.data.nameId)
      setNameValue(response.data.name)
      setCourtId(response.data.courtId)
      setCourtValue(response.data.courtName)
      setDesLogin(response.data.desLogin)
      setPassword(response.data.password)
      setIsLoadingComboData(false)
      setIsLoader(false)
    } catch (err:any) {
      setIsLoader(false)
      addToast({
        type: "error",
        title: "Não foi possível obter os dados da intimação",
        description: err.response.data.Message
      })
    }
  };


  const Delete = useCallback(async () => {
    handleCancelMessage(true)
    handleConfirmMessage(false)

    try {
      setLoaderMessage('Apagando')
      setIsLoader(true)

      const response = await api.delete<IName[]>('/IntimacoesEletronicas/Apagar', {
        params:{
          id: eletronicIntimationId,
          token
        }
      });

      handleCaller('')
      setDeleteWarning(false)
      LoadEletronicIntimations()
      setIsLoader(false)
      addToast({
        type: "success",
        title: "Operação concluída",
        description: "O registro foi apagado em nosso sistema."
      })
    } catch (err:any) {
      handleCaller('')
      setDeleteWarning(false)
      setIsLoader(false)
      addToast({
        type: "error",
        title: "Não foi possível apagar a intimação eletrônica",
        description: err.response.data.Message
      })
    }
  },[token, eletronicIntimationId])


  const ListAllCourts = () => { 
    setShowCourtModal(true)
  }


  const CloseCourtModal = () => {
    setShowCourtModal(false)
  }


  const HandleCancel = () => {
    setNameId('')
    setNameValue('')
    setCourtId('')
    setCourtValue('')
    setDesLogin('')
    setPassword('')
    setShowEditButton(false)
  }

  
  return (
    <>
      <Container>
        <HeaderPage />

        { saveWarning && (
          <ConfirmBoxModal
            useCheckBoxConfirm
            caller="saveMessage"
            title="Inclusão de pesquisa de intimação eletrônica"
            message="Declaro que estou de acordo com a busca de acordo com o termo de serviço disponíveis no site www.bcompany.com.br"
          />
        )}

        { deleteWarning && (
          <ConfirmBoxModal
            useCheckBoxConfirm
            caller="deleteMessage"
            title="Remoção de pesquisa de intimação eletrônica"
            message="Declaro que estou ciente que ao confirmar, o sistema deixará de buscar novas intimações eletrônicas para o nome neste tribunal."
          />
        )}

        {(showCourtModal) && <Overlay /> }
        {(showCourtModal) && <CourtModal callbackFunction={{CloseCourtModal}} /> }

        <div style={{width:'99%'}}>
          <div style={{float:'right', marginTop:'-2px'}}>
            <button 
              className="buttonClick" 
              title="Clique para retornar a lista de publicações"
              type="submit"
              style={{height:'37px'}}
              onClick={() => ListAllCourts()}
            >
              Ver todos tribunais
            </button>
          </div>
          <div style={{float:'right'}}>
            <button 
              className="buttonClick" 
              title="Clique para retornar a lista de publicações"
              type="submit"
              onClick={() => history.push(`/publication`)}
            >
              <FiArrowLeft />
              Retornar
            </button>
          </div>
        </div>

        <Content>
          Configuração de intimação eletrônica

          <br />
          <br />

          <div id='NameSelect' style={{width:'310px', float:'left', pointerEvents:isEdit ? 'none' : 'unset'}}>
            <AutoCompleteSelect className="selectSubject">
              <p>Selecione um nome</p>  
              <Select
                isSearchable   
                value={{ id: nameId, label: nameValue }}
                onChange={handleNameSelected}
                onInputChange={(term) => setNameTerm(term)}
                isClearable
                placeholder="Selecione um nome"
                isLoading={isLoadingComboData}
                loadingMessage={loadingMessage}
                noOptionsMessage={noOptionsMessage}
                styles={selectStyles}              
                options={name}
              />
            </AutoCompleteSelect>
          </div>

          <div id='CourtSelect' style={{width:'450px', float:'left', marginLeft:'20px', pointerEvents:isEdit ? 'none' : 'unset'}}>
            <AutoCompleteSelect className="selectSubject">
              <p>Selecione um tribunal (Necessário selecionar um nome antes)</p>
              <Select
                isSearchable
                isClearable
                value={courtReadOnly == false ? {id: courtId, label: courtValue} : []}
                onChange={handleCourtSelected}
                onInputChange={(term) => setCourtTerm(term)}
                placeholder="Selecione um tribunal"
                isLoading={isLoadingComboData}
                loadingMessage={loadingMessage}
                noOptionsMessage={noOptionsMessage}
                styles={selectStyles}              
                options={court}
                isDisabled={courtReadOnly}
              />
            </AutoCompleteSelect>
          </div>

          <div id='InformationIcon' style={{marginTop:'35px'}}>
            <FcAbout id="tipMesssage" title="Estão disponíveis para seleção apenas os tribunais referentes ao estado em que o advogado tem busca de publicações" />
          </div>

          <br />

          <div style={{float:'left', marginLeft:'0.5%'}}>
            <div id='Login' style={{width:'300px', float:'left'}}>
              <label htmlFor="email">
                Login
                <br />
                <input 
                  type="search"
                  value={desLogin}
                  name="email"
                  readOnly={readOnly}
                  onFocus={() => setReadOnly(false)}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setDesLogin(e.target.value)}
                  required
                  autoComplete="nope"
                />
              </label>
            </div>

            <div id='Password' style={{width:'300px', float:'left', marginLeft:'30px'}}>
              <label htmlFor="senha">
                Senha
                <br />
                <input 
                  type="password"
                  value={password}
                  name="senha"
                  readOnly={readOnly}
                  onFocus={() => setReadOnly(false)}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                  required
                />
              </label>
            </div>

            <div id='SaveButton' style={{float:'left', marginLeft:'30px', marginTop:'20px'}}>
              <button 
                className="buttonClick"
                type='button'
                onClick={()=> setSaveWarning(true)}
                style={{width:'100px', height:'35px'}}
              >
                <BiSave />
                Salvar
              </button>
            </div>

            {showEditButton && (
              <div id='CancelButton' style={{float:'left', marginLeft:'5px', marginTop:'20px'}}>
                <button 
                  className="buttonClick"
                  type='button'
                  onClick={()=> HandleCancel()}
                  style={{width:'100px', height:'35px'}}
                >
                  <ImCancelCircle />
                  Cancelar
                </button>
              </div>
            )}

          </div>

          <br />
          <br />
          <br />
          <br />

          <GridEletronicIntimation>
            <Grid
              rows={eletronicIntimationList}
              columns={columnsPeriod}
            >
              <PagingState
                currentPage={currentPage}
                pageSize={pageSize}
                onCurrentPageChange={(e) => handleCurrentPage(e)}
                onPageSizeChange={(e) => handlePageSize(e)}
              />
              <CustomPaging totalCount={totalCount} />
              <DateTypeProvider for={dateColumns} />
              <Table
                cellComponent={CustomCell}
                columnExtensions={tableColumnExtensionsPeriod}
                messages={isLoading? languageGridLoading: languageGridEmpty}
              />
              <TableHeaderRow />
              <PagingPanel
                messages={languageGridPagination}
                pageSizes={pageSizes}
              />
            </Grid>
          </GridEletronicIntimation>

        
        </Content>

        {isLoader && (
          <>
            <Overlay />
            <div className='waitingMessage'>   
              <LoaderWaiting size={15} color="var(--blue-twitter)" /> 
              &nbsp;&nbsp;
              {loaderMessagem}
              ...
            </div>
          </>
        )}

      </Container>
    </>
  )
}    

export default EletronicIntimation;