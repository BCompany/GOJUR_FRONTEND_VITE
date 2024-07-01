/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable no-console */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable no-return-assign */
/* eslint-disable no-alert */
/* eslint-disable react/jsx-one-expression-per-line */

import React, { useCallback, useEffect, useState, UIEvent, ChangeEvent, useRef } from 'react';
import api from 'services/api';
import { format } from 'date-fns';
import LoaderWaiting from 'react-spinners/ClipLoader';
import { FiSave, FiEdit, FiTrash } from 'react-icons/fi';
import { FcAbout } from 'react-icons/fc';
import { Grid, Table, TableHeaderRow } from '@devexpress/dx-react-grid-material-ui';
import { languageGridEmpty } from 'Shared/utils/commonConfig';
import { useToast } from 'context/toast';
import { OverlayPublicationConfiguration } from '../Configuration/styles';
import { Content, Multi, GridProfileNames } from './styles';

interface usernameListProps {id: string; value: string}
interface optionsProps {value: string;label: string}
interface selectedNamesProps {label: string; value: string}
interface destinationProps {cod_PublicacaoEmailPerfil: number; des_EmailDestinatario: string; dta_Inclusao: any; nom_Pesquisa: string; cod_PublicacaoNomeList: string; flg_NotificacaoRobo: string}

