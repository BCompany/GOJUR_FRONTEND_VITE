/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable no-console */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable no-return-assign */
/* eslint-disable no-alert */
import React, { useCallback, useEffect, useState, ChangeEvent } from 'react';
import { FaRegTimesCircle } from 'react-icons/fa';
import { useToast } from 'context/toast';
import { Overlay } from 'Shared/styles/GlobalStyle';
import LoaderWaiting from 'react-spinners/ClipLoader';
import { MdHelp } from 'react-icons/md';
import { useDevice } from "react-use-device";
import { FiSave } from 'react-icons/fi';
import api from 'services/api';
import { Modal,  Flags} from './styles';

export interface IMatterLabelData {
  cod_Etiqueta: string;
  des_Etiqueta: string;
  num_AlturaCm: string;
  num_LarguraCm: string;
  num_MargemSuperiorCm: string;
  num_MargemLateralCm: string;
  num_DistanciaEntreVerticalCm: string;
  num_DistanciaEntreHorizontalCm: string;
  qtd_EtiquetaLinha: string;
  qtd_EtiquetaPagina: string;
  num_TamanhoFonte: string;
  flg_Simplificada: boolean;
  cod_Empresa: string;
  tpo_Etiqueta: string;
  tpo_TamanhoPapel: string;
}

