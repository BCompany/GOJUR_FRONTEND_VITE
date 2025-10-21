import styled from "styled-components";

// === ESTILOS ===
export const Container = styled.div`
  background-color:transparent; /* bg-slate-50 */
  color: #1e293b; /* text-slate-800 */
  min-height: 100vh;
  padding: 1.5rem;
  max-width: 1280px;
  margin: 0 auto;
`;

export const Header = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.5rem;

  h1 {
    font-size: 1.5rem;
    font-weight: 600;
  }

  p {
    font-size: 0.675rem;
    color: #64748b; /* text-slate-500 */
  }

  input {
    width: 24rem;
    padding: 0.5rem 1rem;
    border: 1px solid #e2e8f0;
    border-radius: 0.5rem;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04);
  }

  button {
    background-color: #0f172a; /* bg-slate-900 */
    color: white;
    padding: 0.5rem 1rem;
    border-radius: 0.5rem;
  }

  .right {
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }
`;

export const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr 3fr;
  gap: 1.5rem;
`;

// === SIDEBAR ===
export const Sidebar = styled.aside`
  background: white;
  padding: 1rem;
  border-radius: 1rem;
  box-shadow: 0 1px 3px rgba(2, 6, 23, 0.08);
  width: 250px;

  h3 {
    font-weight: 500;
    margin-bottom: 0.75rem;
  }

  label {
    font-size: 0.675rem;
    color: #64748b;
  }

  select {
    margin-top: 0.5rem;
    width: 100%;
    border-radius: 0.5rem;
    border: 1px solid #cbd5e1;
    padding: 0.5rem 0.75rem;
    font-size: 0.675rem;
  }

  hr {
    margin: 1rem 0;
  }

  .section {
    margin-bottom: 1rem;
  }

  .chips,
  .tags {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    margin-top: 0.5rem;
  }

  .chip {
    cursor: pointer;
    font-size: 0.675rem;
    border: 1px solid #e2e8f0;
    background: white;
    padding: 0.25rem 0.75rem;
    border-radius: 9999px;
    transition: background 0.15s ease;

    &:hover {
      background: #f1f5f9;
    }
  }

  .text-note {
    font-size: 0.675rem;
    color: #94a3b8;
    margin-top: 1.5rem;
  }
`;

// === MAIN ===
export const Main = styled.main`
  section {
    background: transparent;
  }

  .columns {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1rem;
  }

  .column-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 0.75rem;

    h4 {
      font-size: 0.675rem;
      font-weight: 500;
    }

    span {
      font-size: 0.75rem;
      color: #64748b;
    }
  }
`;

export const Card = styled.article`
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 1rem;
  padding: 1rem;
  transition: transform 0.18s ease, box-shadow 0.18s ease;

  &:hover {
    transform: translateY(-6px);
    box-shadow: 0 10px 20px rgba(2, 6, 23, 0.12);
  }

  h5 {
    font-weight: 600;
  }

  p {
    font-size: 0.75rem;
    color: #64748b;
    margin-top: 0.25rem;
  }

  .priority {
    font-size: 0.75rem;
    padding: 0.25rem 0.5rem;
    border-radius: 9999px;
    display: inline-block;
  }

  .priority-high {
    background: #fef3c7;
    color: #92400e;
  }
  .priority-medium {
    background: #f1f5f9;
    color: #475569;
  }
  .priority-low {
    background: #f8fafc;
    color: #475569;
  }
`;

export const CardHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;

  .text-right {
    text-align: right;
  }

  .owner {
    font-size: 0.75rem;
    color: #94a3b8;
    margin-top: 0.25rem;
  }
`;

interface colorProps{
  colorName: string;
}

export const KanbanCard = styled.div`
    width: 15.6rem;
    display: inline-flex;
    margin:0.4rem;
    flex-direction: column;
    align-items: center;
    box-shadow: 2px 2px 2px 2px rgba(0,0,0,0.4);
    border-radius: 0.25rem;
    font-size:0.75rem;
    font-family: Montserrat;
    background-color:var(--white);
    height:auto;
    min-height:10vh;

    header {
      width: 100%;
      display: flex;
      align-items: center;
      font-weight:500;
      font-size:0.765rem;
      padding-left:1rem;
      padding-right:1rem;
      justify-content: center;
      background-color: rgba(0,0,0,0.1);
      font-family: Montserrat;
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: normal;
      word-break:break-all;

      >svg{
        cursor:pointer;
      }
    }

    .totalHeader {
      font-size: 0.650rem;
      font-weight:500;
      color:var(--blue-twitter);
      margin-top:0.2rem;
      margin-bottom:-0.5rem;
    }
`;


export const BusinessCard = styled.div<colorProps>`
  width:95%;
  cursor:pointer;
  margin: 0.5rem 0.5rem;
  padding: 0.5rem 0.5rem;
  border-left: 3px solid ${colorProps => (colorProps.colorName)};
  box-shadow: 2px 2px 2px 2px rgba(0,0,0,0.1);
  border-radius: 0.25rem;
  font-size:0.65rem;
  font-weight:200;

  >div{
    > p{
      white-space: normal;
      > label {
        font-weight:500;
        margin-right:5px;
      }

      .customerLink {
        color: var(--blue-twitter);
        font-weight:500;
        cursor:pointer;
      }
    }

    .customerInfo{
      height: auto;
      font-size:0.60rem;
      padding:0.5rem;
      white-space: normal;
      border-radius: 0.25rem;
      border: 0.1px solid ${colorProps => (colorProps.colorName)};
      box-shadow: 2px 2px 2px 2px rgba(0,0,0,0.1);
      margin:0.2rem;

      >p{
        span:first-child{
          color: var(--secondary);
          font-weight: 500;
        }
        line-break:anywhere;
        cursor:default;
        text-align:center;
        color: var(--secondary);

        .whatsIcon{
          color: var(--green-dark);
          cursor:pointer;
        }

        .copyIcon{
          width:0.75rem;
          height:0.75rem;
          cursor:pointer;
          color:var(--blue-twitter);
        }
      }
    }
  }

  .headerCard {
    display: flex;
    cursor: pointer;
    float: right;
    color:var(--blue-twitter);
    width: 0.85rem;
    height: 0.85rem;
    margin-right:-10px;
    margin-top: -5px;

    :hover  {
      color: var(--orange);
    }
  }

  .notificationsCard {
    cursor: pointer;
    color:var(--blue-twitter);
    font-size:0.65rem;

    >svg{
      width: 0.65rem;
      height: 0.65rem;
    }

    :hover  {
      color: var(--orange);
    }
  }
`;
