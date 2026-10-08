import api from "services/api";
import { IMatterUploadFile } from "../../Interfaces/IMatter";

export const CreateFileUpload = async(request: any) => {
  const response = api.post<IMatterUploadFile[]>('/ProcessoArquivos/CriarArquivoPendente', request)
  return response;
}


export const ValidateFileUpload = async(request: any) => {
  const response = api.post<IMatterUploadFile[]>('/ProcessoArquivos/ValidarArquivo', request);
  return response;
}


export const DownloadFile = async(request: any) => {
  const response =  api.post('/ProcessoArquivos/DownloadFile', request)
  return response;
}


export const DeleteFile = async(request: any) => {
  const token = localStorage.getItem('@GoJur:token');

  const response = api.delete('/ProcessoArquivos/Deletar', {
    params:{referenceId: request.matterId, fileName: request.fileName.toLowerCase(), token}
  })

  return response;
}


export const ShareFile = async(fileId: number) => {
  const token = localStorage.getItem('@GoJur:token');

  const response = api.post('/ProcessoArquivos/Compartilhar', {
      referenceId: fileId,
      token
  })

  return response;
}


export const ListMatterFiles = async(matterId: number, rows:number, isCustomerFiles: boolean, tokenPaginationAmazon: string|null) => {
  const token = localStorage.getItem('@GoJur:token');

  const response = await api.post<IMatterUploadFile[]>('/ProcessoArquivos/ListarArquivos', {
    referenceId: matterId,
    rows,
    isCustomerFiles,
    tokenPaginationAmazon,
    token
  })

  return response;
}
