/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable no-console */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable no-return-assign */
/* eslint-disable no-alert */
import React, { useCallback, useEffect, useState, UIEvent, ChangeEvent, useRef } from 'react';
import { FaRegTimesCircle } from 'react-icons/fa';
import { FcAbout, FcSearch } from 'react-icons/fc';
import { Overlay } from 'Shared/styles/GlobalStyle';
import LoaderWaiting from 'react-spinners/ClipLoader';
import { useToast } from 'context/toast';
import { useModal } from 'context/modal'
import { useDevice } from "react-use-device";
import { FiSave } from 'react-icons/fi';
import api from 'services/api';
import { CategoryModalCustom } from './CategoryModalCustom';
import { ModalCategory, Flags, ModalCategoryMobile } from './styles';

export interface ICategoryData {
    categoryId: string;
    categoryDescription: string;
    flgHonorary: boolean;
    flgInvoiceDefault: boolean;
}

const CategoryEdit = () => {
  const { addToast } = useToast();
  const token = localStorage.getItem('@GoJur:token');
  const { handleModalActive, handleCaller, caller, modalActive, modalActiveId } = useModal();
  const [categoryDescription, setCategoryDescription] = useState<string>("");
  const [isSaving , setisSaving] = useState<boolean>(); // set trigger for show loader
  const [flgHonorary , setFlgHonorary] = useState(false);
  const [flgInvoiceDefault , setFlgInvoiceDefault] = useState(false);
  const { isMOBILE } = useDevice();

  useEffect(() => {

    if (caller === ''){
      return
    }

    if (modalActiveId > 0){
      SelectCategory(modalActiveId)
    }

  },[modalActiveId, caller])


  const SelectCategory = useCallback(async(id: number) => {

    const response = await api.post<ICategoryData>('/Categoria/Editar', {
      id,
      token
    })

    setCategoryDescription(response.data.categoryDescription)
    setFlgHonorary(response.data.flgHonorary)
    setFlgInvoiceDefault(response.data.flgInvoiceDefault)

    // Open modal after load data
    handleModalActive(true)

  },[categoryDescription,flgInvoiceDefault,flgHonorary]);

  const saveCategory = useCallback(async() => {
    try {

      if (categoryDescription == "") {
        addToast({
          type: "info",
          title: "Operação NÃO realizada",
          description: "Favor preencher o campo Nome"
        })
  
        return;
      }
      
      if (isSaving) {
        addToast({
          type: "info",
          title: "Operação NÃO realizada",
          description: `Já existe uma operação em andamento`
        })
  
        return;
      }

      setisSaving(true)
      const token = localStorage.getItem('@GoJur:token');
      
      await api.post('/Categoria/Salvar', {
  
        categoryId: modalActiveId,
        categoryDescription,
        flgHonorary,
        flgInvoiceDefault,
        token
      })
      
      addToast({
        type: "success",
        title: "Categoria salva",
        description: "A categoria foi adicionada no sistema."
      })
      setisSaving(false)

      handleCategoryModalCloseAfterSave()
    } catch (err) {
      setisSaving(false)
      addToast({
        type: "error",
        title: "Falha ao salvar categoria.",
      })
    }
  },[categoryDescription,flgHonorary,flgInvoiceDefault,isSaving]);

  const handleCategoryModalClose = () => { 
    setCategoryDescription("")
    setFlgInvoiceDefault(false)
    setFlgHonorary(false)
    handleCaller("")
    handleModalActive(false)
  }

  const handleCategoryModalCloseAfterSave = () => { 
    setCategoryDescription("")
    setFlgInvoiceDefault(false)
    setFlgHonorary(false)
    handleCaller("categoryModal")
    handleModalActive(false)
  }

  const handleFlgInvoiceDefault = () => { 
    setFlgInvoiceDefault(!flgInvoiceDefault)
  }
    
  return (
    <>

      {!isMOBILE &&(
        <ModalCategory show={modalActive}>

          <div style={{marginLeft:'15px', marginTop:'10px', marginRight:'10px'}}>
            Categoria

            <br />
            <br />

            <label htmlFor="descricao" style={{fontSize:'12px'}}>
              Nome
              <br />
              <input
                required
                maxLength={50}
                type="text"
                style={{backgroundColor: 'white'}}
                name="descricao"
                value={categoryDescription}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setCategoryDescription(e.target.value)}
                autoComplete="off"
              />
            </label>
            <br />
            <br />
            <br />
            <div style={{float:'left', marginLeft: '0px', width: '90px'}}>
              <Flags>
                Honorário 
              </Flags>
            </div>
            
            <div style={{float:'left', marginTop:'3px', width: '10px'}}>
              <input
                type="checkbox"
                name="select"
                checked={flgHonorary}
                onChange={() => setFlgHonorary(!flgHonorary)}
                style={{minWidth:'15px', minHeight:'15px'}}
              />
            </div>
            <br />
            <br />

            <CategoryModalCustom callback={{handleFlgInvoiceDefault, flgInvoiceDefault}} />

            <br />
            <br />
            <br />
            <div style={{float:'right', marginRight:'12px'}}>
              <div style={{float:'left'}}>
                <button 
                  className="buttonClick"
                  type='button'
                  onClick={()=> saveCategory()}
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
                  onClick={() => handleCategoryModalClose()}
                  style={{width:'100px'}}
                >
                  <FaRegTimesCircle />
                  Fechar
                </button>
              </div>
            </div>

          </div>
        </ModalCategory>
      )}

      {isMOBILE &&(
        <ModalCategoryMobile show={modalActive}>

          <div style={{marginLeft:'15px', marginTop:'10px', marginRight:'10px'}}>
            Categoria

            <br />
            <br />

            <label htmlFor="descricao" style={{fontSize:'10px'}}>
              Nome
              <br />
              <input
                required
                maxLength={50}
                type="text"
                style={{backgroundColor: 'white'}}
                name="descricao"
                value={categoryDescription}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setCategoryDescription(e.target.value)}
                autoComplete="off"
              />
            </label>
            <br />
            <br />
            <br />
            <div style={{float:'left', marginLeft: '0px', width: '90px'}}>
              <Flags>
                Honorário 
              </Flags>
            </div>
            
            <div style={{float:'left', marginTop:'3px', width: '10px'}}>
              <input
                type="checkbox"
                name="select"
                checked={flgHonorary}
                onChange={() => setFlgHonorary(!flgHonorary)}
                style={{minWidth:'15px', minHeight:'15px'}}
              />
            </div>
            <br />
            <br />

            <CategoryModalCustom callback={{handleFlgInvoiceDefault, flgInvoiceDefault}} />

            <br />
            <br />
            <br />
            <div style={{float:'right', marginRight:'12px'}}>
              <div style={{float:'left'}}>
                <button 
                  className="buttonClick"
                  type='button'
                  onClick={()=> saveCategory()}
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
                  onClick={() => handleCategoryModalClose()}
                  style={{width:'90px'}}
                >
                  <FaRegTimesCircle />
                  Fechar
                </button>
              </div>
            </div>

          </div>
        </ModalCategoryMobile>
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
export default CategoryEdit;