import styled from "styled-components";

export const Container = styled.div`

  background-color: transparent;
  color: #1e293b; /* text-slate-800 */
  height: 100vh;
  min-height: 100vh;
  width: 95vw;
  margin: 0 auto;
  overflow-y: auto;
`;


export const Content = styled.div`
  flex: 1;
  padding: 0.4rem 4rem;
  margin: 0.5rem 0.5rem;
  overflow: auto;
  width: 98%;
`;

export const Section = styled.section`
  background: white;
  border-radius: 1rem;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0,0,0,0.08);
  margin-bottom: 2rem;
`;

export const Card = styled.div`
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 0.75rem;
  padding: 1rem;
  transition: transform 0.18s ease, box-shadow 0.18s ease;
  &:hover {
    transform: translateY(-6px);
    box-shadow: 0 10px 20px rgba(2, 6, 23, 0.12);
  }
`;

/*
export const Label = styled.label`
  font-size: 0.675rem;
  font-weight: 500;
  display: block;
  margin-bottom: 0.25rem;

`;
*/

export const Input = styled.input`
  width: 100%;
  border: 1px solid #cbd5e1;
  border-radius: 0.5rem;
  padding: 0.5rem 0.75rem;
  font-size: 0.675rem;
`;


/*
export const Select = styled.select`
  width: 100%;
  border: 1px solid #cbd5e1;
  border-radius: 0.5rem;
  padding: 0.5rem 0.75rem;
  font-size: 0.675rem;
`;
*/

