import styled from 'styled-components';

interface SearchProps {
  show:boolean
}

export const ModalCustomerRobot = styled.div<SearchProps>`
  border: 1px solid var(--blue-twitter);
  font-size:0.665rem;
  box-shadow: 1px 1px 4px 0.5px rgba(0,0,0,0.15);
  width:20rem;
  height:13rem;
  background-color:var(--white);
  position:absolute;
  z-index:99999;
  justify-content:center;
  margin-left:25%;
  margin-top:8%;
  display: ${props => (props.show ? 'block' : 'none')};

  input, select {
      flex: 1;
      font-size: 0.675rem;
      padding: 0.25rem;
      background-color: rgba(255,255,255,0.25);
      width: 99%;
      border-bottom: 1px solid rgba(0,0,0,0.15);
      color: var(--secondary);

      &:focus {
        border-bottom: 1px solid var(--orange);
      }
    }
`;

export const ModalCustomerRobotResult = styled.div<SearchProps>`
  border: 1px solid var(--blue-twitter);
  font-size: 0.665rem;
  box-shadow: 1px 1px 4px 0.5px rgba(0,0,0,0.15);
  width: 60%;
  height: auto;  
  max-height: 80vh; 
  background-color: var(--white);
  position: absolute;
  z-index: 99999;
  justify-content: center;
  margin-left: 10%;
  display: ${props => (props.show ? 'block' : 'none')};
  overflow-y: auto;  

  > div {
    padding: 15px;
  }

  input, select {
    flex: 1;
    font-size: 0.675rem;
    padding: 0.25rem;
    background-color: rgba(255,255,255,0.25);
    width: 99%;
    border-bottom: 1px solid rgba(0,0,0,0.15);
    color: var(--secondary);

    &:focus {
      border-bottom: 1px solid var(--orange);
    }
  }

  .buttonClick {
  padding: 8px 16px;
  height: 40px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  gap: 5px; 
  min-width: 150px; 
}

`;