const PublicationEmail = () => {
  const { addToast } = useToast();
  const token = localStorage.getItem('@GoJur:token');
  const [listOption, setListOption] = useState<optionsProps[]>([]);
  const [selectUsername, setSelectUsername] = useState<selectedNamesProps[]>([]);
  const [destinationList, setDestinationList] = useState<destinationProps[]>([]);
  const [emailValue, setEmailValue] = useState<string>('');
  const [flgIncludeNotification, setFlgIncludeNotification] = useState<boolean>(false);
  const [currentEditKey, setCurrentEditKey] = useState(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const columns = [
    {name: 'name', title: 'Nome'},
    {name: 'email', title: 'E-Mail'},
    {name: 'include', title: 'Inclusão'},
    {name: 'edit',title: 'Editar'},
    {name: 'remove',title: 'Apagar'}
  ]

  const [tableColumnExtensions] = useState([
    {columnName: 'name', width: '35%'},
    {columnName: 'email', width: '35%'},
    {columnName: 'include', width: '12%'},
    {columnName: 'edit', width: '8%'},
    {columnName: 'remove', width: '10%'}
  ])


  useEffect(() => {
    LoadPublicationNames()
    LoadProfiles()
  }, [])


  const LoadPublicationNames = async () => {
    try {

      const response = await api.post<usernameListProps[]>(`/PublicacaoNome/Listar`, {token})

      const data = response.data.map(item => {
        const newdata = {label: item.value, value: item.id}
        return newdata
      })

      setListOption(data)
    } catch (err:any) {
      console.log(err.message)
    }
  }


  const LoadProfiles = async () => {
    try {

      const response = await api.post<destinationProps[]>('/PublicacaoEmailPerfil/Listar',
        {page: 1, rows: 20, token}
      )

      setDestinationList(response.data)

    } catch (err) {
      addToast({type: 'error', title: 'Falha ao Atualizar a lista de perfis', description:'Não foi possível concluir o processo realizado, tente novamente '})
    }
  }


  const CustomCell = (props) => {
    const { column } = props

    if (column.name === 'name') {
      return (
        <Table.Cell onClick={(e) => console.log(e)} {...props}>
          <div title={props.row.nom_Pesquisa} style={{fontSize:'12px'}}>
            {props.row.nom_Pesquisa}
          </div>
        </Table.Cell>
      )
    }

    if (column.name === 'email') {
      return (
        <Table.Cell onClick={(e) => console.log(e)} {...props}>
          <div title={props.row.des_EmailDestinatario} style={{fontSize:'12px'}}>
            {props.row.des_EmailDestinatario}
          </div>
        </Table.Cell>
      )
    }

    if (column.name === 'include') {
      return (
        <Table.Cell onClick={(e) => console.log(e)} {...props}>
          <div title={format(new Date(props.row.dta_Inclusao), 'dd/MM/yyyy')} style={{fontSize:'12px'}}>
            {format(new Date(props.row.dta_Inclusao), 'dd/MM/yyyy')}
          </div>
        </Table.Cell>
      )
    }

    if (column.name === 'edit') {
      return (
        <Table.Cell onClick={(e) => Edit(props.row.cod_PublicacaoEmailPerfil)} {...props}>
          <FiEdit title="Clique para editar" />
        </Table.Cell>
      )
    }

    if (column.name === 'remove') {
      return (
        <Table.Cell onClick={(e) => Delete(props.row.cod_PublicacaoEmailPerfil)} {...props}>
          &nbsp;
          <FiTrash title="Clique para remover" />
        </Table.Cell>
      )
    }

    return <Table.Cell {...props} />
  }


  const Edit = async (id) => {
    try
    {
      const itemSelected = destinationList.find(item => item.cod_PublicacaoEmailPerfil == id)

      if (itemSelected)
      {
        // flag current item as update line
        const update = destinationList.map(dest => dest.cod_PublicacaoEmailPerfil === id ? { ...dest, update: 'save' } : dest )
  
        setDestinationList(update)
        setEmailValue(itemSelected.des_EmailDestinatario)
        setFlgIncludeNotification(itemSelected.flg_NotificacaoRobo == 'S')
        
        const idsListName = itemSelected.cod_PublicacaoNomeList.split(';')
        const arrayList = Array(...[])
  
        // create new select props index names for edition
        idsListName.map( (idName, index) => {
          const pubNames = itemSelected.nom_Pesquisa.split(';')
          arrayList.push({ label: pubNames[index], value: idName })
          return arrayList;
        })
  
        setCurrentEditKey(id)
        setSelectUsername(arrayList)      
      }
    }
    catch (err:any)
    {
      setIsLoading(false)
      addToast({type: "error", title: "Operação não realizada", description: err.response.data.Message})
    }
  }


  const Delete = async (item) => {
    try
    {
      setIsLoading(true)
      await api.post('/PublicacaoEmailPerfil/Apagar', {publicationEmailProfileId: item, token})
      LoadProfiles()
      addToast({ type: "success", title: "Operação realizada com sucesso", description: "Perfil de e-mail removido" })
      setIsLoading(false)
    }
    catch (err:any)
    {
      setIsLoading(false)
      addToast({type: "error", title: "Operação não realizada", description: err.response.data.Message})
    }
  }


  const Save = useCallback(async () => {
    try
    {
      if(emailValue == ''){
        addToast({type: "info", title: "Operação não realizada", description: 'Favor informar um e-mail para salvar'})
        return
      }

      const id = selectUsername.map(i => i.value).join(';')

      if(id == ''){
        addToast({type: "info", title: "Operação não realizada", description: 'Favor selecionar um nome para salvar'})
        return
      }

      setIsLoading(true)

      await api.post('/PublicacaoEmailPerfil/Salvar', {
        publicationEmailProfileId: currentEditKey > 0 ? currentEditKey: 0,
        publicationNamesId: id,
        notifyRobot: flgIncludeNotification ? 'S' : 'N',
        emailsDestination: `${emailValue};`,
        token
      })

      LoadProfiles()
      ResetValues()
      addToast({ type: "success", title: "Operação realizada com sucesso", description: "Perfil de e-mail criado com sucesso" })
    }
    catch (err:any)
    {
      ResetValues()
      addToast({type: "error", title: "Operação não realizada", description: err.response.data.Message})
    }
  }, [currentEditKey, emailValue, selectUsername, flgIncludeNotification])


  const ResetValues = () => {
    setCurrentEditKey(0)
    setEmailValue('')
    setSelectUsername([])
    setFlgIncludeNotification(false)
    setIsLoading(false)
  }


  return (
    <>
      <Content id='Content'>
        <div id='BoxName' className='box'>
          <div className='boxText'>Perfil de envio de e-mails</div>
          <div>Esta configuração irá enviar o conteúdo das publicações dos respectivos advogados para os e-mail cadastrados diariamente.<br /> Se desejar marque a opção notificação do tribunal para que elas também sejam incluídas no e-mail.<br /><br /></div>

          <div id='Elements' style={{width:'100%', height:'60px', marginLeft:'2%'}}>
            <div style={{width:'28%', height:'50px', float:'left'}}>
              <Multi
                options={listOption}
                value={selectUsername}
                onChange={setSelectUsername}
                labelledBy="Selecione"
                selectAllLabel="Selecione"
                disableSearch
                ClearIcon
                overrideStrings={{selectSomeItems: 'Selecionar um nome pesquisado', allItemsAreSelected: "Todos os nomes selecionados"}}
              />
            </div>

            <div style={{width:'28%', height:'50px', float:'left', marginLeft:'15px'}}>
              <input
                style={{height:'39px', backgroundColor:'white', width:'100%', border:'solid 1px', borderRadius:'4px'}}
                type="email"
                name="email"
                id="email"
                title=" Endereço de email - acima de um separe por ;"
                placeholder=" Endereço de email - acima de um separe por ;"
                value={emailValue}
                onChange={(event: ChangeEvent<HTMLInputElement>) => {setEmailValue(event.target.value)}}
              />
            </div>

            <div style={{width:'26%', height:'50px', float:'left', marginLeft:'20px'}}>
              <div style={{float:'left', marginTop:'10px'}}>
                <input
                  type="checkbox"
                  name="select"
                  checked={flgIncludeNotification}
                  onChange={() => setFlgIncludeNotification(!flgIncludeNotification)}
                  style={{width:'15px', height:'15px'}}
                  title="Ao marcar a opção, também serão enviados no e-mail o conteúdo dos andamentos capturados nos sites dos tribunais"
                />
              </div>
              <div style={{float:'left', marginLeft:'10px'}} title="Ao marcar a opção, também serão enviados no e-mail o conteúdo dos andamentos capturados nos sites dos tribunais">
                Incluir Acompanhamentos <br />Site Tribunal
                <FcAbout style={{height:'15px', width:'15px', marginLeft:'10px'}} title="Ao marcar a opção, também serão enviados no e-mail o conteúdo dos andamentos capturados nos sites dos tribunais" />
              </div>
            </div>

            <div style={{width:'10%', height:'50px', float:'left', marginLeft:'15px'}}>
              <button type="submit" className="buttonClick" title="Clique para salvar o perfil de envio de e-mail" style={{marginTop:'2px', width:'90%'}} onClick={() => Save()}>
                <FiSave />
                Salvar
              </button>
            </div>
          </div>

          <GridProfileNames id='GridProfileNames'>
            <Grid rows={destinationList} columns={columns}>
              <Table
                cellComponent={CustomCell}
                columnExtensions={tableColumnExtensions}            
                messages={languageGridEmpty}
              />
              <TableHeaderRow />
            </Grid>
          </GridProfileNames>

          <br /><br /><br /><br /><br />
        </div>
      </Content>

      {isLoading && (
        <>
          <OverlayPublicationConfiguration />
          <div className='waitingMessage'>
            <LoaderWaiting size={15} color="var(--blue-twitter)" />
            Aguarde...
          </div>
        </>
      )}
    </>
  )

}    

export default PublicationEmail;