export const Button = styled.button`
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  font-size: 0.675rem;
  font-weight: 500;
  cursor: pointer;
  border: 1px solid transparent;

  ${({ variant }) =>
    variant === "primary" &&
    `
    background: #2563eb;
    color: white;
    &:hover { background: #1d4ed8; }
  `}

  ${({ variant }) =>
    variant === "success" &&
    `
    background: #16a34a;
    color: white;
    &:hover { background: #15803d; }
  `}

  ${({ variant }) =>
    variant === "danger" &&
    `
    background: #dc2626;
    color: white;
    &:hover { background: #b91c1c; }
  `}

  ${({ variant }) =>
    variant === "outline" &&
    `
    background: white;
    border: 1px solid #e2e8f0;
    color: #334155;
    &:hover { background: #f1f5f9; }
  `}
`;

export const Timeline = styled.div`
  display: flex;
  align-items: center;
  gap: 1.5rem;
  overflow-x: auto;
  padding-bottom: 0.5rem;


  white-space: nowrap;


  overflow-y: hidden;
`;

export const Step = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-shrink: 0; 
`;
export const Circle = styled.div`
  width: 26px;
  height: 26px;
  border-radius: 50%;
  background: white;
  border: 2px solid #475569;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 600;
`;



export const Process = styled.div`
  /* border: 1.5px solid black; */
  width: calc(100% - 1rem);
  background: transparent;
  padding-top: 0.5rem;
  padding-bottom: 0.25rem;
  display: flex;
  align-items: center;
  justify-content: space-between;

  transition: all 0.5s;
  > label {
    font-size: 0.75rem;
    font-weight: 400;
    padding-right: 0.25rem;
    margin-right: 1rem;
  }

  > a {
    width: 100%;
    max-width: 560px;

    text-decoration: none;
    text-align: center;
    font-size: 0.75rem;
    color: var(--secondary);
    border-bottom: 1px solid var(--grey);
    /* border: 1px solid black; */

    display: flex;
    align-items: center;
    justify-content: space-between;

    > p {
      flex: 1;
    }

    @media (min-width: 1366px) {
      max-width: 858px;
    }
    @media (max-width: 1366px) {
      max-width: 560px;
    }

    &:hover {
      border-color: var(--orange);
      color: var(--orange);
    }
  }
  > button#associar {
    width: 100%;
    max-width: 560px;

    text-decoration: none;
    text-align: center;
    font-size: 0.75rem;
    color: var(--secondary);
    border-bottom: 1px solid var(--grey);
    /* border: 1px solid black; */

    display: flex;
    align-items: center;
    justify-content: space-between;

    > p {
      flex: 1;
    }

    @media (min-width: 1366px) {
      max-width: 858px;
    }
    @media (max-width: 1366px) {
      max-width: 560px;
    }

    &:hover {
      border-color: var(--orange);
      color: var(--orange);
    }
  }

  > button {
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 0.5rem;
    > svg {
      width: 24px;
      height: 24px;
      color: var(--grey);
    }

    &:hover {
      background-color: rgba(0, 0, 0, 0.1);

      > svg {
        opacity: 1;
        color: var(--orange);
      }
    }
  }
`;


export const Form = styled.form`
    flex-direction: column;
    padding: 0.5rem 1rem;
    font-size: 0.675rem;
    
    
    .threeColumns {
        grid-template-columns: 1fr 1fr 1fr;
    }
    section#dados, #endereco, #qualify, #representante, #obs{
      display: grid;
     
      @media (min-width: 480px) {
        grid-template-columns: 1fr 1fr 1fr 1fr;
      }

      grid-gap: 1rem;
      position:relative;
      background-color: var(--gray);
      padding: 0.5rem;
      border-radius: 0.25rem;
      box-shadow: 1px 1px 0px 1px rgba(0,0,0,0.15); 
      
      & + section {
        margin-top: 0.5rem;
      }

      #password {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;

          > svg {
            color: var(--orange);
          }

          &:hover{
            color: var(--orange);
          }
        }

.rs__input input {
  all: unset;            
  font: inherit;         
  box-sizing: border-box;
  width: 100%;
  padding: 0;
  margin: 0;
  text-indent: 0;
  direction: ltr;
  position: relative;
  left: 0;
  transform: none;
  white-space: nowrap;
  overflow: hidden;
}

/* Valor e placeholder */
.rs__value-container {
  padding-left: 0;
  overflow: visible;
}

/* Control (caixa do select) */
.rs__control {
  min-height: 36px;
  padding: 0;
}

     .removePassword{
         color: var(--blue-twitter);
         display: flex;
         font-size:0.625rem;
         position: absolute;
         right:0.5rem;
         margin-top:3rem;

        &:hover{
          filter: brightness(80%);
        }
         svg {
          color: var(--orange);
           margin-left: 0.5rem;
           width: 0.75rem;
           height: 0.75rem;
           margin-right: 0.3rem;
         }
     }

    >  label {
        font-size: 0.675rem;
        color: var(--primary);
        display: flex;
        flex-direction: column;    

        &:focus-within {
          //color: var(--orange);

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
          //padding: 0.25rem;
          background-color: rgba(255,255,255,0.25);
          width: 100%;
          border-bottom: 1px solid rgba(0,0,0,0.15);
          color: var(--secondary);

          &:focus {
            border-bottom: 1px solid var(--orange);
          }
        }       
      }

      div#repre {
        width: 200%;
        display: flex;
        align-items: center;
        justify-content: space-between;
        
        > label {
          display: flex;
          flex-direction: row;
          align-items: center;
          color: var(--secondary);
          font-size: 0.625rem;

          input {
            margin-right: 0.5rem;
          }
        }

        > button {
          padding: 0.5rem;
          color: var(--secondary);

          &:hover{
            color: var(--orange);
          }
        }
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
          border-radius: 0.25rem;
        }
    
    }

    .selectGroup{

      height: 25px;
      margin-top: -4px;
      margin-left: 0px;
    }

    .selectStatus{

      height: 51px;
      margin-top: 0px;
      margin-left: 0px;
    }

    .selectSalesChannel{

      height: 51px;
      margin-top: 0px;
    }

    > label {
      margin-top: 1rem;
      display: flex;
      font-size: 0.625rem;
      flex-direction: column;
    
       #triggerDados {
        display: flex;
        flex-direction: column;
        color: var(--secondary);

        #triggerSelect {
          width: 250px;
          margin-left: 5px;
          margin-right:15px;
          font-size: 0.625rem;
        }

         #triggerSubject {
          width: 250px;
          margin-left: 5px;
          margin-right:15px;
          font-size: 0.625rem;
        }

        #triggerLembrete {
          width: 250px;
          margin-left: 5px;
          margin-right:15px;
          font-size: 0.625rem;
        }

      #timepicker {
        color: var(--secondary);

        }

      }

      #trigger {
        display: flex;
        flex-direction: row;
        align-items: center;
        color: var(--secondary);

        #triggerSelect {
          width: 250px;
          margin-left: 5px;
          margin-right:15px;
          font-size: 0.625rem;
        }

         #triggerSubject {
          width: 250px;
          margin-left: 5px;
          margin-right:15px;
          font-size: 0.625rem;
        }

        #triggerNumber {
          width: 50px;
        }

        #triggerHour {
          width: 50px;
        
        }

      }
    }

      > p {
        text-align: center;
        font-family: Montserrat;
        font-size: 0.675rem;
        font-weight: 500;
        color: var(--grey);
        width: 124px;
        background-color: var(--gray);
        border-radius: 0.25rem;       
      }     
    

    footer {
      background-color: var(--gray);
      padding: 0.5rem;
      margin-top: 1rem;
      //height:20vh;
      border-radius: 0.25rem;
      box-shadow: 1px 1px 0px 1px rgba(0,0,0,0.15); 
      
      p{
         font-size: 0.675rem;
         margin-right: 1rem; 
        }

      > label {
        display: flex;
        align-items: center;

        input {
          flex: 1;
          margin-right: 0.5rem; 
          font-size: 0.675rem;
          border-bottom: 1px solid rgba(0,0,0,0.15);
          color: var(--secondary);
          padding: 0.25rem;

          &:focus{
            border-bottom: 1px solid var(--orange);
          }
        }
        > button {
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--white);
          font-size: 0.675rem;
          padding: 0.25rem 1rem;
          border-radius: 0.25rem;

          > svg {
            margin-left: 0.5rem;
            width: 1rem;
            height: 1rem;
          }
        }
      }

      > div {
        align-items: center;
        display: flex;
        justify-content: flex-end;
        margin-top: 1rem;
      }
    }

    .css-yk16xz-control{
      background-color: rgba(255,255,255,0.25);
    }

`;
