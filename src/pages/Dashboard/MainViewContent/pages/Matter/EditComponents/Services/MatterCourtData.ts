import api from "services/api"
import { ICourtData, IMatterCourtData, IMatterDemandTypeData } from "../../../Interfaces/IMatter"


export const ListMatterCourt = async(matterId: number) => {
  const token = localStorage.getItem('@GoJur:token')

  const response = await api.get<IMatterCourtData[]>('/ProcessoForum/Listar', {
    params:{matterId, token}
  })

  return response;
}


export const DeleteCourt = async (ids: string) => {
  const token = localStorage.getItem('@GoJur:token')

  await api.delete('/ProcessoForum/Deletar', {
    params:{
      ids,
      token
    }
  })
}


export const SaveCourt = async(data: any) => {
  const token = localStorage.getItem('@GoJur:token')

  await api.post('/ProcessoForum/Salvar', {
    matterCourtJSON: JSON.stringify(data),
    token
  });
}


export const ListCourt = async (term: string) => {
  const token = localStorage.getItem('@GoJur:token')

  const response = await api.get<ICourtData[]>('/Forum/ListarCombo', {
    params:{rows:'50', filterClause: term, token}
  })

  return response;
}


export const ListVara = async (term: string) => {
  const token = localStorage.getItem('@GoJur:token')

  const response = await api.get<IMatterDemandTypeData[]>('/Vara/ListarCombo', {
    params:{rows:'50', filterClause: term, token}
  })

  return response;
}
