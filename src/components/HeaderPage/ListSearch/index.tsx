/* eslint-disable no-nested-ternary */
import  React, { useCallback, useEffect , useState } from 'react';
import { useDefaultSettings } from 'context/defaultSettings';
import { useModal } from 'context/modal';
import { useToast } from 'context/toast';
import api from 'services/api';
import Loader from 'react-spinners/ClipLoader';
import { Overlay } from 'Shared/styles/GlobalStyle';
import { FaCalendarAlt } from 'react-icons/fa';
import  { RiFilePdfLine, RiFolder2Fill, RiUserAddFill } from 'react-icons/ri';
import { envProvider } from 'services/hooks/useEnv';
import { IMatterData } from 'pages/Dashboard/MainViewContent/pages/Interfaces/IMatter';
import { Container,ListItem } from './styles';

interface SearchData {
  id: string;
  result: string;
  type: string;
  complement: string;
}

interface ListSearchProps {
  data: SearchData[];
}

function ListSearch({ data }: ListSearchProps) {
  const { addToast } = useToast();
  const { permissionData } = useDefaultSettings();
  const { isOpenModal } = useModal();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const token = localStorage.getItem('@GoJur:token');
  const baseUrl = envProvider.redirectUrl;
  
  const CustomerRedirect = (id) => {
    const urlRedirect = `customer/edit/${id}`
    window.open(urlRedirect, '_parent')
  };


  const MatterRedirect = (matterId, matterType) => {
    const urlRedirect = `/matter/edit/${matterType}/${matterId}`
    window.open(urlRedirect, '_parent')
  };


  const DocumentCustomerRedirect = async (id, fileName) => {
    try{
      setIsLoading(true);
      const response = await api.post('/Clientes/DownloadFile', {
        referenceId: id,
        fileName: fileName.toLowerCase(),
        token
      })
  
      window.open(response.data, '_blank')
  
      setIsLoading(false);
      return false;
    }
    catch(err:any){
      setIsLoading(false);
      addToast({
        type: 'error',
        title: 'Falha ao baixar arquivo',
        description: err.response.data.Message
      });
    }
  };


  const DocumentMatterRedirect = async (id, fileName) => {
    try{
      setIsLoading(true);
      const response = await api.post('/ProcessoArquivos/DownloadFile', {
        referenceId: id,
        fileName: fileName.toLowerCase(),
        token
      })

      window.open(response.data, '_blank')

      setIsLoading(false);
      return false;
    }
    catch(err:any){
      setIsLoading(false);
      addToast({
        type: 'error',
        title: 'Falha ao baixar arquivo',
        description: err.response.data.Message
      });
    }
  };


  if (isLoading){
    return (
      <>
        <Overlay />
        <div className='waitingMessage'>
          <Loader size={15} color="var(--blue-twitter)" />
          &nbsp;&nbsp;Aguarde...
        </div>
      </>
    )
  }


  return (
    <Container>
      {data.map(m => (
        <ListItem
          key={m.id}
          initial={{ scale: 0, opacity: 0, y: -50 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{ ease: 'easeIn', duration: 0.5 }}
        >
          {m.type === 'customer' && (
            <button type="button" onClick={() => { CustomerRedirect(m.id) }}>
              <section>
                <p>{m.result.split('#&gojur&#')}</p>
              </section>
              <RiUserAddFill />
            </button>
          )}
          {m.type === 'matterLegal' && (
            <button type="button" onClick={() => { MatterRedirect(m.id, 'legal') }}>
              <section>
                <p>{m.result.split('#&gojur&#')}</p>
              </section>
              <RiFolder2Fill />
            </button>
          )}
          {m.type === 'matterAdvisory' && (
            <button type="button" onClick={() => { MatterRedirect(m.id, 'advisory') }}>
              <section>
                <p>{m.result.split('#&gojur&#')}</p>
              </section>
              <RiFolder2Fill />
            </button>
          )}
          {m.type === 'calendar' && (
            <button
              type="button"
              onClick={() => { isOpenModal(m.id) }}
            >
              <section>
                <p>{m.result.split('#&gojur&#')}</p>
              </section>
              <FaCalendarAlt />
            </button>
          )}
          {m.type === 'documentMatter' && (
            <button type="button" onClick={() => { DocumentMatterRedirect(m.id, m.complement) }}>
              <section>
                <p>{m.result.split('#&gojur&#')}</p>
              </section>
              <RiFilePdfLine />
            </button>
          )}
          {m.type === 'documentCustomer' && (
            <button type="button" onClick={() => { DocumentCustomerRedirect(m.id, m.complement) }}>
              <section>
                <p>{m.result.split('#&gojur&#')}</p>
              </section>
              <RiFilePdfLine />
            </button>
          )}
        </ListItem>
      ))}

    </Container>
  );
};

export default ListSearch;
