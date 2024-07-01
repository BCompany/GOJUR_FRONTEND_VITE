import { useDefaultSettings } from "context/defaultSettings"
import React, { useEffect, useState } from "react"
import { AiOutlinePrinter } from 'react-icons/ai'
import api from "services/api";
import Loader from 'react-spinners/PulseLoader';
import { IDefaultsProps } from "../Interfaces/Common/ICommon";
import { IMatterCoverData } from "../Interfaces/MatterCover/IMatterCover";
import { Container } from "./styles"

export default function PrinterCover() {
 
  const {handleUserPermission} = useDefaultSettings();  
  const token = localStorage.getItem('@GoJur:token');
  const matterId = localStorage.getItem('@GoJur:matterCoverId');
  const [html , setHtml] = useState<string>('')
  const [isLoading , setIsLoading] = useState<boolean>(true)

  const LoadReport = async () => {

    const response = await api.get<IMatterCoverData>('/Processo/CapaDoProcesso', {
      params:{
        token,
        matterId
      }
    })

    setHtml(response.data.content)
    setIsLoading(false)
  }

  const LoadDefaultProps = async () => {
    
    try {
      const response = await api.post<IDefaultsProps[]>('/Defaults/Listar', {
        token,
      });

      const userPermissions = response.data.filter(item => item.id === 'defaultModulePermissions')
      const permissiosnModule = userPermissions[0].value.split('|')

      handleUserPermission(permissiosnModule);

    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    
    LoadReport();

  },[])

  useEffect(() => {
  
    LoadDefaultProps();
    
  }, [handleUserPermission]); 

  const  handlePrint = () => {
    window.print();
  }

  function createMarkup() {
    return {__html: html};
  }
  
  return (
    <Container id="workSpaceContainer">

      <br />
      
      <button 
        type="submit"
        className="buttonLinkClick"
        id="buttonPrint"
        onClick={handlePrint}
      >
        <AiOutlinePrinter />
        Imprimir
      </button>

      <div dangerouslySetInnerHTML={createMarkup()} />
      
      {isLoading && ( 
        <div className='waitingReport'>
          <Loader size={6} color="var(--blue-twitter)" /> 
        </div>
      )}


    </Container>
  )

}
