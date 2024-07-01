import styled from 'styled-components';

export const Container = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: auto;
  font-size: 12px;
  height: 100%;
  background-color: #EDF0F7;  
`;


export const TollBar = styled.div`
  display:flex;
  max-height:1.5rem;
  font-size:0.7rem;
  justify-content:space-between;
  color:#0177C0;

  .buttonReturn {
    display:flex;
    flex:1;
    font-size:0.8rem;
    justify-content:center;
  }
`;

export const Table = styled.div`
  overflow: auto;

  width:80%;
  margin-left:10%;

  table {
    border-spacing: 0 0;
    width:100%;

    tr:nth-child(odd) {
      background-color:#D9ECEC;
    }
    
    th {
      color: white;
      font-weight: 400;
      padding: 0.2rem;
      margin:0.5rem;
      text-align: center;
      line-height: 1rem;
      background: var(--text-title);
      font-size: 0.75rem;
      background-color: #0177C0;
    }

    tr:nth-child(odd) {
      background-color:#D9ECEC;
    }

    td {
      padding: 0.5rem;
      border: 0;
      background: var(--shape);
      color: var(--text-body);
      font-size: 0.7rem;
      text-align: unset;

      &.wrap {
        max-width: 10rem;
        word-wrap: break-word;
      }

      svg
      {
          width:1.1rem; 
          height:1.1rem;
          cursor:pointer;
      }
    }
  }
`;

export const Center = styled.div`
  .flex-box {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .container-box {
    background-color: #EDF0F7;
    font-size:0.8rem;
  }

  .title
  {
      text-align:center;
      padding:10px;
      font-size:0.85rem;
      font-weigth:800;
      color: #0177C0;

  }

  .content-box {
    text-align: center;
    width: 99%;
  }
`;


