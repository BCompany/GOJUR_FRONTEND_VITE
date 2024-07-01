
/* eslint-disable radix *//* eslint-disable array-callback-return */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable radix */
/* eslint-disable no-console */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable no-return-assign */
/* eslint-disable no-alert */


import React, { ChangeEvent, useState, useEffect, useRef, useCallback } from 'react';
import api from 'services/api';
import { AiOutlineArrowLeft } from 'react-icons/ai';
import { ImMenu3, ImMenu4 } from 'react-icons/im';
import { useMenuHamburguer } from 'context/menuHamburguer'
import { BsThreeDotsVertical } from 'react-icons/bs';
import LoaderWaiting from 'react-spinners/ClipLoader';
import { Overlay } from 'Shared/styles/GlobalStyle';
import Menu from '@material-ui/core/Menu';
import { useConfirmBox } from 'context/confirmBox';
import MenuItem from '@material-ui/core/MenuItem';
import MenuHamburguer from 'components/MenuHamburguer';
import ConfirmBoxModal from 'components/ConfirmBoxModal';
import { useToast } from 'context/toast';
import {  BiLoader } from 'react-icons/bi'
import { FcEditImage, FcCancel, FcDeleteDatabase, FcDocument }from 'react-icons/fc';
import {  FaFileAlt } from 'react-icons/fa';
import { useModal } from 'context/modal';
import TreeView from 'deni-react-treeview'
import { useHistory } from 'react-router-dom';
import { HeaderPage } from 'components/HeaderPage';
import CostCenterModal from './Modal';
import { Container, Content, Form, TollBar, TreeViewContainerSimple } from './styles';

