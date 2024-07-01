/* eslint-disable react/react-in-jsx-scope */
import api from "services/api"
import { IMatterParts, ISelectData } from "../../Interfaces/IMatter";

export async function ListCustomerData(term: string){

  const token = localStorage.getItem('@GoJur:token');

    const customerListData: ISelectData[] =[]
    const response = await api.post('/Clientes/ListarComboBox', {
        token,
        page:0,
        rows:50,
        filterClause:term
      })

    response.data.map((item) => {
        customerListData.push({
            id:item.id,
            label:item.value
        })

        return customerListData;
    })

    return customerListData;
}

export async function ListLawyerData(term: string){
    const token = localStorage.getItem('@GoJur:token');

    const lawyerListData: ISelectData[] =[]
    const response = await api.get('/Advogados/Listar', {
        params: {
            token,
            page:0,
            rows:50,
            filterClause:term
        }
      })

    response.data.map((item) => {
        lawyerListData.push({
            id:item.cod_Advogado,
            label:item.nom_Pessoa
        })

        return lawyerListData;
    })

    return lawyerListData;
}


export async function ListOpossingData(term: string){
    const token = localStorage.getItem('@GoJur:token');

    const opossingListData: ISelectData[] =[]
    const response = await api.post('/Contrario/ListarPorNome', {
        token,
        filterDesc:term
      })

    response.data.map((item) => {
        opossingListData.push({
            id:item.id,
            label:item.value
        })

        return opossingListData;
    })

    return opossingListData;
}

export async function ListThirdyData(term: string){
    const token = localStorage.getItem('@GoJur:token');

    const thirdyListData: ISelectData[] =[]
    const response = await api.get('/Terceiros/Listar', {
        params: {
            token,
            page:0,
            rows:50,
            filterClause:term
        }
      })

    response.data.map((item) => {
        thirdyListData.push({
            id:item.cod_Terceiro,
            label:item.nom_Pessoa
        })

        return thirdyListData;
    })

    return thirdyListData;
}

export async function ListPartsData(page: number, rows: number, filterClause: string) {

    const token = localStorage.getItem('@GoJur:token');

    const response = await api.get('Parte/ListarPorNome', {
        params: {
            rows,
            filterClause,
            token
        }
    })

    const listResult: ISelectData[] = []
    response.data.map(item => {
        listResult.push({
            id: item.positionId,
            label: item.positionName
        })

        return;
    })

    return listResult;
}

export async function ListMatterParts(matterId: number) {

    const token = localStorage.getItem('@GoJur:token');

    const response = await api.get<IMatterParts[]>('ProcessoPartes/Listar', {
        params: {
            matterId,
            token
        }
    })

    return response.data;
}

export async function SaveParts(matterPartsJSON: string, matterPartsDeleteJSON: string, matterId: number) {

    const token = localStorage.getItem('@GoJur:token');

    const response = await api.post<boolean>('ProcessoPartes/Salvar', {
        matterId,
        matterPartsJSON,
        matterPartsDeleteJSON,
        token
    })

    return response.data;
}
