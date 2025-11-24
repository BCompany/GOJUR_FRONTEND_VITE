/* eslint-disable eqeqeq */
/* eslint-disable radix */
/* eslint-disable jsx-a11y/label-has-associated-control */
import React, {
  useCallback,
  useState,
  useEffect,
  ChangeEvent,
  useRef,
} from 'react';
import {
  FiChevronLeft,
  FiChevronRight,
  FiFolder
} from 'react-icons/fi';
import HeaderComponent from 'components/HeaderComponent';
import Search from 'components/Search';
import api from 'services/api';
import { useModal } from 'context/modal';
import { useToast } from 'context/toast';
import Loader from 'react-spinners/PulseLoader';

import {
  Container,
  GridSearch,
  Grid,
  Content,
  Footer,
  ItemContent,
} from './styles';

interface ModalProps {
  close: boolean;
}

interface ProcessData {
  matterId: number;
  matterCustomerDesc: string;
  matterOppossingDesc: string;
  matterFolder: string;
  matterNumber: string;
  forumName: string;
  currentInstance: string;
  currentCourt: string;
}

const GridSelectProcess: React.FC = () => {
  const inputRef = useRef<HTMLInputElement>(null);
  const { addToast } = useToast();

  // const [isClosed, setIsClosed] = useState(close);
  const [processData, setProcessData] = useState<ProcessData[]>([]);
  const [keyData, setKeyData] = useState({} as ProcessData | null);
  const [processPage, setProcessPage] = useState<number>(1);
  const [processTerm, setProcessTerm] = useState<string>('');
  const [inputId, setInputId] = useState<string>('');
  const [selectsId, setSelectsId] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(false)
  const [timerAutoComplete, setTimerAutoComplete] = useState<any>(null); // useState for keep timer delay	//HOOK QUE ARMAZENA O SETTIMEOUT

  const { selectProcess, handleSelectProcess, handleMatterAssociated } = useModal();

  useEffect(() => {
    async function handleProcess() {
      try {
        const userToken = localStorage.getItem('@GoJur:token');
        const companyId = localStorage.getItem('@GoJur:companyId');
        const apiKey = localStorage.getItem('@GoJur:apiKey');

        setIsLoading(true)

        const response = await api.post<ProcessData[]>(`/Processo/Listar`, {
          filterClause: '',
          page: processPage,
          rows: 10,
          token: userToken,
          companyId,
          apiKey
        });

        setProcessData(response.data);
        setIsLoading(false)
      }
      catch (err:any) {
        console.log(err.message);
      }
    }

    handleProcess();
  }, [processPage]); // Carregamento de dados processos

  const handleClose = useCallback(() => {
    handleSelectProcess('Close');
  }, [handleSelectProcess]);

  const handleNextPage = useCallback(() => {
    setProcessPage(processPage + 1);
  }, [processPage]);

  const handlePreviousPage = useCallback(() => {
    setProcessPage(processPage - 1);
  }, [processPage]);

  const handleSearchChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const search = event.target.value;

      setProcessTerm(search);
    },
    [],
  );

  const handleSelectProcessGrid = useCallback(
    data => {
      const itemSelected: ProcessData[] = data;

      if (data.matterNumber == undefined)
      {
        addToast({
          type: 'info',
          title: 'Processo não selecionado',
          description: 'Favor selecionar pelo menos um processo'
        });
        
        return;
      }

      localStorage.setItem('@GoJur:MatterId', data.matterId);

      handleMatterAssociated(true)

      selectProcess(itemSelected);

      handleClose();
    },
    [selectProcess],
  );

  const handleSelected = useCallback(
    ({ id, customer, oppossingDesc, folder, number, forum, vara, varaInstance }) => {
      const item = {
        matterId: id,
        matterCustomerDesc: customer,
        matterOppossingDesc: oppossingDesc,
        matterFolder: folder,
        matterNumber: number,
        forumName:  forum,
        currentCourt: vara,
        currentInstance: varaInstance
      };
      setKeyData(item);

      if (selectsId.length > 0) {
        addToast({
          type: 'info',
          title: 'Atenção',
          description: 'Selecione apenas um processo',
        });
      }
    },

    [addToast, selectsId],
  );

  const handleValidadeSelect = useCallback(
    id => {
      setInputId(id);
      setSelectsId([...selectsId, id]);
    },
    [selectsId],
  );

  const handleSearchList = useCallback(() => {
    if (timerAutoComplete != null) {
      // if exists timer delay remove from timer to avoid search request
      clearTimeout(timerAutoComplete);
    }

    const delay = 500; // 1 second delay

    async function RequestSearchList() {
      if (processTerm !== '') {
        try {
          setIsLoading(true)
          const userToken = localStorage.getItem('@GoJur:token');
          const companyId = localStorage.getItem('@GoJur:companyId');
          const apiKey = localStorage.getItem('@GoJur:apiKey');

          const response = await api.post<ProcessData[]>(`/Processo/Listar`, {
            filterClause: processTerm,
            page: processPage,
            rows: 10,
            token: userToken,
            companyId,
            apiKey
          });

          if (response.data.length === 0) {
            addToast({
              type: 'info',
              title: 'Total de resultados',
              description:
                'Não foi localizado nenhum resultado para essa busca',
            });
          }

          setProcessData(response.data);
          setIsLoading(false)
        }
        catch (err:any) {
          addToast({
            type: 'error',
            title: 'Falha no carregamento da pagina',
            description: err.message,
          });
        }
      } else {
        addToast({
          type: 'info',
          title: '',
          description: 'Informe um termo para realizar a busca',
        });
      }
    }
    // set timeout delay for request
    setTimerAutoComplete(
      setTimeout(() => {
        RequestSearchList();
        // if (processTerm.length >= 3) {
        //   // reload list subject
        // }
      }, delay),
    );
  }, [timerAutoComplete, processTerm, processPage, addToast]);

  return (
    <Container>
      <HeaderComponent title="Selecione Processo" cursor action={handleClose} />
      <GridSearch>
        <label title="Pesquisa em pasta, nº processo/CNJ, título, ação judicial, nome de cliente e contrário principal.">
          Pesquisa Rápida
        </label>
        <Search
          name="Process"
          icon={FiFolder}
          style={{ marginTop: 0, width: 280, height: 32 }}
          onChange={handleSearchChange}
          onKeyUp={handleSearchList}
          onKeyPress={(e: React.KeyboardEvent) => {
            if (e.key == 'Backspace') {
            //  if (e.key == '8' || e.key == '46') {               
               e.preventDefault();
             }
          }}
          value={processTerm}
          minLength={3}
        />
      </GridSearch>
      <Grid>
        <header>
          Processos
          <div>
            <button
              type="button"
              title="Página Anterior"
              onClick={handlePreviousPage}
            >
              <FiChevronLeft />
            </button>
            <p>{processPage}</p>

            <button
              type="button"
              title="Página Seguinte"
              onClick={handleNextPage}
            >
              <FiChevronRight />
            </button>
          </div>
        </header>
        <Content>
          {isLoading && <Loader size={13} color="#f19000" />}
          {!isLoading && 
          processData.map(item => (
            <ItemContent key={item.matterId}>
              <section>
                <input
                  type="checkbox"
                  name="selecionar"
                  id={inputId}
                  ref={inputRef}
                  title="Selecionar"
                  onChange={() => {
                    handleSelected({
                      id: item.matterId,
                      folder: item.matterFolder,
                      number: item.matterNumber,
                      oppossingDesc: item.matterOppossingDesc,
                      customer: item.matterCustomerDesc,
                      forum: item.forumName,
                      vara: item.currentCourt,
                      varaInstance: item.currentInstance
                    });
                  }}
                  onClick={() => {
                    handleValidadeSelect(item.matterId);
                  }}
                />
              </section>
              <div>
                <article>
                  Pasta
                  <p>{item.matterFolder}</p>
                </article>

                <article>
                  Número
                  <p>{item.matterNumber}</p>
                </article>

                <article>
                  Cliente
                  <p>{item.matterCustomerDesc}</p>
                </article>
                <article>
                  Parte Contrario
                  <p>{item.matterOppossingDesc}</p>
                </article>
              </div>
            </ItemContent>
          ))}
        </Content>
      </Grid>
      <Footer>
        <div>
          <button type="button" onClick={() => {handleSelectProcessGrid(keyData)}}>
            Selecionar
          </button>
          <button type="button" onClick={handleClose}>
            Cancelar
          </button>
        </div>
      </Footer>
    </Container>
  );
};

export default GridSelectProcess;
