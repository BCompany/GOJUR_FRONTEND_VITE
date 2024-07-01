import styled from 'styled-components';

export const Container = styled.div`
  width: 100vw;
  height: 100vh;  
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 9999;
  /* overflow:auto; */
`;

export const Modal = styled.div`
  width: 70%;
  display:block;
/* adjust for size in mobile application */
  @media (max-width: 600px)
  {
    width: 90%;
    margin-left:5vw;
  }

  background-color: var(--white);
  box-shadow: 4px 4px 4px 4px rgba(0, 0, 0, 0.3);
  border-radius: 12px;
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
      font-size: 0.875rem;
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

export const ModalMobile = styled.div`
  width: 83%;
  display:block;
  background-color: var(--white);
  box-shadow: 4px 4px 4px 4px rgba(0, 0, 0, 0.3);
  border-radius: 12px;
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
      font-size: 0.875rem;
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
  display: block;
  align-items: center;
  justify-content: center;
  max-height:45vh; 
  overflow: auto;
  margin-left:1rem;
  
  ::-webkit-scrollbar {
    width: 6px;
  }
  ::-webkit-scrollbar-thumb {
    -webkit-border-radius: 0.5rem;
    border-radius: 0.5rem;
    background: var(--orange);
    -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.5);
  }

  > div {
    /* padding: 0.5rem; */
    height: 7.6rem;
    display: grid;

    align-items: center;
    justify-content: center;
    grid-template-columns: repeat(3, 1fr);
    grid-template-rows: repeat(3, 1fr);
    grid-column-gap: 10px;
    grid-row-gap: 10px;

    > label {
      font-size: 0.6rem;
      color: var(--secondary);
      flex: 1;
      width:90%;
      margin-top:2px;
      display: flex;
      flex-direction: column;

      > input {
        border: 1px solid #000;
        height: 1.7rem;
        width:100%;
        font-size:0.7rem;
        padding: 0 0.5rem;
        border-radius: 0.25rem;
      }
      > select {
        border: 1px solid #000;
        width:100%;
        font-size:0.7rem;
        height: 1.7rem;
        padding: 0 0.5rem;
        border-radius: 0.25rem;
      }
    }
  }
`;

export const ContentMobile = styled.div`
  display: block;
  align-items: center;
  justify-content: center;
  max-height:45vh; 
  overflow: auto;
  margin-left:1rem;
  
  ::-webkit-scrollbar {
    width: 6px;
  }
  ::-webkit-scrollbar-thumb {
    -webkit-border-radius: 0.5rem;
    border-radius: 0.5rem;
    background: var(--orange);
    -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.5);
  }

  > div {
    height: 10rem;
    display: grid;

    align-items: center;
    justify-content: center;
    grid-template-columns: repeat(3, 1fr);
    grid-template-rows: repeat(3, 1fr);
    grid-column-gap: 10px;
    grid-row-gap: 10px;

    > label {
      font-size: 0.6rem;
      color: var(--secondary);
      flex: 1;
      width:90%;
      margin-top:2px;
      display: flex;
      flex-direction: column;

      > input {
        border: 1px solid #000;
        height: 1.7rem;
        width:100%;
        font-size:0.7rem;
        padding: 0 0.5rem;
        border-radius: 0.25rem;
      }
      > select {
        border: 1px solid #000;
        width:100%;
        font-size:0.7rem;
        height: 1.7rem;
        padding: 0 0.5rem;
        border-radius: 0.25rem;
      }
    }
  }
`;

export const Footer = styled.div`
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding: 1rem;
  margin: 0.5rem 0;

  > button {
    width: 6rem;
    height: 2rem;
    background-color: var(--blue-light);
    color: var(--white);
    border-radius: 6px;
    margin-left: 1rem;
    font-size:0.75rem;

    &:hover {
      opacity: 0.5;
    }
  }  
`;

export const DayValid = styled.td`
  
  float:left;
  height:2rem;
  width:2.5rem;
  cursor:pointer;
  border: 1px solid silver;
  background:var(--blue-light);
  color:white;
  padding: 1px;
  margin: 1px;
  border-radius:5px;
  font-size:0.60rem;
  font-weight:500;
  text-align:center;

`;

export const DayOff = styled.td`
  
  float:left;
  height:2rem;
  width:2.5rem;
  cursor:pointer;
  border: 1px solid silver;
  background:#ff6666;
  color:white;
  padding: 1px;
  margin: 1px;
  border-radius:5px;
  font-size:0.60rem;
  font-weight:500;
  text-align:center;
`;

export const DayInformation = styled.div`
  
  width:92%;
  height:1.3rem;
  font-size:0.60rem;
  font-family: Montserrat;
  font-weight:500;
  color: var(--blue-light);
  margin-bottom:4px;  
  border: 0.3px solid var(--blue-light);
  padding-left:15px;
  padding-top:4px;  
  margin-left:2rem;
  border-radius:15px;

  >button {
    margin-left:10px;
    cursor:pointer;
    font-family: Montserrat;
    font-size:0.60rem;
    color: var(--blue-light);

    &:hover {
      color: var(--orange);
    }
  }

  >:last-child {
    float:right;
    font-family: Montserrat;
    margin-right:10px;
    color: var(--blue-light);
    font-size:0.60rem;

    &:hover {
      color: var(--orange);
    }
  }
`;

export const DayResultText = styled.div`
  
  width:100%;
  align-items:center;
  text-align:center;
  margin-bottom:5px;
  font-size:0.85rem;
  margin-top:-15px;
  font-family: Montserrat;
  color: var(--blue-light);  
  
`;