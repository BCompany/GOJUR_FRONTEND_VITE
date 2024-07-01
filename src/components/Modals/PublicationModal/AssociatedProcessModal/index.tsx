/* eslint-disable eqeqeq */
/* eslint-disable radix */
/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useCallback, useState, useEffect, ChangeEvent, useRef} from 'react';
import { FiChevronLeft, FiChevronRight, FiFolder } from 'react-icons/fi';
import HeaderComponent from 'components/HeaderComponent';
import Search from 'components/Search';
import Loader from 'react-spinners/PulseLoader';
import LoaderWaiting from 'react-spinners/ClipLoader';
import api from 'services/api';
import { useToast } from 'context/toast';
import { usePublication } from 'context/publication';
import { Overlay } from 'Shared/styles/GlobalStyle';
import {Container,GridSearch,Grid,Content,Footer,ItemContent} from './styles';

interface ProcessData {
  matterId: number;
  matterCustomerDesc: string;
  matterOppossingDesc: string;
  matterFolder: string;
  matterNumber: string;
}

const AssociatedProcessModal: React.FC = () => {
  const inputRef = useRef<HTMLInputElement>(null);
  const { addToast } = useToast();
  const { handlePublicationModal, handleMatterAssociated, handleReload } = usePublication();
  const [processData, setProcessData] = useState<ProcessData[]>([]);
  const [idsMatterSelected, setIdsMatterSelected] = useState<Array<Number>>([])
  const [processPage, setProcessPage] = useState<number>(1);
  const [processTerm, setProcessTerm] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false)
  const [timerAutoComplete, setTimerAutoComplete] = useState<any>(null); // useState for keep timer delay	//HOOK QUE ARMAZENA O SETTIMEOUT
  const token = localStorage.getItem('@GoJur:token');
  const companyId = localStorage.getItem('@GoJur:companyId');
  const apiKey = localStorage.getItem('@GoJur:apiKey');

  useEffect(() => {
    async function handleProcess() {
      try {
        const userToken = localStorage.getItem('@GoJur:token');
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
      catch (err:any ) {
        console.log(err.message);
      }
    }

    handleProcess();
  }, [processPage]); // Carregamento de dados processos

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

  // save all matter in a list useState
  const handleSelected = useCallback( (event, id) =>
  {
      // when is checked save in a list
      if (event.target.checked){
        idsMatterSelected.push(id);
      }
      else{
          // when is checkout remove from list
          for(let i = 0; i < idsMatterSelected.length; i++){
            if ( idsMatterSelected[i] === id) {
              idsMatterSelected.splice(i, 1);
            }
          }
      }
    },
    [idsMatterSelected],
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
          const userToken = localStorage.getItem('@GoJur:token');
          setIsLoading(true)

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
        } catch (err:any) {
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
      }, delay),
    );
  }, [timerAutoComplete, processTerm, processPage, addToast]);

  const handleAssociatedProcess = useCallback(async () => {
    try {
      const userToken = localStorage.getItem('@GoJur:token');
      const idPublication = localStorage.getItem('@GoJur:PublicationId');

      if (idsMatterSelected.length > 1){
        addToast({
          type: 'info',
          title: 'Atenção',
          description: 'Selecione apenas um processo para a associação',
        });

        return;
      }

      if (idsMatterSelected.length == 0){
        addToast({
          type: 'info',
          title: 'Atenção',
          description: 'Nenhum processo foi selecionados para a associação',
        });

        return;
      }

      setIsLoading(true)

      const keyIdPublication = idsMatterSelected[0];

      await api.post(`/Publicacao/AssociarPublicacaoProcesso`, {
        publicationId: idPublication,
        matterId: keyIdPublication,
        token: userToken,
      });

      // flag handle matter associated to reload screen
      handleMatterAssociated(true);
      // save log association
      await CreateLog();

      handleReload(true)
      
      // set publication modal as none defined
      handlePublicationModal('None');

      addToast({
        type: 'success',
        title: 'Processo Associado',
        description: 'O processo associado a publicação com sucesso',
      });

      setIsLoading(false)

    } catch (err:any) {
      console.log(err.message);
      setIsLoading(false)
    }
  }, [handlePublicationModal]);

  const CreateLog = async () => {

    const publicationItemId = localStorage.getItem('@GoJur:PublicationId');

      await api.post(`/Publicacao/SalvarLog`, {
        publicationId: publicationItemId,
        logAction: "REC_ASSOCIATE",
        token
      });
  }

  return (

    <>

      <Container>
        <HeaderComponent title="Selecione Processo" cursor />
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
              if (e.key == 'Delete' || e.key == 'Backspace') {
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
                      id={item.matterId.toString()}
                      ref={inputRef}
                      title="Selecionar"
                      onChange={(event) => {
                        handleSelected(event, item.matterId);
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
            <button type="button" onClick={handleAssociatedProcess}>
              Associar
            </button>
            <button
              type="button"
              onClick={() => {
                localStorage.removeItem('@GoJur:PublicationId');
                handlePublicationModal('None');
              }}
            >
              Cancelar
            </button>
          </div>
        </Footer>

      </Container>

      {isLoading && (
        <>
          <Overlay />
          <div className='waitingMessage'>
            <LoaderWaiting size={15} color="var(--blue-twitter)" />
            &nbsp;&nbsp; Aguarde...
          </div>
        </>
      )}

    </>
  );
};

export default AssociatedProcessModal;
