/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable no-console */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable no-return-assign */
/* eslint-disable no-alert */
/* eslint-disable no-param-reassign */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable react/jsx-one-expression-per-line */

import React, {useEffect, useState, useCallback, ChangeEvent } from 'react';
import api from 'services/api';
import { FiEdit, FiTrash, FiX } from 'react-icons/fi';
import { FiSave } from 'react-icons/fi';
import { FaRegTimesCircle } from 'react-icons/fa';
import ConfirmBoxModal from 'components/ConfirmBoxModal';
import { useConfirmBox } from 'context/confirmBox';
import { useHistory } from 'react-router-dom'
import { Overlay } from 'Shared/styles/GlobalStyle';
import LoaderWaiting from 'react-spinners/ClipLoader';
import Switch from "react-switch";
import { Grid, Table, TableHeaderRow } from '@devexpress/dx-react-grid-material-ui';
import { languageGridEmpty } from 'Shared/utils/commonConfig';
import { useToast } from 'context/toast';
import { IUnfolding } from './IUnfolding';
import { Modal, GridUnfolding, OverlayUnfolding } from './styles';
import FollowModal from '../FollowModal';
import AwarenessModal from 'components/AwarenessModal';

const UnfoldingModal = (props) => {
  const { CloseUnfoldingModal, matterId } = props.callbackFunction
  const token = localStorage.getItem('@GoJur:token');
  const { addToast } = useToast();
  const [matterUnfoldingList, setMatterUnfoldingList] = useState<IUnfolding[]>([]);
  const [matterUnfoldingId, setMatterUnfoldingId] = useState('0');
  const [matterNumber, setMatterNumber] = useState('');
  const [description, setDescription] = useState('');
  const [flgCourt, setFlgCourt] = useState('N');
  const [credentialId, setCredentialId] = useState("");
  const [isFollow, setIsFollow] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [followPermission, setFollowPermission] = useState(false);
  const [isDeleteWithCourt, setIsDeleteWithCourt] = useState<boolean>(false);
  const {isConfirmMessage, isCancelMessage, handleCancelMessage, handleConfirmMessage, handleCaller, caller, handleCheckConfirm } = useConfirmBox();
  const [openMatterMonitorResourceModal, setOpenMatterMonitorResourceModal] = useState<boolean>(false)
  const [confirmMatterMonitorResourceModal, setConfirmMatterMonitorResourceModalFree] = useState<boolean>(false)
  const [openMatterMonitorResourceModalFree, setOpenMatterMonitorResourceModalFree] = useState<boolean>(false)
  const [confirmMatterMonitorResourceModalFree, setConfirmMatterMonitorResourceModal] = useState<boolean>(false)
  const [matterMonitorResourceMessage, setMatterMonitorResourceMessage] = useState<string>("")
  const companyPlan = localStorage.getItem('@GoJur:companyPlan')
  const accessCode = localStorage.getItem('@GoJur:accessCode')
  const history = useHistory();

  const [showFollowModal, setShowFollowModal] = useState<boolean>(false)
  const [matterSelectedId, setMatterSelectedId] = useState<number>(0)
  const [matterSelectedNumber, setMatterSelectedNumber] = useState<string>("")
  const [isSecretJustice, setIsSecretJustice] = useState<boolean>(false);
  const [selectedCredentialid, setSelectedCredentialid] = useState<number>(0);

  const [showAwarenessModal, setShowAwarenessModal] = useState<boolean>(false)
  const [awarenessModalMessage, setAwarenessModalMessage] = useState<string>("")
  const [awarenessModalTitle, setAwarenessModalTitle] = useState<string>("Tribunal - Abrangência")
  const [awarenessButtonOkText, setAwarenessButtonOkText] = useState<string>("Ver Abrangências")

  const [isChanging, setIsChanging] = useState<boolean>(false);

  const columns = [
    { name: 'matter', title: 'Processo'},
    { name: 'description', title: 'Descrição'},
    { name: 'flag', title: 'Monitoramento'},
    { name: 'edit', title: ' '},
    { name: 'remove',title: ' '}
  ];

  const [tableColumnExtensions] = useState([
    { columnName: 'matter',     width: '20%' },
    { columnName: 'description', width: '45%' },
    { columnName: 'flag', width: '15%' },
    { columnName: 'edit', width: '10%' },
    { columnName: 'remove',width: '10%' },
  ]);

  useEffect(() => {

    if (isCancelMessage){
  
      if (caller === 'confirmOpenMatterMonitorResourceModal')
      {
        setOpenMatterMonitorResourceModal(false)
        handleCancelMessage(false)
        setMatterMonitorResourceMessage("")
      }
    }
  
  },[isCancelMessage, caller]);

  useEffect(() => {

    if(isConfirmMessage)
    {
      if (caller === 'confirmOpenMatterMonitorResourceModal')
      {
        localStorage.setItem('@GoJur:addMonitor', 'true');
        setConfirmMatterMonitorResourceModal(true)
      }     
    }
  },[isConfirmMessage, caller]);

  useEffect(() => {

    if(confirmMatterMonitorResourceModal)
    {  
      setOpenMatterMonitorResourceModal(false)
      handleCaller("")
      handleConfirmMessage(false)
      history.push('/changeplan')
    }
  },[confirmMatterMonitorResourceModal]);
  
  useEffect(() => {

    if (isCancelMessage){
  
      if (caller === 'confirmOpenMatterMonitorResourceModalFree')
      {
        setOpenMatterMonitorResourceModalFree(false)
        handleCancelMessage(false)
        setMatterMonitorResourceMessage("")
      }
    }
  
  },[isCancelMessage, caller]);

  useEffect(() => {

    if(isConfirmMessage)
    {
      if (caller === 'confirmOpenMatterMonitorResourceModalFree')
      {
        setConfirmMatterMonitorResourceModalFree(true)
      }     
    }
  },[isConfirmMessage, caller]);

  useEffect(() => {

    if(confirmMatterMonitorResourceModalFree)
    {  
      setOpenMatterMonitorResourceModalFree(false)
      handleCaller("")
      handleConfirmMessage(false)
      history.push('/changeplan')
    }
  },[confirmMatterMonitorResourceModalFree]);

  
  useEffect(() => {
    CheckPermission();
    ListMatterUnfolding(matterId)
  }, []);


  useEffect(() => {
    if(isCancelMessage){

      if(caller == "deleteMatterUnfolding"){
        setIsDeleteWithCourt(false)
        setMatterUnfoldingId("")
      }      
    }      
  },[isCancelMessage, caller]);


  useEffect(() => {
    if(isConfirmMessage && caller == "deleteMatterUnfolding")
    {
      setIsDeleteWithCourt(false)
      setIsFollow(true)
      Delete(matterUnfoldingId)
    }
  },[isConfirmMessage, matterUnfoldingId]);


  const CheckPermission = () => {
    const accessCode = localStorage.getItem('@GoJur:accessCode')

    if (accessCode == "adm" || accessCode?.toString().includes("MATFOLL"))
    {
      setFollowPermission(true)
    }
  };


  const ResetValues = () => {
    setMatterUnfoldingId('')
    setMatterNumber('')
    setDescription('')
    setFlgCourt('N')
    setCredentialId('0')
    setIsEdit(false)
  }


  const ListMatterUnfolding = async(matterId) => {
    try{
      const response = await api.get<IUnfolding[]>('/ProcessoDesdobramento/ListarPorProcesso', {
        params:{
          token,
          matterId
        }
      })

      setMatterUnfoldingList(response.data)
    } catch (err:any) {
      addToast({
        type: "error",
        title: "Operação não realizada",
        description: err.response.data.Message
      })
    }
  };


  const CustomCell = (props) => {
    
    const { column } = props;
    
    if (column.name === 'matter') {
      return (
        <Table.Cell onClick={(e) => console.log(e)} {...props}>
          <div title={props.row.matterNumber} style={{fontSize:'12px'}}>
            {props.row.matterNumber}
          </div>
        </Table.Cell>
      );
    }

    if (column.name === 'description') {
      return (
        <Table.Cell onClick={(e) => console.log(e)} {...props}>
          <div title={props.row.description} style={{fontSize:'12px'}}>
            {props.row.description}
          </div>
        </Table.Cell>
      );
    }

    if (column.name === 'flag') {
      return (
        <Table.Cell onClick={(e) => console.log(e)} {...props}>
          <div style={{fontSize:'12px'}}>
            {props.row.flgCourt == 'N' ? 'NÃO' : 'SIM'}
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

    if (column.name === 'remove') {
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
      setIsEdit(true)
      setMatterUnfoldingId(props.row.id)
      setMatterNumber(props.row.matterNumber)
      setDescription(props.row.description)
      setFlgCourt(props.row.flgCourt)
      setCredentialId(props.row.credentialId)
    }
    if (props.column.name === 'remove'){
      setMatterUnfoldingId(props.row.id)

      if(props.row.flgCourt == "S"){
        setIsDeleteWithCourt(true)
      }
      else{
        Delete(props.row.id)
      }
    }
  };


  const Delete = async(id) => {
    try{
      setIsFollow(true)

      const response = await api.delete('/ProcessoDesdobramento/Apagar', {
        params:{
          token,
          id,
          matterId
        }
      })

      addToast({type: "success", title: "Operação realizada com exito", description: 'Processo apagado no sistema'})
      ResetValues();
      setIsFollow(false)
      ListMatterUnfolding(matterId)
    } catch (err:any) {
      setIsFollow(false)
      addToast({type: "error", title: "Operação não realizada", description: err.response.data.Message})
    }
  };
  

  const Save = useCallback(async() => {
    try{

      if(matterNumber == '')
      {
        addToast({type: "info", title: "Operação não realizada", description: 'O campo Processo deve ser preenchido.'})
        return;
      }

      setIsFollow(true)

      const response = await api.post('/ProcessoDesdobramento/Salvar', {
        id: matterUnfoldingId,
        matterId,
        matterNumber,
        description,
        flgCourt,
        credentialId,
        token
      })

      addToast({type: "success", title: "Operação realizada com exito", description: 'Processo salvo no sistema'});
      ResetValues();
      ListMatterUnfolding(matterId);
      setIsFollow(false)
    } catch (err:any) {
      setIsFollow(false)
      addToast({type: "error", title: "Operação não realizada", description: err.response.data.Message})
    }
  },[matterUnfoldingId, matterId, matterNumber, description, flgCourt])


  const handleFollowButton = useCallback(async (flgCourt) => {
    
    if(matterUnfoldingId == "0" || matterUnfoldingId == "")
    {
      addToast({type: "info", title: "Operação não realizada", description: 'Necessário salvar antes de ligar o robô.'})
      return;
    }

    setIsFollow(true)
    
    if(flgCourt == "S")
    {
      Follow(flgCourt, matterUnfoldingId, matterNumber, selectedCredentialid) // OFF
      setFlgCourt("N")
    }
    else
    {
      Follow(flgCourt, matterUnfoldingId, matterNumber, selectedCredentialid) // ON
      setFlgCourt("S")
    }
  },[matterUnfoldingId, matterNumber, selectedCredentialid])


  const Follow = async(flgCourt, matterUnfoldingId, matterNumber, credentialId) => {
    try{

      if (isSecretJustice && selectedCredentialid === 0) {
        addToast({
          type: 'info',
          title: 'Operação NÃO realizada',
          description: "Para um processo em segredo de justiça, selecione uma credencial para prosseguir."
        });
        return;
      }

      const response = await api.get('/ProcessoDesdobramento/BotaoSeguir', {
        params:{
          token,
          matterId,
          matterUnfoldingId,
          matterNumber,
          enable: flgCourt == "N",
          credentialId
        }
      })

      addToast({type: "success", title: "Operação realizada com exito", description: 'Processo monitorado no sistema'})
      handleCloseFollowModal()
      ListMatterUnfolding(matterId);
      setIsFollow(false)
      setIsChanging(false)
    } catch (err:any) {

      setIsChanging(false)
      setIsFollow(false)
      setFlgCourt("N")

      if (err.response.data.typeError.warning == "awareness") {
        setAwarenessModalMessage(err.response.data.Message)
        setShowAwarenessModal(true)
      }

      if (String(err.response.data.Message).includes("Não há mais crédito") && companyPlan != 'GOJURCM' && String(err.response.data.Message).includes("Não há mais crédito") && companyPlan != 'GOJURFR' && accessCode == 'adm'){
        setMatterMonitorResourceMessage(String(err.response.data.Message).split(".")[0])
        setOpenMatterMonitorResourceModal(true)
      }

      if (String(err.response.data.Message).includes("Não há mais crédito") && companyPlan == 'GOJURFR'){
        setMatterMonitorResourceMessage(String(err.response.data.Message).split(".")[0])
        setOpenMatterMonitorResourceModalFree(true)
      }

      if (String(err.response.data.Message).includes("Não há mais crédito") && companyPlan == 'GOJURCM' || accessCode != 'adm' && String(err.response.data.Message).includes("Não há mais crédito")){
        addToast({
          type: 'info',
          title: 'Operação NÃO realizada',
          description: err.response.data.Message
        });
      }

      if (String(err.response.data.Message).includes("Não há mais crédito") == false && err.response.data.typeError.warning != "awareness") {
        addToast({
          type: 'info',
          title: 'Operação NÃO realizada',
          description: err.response.data.Message
        });
      }     
    }
  };

  const handleOpenFollowModal = async () => {

    if (matterUnfoldingId == "0" || matterUnfoldingId == "") {
      addToast({
        type: 'info',
        title: 'Operação NÃO realizada',
        description: 'Necessário salvar antes de ligar o robô.'
      });

      return;
    }

    setMatterSelectedId(matterId)
    setMatterSelectedNumber(matterNumber)
    setShowFollowModal(true)
  };

  const handleCloseFollowModal = async () => {

    ResetValues()
    setShowFollowModal(false)
    setIsSecretJustice(false)
    setMatterSelectedId(0)
    setMatterSelectedNumber('')
    setSelectedCredentialid(0)
    setIsChanging(false)
  };

  const handleSecretJusticeChange = (event: ChangeEvent<HTMLInputElement>) => {
    setIsSecretJustice(event.target.checked);
  }

  const handleFollowMatter = async () => {
    setIsChanging(true)
    handleFollowButton(flgCourt)
  }

  const handleSelectCredentialId = (id) => {
    setSelectedCredentialid(id)
  }
  
  const handleCloseAwarenessModal = async () => {
    setShowAwarenessModal(false)
    setAwarenessModalMessage('')
  };

  const handleConfirmAwarenessButton = async () => {
    setShowAwarenessModal(false)
    setAwarenessModalMessage('')
    history.push('/Matter/monitoring')
  };

  return(
    <>
    {(showFollowModal) && <OverlayUnfolding />}
    {showFollowModal && <FollowModal callbackFunction={{ handleCloseFollowModal, matterSelectedNumber, handleSecretJusticeChange, isSecretJustice, handleFollowMatter, handleSelectCredentialId, isChanging }} />}
    
      <Modal show>
        <div id='Header' style={{height:'30px'}}>
          <div className='menuTitle'>
            &nbsp;&nbsp;&nbsp;&nbsp;Desdobramento do Processo
          </div>
          <div className='menuSection'>
            <FiX onClick={(e) => CloseUnfoldingModal()} />
          </div>
        </div>
        <br />

        <div id='processo' style={{width:'30%', float:'left', marginLeft:'2%'}}>
          <label htmlFor="email">
            Nº do Processo
            <br />
            {isEdit == true ? (
              <input
                type="search"
                value={matterNumber}
                disabled
              />
            ) : (
              <input
                maxLength={100}
                type="search"
                value={matterNumber}
                name="processo"
                onChange={(e: ChangeEvent<HTMLInputElement>) => setMatterNumber(e.target.value)}
                autoComplete="nope"
              />
            )}
          </label>
        </div>

        <div id='descrição' style={{width:'50%', float:'left', marginLeft:'2%'}}>
          <label htmlFor="email">
            Descrição
            <br />
            <input
              maxLength={100}
              type="search"
              value={description}
              name="descrição"
              onChange={(e: ChangeEvent<HTMLInputElement>) => setDescription(e.target.value)}
              autoComplete="nope"
            />
          </label>
        </div>

        {followPermission && (
          <div id='follow' style={{float:'left', marginLeft:'5%', marginTop:'7px'}} title="Acionando o botão seguir o processo passa a ser acompanhado nos tribunais e alimentado automaticamente.">
            <label htmlFor="email">
              Seguir
              <br />
              <Switch
                onChange={() => {
                  if (flgCourt == "S") {
                    handleFollowButton(flgCourt);                                            
                  } else {
                    handleOpenFollowModal();
                  }
                }}
                checked={flgCourt == "S"}
                onColor="#86d3ff"
                onHandleColor="#2693e6"
                handleDiameter={15}
                uncheckedIcon={false}
                checkedIcon={false}
                height={14}
                width={38}
              />
            </label>
          </div>
        )}
        <br /><br /><br /><br />

        <div id='Buttons' style={{marginRight:'7%', float:'right'}}>
          <div style={{float:'left'}}>
            <button 
              className="buttonClick"
              type='button'
              onClick={()=> Save()}
              style={{width:'100px', height:'38px'}}
            >
              <FiSave />
              Salvar&nbsp;
            </button>
          </div>
                    
          <div style={{float:'left', width:'100px'}}>
            <button 
              type='button'
              className="buttonClick"
              onClick={() => CloseUnfoldingModal()}
              style={{width:'100px', height:'38px'}}
            >
              <FaRegTimesCircle />
              Fechar&nbsp;
            </button>
          </div>
        </div>
        <br /><br /><br />

        <GridUnfolding>
          <Grid
            rows={matterUnfoldingList}
            columns={columns}
          >
            <Table
              cellComponent={CustomCell}
              columnExtensions={tableColumnExtensions}            
              messages={languageGridEmpty}
            />
            <TableHeaderRow />
          </Grid>
        </GridUnfolding>

        <br /><br />
      </Modal>

      {isFollow && (
        <>
          <Overlay />
          <div className='waitingMessage'>   
            <LoaderWaiting size={15} color="var(--blue-twitter)" /> 
            &nbsp;&nbsp;
            Aguarde...
          </div>
        </>
      )}

      {showAwarenessModal && <AwarenessModal callbackFunction={{ awarenessModalTitle, awarenessModalMessage, awarenessButtonOkText, handleCloseAwarenessModal, handleConfirmAwarenessButton }}  />}

      {isDeleteWithCourt && (
        <ConfirmBoxModal
          title="Excluir desdobramento"
          caller="deleteMatterUnfolding"
          useCheckBoxConfirm
          message="O robô de busca de novos andamentos para este processo está ativo, ao apagar você não receberá mais os andamentos referentes a este processo."
        />
      )}

      {openMatterMonitorResourceModal && (
        <ConfirmBoxModal
          caller="confirmOpenMatterMonitorResourceModal"
          title="Plano - Adicionais"
          buttonOkText="Adicionar Recurso"
          message={`${matterMonitorResourceMessage}.  Desabilite a função seguir de um processo ou clique em 'Adicionar Recurso' para contratar o recurso adicinal de monitoramento de processos.`}
        />
      )}

      {openMatterMonitorResourceModalFree && (
        <ConfirmBoxModal
          caller="confirmOpenMatterMonitorResourceModalFree"
          title="Plano - Recursos"
          buttonOkText="Trocar Plano"
          message={`${matterMonitorResourceMessage}.  Desabilite a função seguir de um processo ou clique em 'Trocar Plano' para contratar um plano com mais recursos.`}
        />
      )}

    </>
  );
};

export default UnfoldingModal;