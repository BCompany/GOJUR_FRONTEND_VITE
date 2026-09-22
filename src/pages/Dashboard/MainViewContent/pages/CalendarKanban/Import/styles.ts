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
  position: relative;
  background: var(--white);
  border: 1px solid var(--blue-twitter);
  border-radius: 0.5rem;
  box-shadow: 1px 1px 4px 0.5px rgba(0, 0, 0, 0.15);
  width: 30rem;
  max-width: 95vw;
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

      span {
        font-size: 0.625rem;
        font-weight: 400;
        color: #94a3b8;
      }

      /* same title-to-caption rhythm used by Field */
      h4 + span {
        margin-top: 0.5rem;
        text-align: justify
      }

      /* sits inline after the last word, so it has to undo the close-icon rules
         that .modal-header svg applies to every icon in the header */
      .aboutMessage {
        display: inline;
        vertical-align: -0.15rem;
        margin: 0 0 0 0.25rem;
        width: 0.8rem;
        height: 0.8rem;
        cursor: help;

        &:hover { color: inherit; }
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

/* Spacing comes from adjacent-sibling margins instead of gap: gap applies a
   single value to every child, and the label/hint pair has to sit tighter than
   the caption-to-control distance. Do not add gap back here - it would stack on
   top of these margins. */
export const Field = styled.div`
  display: flex;
  flex-direction: column;

  label {
    font-size: 0.675rem;
    font-weight: 500;
    color: var(--secondary);
  }

  span.hint {
    font-size: 0.600rem;
    font-weight: 400;
    color: #94a3b8;
  }

  /* the hint belongs to the label, so it stays close to it */
  label + span.hint {
    margin-top: 0.1rem;
  }

  /* no hint: the control comes right after the label */
  label + *:not(span.hint) {
    margin-top: 0.5rem;
  }

  /* after the hint: separates the whole caption block from the control */
  span.hint + * {
    margin-top: 1rem;
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

/* Replaces the form while the migration runs, one line per status. It sits in
   the normal flow, not over the form, so the modal shrinks to this content. */
export const ProgressScreen = styled.div`
  background: var(--white);
  display: flex;
  flex-direction: column;
  padding: 0.85rem;

  h4 {
    font-size: 0.7rem;
    font-weight: 600;
    color: var(--primary);
  }

  span.subtitle {
    font-size: 0.625rem;
    color: #94a3b8;
  }

  /* same title/caption rhythm used by Field */
  h4 + span.subtitle {
    margin-top: 0.1rem;
  }

  h4 + *:not(span.subtitle) {
    margin-top: 0.35rem;
  }

  span.subtitle + * {
    margin-top: 0.4rem;
  }

  ul {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 0.35rem;
  }

  li {
    display: grid;
    grid-template-columns: 1.1rem 1fr auto;
    gap: 0.4rem;
    align-items: center;
    padding: 0.35rem 0.5rem;
    border-radius: 0.35rem;
    background: #f8fafc;
    font-size: 0.665rem;
    color: var(--secondary);

    &.pending { opacity: 0.55; }
    &.done .count { color: var(--blue-twitter); }
    &.failed .count { color: var(--red); }
  }

  .icon {
    display: flex;
    align-items: center;
    justify-content: center;

    svg {
      width: 0.8rem;
      height: 0.8rem;
    }
  }

  .done .icon svg { color: var(--blue-twitter); }
  .failed .icon svg { color: var(--red); }

  .name {
    display: flex;
    flex-direction: column;

    small {
      font-size: 0.6rem;
      color: #94a3b8;
    }
  }

  .count {
    font-size: 0.625rem;
    white-space: nowrap;
  }

  .total {
    margin-top: 0.4rem;
    font-size: 0.665rem;
    color: var(--secondary);

    strong { color: var(--primary); }
  }

  > button {
    align-self: flex-end;
    margin-top: 0.5rem;
    margin-right: 0;
    float: none;
  }
`;