const CustomerLabelEdit = (props) => {
  const { CloseCustomerLabelModal, setCaller,setLabelId, labelId, caller} = props.callbackFunction
  const { addToast } = useToast();
  const token = localStorage.getItem('@GoJur:token');
  const [isSaving , setisSaving] = useState<boolean>(); // set trigger for show loader
  const [isDeleting, setIsDeleting] = useState(false);
  const [des_Etiqueta, setDes_Etiqueta] = useState<string>("");
  const [tpo_TamanhoPapel, setTpo_TamanhoPapel] = useState<string>("A4")
  const [qtd_EtiquetaLinha, setQtd_EtiquetaLinha] = useState<string>("0")
  const [num_TamanhoFonte, setNum_TamanhoFonte] = useState<string>("0")
  const [qtd_EtiquetaPagina, setQtd_EtiquetaPagina] = useState<string>("0")
  const [flg_Simplificada, setFlg_Simplificada] = useState<boolean>(false);
  const [num_LarguraCm, setNum_LarguraCm] = useState<string>("0")
  const [num_MargemSuperiorCm, setNum_MargemSuperiorCm] = useState<string>("0")
  const [num_AlturaCm, setNum_AlturaCm] = useState<string>("0")
  const [num_MargemLateralCm, setNum_MargemLateralCm] = useState<string>("0")
  const [num_DistanciaEntreVerticalCm, setNum_DistanciaEntreVerticalCm] = useState<string>("0")
  const [num_DistanciaEntreHorizontalCm, setNum_DistanciaEntreHorizontalCm] = useState<string>("0")

  useEffect(() => {
  
    if(caller == "edit"){
      SelectCustomerLabel(labelId)
    }
    
  }, [caller]);

  const SelectCustomerLabel = useCallback(async(id: number) => {

    const response = await api.get<IMatterLabelData>('/Processo/EtiquetaDoProcessoEditar', {
      params:{
      id,
      token
      }
      
    })

    setDes_Etiqueta(response.data.des_Etiqueta)
    setTpo_TamanhoPapel(response.data.tpo_TamanhoPapel)
    setQtd_EtiquetaLinha(response.data.qtd_EtiquetaLinha)
    setNum_TamanhoFonte(response.data.num_TamanhoFonte)
    setQtd_EtiquetaPagina(response.data.qtd_EtiquetaPagina)
    setFlg_Simplificada(response.data.flg_Simplificada)
    setNum_LarguraCm(response.data.num_LarguraCm)
    setNum_MargemSuperiorCm(response.data.num_MargemSuperiorCm)
    setNum_AlturaCm(response.data.num_AlturaCm)
    setNum_MargemLateralCm(response.data.num_MargemLateralCm)
    setNum_DistanciaEntreVerticalCm(response.data.num_DistanciaEntreVerticalCm)
    setNum_DistanciaEntreHorizontalCm(response.data.num_DistanciaEntreHorizontalCm)

    
  },[labelId, des_Etiqueta, tpo_TamanhoPapel, qtd_EtiquetaLinha, num_TamanhoFonte, qtd_EtiquetaPagina, flg_Simplificada, num_LarguraCm, num_MargemSuperiorCm, num_AlturaCm, num_MargemLateralCm, num_DistanciaEntreVerticalCm, num_DistanciaEntreHorizontalCm]);

  const saveCustomerLabel = useCallback(async() => {
    try {

      if (isSaving) {
        addToast({
          type: "info",
          title: "Operação NÃO realizada",
          description: `Já existe uma operação em andamento`
        })
  
        return;
      }

      if (des_Etiqueta == "") {
        addToast({
          type: "info",
          title: "Operação NÃO realizada",
          description: `Por favor , informe uma descrição para a etiqueta`
        })
  
        return;
      }

      let saveId = 0;
      
      if(caller == "edit"){ 
        saveId = labelId
      }

      const token = localStorage.getItem('@GoJur:token');

      
      setisSaving(true)
      const response = await api.post('/Processo/EtiquetaSalvar', {
        cod_Etiqueta: saveId,
        des_Etiqueta,
        num_AlturaCm,
        num_LarguraCm,
        num_MargemSuperiorCm,
        num_MargemLateralCm,
        num_DistanciaEntreVerticalCm,
        num_DistanciaEntreHorizontalCm,
        qtd_EtiquetaLinha,
        qtd_EtiquetaPagina,
        num_TamanhoFonte,
        flg_Simplificada,
        tpo_Etiqueta: "C",
        tpo_TamanhoPapel,
        token
      })
      
      addToast({
        type: "success",
        title: "Etiqueta salva",
        description: "A etiqueta foi adicionada no sistema."
      })

      if(saveId == 0){
        setCaller("save")
      }
      if(saveId != 0){
        setCaller("reload")
      }
      setLabelId(response.data.cod_Etiqueta)
      setisSaving(false)
      CloseCustomerLabelModal()
    } catch (err) {
      setisSaving(false)
      addToast({
        type: "error",
        title: "Falha ao salvar etiqueta.",
      })
    }
  },[isSaving,caller ,labelId, des_Etiqueta, num_AlturaCm, num_LarguraCm, num_MargemSuperiorCm, num_MargemLateralCm, num_DistanciaEntreVerticalCm, num_DistanciaEntreHorizontalCm, qtd_EtiquetaLinha, qtd_EtiquetaPagina, num_TamanhoFonte, flg_Simplificada, tpo_TamanhoPapel]);


  // DELETE
  const deleteCustomerLabel = async() => {
    try {     

      setIsDeleting(true)
      const token = localStorage.getItem('@GoJur:token');
      
      await api.delete('/Processo/EtiquetaDeletar', {
        params:{
        id: labelId,
        token
        }
      })
      
      addToast({
        type: "success",
        title: "Etiqueta excluída",
        description: "A etiqueta foi excluída no sistema."
      })

      setIsDeleting(false)
      CloseModal()
      window.location.reload()

    } catch (err: any) {
      setIsDeleting(false)
      addToast({
        type: "error",
        title: "Falha ao excluir etiqueta.",
        description:  err.response.data.Message
      })
    }
  };

  
  const CloseModal = () => {
    setDes_Etiqueta('')
    setNum_AlturaCm("")
    setNum_LarguraCm("")
    setNum_MargemSuperiorCm("")
    setNum_MargemLateralCm("")
    setNum_DistanciaEntreVerticalCm("")
    setNum_DistanciaEntreHorizontalCm("")
    setQtd_EtiquetaLinha("")
    setQtd_EtiquetaPagina("")
    setTpo_TamanhoPapel("")
    setNum_TamanhoFonte("")
    setFlg_Simplificada(false)
    setTpo_TamanhoPapel("A4")
    CloseCustomerLabelModal()

  }

  
  return (
    <>
      
      <Modal show>

        <div className='mainDiv'>
          Etiqueta

          <br />
          <br />

          <div className='modalDiv'>
            <div className='description'>
              <label htmlFor="descricao">
                Descrição
                <br />
                <input 
                  type="text"
                  name="descricao"
                  value={des_Etiqueta}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setDes_Etiqueta(e.target.value)}
                  autoComplete="off"
                />
              </label>
            </div>
            

            <div className='rightDiv'>
              <label htmlFor="type">
                Tamanho Papel
                <br />
                <select 
                  style={{backgroundColor:"white"}}
                  name="PaperType"
                  value={tpo_TamanhoPapel}
                  onChange={(e: ChangeEvent<HTMLSelectElement>) => setTpo_TamanhoPapel(e.target.value)}
                >
                  <option value="A4">A4</option>
                  <option value="LT">CARTA</option>
                </select>
              </label>
            </div>

          </div>

          <br />

          <div className='modalDiv'>
            <div className='description'>
              <label htmlFor="descricao">
                Etiquetas por Linha
                <br />
                <input 
                  type="number"
                  name="descricao"
                  value={qtd_EtiquetaLinha}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setQtd_EtiquetaLinha(e.target.value)}
                  autoComplete="off"
                />
              </label>
            </div>

            <div className='rightDiv'>
              <label htmlFor="descricao">
                Tamanho Fonte (px)
                <br />
                <input 
                  type="number"
                  name="descricao"
                  value={num_TamanhoFonte}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setNum_TamanhoFonte(e.target.value)}
                  autoComplete="off"
                />
              </label>
            </div>

          </div>

          <br />

          <div className='qtd_EtiquetaPagina'>
            <label htmlFor="descricao">
              Etiquetas por Página
              <br />
              <input 
                type="number"
                name="descricao"
                value={qtd_EtiquetaPagina}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setQtd_EtiquetaPagina(e.target.value)}
                autoComplete="off"
              />
            </label>
          </div>

          <br />

          <p style={{marginTop:"5%"}}>Informe as dimensões da etiqueta em centímetros:</p>
            
          <br />

          <div className='modalDiv'>
            <div className='description'>
              <label htmlFor="descricao">
                Largura
                <br />
                <input 
                  type="number"
                  name="descricao"
                  value={num_LarguraCm}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setNum_LarguraCm(e.target.value)}
                  autoComplete="off"
                />
              </label>
            </div>

            <div className='rightDiv'>
              <label htmlFor="descricao">
                Margem Superior
                <br />
                <input 
                  type="number"
                  name="descricao"
                  value={num_MargemSuperiorCm}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setNum_MargemSuperiorCm(e.target.value)}
                  autoComplete="off"
                />
              </label>
            </div>

          </div>

          <br />

          <div className='modalDiv'>
            <div className='description'>
              <label htmlFor="descricao">
                Altura
                <br />
                <input 
                  type="number"
                  name="descricao"
                  value={num_AlturaCm}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setNum_AlturaCm(e.target.value)}
                  autoComplete="off"
                />
              </label>
            </div>

            <div className='rightDiv'>
              <label htmlFor="descricao">
                Margem Lateral
                <br />
                <input 
                  type="number"
                  name="descricao"
                  value={num_MargemLateralCm}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setNum_MargemLateralCm(e.target.value)}
                  autoComplete="off"
                />
              </label>
            </div>

          </div>

          <br />

          <div className='modalDiv'>
            <div className='description'>
              <label htmlFor="descricao">
                Distância (entre) Vertical
                <br />
                <input 
                  type="number"
                  name="descricao"
                  value={num_DistanciaEntreVerticalCm}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setNum_DistanciaEntreVerticalCm(e.target.value)}
                  autoComplete="off"
                />
              </label>
            </div>

            <div className='rightDiv'>
              <label htmlFor="descricao">
                Distância (entre) Horizontal
                <br />
                <input 
                  type="number"
                  name="descricao"
                  value={num_DistanciaEntreHorizontalCm}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setNum_DistanciaEntreHorizontalCm(e.target.value)}
                  autoComplete="off"
                />
              </label>
            </div>

          </div>

          <br />
          <br />

          <div style={{float:'right', marginRight:'12px'}}>
            <div style={{float:'left'}}>
              <button 
                className="buttonClick"
                type='button'
                onClick={()=> saveCustomerLabel()}
                style={{width:'100px'}}
              >
                <FiSave />
                Salvar 
              </button>
            </div>

            {caller == "edit" && (
            <div style={{float:'left'}}>
              <button 
                className="buttonClick"
                type='button'
                onClick={()=> deleteCustomerLabel()}
                style={{width:'100px'}}
              >
                <FiSave />
                Excluir 
              </button>
            </div>
            )}
                      
            <div style={{float:'left', width:'100px'}}>
              <button 
                type='button'
                className="buttonClick"
                style={{width:'100px'}}
                onClick={CloseModal}
              >
                <FaRegTimesCircle />
                Fechar
              </button>
            </div>
          </div>

        </div>
      </Modal>
    
    
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

      {isDeleting && (
      <>
        <Overlay />
        <div className='waitingMessage'>   
          <LoaderWaiting size={15} color="var(--blue-twitter)" /> 
          &nbsp;&nbsp; Deletando ...
        </div>
      </>
    )}
    </>
    
  )
  

}
export default CustomerLabelEdit;
