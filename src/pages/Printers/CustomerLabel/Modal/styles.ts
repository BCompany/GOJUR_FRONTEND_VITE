import styled from 'styled-components';

interface SearchProps {
  show:boolean
}

export const Flags = styled.div`
  font-size: 0.675rem;
  width: 125%;
`;



export const Modal = styled.div<SearchProps>`
  border: 1px solid var(--blue-twitter);
  font-size:0.665rem;
  box-shadow: 1px 1px 4px 0.5px rgba(0,0,0,0.15);
  width:35rem;
  height:32rem;
  background-color:var(--white);
  position:absolute;
  z-index:99999;
  justify-content:center;
  margin-left:25%;
  margin-top:2%;
  display: ${props => (props.show ? 'block' : 'none')};

  .infoMessage{
    color: var(--blue-twitter);
    min-width: 20px;
    min-height: 20px;
    margin-left: 3%;
    margin-top: auto;
  }

  .mainDiv {
    margin-left: 15px;
    margin-top: 10px;
    margin-right: 10px;
  }

  .modalDiv {
    display: flex;
  }

  .description {
    width: 50%;
  }

  .rightDiv {
    margin-left: 2%;
    width: 50%;
  }

  .qtd_EtiquetaPagina {
    width: 49%
  }

  .layoutLabel {
    float: left;
    margin-left: 0px;
    width: 150px;
  }

  .checkBoxDiv {
    float: left;
    margin-top: 3px;
    width: 10px;
  }

  .checkbox {
    min-width: 15px;
    min-height: 15px;
  }

  input, select {
      flex: 1;
      font-size: 0.675rem;
      padding: 0.25rem;
      background-color: white;
      width: 99%;
      border-bottom: 1px solid rgba(0,0,0,0.15);
      color: var(--secondary);

      &:focus {
        border-bottom: 1px solid var(--orange);
      }
    }
`;

export const ModalMatterLabelMobile = styled.div<SearchProps>`
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
