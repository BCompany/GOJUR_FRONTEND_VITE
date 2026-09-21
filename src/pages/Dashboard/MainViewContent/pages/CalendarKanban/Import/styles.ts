import styled from 'styled-components';

export const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

export const ImportModal = styled.div`
  background: var(--white);
  border: 1px solid var(--blue-twitter);
  border-radius: 0.5rem;
  box-shadow: 1px 1px 4px 0.5px rgba(0, 0, 0, 0.15);
  width: 30rem;
  max-width: 95vw;
  min-height: 26rem;
  max-height: 94vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  font-family: Montserrat;
  font-size: 0.665rem;
  color: var(--secondary);

  .modal-header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 0.75rem;
    padding: 0.6rem 0.85rem;
    border-bottom: 1px solid #e2e8f0;

    .modal-title {
      display: flex;
      flex-direction: column;
      gap: 0.15rem;

      span {
        font-size: 0.625rem;
        font-weight: 400;
        color: #94a3b8;
      }
    }

    h4 {
      font-size: 0.7rem;
      font-weight: 600;
      color: var(--primary);
    }

    svg {
      flex-shrink: 0;
      margin-top: 0.1rem;
      cursor: pointer;
      color: #94a3b8;
      width: 0.85rem;
      height: 0.85rem;

      &:hover { color: var(--red); }
    }
  }

  .modal-body {
    flex: 1;
    overflow-y: auto;
    padding: 0.85rem;
    display: flex;
    flex-direction: column;
    gap: 0.9rem;
  }

  .modal-footer {
    padding: 0.6rem 0.85rem;
    border-top: 1px solid #e2e8f0;
    display: flex;
    gap: 0.4rem;
    align-items: center;
    justify-content: flex-end;
  }
`;

export const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;

  label {
    font-size: 0.675rem;
    font-weight: 600;
    color: var(--secondary);
  }

  span.hint {
    font-size: 0.625rem;
    font-weight: 400;
    color: #94a3b8;
  }
`;

export const StatusTable = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.35rem;

  .table-header {
    display: grid;
    grid-template-columns: 8rem 1fr;
    gap: 0.5rem;
    padding-bottom: 0.2rem;
    border-bottom: 1px solid #e2e8f0;

    span {
      font-size: 0.625rem;
      font-weight: 600;
      color: var(--blue-twitter);
    }
  }

  .table-row {
    display: grid;
    grid-template-columns: 8rem 1fr;
    gap: 0.5rem;
    align-items: center;

    span.status {
      display: flex;
      align-items: center;
      gap: 0.25rem;
      font-size: 0.665rem;
      color: var(--secondary);

      .aboutMessage {
        width: 0.85rem;
        flex-shrink: 0;
        cursor: pointer;
      }
    }
  }
`;

export const PeriodOptions = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  margin-top: 0.15rem;

  label {
    display: flex;
    align-items: center;
    gap: 0.4rem;
    font-size: 0.665rem;
    font-weight: 400;
    color: var(--secondary);
    cursor: pointer;

    input {
      cursor: pointer;
      margin: 0;
      width: 0.75rem;
      height: 0.75rem;
    }
  }
`;
