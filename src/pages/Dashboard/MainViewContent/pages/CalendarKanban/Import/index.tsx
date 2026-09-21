import React, { useEffect, useState } from 'react';
import { FiX, FiDownload } from 'react-icons/fi';
import Select from 'react-select';
import Loader from 'react-spinners/ClipLoader';
import { useToast } from 'context/toast';
import { selectStyles, useDelay } from 'Shared/utils/commonFunctions';
import api from 'services/api';
import { ModalOverlay, ImportModal, Field, StatusTable, PeriodOptions } from './styles';

interface IOption {
  value: number;
  label: string;
}

interface IPanelResponse {
  Id: number;
  Description: string;
  Default: boolean;
}

interface IStageResponse {
  Id: number;
  Description: string;
  NumPosition: number;
}

// mesma origem do combo de assunto do formulário de compromissos: POST /Assunto/Listar
interface ISubjectResponse {
  id: string;
  value: string;
}

interface ISubjectOption {
  value: string;
  label: string;
}

type StatusKey = 'inProgress' | 'future' | 'closed' | 'overdue';

interface IStatusRow {
  key: StatusKey;
  label: string;
  // etapa sugerida — casada pelo nome ao carregar as etapas do painel
  suggestedPhase: string;
}

const STATUS_ROWS: IStatusRow[] = [
  { key: 'inProgress', label: 'Em andamento', suggestedPhase: 'Em Andamento' },
  { key: 'future', label: 'Futuros', suggestedPhase: 'A Fazer' },
  { key: 'closed', label: 'Encerrados', suggestedPhase: 'Concluido' },
  { key: 'overdue', label: 'Em atraso', suggestedPhase: 'Em Atraso' },
];

const PERIOD_OPTIONS = [
  { value: 12, label: 'A 1 Ano' },
  { value: 6, label: '6 meses' },
  { value: 3, label: '3 meses' },
  { value: 1, label: '1 mês' },
];

// react-select no tamanho dos formulários do calendário (0.675rem), mantendo o realce padrão das opções
const compactSelectStyles = {
  ...selectStyles,
  control: styles => ({ ...styles, minHeight: '2.3rem', height: '2.3rem', fontSize: '0.675rem' }),
  valueContainer: styles => ({ ...styles, height: '2.3rem', padding: '0 0.5rem' }),
  indicatorsContainer: styles => ({ ...styles, height: '2.3rem' }),
  placeholder: styles => ({ ...styles, fontSize: '0.675rem' }),
  singleValue: styles => ({ ...styles, fontSize: '0.675rem' }),
  menu: styles => ({ ...styles, fontSize: '0.675rem' }),
  noOptionsMessage: styles => ({ ...styles, fontSize: '0.675rem' }),
  // menu renderizado em portal: o body do modal tem overflow, senão a lista fica cortada
  menuPortal: styles => ({ ...styles, zIndex: 99999, fontSize: '0.675rem' }),
};

// o multi cresce conforme as tags selecionadas, então não pode ter altura fixa
const compactMultiSelectStyles = {
  ...compactSelectStyles,
  control: styles => ({ ...styles, minHeight: '2.3rem', height: 'auto', fontSize: '0.675rem' }),
  valueContainer: styles => ({ ...styles, height: 'auto', padding: '0.2rem 0.5rem' }),
  indicatorsContainer: styles => ({ ...styles, height: 'auto' }),
  multiValue: styles => ({ ...styles, fontSize: '0.625rem' }),
  multiValueLabel: styles => ({ ...styles, fontSize: '0.625rem', padding: '0 0.2rem' }),
};

// comparação de nome de etapa ignorando acento e caixa (Concluido == Concluído)
const isSameName = (a: string, b: string) =>
  a.trim().localeCompare(b.trim(), 'pt-BR', { sensitivity: 'base' }) === 0;

interface KanbanImportProps {
  onClose: () => void;
  onImported?: () => void;
  defaultPanelId?: number;
}

