import styled from 'styled-components';

interface SearchProps {
  show:boolean
}

export const ModalCoverage = styled.div<SearchProps>`
  border: 1px solid var(--blue-twitter);
  font-size:0.665rem;
  box-shadow: 1px 1px 4px 0.5px rgba(0,0,0,0.15);
  width:70%;
  height:80%;
  background-color:var(--white);
  position:absolute;
  z-index:5;
  justify-content:center;
  overflow:auto;
  margin-left:5%;
  margin-top:1%;
  display: ${props => (props.show ? 'block' : 'none')};

  .header {
    background-color: rgba(0,0,0,0.1)
  }

  .headerLabel{
    text-align: center;
    font-size: 16px;
    font-family: montserrat;
    font-weight: normal;
    padding: 5px;
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
`;
