import React, { useCallback, useEffect, useState, ChangeEvent } from 'react';
import Modal from 'react-modal';
import { useModal } from 'context/modal';
import LoaderWaiting from 'react-spinners/ClipLoader';
import {FiSave } from 'react-icons/fi';
import api from 'services/api';
import { LawyerData } from 'context/Interfaces/PeoplesModal';
import { useToast } from 'context/toast';
import { Overlay } from 'Shared/styles/GlobalStyle';
import { useDevice } from "react-use-device";
import { FaRegTimesCircle } from 'react-icons/fa';
import { ModalLawyer, ModalLawyerMobile, Flags } from './styles';


const LawyerEdit = (props) => {

  const { handleUpdateNewLawyer } = props.callbackFunction

  const { addToast } = useToast();
  const { handleShowLawyerModal } = useModal();
  const token = localStorage.getItem('@GoJur:token');
  const [value, setLawyerDescription] = useState<string>("");
  const [isSaving , setisSaving] = useState<boolean>(); // set trigger for show loader
  const [oab, setOAB] = useState<string>("");
  const [flgOffice , setFlgOffice] = useState(false);
  const { isMOBILE } = useDevice();


  const handleSave = useCallback(async()  => {

    try
    {
      if (isSaving) {
        addToast({
          type: "info",
          title: "Operação NÃO realizada",
          description: `Já existe uma operação em andamento`
        })
  
        return;
      }

      if (value === '') {
        addToast({
          type: "info",
          title: "Operação NÃO realizada",
          description: `O campo nome deve ser preenchido`
        })
  
        return;
      }

      setisSaving(true)

      const response = await api.post<LawyerData>('/Advogados/SalvarAdvogado', { 
        cod_Advogado: 0,
        nom_Pessoa: value,
        num_OAB: oab,
        flg_Escritorio: flgOffice,
        token  
      })

      addToast({
        type: "success",
        title: "Operação realizada com sucesso",
        description: `O advogado foi salvo com sucesso`
      })

      handleUpdateNewLawyer(response.data)
      handleLawyerModalClose();

    }
    catch(err){
      setisSaving(false)
      addToast({
        type: "error",
        title: "Operação não realizada",
        description: `Houve uma falha ao salvar o advogado`
      })
      console.log(err)
    }

  },[isSaving,value, oab, flgOffice])

  const handleLawyerModalClose = () => { 
    setLawyerDescription("")
    handleShowLawyerModal(false)

  }

  return (
    <>
      
      <div>
        {!isMOBILE &&(
        <Modal
          isOpen   
          overlayClassName="react-modal-overlay"
          className="react-modal-peoplesModal"
        
        >
          <ModalLawyer>

            <div style={{marginLeft:'15px', marginTop:'10px', marginRight:'10px'}}>
              Advogado

              <br />
              <br />

              <label htmlFor="descricao" style={{fontSize:'12px'}}>
                Nome
                <br />
                <input
                  maxLength={50} 
                  type="text"
                  style={{backgroundColor: 'white'}}
                  name="descricao"
                  value={value}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setLawyerDescription(e.target.value)}
                  autoComplete="off"
                  required
                />
              </label>
              <br />
              <br />

              <label htmlFor="descricao" style={{fontSize:'12px'}}>
                OAB
                <br />
                <input
                  maxLength={50} 
                  type="text"
                  style={{backgroundColor: 'white'}}
                  name="descricao"
                  value={oab}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setOAB(e.target.value)}
                  autoComplete="off"
                />
              </label>

              <br />
              <br />

              <div style={{float:'left', marginLeft: '0px', width: '70px'}}>
                <Flags>
                  Escritório 
                </Flags>
              </div>
              
              <div style={{float:'left', marginTop:'3px', width: '55px'}}>
                <input
                  type="checkbox"
                  name="select"
                  checked={flgOffice}
                  onChange={() => setFlgOffice(!flgOffice)}
                  style={{minWidth:'15px', minHeight:'15px'}}
                />
              </div>

              <br />
              <br />
              <br />
              <div style={{float:'right', marginRight:'12px'}}>
                <div style={{float:'left'}}>
                  <button 
                    className="buttonClick"
                    type='button'
                    onClick={()=> handleSave()}
                    style={{width:'100px'}}
                  >
                    <FiSave />
                    Salvar 
                  </button>
                </div>
                          
                <div style={{float:'left', width:'100px'}}>
                  <button 
                    type='button'
                    className="buttonClick"
                    onClick={() => handleLawyerModalClose()}
                    style={{width:'100px'}}
                  >
                    <FaRegTimesCircle />
                    Fechar
                  </button>
                </div>
              </div>

            </div>
          </ModalLawyer>
        </Modal>
        
        )}
      </div>

      {isMOBILE &&(
        <Modal
          isOpen   
          overlayClassName="react-modal-overlay"
          className="react-modal-peoplesModalMobile"
        
        >
          <ModalLawyerMobile>

            <div style={{marginLeft:'15px', marginTop:'10px', marginRight:'10px'}}>
              Advogado

              <br />
              <br />

              <label htmlFor="descricao" style={{fontSize:'12px'}}>
                Nome
                <br />
                <input
                  maxLength={50} 
                  type="text"
                  style={{backgroundColor: 'white'}}
                  name="descricao"
                  value={value}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setLawyerDescription(e.target.value)}
                  autoComplete="off"
                  required
                />
              </label>
              <br />
              <br />

              <label htmlFor="descricao" style={{fontSize:'12px'}}>
                OAB
                <br />
                <input
                  maxLength={50} 
                  type="text"
                  style={{backgroundColor: 'white'}}
                  name="descricao"
                  value={oab}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setOAB(e.target.value)}
                  autoComplete="off"
                />
              </label>

              <br />
              <br />

              <div style={{float:'left', marginLeft: '0px', width: '70px'}}>
                <Flags style={{fontSize:'12px'}}>
                  Escritório 
                </Flags>
              </div>
              
              <div style={{float:'left', marginTop:'3px', width: '55px'}}>
                <input
                  type="checkbox"
                  name="select"
                  checked={flgOffice}
                  onChange={() => setFlgOffice(!flgOffice)}
                  style={{minWidth:'15px', minHeight:'15px'}}
                />
              </div>

              <br />
              <br />
              <br />
              <div style={{float:'right', marginRight:'5px'}}>
                <div style={{float:'left'}}>
                  <button 
                    className="buttonClick"
                    type='button'
                    onClick={()=> handleSave()}
                    style={{width:'100px'}}
                  >
                    <FiSave />
                    Salvar 
                  </button>
                </div>
                          
                <div style={{float:'left', width:'100px'}}>
                  <button 
                    type='button'
                    className="buttonClick"
                    onClick={() => handleLawyerModalClose()}
                    style={{width:'100px'}}
                  >
                    <FaRegTimesCircle />
                    Fechar
                  </button>
                </div>
              </div>

            </div>
          </ModalLawyerMobile>
        </Modal>
      )}
      {isSaving && (
        <>
          <Overlay />
          <div className='waitingMessage'>   
            <LoaderWaiting size={15} color="var(--blue-twitter)" /> 
            &nbsp;&nbsp;
            Salvando cliente ...
          </div>
        </>
      )}
    </>
  )

}

export default LawyerEdit;
