import React, { useCallback, useEffect, useState } from 'react';
import Modal from 'react-modal';
import { useModal } from 'context/modal';
import { FiX, FiSave } from 'react-icons/fi';
import api from 'services/api';
import { useToast } from 'context/toast';
import Loader from 'react-spinners/PulseLoader';
import { Container } from './styles';
import { ISalesChannelData } from '../../../../Interfaces/IBusiness';

const SalesChannelEdit = (props) => {

  const { addToast } = useToast();
  const { handleShowSalesChannelModal, handleJsonModalObjectResult } = useModal();
  const token = localStorage.getItem('@GoJur:token');
  const [description, setDescription] = useState('')
  const [isSaving, setIsSaving] = useState<boolean>(false);

  const {id} = props

  useEffect(() => {

    SelectChannel()

  },[])

  const SelectChannel = async() => {

    if (id == 0){
      return false;
    }
    const response = await api.get<ISalesChannelData>('CanalDeVendas/Selecionar', {
      params:{
        token,
        id
      }
    })

    setDescription(response.data.label)
  }

  const handleCloseModal = () => {
    handleShowSalesChannelModal(false)
  }

  const Validate = () => {

    if (description == null || description == ""){
      addToast({
        type: "info",
        title: "Operação não realizada",
        description: `A descrição do canal de vendas não foi informada`
      })

      return false;
    }

    return true;
  }

  const handleSave = useCallback(async()  => {

    if (!Validate()){
      return false
    }

    setIsSaving(true)

    try
    {
      const response = await api.put<ISalesChannelData>('CanalDeVendas/Salvar', {
        token,
        label: description,
        id
      })

      addToast({
        type: "success",
        title: "Operação realizada com sucesso",
        description: `O canal de vendas foi salvo com sucesso`
      })

      handleCloseModal()
      setIsSaving(false)

      const objectResult = {
        id: response.data.id,
        label: response.data.label
      }

      handleJsonModalObjectResult(JSON.stringify(objectResult));
    }
    catch(err){
      addToast({
        type: "error",
        title: "Operação não realizada",
        description: `Houve uma falha ao salvar o canal de vendas`
      })
      setIsSaving(false)
      console.log(err)
    }

  },[description])

  return (

    <Modal
      isOpen
      overlayClassName="react-modal-overlay"
      className="react-modal-content"
    >
      <button
        type="button"
        className="react-modal-close"
        onClick={handleCloseModal}
      >
        <FiX size={20} />
      </button>

      <Container>
        <label htmlFor="fantasia">
          <p>Descrição - canal de vendas:</p>
          <input
            type="text"
            id="description"
            required
            onKeyPress={(e: React.KeyboardEvent) => {
              if (e.key == 'Enter'){ handleSave() }
            }}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            autoComplete="off"
          />
        </label>
      </Container>

      <br />

      <div style={{marginLeft: '38%'}}>
        <button
          className="buttonClick"
          type='button'
          title="Clique para salvar o canal de vendas do cliente"
          onClick={() => handleSave()}
        >
          <FiSave />
          Salvar
          {isSaving && <Loader size={5} color="var(--orange)" />}
        </button>

      </div>
    </Modal>
  )

}

export default SalesChannelEdit;
