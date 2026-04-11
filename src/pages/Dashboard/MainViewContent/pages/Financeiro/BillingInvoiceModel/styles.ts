import styled from 'styled-components';

export const Container = styled.div`
  flex: 1;
  height: 100vh;
  overflow: auto;
  padding: 0 1.5rem;
`;

export const TaskBar = styled.div`
  display: flex;
  align-items: center;
  padding: 0.5rem 0;
  gap: 0.5rem;
`;

export const TwoColumns = styled.div`
  display: flex;
  gap: 1.5rem;
  height: calc(100vh - 120px);
`;

export const EditorPanel = styled.div`
  width: 40%;
  min-width: 340px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding-bottom: 1rem;

  ::-webkit-scrollbar { width: 0.2rem; }
  ::-webkit-scrollbar-thumb {
    border-radius: 0.5rem;
    background: var(--orange);
  }
`;

export const PreviewPanel = styled.div`
  flex: 1;
  overflow-y: auto;
  background-color: #e8eaed;
  border-radius: 0.25rem;
  padding: 1.5rem;
  display: flex;
  justify-content: center;

  ::-webkit-scrollbar { width: 0.2rem; }
  ::-webkit-scrollbar-thumb {
    border-radius: 0.5rem;
    background: var(--blue-light);
  }
`;

export const SectionCard = styled.div`
  background-color: var(--white-card);
  border-radius: 0.25rem;
  box-shadow: 1px 1px 4px 0.5px rgba(0,0,0,0.1);
  overflow: hidden;

  header {
    background-color: var(--blue-soft);
    padding: 0.4rem 0.75rem;
    font-size: 0.675rem;
    font-weight: 600;
    color: var(--blue);
    font-family: Montserrat;
    letter-spacing: 0.03em;
    text-transform: uppercase;
  }
`;

export const SectionBody = styled.div`
  padding: 0.75rem;
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
`;

export const FieldRow = styled.div`
  display: flex;
  gap: 0.75rem;
  align-items: flex-end;
`;

export const FieldGroup = styled.div<{ flex?: number }>`
  display: flex;
  flex-direction: column;
  flex: ${props => props.flex ?? 1};

  label {
    font-size: 0.6rem;
    color: var(--secondary);
    margin-bottom: 0.2rem;
    font-family: Montserrat;
  }

  input[type='text'],
  input[type='email'],
  input[type='date'],
  input[type='number'] {
    font-size: 0.675rem;
    padding: 0.3rem 0.4rem;
    border-bottom: 1px solid rgba(0,0,0,0.15);
    background-color: rgba(255,255,255,0.5);
    color: var(--secondary);
    width: 100%;

    &:focus {
      border-bottom: 1px solid var(--orange);
    }
  }

  textarea {
    font-size: 0.675rem;
    padding: 0.4rem;
    border: 1px solid rgba(0,0,0,0.12);
    border-radius: 0.2rem;
    background-color: rgba(255,255,255,0.5);
    color: var(--secondary);
    resize: vertical;
    min-height: 80px;
    font-family: poppins, montserrat, sans-serif;

    &:focus {
      border-color: var(--orange);
    }
  }
`;

export const ColorRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;

  label {
    font-size: 0.6rem;
    color: var(--secondary);
    font-family: Montserrat;
  }

  input[type='color'] {
    width: 2.2rem;
    height: 2.2rem;
    border: none;
    border-radius: 0.25rem;
    cursor: pointer;
    padding: 0;
    background: none;
  }

  span {
    font-size: 0.6rem;
    color: var(--grey);
    font-family: Montserrat;
  }
`;

export const LogoUploadArea = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;

  img {
    height: 52px;
    max-width: 120px;
    object-fit: contain;
    border: 1px solid var(--gray-outline);
    border-radius: 0.2rem;
    padding: 2px;
    background: white;
  }
`;

/* ─── Invoice Preview ─── */

export const InvoicePaper = styled.div`
  width: 650px;
  min-height: 880px;
  background: white;
  border-radius: 0.25rem;
  box-shadow: 0 4px 20px rgba(0,0,0,0.18);
  display: flex;
  flex-direction: column;
  font-family: 'Montserrat', sans-serif;
  overflow: hidden;
`;

export const InvoiceHeader = styled.div<{ bgColor: string }>`
  background-color: ${props => props.bgColor};
  padding: 1.5rem 2rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 90px;
`;

export const InvoiceHeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;

  img {
    height: 56px;
    max-width: 130px;
    object-fit: contain;
    background: rgba(255,255,255,0.9);
    border-radius: 0.2rem;
    padding: 4px;
  }
`;

export const InvoiceCompanyInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.15rem;

  strong {
    font-size: 0.9rem;
    font-weight: 700;
    color: white;
    text-shadow: 0 1px 2px rgba(0,0,0,0.2);
  }

  span {
    font-size: 0.65rem;
    color: rgba(255,255,255,0.88);
  }
`;

export const InvoiceBadge = styled.div`
  text-align: right;

  h2 {
    font-size: 1.3rem;
    font-weight: 700;
    color: white;
    letter-spacing: 0.04em;
    text-transform: uppercase;
  }

  span {
    font-size: 0.65rem;
    color: rgba(255,255,255,0.8);
  }
`;

export const InvoiceBody = styled.div`
  flex: 1;
  padding: 1.5rem 2rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

export const InvoiceMetaRow = styled.div`
  display: flex;
  justify-content: space-between;
  background-color: var(--gray);
  border-radius: 0.25rem;
  padding: 0.75rem 1rem;
  gap: 1rem;
`;

export const InvoiceMetaItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.15rem;

  span {
    font-size: 0.55rem;
    color: var(--grey);
    text-transform: uppercase;
    letter-spacing: 0.05em;
    font-weight: 600;
  }

  strong {
    font-size: 0.75rem;
    color: var(--primary);
  }
`;

export const InvoiceCustomerSection = styled.div`
  border-left: 3px solid var(--blue);
  padding-left: 0.75rem;

  p.section-title {
    font-size: 0.6rem;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    color: var(--blue);
    font-weight: 700;
    margin-bottom: 0.5rem;
  }

  p.field {
    font-size: 0.72rem;
    color: var(--secondary);
    margin-bottom: 0.2rem;

    span {
      font-weight: 600;
      color: var(--primary);
    }
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
    padding-bottom: 0.35rem;
  }

  .desc-table {
    width: 100%;
    border-collapse: collapse;

    th {
      background-color: var(--blue);
      color: white;
      font-size: 0.62rem;
      padding: 0.4rem 0.6rem;
      text-align: left;
      font-weight: 600;
    }

    td {
      padding: 0.5rem 0.6rem;
      font-size: 0.7rem;
      color: var(--secondary);
      border-bottom: 1px solid #f0f0f0;
      vertical-align: top;
    }
  }
`;

export const InvoiceFooter = styled.div`
  background-color: var(--gray);
  padding: 0.75rem 2rem;
  font-size: 0.6rem;
  color: var(--grey);
  text-align: center;
  border-top: 1px solid var(--gray-outline);
`;
