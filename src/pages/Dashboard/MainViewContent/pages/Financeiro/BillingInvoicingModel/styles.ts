import styled from 'styled-components';

export const Container = styled.div`
  flex: 1;
  height: 100vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

export const ActionBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  padding: 0.5rem 1.5rem;
  background-color: var(--white-card);
  border-bottom: 1px solid var(--gray-outline);
  box-shadow: 0 1px 4px rgba(0,0,0,0.06);

  & > * {
    max-width: calc((700px - 1.5rem) / 3);
  }
`;

export const ColorButtonWrap = styled.div`
  position: relative;

  input[type='color'] {
    position: absolute;
    width: 0;
    height: 0;
    opacity: 0;
    pointer-events: none;
  }

  .color-swatch {
    display: inline-block;
    width: 14px;
    height: 14px;
    border-radius: 50%;
    border: 1.5px solid rgba(255,255,255,0.6);
    margin-left: 0.4rem;
    vertical-align: middle;
    flex-shrink: 0;
  }
`;

export const InvoiceLoadingWrap = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
  width: 100%;
`;

export const InvoiceWrapper = styled.div`
  flex: 1;
  overflow-y: auto;
  background-color: #dde1e7;
  display: flex;
  justify-content: center;
  padding: 2rem 1rem;

  ::-webkit-scrollbar { width: 0.25rem; }
  ::-webkit-scrollbar-thumb {
    border-radius: 0.5rem;
    background: var(--blue-light);
  }
`;

export const BottomBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  padding: 0.6rem 1.5rem;
  background-color: var(--white-card);
  border-top: 1px solid var(--gray-outline);
  box-shadow: 0 -1px 4px rgba(0,0,0,0.06);
`;

/* ─── Invoice Paper ─── */

export const InvoicePaper = styled.div`
  width: 700px;
  min-height: 900px;
  background: white;
  border-radius: 0.3rem;
  box-shadow: 0 6px 30px rgba(0,0,0,0.15);
  display: flex;
  flex-direction: column;
  font-family: 'Montserrat', sans-serif;
`;

export const InvoiceHeader = styled.div<{ bgColor: string }>`
  background-color: ${props => props.bgColor};
  padding: 1.75rem 2rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 100px;
  transition: background-color 0.2s ease;
`;

export const InvoiceHeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;

  img {
    height: 77px;
    max-width: 180px;
    object-fit: contain;
    background: rgba(255,255,255,0.9);
    border-radius: 0.2rem;
    padding: 4px;
  }
`;

export const InvoiceCompanyInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.2rem;

  strong {
    font-size: 1rem;
    font-weight: 700;
    color: white;
    text-shadow: 0 1px 3px rgba(0,0,0,0.25);
  }

  span {
    font-size: 0.68rem;
    color: rgba(255,255,255,0.88);
  }
`;

export const InvoiceBadge = styled.div`
  text-align: right;

  h2 {
    font-size: 1.5rem;
    font-weight: 700;
    color: white;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    text-shadow: 0 1px 3px rgba(0,0,0,0.2);
  }

  span {
    font-size: 0.7rem;
    color: rgba(255,255,255,0.85);
  }
`;

export const InvoiceBody = styled.div`
  flex: 1;
  padding: 1.75rem 2rem;
  display: flex;
  flex-direction: column;
  gap: 1.75rem;
`;

export const InvoiceMetaRow = styled.div`
  display: flex;
  justify-content: space-between;
  background-color: var(--gray);
  border-radius: 0.25rem;
  padding: 0.85rem 1.25rem;
`;

export const InvoiceMetaItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.2rem;

  span {
    font-size: 0.55rem;
    color: var(--grey);
    text-transform: uppercase;
    letter-spacing: 0.06em;
    font-weight: 600;
  }

  strong {
    font-size: 0.8rem;
    color: var(--primary);
  }
