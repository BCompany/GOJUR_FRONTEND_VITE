import styled from 'styled-components';

export const Container = styled.div`
  flex: 1;
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  overflow: auto;
  font-size: 12px;
  background-color: #EDF0F7;
`;

export const ProfileTable = styled.div`
  overflow: auto;

  table {
    border-spacing: 0 0;

    th {
      color: white;
      font-weight: 400;
      padding: 0.5rem;
      text-align: center;
      line-height: 1rem;
      background: var(--text-title);
      font-size: 0.7rem;
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
      font-size: 0.6rem;
      text-align: unset;

      &.wrap {
        max-width: 10rem;
        word-wrap: break-word;
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
  }

  .content-box {
    text-align: center;
    width: 60%;
  }
`;

