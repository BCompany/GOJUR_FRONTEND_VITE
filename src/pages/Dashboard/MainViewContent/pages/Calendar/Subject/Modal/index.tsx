import React, { useCallback, useEffect, useState, ChangeEvent } from 'react';
import { FaRegTimesCircle } from 'react-icons/fa';
import { FiSave } from 'react-icons/fi';
import api from 'services/api';
import { Overlay } from 'Shared/styles/GlobalStyle';
import LoaderWaiting from 'react-spinners/ClipLoader';
import { useToast } from 'context/toast';
import { useModal } from 'context/modal';
import { useDevice } from "react-use-device";
import { ModalSubject, ModalSubjectMobile } from './styles';

export interface ISubjectData {
    subjectId: string;
    subjectDescription: string;
    labelColor:string;
    subjectType:string;
  }

const SubjectEdit = () => {

  const { addToast } = useToast();
  const [isSaving , setisSaving] = useState<boolean>(); // set trigger for show loader
  const token = localStorage.getItem('@GoJur:token');
  const { handleModalActive, handleCaller, caller, modalActive, modalActiveId } = useModal();
  const [subjectDescription, setSubjectDescription] = useState<string>("");
  const [subjectType, setSubjectType] = useState<string>('A');
  const [principalColor, setPrincipalColor] = useState<string>('#51B749');
  const { isMOBILE } = useDevice();
    
  useEffect(() => {

    if (caller === ''){
      return
    }

    if (modalActiveId > 0){
      SelectSubject(modalActiveId)
    }


  },[modalActiveId, caller])

  const SelectSubject = useCallback(async(id: number) => {

    const response = await api.post<ISubjectData>('/Assunto/Editar', {
      id,
      token
    })

    setSubjectDescription(response.data.subjectDescription)
    setSubjectType(response.data.subjectType)
    setPrincipalColor(response.data.labelColor)

    // Open modal after load data
    handleModalActive(true)

  },[subjectDescription, subjectType, principalColor]);

  const saveSubject = useCallback(async() => {
    try {

      if (isSaving) {
        addToast({
          type: "info",
          title: "Operação NÃO realizada",
          description: `Já existe uma operação em andamento`
        })
  
        return;
      }

      if (subjectDescription == "") {
        addToast({
          type: "info",
          title: "Operação NÃO realizada",
          description: `Preencha o campo descrição antes de salvar.`
        })
  
        return;
      }
      
      const token = localStorage.getItem('@GoJur:token');
      
      setisSaving(true)
      await api.post('/Assunto/Salvar', {
  
        subjectId: modalActiveId,
        subjectDescription,
        subjectType,
        labelColor: principalColor,
        token
      })
      
      addToast({
        type: "success",
        title: "Assunto salvo",
        description: "O assunto foi adicionado no sistema."
      })

      handleSubjectModalCloseAfterSave()
      setisSaving(false)

    } catch (err) {
      setisSaving(false)

      addToast({
        type: "error",
        title: "Falha ao salvar assunto.",
      })
    }
  },[isSaving,subjectDescription, subjectType, principalColor]);

  const handleSubjectModalClose = () => { 
    setSubjectType("A")
    setPrincipalColor("#51B749")
    setSubjectDescription("")
    handleCaller("")
    handleModalActive(false)
  }

  const handleSubjectModalCloseAfterSave = () => { 
    setSubjectType("A")
    setPrincipalColor("#51B749")
    setSubjectDescription("")
    handleCaller("subjectModal")
    handleModalActive(false)
  }

  const handleChangePrincipalColor = (color) => { 
    setPrincipalColor(color)
  }
  
  return (
    <>
      {!isMOBILE &&(
        <ModalSubject show={modalActive}>

          <div style={{marginLeft:'15px', marginTop:'10px', marginRight:'10px'}}>
            Assunto

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
                value={subjectDescription}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setSubjectDescription(e.target.value)}
                autoComplete="off"
              />
            </label>

            <br />
            <br />

            <label htmlFor="type">
              Tipo
              <br />
              <select 
                name="userType"
                value={subjectType}
                onChange={(e: ChangeEvent<HTMLSelectElement>) => setSubjectType(e.target.value)}
              >
                <option value="A">Audiência</option>
                <option value="P">Prazo</option>
                <option value="O">Outros</option>
              </select>
            </label>

            <br />
            <br />

            {/* Color Bottons */}
            <div style={{marginTop:'6px'}}>

              <div style={{height:'56px', width:'50px', border:'solid 1px', backgroundColor:`${principalColor}`, float:'left'}}>
                &nbsp;
              </div>

              &nbsp;&nbsp;&nbsp;&nbsp;

              <button 
                type='button'
                className="ModalSubjectColorButton"
                style={{backgroundColor:'#51B749'}}
                onClick={()=> handleChangePrincipalColor('#51B749')}
              >
                &nbsp;
              </button>

              &nbsp;&nbsp;

              <button 
                type='button'
                className="ModalSubjectColorButton"
                style={{backgroundColor:'#5484ED'}}
                onClick={()=> handleChangePrincipalColor('#5484ED')}
              >
                &nbsp;
              </button>

              &nbsp;&nbsp;

              <button 
                type='button'
                className="ModalSubjectColorButton"
                style={{backgroundColor:'#9900FF'}}
                onClick={()=> handleChangePrincipalColor('#9900FF')}
              >
                &nbsp;
              </button>

              &nbsp;&nbsp;

              <button 
                type='button'
                className="ModalSubjectColorButton"
                style={{backgroundColor:'#46D6DB'}}
                onClick={()=> handleChangePrincipalColor('#46D6DB')}
              >
                &nbsp;
              </button>

              &nbsp;&nbsp;

              <button 
                type='button'
                className="ModalSubjectColorButton"
                style={{backgroundColor:'#606060'}}
                onClick={()=> handleChangePrincipalColor('#606060')}
              >
                &nbsp;
              </button>

              &nbsp;&nbsp;

              <button 
                type='button'
                className="ModalSubjectColorButton"
                style={{backgroundColor:'#B382B3'}}
                onClick={()=> handleChangePrincipalColor('#B382B3')}
              >
                &nbsp;
              </button>

              &nbsp;&nbsp;

              <button 
                type='button'
                className="ModalSubjectColorButton"
                style={{backgroundColor:'#FF153F'}}
                onClick={()=> handleChangePrincipalColor('#FF153F')}
              >
                &nbsp;
              </button>

              &nbsp;&nbsp;

              <button 
                type='button'
                className="ModalSubjectColorButton"
                style={{backgroundColor:'#FF614F'}}
                onClick={()=> handleChangePrincipalColor('#FF614F')}
              >
                &nbsp;
              </button>

              &nbsp;&nbsp;

              <button 
                type='button'
                className="ModalSubjectColorButton"
                style={{backgroundColor:'#FF8000'}}
                onClick={()=> handleChangePrincipalColor('#FF8000')}
              >
                &nbsp;
              </button>

              <br />
              <div style={{height:'6px'}}>
                <></>
              </div>
              &nbsp;&nbsp;&nbsp;&nbsp;
            
              <button 
                type='button'
                className="ModalSubjectColorButton"
                style={{backgroundColor:'#9A0000'}}
                onClick={()=> handleChangePrincipalColor('#9A0000')}
              >
                &nbsp;
              </button>

              &nbsp;&nbsp;

              <button 
                type='button'
                className="ModalSubjectColorButton"
                style={{backgroundColor:'#67FE33'}}
                onClick={()=> handleChangePrincipalColor('#67FE33')}
              >
                &nbsp;
              </button>

              &nbsp;&nbsp;

              <button 
                type='button'
                className="ModalSubjectColorButton"
                style={{backgroundColor:'#FF00CD'}}
                onClick={()=> handleChangePrincipalColor('#FF00CD')}
              >
                &nbsp;
              </button>

              &nbsp;&nbsp;

              <button 
                type='button'
                className="ModalSubjectColorButton"
                style={{backgroundColor:'#673301'}}
                onClick={()=> handleChangePrincipalColor('#673301')}
              >
                &nbsp;
              </button>

              &nbsp;&nbsp;

              <button 
                type='button'
                className="ModalSubjectColorButton"
                style={{backgroundColor:'#9A6601'}}
                onClick={()=> handleChangePrincipalColor('#9A6601')}
              >
                &nbsp;
              </button>

              &nbsp;&nbsp;

              <button 
                type='button'
                className="ModalSubjectColorButton"
                style={{backgroundColor:'#D7AC00'}}
                onClick={()=> handleChangePrincipalColor('#D7AC00')}
              >
                &nbsp;
              </button>

              &nbsp;&nbsp;

              <button 
                type='button'
                className="ModalSubjectColorButton"
                style={{backgroundColor:'#0033CC'}}
                onClick={()=> handleChangePrincipalColor('#0033CC')}
              >
                &nbsp;
              </button>

              &nbsp;&nbsp;

              <button 
                type='button'
                className="ModalSubjectColorButton"
                style={{backgroundColor:'#356768'}}
                onClick={()=> handleChangePrincipalColor('#356768')}
              >
                &nbsp;
              </button>

              &nbsp;&nbsp;

              <button 
                type='button'
                className="ModalSubjectColorButton"
                style={{backgroundColor:'#CCCCCC'}}
                onClick={()=> handleChangePrincipalColor('#CCCCCC')}
              >
                &nbsp;
              </button>
            
            </div>
            
            <br />
            
            <div>
              <div style={{float:'left', marginTop:'14px'}}>
                Personalizar cor: &nbsp;
              </div>
              <input
                type="color"
                color='#51B749'
                style={{height:'45px', width:'40px'}}
                onChange={e => handleChangePrincipalColor(e.target.value)}
              />
            </div>

            <br />
            <br />

            <div style={{float:'right', marginRight:'12px'}}>
              <div style={{float:'left'}}>
                <button 
                  className="buttonClick"
                  type='button'
                  onClick={()=> saveSubject()}
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
                  onClick={() => handleSubjectModalClose()}
                  style={{width:'100px'}}
                >
                  <FaRegTimesCircle />
                  Fechar
                </button>
              </div>
            </div>

          </div>
        </ModalSubject>
      )}

      {isMOBILE &&(
        <ModalSubjectMobile show={modalActive}>

          <div style={{marginLeft:'15px', marginTop:'10px', marginRight:'10px'}}>
            Assunto

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
                value={subjectDescription}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setSubjectDescription(e.target.value)}
                autoComplete="off"
              />
            </label>

            <br />
            <br />

            <label htmlFor="type" style={{fontSize:'10px'}}>
              Tipo
              <br />
              <select 
                name="userType"
                value={subjectType}
                onChange={(e: ChangeEvent<HTMLSelectElement>) => setSubjectType(e.target.value)}
              >
                <option value="A">Audiência</option>
                <option value="P">Prazo</option>
                <option value="O">Outros</option>
              </select>
            </label>

            <br />
            <br />

            {/* Color Bottons */}
            <div style={{marginTop:'6px'}}>

              <div style={{height:'47px', width:'30px', border:'solid 1px', backgroundColor:`${principalColor}`, float:'left'}}>
                &nbsp;
              </div>

              &nbsp;&nbsp;&nbsp;

              <button 
                type='button'
                className="ModalSubjectColorButton"
                style={{backgroundColor:'#51B749'}}
                onClick={()=> handleChangePrincipalColor('#51B749')}
              >
                &nbsp;
              </button>

              &nbsp;&nbsp;

              <button 
                type='button'
                className="ModalSubjectColorButton"
                style={{backgroundColor:'#5484ED'}}
                onClick={()=> handleChangePrincipalColor('#5484ED')}
              >
                &nbsp;
              </button>

              &nbsp;&nbsp;

              <button 
                type='button'
                className="ModalSubjectColorButton"
                style={{backgroundColor:'#9900FF'}}
                onClick={()=> handleChangePrincipalColor('#9900FF')}
              >
                &nbsp;
              </button>

              &nbsp;&nbsp;

              <button 
                type='button'
                className="ModalSubjectColorButton"
                style={{backgroundColor:'#46D6DB'}}
                onClick={()=> handleChangePrincipalColor('#46D6DB')}
              >
                &nbsp;
              </button>

              &nbsp;&nbsp;

              <button 
                type='button'
                className="ModalSubjectColorButton"
                style={{backgroundColor:'#606060'}}
                onClick={()=> handleChangePrincipalColor('#606060')}
              >
                &nbsp;
              </button>

              &nbsp;&nbsp;

              <button 
                type='button'
                className="ModalSubjectColorButton"
                style={{backgroundColor:'#B382B3'}}
                onClick={()=> handleChangePrincipalColor('#B382B3')}
              >
                &nbsp;
              </button>

              &nbsp;&nbsp;

              <button 
                type='button'
                className="ModalSubjectColorButton"
                style={{backgroundColor:'#FF153F'}}
                onClick={()=> handleChangePrincipalColor('#FF153F')}
              >
                &nbsp;
              </button>

              &nbsp;&nbsp;

              <button 
                type='button'
                className="ModalSubjectColorButton"
                style={{backgroundColor:'#FF614F'}}
                onClick={()=> handleChangePrincipalColor('#FF614F')}
              >
                &nbsp;
              </button>

              &nbsp;&nbsp;

              <button 
                type='button'
                className="ModalSubjectColorButton"
                style={{backgroundColor:'#FF8000'}}
                onClick={()=> handleChangePrincipalColor('#FF8000')}
              >
                &nbsp;
              </button>

              <br />
              <div style={{height:'6px'}}>
                <></>
              </div>
              &nbsp;&nbsp;&nbsp;
            
              <button 
                type='button'
                className="ModalSubjectColorButton"
                style={{backgroundColor:'#9A0000'}}
                onClick={()=> handleChangePrincipalColor('#9A0000')}
              >
                &nbsp;
              </button>

              &nbsp;&nbsp;

              <button 
                type='button'
                className="ModalSubjectColorButton"
                style={{backgroundColor:'#67FE33'}}
                onClick={()=> handleChangePrincipalColor('#67FE33')}
              >
                &nbsp;
              </button>

              &nbsp;&nbsp;

              <button 
                type='button'
                className="ModalSubjectColorButton"
                style={{backgroundColor:'#FF00CD'}}
                onClick={()=> handleChangePrincipalColor('#FF00CD')}
              >
                &nbsp;
              </button>

              &nbsp;&nbsp;

              <button 
                type='button'
                className="ModalSubjectColorButton"
                style={{backgroundColor:'#673301'}}
                onClick={()=> handleChangePrincipalColor('#673301')}
              >
                &nbsp;
              </button>

              &nbsp;&nbsp;

              <button 
                type='button'
                className="ModalSubjectColorButton"
                style={{backgroundColor:'#9A6601'}}
                onClick={()=> handleChangePrincipalColor('#9A6601')}
              >
                &nbsp;
              </button>

              &nbsp;&nbsp;

              <button 
                type='button'
                className="ModalSubjectColorButton"
                style={{backgroundColor:'#D7AC00'}}
                onClick={()=> handleChangePrincipalColor('#D7AC00')}
              >
                &nbsp;
              </button>

              &nbsp;&nbsp;

              <button 
                type='button'
                className="ModalSubjectColorButton"
                style={{backgroundColor:'#0033CC'}}
                onClick={()=> handleChangePrincipalColor('#0033CC')}
              >
                &nbsp;
              </button>

              &nbsp;&nbsp;

              <button 
                type='button'
                className="ModalSubjectColorButton"
                style={{backgroundColor:'#356768'}}
                onClick={()=> handleChangePrincipalColor('#356768')}
              >
                &nbsp;
              </button>

              &nbsp;&nbsp;

              <button 
                type='button'
                className="ModalSubjectColorButton"
                style={{backgroundColor:'#CCCCCC'}}
                onClick={()=> handleChangePrincipalColor('#CCCCCC')}
              >
                &nbsp;
              </button>
            
            </div>
            
            <br />
            
            <div>
              <div style={{float:'left', marginTop:'14px'}}>
                Personalizar cor: &nbsp;
              </div>
              <input
                type="color"
                color='#51B749'
                style={{height:'35px', width:'30px'}}
                onChange={e => handleChangePrincipalColor(e.target.value)}
              />
            </div>

            <br />
            <br />

            <div style={{float:'right', marginRight:'12px'}}>
              <div style={{float:'left'}}>
                <button 
                  className="buttonClick"
                  type='button'
                  onClick={()=> saveSubject()}
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
                  onClick={() => handleSubjectModalClose()}
                  style={{width:'100px'}}
                >
                  <FaRegTimesCircle />
                  Fechar
                </button>
              </div>
            </div>

          </div>
        </ModalSubjectMobile>
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
export default SubjectEdit;
