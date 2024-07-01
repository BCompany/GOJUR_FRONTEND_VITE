import api from "services/api"
import { IMatterDemandTypeData, IMatterOrderData } from "../../../Interfaces/IMatter"


export const ListMatterOrder = async (matterId: number) => {
  const token = localStorage.getItem('@GoJur:token')

  const response = await api.get<IMatterOrderData[]>('ProcessoPedido/Listar', {
    params: {matterId, token}
  })

  return response;
}


export const ListOrderTypes = async (term:string) => {
  const token = localStorage.getItem('@GoJur:token')

  const response = await api.get<IMatterDemandTypeData[]>('/TipoPedidoProcesso/ListarCombo', {
    params:{rows:'50', filterClause: term, token}
  })

  return response;
}


export const DeleteOrder = async (ids: string) => {
  const token = localStorage.getItem('@GoJur:token')

  await api.delete('/ProcessoPedido/Deletar', {
    params:{ids, token}
  })
}


export const SaveOrder = async (data: IMatterOrderData) => {
  const token = localStorage.getItem('@GoJur:token')

  // eslint-disable-next-line no-param-reassign
  if (token && data) data.token = token;

  await api.post('/ProcessoPedido/Salvar', data)
}
