import React, { useCallback, useRef, useState } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { FiPlus, FiTrash2, FiClock, FiLayout, FiX, FiCheck, FiEdit2 } from 'react-icons/fi';
import { HeaderPage } from 'components/HeaderPage';
import { useHistory } from 'react-router-dom';
import {
  AddCardButton,
  AddCardForm,
  AddPhaseColumn,
  AppointmentCard,
  BoardLayout,
  CardsList,
  Container,
  Content,
  EmptyState,
  KanbanArea,
  ModalOverlay,
  PageHeader,
  PanelItem,
  PanelsModal,
  PhaseColumn,
  PhaseHeader,
} from './styles';

/* ─── Interfaces ─── */

interface ICard {
  id: number;
  phaseId: number;
  panelId: number;
  title: string;
  description: string;
  dateTime: string;
}

interface IPhase {
  id: number;
  panelId: number;
  name: string;
  color: string;
  order: number;
}

interface IPanel {
  id: number;
  name: string;
}

/* ─── Colors for auto-assignment ─── */
const PHASE_COLORS = [
  '#ffc9c9',
  '#fde68a',
  '#bbf7d0',
  '#bfdbfe',
  '#e9d5ff',
  '#fed7aa',
  '#a5f3fc',
];

let nextId = 100;
const uid = () => ++nextId;

/* ─── Initial demo data ─── */
const INITIAL_PANELS: IPanel[] = [
  { id: 1, name: 'Agenda Geral' },
  { id: 2, name: 'Audiências' },
];

const INITIAL_PHASES: IPhase[] = [
  { id: 1, panelId: 1, name: 'Aguardando', color: '#ffc9c9', order: 0 },
  { id: 2, panelId: 1, name: 'Fazendo', color: '#fde68a', order: 1 },
  { id: 3, panelId: 1, name: 'Concluído', color: '#bbf7d0', order: 2 },
  { id: 4, panelId: 2, name: 'A Realizar', color: '#bfdbfe', order: 0 },
  { id: 5, panelId: 2, name: 'Realizado', color: '#bbf7d0', order: 1 },
];

const INITIAL_CARDS: ICard[] = [
  {
    id: 1,
    phaseId: 1,
    panelId: 1,
    title: 'Audiência de conciliação',
    description: 'Audiência de conciliação entre as partes. Comparecer com documentos originais.',
    dateTime: '26/05 10:00',
  },
  {
    id: 2,
    phaseId: 2,
    panelId: 1,
    title: 'Prazo recursal',
    description: 'Interpor recurso de apelação no prazo legal.',
    dateTime: '28/05 17:00',
  },
  {
    id: 3,
    phaseId: 4,
    panelId: 2,
    title: 'Audiência de instrução',
    description: 'Oitiva de testemunhas arroladas pelas partes.',
    dateTime: '30/05 09:30',
  },
];

/* ─── Component ─── */

