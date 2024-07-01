import React, { useCallback, useEffect, useState } from 'react';
import Modal from 'react-modal';
import { useModal } from 'context/modal';
import { FiX, FiSave } from 'react-icons/fi';
import api from 'services/api';
import { useToast } from 'context/toast';
import Loader from 'react-spinners/PulseLoader';
import { Container } from './styles';
import { ISalesFunnelDataSteps } from '../../../../Interfaces/IBusiness';

const SalesFunnelEdit = (props) => {

  const { addToast } = useToast();
  const { handleShowSalesFunnelStepModal } = useModal();
  const token = localStorage.getItem('@GoJur:token');
  const [description, setDescription] = useState<string>('')
  const [sequence, setSequence] = useState<number>(0)
  const [sequencePrevious, setSequencePrevious] = useState<number>(0)
  const [sequenceMax, setSequenceMax] = useState<number>(0)
  const [isSaving, setIsSaving] = useState<boolean>(false);

  const {id, salesFunnelId} = props

  useEffect(() => {

    SalesFunnelStep()

  },[])

  const SalesFunnelStep = async() => {

    const response = await api.get<ISalesFunnelDataSteps>('FunilVendasEtapas/Selecionar', {
      params:{
        token,
        salesFunnelId,
        id
      }
    })

    setDescription(response.data.label)
    setSequence(response.data.sequence)
    setSequencePrevious(response.data.sequence)
    setSequenceMax(response.data.sequenceMax)
    if (id == 0){
      setSequence(response.data.sequenceMax + 1)
    }
  }

  const handleCloseModal = () => {
    handleShowSalesFunnelStepModal(false)
  }

  const Validate = () => {

    if (description == null || description == ""){
      addToast({
        type: "info",
        title: "Operação não realizada",
        description: `A descrição da etapa do funil de vendas não foi informada`
      })

      return false;
    }

    if (sequence == 0){
      addToast({
        type: "info",
        title: "Operação não realizada",
        description: `Defina a ordem (sequencia) de etapa do funil de vendas`
      })

      return false;
    }

    if (sequence > (sequenceMax+1)) {
      addToast({
        type: "info",
        title: "Operação não realizada",
        description: ` A próxima ordem de sequencia das etapas não deve ser maior que  ${sequenceMax + 1}`
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
      await api.put<ISalesFunnelDataSteps>('FunilVendasEtapas/Salvar', {
        token,
        label: description,
        sequence,
        sequencePrevious,
        salesFunnelId,
        sequenceMax,
        id
      })

      addToast({
        type: "success",
        title: "Operação realizada com sucesso",
        description: `A etapa do funil de vendas foi salva com sucesso`
      })

      handleCloseModal()
      setIsSaving(false)
    }
    catch(err){
      addToast({
        type: "error",
        title: "Operação não realizada",
        description: `Houve uma falha ao salvar o funil de vendas`
      })
      setIsSaving(false)
      console.log(err)
    }

  },[description, sequence])

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
          <p>Descrição - Funil de vendas:</p>
          <input
            type="text"
            id="description"
            required
            maxLength={50}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            onKeyPress={(e: React.KeyboardEvent) => {
              if (e.key == 'Enter'){ handleSave() }
            }}
          />
        </label>
      </Container>

      <br />

      <div style={{marginLeft: '38%'}}>
        <button
          className="buttonClick"
          type='button'
          title="Clique para salvar a etapa do funil de vendas"
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

export default SalesFunnelEdit;
