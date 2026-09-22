import React, { useEffect, useState } from 'react';
import { FiX, FiDownload, FiCheck, FiAlertCircle } from 'react-icons/fi';
import { FcAbout } from 'react-icons/fc';
import Select from 'react-select';
import Loader from 'react-spinners/ClipLoader';
import { useToast } from 'context/toast';
import { useConfirmBox } from 'context/confirmBox';
import ConfirmBoxModal from 'components/ConfirmBoxModal';
import { selectStyles, useDelay } from 'Shared/utils/commonFunctions';
import api from 'services/api';
import { ModalOverlay, ImportModal, Field, StatusTable, PeriodOptions, ProgressScreen } from './styles';

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

// same source as the subject combo on the appointment form: POST /Assunto/Listar
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
  // StatusFilter expected by /KanbanEtapa/MigrarCompromissos
  statusFilter: 'inprogress' | 'future' | 'completed' | 'late';
  hint?: string;
}

const STATUS_ROWS: IStatusRow[] = [
  {
    key: 'inProgress',
    label: 'Em andamento',
    statusFilter: 'inprogress',
    hint: 'Compromissos não concluídos com início hoje ou nos últimos 5 dias.',
  },
  { key: 'future', 
    label: 'Futuros', 
    statusFilter: 'future',
    hint: 'Conmpromissos que serão iniciados a partir de amanhã.', },
  {
    key: 'closed',
    label: 'Encerrados',
    statusFilter: 'completed',
    hint: 'Conmpromissos que foram marcados como concluídos no GOJUR.',
  },
  { key: 'overdue',
    label: 'Antigos', 
    statusFilter: 'late',
    hint: 'Compromissos não concluídos com início há mais de 5 dias.',
   },
];

// Period expected by /KanbanEtapa/MigrarCompromissos
type PeriodValue = '12m' | '6m' | '3m' | '1m';

const PERIOD_OPTIONS: { value: PeriodValue; label: string }[] = [
  { value: '12m', label: '1 Ano' },
  { value: '6m', label: '6 meses' },
  { value: '3m', label: '3 meses' },
  { value: '1m', label: '1 mês' },
];

// the endpoint migrates up to 100 appointments per call, so each stage is called
// in a loop until it reports nothing left; the cap only guards against a backend
// that keeps returning a positive count and would otherwise spin forever
const MAX_BATCHES_PER_STAGE = 500;

type ProgressState = 'pending' | 'running' | 'done' | 'failed';

interface IProgressRow {
  key: StatusKey;
  label: string;
  phaseName: string;
  migrated: number;
  state: ProgressState;
}

const withRow = (
  rows: IProgressRow[] | null,
  key: StatusKey,
  change: (row: IProgressRow) => IProgressRow,
): IProgressRow[] | null => rows ? rows.map(row => (row.key === key ? change(row) : row)) : null;

const CONFIRM_CALLER = 'confirmKanbanImport';

const CONFIRM_MESSAGE = 'Essa importação ira inserir os compromissos em que você é responsável no Kanban, '
  + 'em lote, de acordo com os parâmetros informados, essa operação é irreversível';

// react-select sized like the calendar forms (0.675rem), keeping the default option highlight
const compactSelectStyles = {
  ...selectStyles,
  control: styles => ({ ...styles, minHeight: '2.3rem', height: '2.3rem', fontSize: '0.675rem' }),
  valueContainer: styles => ({ ...styles, height: '2.3rem', padding: '0 0.5rem' }),
  indicatorsContainer: styles => ({ ...styles, height: '2.3rem' }),
  placeholder: styles => ({ ...styles, fontSize: '0.675rem' }),
  singleValue: styles => ({ ...styles, fontSize: '0.675rem' }),
  menu: styles => ({ ...styles, fontSize: '0.675rem' }),
  noOptionsMessage: styles => ({ ...styles, fontSize: '0.675rem' }),
  // menu rendered in a portal: the modal body has overflow, otherwise the list gets clipped
  menuPortal: styles => ({ ...styles, zIndex: 99999, fontSize: '0.675rem' }),
};

// the multi grows with the selected tags, so it cannot have a fixed height
const compactMultiSelectStyles = {
  ...compactSelectStyles,
  control: styles => ({ ...styles, minHeight: '2.3rem', height: 'auto', fontSize: '0.675rem' }),
  valueContainer: styles => ({ ...styles, height: 'auto', padding: '0.2rem 0.5rem' }),
  indicatorsContainer: styles => ({ ...styles, height: 'auto' }),
  multiValue: styles => ({ ...styles, fontSize: '0.625rem' }),
  multiValueLabel: styles => ({ ...styles, fontSize: '0.625rem', padding: '0 0.2rem' }),
};

