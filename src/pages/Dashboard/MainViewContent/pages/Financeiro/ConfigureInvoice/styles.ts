import styled from 'styled-components';

export const Container = styled.div`
  flex: 1;
  height: 100vh;
  width: 95vw;
  display: flex;
  flex-direction: column;

  #options {
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 0.25rem;
    margin-left:1rem;
    margin-right:35px;

    svg {
      color: var(--blue);
      width: 1.5rem;
      height: 1.5rem;
    }

    &:hover {
      svg {
        color: var(--orange);
      }
    }
  }
`;

export const Content = styled.div`
  flex: 1;
  padding: 0.5rem 2rem;
  margin: 0.5rem 1rem;
  background-color: rgba(255,255,255, 0.3);
  border-radius: 0.25rem;
  box-shadow: 1px 1px 4px 0.5px rgba(0,0,0,0.15);
  overflow: auto;

  p {
    font-family: sans-serif;
    font-size: 16px;
    padding-left: 2%;
  }

`;


export const InvoiceHeader = styled.div`
  width: 1000px;
  height: 180px;
  box-shadow: 1.5px 1.5px 1.5px 1.5px rgba(0, 0, 0, 0.3);
  border-radius: 3px;
  margin-top: 20px;
`;


export const InvoiceHeaderImage = styled.div`
  float: left;
  height: 100%;
  width: 20%;
  align-content: center;
  text-align: center;
`;


export const InsertImage = styled.div`
  font-size: 14px;
  height: 100%;
  width: 100%;
  align-content: center;
  text-align: center;

  > div {
    cursor: pointer;

    > svg {
      width: 24px;
      height: 24px;
      color: var(--blue-twitter);
    }
  }

  > label {
    cursor: pointer;

    > svg {
      width: 24px;
      height: 24px;
      color: var(--blue-twitter);
    }
  }
`;


export const InvoiceHeaderText = styled.div`
  float: left;
  height: 100%;
  width: 80%;
  border-radius: 2px;
`;


export const CircleLine = styled.div`
  height: 50px;
  width: 320px;
`;


export const Circle = styled.div`
  float: left;
  margin-left: 10px;
  border: solid 1px #d3bcbc;
  height: 40px;
  width: 40px;
  border-Radius: 100%;
`;


export const Buttons = styled.div`
  width: 100%;
  text-align: center;
`;
