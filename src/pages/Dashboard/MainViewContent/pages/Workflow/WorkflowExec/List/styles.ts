import styled from 'styled-components';

export const Container = styled.div`
  flex: 1;
  height: 100vh;
  width: 95vw;
  display: flex;
  flex-direction: column; 

  .menuHamb {
    svg {
       color: var(--blue);
       width: 1.5rem;
       height: 1.5rem;
     }
  }


  .cell-wrap {
    white-space: pre-wrap;   /* mantém \n como quebra de linha */
    word-break: break-word;  /* quebra palavras muito grandes */
  }

`;


export const ContainerMobile = styled.div`
  flex: 1;
  font-size:0.675rem;
  overflow: auto;
  margin-top: 50%;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;


export const Content = styled.div`
  flex: 1;
  padding: 0.5rem 6rem;
  margin: 0.5rem 0.5rem;
  overflow: auto;
  width: 99%;
`;

export const ContentMobile = styled.div`
  flex: 1;
  overflow: auto;
  width: 99%;
  font-size:8px;
  padding:8px;
`;

export const ContentBottoms = styled.div`
  flex: 1;
  padding: 0.5rem 6rem;
  margin: 0.5rem 0.5rem;
  width: 99%;
`;

export const ModalInformation = styled.div`
  border: 1px solid var(--blue-twitter);
  font-size:0.7rem;
  box-shadow: 1px 1px 4px 0.5px rgba(0,0,0,0.15);
  width:30rem;
  height:18rem;
  background-color:var(--white);
  position:absolute;
  z-index:99999;
  justify-content:center;
  margin-left:25%;
  margin-top:10%;
  
  .menuHeader {
    background-Color:#dcdcdc;
    width:'100%';
    height:'27px'
  }

  .menuTitle {
    font-size:0.65rem;
    padding: 0.25rem 0.5rem;
    color:black;
    text-align:center;
    float: left;
    width:95%;
    background-Color:#dcdcdc;
  }

  .menuSection {
    font-size:0.65rem;
    padding: 0.25rem 0.5rem;
    color:var(--blue-twitter);
    text-align:center;
    cursor:pointer;
    float: right;
    width:5%;
    background-Color:#dcdcdc;
    height: 27px;

    > svg {
      width:0.85rem;
      height:0.85rem;
      stroke-width: 3px;
    }

    &:hover {
      color: var(--orange);
    }
  }

`;
