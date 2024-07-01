/* eslint-disable no-param-reassign */
/* eslint-disable react/react-in-jsx-scope */
import api from "services/api"
import { IMatterAttachValues, IMatterData, IMatterValuesData, ISelectData, ISelectUserData, MatterUsersDTO, MatterValueCalculationResult, ValuesDTO } from "../../Interfaces/IMatter";

export enum ComboSelectType {
  judicialAction,
  legalNature,
  processualStage,
  matterStatus,
  matterDecision,
  probablySuccess,
  advisororyType,
  rito,
}

export async function SelectMatter(matterId: string){
  const token = localStorage.getItem('@GoJur:token');

  const response = await api.post<IMatterData>('/Processo/SelecionarProcesso', {
      matterId,
      token,
      companyId: localStorage.getItem('@GoJur:companyId'),
      apiKey: localStorage.getItem('@GoJur:apiKey')
  })

  return response.data;
}


export async function DeleteMatterEvents(matterId: string){
    const token = localStorage.getItem('@GoJur:token');
  
    const responseEvents = await api.delete<boolean>('/ProcessoAcompanhamentos/DeletarPorProcesso', {
      params:{matterId, token}
    })
  
    return responseEvents.data
}


export async function DeleteMatter(matterId: string){
  const token = localStorage.getItem('@GoJur:token');

  const response = await api.delete<boolean>('/Processo/Deletar', {
      params:{matterId, token}
    })

  return response.data
}


export async function SelectFolderCode(matterId: string){
    const token = localStorage.getItem('@GoJur:token');
  
    const response = await api.get<string>('/Processo/SelecionarNumeroPasta', {
        params:{matterId, token}
      })
  
    return response.data
}


export async function SaveMatterMarkers(matterId: number, markers: string, matterType: string){
  const token = localStorage.getItem('@GoJur:token');

  await api.post('/Processo/SalvarMarcadores', {
      token,
      matterId,
      matterType,
      markers
    })
}


export async function GetMatterValuesJSON(matterId: string){
  const token = localStorage.getItem('@GoJur:token');

  const response = await api.get<string>('/ProcessoValores/MatterValuesJSON', {
      params: {matterId, token}
  })

    const valuesList = JSON.parse(response.data)
    const resultList: IMatterValuesData[] = []

    valuesList.map(item => {
        resultList.push({
            id: item.id,
            calculationId: item.calculationId,
            matterId:Number(matterId),
            name: item.name,
            newItem: item.newItem,
            isMatterValue: item.isMatterValue,
            isRiskValue: item.isRiskValue,
            startDate: item.startDate,
            endDate: item.endDate,
            updateDate:item.updateDate,
            lastIndexDate: item.lastIndexDate,
            originalValue: item.originalValue,
            updateValue: item.updateValue,
            typeValue: item.typeValue,
            blockValue: item.isRiskValue || item.isMatterValue,
            jsonCalculator: item.jsonCalculator,
            calculatorObject: JSON.parse(item.jsonCalculator)
        })

        return;
    })

    return resultList;
}


export async function ListJudicialAction(page: number, rows: number, filterClause: string) {
    const token = localStorage.getItem('@GoJur:token');

    const response = await api.get<ValuesDTO[]>('/AcaoJudicial/ListarAcaoJudicial', {
        params: {page, rows, filterClause, token}
    })

    return ConvertList(response.data);
}


export async function ListJudicialNature(page: number, rows: number, filterClause: string) {
    const token = localStorage.getItem('@GoJur:token');

    const response = await api.get<ValuesDTO[]>('/NaturezaJuridica/ListarNaturezaJuridica', {
        params: {page, rows, filterClause, token}
    })

    return ConvertList(response.data);
}


export async function ListRito(page: number, rows: number, filterClause: string) {
    const token = localStorage.getItem('@GoJur:token');

    const response = await api.get<ValuesDTO[]>('/Rito/ListarCombo', {
        params: {filterClause, rows, token}
    })

    return ConvertList(response.data);
}


export async function ListProcessualStage(page: number, rows: number, filterClause: string) {
    const token = localStorage.getItem('@GoJur:token');

    const response = await api.get<ValuesDTO[]>('/FaseProcessual/ListarFaseProcessual', {
        params: {rows, filterClause, token}
    })

    return ConvertList(response.data);
}


export async function ListMatterStatus(page: number, rows: number, filterClause: string) {
    const token = localStorage.getItem('@GoJur:token');

    const response = await api.get<ValuesDTO[]>('/StatusProcesso/ListarStatusProcesso', {
        params: {rows, filterClause, token}
    })

    return ConvertList(response.data);
}


export async function ListAdvisoryType(page: number, rows: number, filterClause: string) {
    const token = localStorage.getItem('@GoJur:token');

    const response = await api.get<ValuesDTO[]>('/TipoConsultivo/ListarCombo', {
        params: {rows, filterClause, token}
    })

    return ConvertList(response.data);
}


