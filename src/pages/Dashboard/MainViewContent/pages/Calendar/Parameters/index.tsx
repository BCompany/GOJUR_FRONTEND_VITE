import React, { ChangeEvent, useEffect, useState } from 'react';
import { FiSave } from 'react-icons/fi';
import { FaRegTimesCircle } from 'react-icons/fa';
import { useDevice } from 'react-use-device';
import Select from 'react-select';
import api from 'services/api';
import { useToast } from 'context/toast';
import { AutoCompleteSelect } from 'Shared/styles/GlobalStyle';
import { selectStyles, useDelay } from 'Shared/utils/commonFunctions';
import { loadingMessage, noOptionsMessage } from 'Shared/utils/commonConfig';
import { IParameter, ISelectData, ISubject } from '../../Interfaces/ICalendar';
import { ModalParameters, ModalParametersMobile } from './styles';

interface CalendarParametersProps {
  handleCloseParameters: () => void;
  handleParametersState?: (status: boolean) => void;
  onSaved?: () => void;
}

const CalendarParameters: React.FC<CalendarParametersProps> = (
  props: CalendarParametersProps,
) => {
  const { handleCloseParameters, handleParametersState, onSaved } = props;
  const { addToast } = useToast();
  const { isMOBILE } = useDevice();
  const token = localStorage.getItem('@GoJur:token');

  const [isLoadingComboData, setIsLoadingComboData] = useState<boolean>(false);
  const [subjectParameter, setSubjectParameter] = useState<ISelectData[]>([]);
  const [subjectParameterTerm, setSubjectParameterTerm] = useState('');
  const [subjectParameterId, setSubjectParameterId] = useState('');
  const [subjectParameterValue, setSubjectParameterValue] = useState('');
  const [sharedParameter, setSharedParameter] = useState<string>('R');
  const [updatePermissionParameter, setUpdatePermissionParameter] =
    useState<string>('restricted');
  const [userTypeParameter, setUserTypeParameter] = useState<string>('RC');
  const [sendEmailParameter, setSendEmailParameter] = useState<string>('R');
  const [customerNotification, setCustomerNotification] =
    useState<string>('EM');
  const [integrationParameter, setIntegrationParameter] = useState<string>('N');
  const [periodIntegrationParameter, setTimeZoneCalendarParameter] =
    useState('-3');

  // o backend zera o valor guardado quando o campo nao vem no payload, entao ele
  // continua sendo enviado mesmo sem o select de visualizacao padrao na tela
  const [viewParameter] = useState<string>('');

  useEffect(() => {
    LoadCalendarParameters();
    LoadParameterSubjects();
  }, []);

  useDelay(
    () => {
      if (subjectParameterTerm.length > 0) {
        LoadParameterSubjects();
      }
    },
    [subjectParameterTerm],
    1000,
  );

  const LoadCalendarParameters = async () => {
    try {
      const response = await api.get<IParameter[]>(
        '/Parametro/ListarPorModulo',
        {
          params: {
            moduleName: 'calendarModule',
            token,
          },
        },
      );

      response.data.map(item => {
        if (item.parameterName == '#CALENDARSHARED') {
          if (item.parameterValue == 'S') setSharedParameter('U');
          else setSharedParameter('R');
        }
        if (item.parameterName == '#CALENDARUPDATE') {
          setUpdatePermissionParameter(item.parameterValue);
        }
        if (item.parameterName == '#CALENDARSUBJ') {
          setSubjectParameterId(item.parameterValue);
          setSubjectParameterValue(item.parameterDesc);
        }
        if (item.parameterName == '#CALENDARSUBJNAME') {
          setSubjectParameterId(item.parameterValue);
          setSubjectParameterValue(item.parameterDesc);
        }
        if (item.parameterName == '#CALENDARUSERS') {
          setUserTypeParameter(item.parameterValue);
        }
        if (item.parameterName == '#CALENDAREMAIL') {
          setSendEmailParameter(item.parameterValue);
        }
        if (item.parameterName == '#CALENDAREXPORT') {
          setIntegrationParameter(item.parameterValue);
        }
        if (item.parameterName == '#CALENDARTIMEZO') {
          setTimeZoneCalendarParameter(item.parameterValue);
        }
        if (item.parameterName == '#WPNOTIFICATION') {
          setCustomerNotification(item.parameterValue);
        }

        return;
      });
    } catch (err) {
      console.log(err);
    }
  };

  const LoadParameterSubjects = async (stateValue?: string) => {
    if (isLoadingComboData) {
      return false;
    }

    // when is a first initialization get value from edit if not load from state as term typing
    let filter =
      stateValue == 'initialize' ? subjectParameterValue : subjectParameterTerm;
    if (stateValue == 'reset') {
      filter = '';
    }

    try {
      setIsLoadingComboData(true);

      const response = await api.post<ISubject[]>(
        '/Assunto/ListarPorParametros',
        {
          description: filter,
          token,
        },
      );

      const listSubject: ISelectData[] = [];

      response.data.map(item => {
        return listSubject.push({
          id: item.id,
          label: item.value,
        });
      });

      setSubjectParameter(listSubject);
      setIsLoadingComboData(false);
    } catch (err) {
      setIsLoadingComboData(false);
      console.log(err);
    }
  };

  const handleSubjectParameterSelected = item => {
    if (item) {
      setSubjectParameterValue(item.label);
      setSubjectParameterId(item.id);
    } else {
      setSubjectParameterValue('');
      LoadParameterSubjects('reset');
      setSubjectParameterId('');
    }
  };

  const saveParameter = async () => {
    try {
      if (handleParametersState) handleParametersState(true);

      await api.post('/Compromisso/SalvarParametrosCalendario', {
        subjectIdParameter: subjectParameterId,
        sharedParameter,
        viewParameter,
        updatePermissionParameter,
        userTypeParameter,
        sendEmailParameter,
        integrationParameter,
        periodIntegrationParameter,
        customerNotificationParameter: customerNotification,
        token,
      });

      if (handleParametersState) handleParametersState(false);

      addToast({
        type: 'success',
        title: 'Parâmetros salvos',
        description: 'Os parâmetros foram adicionado no sistema.',
      });

      handleCloseParameters();

      if (onSaved) onSaved();
    } catch (err) {
      if (handleParametersState) handleParametersState(false);

      addToast({
        type: 'error',
        title: 'Falha ao salvar parâmetros.',
      });
    }
  };

  const subjectField = (
    <>
      <p>Prazo Padrão</p>
      <Select
        isSearchable
        value={subjectParameter.filter(
          options => options.id == subjectParameterId,
        )}
        onChange={handleSubjectParameterSelected}
        onInputChange={term => setSubjectParameterTerm(term)}
        isClearable
        placeholder=""
        isLoading={isLoadingComboData}
        loadingMessage={loadingMessage}
        noOptionsMessage={noOptionsMessage}
        styles={selectStyles}
        options={subjectParameter}
      />
    </>
  );

  const form = (
    <div
      style={{
        marginLeft: '15px',
        marginTop: isMOBILE ? '10px' : '15px',
        marginRight: '10px',
      }}
    >
      <label htmlFor="type">
        Privacidade padrão
        <br />
        <select
          name="userType"
          value={sharedParameter}
          onChange={(e: ChangeEvent<HTMLSelectElement>) =>
            setSharedParameter(e.target.value)
          }
        >
          <option value="U">Público</option>
          <option value="R">Privado</option>
        </select>
      </label>
      <br />
      <br />

      <label htmlFor="type">
        Permissão atualização
        <br />
        <select
          name="userType"
          value={updatePermissionParameter}
          onChange={(e: ChangeEvent<HTMLSelectElement>) =>
            setUpdatePermissionParameter(e.target.value)
          }
        >
          <option value="restricted">Não</option>
          <option value="allowed">Sim</option>
        </select>
      </label>

      {isMOBILE ? (
        <>
          <br />
          <br />
          <AutoCompleteSelect className="selectSubjectParameter">
            {subjectField}
          </AutoCompleteSelect>
          <br />
          <br />
        </>
      ) : (
        <div style={{ marginTop: '10px', marginBottom: '10px' }}>
          {subjectField}
        </div>
      )}

      <label htmlFor="type">
        Mostrar na agenda:
        <br />
        <select
          name="userType"
          value={userTypeParameter}
          onChange={(e: ChangeEvent<HTMLSelectElement>) =>
            setUserTypeParameter(e.target.value)
          }
        >
          <option value="RC">Responsável e Compartilhado</option>
          <option value="R">Responsável</option>
        </select>
      </label>
      <br />
      <br />

      <label htmlFor="type">
        Receber alertas e-mail:
        <br />
        <select
          name="userType"
          value={sendEmailParameter}
          onChange={(e: ChangeEvent<HTMLSelectElement>) =>
            setSendEmailParameter(e.target.value)
          }
        >
          <option value="RC">Responsável e Compartilhado</option>
          <option value="R">Responsável</option>
        </select>
      </label>
      <br />
      <br />

      <label htmlFor="type">
        Notificar cliente por:
        <br />
        <select
          name="userType"
          value={customerNotification}
          onChange={(e: ChangeEvent<HTMLSelectElement>) =>
            setCustomerNotification(e.target.value)
          }
        >
          <option value="">Selecione</option>
          <option value="EM">E-Mail</option>
          <option value="WA">WhatsApp</option>
          <option value="AM">E-Mail e WhatsApp</option>
        </select>
      </label>
      <br />
      <br />
      <br />

      <div id="Buttons" style={{ float: 'right', marginRight: '-40px' }}>
        <div style={{ float: 'left' }}>
          <button
            className="buttonClick"
            type="button"
            onClick={() => saveParameter()}
          >
            <FiSave />
            Salvar
          </button>
        </div>

        <div style={{ float: 'left', width: '150px' }}>
          <button
            type="button"
            className="buttonClick"
            onClick={() => handleCloseParameters()}
          >
            <FaRegTimesCircle />
            Fechar
          </button>
        </div>
      </div>
      <br />
    </div>
  );

  if (isMOBILE) {
    return <ModalParametersMobile>{form}</ModalParametersMobile>;
  }

  return <ModalParameters>{form}</ModalParameters>;
};

export default CalendarParameters;
