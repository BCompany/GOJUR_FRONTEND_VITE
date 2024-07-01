/* eslint-disable array-callback-return */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable no-return-assign */
/* eslint-disable radix */

import React, { useState, ChangeEvent } from 'react';
import api from 'services/api';
import { useHistory } from 'react-router-dom';
import { GridSubContainer } from 'Shared/styles/GlobalStyle';
import { Grid, Table, TableHeaderRow } from '@devexpress/dx-react-grid-material-ui';
import { PagingState, SortingState, IntegratedSorting } from '@devexpress/dx-react-grid';
import { languageGridEmpty } from 'Shared/utils/commonConfig';
import { Overlay } from 'Shared/styles/GlobalStyle';
import LoaderWaiting from 'react-spinners/ClipLoader';
import { useToast } from 'context/toast';
import { GrUndo } from 'react-icons/gr';
import { SiMicrosoftexcel } from 'react-icons/si';
import { FiHelpCircle } from 'react-icons/fi';
import { MdNewReleases } from 'react-icons/md';
import { AiOutlineArrowLeft } from 'react-icons/ai';
import { HeaderPage } from 'components/HeaderPage';
import { Container, Content, Form, TaskBar } from './styles';

export interface ISearchCNJDTO {
  cnjNumber: string;
  message: string;
}

const SearchCNJBatch: React.FC = () => {
  const history = useHistory();
  const { addToast } = useToast();
  const [pageSize, setPageSize] = useState(50);
  const [invalidCnjNumberList, setInvalidCnjNumberList] = useState<ISearchCNJDTO[]>([]);
  const [validCount, setValidCount] = useState<number>(0)
  const [currentPage, setCurrentPage] = useState(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const columns = [
    { name: 'cnjNumber', title: 'Número' },
    { name: 'message', title: 'Motivo' }

  ];

  const [tableColumnExtensions] = useState([
    { columnName: 'cnjNumber', width: '60%' },
    { columnName: 'message', width: '40%' },
  ]);


  async function handleUploadFile(document: any) {

    setIsLoading(true)
    if (document === null) return;

    try {


      const tokenApi = localStorage.getItem('@GoJur:token');

      const payload = {
        token: tokenApi,
        filename: (`N,${new Date().getTime().toString()}.csv`)
      }

      const file = new File([document], (`N,${new Date().getTime().toString()}.csv`))

      const documentFile = new FormData()

      documentFile.append('document', file)
      documentFile.append('payload', JSON.stringify(payload))

      const response = await api.post('/Processo/PesquisarCNJEmlote', documentFile)

      addToast({
        title: "Importação Automática",
        type: "success",
        description: `Arquivo processado com sucesso.`
      })

      response.data.map((item) => {

        if (item.validNumber == false) {

          const object = {
            cnjNumber: item.cnjNumber,
            message: item.message
          }

          setInvalidCnjNumberList(previousValues => [...previousValues, object])
        }

        else {
          setValidCount(previousValues => previousValues + 1)
        }

      })

      setIsLoading(false)

    } catch (err: any) {
      setIsLoading(false)
      addToast({
        title: "Operação não Realizada",
        type: "error",
        description: err.response.data.Message
      })
    }
  }

  const onFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      handleUploadFile(file)
      e.target.value = ""
      setInvalidCnjNumberList([])
    }
  };

  return (

    <Container>

      {isLoading && (
        <>
          <Overlay />
          <div className='waitingMessage'>
            <LoaderWaiting size={15} color="var(--blue-twitter)" />
            &nbsp;&nbsp;
            Carregando ...
          </div>
        </>
      )}

      <div style={{ marginLeft: "-2%" }}>
        <HeaderPage />
      </div>

      <TaskBar>

        <div>
          <div>
            <button
              className="buttonLinkClick buttonInclude"
              title="Clique para voltar a tela de processos"
              type="submit"
              onClick={() => history.push('/matter/list')}
            >
              <AiOutlineArrowLeft />
              <span>Retornar</span>

            </button>
          </div>

        </div>

      </TaskBar>


      <Content>

        <header>

          <div>
            Importação de Processos por Número CNJ (em lote)
          </div>

        </header>

        <Form>

          <section>
            <div id="message">
              <MdNewReleases />
              Envie um arquivo .CSV criado em Excel ou Google Sheets com os processos que deseja importar informando apenas o número CNJ de cada processo. O arquivo deve conter um número CNJ de processo por linha, conforme exemplo abaixo.
              <br />
              <br />
              1234567-12.2022.8.26.0001
              <br />
              <br />
              7654321-12.2021.8.26.0001
              <br />

              <br />

              <div>
                <button
                  style={{ fontWeight: "bold", fontSize: "15px" }}
                  className="buttonLinkClick"
                  type='button'
                  onClick={() => window.open("https://gojur.tawk.help/article/importando-processos-em-lote", '_blank')}
                >
                  <FiHelpCircle />
                  Clique aqui para mais informações
                </button>
              </div>

              <br />

              <div className='buttonsAction'>
                <label
                  htmlFor='document'
                  className="buttonClick"
                  title="Clique para selecionar arquivos em seu computador"
                >
                  <SiMicrosoftexcel style={{ color: "white" }} />
                  <span style={{ color: "white" }}>Enviar Arquivo</span>
                  <input
                    id='document'
                    type="file"
                    accept='.csv'
                    style={{ display: 'none' }}
                    onChange={onFileChange}
                  />
                </label>
              </div>

              {validCount > 0 && (
                <>
                  <div style={{ color: "green", fontSize: "15px" }}>
                    Arquivo processado com sucesso. Foram incluídos
                    {"  "}
                    {validCount}
                    {"  "}
                    processos para busca automática, o cadastramento do processo pode levar algumas horas dependendo da disponibilidade dos tribunais.
                  </div>

                  <div className='buttonsAction'>
                    <button
                      style={{ fontSize: "13px" }}
                      className="buttonClick"
                      type='button'
                      onClick={() => history.push('/matter/list')}
                    >
                      <GrUndo style={{ color: "white" }} />
                      Voltar a lista de processos
                    </button>
                  </div>
                </>
              )}

            </div>

          </section>


          {invalidCnjNumberList.length > 0 && (
            <>
              <div className='border'>&nbsp;</div>
              <div style={{ color: "red", fontSize: "15px", textAlign: "center" }}>
                Encontramos algumas divergências com alguns números de CNJ informados no arquivo. Abaixo segue a lista dos registros não processados com seu respectivo motivo.
              </div>

              <div className="flex-box container-box" style={{ marginTop: "2%" }}>
                <div className="content-box">
                  <table>
                    <tr>
                      <th style={{ width: "50%" }}>Número</th>
                      <th style={{ width: "50%" }}>Motivo</th>
                    </tr>
                    {invalidCnjNumberList.map(item => (
                      <tr>
                        <td style={{ width: "50" }}>{item.cnjNumber}</td>
                        <td style={{ width: "50%" }}>{item.message}</td>
                      </tr>
                    ))}
                  </table>
                </div>
              </div>

            </>
          )}
        </Form>

      </Content>


    </Container>


  );
};

export default SearchCNJBatch;