interface KanbanImportProps {
  onClose: () => void;
  onImported?: () => void;
  defaultPanelId?: number;
}

const KanbanImport: React.FC<KanbanImportProps> = ({ onClose, onImported, defaultPanelId }: KanbanImportProps) => {
  const { addToast } = useToast();
  const {
    isConfirmMessage,
    isCancelMessage,
    handleConfirmMessage,
    handleCancelMessage,
    handleCheckConfirm,
  } = useConfirmBox();
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
  const [period, setPeriod] = useState<PeriodValue>('12m');
  const [progress, setProgress] = useState<IProgressRow[] | null>(null);
  const [isMigrating, setIsMigrating] = useState(false);
  const [migrationError, setMigrationError] = useState('');
  const [showConfirm, setShowConfirm] = useState(false);
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

  // loads on open and re-runs the server search as the term is typed
  useDelay(() => {
    LoadSubjects(subjectTerm);
  }, [subjectTerm], 1000);

  // the confirm box is only mounted while showConfirm is on, so any answer that
  // arrives then is ours - the cancel button rewrites the caller to 'hasCanceled',
  // which is why the caller cannot be used to tell the answers apart
  useEffect(() => {
    if (showConfirm && isCancelMessage) {
      setShowConfirm(false);
      handleCancelMessage(false);
    }
  }, [isCancelMessage, showConfirm]);

  useEffect(() => {
    if (showConfirm && isConfirmMessage) {
      setShowConfirm(false);
      // reset before clearing the checkbox: handleConfirmMessage only writes while it is checked
      handleConfirmMessage(false);
      handleCheckConfirm(false);
      RunMigration();
    }
  }, [isConfirmMessage, showConfirm]);

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

      // phases belong to the panel, so a selection made for another panel is stale
      setPhaseByStatus({ inProgress: null, future: null, closed: null, overdue: null });
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

  const handleChangePhase = (statusKey: StatusKey, option: IOption | null) => {
    setPhaseByStatus(current => ({ ...current, [statusKey]: option }));
  };

  const totalMigrated = progress?.reduce((sum, row) => sum + row.migrated, 0) ?? 0;

  // statuses left without a phase are simply skipped, not reported as an error
  const selectedRows = STATUS_ROWS.filter(row => phaseByStatus[row.key]);

  const handleRequestImport = () => {
    if (!selectedPanel) {
      addToast({
        type: 'info',
        title: 'Atenção',
        description: 'Informe o painel para onde os compromissos serão importados',
      });
      return;
    }

    if (selectedRows.length === 0) {
      addToast({
        type: 'info',
        title: 'Atenção',
        description: 'Informe a etapa de destino de ao menos um status',
      });
      return;
    }

    // the confirm context is global and keeps the last answer given anywhere in
    // the app, so clear it before opening or the box answers itself
    handleCheckConfirm(true);
    handleConfirmMessage(false);
    handleCancelMessage(false);
    setShowConfirm(true);
  };

  const RunMigration = async () => {
    // empty = migrate appointments from every subject
    const subjectFilter = selectedSubjects.map(subject => subject.value).join('|');

    setMigrationError('');
    setIsMigrating(true);
    setProgress(selectedRows.map(row => ({
      key: row.key,
      label: row.label,
      phaseName: phaseByStatus[row.key]?.label ?? '',
      migrated: 0,
      state: 'pending',
    })));

    try {
      // one status per call, one stage at a time, looping until the stage is drained
      for (const row of selectedRows) {
        setProgress(current => withRow(current, row.key, item => ({ ...item, state: 'running' })));

        for (let batch = 0; batch < MAX_BATCHES_PER_STAGE; batch++) {
          const response = await api.post<number>('/KanbanEtapa/MigrarCompromissos', {
            KanbanStageId: phaseByStatus[row.key]?.value,
            StatusFilter: row.statusFilter,
            Period: period,
            SubjectFilter: subjectFilter,
            Token: token,
          });

          const affected = Number(response.data) || 0;

          if (affected <= 0)
            break;

          setProgress(current => withRow(current, row.key, item => ({ ...item, migrated: item.migrated + affected })));
        }

        setProgress(current => withRow(current, row.key, item => ({ ...item, state: 'done' })));
      }

      if (onImported)
        onImported();
    }
    catch {
      setProgress(current => current?.map(item => (
        item.state === 'running' ? { ...item, state: 'failed' } : item
      )) ?? null);

      setMigrationError('Houve uma falha durante a importação. Os compromissos já migrados foram mantidos no painel.');
    }
    finally {
      setIsMigrating(false);
    }
  };

  return (
  <>
    <ModalOverlay>
      <ImportModal onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title">
            <h4>Importar Compromissos para o Kanban</h4>
            <span>Esta função importa compromissos do calendário GOJUR para o modo Kanban. Serão importados os compromissos em que o seu usuário for o responsável.</span>
          </div>
          {!isMigrating && <FiX onClick={onClose} />}
        </div>

        {!progress && (
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
              Informe abaixo a etapa para onde deseja importar cada compromisso de acordo com o seu status.
              
            </label>
          
            <StatusTable>
              <div className="table-header">
                <span>Status</span>
                <span>Etapa</span>
              </div>

              {STATUS_ROWS.map(row => (
                <div className="table-row" key={row.key}>
                  <span className="status">
                    {row.label}
                    {row.hint && (
                      <FcAbout className="aboutMessage" title={row.hint} />
                    )}
                  </span>
                  <Select
                    options={phases}
                    styles={compactSelectStyles}
                    menuPortalTarget={document.body}
                    menuPosition="fixed"
                    value={phaseByStatus[row.key]}
                    isDisabled={!selectedPanel}
                    isClearable
                    placeholder="Não importar"
                    noOptionsMessage={() => 'Nenhuma etapa encontrada'}
                    onChange={(option: IOption | null) => handleChangePhase(row.key, option)}
                  />
                </div>
              ))}
            </StatusTable>
          </Field>

          <Field>
            <label>Período a partir de:</label>
            <span className="hint">
              Informe a data de início para os compromissos que serão importados.
            </span>

            <PeriodOptions>
              {PERIOD_OPTIONS.map(option => (
                <label key={option.value}>
                  <input
                    type="radio"
                    name="importPeriod"
                    checked={period === option.value}
                    onChange={() => setPeriod(option.value)}
                  />
                  {option.label}
                </label>
              ))}
            </PeriodOptions>
          </Field>

          <Field>
            <label>Assunto</label>
            <span className="hint">
              Selecione um ou mais assuntos; em branco importa compromissos de todos os assuntos.
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
        )}

        {!progress && (
        <div className="modal-footer">
          {isWaiting && <Loader size={18} color="#a9a9a9" />}

          <button
            type="button"
            className="buttonClick"
            disabled={isWaiting}
            onClick={handleRequestImport}
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
        )}

        {progress && (
          <ProgressScreen>
            <h4>
              {isMigrating
                ? 'Importando compromissos...'
                : migrationError ? 'Importação interrompida' : 'Importação concluída'}
            </h4>

            <span className="subtitle">
              {isMigrating
                ? 'Não feche esta janela enquanto a importação estiver em andamento.'
                : migrationError || 'Os compromissos foram distribuídos nas etapas do painel.'}
            </span>

            <ul>
              {progress.map(row => (
                <li key={row.key} className={row.state}>
                  <span className="icon">
                    {row.state === 'running' && <Loader size={12} color="#1da1f2" />}
                    {row.state === 'done' && <FiCheck />}
                    {row.state === 'failed' && <FiAlertCircle />}
                  </span>

                  <span className="name">
                    {row.label}
                    {row.phaseName && <small>{row.phaseName}</small>}
                  </span>

                  <span className="count">
                    {row.state === 'pending' ? 'Aguardando' : `${row.migrated} compromisso(s)`}
                  </span>
                </li>
              ))}
            </ul>

            <div className="total">
              Total importado: <strong>{totalMigrated}</strong>
            </div>

            {!isMigrating && (
              <button
                type="button"
                className="buttonClick"
                onClick={onClose}
              >
                Fechar
              </button>
            )}
          </ProgressScreen>
        )}
      </ImportModal>
    </ModalOverlay>

    {showConfirm && (
      <ConfirmBoxModal
        caller={CONFIRM_CALLER}
        title="Importar Compromissos"
        message={CONFIRM_MESSAGE}
        checkMessage="Estou ciente sobre a operação e desejo continuar"
        buttonOkText="Importar"
        useCheckBoxConfirm
        showButtonCancel
        showMainButtonCancel={false}
      />
    )}
  </>
  );
};

export default KanbanImport;
