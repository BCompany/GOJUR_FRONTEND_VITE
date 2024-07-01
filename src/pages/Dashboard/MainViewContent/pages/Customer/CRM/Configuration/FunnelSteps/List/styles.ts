import styled from 'styled-components';

interface cardColor{
  changeColor:boolean;
  isMoving: boolean;
}

export const Container = styled.div`
  height: 85vh;
  position:relative;
  overflow: auto;
  width:70vw;
  margin-left:12vw;
  margin-top:5vh;
  display: flex;
  flex-direction: column;
  padding: 0.5rem 4rem;

  >p{
    color: var(--blue-twitter);
    text-align: center;
    font-size:0.725rem;
  }

  .buttonAdd {
    position:absolute;
    float:right;
    right:0;
    margin-right:3rem;
  }

  .loadingMessage {
    text-align:center;
    margin-top:2.5rem;
  }

  .messageTip{
    font-size:0.665rem;
    padding:0.3rem;
    color:var(--blue-twitter);

    >svg{
      width:1rem;
      height:1rem;
      color: var(--blue-twitter);
    }
  }

  .selectFunnel {
    font-size:0.625rem;
    margin: 0.3rem; 
    width: 94%;

    >button {
      float: right;
      right: 0;
      margin-right: -1.7rem;
      margin-top: -1.5rem;

      >svg{
        width:1rem;
        height:1rem;
        color: var(--blue-twitter);
        
        &:hover {
          color: var(--orange)
        }
      }

    }
  }
`;

export const ItemFunnelStep = styled.div<cardColor> `

    font-size:0.865rem;
    padding: 0.80rem 2rem;
    font-family:montserrat; 
    background-color: ${props => (!props.changeColor ? 'transparent' : 'rgb(217, 236, 236)')}; 
    cursor: ${props => (props.isMoving ? 'copy' : 'move')}; 

    span{
      cursor: ${props => (props.isMoving? 'copy' : 'move')}; 
    }


    button svg {
      width: 1rem;
      height: 1rem;
      margin-left: 0.8rem;
      color: var(--blue-light);
      cursor: pointer; 

      &:hover {
        color: var(--orange)
      }
    }

    .buttonEdit{
      float:right;
      cursor:pointer;
    }

    .buttonDelete{
      float:right;
      margin-right:-4.5rem;
      cursor:pointer;
    }    

`