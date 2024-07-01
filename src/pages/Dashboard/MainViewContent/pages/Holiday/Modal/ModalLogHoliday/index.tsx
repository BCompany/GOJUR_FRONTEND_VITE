import React, { useState, useEffect, useCallback } from 'react';
import Loader from 'react-spinners/ClipLoader'; 
import Modal from 'react-modal';
import { FiPlus } from 'react-icons/fi';
import { FcViewDetails } from 'react-icons/fc';
import { MdBlock } from 'react-icons/md';
import { Overlay } from 'Shared/styles/GlobalStyle';
import api from 'services/api';
import { Container, ContainerDetails } from './styles';


export interface IHolidayLogData{
	dta_Log: string;
	tpo_LogAcao: string;
	des_Log: string;
	des_LogSerializado: string;
	des_UsuarioId: string;
	cod_LogOrigemId: string;
	tpo_LogCategoria: string;
	flg_LogExclusao: string;
	cod_Empresa: string;
	nom_Pessoa: string;
	dta_LogString: string;

}

export default function LogModal ({ idAppointment, handleCloseModalLog }) {

  const [logList, setLogList] = useState<IHolidayLogData[]>([]);
  const [isEndPage, setIsEndPage] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [openDetails, setOpenDetails] = useState<boolean>(false);
  const [logSelected, setLogSelected] = useState<IHolidayLogData | undefined>();
  const [page, setPage] = useState<number>(0);
  const token = localStorage.getItem('@GoJur:token');

  useEffect(() => {
  
    LoadListLog()
  
  },[page])
  
  const LoadListLog = useCallback(async() => {

    try {
      // const appointmentId = localStorage.getItem('@GoJur:AppointmentId');

      const response = await api.get<IHolidayLogData[]>(`/Feriados/ListarLogFeriado`, {
				params:{
        holidayId: idAppointment,
        count: logList.length,
        token,
				}
      });

      setIsEndPage(response.data.length < 5)

      if (page === 1){
        setLogList(response.data);
      }
      else{
        const newData = [...logList, ...response.data];
        setLogList(newData);
      }

      setIsLoading(false)
    } 
    catch (err:any) {
      console.log(err.message);
    }

  }, [idAppointment, logList, page, token])

  const handleOpenDetails = (log: IHolidayLogData) => {
      setOpenDetails(true)      
      setLogSelected(log)
  }

  const handleCloseDetails = () => {
    setOpenDetails(false)
}

  

  return (

    <Modal
      isOpen
      overlayClassName="react-modal-overlay"      
      className="react-modal-content-large"
    >
      <Container>
          
        <header>
          <h1>Histórico de Alterações</h1>
        </header>

        <div>

          {logList.map(log => {
            return (
              <div>
                {log.des_Log}
                {' '}
                foi alterada por
                {' '}
                <span>{log.nom_Pessoa}</span>
                {' em '}
                <span>{log.dta_LogString}</span>

                <FcViewDetails onClick={() => handleOpenDetails(log)} title="Clique para ver mais detalhes da transação" />
              </div>  
            )
          })} 
         
          {(!isEndPage && !isLoading) && (
            <button 
              className="buttonLinkClick" 
              type="button"
              onClick={() => setPage(logList.length)} 
              title="Clique para retornar a listagem de processos"
            >
              <FiPlus />
              <span>Ver Mais</span>
            </button> 
          )}

        </div>
       
        <footer>         

          <button 
            className="buttonClick" 
            type="button"
            onClick={handleCloseModalLog}
            title="Clique para retornar ao compromisso"
          >
            <MdBlock />
            <span>Fechar</span>
          </button>  

        </footer>

        {(openDetails && logSelected) && (
          <ContainerDetails>
            <header>
              <h1>Detalhes da alteração:</h1>
              <h5>
                Alterado por: 
                { '  ' }
                {logSelected.nom_Pessoa}
              </h5>
            </header>

            <div>
              {logSelected.des_LogSerializado.split('|').map(item => {
                return <p>{item}</p>
              })}
            </div>

            <footer>
              <button 
                className="buttonLinkClick" 
                type="button"
                onClick={handleCloseDetails}
                title="Clique para fechar os detalhes do Log"
              >
                <MdBlock />
                <span>Fechar</span>

              </button>  
            </footer>
            
          </ContainerDetails>
        )}

      </Container>

    </Modal>

  )
}

