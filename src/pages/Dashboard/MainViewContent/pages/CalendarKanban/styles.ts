import styled from 'styled-components';

export const Container = styled.div`
  background-color: transparent;
  color: #1e293b;
  min-height: 100vh;
  width: 95vw;
  margin: 0 auto;
  overflow-y: auto;
`;

export const Content = styled.div`
  flex: 1;
  padding: 0.4rem 2rem;
  height: 100%;
`;

export const PageHeader = styled.header`
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  margin-bottom: 1rem;

  h3 {
    font-size: 1.1rem;
    font-weight: 600;
    color: var(--primary);
    text-align: center;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .left {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .right {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 0.5rem;
  }
`;

export const TaskBar = styled.div`
  display: flex;
  box-shadow: 1px 1px 4px 0.5px rgba(0, 0, 0, 0.15);
  margin-bottom: 0.75rem;

  > div {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    font-size: 0.65rem;
    font-family: Montserrat;
    background-color: var(--white);
    width: 100%;
    padding: 10px 8px 12px;
    gap: 0.5rem;
  }

  .date-range {
    display: flex;
    align-items: center;
    gap: 0.35rem;

    label {
      font-size: 0.65rem;
      color: var(--secondary);
      white-space: nowrap;
    }

    input[type='date'] {
      font-size: 0.65rem;
      font-family: Montserrat;
      color: var(--secondary);
      border: 1px solid #cbd5e1;
      border-radius: 0.4rem;
      padding: 0.25rem 0.4rem;
      outline: none;
      cursor: pointer;

      &:focus {
        border-color: var(--blue);
      }
    }
  }
`;

export const BoardLayout = styled.div`
  height: calc(100vh - 140px);
`;

/* ── PANELS MODAL ── */
export const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

export const PanelsModal = styled.div`
  background: white;
  border-radius: 0.75rem;
  box-shadow: 0 8px 32px rgba(2, 6, 23, 0.18);
  width: 380px;
  max-height: 520px;
  display: flex;
  flex-direction: column;
  overflow: hidden;

  .modal-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1rem 1.25rem;
    border-bottom: 1px solid #e2e8f0;

    h4 {
      font-size: 0.9rem;
      font-weight: 600;
      color: var(--primary);
    }

    svg {
      cursor: pointer;
      color: #94a3b8;
      width: 1rem;
      height: 1rem;

      &:hover { color: var(--red); }
    }
  }

  .modal-body {
    flex: 1;
    overflow-y: auto;
    padding: 0.75rem 1rem;
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
  }

  .modal-footer {
    padding: 0.75rem 1rem;
    border-top: 1px solid #e2e8f0;
    display: flex;
    gap: 0.5rem;
    align-items: center;

    input {
      flex: 1;
      padding: 0.4rem 0.6rem;
      border: 1px solid #cbd5e1;
      border-radius: 0.4rem;
      font-size: 0.75rem;
      font-family: Poppins, Montserrat, sans-serif;
      color: var(--secondary);

      &:focus {
        outline: none;
        border-color: var(--blue);
      }
    }
  }
`;

/* ── PANEL SIDEBAR ── */
export const PanelSidebar = styled.aside`
  background: white;
  border-radius: 0.75rem;
  box-shadow: 0 1px 3px rgba(2, 6, 23, 0.08);
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  overflow-y: auto;

  h5 {
    font-size: 0.7rem;
    font-weight: 600;
    color: #64748b;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    margin-bottom: 0.25rem;
  }
`;

