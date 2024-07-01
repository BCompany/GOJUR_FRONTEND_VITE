import styled from 'styled-components';

interface menuClick{
  isOpen:boolean;
}

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

    span {
      font-size:0.675rem;
      color: var(--blue-twitter);            

      >span{
        margin-left:5px;
      }
    }

  .loaderPage{
    margin-top:10%;
    text-align:center;
  }

  .paginationPage{
    /* font-size:0.765rem;
    margin-left: 35vw; */
    margin-left: 42vw;
    color: var(--blue-twitter);
  }

  .messageEmpty{
      color: var(--blue-twitter);
      justify-content:center;
      text-align: center;
      font-size:0.665rem;
      display: flex;
      flex-direction:column;
      width:100%;
      margin-top:12%;

      > svg {
        justify-content:center;
        text-align: center;
        margin-left:49%;
        margin-bottom:10px;
        width:1.5rem;
        height:1.5rem;
      }
    }
`;


export const TaskBar = styled.div`
  display: flex; 
  align-items: center;
  justify-content: space-between;
  margin-left:1rem;
  margin-right:2rem;
 
  div {
    display: flex;
    align-items: center;
    justify-content: center;
   
    #options {
     display: flex;
     align-items: center;
     justify-content: center;
     border-radius: 0.25rem;

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
  }

  p {
    font-family: Montserrat;
    font-size: 0.625rem;
    color: var(--secondary);
  }
`;


export const ListCostumer = styled.div`
    /* border: 1px solid #000; */
    flex: 1;
    display: grid;   

    @media (min-width: 480px) {
      grid-template-columns: 1fr 1fr;
    }
    
    grid-gap: 1rem; 
    align-items: center;
    justify-content: center;
    margin-top: 0.5rem auto;
    padding: 0.5rem 0;
`;

export const CostumerCard = styled.div`
    /* border: 1px solid red; */
    flex: 1;
    height: 16rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    background-color: var(--white-card);
    box-shadow: 2px 2px 2px 2px rgba(0,0,0,0.4);
    border-radius: 0.25rem;  

    header {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: flex-end;
      background-color: rgba(0,0,0,0.1);
      padding: 0.25rem 1rem;

      > span {
        position: relative;
        margin-right:30%;
      }

      button {
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 0.15rem;

        &+ button {
          margin-left: 0.5rem;
        }

        &:hover{
          svg {
            color: var(--orange);
          }
        } 

        svg {
          width: 1rem;
          height: 1rem;
          color: var(--blue-twitter);
        }
      }
    }

    div {
      flex: 1;
      width: 100%;
      display: flex;
      flex-direction: column;
      padding: 0.5rem 1rem;

      section {
        display: flex;
        justify-content: space-between;
        #whats{
            display: flex;
            flex-direction: row;

            button {
              display: flex;
              align-items: center;
              justify-content: center;
              margin-left: 0.5rem;


              &:hover{
                box-shadow: 1px 1px 1px 1px rgba(0,0,0,0.1);
              }  
              svg {
                color: var(--green);
                width: 1rem;
                height: 1rem;
              }
            }
          }


        &+section {
          margin-top: 0.5rem;
        }

        article {
          flex: 1;
          display: flex;
          flex-direction: column;
          /* align-items: center; */

          p {
            font-size: 0.750rem;
            font-weight: 400;
            color: var(--secondary);

          }

          b {
            font-family: Montserrat;
            font-size: 0.750rem;
            font-weight: 600;
            color: var(--primary);
            margin-right: 0.5rem;

            // id customer left side from name person
            > span{
              color:var(--grey);
              font-size:0.65rem;
              font-weight: 300;

            }
          }

          #mail{
            color: var(--blue-light);
          }
         
        }

        

      }

      > article {
        display: flex;
        align-items: center;

        margin-top: 0.5rem;
        
        p {
          font-size: 0.75rem;
          font-weight: 400;
          color: var(--secondary);
          }

          b {
            margin-right: 0.5rem;

            font-family: Montserrat;
            font-size: 0.875rem;
            font-weight: 600;
            color: var(--primary);
          }

         
          
         
      }

      > div {
        margin-top: 1rem;
        display: grid;
        grid-template-columns: 1fr 1fr 1fr;
        grid-gap: 0.25rem 0.5rem;
        padding: 0;

        > p {
          font-size: 0.65rem;
          display: flex;
          flex-direction: column;

          strong {
            font-size: .75rem;
          }
        }

      } 
    }
`;