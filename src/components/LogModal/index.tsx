/* eslint-disable react/require-default-props */

import React, { useState, useEffect, useCallback } from 'react';
import Loader from 'react-spinners/ClipLoader';
import Modal from 'react-modal';
import { useToast } from 'context/toast';
import { FiPlus,FiX } from 'react-icons/fi';
import { FcViewDetails } from 'react-icons/fc';
import { MdBlock } from 'react-icons/md';
import { Overlay } from 'Shared/styles/GlobalStyle';
import api from 'services/api';
import { Container, ContainerDetails } from './styles';
import { LogData } from './ILog';

interface LogTypeProps
{
    idRecord: number,
    handleCloseModalLog: () => void,
    logType: 'eventLog' | 'publicationLog' | 'billingInvoiceLog' | 'publicationLogByBC01' | 'movementLog' | 'dealLog' | 'matterEventLog',
    companyId?: number
}

export default function LogModal (props: LogTypeProps) {
  const { addToast } = useToast();
  const [logList, setLogList] = useState<LogData[]>([]);
  const [isEndPage, setIsEndPage] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [openDetails, setOpenDetails] = useState<boolean>(false);
  const [logSelected, setLogSelected] = useState<LogData | undefined>();
  const [page, setPage] = useState<number>(1);
  const token = localStorage.getItem('@GoJur:token');

  useEffect(() => {
    LoadListLog()
  },[page])

  const LoadListLog = useCallback(async() => {

    try {
      let uri = "";

      if (props.logType == "eventLog"){
        uri = `/Compromisso/ListarLogs`;
      }

      if (props.logType == "publicationLog"){
        uri = `/Publicacao/ListarLogs`;
      }

      if (props.logType == "publicationLogByBC01"){
        uri = `/Publicacao/ListarLogsPublicacaoPorID`;
      }

      if (props.logType == "billingInvoiceLog"){
        uri = `/Financeiro/Faturamento/ListarLogFaturamento`;
      }

      if (props.logType == "movementLog"){
        uri = `/Financeiro/ListarLogs`;
      }

      if (props.logType == "dealLog"){
        uri = `/Acordo/ListarLogs`;
      }

      if (props.logType == "matterEventLog"){
        uri = `/ProcessoAcompanhamentos/ListarLogs`;
      }

      const response = await api.post<LogData[]>(uri, {
        id: props.idRecord,
        token,
        count: logList.length - 1,
        page,
        rows: 5,
        companyId: props.companyId
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
      setIsLoading(false);
      addToast({
        type: 'error',
        title: 'Falha ao baixar arquivo',
        description: err.response.data.Message
      });
    }

  }, [props.logType, props.idRecord, token, logList, page, props.companyId])

  const handleOpenDetails = (log: LogData) => {
      setOpenDetails(true)
      setLogSelected(log)
  }

  const handleCloseDetails = () => {
    setOpenDetails(false)
}

  if (isLoading){
    return (
      <>
        <Overlay />
        <div className='waitingMessage'>
          <Loader size={15} color="var(--blue-twitter)" />
          &nbsp;&nbsp;Aguarde...
        </div>
      </>
    )
  }

  return (

    <Modal
      isOpen
      overlayClassName="react-modal-overlay"
      className="react-modal-content-large"
    >
      <button
        type="button"
        className="react-modal-close"
        onClick={props.handleCloseModalLog}
      >
        <FiX size={20} />
      </button>

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
                {props.logType == 'eventLog'? '- alterado por': '- por'}
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
              onClick={() => setPage(page + 1)}
              title="Clique para retornar a listagem de processos"
            >
              <FiPlus />
              <span>Ver Mais</span>
            </button>
          )}

        </div>

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