const KanbanImport: React.FC<KanbanImportProps> = ({ onClose, onImported, defaultPanelId }: KanbanImportProps) => {
  const { addToast } = useToast();
  const token = localStorage.getItem('@GoJur:token');

  const [panels, setPanels] = useState<IOption[]>([]);
  const [selectedPanel, setSelectedPanel] = useState<IOption | null>(null);
  const [phases, setPhases] = useState<IOption[]>([]);
  const [phaseByStatus, setPhaseByStatus] = useState<Record<StatusKey, IOption | null>>({
    inProgress: null,
    future: null,
    closed: null,
    overdue: null,
  });
  const [monthsBack, setMonthsBack] = useState<number>(12);
  const [optionsSubject, setOptionsSubject] = useState<ISubjectOption[]>([]);
  const [selectedSubjects, setSelectedSubjects] = useState<ISubjectOption[]>([]);
  const [subjectTerm, setSubjectTerm] = useState('');
  const [isLoadingSubject, setIsLoadingSubject] = useState(false);
  const [isWaiting, setIsWaiting] = useState(false);

  useEffect(() => {
    LoadPanels();
  }, []);

  useEffect(() => {
    if (selectedPanel)
      LoadPhases(selectedPanel.value);
  }, [selectedPanel]);

  // carrega na abertura e refaz a busca no servidor conforme o termo digitado
  useDelay(() => {
    LoadSubjects(subjectTerm);
  }, [subjectTerm], 1000);

  const LoadPanels = async () => {
    setIsWaiting(true);

    try {
      const response = await api.get<IPanelResponse[]>('/Kanban/Listar', {
        params: { token },
      });

      const list: IOption[] = response.data.map(item => ({
        value: item.Id,
        label: item.Description,
      }));

      setPanels(list);

      const defaultPanel = response.data.find(item => item.Default);

      setSelectedPanel(
        list.find(item => item.value === defaultPanel?.Id) ||
        list.find(item => item.value === defaultPanelId) ||
        null
      );
    }
    catch {
      addToast({
        type: 'error',
        title: 'Operação NÃO Realizada',
        description: 'Houve uma falha no carregamento dos painéis',
      });
    }
    finally {
      setIsWaiting(false);
    }
  };

  const LoadPhases = async (kanbanId: number) => {
    setIsWaiting(true);

    try {
      const response = await api.get<IStageResponse[]>('/KanbanEtapa/Listar', {
        params: { token, kanbanId },
      });

      const list: IOption[] = response.data
        .sort((a, b) => a.NumPosition - b.NumPosition)
        .map(item => ({
          value: item.Id,
          label: item.Description,
        }));

      setPhases(list);

      const suggested = STATUS_ROWS.reduce((acc, row) => {
        acc[row.key] = list.find(phase => isSameName(phase.label, row.suggestedPhase)) || null;
        return acc;
      }, {} as Record<StatusKey, IOption | null>);

      setPhaseByStatus(suggested);
    }
    catch {
      addToast({
        type: 'error',
        title: 'Operação NÃO Realizada',
        description: 'Houve uma falha no carregamento das etapas do painel',
      });
    }
    finally {
      setIsWaiting(false);
    }
  };

  const LoadSubjects = async (termSearch: string) => {
    setIsLoadingSubject(true);

    try {
      const response = await api.post<ISubjectResponse[]>('/Assunto/Listar', {
        description: termSearch,
        token,
      });

      setOptionsSubject(response.data.map(item => ({
        value: String(item.id),
        label: item.value,
      })));
    }
    catch {
      addToast({
        type: 'error',
        title: 'Operação NÃO Realizada',
        description: 'Houve uma falha no carregamento dos assuntos',
      });
    }
    finally {
      setIsLoadingSubject(false);
    }
  };

  const handleChangePhase = (statusKey: StatusKey, option: IOption) => {
    setPhaseByStatus(current => ({ ...current, [statusKey]: option }));
  };

  const handleImport = async () => {
    if (!selectedPanel) {
      addToast({
        type: 'info',
        title: 'Atenção',
        description: 'Informe o painel para onde os compromissos serão importados',
      });
      return;
    }

    const missing = STATUS_ROWS.filter(row => !phaseByStatus[row.key]);

    if (missing.length > 0) {
      addToast({
        type: 'info',
        title: 'Atenção',
        description: `Informe a etapa de destino para: ${missing.map(row => row.label).join(', ')}`,
      });
      return;
    }

    setIsWaiting(true);

    try {
      await api.post('/Kanban/ImportarCompromissos', {
        token,
        kanbanId: selectedPanel.value,
        monthsBack,
        inProgressStageId: phaseByStatus.inProgress?.value,
        futureStageId: phaseByStatus.future?.value,
        closedStageId: phaseByStatus.closed?.value,
        overdueStageId: phaseByStatus.overdue?.value,
        // vazio = importa compromissos de todos os assuntos
        subjectIds: selectedSubjects.map(subject => subject.value),
      });

      addToast({
        type: 'success',
        title: 'Operação Realizada',
        description: 'Os compromissos foram importados para o painel selecionado',
      });

      if (onImported)
        onImported();

      onClose();
    }
    catch {
      addToast({
        type: 'error',
        title: 'Operação NÃO Realizada',
        description: 'Houve uma falha na importação dos compromissos',
      });
    }
    finally {
      setIsWaiting(false);
    }
  };

  return (
    <ModalOverlay>
      <ImportModal onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h4>Importar Compromissos para o Kanban</h4>
          <FiX onClick={onClose} />
        </div>

        <div className="modal-body">
          <Field>
            <label>Informe o Painel</label>
            <Select
              options={panels}
              styles={compactSelectStyles}
              menuPortalTarget={document.body}
              menuPosition="fixed"
              value={selectedPanel}
              placeholder="Selecione o painel"
              noOptionsMessage={() => 'Nenhum painel encontrado'}
              onChange={(option: IOption) => setSelectedPanel(option)}
            />
          </Field>

          <Field>
            <label>
              Informe abaixo a etapa para onde deseja importar cada compromisso de acordo com o seu status
            </label>

            <StatusTable>
              <div className="table-header">
                <span>Status</span>
                <span>Etapa</span>
              </div>

              {STATUS_ROWS.map(row => (
                <div className="table-row" key={row.key}>
                  <span className="status">{row.label}</span>
                  <Select
                    options={phases}
                    styles={compactSelectStyles}
                    menuPortalTarget={document.body}
                    menuPosition="fixed"
                    value={phaseByStatus[row.key]}
                    isDisabled={!selectedPanel}
                    placeholder="Selecione a etapa"
                    noOptionsMessage={() => 'Nenhuma etapa encontrada'}
                    onChange={(option: IOption) => handleChangePhase(row.key, option)}
                  />
                </div>
              ))}
            </StatusTable>
          </Field>

          <Field>
            <label>Período a partir de:</label>
            <span className="hint">
              (Informe a data de início para os compromissos que serão importados)
            </span>

            <PeriodOptions>
              {PERIOD_OPTIONS.map(period => (
                <label key={period.value}>
                  <input
                    type="radio"
                    name="importPeriod"
                    checked={monthsBack === period.value}
                    onChange={() => setMonthsBack(period.value)}
                  />
                  {period.label}
                </label>
              ))}
            </PeriodOptions>
          </Field>

          <Field>
            <label>Assunto (opcional)</label>
            <span className="hint">
              (Selecione um ou mais assuntos; em branco importa compromissos de todos os assuntos)
            </span>
            <Select
              isMulti
              isClearable
              isSearchable
              options={optionsSubject}
              styles={compactMultiSelectStyles}
              menuPortalTarget={document.body}
              menuPosition="fixed"
              value={selectedSubjects}
              isLoading={isLoadingSubject}
              placeholder="Todos os assuntos"
              loadingMessage={() => 'Carregando...'}
              noOptionsMessage={() => 'Nenhum assunto encontrado'}
              onInputChange={term => setSubjectTerm(term)}
              onChange={(options: ISubjectOption[]) => setSelectedSubjects(options || [])}
            />
          </Field>
        </div>

        <div className="modal-footer">
          {isWaiting && <Loader size={18} color="#a9a9a9" />}

          <button
            type="button"
            className="buttonClick"
            disabled={isWaiting}
            onClick={handleImport}
          >
            <FiDownload size={12} /> Importar
          </button>

          <button
            type="button"
            className="buttonLinkClick"
            onClick={onClose}
          >
            Cancelar
          </button>
        </div>
      </ImportModal>
    </ModalOverlay>
  );
};

export default KanbanImport;
