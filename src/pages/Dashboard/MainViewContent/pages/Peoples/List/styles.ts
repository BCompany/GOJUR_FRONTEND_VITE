import styled from 'styled-components';

export const Container = styled.div`
  flex: 1;
  height: 100vh;
  width: 95vw;
  display: flex;
  flex-direction: column;


  /* @media (max-width: 420px) {
    display: none;
  } */
  #options {
     display: flex;
     align-items: center;
     justify-content: center;
     border-radius: 0.25rem;
     margin-left:1rem;
     margin-right:35px;

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
`;

export const Content = styled.div`
    flex: 1;
    padding: 0.5rem 2rem;
    margin: 0.5rem 1rem;
    background-color: rgba(255,255,255, 0.3);
    border-radius: 0.25rem;
    box-shadow: 1px 1px 4px 0.5px rgba(0,0,0,0.15);
    overflow: auto;

    p {
    font-family: Montserrat;
    font-size: 0.8rem;
    padding-left: 2%;
  }

    span {
      font-size:0.765rem;
      color: var(--blue-twitter);            

      >span{
        margin-left:5px;
      }
    }

    /* ::-webkit-scrollbar {
    width: 6px;
  } */
  /* ::-webkit-scrollbar-thumb {
    -webkit-border-radius: 0.5rem;
    border-radius: 0.5rem;
    background: var(--orange);
    -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.5);
  } */
`;

export const ListUser = styled.div`
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

export const UserCard = styled.div`
    /* border: 1px solid red; */
    flex: 1;
    height: 10rem;
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
        /* align-items: center; */
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
            font-size: 0.725rem;
            font-weight: 400;
            color: var(--secondary);

          }

          b {
            font-family: Montserrat;
            font-size: 0.850rem;
            font-weight: 600;
            color: var(--primary);
            margin-right: 0.5rem;
          }

          #mail{
            color: var(--blue-light);
            font-size: 0.700rem;
            margin-left: -2%;
          }

          #type{
            margin-top: 10%
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

export const Menu = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 1rem;
    background-color: var(--white-card);
    border-radius: 0.25rem;
    border: 1px solid var(--secondary);
    position: absolute;
    right: 2rem;
    top: 7rem;

    button {
      padding: 0.25rem 0.5rem;
      color: var(--secondary);

      &:hover {
        color: var(--orange);
        box-shadow: 2px 2px 2px 2px rgba(0,0,0,0.2);
      }
      & + button {
        margin-top: 0.5rem;
      }
    }

`;