const CostCenterList: React.FC = () => {
  const { addToast } = useToast();
  const history = useHistory();
  const token = localStorage.getItem('@GoJur:token');
  const {isMenuOpen,  handleIsMenuOpen, } = useMenuHamburguer();
  const { handleCaller, handleModalActive, handleModalActiveId, caller, modalActive, modalActiveId } = useModal();
  const {isConfirmMessage, isCancelMessage, handleCancelMessage, handleConfirmMessage, handleCheckConfirm } = useConfirmBox();
  
  const [showModal, setShowModal] = useState(false);
  const treeViewRef = useRef<TreeView>(null);
  const [treeView , setTreeView] = useState([]);

  const [anchorEl, setAnchorEl] = React.useState(null);
  const [costCenterId, setCostCenterId] = useState<number>(0)
  const [postBackValidation, setPostBackValidation] = useState<boolean>(false)
  const [confirmDeleteWarning, setConfirmDeleteWarning] = useState<boolean>(false)

  const [confirmDelete, setConfirmDelete] = useState<string>("")
  const [isLoading, setIsLoading]= useState<boolean>(true);
  const [isDeleting, setIsDeleting] = useState<boolean>(false)
  const [isLoadingComboData, setIsLoadingComboData] = useState<boolean>(false);


  useEffect(() => {
    LoadTreeView();
    setIsLoading(true);
  }, []); 

  useEffect(() => {
    if (!modalActive && caller == 'costCenterValueModal'){
        LoadTreeView()
    }
  }, [modalActive])

  useEffect(() => {
    if (caller == 'costCenterValueModal' && modalActive){
      setShowModal(true)      
    }
  },[caller, modalActive])

  useEffect(() => {
    if (caller == 'costCenterMenu' && modalActive){
      setShowModal(true)      
    }
  },[caller, modalActive])

  useEffect(() => {
    if (!modalActive && caller == 'costCenterMenu'){
        LoadTreeView()
    }
  }, [modalActive])


  useEffect(() => {

    if (isCancelMessage){
  
      if (confirmDelete === 'confirmDeleteWarning')
      {
        setConfirmDeleteWarning(false)
        setPostBackValidation(false)
        handleCancelMessage(false)
        setConfirmDelete("")
        handleCloseMenuCard()
      }
    }
  
  },[isCancelMessage, confirmDelete]);
  
  
  useEffect(() => {
  
    if(isConfirmMessage)
    {
      if (confirmDelete === 'confirmDeleteWarning')
      {
        setPostBackValidation(true)
    
      }
    }
  },[isConfirmMessage, confirmDelete]);
 
  
  useEffect(() => {
  
    if(postBackValidation)
    {
        setConfirmDeleteWarning(false)
        deleteCostCenter()
        setConfirmDelete("")
  
      handleConfirmMessage(false)
    }
  },[postBackValidation]);


  const LoadTreeView = async () => {
    try {
      const response = await api.get('/CentroDeCusto/TreeViewList', {
        params:{
        token,
        }
      });
      
      setTreeView(response.data)
      setIsLoading(false)
      
    } catch (err) {
      setIsLoading(false)
      console.log(err);
    }
  }


  // DELETE
  const deleteCostCenter = async() => {

    const id = costCenterId;
   
    try {
      const token = localStorage.getItem('@GoJur:token');

      setIsDeleting(true)
      await api.delete('/CentroDeCusto/Deletar', {
        params:{
        id,
        postBackValidation,
        token
        }
      })
      
      addToast({
        type: "success",
        title: "Centro de custo excluído",
        description: "O centro de custo foi excluído no sistema."
      })

      LoadTreeView()
      handleCloseMenuCard()
      setPostBackValidation(false)
      setIsDeleting(false)

    } catch (err: any) {
      setIsDeleting(false)

      const teste = err.response.data.Message;

      if(teste.includes("CostCenterRemoveParent")){
        setConfirmDeleteWarning(true)
        setAnchorEl(null)
        setConfirmDelete("confirmDeleteWarning")
      }

      else{
        addToast({
          type: "error",
          title: "Falha ao excluir centro de custo.",
          description:  err.response.data.Message
        })
      }
    }
  };


  // OPEN MODAL WITH NO ID
  const handleOpenModal = () => {    
    handleModalActiveId(0)
    handleCaller('costCenterValueModal')
    handleModalActive(true)

  }

  // OPEN MODAL WITH ID
  const handleOpenModalMenu = async() => {  
    handleCaller('costCenterMenu') 
    handleModalActive(true) 
    handleModalActiveId(costCenterId)
    handleCloseMenuCard()

  }

    // EDIT
  const handleEdit = async() => {
    handleCaller('costCenterValueModal')
    handleModalActive(true)
    handleModalActiveId(costCenterId)
    handleCloseMenuCard()
     
  };


  const handleClickMenuCard = (event, eventId: number) => {
    setAnchorEl(event.currentTarget);
    setCostCenterId(eventId)
  };


  const handleCloseMenuCard = () => {
    setAnchorEl(null)
    setCostCenterId(0)
  };


  const onRenderItem = (item, treeview) => {
    return (
      <div className="treeview-items">
        <span className="treeview-item-text">{item.text}</span>
        <BsThreeDotsVertical
          style={{marginTop:"3px"}}
          className="headerCard" 
          title='Clique para visualizar opções' 
          onClick={(e) => handleClickMenuCard(e, item.id)}
        />
      </div>
    )
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


  return (

    <Container onContextMenu={(e) => e.preventDefault()}>

      {confirmDeleteWarning && (
        <ConfirmBoxModal
          title="Financeiro"
          caller="confirmDeleteWarning"
          message="Ao realizar a exclusão de um centro de custo principal todos os seus sub registros (se houver) também serão excluidos, deseja continuar ?"
          useCheckBoxConfirm
        />
      )}

      <HeaderPage />

      {showModal &&  <CostCenterModal /> }

      <TollBar>

        <div className="buttonReturn">
          <button
            className="buttonLinkClick"
            title="Clique para retornar ao financeiro"
            onClick={() => history.push('/financeiro')}
            type="submit"
          >
            <AiOutlineArrowLeft />
            Retornar
          </button>
        </div>

      </TollBar>
    
      <Content>
        <header style={{fontSize:"15px"}}>Centro de Custo</header>

        <div style={{marginLeft:"1.5%"}}>
          <button
            className="buttonLinkClick buttonInclude"
            title="Clique para incluir um novo centro de custo"
            type="submit"
            onClick={handleOpenModal}
          >
            <FaFileAlt />
            <span> Incluir novo centro de custo</span>
          </button>
        </div>
       
        <Form> 

          <Menu
            anchorEl={anchorEl}
            keepMounted
            className="headerCard"
            open={Boolean(anchorEl)}
            onClose={handleCloseMenuCard}
          >
            <MenuItem 
              style={{fontSize:'0.75rem', color: 'var(--blue-twitter'}} 
              onClick={() => handleEdit()}
            >
              <FcEditImage />
              &nbsp;&nbsp;Editar
            </MenuItem>

            <MenuItem 
              style={{fontSize:'0.75rem', color: 'var(--blue-twitter'}}
              onClick={() => handleOpenModalMenu()}
            >
              <FcDocument />
              &nbsp;&nbsp;Adicionar
            </MenuItem>

            <MenuItem 
              style={{fontSize:'0.75rem', color: 'var(--blue-twitter'}} 
              onClick={() => deleteCostCenter()}
            >
              {!isDeleting && (
                <> 
                  {' '}
                  <FcDeleteDatabase />
                  {'  '}
                  &nbsp;&nbsp;Excluir
                  {' '}
                </>
              )}
              {isDeleting && (
                <> 
                    {' '}
                  <BiLoader />
                    {'  '}
                    &nbsp;&nbsp;Deletando
                    {' '}
                </>
              )}
            </MenuItem>

            <MenuItem 
              style={{fontSize:'0.75rem', color: 'var(--blue-twitter'}} 
              onClick={handleCloseMenuCard}
            >
              <FcCancel />
              &nbsp;&nbsp;Fechar
            </MenuItem>
          

          </Menu>
          
          
          <div style={{display:"inline-block", width:"99%"}}>
            <TreeViewContainerSimple>

              <TreeView 
                ref={treeViewRef} 
                items={treeView}
                onRenderItem={onRenderItem}
                selectRow
                marginItems={45}
              />
            </TreeViewContainerSimple>

          </div>
                                                                                                              


          <br />
    
        </Form>

      </Content>        
          
    </Container>
  );
};

export default CostCenterList;
