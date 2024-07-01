import api from "services/api"
import { IMatterCourtData, IMatterEventTypeData, IMatterFollowListData, ProcessData } from "../../../Interfaces/IMatter"

export const ListMatterFollow = async(matterId: number, page: number, rows: number) => {

  const token = localStorage.getItem('@GoJur:token')
  const companyId = localStorage.getItem('@GoJur:companyId');
  const apiKey = localStorage.getItem('@GoJur:apiKey');

  const response = await api.get<IMatterFollowListData[]>('ProcessoAcompanhamentos/Listar', {
    params:{ matterId, page, rows, token, companyId: Number(companyId), apiKey }
  })

  return response;
}

export const ListFollowByMatter = async (matterId: number) => {

  const token = localStorage.getItem('@GoJur:token')

  const response = await api.get<IMatterCourtData[]>('/ProcessoForum/Listar', {
    params:{
      matterId,
      token
    }
  })

  return response;
}

export const GetDefaults = async (matterId: number, instanceId?: number) => {

  const token = localStorage.getItem('@GoJur:token')

  const response = await api.get('/ProcessoAcompanhamentos/GetDefaults', {
    params:{
      matterId,
      instanceId,
      token
    }
  })

    return response;
}

export const SaveLink = async (matterId: number, url: string) => {

  const token = localStorage.getItem('@GoJur:token')

  const response = await api.post('/Forum/SalvarLink', {
      matterId,
      url,
      token
  })

  return response;
}

export const SelectFollow = async (followId: number) => {

  const token = localStorage.getItem('@GoJur:token')

  const response = await api.get('/ProcessoAcompanhamentos/Editar', {
    params:{
      followId,
      token
    }
  })

    return response;
}

export const ListarCourtLinks = async (page:number, rows: number, filterClause:string) => {

  const token = localStorage.getItem('@GoJur:token')

  const response = await api.get('/Forum/ListarLinks', {
    params:{
      page,
      rows,
      filterClause,
      token
    }
  })

    return response;
}

export const SelecionarProcesso = async (matterId: number) => {

  const token = localStorage.getItem('@GoJur:token')

  const response = await api.post<ProcessData>('/Processo/SelecionarProcesso',{
    matterId,
    token,
    companyId: localStorage.getItem('@GoJur:companyId'),
    apiKey: localStorage.getItem('@GoJur:apiKey')
  })

  return response;

}


export const ListFollowType = async (term: string) => {

  const token = localStorage.getItem('@GoJur:token')

  const response = await api.post<IMatterEventTypeData[]>('/TipoAcompanhamento/ListarCombo', {
    page:1,
    rows:50,
    filterClause: term,
    token
  })

  return response;
}


export const DeleteFollow = async (ids: string) => {

  const token = localStorage.getItem('@GoJur:token')

  await api.delete('ProcessoAcompanhamentos/Deletar', {
    params:{
       ids,
      token
    }
  })
}

export const SaveFollow = async (data) => {

  const token = localStorage.getItem('@GoJur:token')

  // eslint-disable-next-line no-param-reassign
  data.token = token;
  const matterFollowJSON = JSON.stringify(data)

  const response = await api.post('ProcessoAcompanhamentos/Salvar', {
    matterFollowJSON,
    token
  })

  return response.data;
}


