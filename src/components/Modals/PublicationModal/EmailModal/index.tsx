/* eslint-disable react/jsx-curly-newline */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable eqeqeq */
/* eslint-disable react/void-dom-elements-no-children */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { ChangeEvent, useCallback, useEffect, useState } from 'react';
import {
  FiChevronLeft,
  FiChevronRight,
  FiEdit,
  FiSave,
  FiTrash,
  FiX,
} from 'react-icons/fi';
import { usePublication } from 'context/publication';
import { useToast } from 'context/toast';
import { format } from 'date-fns';

import AutoComplete from 'components/AutoComplete';
import api from 'services/api';
import { Container, Modal, Grid, Footer, ProfileTable, Multi } from './styles';

interface usernameListProps {
  id: string;
  value: string;
}
interface optionsProps {
  value: string;
  label: string;
}

interface destinationProps {
  cod_PublicacaoEmailPerfil: number;
  des_EmailDestinatario: string;
  dta_Inclusao: any;
  nom_Pesquisa: string;
  cod_PublicacaoNomeList: string;
}
interface destinationDto extends destinationProps {
  update: string;
}

interface selectedNamesProps {
  label: string;
  value: string;
}

const EmailModal: React.FC = () => {
  const { handlePublicationModal } = usePublication();
  const { addToast } = useToast();
  const [nameList, setNameList] = useState<string>('');
  const [nameListId, setNameListId] = useState<string>('');
  const [listOption, setListOption] = useState<optionsProps[]>([]);
  const [selectUsername, setSelectUsername] = useState<selectedNamesProps[]>([]);
  const [timerAutoComplete, setTimerAutoComplete] = useState<any>(null);
  const [destinationList, setDestinationList] = useState<destinationDto[]>([]);
  const [emailValue, setEmailValue] = useState<string>('');
  const [emailValueAlt, setEmailValueAlt] = useState<string>('');
  const [nameValueAlt, setNameValueAlt] = useState<string>('');
  const [pageNumber, setPageNumber] = useState(1);
  const [profileMessage, setProfileMessage] = useState(false);
  const [currentEditKey, setCurrentEditKey] = useState(0);

  // Load profiles List
  async function LoadProfiles() {
    try {
      const tokenapi = localStorage.getItem('@GoJur:token');

      const response = await api.post<destinationProps[]>(
        '/PublicacaoEmailPerfil/Listar',
        {
          page: 1,
          rows: 20,
          token: tokenapi,
        },
      );

      const newData = response.data.map(profile => {
        const dto = {
          cod_PublicacaoEmailPerfil: profile.cod_PublicacaoEmailPerfil,
          des_EmailDestinatario: profile.des_EmailDestinatario,
          dta_Inclusao: profile.dta_Inclusao,
          nom_Pesquisa: profile.nom_Pesquisa,
          cod_PublicacaoNomeList: profile.cod_PublicacaoNomeList,      
          update: 'update',
        };

        return dto;
      });

      setDestinationList(newData);

    } catch (err) {
      addToast({
        type: 'error',
        title: 'Falha ao Atualizar a lista de perfis',
        description:
          'Não foi possível concluir o processo realizado, tente novamente ',
      });
    }
  }

  // Load Names List
  async function LoadPublicationNames() {

    try {
      const userToken = localStorage.getItem('@GoJur:token');

      const response = await api.post<usernameListProps[]>(`/PublicacaoNome/Listar`,{ token: userToken });

      const data = response.data.map(item => {
        const newdata = {
          label: item.value,
          value: item.id,
        };

        return newdata;
      });

      setListOption(data);
    } catch (err:any) {
      console.log(err.message);
    }
  }

  // Call load profiles first open
  useEffect(() => {    
    LoadProfiles()        
    LoadPublicationNames()
  }, []);
   
  
  const handleIncludeOnList = useCallback(async () => {
    
    const name = selectUsername.map(i => i.label).toString();
    const id = selectUsername.map(i => i.value).join(';');

    setNameList(name);
    setNameListId(id);
   
    // call validate function format adress and names
    if (!ValidateEmailAddress(name, emailValue)){ 
      return 
    }
 
    try {
      const tokenapi = localStorage.getItem('@GoJur:token');

      await api.post('/PublicacaoEmailPerfil/Salvar', {
        publicationEmailProfileId: currentEditKey > 0? currentEditKey: 0,
        publicationNamesId: id,
        emailsDestination: `${emailValue};`,
        token: tokenapi,
      });      
    
      const item = {
        cod_PublicacaoEmailPerfil: 0,
        des_EmailDestinatario: emailValue,
        dta_Inclusao: Date.now(),
        nom_Pesquisa: name,
        cod_PublicacaoNomeList: nameListId,        
        update: 'update',
      };

      if (currentEditKey === 0){
        setDestinationList(oldDestination => [...oldDestination, item]);
      }
      else{
        
        // update current item
        const updateList = destinationList.map(dest =>
          dest.cod_PublicacaoEmailPerfil === currentEditKey
          ? {
          ...item,
          cod_PublicacaoEmailPerfil : currentEditKey
          }
          : dest,
        );

        setDestinationList(updateList)
        setCurrentEditKey(0)
      }

      addToast({
        type: 'success',
        title: 'Operação realizada com successo',
        description:'O novo perfil para recebimento de publicações por email foi configurado com sucesso',
      });

      setSelectUsername([])
      setEmailValue("")
      LoadProfiles();

    } catch (err) {
      addToast({
        type: 'error',
        title: 'Falha ao Atualizar a lista de perfis',
        description:
          'Não foi possível concluir o processo realizado, tente novamente ',
      });
    }
  }, [emailValue, selectUsername]); // Inclui o profile na list e salva na api - revisar
   
  // const handleMinor = useCallback(async () => {
  //   if (pageNumber <= 1) return;
  //   setPageNumber(pageNumber - 1);

  //   try {
  //     const tokenapi = localStorage.getItem('@GoJur:token');

  //     const response = await api.post('/PublicacaoEmailPerfil/Listar', {
  //       page: pageNumber,
  //       rows: 10,
  //       token: tokenapi,
  //     });
  //     setDestinationList(response.data);
  //   } catch (err) {
  //     console.log(err);
  //   }
  // }, [pageNumber]); // volta uma pagina na listagem

  // const handlePlus = useCallback(async () => {
  //   setPageNumber(pageNumber + 1);

  //   try {
  //     const tokenapi = localStorage.getItem('@GoJur:token');

  //     const response = await api.post('/PublicacaoEmailPerfil/Listar', {
  //       page: pageNumber,
  //       rows: 10,
  //       token: tokenapi,
  //     });
  //     setDestinationList(response.data);
  //   } catch (err) {
  //     console.log(err);
  //   }
  // }, [pageNumber]); // avança uma pagina na listagem

  
  const handleEdit = (key:number) => {

    const itemSelected = destinationList.find(item => item.cod_PublicacaoEmailPerfil == key)

    if (itemSelected)
    {
      // flag current item as update line
      const update = destinationList.map(dest =>
        dest.cod_PublicacaoEmailPerfil === key
        ? { ...dest, update: 'save',
        } : dest );

      setDestinationList(update);
      setEmailValue(itemSelected.des_EmailDestinatario)
      
      const idsListName = itemSelected.cod_PublicacaoNomeList.split(';')
      const arrayList = Array(...[])

      // create new select props index names for edition
      idsListName.map( (idName, index) => {
        const pubNames = itemSelected.nom_Pesquisa.split(';')
        arrayList.push({
            label: pubNames[index],
            value: idName            
        })

        return arrayList;
      })

      setCurrentEditKey(key)
      setSelectUsername(arrayList)      
    }
  }

  const handleSave = (key:number) => {

    const itemSelected = destinationList.find(item => item.cod_PublicacaoEmailPerfil == key)

    if (itemSelected){
      setEmailValue(itemSelected.des_EmailDestinatario)
      
    }

  }

  // const handleEdit = useCallback(
  //   key => {
  //     const update = destinationList.map(dest =>
  //       dest.cod_PublicacaoEmailPerfil === key
  //         ? {
  //             ...dest,
  //             update: 'save',
  //           }
  //         : dest,
  //     );

  //     setDestinationList(update);

  //     const email = destinationList
  //       .filter(i => i.cod_PublicacaoEmailPerfil === key)
  //       .map(i => i.des_EmailDestinatario)
  //       .toString();

  //     const name = destinationList
  //       .filter(i => i.cod_PublicacaoEmailPerfil === key)
  //       .map(i => i.nom_Pesquisa)
  //       .toString();

  //       setNameValueAlt(name);
  //     setEmailValueAlt(email);
  //   },
  //   [destinationList],
  // ); // função que edita o item selecionado - revisar

  // const handleSave = useCallback(
  //   key => {
  //     const save = destinationList.map(dest =>
  //       dest.cod_PublicacaoEmailPerfil === key
  //         ? {
  //             ...dest,
  //             des_EmailDestinatario: emailValueAlt,
  //             update: 'update',
  //           }
  //         : dest,
  //     );

  //     setDestinationList(save);

  //     async function LoadProfiles() {
  //       try {
  //         const tokenapi = localStorage.getItem('@GoJur:token');

  //         const response = await api.post<destinationProps[]>(
  //           '/PublicacaoEmailPerfil/Listar',
  //           {
  //             page: 1,
  //             rows: 10,
  //             token: tokenapi,
  //           },
  //         );

  //         const newData = response.data.map(profile => {
  //           const dto = {
  //             cod_PublicacaoEmailPerfil: profile.cod_PublicacaoEmailPerfil,
  //             des_EmailDestinatario: profile.des_EmailDestinatario,
  //             dta_Inclusao: profile.dta_Inclusao,
  //             nom_Pesquisa: profile.nom_Pesquisa,
  //             cod_PublicacaoNomeList: profile.cod_PublicacaoNomeList,
  //             update: 'update',
  //           };

  //           return dto;
  //         });

  //         setDestinationList(newData);
  //       } catch (err) {
  //         addToast({
  //           type: 'error',
  //           title: 'Falha ao Atualizar a lista de perfis',
  //           description:
  //             'Não foi possível concluir o processo realizado, tente novamente ',
  //         });
  //       }
  //     }

  //     const payload = destinationList.filter(
  //       i => i.cod_PublicacaoEmailPerfil === key,
  //     );

  //     try {
  //       const tokenapi = localStorage.getItem('@GoJur:token');

  //       api.post('/PublicacaoEmailPerfil/Salvar', {
  //         publicationEmailProfileId: payload
  //           .map(i => i.cod_PublicacaoEmailPerfil)
  //           .toString(),
  //         publicationNamesId: payload
  //           .map(i => i.cod_PublicacaoNomeList)
  //           .toString(),
  //         emailsDestination: `${emailValueAlt};`,
  //         token: tokenapi,
  //       });

  //       setTimeout(() => {
  //         LoadProfiles();
  //       }, 3000);
  //     } catch (err) {
  //       console.log(err);
  //     }
  //   },
  //   [addToast, destinationList, emailValueAlt],
  // ); // -revisar

  const handleDelete = useCallback(
    async key => {
      const deleteItem = destinationList.filter(
        item => item.cod_PublicacaoEmailPerfil !== key,
      );
      
      try {
        const tokenapi = localStorage.getItem('@GoJur:token');

        await api.post('/PublicacaoEmailPerfil/Apagar', {
          publicationEmailProfileId: key,
          token: tokenapi,
        });
        
        setDestinationList(deleteItem);

      } catch (err) {
        console.log(err);
      }
    },
    [destinationList],
  ); // -revisar

  // Validate inclusion for save
  const ValidateEmailAddress = (name:string, emailValue: string) => {

    let errorList = "";

    if (!name && !emailValue){
      errorList += " Nome de pesquisa e endereço de email não informado "
    }
    else if (!name){
      errorList += " Nome de pesquisa não informado "
    }
    else if (!emailValue) {
      errorList += " Endereço de email não informado "
    }

    // verify if exists (,) in all emails input
    const emailsAddress = emailValue.includes(',')  
    if (emailsAddress){
        errorList += " Não é permitido usar virgula como separador de emails, utilize como opção o ponto virgula (;) \n"
    }

    const emails = emailValue.split(';')
    let hasErrorFormatError = false;
    
    // verify if exists some format error like email without @ charecter
    emails.map(item => {
      if (!hasErrorFormatError) {
        if ((!item.includes('@') || !item.includes('.')) && item != ""){
            hasErrorFormatError = true;
        }
      }
      return;
    })

    // if exists invalid formatcls shows error
    if (hasErrorFormatError){
      errorList += " O formato do endereço de email digitado é inválido \n"
    }

    if (errorList.length > 0){
      addToast({
        type: 'info',
        title: 'Não foi possível completar a operação',
        description: errorList
      });

      return false;
    }

    return true;
  }  

  return (
    <Container>
      <Modal>
        <header>
          <p>Perfil de envio de e-mails - publicação</p>
          <button type="button" onClick={() => handlePublicationModal('None')}>
            <FiX />
          </button>
        </header>
        <div>
          <section>
            <Multi
              options={listOption}
              value={selectUsername}
              onChange={setSelectUsername}
              labelledBy="Selecione"
              selectAllLabel="Selecione"
              disableSearch
              ClearIcon
              overrideStrings={{
                selectSomeItems: 'Selecionar um nome pesquisado',
              }}
            />
            <input
              type="email"
              name="email"
              id="email"
              placeholder="Endereço de email - para mais de um separe-os por ;"
              value={emailValue}
              onChange={(event: ChangeEvent<HTMLInputElement>) => {
                setEmailValue(event.target.value);
              }}
            />
          </section>
          
          <section>

            <button type="button" onClick={handleIncludeOnList}>
              Salvar Perfil
            </button>
            
            <p>
              Para inserir multiplos emails, separe-os por ";" (ponto e vírgula)
            </p>
          
          </section>
          
          {profileMessage ? (
            <p style={{ fontSize: 12, flex: 1, textAlign: 'center' }}>
              Selecione outro nome para incluir , ou , edite o perfil do nome
              selecionado
            </p>
          ) : null}
          <Grid>
            {/* <header>
              <p>Perfis Publicação Email</p>
              {destinationList.length < 10 ? (
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
            </header> */}
            
            <ProfileTable>
              <table style={{pointerEvents: (currentEditKey > 0 ? 'none': 'all')}}>
                <thead>
                  <th>Nome</th>
                  <th>Email</th>
                  <th>Inclusão</th>
                  <th>Editar</th>
                  <th>Excluir</th>
                </thead>

                <tbody>
                  {destinationList.map(item => (
                    <tr style={{opacity: (item.update === 'save'? 0.4: 1)}}>
                      <td>
                        <>{item.nom_Pesquisa.replaceAll(';', ' - ')}</>
                      </td>
                      
                      <td className="wrap">
                        {item.des_EmailDestinatario.replaceAll(',', ';')}
                      </td>
                      
                      <td>
                        {format(new Date(item.dta_Inclusao), 'dd/MM/yyyy')}
                      </td>

                      <td>
                        <button
                          type="button"
                          title="Editar"
                          onClick={() => handleEdit(item.cod_PublicacaoEmailPerfil)}
                        >
                          <FiEdit />
                        </button>
                      </td>

                      <td>
                        <button
                          type="button"
                          onClick={() =>
                            handleDelete(item.cod_PublicacaoEmailPerfil)}
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

export default EmailModal;