`;

export const InvoiceCustomerSection = styled.div`
  border-left: 3px solid var(--blue);
  padding-left: 0.85rem;

  p.section-title {
    font-size: 0.6rem;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    color: var(--blue);
    font-weight: 700;
    margin-bottom: 0.6rem;
  }

  p.field {
    font-size: 0.75rem;
    color: var(--secondary);
    margin-bottom: 0.25rem;

    span {
      font-weight: 600;
      color: var(--primary);
    }
  }
`;

export const DraggableSectionWrap = styled.div<{ isDragging: boolean }>`
  position: relative;
  margin-bottom: 1.75rem;
  border-radius: 0.25rem;
  border: 1.5px dashed ${props => props.isDragging ? 'var(--blue-light)' : 'transparent'};
  background-color: ${props => props.isDragging ? 'var(--blue-soft)' : 'transparent'};
  box-shadow: ${props => props.isDragging ? '0 6px 20px rgba(0,0,0,0.1)' : 'none'};
  transition: border-color 0.15s, background-color 0.15s, box-shadow 0.15s;
  padding-left: 1.5rem;
`;

export const SectionDragHandle = styled.div`
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  align-items: center;
  cursor: grab;
  color: var(--grey);
  opacity: 0.4;
  transition: opacity 0.15s;

  &:hover { opacity: 1; }
  &:active { cursor: grabbing; }

  svg {
    width: 1.1rem;
    height: 1.1rem;
  }
`;

export const InvoiceDescSection = styled.div`
  p.section-title {
    font-size: 0.6rem;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    color: var(--blue);
    font-weight: 700;
    margin-bottom: 0.6rem;
    border-bottom: 1px solid var(--gray-outline);
    padding-bottom: 0.4rem;
  }

  .desc-table {
    width: 100%;
    border-collapse: collapse;

    th {
      background-color: var(--blue);
      color: white;
      font-size: 0.65rem;
      padding: 0.5rem 0.75rem;
      text-align: left;
      font-weight: 600;
    }

    td {
      padding: 0.6rem 0.75rem;
      font-size: 0.75rem;
      color: var(--secondary);
      border-bottom: 1px solid #f0f0f0;
      vertical-align: top;
    }

    tbody tr:nth-child(odd) {
      background-color: #f7f9fc;
    }
  }
`;

export const SectionToggleRow = styled.div`
  display: flex;
  margin-top: 0.5rem;
  margin-bottom: 0.25rem;

  .toggle-btn {
    font-size: 0.62rem;
    font-family: Montserrat;
    color: var(--grey);
    border: 1px dashed var(--gray-outline);
    border-radius: 0.25rem;
    padding: 0.25rem 0.65rem;
    cursor: pointer;
    background: transparent;
    transition: color 0.15s, border-color 0.15s, background-color 0.15s;

    &:hover {
      color: var(--blue-twitter);
      border-color: var(--blue-light);
    }

    &.active {
      color: var(--blue-twitter);
      border-color: var(--blue-twitter);
      background-color: var(--blue-soft);
      font-weight: 600;
    }
  }
`;

export const InvoiceObservacao = styled.div`
  p.section-title {
    font-size: 0.6rem;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    color: var(--blue);
    font-weight: 700;
    margin-bottom: 0.5rem;
    border-bottom: 1px solid var(--gray-outline);
    padding-bottom: 0.4rem;
  }

  textarea {
    width: 100%;
    font-size: 0.75rem;
    font-family: poppins, montserrat, sans-serif;
    color: var(--secondary);
    padding: 0.6rem 0.75rem;
    border: 1px solid var(--gray-outline);
    border-radius: 0.25rem;
    resize: vertical;
    background-color: #fafafa;
    line-height: 1.5;

    &:focus {
      border-color: var(--blue-light);
      background-color: white;
      outline: none;
    }

    &::placeholder {
      color: var(--grey);
      font-size: 0.7rem;
    }
  }
`;

export const InvoiceFooter = styled.div`
  background-color: var(--gray);
  min-height: 56px;
  padding: 0 2rem;
  font-size: 0.62rem;
  color: var(--grey);
  text-align: center;
  border-top: 1px solid var(--gray-outline);
  letter-spacing: 0.02em;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;