export async function ListJudicialDecision(page: number, rows: number, filterClause: string) {
    const token = localStorage.getItem('@GoJur:token');

    const response = await api.get<ValuesDTO[]>('/SolucaoProcesso/ListarSoluçãoProcesso', {
        params: {rows, filterClause, token}
    })

    return ConvertList(response.data);
}


export async function ListProbablySuccess(page: number, rows: number, filterClause: string) {
    const token = localStorage.getItem('@GoJur:token');

    const response = await api.get<ValuesDTO[]>('/ProbabilidadeProcesso/ListarProbabilidadeProcesso', {
        params: {rows, filterClause, token}
    })

    return ConvertList(response.data);
}


export async function ListIndices() {
    const token = localStorage.getItem('@GoJur:token');

    const response = await api.get<ValuesDTO[]>('/ProcessoValores/ListarIndicesEconomicos', {
        params: {filter: '', token}
    })

    return ConvertList(response.data);
}


export async function GetLegalNature(legalActionId: number) {
    const token = localStorage.getItem('@GoJur:token');

    const response = await api.get<ValuesDTO>('/NaturezaJuridica/SelecionarPorAcaoJudicial', {
        params: {legalActionId, token}
    })

    return response.data
}


export async function ListResponsible(userName: string) {
    const token = localStorage.getItem('@GoJur:token');

    const response = await api.post<ValuesDTO[]>('/Usuario/ListarUsuarios', {
        token,
        userName,
        removeCurrentUser: false
    })

    return ConvertList(response.data);
}


export async function ListMatterUsers(matterId: number) {
  const token = localStorage.getItem('@GoJur:token');

    const response = await api.get<MatterUsersDTO[]>('/MatterUsers/ListarUsuariosETimes', {
        params: {token, matterId}
    })

    const listSelectGroup: ISelectUserData[] = []

    response.data.map(item => {
        listSelectGroup.push({
            id: item.id,
            label: item.value,
            accessType: item.accessType,
            isInProcess: item.isInProcess
        });

        return;
    })

    return listSelectGroup
}


export async function SaveMatterAttach(matterAttachIds: string, matterId: number) {
    const token = localStorage.getItem('@GoJur:token');

    const response = await api.post('/ProcessoApenso/Apensar', {
        token,
        matterAttachIds,
        matterId
    })

    return response.data;
}


export async function DeleteMatterAttach(matterId: number) {
    const token = localStorage.getItem('@GoJur:token');

    const response = await api.post('/ProcessoApenso/Delete', {
        token,
        matterId
    })

    return response.data;
}


export async function ListMatterAttach(matterId: number) {
    const token = localStorage.getItem('@GoJur:token');

    const response = await api.get<IMatterAttachValues[]>('/ProcessoApenso/Listar', {
        params:{token, matterId}
    })

    return response.data;
}


export async function GenereReportJudicialDebits(jsonCalculator: string, matterId: number) {
    const token = localStorage.getItem('@GoJur:token');

    const response = await api.post<number>('/ProcessoValores/RelatorioDebitosJudiciais', {
        token,
        jsonCalculator: JSON.stringify(jsonCalculator),
        matterId
    })

    return response.data;
}

export async function GenerateReportMemoryCalcule(jsonCalculator: string) {
    const token = localStorage.getItem('@GoJur:token');

    const response = await api.post<number>('/ProcessoValores/RelatorioMemoriaDeCalculo', {
        token,
        jsonCalculator
    })

    return response.data;
}


export async function ChekReportPending(idReportGenerate: number) {

    const response = await api.post(`/ProcessosGOJUR/VerificarStatus`, {
        id: idReportGenerate,
        token: localStorage.getItem('@GoJur:token')
      })

    return response;
}


export async function GetReportAmazon(idReportGenerate: number) {
    const token = localStorage.getItem('@GoJur:token');

    const response = await api.post(`/ProcessosGOJUR/Editar`, {
        id: idReportGenerate,
        token
      });

    return response.data;
}


export async function CalculateMatterValue(jsonCalculator: string) {
    const token = localStorage.getItem('@GoJur:token');

    const response = await api.post<MatterValueCalculationResult>('/ProcessoValores/Calcular', {
        token,
        jsonCalculator
    })

    return response.data;
}


export async function SaveMatter(data:any) {

    const response = await api.post('/Processo/Salvar',
        data,
    )

    return response.data;
}


function ConvertList(list: ValuesDTO[] = []){

    const listSelectGroup: ISelectData[] = []

    list.map(item => {
        listSelectGroup.push({
            id: item.id,
            label: item.value
        })

        return;
    })

    return listSelectGroup
}
