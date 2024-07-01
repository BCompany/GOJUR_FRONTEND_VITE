/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useState, useCallback, useEffect } from 'react';
import { useAlert } from 'context/alert';
import { envProvider } from 'services/hooks/useEnv';
import {
  FiChevronLeft,
  FiChevronRight,
  FiPlusSquare,
  FiX,
} from 'react-icons/fi';
import { format } from 'date-fns';

import api from 'services/api';

import { useHistory } from 'react-router-dom';
import { Container, Modal, Acompanhamentos, Content } from './styles';

interface processFollowProps {
  date: string;
  description: string;
  forumName: string;
  id: string;
  numIntance: number;
  typeFollow: string;
  typeFollowDescription: string;
  userEditName: string;
  userIncludeName: string;
}

interface processProps {
  courtFollow: null;
  currentCourt: string;
  currentCourtDept: string;
  currentInstance: string;
  customerList: any;
  dateFinalization: string;
  dateInsert: string;
  dateLastUpdate: null;
  dateRelease: string;
  decision: string;
  desLastFollow: null;
  documentList: any;
  eventList: [];
  followList: any[];
  forumName: null;
  hasEvent: boolean;
  instanceList: any;
  judicialAction: string;
  judicialNature: string;
  lawyerList: any;
  markers: string;
  matterCustomerDesc: string;
  matterFolder: string;
  matterId: number;
  matterNumber: string;
  matterNumberCNJ: null;
  matterOppossingDesc: string;
  opossingList: any;
  orderList: any;
  privacity: string;
  probabilyExito: string;
  processualStage: string;
  rito: string;
  status: string;
  thirdyList: any;
  title: null;
  userIncludeUpdate: null;
}
const ProcessModal: React.FC = () => {
  const processId = localStorage.getItem('@GoJur:ProcessId');
  const history = useHistory();

  const [processData, setProcessData] = useState({} as processProps);
  const [processFollowData, setProcessFollowData] = useState<
    processFollowProps[]
  >([]);
  const [pageNumber, setPageNumber] = useState(1);

  const { handleProcessModalClose } = useAlert();

  useEffect(() => {
    async function handleGraphics() {
      try {
        const tokenapi = localStorage.getItem('@GoJur:token');
        const idProcess = localStorage.getItem('@GoJur:ProcessId');
        const response = await api.post<processProps>(
          '/Processo/SelecionarProcesso',
          {
            matterId: idProcess,
            token: tokenapi,
            companyId: localStorage.getItem('@GoJur:companyId'),
            apiKey: localStorage.getItem('@GoJur:apiKey')
          },
        );

        setProcessData(response.data);
        setProcessFollowData(response.data.followList);
      } catch (err) {
        console.log(err);
      }
    }
    handleGraphics();
  }, [processId]);

  const handleMore = useCallback(async () => {
    try {
      const tokenapi = localStorage.getItem('@GoJur:token');
      const idProcess = localStorage.getItem('@GoJur:ProcessId');
      const response = await api.post<processFollowProps[]>(
        '/Processo/ListarAcompanhamentos',
        {
          matterId: idProcess,
          page: pageNumber + 1,
          rows: 3,
          token: tokenapi,
        },
      );

      setPageNumber(pageNumber + 1);

      setProcessFollowData(processFollowData.concat(response.data));
    } catch (err) {
      console.log(err);
    }

  }, [pageNumber, processFollowData]);

  const handleRedirectMatter = (matterId: number) => {

    const token = localStorage.getItem('@GoJur:token');

    api.post('/Processo/SelecionarProcesso', {
      matterId,
      token,
      companyId: localStorage.getItem('@GoJur:companyId'),
      apiKey: localStorage.getItem('@GoJur:apiKey')
    })
    .then(response => {
      const matterType = response.data.typeAdvisorId == null? 'legal': 'advisory'
      const url = `/matter/edit/${matterType}/${matterId}`
      window.location.href = url;
    })
  }

  return (
    <Container>
      <Modal>
        <header>
          <button type="button" onClick={handleProcessModalClose}>
            <FiX />
          </button>
        </header>
        <Content>
          <div id="folder">
            <h3>Pasta:</h3>
            <p>{processData.matterFolder}</p>
            <h3>Processo:</h3>
            <p>{processData.matterNumber}</p>
          </div>
          <div id="action">
            <h3>Ação:</h3>
            <p>{processData.judicialAction}</p>
          </div>
          <div id="partes">
            <h3>Partes:</h3>
            <p>
              {processData.matterCustomerDesc}
              { " X "}
              {processData.matterOppossingDesc}
            </p>
          </div>
          <span
            style={{fontSize:'0.85rem', color:'var(--blue-twitter)', marginTop:'10px', cursor:'pointer'}}
            onClick={() => handleRedirectMatter(Number(processId))}
            // href={`${envProvider.redirectUrl}main/globalWs?module=Matter&parameters=caller=ReactAPP%2C%26matterId=${processId}&token=${token}`}
          >
            Abrir Processo
          </span>

          <Acompanhamentos>
            <header>
              <h1>Acompanhamentos</h1>
            </header>
            <section>
              {processFollowData.map(item => (
                <div key={item.id}>
                  <h3>{format(new Date(item.date), 'dd/MM/yyyy')}</h3>
                  <p>{item.description}</p>
                </div>
              ))}
              <button type="button" onClick={handleMore}>
                Mais acompanhamentos
              </button>
            </section>
          </Acompanhamentos>
        </Content>
      </Modal>
    </Container>
  );
};

export default ProcessModal;
