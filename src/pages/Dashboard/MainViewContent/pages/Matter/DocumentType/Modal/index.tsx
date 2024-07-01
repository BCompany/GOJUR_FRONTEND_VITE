import React, { useCallback, useEffect, useState, ChangeEvent } from 'react';
import { FaRegTimesCircle } from 'react-icons/fa';
import api from 'services/api';
import { Overlay } from 'Shared/styles/GlobalStyle';
import LoaderWaiting from 'react-spinners/ClipLoader';
import { useModal } from 'context/modal';
import { useDevice } from "react-use-device";
import { FiSave } from 'react-icons/fi';
import { useToast } from 'context/toast';
import { ModalDocumentType, ModalDocumentTypeMobile } from './styles';

export interface IDocumentTypeData {
  documentTypeId: string;
  documentTypeDescription: string;
}

const DocumentTypeEdit = () => {
  const { addToast } = useToast();
  const [isSaving , setisSaving] = useState<boolean>(); // set trigger for show loader
  const token = localStorage.getItem('@GoJur:token');
  const { handleModalActive, handleModalActiveId, handleCaller, caller, modalActive, modalActiveId } = useModal();
  const [documentTypeDescription, setDocumentTypeDescription] = useState<string>("");
  const { isMOBILE } = useDevice();

  useEffect(() => {

    if (caller === ''){
      return
    }

    if (modalActiveId > 0){
      SelectDocumentType(modalActiveId)
    }

  },[modalActiveId, caller])

  const SelectDocumentType = useCallback(async(id: number) => {

    const response = await api.post<IDocumentTypeData>('/TipoDocumento/Editar', {
      id,
      token
    })

    setDocumentTypeDescription(response.data.documentTypeDescription)


    // Open modal after load data
    handleModalActive(true)

  },[documentTypeDescription]);

  const saveDocumentType = useCallback(async() => {
    try {

      if (isSaving) {
        addToast({
          type: "info",
          title: "Operação NÃO realizada",
          description: `Já existe uma operação em andamento`
        })
  
        return;
      }

      if (documentTypeDescription == "") {
        addToast({
          type: "info",
          title: "Operação NÃO realizada",
          description: `Preencha o campo descrição antes de salvar.`
        })
  
        return;
      }
      
      const token = localStorage.getItem('@GoJur:token');
      
      setisSaving(true)
      await api.post('/TipoDocumento/Salvar', {
  
        documentTypeId: modalActiveId,
        documentTypeDescription,
        token
      })
      
      addToast({
        type: "success",
        title: "Tipo de documento salvo",
        description: "O tipo de documento foi adicionado no sistema."
      })

      handleDocumentTypeModalCloseAfterSave()
      setisSaving(false)

    } catch (err) {
      setisSaving(false)

      addToast({
        type: "error",
        title: "Falha ao salvar tipo de documento.",
      })
    }
  },[isSaving,documentTypeDescription]);

  const handleDocumentTypeModalClose = () => { 
    setDocumentTypeDescription("")
    handleModalActiveId(0)
    handleCaller("")
    handleModalActive(false)
  }

  const handleDocumentTypeModalCloseAfterSave = () => { 
    setDocumentTypeDescription("")
    handleModalActiveId(0)
    handleCaller("documentTypeModal")
    handleModalActive(false)
  }
  
  return (
    <>
      {!isMOBILE &&(
        <ModalDocumentType show={modalActive}>
        
          <div style={{marginLeft:'15px', marginTop:'10px', marginRight:'10px'}}>
            Tipo de Documento
        
            <br />
            <br />
        
            <label htmlFor="descricao" style={{fontSize:'12px'}}>
              Descrição
              <br />
              <input
                maxLength={50}
                type="text"
                style={{backgroundColor: 'white'}}
                name="descricao"
                value={documentTypeDescription}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setDocumentTypeDescription(e.target.value)}
                autoComplete="off"
              />
            </label>
            <br />
            <br />
            <br />
            <div style={{float:'right', marginRight:'12px'}}>
              <div style={{float:'left'}}>
                <button 
                  className="buttonClick"
                  type='button'
                  onClick={()=> saveDocumentType()}
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
                  onClick={() => handleDocumentTypeModalClose()}
                  style={{width:'100px'}}
                >
                  <FaRegTimesCircle />
                  Fechar
                </button>
              </div>
            </div>
        
          </div>
        </ModalDocumentType>
      )}

      {isMOBILE &&(
        <ModalDocumentTypeMobile show={modalActive}>
        
          <div style={{marginLeft:'15px', marginTop:'10px', marginRight:'10px'}}>
            Tipo de Documento
        
            <br />
            <br />
        
            <label htmlFor="descricao" style={{fontSize:'10px'}}>
              Descrição
              <br />
              <input
                maxLength={50}
                type="text"
                style={{backgroundColor: 'white'}}
                name="descricao"
                value={documentTypeDescription}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setDocumentTypeDescription(e.target.value)}
                autoComplete="off"
              />
            </label>
            <br />
            <br />
            <br />
            <div style={{float:'right', marginRight:'-5px'}}>
              <div style={{float:'left'}}>
                <button 
                  className="buttonClick"
                  type='button'
                  onClick={()=> saveDocumentType()}
                  style={{width:'90px'}}
                >
                  <FiSave />
                  Salvar 
                </button>
              </div>
                            
              <div style={{float:'left', width:'100px'}}>
                <button 
                  type='button'
                  className="buttonClick"
                  onClick={() => handleDocumentTypeModalClose()}
                  style={{width:'90px'}}
                >
                  <FaRegTimesCircle />
                  Fechar
                </button>
              </div>
            </div>
        
          </div>
        </ModalDocumentTypeMobile>
      )}

      {isSaving && (
        <>
          <Overlay />
          <div className='waitingMessage'>   
            <LoaderWaiting size={15} color="var(--blue-twitter)" /> 
            &nbsp;&nbsp;
            Salvando ...
          </div>
        </>
  )}  
    </>
  )
    
}
export default DocumentTypeEdit;