import styled from 'styled-components';

export const Container = styled.div`
  flex: 1;
  height: 100vh;
  width: 95vw;
  display: flex;
  flex-direction: column; 
`;

export const Content = styled.div`
  flex: 1;
  padding: 0.5rem 2rem;
  margin: 0.5rem 1rem;
  background-color: rgba(255,255,255, 0.3);
  border-radius: 0.25rem;
  box-shadow: 1px 1px 4px 0.5px rgba(0,0,0,0.15);
  overflow: auto;
  font-size: 0.675rem;

  input, select {
    flex: 1;
    font-size: 0.675rem;
    padding: 0.25rem;
    background-color: #FFFFFF;
    width: 99%;
    border-bottom: 1px solid rgba(0,0,0,0.15);
    color: var(--secondary);

    &:focus {
    border-bottom: 1px solid var(--orange);
    }
  }

  p{
    font-size: 0.675rem;
  }

  span {
    font-size: 0.765rem;
    color: var(--blue-twitter);            

    >span{
      margin-left: 5px;
    }
  }
`;


export const GridEletronicIntimation = styled.div`
  width: 98%;
  font-size:0.3rem;
  margin-left:1%;
  font-family: Montserrat;
  
  #gridContainer .dx-row{
    height: 90px;
    font-size: 12px;
  }
  
  span {
    font-size:0.675rem;   
    color: var(--blue-twitter);
  }

  big {
    font-size:0.675rem;
    color: var(--blue-twitter);
  }

  svg {
      width: 0.8rem;
      height: 0.7rem;
      margin-left: 0.8rem;
      color: var(--blue-light);
      cursor:pointer;

      &:hover {
        color: var(--orange)
      }
  }
  & tbody tr:nth-of-type(odd){
    background-color: #D9ECEC
  }
`;
