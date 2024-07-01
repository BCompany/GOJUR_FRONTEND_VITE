import styled from 'styled-components';

interface SearchProps {
  show:boolean
}


export const ModalCustomer = styled.div`

  border: 1px solid var(--blue-twitter);
  font-size:0.665rem;
  box-shadow: 1px 1px 4px 0.5px rgba(0,0,0,0.15);
  width:30rem;
  height:29.5rem;
  background-color:var(--white);
  position:absolute;
  z-index:99998;
  justify-content:center;
  margin-left:25%;
  margin-top:15%;

  input, select {
      flex: 1;
      font-size: 0.675rem;
      padding: 0.25rem;
      background-color: rgba(255,255,255,0.25);
      border-bottom: 1px solid rgba(0,0,0,0.15);
      color: var(--secondary);

      &:focus {
        border-bottom: 1px solid var(--orange);
      }

      flex-direction: column;
    padding: 0.5rem 1rem;
    font-size: 0.675rem;
    
    .threeColumns {
        grid-template-columns: 1fr 1fr 1fr;
    }
    section#dados, #qualify, #representante, #obs{
      display: grid;
     
      @media (min-width: 480px) {
        grid-template-columns: 1fr 1fr;
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
      
     div {
       // flex: 1;
       
       // width: 200%;
       
       /* align-items: right; 
       justify-content: right; */

       /* button remove adress replace by classnae buttonLinkClick */
       /* > button {
         color: var(--primary);
         display: flex;
         font-size: 0.625rem;         
         align-items: center;
         justify-content: center;
         transition: filter 0.25s;

        &:hover{
          filter: brightness(80%);
        }
        
         svg {
           color: var(--orange);
           margin-left: 0.5rem;
           width: 0.75rem;
           height: 0.75rem;
         }
       } */
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
              
        input, select {
          flex: 1;
          font-size: 0.675rem;
          padding: 0.25rem;
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
    
      #contact {
          display: flex;
          flex-direction: row;
          align-items: center;
          color: var(--secondary);

          #contactSelect {

            width: 2px;
            margin-left: 5px;
            margin-right:15px;
            font-size: 0.625rem;

          }
          /* :first-child {
            margin: 0 0.5rem;
            padding: 0.25rem 0.5rem;
            background: var(--white);
            border-bottom: 1px solid rgba(0,0,0,0.15);
            color: var(--secondary);


            &:focus {
            border-bottom: 1px solid var(--orange);
          } */

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
    }  
    
    /* button add more adress replace by class buttonLinkClick */
    /* > button , #addEnd {
        display: flex;
        align-items: center;
        justify-content: center;
        margin-top: 1rem;
        padding: 0.25rem;
        font-size: 0.675rem;
        border-radius: 0.25rem;
        color: var(--secondary);
        background-color: var(--gray-outline);
        &:hover {
          filter: brightness(80%);
        }
        > svg {
          color: var(--blue-twitter);
          width: 1rem;
          height: 1rem;
          margin-left: 0.5rem;
        } 
      } */

    footer {
      background-color: var(--gray);
      padding: 0.5rem;
      margin-top: 1rem;
      height:20vh;
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

        /* >button {
          background-color: var(--blue);
          color: var(--white);
          padding: 0.5rem 1rem;
          margin: 0 0.5rem;
          display: flex;
          font-size: 0.675rem;
          
          align-items: center;
          justify-content: center;
          border-radius: 0.25rem;

          &:hover{
            filter: brightness(80%);
          } 

          > svg {
            width: 1rem;
            height: 1rem;
            margin-left: 0.5rem;
          }
        } */
      }
    }

      
    }
`;

export const ModalCustomerMobile = styled.div`
  border: 1px solid var(--blue-twitter);
  font-size:0.665rem;
  box-shadow: 1px 1px 4px 0.5px rgba(0,0,0,0.15);
  width:29rem;
  height:36rem;
  background-color:var(--white);
  position:absolute;
  z-index:99999;
  justify-content:center;
  margin-left:-22%;
  margin-top:15%;

  input, select {
      flex: 1;
      font-size: 0.675rem;
      padding: 0.25rem;
      background-color: rgba(255,255,255,0.25);
      border-bottom: 1px solid rgba(0,0,0,0.15);
      color: var(--secondary);

      &:focus {
        border-bottom: 1px solid var(--orange);
      }

      flex-direction: column;
    padding: 0.5rem 1rem;
    font-size: 0.675rem;
    
    .threeColumns {
        grid-template-columns: 1fr 1fr 1fr;
    }
    section#dados, #qualify, #representante, #obs{
      display: grid;
     
      @media (min-width: 480px) {
        grid-template-columns: 1fr 1fr;
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
      
     div {
       // flex: 1;
       
       // width: 200%;
       
       /* align-items: right; 
       justify-content: right; */

       /* button remove adress replace by classnae buttonLinkClick */
       /* > button {
         color: var(--primary);
         display: flex;
         font-size: 0.625rem;         
         align-items: center;
         justify-content: center;
         transition: filter 0.25s;

        &:hover{
          filter: brightness(80%);
        }
        
         svg {
           color: var(--orange);
           margin-left: 0.5rem;
           width: 0.75rem;
           height: 0.75rem;
         }
       } */
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
              
        input, select {
          flex: 1;
          font-size: 0.675rem;
          padding: 0.25rem;
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
    
      #contact {
          display: flex;
          flex-direction: row;
          align-items: center;
          color: var(--secondary);

          #contactSelect {

            width: 2px;
            margin-left: 5px;
            margin-right:15px;
            font-size: 0.625rem;

          }
          /* :first-child {
            margin: 0 0.5rem;
            padding: 0.25rem 0.5rem;
            background: var(--white);
            border-bottom: 1px solid rgba(0,0,0,0.15);
            color: var(--secondary);


            &:focus {
            border-bottom: 1px solid var(--orange);
          } */

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
    }  
    
    /* button add more adress replace by class buttonLinkClick */
    /* > button , #addEnd {
        display: flex;
        align-items: center;
        justify-content: center;
        margin-top: 1rem;
        padding: 0.25rem;
        font-size: 0.675rem;
        border-radius: 0.25rem;
        color: var(--secondary);
        background-color: var(--gray-outline);
        &:hover {
          filter: brightness(80%);
        }
        > svg {
          color: var(--blue-twitter);
          width: 1rem;
          height: 1rem;
          margin-left: 0.5rem;
        } 
      } */

    footer {
      background-color: var(--gray);
      padding: 0.5rem;
      margin-top: 1rem;
      height:20vh;
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

        /* >button {
          background-color: var(--blue);
          color: var(--white);
          padding: 0.5rem 1rem;
          margin: 0 0.5rem;
          display: flex;
          font-size: 0.675rem;
          
          align-items: center;
          justify-content: center;
          border-radius: 0.25rem;

          &:hover{
            filter: brightness(80%);
          } 

          > svg {
            width: 1rem;
            height: 1rem;
            margin-left: 0.5rem;
          }
        } */
      }
    }
`;