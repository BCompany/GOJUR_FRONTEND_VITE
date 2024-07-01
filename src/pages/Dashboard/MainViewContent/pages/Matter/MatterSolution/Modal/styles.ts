import styled from 'styled-components';

interface SearchProps {
  show:boolean
}

export const ModalMatterSolution = styled.div<SearchProps>`
  border: 1px solid var(--blue-twitter);
  font-size:0.665rem;
  box-shadow: 1px 1px 4px 0.5px rgba(0,0,0,0.15);
  width:20rem;
  height:10rem;
  background-color:var(--white);
  position:absolute;
  z-index:99999;
  justify-content:center;
  margin-left:35%;
  margin-top:5%;
  display: ${props => (props.show ? 'block' : 'none')};
  
  .ModalSubjectColorButton {
    width : 25px;
    height: 25px;
    border-top: solid 2px #626262;
    border-left: solid 2px #626262;
    border-right: solid 2px black;
    border-bottom: solid 2px black;
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

export const ModalMatterSolutionMobile = styled.div<SearchProps>`
  border: 1px solid var(--blue-twitter);
  font-size:0.9rem;
  box-shadow: 1px 1px 4px 0.5px rgba(0,0,0,0.15);
  width:20rem;
  height:12rem;
  background-color:var(--white);
  position:absolute;
  z-index:99999;
  justify-content:center;
  margin-left:10%;
  margin-top:20%;
  display: ${props => (props.show ? 'block' : 'none')};
  
  .ModalSubjectColorButton {
    width : 25px;
    height: 25px;
    border-top: solid 2px #626262;
    border-left: solid 2px #626262;
    border-right: solid 2px black;
    border-bottom: solid 2px black;
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