export default function AgendaKanban() {
  const history = useHistory();

  const [panels, setPanels] = useState<IPanel[]>(INITIAL_PANELS);
  const [phases, setPhases] = useState<IPhase[]>(INITIAL_PHASES);
  const [cards, setCards] = useState<ICard[]>(INITIAL_CARDS);

  const [activePanelId, setActivePanelId] = useState<number>(INITIAL_PANELS[0].id);

  // Panels modal
  const [showPanelsModal, setShowPanelsModal] = useState(false);

  // New panel form
  const [showAddPanel, setShowAddPanel] = useState(false);
  const [newPanelName, setNewPanelName] = useState('');

  // New phase form
  const [addingPhaseForPanel, setAddingPhaseForPanel] = useState<number | null>(null);
  const [newPhaseName, setNewPhaseName] = useState('');

  // Inline panel name editing
  const [editingPanelId, setEditingPanelId] = useState<number | null>(null);
  const [editingPanelName, setEditingPanelName] = useState('');

  // Inline phase name editing
  const [editingPhaseId, setEditingPhaseId] = useState<number | null>(null);
  const [editingPhaseName, setEditingPhaseName] = useState('');

  // New card form: keyed by phaseId
  const [addingCardInPhase, setAddingCardInPhase] = useState<number | null>(null);
  const [newCardTitle, setNewCardTitle] = useState('');
  const [newCardDesc, setNewCardDesc] = useState('');
  const [newCardDate, setNewCardDate] = useState('');

  const panelNameRef = useRef<HTMLInputElement>(null);
  const phaseNameRef = useRef<HTMLInputElement>(null);
  const cardTitleRef = useRef<HTMLInputElement>(null);

  /* ── Derived ── */
  const activePanel = panels.find((p) => p.id === activePanelId);
  const activePhases = phases
    .filter((ph) => ph.panelId === activePanelId)
    .sort((a, b) => a.order - b.order);

  /* ── Panel actions ── */
  const handleAddPanel = useCallback(() => {
    const name = newPanelName.trim();
    if (!name) return;
    const newPanel: IPanel = { id: uid(), name };
    setPanels((prev) => [...prev, newPanel]);
    setActivePanelId(newPanel.id);
    setNewPanelName('');
    setShowAddPanel(false);
  }, [newPanelName]);

  const handleDeletePanel = useCallback(
    (panelId: number) => {
      setPanels((prev) => prev.filter((p) => p.id !== panelId));
      setPhases((prev) => prev.filter((ph) => ph.panelId !== panelId));
      setCards((prev) => prev.filter((c) => c.panelId !== panelId));
      if (activePanelId === panelId) {
        setActivePanelId(panels.find((p) => p.id !== panelId)?.id ?? 0);
      }
    },
    [activePanelId, panels],
  );

  const handleSavePanelEdit = useCallback(() => {
    const name = editingPanelName.trim();
    if (name && editingPanelId !== null) {
      setPanels((prev) =>
        prev.map((p) => (p.id === editingPanelId ? { ...p, name } : p)),
      );
    }
    setEditingPanelId(null);
    setEditingPanelName('');
  }, [editingPanelId, editingPanelName]);

  const onPanelEditKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleSavePanelEdit();
    if (e.key === 'Escape') { setEditingPanelId(null); setEditingPanelName(''); }
  };

  /* ── Phase actions ── */
  const handleAddPhase = useCallback(() => {
    const name = newPhaseName.trim();
    if (!name || addingPhaseForPanel === null) return;
    const panelPhases = phases.filter((ph) => ph.panelId === addingPhaseForPanel);
    const colorIndex = panelPhases.length % PHASE_COLORS.length;
    const newPhase: IPhase = {
      id: uid(),
      panelId: addingPhaseForPanel,
      name,
      color: PHASE_COLORS[colorIndex],
      order: panelPhases.length,
    };
    setPhases((prev) => [...prev, newPhase]);
    setNewPhaseName('');
    setAddingPhaseForPanel(null);
  }, [newPhaseName, addingPhaseForPanel, phases]);

  const handleDeletePhase = useCallback((phaseId: number) => {
    setPhases((prev) => prev.filter((ph) => ph.id !== phaseId));
    setCards((prev) => prev.filter((c) => c.phaseId !== phaseId));
  }, []);

  const handleStartEditPhase = useCallback((phase: IPhase) => {
    setEditingPhaseId(phase.id);
    setEditingPhaseName(phase.name);
  }, []);

  const handleSavePhaseEdit = useCallback(() => {
    const name = editingPhaseName.trim();
    if (name && editingPhaseId !== null) {
      setPhases((prev) =>
        prev.map((ph) => (ph.id === editingPhaseId ? { ...ph, name } : ph)),
      );
    }
    setEditingPhaseId(null);
    setEditingPhaseName('');
  }, [editingPhaseId, editingPhaseName]);

  const onPhaseEditKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleSavePhaseEdit();
    if (e.key === 'Escape') { setEditingPhaseId(null); setEditingPhaseName(''); }
  };

  /* ── Card actions ── */
  const handleAddCard = useCallback(() => {
    const title = newCardTitle.trim();
    if (!title || addingCardInPhase === null) return;
    const phase = phases.find((ph) => ph.id === addingCardInPhase);
    if (!phase) return;
    const newCard: ICard = {
      id: uid(),
      phaseId: addingCardInPhase,
      panelId: phase.panelId,
      title,
      description: newCardDesc.trim(),
      dateTime: newCardDate,
    };
    setCards((prev) => [...prev, newCard]);
    setNewCardTitle('');
    setNewCardDesc('');
    setNewCardDate('');
    setAddingCardInPhase(null);
  }, [newCardTitle, newCardDesc, newCardDate, addingCardInPhase, phases]);

  const handleDeleteCard = useCallback((cardId: number) => {
    setCards((prev) => prev.filter((c) => c.id !== cardId));
  }, []);

  const onDragEnd = useCallback((result: DropResult) => {
    const { source, destination, draggableId } = result;
    if (!destination) return;
    if (source.droppableId === destination.droppableId && source.index === destination.index) return;

    const cardId = parseInt(draggableId, 10);
    const destPhaseId = parseInt(destination.droppableId, 10);

    setCards((prev) => {
      // Remove card from its current position
      const withoutCard = prev.filter((c) => c.id !== cardId);
      const moved = prev.find((c) => c.id === cardId);
      if (!moved) return prev;

      const updated = { ...moved, phaseId: destPhaseId };

      // Insert at the destination index within the target phase
      const destPhaseCards = withoutCard.filter((c) => c.phaseId === destPhaseId);
      const otherCards = withoutCard.filter((c) => c.phaseId !== destPhaseId);

      destPhaseCards.splice(destination.index, 0, updated);

      return [...otherCards, ...destPhaseCards];
    });
  }, []);

  /* ── Keyboard shortcuts ── */
  const onPanelKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleAddPanel();
    if (e.key === 'Escape') { setShowAddPanel(false); setNewPanelName(''); }
  };

  const onPhaseKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleAddPhase();
    if (e.key === 'Escape') { setAddingPhaseForPanel(null); setNewPhaseName(''); }
  };

  const onCardKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleAddCard();
    if (e.key === 'Escape') { setAddingCardInPhase(null); setNewCardTitle(''); setNewCardDesc(''); setNewCardDate(''); }
  };

  /* ── Render ── */
  return (
    <Container>
      <HeaderPage />

      <Content>
        <PageHeader>
          <div className="left">
            <button
              type="button"
              className="buttonClick"
              onClick={() => history.push('/calendar')}
            >
              Retornar
            </button>
          </div>
          <h3>{activePanel?.name ?? ''}</h3>
          <div className="right">
            <button
              type="button"
              className="buttonClick"
              onClick={() => setShowPanelsModal(true)}
            >
              <FiLayout size={12} /> Painéis
            </button>
            <button
              type="button"
              className="buttonClick"
              onClick={() => { setShowAddPanel(true); setShowPanelsModal(true); setTimeout(() => panelNameRef.current?.focus(), 50); }}
            >
              <FiPlus size={12} /> Novo Painel
            </button>
          </div>
        </PageHeader>

        {/* ── Panels modal ── */}
        {showPanelsModal && (
          <ModalOverlay onClick={() => { setShowPanelsModal(false); setShowAddPanel(false); setNewPanelName(''); }}>
            <PanelsModal onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h4>Painéis</h4>
                <FiX onClick={() => { setShowPanelsModal(false); setShowAddPanel(false); setNewPanelName(''); }} />
              </div>

              <div className="modal-body">
                {panels.map((panel) => (
                  <PanelItem
                    key={panel.id}
                    active={panel.id === activePanelId}
                    onClick={() => { if (editingPanelId !== panel.id) { setActivePanelId(panel.id); setShowPanelsModal(false); } }}
                  >
                    {editingPanelId === panel.id ? (
                      <input
                        autoFocus
                        value={editingPanelName}
                        onChange={(e) => setEditingPanelName(e.target.value)}
                        onKeyDown={onPanelEditKeyDown}
                        onBlur={handleSavePanelEdit}
                        onClick={(e) => e.stopPropagation()}
                        style={{
                          flex: 1,
                          border: 'none',
                          borderBottom: '1px solid var(--blue)',
                          background: 'transparent',
                          fontSize: '0.8rem',
                          fontFamily: 'Poppins, Montserrat, sans-serif',
                          outline: 'none',
                          color: 'var(--secondary)',
                        }}
                      />
                    ) : (
                      <span style={{ flex: 1 }}>{panel.name}</span>
                    )}
                    <span className="panel-actions">
                      <FiEdit2
                        title="Renomear painel"
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingPanelId(panel.id);
                          setEditingPanelName(panel.name);
                        }}
                      />
                      <FiTrash2
                        title="Excluir painel"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeletePanel(panel.id);
                        }}
                      />
                    </span>
                  </PanelItem>
                ))}
              </div>

              <div className="modal-footer">
                {showAddPanel ? (
                  <>
                    <input
                      ref={panelNameRef}
                      autoFocus
                      placeholder="Nome do novo painel"
                      value={newPanelName}
                      onChange={(e) => setNewPanelName(e.target.value)}
                      onKeyDown={onPanelKeyDown}
                    />
                    <button type="button" className="buttonClick" onClick={handleAddPanel}>
                      <FiCheck size={12} /> Salvar
                    </button>
                    <button
                      type="button"
                      className="buttonLinkClick"
                      onClick={() => { setShowAddPanel(false); setNewPanelName(''); }}
                    >
                      <FiX size={12} />
                    </button>
                  </>
                ) : (
                  <button
                    type="button"
                    className="buttonClick"
                    style={{ width: '100%', justifyContent: 'center', display: 'flex', gap: '0.3rem', alignItems: 'center' }}
                    onClick={() => { setShowAddPanel(true); setTimeout(() => panelNameRef.current?.focus(), 50); }}
                  >
                    <FiPlus size={12} /> Novo Painel
                  </button>
                )}
              </div>
            </PanelsModal>
          </ModalOverlay>
        )}

        <BoardLayout>
          {activePanel ? (
            <DragDropContext onDragEnd={onDragEnd}>
            <KanbanArea>
              {activePhases.map((phase) => {
                const phaseCards = cards.filter((c) => c.phaseId === phase.id);
                const isAddingHere = addingCardInPhase === phase.id;

                return (
                  <PhaseColumn key={phase.id}>
                    <PhaseHeader color={phase.color}>
                      <span className="phase-title">
                        {editingPhaseId === phase.id ? (
                          <input
                            autoFocus
                            value={editingPhaseName}
                            onChange={(e) => setEditingPhaseName(e.target.value)}
                            onKeyDown={onPhaseEditKeyDown}
                            onBlur={handleSavePhaseEdit}
                          />
                        ) : (
                          <span
                            title="Clique para renomear"
                            style={{ cursor: 'pointer' }}
                            onClick={() => handleStartEditPhase(phase)}
                          >
                            {phase.name}
                          </span>
                        )}
                      </span>
                      <span className="phase-count">{phaseCards.length}</span>
                      <FiTrash2
                        title="Excluir etapa"
                        onClick={() => handleDeletePhase(phase.id)}
                      />
                    </PhaseHeader>

                    <Droppable droppableId={String(phase.id)}>
                      {(provided, snapshot) => (
                        <CardsList
                          ref={provided.innerRef}
                          {...provided.droppableProps}
                          style={{ background: snapshot.isDraggingOver ? '#f0f7ff' : undefined }}
                        >
                          {phaseCards.map((card, index) => (
                            <Draggable key={card.id} draggableId={String(card.id)} index={index}>
                              {(drag, dragSnapshot) => (
                                <AppointmentCard
                                  ref={drag.innerRef}
                                  {...drag.draggableProps}
                                  {...drag.dragHandleProps}
                                  style={{
                                    ...drag.draggableProps.style,
                                    opacity: dragSnapshot.isDragging ? 0.85 : 1,
                                    boxShadow: dragSnapshot.isDragging
                                      ? '0 8px 24px rgba(2,6,23,0.18)'
                                      : undefined,
                                  }}
                                >
                                  <div className="card-title">{card.title}</div>
                                  {card.description && (
                                    <div className="card-description">{card.description}</div>
                                  )}
                                  <div className="card-meta">
                                    {card.dateTime && (
                                      <>
                                        <FiClock />
                                        <span>{card.dateTime}</span>
                                      </>
                                    )}
                                    <FiTrash2
                                      style={{ marginLeft: 'auto', cursor: 'pointer', color: '#fca5a5' }}
                                      title="Excluir compromisso"
                                      onClick={() => handleDeleteCard(card.id)}
                                    />
                                  </div>
                                </AppointmentCard>
                              )}
                            </Draggable>
                          ))}
                          {provided.placeholder}
                        </CardsList>
                      )}
                    </Droppable>

                    {isAddingHere ? (
                      <AddCardForm>
                        <input
                          ref={cardTitleRef}
                          autoFocus
                          placeholder="Título do compromisso"
                          value={newCardTitle}
                          onChange={(e) => setNewCardTitle(e.target.value)}
                          onKeyDown={onCardKeyDown}
                        />
                        <textarea
                          rows={2}
                          placeholder="Descrição (opcional)"
                          value={newCardDesc}
                          onChange={(e) => setNewCardDesc(e.target.value)}
                        />
                        <input
                          type="datetime-local"
                          value={newCardDate}
                          onChange={(e) => setNewCardDate(e.target.value)}
                        />
                        <div className="form-actions">
                          <button type="button" className="buttonClick" onClick={handleAddCard}>
                            <FiCheck size={12} /> Salvar
                          </button>
                          <button
                            type="button"
                            className="buttonLinkClick"
                            onClick={() => {
                              setAddingCardInPhase(null);
                              setNewCardTitle('');
                              setNewCardDesc('');
                              setNewCardDate('');
                            }}
                          >
                            <FiX size={12} />
                          </button>
                        </div>
                      </AddCardForm>
                    ) : (
                      <AddCardButton
                        type="button"
                        onClick={() => {
                          setAddingCardInPhase(phase.id);
                          setTimeout(() => cardTitleRef.current?.focus(), 50);
                        }}
                      >
                        <FiPlus /> Criar Compromisso
                      </AddCardButton>
                    )}
                  </PhaseColumn>
                );
              })}

              {/* ── Add phase column ── */}
              <AddPhaseColumn>
                {addingPhaseForPanel === activePanelId ? (
                  <div className="add-phase-form">
                    <input
                      ref={phaseNameRef}
                      autoFocus
                      placeholder="Nome da etapa"
                      value={newPhaseName}
                      onChange={(e) => setNewPhaseName(e.target.value)}
                      onKeyDown={onPhaseKeyDown}
                    />
                    <div className="form-actions">
                      <button type="button" className="buttonClick" onClick={handleAddPhase}>
                        <FiCheck size={12} /> Salvar
                      </button>
                      <button
                        type="button"
                        className="buttonLinkClick"
                        onClick={() => { setAddingPhaseForPanel(null); setNewPhaseName(''); }}
                      >
                        Cancelar
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    type="button"
                    className="add-phase-btn"
                    onClick={() => {
                      setAddingPhaseForPanel(activePanelId);
                      setTimeout(() => phaseNameRef.current?.focus(), 50);
                    }}
                  >
                    <FiPlus /> Nova Etapa
                  </button>
                )}
              </AddPhaseColumn>
            </KanbanArea>
            </DragDropContext>
          ) : (
            <EmptyState>
              <FiLayout />
              <p>Nenhum painel selecionado. Crie um novo painel para começar.</p>
            </EmptyState>
          )}
        </BoardLayout>
      </Content>
    </Container>
  );
}
