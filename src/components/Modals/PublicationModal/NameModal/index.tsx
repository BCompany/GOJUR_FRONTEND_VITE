/* eslint-disable react/jsx-curly-newline */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable eqeqeq */
/* eslint-disable radix */
/* eslint-disable react/void-dom-elements-no-children */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { ChangeEvent, useCallback, useEffect, useState } from 'react';
import { FiChevronLeft, FiChevronRight, FiEdit, FiSave, FiTrash, FiX } from 'react-icons/fi';
import { usePublication } from 'context/publication';
import { useToast } from 'context/toast';
import { useConfirmBox } from 'context/confirmBox';
import AutoComplete from 'components/AutoComplete';
import api from 'services/api';
import ConfirmBoxModal from 'components/ConfirmBoxModal';
import {Container,Modal,Grid,ProfileTable} from './styles';

interface usernameListProps {
  id: string;
  value: string;
}

interface profileNameProps {
  cod_PublicacaoNome: string;
  cod_PublicacaoNomeUsuarioFiltro: string;
  nom_Pesquisa: string;
}

interface profileNameDto extends profileNameProps {
  update: string;
}

const NameModal: React.FC = () => {
  const { handlePublicationModal, handleSetFilterName } = usePublication();
  const { handleSetFilterChanged } = usePublication();
  const { addToast } = useToast();
  const [nameList, setNameList] = useState<string>('');
  const [nameListId, setNameListId] = useState<string>('');
  const [optionsList, setOptionsList] = useState<usernameListProps[]>([]);
  const [timerAutoComplete, setTimerAutoComplete] = useState<any>(null);
  const [profileList, setProfileList] = useState<profileNameDto[]>([]);
  const [pageNumber, setPageNumber] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [alertMessage, setAlertMessage] = useState(false);
  const [profileMessage, setProfileMessage] = useState(false);
  const [checkMessage, setCheckMessage] = useState(false);
  const {isConfirmMessage, isCancelMessage, handleCancelMessage, handleConfirmMessage } = useConfirmBox();
  
  useEffect(() => {

    LoadProfilesName()
    LoadPublicationNames()

  },[isLoading])

  async function LoadProfilesName() {
    try {
      const tokenapi = localStorage.getItem('@GoJur:token');

      const response = await api.post<profileNameProps[]>(
        '/PublicacaoNome/ListarFiltroNome',
        {
          page: 1,
          rows: 10,
          filterClause: '',
          token: tokenapi,
        },
      );

      const data = response.data.map(i => {
        const dto = {
          cod_PublicacaoNome: i.cod_PublicacaoNome,
          cod_PublicacaoNomeUsuarioFiltro: i.cod_PublicacaoNomeUsuarioFiltro,
          nom_Pesquisa: i.nom_Pesquisa,
          update: 'update',
        };

        return dto;
      });

      setProfileList(data);
    } catch (err) {
      console.log(err);
    }
  }

  async function LoadPublicationNames() {
    
    try {
      const userToken = localStorage.getItem('@GoJur:token');

      const response = await api.post<usernameListProps[]>(
        `/PublicacaoNome/Listar`,
        {
          token: userToken,
        },
      );

      setOptionsList(response.data);
    } catch (err:any) {
      console.log(err.message);
    }
  }

  const handleLoadList = useCallback(() => {
    
    if (timerAutoComplete != null) {
      // if exists timer delay remove from timer to avoid search request
      clearTimeout(timerAutoComplete);
    }

    const delay = 500; // 1 second delay
   
    // set timeout delay for request
    if (nameListId === '') {
      setTimerAutoComplete(
        setTimeout(() => {
          LoadPublicationNames();
        }, delay),
      );
    }


  }, [timerAutoComplete, nameListId]); // Carrega a lista de Advogado

  const handleNameChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const name = event.target.value;
      setProfileMessage(false);
      if (profileList.findIndex(i => i.nom_Pesquisa === name) !== -1) {
        addToast({
          type: 'info',
          title: 'Perfil já existente',
          description:
            'Já existe um perfil criado para o nome selecionado, edite-o para incluir novos e-mails',
        });
        setProfileMessage(true);
      } else {
        setNameList(event.target.value);
        const id = optionsList
          .filter(i => i.value === event.target.value)
          .map(i => i.id)
          .toString();
        setNameListId(id);
      }
    },
    [addToast, optionsList, profileList],
  ); // Seleciona o Advogado

    // when appear confirm box to delete and is clicked on cancel
    useEffect(() => {
    
      if (isCancelMessage){
        setCheckMessage(false)
        handleCancelMessage(false)
      }
  
    }, [isCancelMessage])   
    
     // when appear confirm box to delete and is clicked on confirm
     useEffect(() => {
      
      if (isConfirmMessage){
        handleIncludeOnList()
      }
  
    }, [isConfirmMessage])  

  const handleIncludeOnList = useCallback(() => {

    setCheckMessage(false);
    handleConfirmMessage(false);

    if (!nameListId || !nameList) {
      return;
    }
    
    setNameList('')

    const existentName = profileList.find(item => item.cod_PublicacaoNome == nameListId);
    if (existentName){
      return;
    }

    const item = {
      cod_PublicacaoNome: nameListId,
      cod_PublicacaoNomeUsuarioFiltro: '0',
      nom_Pesquisa: nameList,
      update: 'update',
    };

    setProfileList(oldProfile => [...oldProfile, item]);

    try {
      api.post('/PublicacaoNome/Salvar', {
        publicationNameFilterId: 0,
        publicationNameId: nameListId,
        publicationName: nameList,
        token: localStorage.getItem('@GoJur:token'),
      });

      setAlertMessage(false);
      setTimeout(() => {
        LoadProfiles();
      }, 3000);

    } catch (err) {
      addToast({
        type: 'error',
        title: 'Falha ao Atualizar a lista de perfis',
        description:
          'Não foi possível concluir o processo realizado, tente novamente ',
      });
    }
   
    async function LoadProfiles() {
      try {
        const tokenapi = localStorage.getItem('@GoJur:token');
        const response = await api.post<profileNameProps[]>(
          '/PublicacaoNome/ListarFiltroNome',
          {
            page: 1,
            rows: 10,
            filterClause: '',
            token: tokenapi,
          },
        );

        setNameList('') 

        const data = response.data.map(i => {
          const dto = {
            cod_PublicacaoNome: i.cod_PublicacaoNome,
            cod_PublicacaoNomeUsuarioFiltro: i.cod_PublicacaoNomeUsuarioFiltro,

            nom_Pesquisa: i.nom_Pesquisa,
            update: 'update',
          };

          return dto;
        });

        setProfileList(data);
        
      } catch (err) {
        addToast({
          type: 'error',
          title: 'Falha ao Atualizar a lista de perfis',
          description:
            'Não foi possível concluir o processo realizado, tente novamente ',
        });
      }
    }

  }, [addToast, nameList, nameListId]); // Inclui o profile na list e salva na api

  const handleCheckInclude = useCallback(() => {
    
    if (nameList.length === 0) return;
    
    setCheckMessage(true);

  }, [nameList]);
  
  const handleMinor = useCallback(async () => {
    if (pageNumber <= 1) return;
    try {
      const tokenapi = localStorage.getItem('@GoJur:token');

      const response = await api.post<profileNameProps[]>(
        '/PublicacaoNome/ListarFiltroNome',
        {
          page: pageNumber - 1,
          rows: 10,
          filterClause: '',
          token: tokenapi,
        },
      );

      const data = response.data.map(i => {
        const dto = {
          cod_PublicacaoNome: i.cod_PublicacaoNome,
          cod_PublicacaoNomeUsuarioFiltro: i.cod_PublicacaoNomeUsuarioFiltro,
          nom_Pesquisa: i.nom_Pesquisa,
          update: 'update',
        };

        return dto;
      });
      setProfileList(data);
      setPageNumber(pageNumber - 1);
    } catch (err) {
      console.log(err);
    }
  }, [pageNumber]); // volta uma pagina na listagem

  const handlePlus = useCallback(async () => {
    try {
      const tokenapi = localStorage.getItem('@GoJur:token');

      const response = await api.post<profileNameProps[]>(
        '/PublicacaoNome/ListarFiltroNome',
        {
          page: pageNumber + 1,
          rows: 10,
          filterClause: '',
          token: tokenapi,
        },
      );

      const data = response.data.map(i => {
        const dto = {
          cod_PublicacaoNome: i.cod_PublicacaoNome,
          cod_PublicacaoNomeUsuarioFiltro: i.cod_PublicacaoNomeUsuarioFiltro,
          nom_Pesquisa: i.nom_Pesquisa,
          update: 'update',
        };

        return dto;
      });
      setProfileList(data);
      setPageNumber(pageNumber + 1);
    } catch (err) {
      console.log(err);
    }
  }, [pageNumber]); // avança uma pagina na listagem

  const handleEdit = useCallback(
    key => {
      const update = profileList.map(profile =>
        profile.cod_PublicacaoNomeUsuarioFiltro === key
          ? {
              ...profile,
              update: 'save',
            }
          : profile,
      );
      setProfileList(update);
      const name = profileList
        .filter(i => i.cod_PublicacaoNomeUsuarioFiltro === key)
        .map(i => i.nom_Pesquisa)
        .toString();
      setNameList(name);
    },
    [profileList],
  );

  const handleSave = useCallback(
    key => {
      const deleteItem = profileList.filter(
        item => item.cod_PublicacaoNomeUsuarioFiltro !== key,
      );

      setProfileList(deleteItem);

      const save = profileList.map(dest =>
        dest.cod_PublicacaoNomeUsuarioFiltro === key
          ? {
              ...dest,
              cod_PublicacaoNome: nameListId,
              nom_Pesquisa: nameList,
              update: 'update',
            }
          : dest,
      );
      setProfileList(save);

      async function LoadProfiles() {
        try {
          const tokenapi = localStorage.getItem('@GoJur:token');
          const response = await api.post<profileNameProps[]>(
            '/PublicacaoNome/ListarFiltroNome',
            {
              page: 1,
              rows: 10,
              filterClause: '',
              token: tokenapi,
            },
          );

          const data = response.data.map(i => {
            const dto = {
              cod_PublicacaoNome: i.cod_PublicacaoNome,
              cod_PublicacaoNomeUsuarioFiltro:
                i.cod_PublicacaoNomeUsuarioFiltro,

              nom_Pesquisa: i.nom_Pesquisa,
              update: 'update',
            };

            return dto;
          });
          setProfileList(data);
        } catch (err) {
          addToast({
            type: 'error',
            title: 'Falha ao Atualizar a lista de perfis',
            description:
              'Não foi possível concluir o processo realizado, tente novamente ',
          });
        }
      }

      try {
        const tokenapi = localStorage.getItem('@GoJur:token');
        api.post('/PublicacaoNome/Salvar', {
          publicationNameFilterId: key,
          publicationNameId: nameListId,
          publicationName: nameList,
          token: tokenapi,
        });
        setAlertMessage(false);
        setTimeout(() => {
          LoadProfiles();
        }, 3000);
      } catch (err) {
        addToast({
          type: 'error',
          title: 'Falha ao Atualizar a lista de perfis',
          description:
            'Não foi possível concluir o processo realizado, tente novamente ',
        });
      }
    },
    [addToast, nameList, nameListId, profileList],
  );

  const handleDelete = useCallback(
    key => {
      const deleteItem = profileList.filter(
        item => item.cod_PublicacaoNomeUsuarioFiltro !== key,
      );

      setProfileList(deleteItem);
      async function LoadProfiles() {
        try {
          const tokenapi = localStorage.getItem('@GoJur:token');
          const response = await api.post<profileNameProps[]>(
            '/PublicacaoNome/ListarFiltroNome',
            {
              page: 1,
              rows: 10,
              filterClause: '',
              token: tokenapi,
            },
          );

          const data = response.data.map(i => {
            const dto = {
              cod_PublicacaoNome: i.cod_PublicacaoNome,
              cod_PublicacaoNomeUsuarioFiltro:
                i.cod_PublicacaoNomeUsuarioFiltro,

              nom_Pesquisa: i.nom_Pesquisa,
              update: 'update',
            };

            return dto;
          });
          setProfileList(data);
        } catch (err) {
          addToast({
            type: 'error',
            title: 'Falha ao Atualizar a lista de perfis',
            description:
              'Não foi possível concluir o processo realizado, tente novamente ',
          });
        }
      }
      // chamada a api
      try {
        const tokenapi = localStorage.getItem('@GoJur:token');
        api.post('/PublicacaoNome/Apagar', {
          publicationNameFilterId: key,
          token: tokenapi,
        });
        setTimeout(() => {
          LoadProfiles();
        }, 3000);
      } catch (err) {
        console.log(err);
      }
    },
    [addToast, profileList],
  );

  return (
    <Container>

      { checkMessage && (
        <ConfirmBoxModal
          title="Exclusão do nome de pesquisa"
          message="Esta configuração ira exibir por padrão os nomes selecionados na
          lista de publicações. Deseja Continuar ?"
        />
      )}

      <Modal>
        <header>
          <p>Configuração de nomes de pesquisa de publicação</p>
          <button
            type="button"
            onClick={() => {
              if (profileList.length !== 0) {
                handleSetFilterName('pubNameAll');
              } else {
                handleSetFilterName('filterNameFalse');
              }
              handlePublicationModal('None');
              handleSetFilterChanged(true)
            }}
          >
            <FiX />
          </button>
        </header>
        <div>
          <section>
            <AutoComplete
              label="Nome"
              value={nameList}
              defaultValue={nameList}
              onChange={handleNameChange}
              onKeyUp={handleLoadList}              
              onKeyPress={(e: React.KeyboardEvent) => {
                if (e.key == 'Enter' || e.key == '10') {
                  e.preventDefault();
                }
              }}
              placeholder="Selecione um nome para ser pesquisado"
              list="subject"
            >
              <datalist id="subject">
                <option value=" " />
                {optionsList.map(item => (
                  <option value={item.value} key={item.value} />
                ))}
              </datalist>
            </AutoComplete>

            <button
              type="button"
              onClick={handleCheckInclude}
              style={{ marginLeft: 16 }}
            >
              Incluir
            </button>
          </section>
          {alertMessage ? (
            <p style={{ fontSize: 12, flex: 1, textAlign: 'center' }}>
              Para inserir multiplos emails, separe-os por ";"
            </p>
          ) : null}
          {profileMessage ? (
            <p style={{ fontSize: 12, flex: 1, textAlign: 'center' }}>
              Selecione outro nome para incluir , ou , edite o perfil do nome
              selecionado
            </p>
          ) : null}
          <Grid>
            <header>
              <p>Perfis Publicação Email</p>
              {profileList.length < 10 ? (
                <></>
              ) : (
                <div>
                  {pageNumber > 1 ? (
                    <button type="button" onClick={handleMinor}>
                      <FiChevronLeft />
                    </button>
                  ) : null}

                  {pageNumber}
                  <button type="button" onClick={handlePlus}>
                    <FiChevronRight />
                  </button>
                </div>
              )}
            </header>

            <ProfileTable>
              <table>
                <thead>
                  <th>Nome</th>
                  <th>Editar / Salvar</th>
                  <th>Deletar</th>
                </thead>

                <tbody>
                  {profileList.map(item => (
                    <tr key={item.cod_PublicacaoNome}>
                      <td>
                        <>{item.nom_Pesquisa.replaceAll(';', ' - ')}</>
                      </td>
                      <td>
                        {item.update === 'update' ? (
                          <button
                            type="button"
                            title="Editar"
                            onClick={() =>
                              handleEdit(item.cod_PublicacaoNomeUsuarioFiltro)
                            }
                          >
                            <FiEdit />
                          </button>
                        ) : (
                          <button
                            type="button"
                            title="Salvar"
                            onClick={() =>
                              handleSave(item.cod_PublicacaoNomeUsuarioFiltro)
                            }
                          >
                            <FiSave />
                          </button>
                        )}
                      </td>
                      <td>
                        <button
                          type="button"
                          onClick={() =>
                            // eslint-disable-next-line prettier/prettier
                            handleDelete(item.cod_PublicacaoNomeUsuarioFiltro)}
                        >
                          <FiTrash />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </ProfileTable>
          </Grid>
        </div>
      </Modal>
    </Container>
  );
};

export default NameModal;
