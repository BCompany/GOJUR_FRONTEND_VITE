import React, { useCallback, useEffect, useState } from 'react';
import Modal from 'react-modal';
import { useModal } from 'context/modal';
import { FiSave,FiTrash } from 'react-icons/fi';
import { MdBlock } from 'react-icons/md';
import api from 'services/api';
import { useToast } from 'context/toast';
import { Container } from './styles';
import { ISalesFunnelData } from '../../../../Interfaces/IBusiness';

const SalesFunnelModal = (props) => {

  const { addToast } = useToast();
  const { handleShowSalesFunnelModal, handleJsonModalObjectResult } = useModal();
  const token = localStorage.getItem('@GoJur:token');
  const [description, setDescription] = useState('')
  const [status, setStatus] = useState('')

  const {id} = props

  useEffect(() => {
  
    SelectFunnel()

  },[])

  const SelectFunnel = async() => {

    if (id == 0){
      return false;
    }
    const response = await api.get<ISalesFunnelData>('FunilVendas/Selecionar', { 
      params:{
        token,
        id
      }
    })

    setDescription(response.data.label)
    setStatus(response.data.isDefault)
  }

  const handleCloseModal = () => {
    handleShowSalesFunnelModal(false)
  }

  const handleSave = useCallback(async()  => {

    if (!Validate()){
      return false
    }

    try
    {
      const response = await api.put<ISalesFunnelData>('FunilVendas/Salvar', { 
        token,
        label: description,
        isDefault: status,
        id
      })

      addToast({
        type: "success",
        title: "Operação realizada com sucesso",
        description: `O funil de vendas foi salvo com sucesso`
      })
      
      handleCloseModal()

      const objectResult = {
        id: response.data.id,
        label: response.data.label
      }

      handleJsonModalObjectResult(JSON.stringify(objectResult));
    }
    catch(err){
      addToast({
        type: "info",
        title: "Operação não realizada",
        description: `Houve uma falha na gravação deste registro, verifique se já existe outro funil de vendas definido como principal e tente novamente`
      })
    }

  },[description, status])

  const handleDelete = async() => {

    try
    {
      await api.delete<ISalesFunnelData>('FunilVendas/Deletar', { 
        params:{
          token,
          id
        }
      })

      addToast({
        type: "success",
        title: "Operação realizada com sucesso",
        description: `O funil de vendas foi deletado com sucesso`
      })

      handleJsonModalObjectResult('delete');      
      handleCloseModal()
    }
    catch(err){

      addToast({
        type: "info",
        title: "Operação Não realizada",
        description: `O registro não pode ser excluído pois está sendo utilizado (está associado) em outros cadastros/módulos do sistema.`
      })
    }
  }

  const Validate = () => {
    
    if (description == null || description == ""){
      addToast({
        type: "info",
        title: "Operação não realizada",
        description: `A descrição do funil de vendas não foi informada`
      })

      return false;
    }

    return true;
  }

  return (
    
    <Modal
      isOpen    
      overlayClassName="react-modal-overlay"
      className="react-modal-content"
    >
      <Container>
        
        <div>{(id == 0)?'Inclusão - Funil de Vendas': 'Alteração - Funil de Vendas'}</div>
          
        <label htmlFor="description">
          <p>Descrição</p>
          <input 
            type="text" 
            id="description"
            onKeyPress={(e: React.KeyboardEvent) => {
              if (e.key == 'Enter'){ handleSave() }
            }}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            autoComplete="off"
          />
        </label>

        <br />

        <label htmlFor="description">
          <p>Padrão</p>
          <input 
            type="checkbox" 
            id="status"
            placeholder="status"
            checked={status == 'S'}
            onChange={(e) => setStatus((e.target.checked) ? 'S': 'N')}
            autoComplete="off"
          />
        </label>
      </Container>

      <br />
      
      <div style={{display: 'flex', justifyContent: 'center'}}>
        <button 
          className="buttonClick"
          type='button'
          title="Clique para salvar o funil de vendas"
          onClick={() => handleSave()}
        >
          <FiSave />
          Salvar
        </button>  

        {id != 0 && (
          <button 
            className="buttonClick"
            type='button'
            title="Clique para excluir este funil de vendas"
            onClick={() => handleDelete()}
          >
            <FiTrash />
            Excluir
          </button>  
        )}

        <button 
          className="buttonClick"
          type='button'
          title="Clique para cancelar a edição / inclusão"
          onClick={() => handleCloseModal()}
        >
          <MdBlock />
          Fechar
        </button>  

        
      </div>
    </Modal>
  )

}

export default SalesFunnelModal;
