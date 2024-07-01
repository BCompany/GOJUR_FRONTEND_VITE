import styled from 'styled-components';

interface cardSize{
  autoSizeCard?: boolean;
}
export const Flags = styled.div`
  font-size: 0.675rem;
  width: 50px;;
`;

export const TreeViewContainerSimple = styled.div`
  > div {
    padding-top:1rem;
  }
  svg {
      width: 2rem;
      color: var(--blue-light);
      cursor:pointer;

      &:hover {
        color: var(--orange)
      }
    }

    .deni-react-treeview-container{
      font-size: 18.5px;
      width: 100%;
      height: 100%;
      border: none;
    }

`

export const TollBar = styled.div `
  display:flex;
  max-height:1.5rem;
  font-size:0.65rem;
  justify-content:space-between;

  .buttonReturn {
    display:flex;
    flex:1;
    justify-content:start;
  }

  .hamburguerMenu {
    flex:1;
    display:flex;
    justify-content:end;
  }

  #options {
     svg {
       color: var(--blue);
       width: 1.5rem;
       height: 1.5rem;
     }

     &:hover {
       svg { color: var(--orange); }
    }
  }
`;

export const Container = styled.div`
  flex: 1;
  height: 100vh;
  overflow: auto;
  @media (min-width: 480px) {
    padding: 0.5rem 3rem; // browser
  }


  .infoMessage{
      color: var(--blue-twitter);
      font-size:0.725rem;
      display: flex;
      text-align:center;
      flex-direction:column;
      width:100%;
      margin-top:-25%;
      
    }
`;

export const Content = styled.div`
    flex: 1;
    display: flex;
    flex-direction: column;    
    height: auto;
    min-height: 350px;
    background-color: var(--white);
    border-radius: 0.25rem;
    box-shadow: 1px 1px 4px 0.5px rgba(0,0,0,0.15);
    margin-top: 1%;

    header {
      width: 100%;
      background-color: rgba(0,0,0,0.1);
      padding: 0.25rem 1rem;
      border-radius: 0.25rem;
      box-shadow: 1px 1px 4px 0.5px rgba(0,0,0,0.15);

    }

`;

export const Form = styled.form`
    flex: 1;
    display: flex;
    flex-direction: column;
    padding: 0.5rem 1rem;
    font-size: 0.675rem;
    flex-direction: column;
    align-items: center;
    background-color: var(--white-card);

    input, select {
          flex: 1;
          font-size: 0.675rem;
          padding: 0.25rem;
          background-color: white;
          width: 100%;
          border-bottom: 1px solid rgba(0,0,0,0.15);

          &:focus {
            border-bottom: 1px solid var(--orange);
            #BtSvCl{
              margin-right: 10px
            }
          }
        }
  
    section#dados{
     
      display: grid;
      height: auto;
      min-height: 200px;

      @media (min-width: 480px) {
        grid-template-columns: 1fr 1fr;
      }

      grid-gap: 1rem;
      position:relative;
      background-color: var(--gray);
      padding: 0.5rem;
      box-shadow: 1px 1px 0px 1px rgba(0,0,0,0.15); 
      
      & + section {
        margin-top: 0.5rem;
      }
      
      > textarea {
          border: 1px solid rgba(0,0,0,0.5);
          width: 100%;
          @media (min-width: 480px) {
            width: 200%;
          }
          min-height: 12rem;
          height: auto;
          padding: 0.5rem;
          background-color: var(--white);
          color: var(--secondary);
          font-size: 0.75rem;
        }

    >  label {
        font-size: 0.675rem;
        color: var(--primary);
        display: flex;
        flex-direction: column;    

        &:focus-within {
          color: var(--orange);

          &.required{
          color: var(--red);
          }
        }

        p{
          display: flex;
          align-items: center;

          svg {
            color: var(--green);
            margin-left: 0.5rem;
            width: 1rem;
            height: 1rem;
          }
        }
                  
      }
    
    }

`;
    export const ItemList = styled.div`

      display:flex;
      flex-direction:column;
      
      >span {
        display:flex;
        margin:0.2rem 0.5rem;
      }

      p{
        margin-left:0.75rem;
      }
    `;
