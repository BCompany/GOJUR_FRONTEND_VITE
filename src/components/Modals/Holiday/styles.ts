import styled from 'styled-components';


export const Modal = styled.div`
  width:70vw;
  
  /* adjust for size in mobile application */
  @media (max-width: 600px){
    width: 90%;
  }

  top:25%;
  height: auto;
  background-color: var(--white);
  box-shadow: 4px 4px 4px 4px rgba(0, 0, 0, 0.3);
  border-radius: 12px;
  display: flex;
  position: absolute;
  font-size:1rem;
  flex-direction: column;

  > header {
    display: flex;
    align-items: center;
    margin-bottom:10px;
    justify-content: flex-end;
    padding: 0.25rem 0.5rem;
    background-color: rgba(0, 0, 0, 0.1);

    p {
      flex: 1;
      color: var(--secondary);
      font-size: 0.775rem;
      text-align: center;
    }
    > button {
      width: 24px;
      height: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
      > svg {
        width: 24px;
        height: 24px;
        color: var(--secondary);
      }

      &:hover {
        > svg {
          color: var(--orange);
        }
      }
    }
  }
`;

export const Content = styled.div`
  align-items: center;
  justify-content: center;
  
  > div:first-child {
    height:2rem;
    margin-bottom:1.5rem;

    > label {
      font-size: 0.60rem;
      color: var(--seconday);
      margin-left:1rem;
      
      /* display:flex; */
      /* flex-direction: column; */

      > input {
        border: 1px solid #000;
        height:1.5rem;
        margin-left:1rem;
        width:92%;
        padding: 0.0.5rem;
        border-radius:0.25rem;
      }
    }
    
    > table thead th {
      font-size:14px;      
      width:300px;
      font-weight:500;
      font-family:montserrat      
    }

    > table tbody td {
      margin-top:10px;
      font-size:14px;
      width:300px;
      background-color:yellow;
      font-weight:100;
      font-family:montserrat      
    }
  }

  > div:last-child {
    height:80px;
    display:grid;
    align-items: center;
    margin:20px;
    justify-content: center;
    grid-template-columns:repeat(4, 1fr);
    grid-template-rows: repeat(4, 1fr);
    grid-column-gap: 10px;
    grid-row-gap: 3px;

    > label {
      font-size: 0.60rem;
      color: var(--seconday);
      flex:1;
      display:flex;
      flex-direction: column;

      > input {
        border: 1px solid #000;
        height:1.5rem;
        width:6.5rem;
        font-size: 0.75rem;
        padding: 0.0.5rem;
        border-radius:0.25rem;
      }
    }
  }
`;


export const DocumentsTable = styled.div`
  margin-top: 0.4rem;
  max-height: 12.5rem;
  overflow: auto;

  ::-webkit-scrollbar {
    width: 0.225rem;
  }

  ::-webkit-scrollbar-thumb {
    -webkit-border-radius: 0.5rem;
    border-radius: 0.5rem;
    background: var(--orange);
  }

  table {
    width: 100%;
    border-spacing: 0 0.5rem;
    
    th {
      color: var(--text-body);
      font-weight: 400;
      padding: 0.5rem;
      text-align: center;
      line-height: 1rem;
      background: var(--text-title);
      font-size: 0.75rem;
      color: var(--grey);
      background-color: var(--gray);
    }

    td {
      padding: 0.5rem;
      border: 0;
      background: var(--shape);
      color: var(--text-body);
      background-color: var(--white-card);
      box-shadow: 1px 1px 1px rgba(0, 0, 0, 0.1);
      font-size: 0.65rem;
      text-align: center;

      &.wrap {
        max-width: 10rem;
        word-wrap: break-word;
      }

      &:hover {
        > svg {
          cursor:pointer;
          color: var(--orange);
        }
      }
    }

  }
`;