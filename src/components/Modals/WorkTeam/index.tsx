/* eslint-disable array-callback-return */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable radix */

import { useModal } from 'context/modal';
import React, { ChangeEvent, useEffect, useState, useRef } from 'react';
import { FiX } from 'react-icons/fi';
import Modal from 'react-modal';
import { FiSave } from 'react-icons/fi';
import { FaRegTimesCircle } from 'react-icons/fa';
import { useToast } from 'context/toast';
import api from 'services/api';
import { useForm } from 'react-hook-form';
import { Container, WorkTeamForm } from './styles';

interface DefaultsProps {
  id: string;
  value: string;
}

interface WorkTeamData {
  id: string;
}

export default function WorkTeamModal() {
  const formRef = useRef<HTMLFormElement>(null);
  const { handleSubmit} = useForm();
  const { handleWorkTeamModal, showWorkTeamModal, referenceId } = useModal();
  const { addToast } = useToast();
  const [nom_Equipe , setNom_Equipe] = useState<string>();
  const [cod_EquipeTrabalho , setCod_EquipeTrabalho] = useState<string>();

    // First initialization
    useEffect(() => {
      GetWorkTeamById(referenceId)
    },[])

  const GetWorkTeamById = async(id) => {
    try {

      if(id > 0)
      {
        const token = localStorage.getItem('@GoJur:token');

        const response = await api.post<DefaultsProps>('/Usuario/EquipeTrabalhoEditar', {
          id:Number(id),
          token,
        })
    
        setNom_Equipe(response.data.value)
        setCod_EquipeTrabalho(response.data.id)
      }
    }
    catch (err:any) {
      console.log(err);
    }
  }

  const saveWorkTeam = async() => {
    try {
      const token = localStorage.getItem('@GoJur:token');
      
      await api.post('/Usuario/EquipeTrabalhoSalvar ', {
  
        id: referenceId,
        name: nom_Equipe,
        token
      })

      handleCloseModal()
      
      addToast({
        type: "success",
        title: "Equipe Salva",
        description: "A equipe foi adicionado/atualizado no sistema."
      })
    }
    catch (err:any) {
      addToast({
        type: "error",
        title: "Falha ao salvar equipe.",
        description:  err.response.data.Message
      })
    }
  };


  const handleCloseModal = async () => {
    handleWorkTeamModal(!showWorkTeamModal)  
  }

  
  return (

    <Modal
      isOpen
      overlayClassName="react-modal-overlay"
      className="react-modal-content"
    >

      <button 
        type="button" 
        className="react-modal-close"
      >
        <FiX onClick={() => handleCloseModal()} />
      </button>

      <Container>  
            
        <WorkTeamForm ref={formRef} onSubmit={handleSubmit(saveWorkTeam)}>
          <div>
            <p>Criação de equipes de trabalho</p>
          </div>
          <br />
          <div>
            <label htmlFor="nome">
              Nome 
              <br />
              <input 
                type="text"
                value={nom_Equipe}
                name="nome"
                onChange={(e: ChangeEvent<HTMLInputElement>) => setNom_Equipe(e.target.value)}
                required
                autoComplete="off"
              />
            </label>
            <br />
            <br />
            <div>

              <div style={{marginLeft:'10px', float:'left', width:'150px'}}>
                <button 
                  type='submit'
                  className="buttonClick"
                >
                  <FiSave />
                  Salvar
                </button>
              </div>
             
              <div style={{marginLeft:'10px', float:'left', width:'150px'}}>
                <button 
                  type='button'
                  className="buttonClick"
                  onClick={() => handleCloseModal()}
                >
                  <FaRegTimesCircle />
                  Cancelar
                </button>
              </div>
            </div>
          </div>

        </WorkTeamForm>
        
      </Container>

    </Modal>

  )

}