import React, { useEffect, useState } from 'react';
import { MdNewReleases } from 'react-icons/md'
import { FaRegCopy } from 'react-icons/fa'
import { SiEventstore } from 'react-icons/si'
import { AiOutlineGoogle } from 'react-icons/ai'
import { MdPhoneIphone, MdUpdate } from 'react-icons/md'
import { RiDeleteBackLine } from 'react-icons/ri'
import { GrUndo } from 'react-icons/gr'
import { FiHelpCircle } from 'react-icons/fi'
import { SiMicrosoftoutlook } from 'react-icons/si'
import { useToast } from 'context/toast';
import api from 'services/api';
import { format } from 'date-fns';
import { Container, Content } from './styles';
import { IParameter } from '../../Interfaces/ICalendar';

interface CalendarExportConfigProps {
  handleCloseExportConfig: () => void
  handleExportState: (status:boolean) => void
}

const CalendarExportConfig: React.FC<CalendarExportConfigProps> = (props: CalendarExportConfigProps) => {

  const { handleCloseExportConfig, handleExportState } = props;
  const { addToast } = useToast();
  const [ linkIntegration, setLinkIntegration] = useState('');
  const [ timeZoneParameter, setTimeZoneParameter] = useState('-03');
  const [ isLoading, setIsLoading] = useState(true);
  const [ dateLastUpdate, setDateLastUpdate] = useState<Date | null>(null);
  const token = localStorage.getItem('@GoJur:token');

  useEffect(() => {

    LoadCalendarParameters();
    GetLastUpdate();

  },[])


  // Load calendar parameters
  const LoadCalendarParameters = async () => {

    handleExportState(true)

    try {
      const response = await api.get<IParameter[]>('/Parametro/ListarPorModulo', {
        params:{
          moduleName: 'calendarModule',
          token
        }
      });

      response.data.map(item => {

        if(item.parameterName == "#CALENDARTIMEZO"){
          setTimeZoneParameter(item.parameterValue)
        }

        if(item.parameterName == "#CALENDARLINK"){
          setLinkIntegration(item.parameterValue)
        }

        return;
      })

      setIsLoading(false)
      handleExportState(false)

    } catch (err) {
      setIsLoading(false)
      handleExportState(false)
    }
  }

  const GetLastUpdate = async() => {

    try
    {
        const response = await api.get<Date>('Compromisso/GetLastUpdateLink', {
          params: {
            token
          }
        })

        setDateLastUpdate(response.data)
        console.log(response.data)
    }
    catch(err)
    {
      console.log(err)
    }
  }

  const handleGenerateLink = async () => {
    try {

      handleExportState(true)

      const response = await api.get<string>('/Compromisso/GenerateUserLink', {
        params:{
           token,
           timeZoneParameter
        }
      });

      setLinkIntegration(response.data)

      addToast({
        type: "success",
        title: "Link criado com sucesso",
        description: "O link de exportação foi criado com sucesso. Copie e utilize onde quiser !",
      })

      await GetLastUpdate();
      handleExportState(false)

    } catch (err:any) {

      setLinkIntegration(err.response.data.Message)

      addToast({
        type: "info",
        title: "Operação NÃO realizada",
        description: "Houve uma falha na criação do link de exportação. Tente novamente."
      })

      handleExportState(false)

    }
  }

  const handleRemoveConfig = async () => {

      handleExportState(true)

      await api.get<string>('/Compromisso/RemoveLinkConfig', {
        params:{ token }
      });

      setLinkIntegration('')

      addToast({
        type: "success",
        title: "Operação realizada com sucesso",
        description: "As configurações de exportação foram desfeitas. Caso deseje integrar a sua agenda configure novamente",
      })

      handleExportState(false)
  }

  const handleCopyLink = (e) => {

    handleExportState(true)

    try
    {
      if (linkIntegration.length == 0)
      {
        addToast({
          type: 'info',
          title: 'Operação não realizada',
          description: `Não foi gerado um link de exportação para efetuar a cópia`,
        });

        return;
      }

      setTimeout(() => {

        const ta = document.createElement("textarea");
        ta.innerText = linkIntegration;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand("copy");
        ta.remove();

        addToast({
          type: 'success',
          title: 'Operação realizada com sucesso',
          description: `O link de exportação foi copiado para a área de transferência`,
        });

        e.stopPropagation();

        handleExportState(false)

      }, 2000)

    }
    catch(err:any)
    {
      console.log(err)

      handleExportState(false)
    }
  }

 // video blog links
 const VIDEOS_SOURCE = [
  {
    name: 'Google Calendar',
    source: 'https://gojur.tawk.help/article/agenda-no-google-calendar-e-android'
  },
  {
    name: 'Outlook',
    source: 'https://gojur.tawk.help/article/agenda-no-outlook'
  },
  {
    name: 'Mac / Iphone',
    source: 'https://gojur.tawk.help/article/agenda-no-iphone'
  }
]

const handleHelpLink = (type: 'Google Calendar' | 'Outlook' | 'Mac / Iphone') => {
  const link = VIDEOS_SOURCE.find(item => item.name == type)?.source
  window.open(link, '_blank')
}

  if (isLoading)
  {
    return (
      <Container>
        <Content />
      </Container>
    )
  }

  return (
    <>

      <Container>

        <header>
          Exportação da Agenda
        </header>

        <div id="message">
          <MdNewReleases />
          Esta funcionalidade permite a exportação de seus compromissos em um formato padrão, que poderá ser lido pelos principais gerenciadoras de calendário do mercado, como o
          {' '}
          <span>Google Calendar</span>
          ,
          {' '}
          <span>Outlook</span>
          {' '}
          e
          {' '}
          <span>Apple Calendar</span>
          .
          <br />

          <div>
            Clique no botão gerar link para iniciar a exportação dos compromissos e copie o link para o seu gerenciador
            {' '}
            <FiHelpCircle title="Compromissos regulares são exportados no período: (1 mês anterior e 12 meses à frente). Recorrências são exportadas consideranto até 1 ano do ínicio da mesma. Compromissos futuros sempre serão atualizados." style={{cursor:'pointer'}} />
          </div>

        </div>

        <br />

        <Content>

          <div>

            <label htmlFor="timezone">
              Fuso horário:
              <select
                value={timeZoneParameter}
                onChange={(e) => setTimeZoneParameter(e.target.value)}
              >
                <option value="-03">(UTC-3) - DF, AL, Macapá, Salvador, Fortaleza, Vitória, Goiânia, São Luís, Belo Horizonte, Belém, João Pessoa, Curitiba, Recife, Teresina, Rio de Janeiro, Natal, Porto Alegre, Florianópolis, São Paulo, Aracaju </option>
                <option value="-04">(UTC-4) - Manaus, Cuiabá, Campo Grande, Porto Velho, Boa Vista</option>
                <option value="-05">(UTC-5) - Rio Branco</option>
                <option value="-02">(UTC-2) - Arquipélago de São Pedro e São Paulo, Atol das Rocas, Fernando de Noronha, Martin Vaz Trindade</option>
              </select>

            </label>

            <br />

            <label htmlFor="timezone">
              Link de exportação
              <input type='text' value={linkIntegration} disabled placeholder="Nenhum link de exportação foi gerado" />
            </label>

            <br />

            {dateLastUpdate && (
              <span className="lastUpdate">
                <MdUpdate title='Data da última atualização dos seus eventos relacionados a este link de exportação ' />
                {' '}
                última atualização:
                {' '}
                {format(new Date(dateLastUpdate), "dd/MM/yyyy 'ás' HH:mm")}
              </span>
            )}

          </div>

          <div className='buttonsAction'>

            <button
              type="button"
              className='buttonLinkClick'
              title="Clique para gerar/ atualizar o link de exportação da agenda"
              onClick={handleGenerateLink}
            >
              <SiEventstore />
              {linkIntegration.length == 0? 'Gerar Link': 'Atualizar Link'}
            </button>

            {linkIntegration.length > 0 && (
              <>
                <button
                  type="button"
                  className='buttonLinkClick'
                  title="Clique para copiar o conteúdo do link para a sua área de transferência"
                  onClick={(e) => handleCopyLink(e)}
                >
                  <FaRegCopy />
                  Copiar Link
                </button>

                <button
                  type="button"
                  className='buttonLinkClick'
                  title="Clique para cancelar o seu link de exportação (desabilitar a funcionalidade)"
                  onClick={handleRemoveConfig}
                >
                  <RiDeleteBackLine />
                  Cancelar Exportação
                </button>
              </>
            )}

            <button
              className="buttonLinkClick"
              type='button'
              title="Clique para reteornar a listagem de compromissos"
              onClick={handleCloseExportConfig}
            >
              <GrUndo />
              Voltar para agenda
            </button>

          </div>

        </Content>

        <header>
          <FiHelpCircle />
          {' '}
          Veja o passo a passo para realizar a importação
        </header>

        <div className='videoHelp'>

          <br />
          <br />

          <button
            className="buttonLinkClick"
            type='button'
            title="Clique para visualizar o passo a passo de utilização do link no Google Calendar"
            onClick={()=> handleHelpLink("Google Calendar")}
          >
            <AiOutlineGoogle />
            Google Calendar
          </button>

          <button
            className="buttonLinkClick"
            type='button'
            title="Clique para visualizar o passo a passo de utilização do link no Outlook"
            onClick={()=> handleHelpLink('Outlook')}
          >
            <SiMicrosoftoutlook />
            Outlook
          </button>

          <button
            className="buttonLinkClick"
            type='button'
            title="Clique para visualizar o passo a passo de utilização do link no Outlook"
            onClick={()=> handleHelpLink('Mac / Iphone')}
          >
            <MdPhoneIphone />
            Apple / Iphone
          </button>
        </div>

        <footer>
          <button
            className="buttonClick"
            type='button'
            onClick={handleCloseExportConfig}
          >
            <GrUndo />
            Voltar para agenda
          </button>

        </footer>

      </Container>

    </>
  )
}

export default CalendarExportConfig;
