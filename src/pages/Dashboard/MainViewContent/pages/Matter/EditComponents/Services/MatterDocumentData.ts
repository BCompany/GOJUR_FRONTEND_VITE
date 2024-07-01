import api from "services/api"
import { IMatterDocumentData, IMatterDocumentType } from "../../../Interfaces/IMatter"


export const ListMatterDocuments = async (matterId: number) => {

  const token = localStorage.getItem('@GoJur:token')

  const response = await api.get<IMatterDocumentData[]>('ProcessoDocumento/Listar', {
    params: {
      matterId,
      token
    }
  })

  return response;
}

export const ListDocumentType = async (term: string) => {

  const token = localStorage.getItem('@GoJur:token')

  const response = await api.get<IMatterDocumentType[]>('TipoDocumento/ListarMatterDocumentType', {
    params: {
      term,
      token
    }
  })

  return response;
}

export const DeleteDocument = async (ids: string) => {

  const token = localStorage.getItem('@GoJur:token')

  await api.delete('/ProcessoDocumento/Deletar', {
    params:{
      ids,
      token
    }
  })
}

export const SaveDocument = async (data: IMatterDocumentData) => {

  const token = localStorage.getItem('@GoJur:token')

  // eslint-disable-next-line no-param-reassign
  if (token && data) data.token = token;

  await api.post('/ProcessoDocumento/Salvar', data)
}
