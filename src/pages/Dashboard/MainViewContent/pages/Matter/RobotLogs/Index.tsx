import React from 'react';
import {MdBlock} from 'react-icons/md';
import { useConfirmBox } from 'context/confirmBox';
import Modal from 'react-modal';
import { FormatDate } from 'Shared/utils/commonFunctions';
import { IMatterData, IMatterFollowRobotLog } from '../Interfaces/IMatter';
import { Container } from './styles';

interface IRobotLog {
  matter:IMatterData;
  robotLogs:IMatterFollowRobotLog[]
}

const RobotLogs: React.FC<IRobotLog> = (props) => {

  const { handleCancelMessage, handleCaller } = useConfirmBox(); 
  const {robotLogs} = props
  
  const handleCloseModal = () => {

    handleCaller('matterRobotLogs')
    handleCancelMessage(true)
  }
  
  return (
    <Modal
      isOpen
      overlayClassName="react-modal-overlay"
      className="react-modal-content"
    >
      <Container style={{ maxHeight: '80vh', overflowY: 'auto' }}>
        <h1> Log de Operações (on/off - Pesquisa Tribunal</h1>
  
        <div>
          {robotLogs.some(log => log.nom_Credencial && log.nom_Usuario) && (
            <div>
              {`Credencial: ${robotLogs.find(log => log.nom_Credencial && log.nom_Usuario).nom_Credencial}, Usuário: ${robotLogs.find(log => log.nom_Credencial && log.nom_Usuario).nom_Usuario}`}
            </div>
          )}
  
          {robotLogs.map(log => {
            return (
              <div key={log.id}>
                {log.nom_PessoaFimPesquisa == null && (
                  <div>
                    {`Inicio Em: ${FormatDate(new Date(log.dta_InicioPesquisa), 'dd/MM/yyyy')} ligado por: ${log.nom_PessoaInicioPesquisa}`}
                  </div>
                )}
  
                {log.nom_PessoaFimPesquisa != null && (
                  <div>
                    {`Inicio Em: ${FormatDate(new Date(log.dta_InicioPesquisa), 'dd/MM/yyyy')} ligado por: ${log.nom_PessoaInicioPesquisa} - fim em: ${FormatDate(new Date(log.dta_FimPesquisa), "dd/MM/yyyy")} desligado por: ${log.nom_PessoaFimPesquisa}`}
                  </div>
                )}
              </div>
            );
          })}
        </div>
  
        {robotLogs.length === 0 && (
          <div>
            <div>
              Este processo nunca foi pesquisado nos tribunais. A pesquisa não foi habilitada
            </div>
          </div>
        )}
  
        <footer>
          <button
            className="buttonClick"
            type="button"
            onClick={handleCloseModal}
            title="Clique para retornar a listagem de processos"
          >
            <MdBlock />
            Fechar
          </button>
        </footer>
      </Container>
    </Modal>
  );
}

export default RobotLogs