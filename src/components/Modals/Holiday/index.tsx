

import { useModal } from 'context/modal';
import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { FiX, FiDownloadCloud } from 'react-icons/fi';
import api from 'services/api';
import { Modal, Content, DocumentsTable } from './styles';

interface HolidayDocumentData {
  type: string;
  uploadDate: Date;
  name:string,
  path: string
}
interface HolidayData {
  id: number;
  name: any; 
  tramitacao: string;
  type:string;
  initialDate: string;
  finalDate: string;
  nameCalculatorType:string;
  local: string;
  cityName: string;
  stateName: string;
  typeCalc:string;
  typeMatter:string;
  courtName:string;
  documentList:Array<HolidayDocumentData>
}

interface DataObject {
  data: any
}

const HolidayModal: React.FC<DataObject> = ({ data }) => {
  
  const { modalActive, handleModalActive } = useModal();
  const [holiday, setHoliday] = useState<HolidayData>(JSON.parse(data) as HolidayData)
  const [abrangencyDesc, setAbrangencyDesc] = useState<string>('Nacional')
  const [localDesc, setLocalDesc] = useState<string>('Território Nacional')
  const [meioTramitacao, setMeioTramitacao] = useState<string>('Ambos')
  const [isOpenDocument, setIsOpenDocument] = useState<Boolean>(false)

  useEffect(() => {
    
    Initialize();

  },[])

  const Initialize = () => {

    if (holiday.local == 'E'){
      setAbrangencyDesc(`Estadual`)
      setLocalDesc(holiday.stateName)
    } 
    if (holiday.local == 'M'){
      setAbrangencyDesc(`Municipal`)
      setLocalDesc(holiday.cityName)
    }   
  
    if (holiday.typeMatter != 'A'){
      setMeioTramitacao(holiday.typeMatter == 'F'? 'Físico': 'Eletrônico');
    }
  
    setHoliday(holiday);
  }

  const openDocumet = async (item:HolidayDocumentData) => {

    setIsOpenDocument(true)

    const response = await api.post<string>('/Feriados/DownloadArquivo', {
      token: localStorage.getItem('@GoJur:token'),
      id: holiday.id,
      fileName: item.name
    })

    setIsOpenDocument(false)

    window.open(response.data, 'blank')
  }

  if (modalActive)
  {
    return(
        
      <Modal>

        <header>

          <p>Feriado / Recesso Judicial</p>
          <button type="button" onClick={() => handleModalActive(false)}>
            <FiX />
          </button>
        </header>

        <Content>
        
          <div>

            <label htmlFor="name">
              Descrição
              <input name="name" disabled value={holiday.name} />
            </label>

          </div>
          
          <div>

            <label htmlFor="tramitacao">
              Meio de Tramitação
              <input name="tramitacao" disabled value={meioTramitacao} />
            </label>

            <label htmlFor="typeCalc">
              Tipo
              <input name="typeCalc" disabled value={(holiday.typeCalc == 'J'? 'Judicial': 'Normal')} />
            </label>

            <label htmlFor="startDate">
              Data Inicial
              <input name="startDate" disabled value={format(new Date(holiday.initialDate), 'dd/MM/yyyy')} />
            </label>

            <label htmlFor="name">
              Data Final
              <input name="endDate" disabled value={format(new Date(holiday.finalDate), 'dd/MM/yyyy')} />
            </label>

            <label htmlFor="court">
              Tribunal
              <input name="court" disabled value={holiday.courtName} />
            </label>

            <label htmlFor="abrangencia">
              Abrangencia
              <input name="abrangencia" disabled value={abrangencyDesc} />
            </label>

            <label htmlFor="abrangencia">
              Localidade
              <input name="abrangencia" disabled value={localDesc} />
            </label>

            <label htmlFor="calcType">
              Código Processual
              <input name="calcType" disabled value={holiday.nameCalculatorType === ''? 'Indefinido': holiday.nameCalculatorType} />
            </label>

          </div>

        </Content>

        <DocumentsTable>
        
          <table>

            <thead>

              <th>Descrição</th>
              <th>Data do Upload</th>
              <th>Download</th>
 
            </thead>

            <tbody style={{pointerEvents:(isOpenDocument?'none':'all')}}>

              {holiday.documentList.map((item => (
                <tr>
                  <td>{item.name}</td>
                  <td>{format(new Date(item.uploadDate), 'dd/MM/yyyy')}</td>
                  <td><FiDownloadCloud size={16} onClick={() => openDocumet(item)} /></td>
                </tr>
              )))}

            </tbody>
          </table>

        </DocumentsTable>

      </Modal>
    )
  }
  
  return null;
  
}

export default HolidayModal;