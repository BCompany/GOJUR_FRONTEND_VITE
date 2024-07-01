import styled from 'styled-components';

export const Container = styled.div`
  flex: 1;
  height: 100vh;
  width: 95vw;
  display: flex;
  flex-direction: column;
`;

export const PredefinedThemesExample = styled.div`
  display: inline-block;
  width: 270px;
  height: 300px;
  margin-right: 10px;
  margin-bottom: 10px;

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
      font-size:0.765rem;
      color: var(--blue-twitter);            

      >span{
        margin-left:5px;
      }
    }
`;

export const TaskBar = styled.div`
  display: flex; 
  align-items: center;
  justify-content: space-between;
 
  div {
    display: flex;
    align-items: center;
    justify-content: center;

   
    button {
     display: flex;
     align-items: center;
     justify-content: center;
     border-radius: 0.25rem;

     svg {
       color: var(--blue);
       width: 2rem;
       height: 2rem;
     }

     &:hover {

       svg {
        color: var(--orange);
       }
      }
    }
    
    #include {
      margin-right: 1rem;
      padding: 0.25rem 0.5rem;
      color: var(--secondary);
      font-size: 0.625rem;
      background-color: transparent;

      &:hover {
        color: var(--orange);
      }
    }
  }

  p {
    font-family: Montserrat;
    font-size: 0.75rem;
    color: var(--secondary);
  }
`;

export const ListCostumer = styled.div`
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
            font-size: 0.625rem;
            font-weight: 400;
            color: var(--secondary);

          }

          b {
            font-family: Montserrat;
            font-size: 0.875rem;
            font-weight: 600;
            color: var(--primary);
            margin-right: 0.5rem;
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

export const ProfileTable = styled.div`
  overflow: auto;

  ::-webkit-scrollbar {
    width: 0.225rem;
  }

  ::-webkit-scrollbar-thumb {
    -webkit-border-radius: 0.5rem;
    border-radius: 0.5rem;
    background: var(--orange);
    -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.125);
  }
  table {
    width: 95%;
    border-spacing: 0 0;
    th {
      color: var(--text-body);
      font-weight: 400;
      padding: 0.5rem;
      text-align: center;
      line-height: 1rem;
      background: var(--text-title);
      font-size: 0.75rem;
      color: var(--grey);
      background-color: var(--gray);
    }

    tr:nth-child(odd) {
      background-color:#D9ECEC;
    }

    td {
      padding: 0.5rem;
      border: 0;
      background: var(--shape);
      color: var(--text-body);
      /* background-color: var(--white-card);
      box-shadow: 1px 1px 1px rgba(0, 0, 0, 0.1); */
      font-size: 0.8rem;
      text-align: unset;

      &.wrap {
        max-width: 10rem;
        word-wrap: break-word;
      }

      button {
        float: right;

        svg {
          width: 1rem;
          height: 1rem;
          color: var(--blue-light);
        }

        &:hover {
          svg {
            color: var(--orange);
          }
        }
      }

      input {
        
        padding: 0 0.5rem;
        border-radius: 4px;
        border: 1px solid var(--blue-light);
        word-wrap: break-word;
        font-size: 0.625rem;
        color: var(--blue);

        &:focus {
          border: 1px solid var(--orange);
        }
      }
    }
  }
`;

export const CenterWorkTeam = styled.div`
  align-items: center;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
`;

export const CenterPai = styled.div`
  align-items: center;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
  background-color: var(--gray);
  padding: 0.5rem;
  border-radius: 0.25rem;
  box-shadow: 1px 1px 1px 1px rgba(0,0,0,0.15); 
`;

export const Center = styled.div`
  width: 60%;
  align-items: center;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
`;

export const EditWorkTeam = styled.div`
  width: 70%;
`;

export const EditUserForm = styled.form`
  width: 60%;
  background-color: var(--gray);

  label {
    font-size: 0.675rem;
    color: var(--primary);
    display: flex;
    flex-direction: column;    
    margin-left: 20px;

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
              
    input, select {
      flex: 1;
      font-size: 0.675rem;
      padding: 0.25rem;
      background-color: rgba(255,255,255,0.25);
      width: 95%;
      border-bottom: 1px solid rgba(0,0,0,0.15);
      color: var(--secondary);
      &:focus {
        border-bottom: 1px solid var(--orange);
      }
    }
  }
`;

export const IncludeWorkTeamStyle = styled.div`
  button {
      display: flex;
      align-items: center;
      justify-content: center;
      /* background-color: var(--blue); */
      position: relative;
      padding: 0 0.5rem;
      > svg {
        width: 2rem;
        height: 2rem;
        color: var(--blue);
      }

      &:hover {
        > svg {
          color: var(--orange);
        }
      }
    }
    
    .buttonCheckBox {

      padding: 0.4rem;
      border-radius: 0.25rem;
      font-family: Montserrat;
      font-size: 0.7rem;
      background-color: var(--blue); 
      transition-duration: 0.4s;
      border-radius: 10px;
      color: var(--gray);
      display: flex;
      align-items: center;

      > svg {
        width: 0.8rem;
        height: 1rem;
        color: var(--white);
        margin-right: 0.5rem;
      }

      &:hover {
        filter: brightness(80%);
      }
    }
`;

export const Flags = styled.div`
  font-size: 0.675rem;
  width: 50px;;
`;

export const EditUserFormButton = styled.div`
  width: 60%;
  background-color: var(--gray);
`;

export const CenterUserForm = styled.div`
  background-color: var(--gray);
  padding: 0.5rem;
  border-radius: 0.25rem;
  box-shadow: 1px 1px 1px 1px rgba(0,0,0,0.15); 
`;