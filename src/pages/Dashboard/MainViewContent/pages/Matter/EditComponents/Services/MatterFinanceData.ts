import api from "services/api"
import { IDefaultsProps, IMatterFinance } from "../../../Interfaces/IMatter"

export const ListMatterFinance = async (matterId, accountId, page, rows) => {

  const token = localStorage.getItem('@GoJur:token')

  const response = await api.get<IMatterFinance[]>('FinanceiroProcesso/Listar', {
    params: {
      matterId,
      page,
      rows,
      accountId,
      filterClause: '',
      token
    }
  })

  return response;
}

export const EditMatterFinance = async (id: number) => {

  const token = localStorage.getItem('@GoJur:token')

  const response = await api.get<IMatterFinance>('Financeiro/Editar', {

    params: {
      id,
      token
    }

  });

  return response;
}


export const DeleteMatterFinance = async (id: number, deleteAll: boolean) => {

  const token = localStorage.getItem('@GoJur:token')

  const response = await api.delete<IMatterFinance>('Financeiro/Deletar', {

    params: {
      id,
      deleteAll,
      validateFinancialIntegration: false,
      token
    }

  });

  return response;
}

export const ListAccount = async (term: string) => {

  const token = localStorage.getItem('@GoJur:token')

  const response = await api.post<IDefaultsProps[]>(`/ContasBancarias/Listar`,{
    token,
    term
  });

  return response;
}

export const GetDefaultAccount = async() => {

  const token = localStorage.getItem('@GoJur:token')

  const response = await api.post<IDefaultsProps[]>(`/Defaults/Listar`,{
      token
  });

  const account = response.data
    .filter(item => item.id === 'defaultAccount')
    .map(i => i.value)
    .toString();

  return account;
}