export const PanelItem = styled.div<{ active: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.5rem 0.75rem;
  border-radius: 0.5rem;
  cursor: pointer;
  font-size: 0.8rem;
  font-weight: ${({ active }) => (active ? '600' : '400')};
  background: ${({ active }) => (active ? 'var(--blue-soft)' : 'transparent')};
  color: ${({ active }) => (active ? 'var(--blue)' : 'var(--secondary)')};
  border: 1px solid ${({ active }) => (active ? 'var(--blue)' : '#e2e8f0')};
  transition: all 0.15s ease;

  &:hover {
    background: #f1f5f9;
  }

  .panel-actions {
    display: none;
    gap: 0.25rem;
    align-items: center;
  }

  &:hover .panel-actions {
    display: flex;
  }

  svg {
    width: 0.85rem;
    height: 0.85rem;
    color: #94a3b8;
    cursor: pointer;

    &:hover {
      color: var(--orange);
    }
  }
`;

export const AddPanelForm = styled.div`
  margin-top: auto;
  padding-top: 0.75rem;
  border-top: 1px solid #e2e8f0;

  input {
    width: 100%;
    padding: 0.4rem 0.6rem;
    border: 1px solid #cbd5e1;
    border-radius: 0.4rem;
    font-size: 0.75rem;
    font-family: Poppins, Montserrat, sans-serif;
    color: var(--secondary);
    margin-bottom: 0.4rem;

    &:focus {
      outline: none;
      border-color: var(--blue);
    }
  }

  .form-actions {
    display: flex;
    gap: 0.4rem;
  }
`;

/* ── KANBAN AREA ── */
export const KanbanArea = styled.div`
  display: flex;
  gap: 0.9rem;
  overflow-x: auto;
  overflow-y: hidden;
  padding-bottom: 0.5rem;
  align-items: flex-start;

  &::-webkit-scrollbar {
    height: 6px;
  }
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  &::-webkit-scrollbar-thumb {
    background: #cbd5e1;
    border-radius: 9999px;
  }
`;

/* ── PHASE COLUMN ── */
export const PhaseColumn = styled.div`
  min-width: 240px;
  max-width: 240px;
  background: white;
  border-radius: 0.75rem;
  box-shadow: 0 1px 3px rgba(2, 6, 23, 0.08);
  display: flex;
  flex-direction: column;
  max-height: calc(100vh - 160px);
`;

export const PhaseHeader = styled.div<{ color: string }>`
  padding: 0.6rem 0.75rem;
  border-radius: 0.75rem 0.75rem 0 0;
  background: ${({ color }) => color};
  display: flex;
  align-items: center;
  justify-content: space-between;

  .phase-title {
    font-size: 0.75rem;
    font-weight: 600;
    color: #1e293b;
    flex: 1;

    input {
      background: transparent;
      border: none;
      border-bottom: 1px solid rgba(0, 0, 0, 0.2);
      font-size: 0.75rem;
      font-weight: 600;
      font-family: Poppins, Montserrat, sans-serif;
      width: 100%;
      outline: none;
    }
  }

  .phase-count {
    font-size: 0.65rem;
    color: #64748b;
    background: rgba(255, 255, 255, 0.6);
    border-radius: 9999px;
    padding: 0 0.4rem;
    margin-left: 0.4rem;
  }

  svg {
    width: 0.85rem;
    height: 0.85rem;
    color: #64748b;
    cursor: pointer;
    margin-left: 0.3rem;

    &:hover {
      color: var(--red);
    }
  }
`;

export const ColorPickerWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

export const ColorDot = styled.button<{ color: string }>`
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none;
  cursor: pointer;
  margin-left: 0.3rem;
  flex-shrink: 0;
  padding: 0;

  svg {
    width: 0.95rem;
    height: 0.95rem;
    color: #64748b;
    transition: transform 0.15s ease;
  }

  &:hover svg {
    transform: scale(1.25);
    filter: drop-shadow(0 0 2px rgba(0,0,0,0.5));
  }
`;

export const ColorPopover = styled.div`
  position: absolute;
  top: calc(100% + 6px);
  left: 50%;
  transform: translateX(-50%);
  background: white;
  border-radius: 0.5rem;
  box-shadow: 0 4px 16px rgba(2, 6, 23, 0.16);
  padding: 0.5rem;
  display: flex;
  flex-wrap: wrap;
  gap: 0.35rem;
  width: 130px;
  z-index: 50;
`;

export const ColorSwatch = styled.button<{ color: string; selected: boolean }>`
  width: 1.25rem;
  height: 1.25rem;
  border-radius: 50%;
  background: ${({ color }) => color};
  border: 2px solid ${({ selected }) => (selected ? '#1e293b' : 'transparent')};
  cursor: pointer;
  transition: transform 0.15s ease;

  &:hover {
    transform: scale(1.2);
  }
`;

export const CardsList = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 0.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;

  &::-webkit-scrollbar {
    width: 4px;
  }
  &::-webkit-scrollbar-thumb {
    background: #e2e8f0;
    border-radius: 9999px;
  }
`;

export const AppointmentCard = styled.div`
  background: #fafafa;
  border: 1px solid #e2e8f0;
  border-left: 3px solid var(--blue-twitter);
  border-radius: 0.5rem;
  padding: 0.6rem 0.7rem;
  cursor: pointer;
  transition: box-shadow 0.15s ease, transform 0.15s ease;
  font-size: 0.7rem;

  &:hover {
    box-shadow: 0 4px 12px rgba(2, 6, 23, 0.1);
    transform: translateY(-2px);
  }

  .card-title {
    font-weight: 600;
    color: var(--primary);
    margin-bottom: 0.25rem;
    font-size: 0.75rem;
  }

  .card-description {
    color: #64748b;
    font-size: 0.65rem;
    line-height: 1.4;
    margin-bottom: 0.35rem;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .card-meta {
    display: flex;
    align-items: center;
    gap: 0.35rem;
    color: #94a3b8;
    font-size: 0.625rem;

    svg {
      width: 0.7rem;
      height: 0.7rem;
    }
  }
`;

export const AddCardButton = styled.button`
  width: 100%;
  padding: 0.5rem;
  border-radius: 0 0 0.75rem 0.75rem;
  background: transparent;
  border-top: 1px solid #e2e8f0;
  font-size: 0.7rem;
  color: #64748b;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.3rem;
  cursor: pointer;
  transition: background 0.15s ease;

  &:hover {
    background: #f8fafc;
    color: var(--blue);
  }

  svg {
    width: 0.75rem;
    height: 0.75rem;
  }
`;

export const AddCardForm = styled.div`
  padding: 0.5rem;
  border-top: 1px solid #e2e8f0;
  background: #f8fafc;
  border-radius: 0 0 0.75rem 0.75rem;

  input,
  textarea {
    width: 100%;
    padding: 0.35rem 0.5rem;
    border: 1px solid #cbd5e1;
    border-radius: 0.35rem;
    font-size: 0.7rem;
    font-family: Poppins, Montserrat, sans-serif;
    color: var(--secondary);
    margin-bottom: 0.35rem;
    resize: none;

    &:focus {
      outline: none;
      border-color: var(--blue);
    }
  }

  .form-actions {
    display: flex;
    gap: 0.35rem;
    align-items: center;
  }
`;

export const AddPhaseColumn = styled.div`
  min-width: 200px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  gap: 0.5rem;

  .add-phase-btn {
    width: 100%;
    padding: 0.6rem 1rem;
    border-radius: 0.75rem;
    border: 2px dashed #cbd5e1;
    background: transparent;
    font-size: 0.75rem;
    color: #94a3b8;
    display: flex;
    align-items: center;
    gap: 0.4rem;
    cursor: pointer;
    transition: all 0.15s ease;

    &:hover {
      border-color: var(--blue);
      color: var(--blue);
      background: var(--blue-soft);
    }

    svg {
      width: 0.85rem;
      height: 0.85rem;
    }
  }

  .add-phase-form {
    width: 100%;
    background: white;
    border-radius: 0.75rem;
    box-shadow: 0 1px 3px rgba(2, 6, 23, 0.08);
    padding: 0.75rem;

    input {
      width: 100%;
      padding: 0.4rem 0.6rem;
      border: 1px solid #cbd5e1;
      border-radius: 0.4rem;
      font-size: 0.75rem;
      font-family: Poppins, Montserrat, sans-serif;
      color: var(--secondary);
      margin-bottom: 0.5rem;

      &:focus {
        outline: none;
        border-color: var(--blue);
      }
    }

    .form-actions {
      display: flex;
      gap: 0.4rem;
    }
  }
`;

export const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #94a3b8;
  font-size: 0.8rem;
  gap: 0.75rem;
  text-align: center;

  svg {
    width: 2.5rem;
    height: 2.5rem;
    color: #cbd5e1;
  }

  p {
    max-width: 240px;
    line-height: 1.5;
  }
`;
