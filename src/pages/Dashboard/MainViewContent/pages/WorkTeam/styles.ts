import styled from 'styled-components';

interface cardSize{
  autoSizeCard: boolean;
}

export const Container = styled.div`
  flex: 1;
  height: 100vh;
  display: flex;
  flex-direction: column;
  padding: 0.5rem 4rem;
`;

export const Content = styled.div`
    flex: 1;
    display: flex;
    flex-direction: column;
    
    height: 100vh;
    background-color: var(--white);
    border-radius: 0.25rem;
    box-shadow: 1px 1px 5px 5px rgba(0,0,0,0.15);
    overflow: auto;
/*     
      ::-webkit-scrollbar {
      width: 6px;
      }
    
    ::-webkit-scrollbar-thumb {
      -webkit-border-radius: 0.5rem;
      border-radius: 0.5rem;
      background: var(--orange);
      -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.5);
    } */

    header {
      width: 100%;
      padding: 0.25rem 1rem;
      background-color: transparent;

      button {
        display: flex;
        align-items: center;
        justify-content: center;
        svg {
          width: 1.5rem;
          height: 1.5rem;
          color: var(--orange);
        }
      }
    }    

    .messageEmpty{
      color: var(--blue-twitter);
      justify-content:center;
      text-align: center;
      font-size:0.875rem;
      display: flex;
      flex-direction:column;
      width:100%;
      margin-top:20%;

      > svg {
        justify-content:center;
        text-align: center;
        margin-left:50%;
        width:1.5rem;
        height:1.5rem;
      }
    }
`;

export const Form = styled.form`
    display: flex;
    flex-direction: column;
    padding: 0.5rem 1rem;


    section#dados, #endereco, #qualify, #representante, #obs{
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
         color: var(--primary);
         display: flex;
         font-size:0.575rem;
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
         }
     }
      
     div {
       // flex: 1;
       
       // width: 200%;
       display: flex;
       align-items: right; 
       justify-content: right;

       > button {
         color: var(--primary);
         display: flex;
         font-size: 0.565rem;         
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
       }
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

      .required {
        font-weight: 600;
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

  

    > label {
      margin-top: 1rem;
      display: flex;
      font-size: 0.625rem;
      flex-direction: column;

    
      #contact {
          display: flex;
          flex-direction: row;
          align-items: center;

          select {
            margin: 0 0.5rem;
            padding: 0.25rem 0.5rem;
            background: var(--white);
            border-bottom: 1px solid rgba(0,0,0,0.15);
            color: var(--secondary);


            &:focus {
            border-bottom: 1px solid var(--orange);
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
    }  
    
    > button , #addEnd {
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
      }
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

        >button {
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
        }
      }
    }
`;

export const ListMatter = styled.div`
    flex: 1;
    display: grid;

    @media (min-width: 480px) {
        grid-template-columns: 1fr 1fr;
        //grid-gap: 3rem;
    }
    align-items: center;
    justify-content:space-between;
`;

export const MatterCard = styled.div<cardSize>`
    display:flex;
    box-shadow: 2px 2px 2px 2px rgba(0, 0, 0, 0.2);
    border-radius: 0.25rem;
    flex-direction: column;
    font-size:0.775rem;
    margin:1rem;
    word-break: break-all;
    min-height: ${props => (!props.autoSizeCard ? '10rem' : '17rem')}; 
    max-height: ${props => (!props.autoSizeCard ? '10rem' : '17rem')}; 
    // background-color: var(--white-card);
    background-color: ${props => (!props.autoSizeCard ? 'var(--white-card)' : 'rgb(250, 250, 225)')}; 
    font-family: Montserrat;
    
    header {
      width: 100%;
      display: flex;
      background-color: rgba(0,0,0,0.1);
      padding: 0.20rem 1rem;
      font-weight:500;
      font-size:0.825rem;
      justify-content: space-between;
      
      button {
        display: flex;
        align-items: center;
        justify-content: center;

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

    > section {
      cursor: pointer;
      margin-top: 0.375rem;
      display: flex;
      font-size: 0.575rem;
      flex-direction: column;
      overflow: auto;

      .progress {
        color: var(--orange);
        text-align: center;
      }

      ::-webkit-scrollbar {
        width: 3px;
      }
      
      ::-webkit-scrollbar-thumb {
        -webkit-border-radius: 0.2rem;
        border-radius: 0.2rem;
        background: var(--orange);
        -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.5);
      }

      > label {
        margin-left:5px;
        padding:0.05rem;
        font-size:0.585rem;

        > span:first-child{
          font-weight:600;          
        }

        > span {        
          margin-right:4px;          
        }

        div {
          span:first-child{
            font-weight:500;
          }
          margin-top:0.2rem;
          margin-bottom:0.1rem;
        }

        .footer {
          display:flex;
          justify-content:space-between;
          margin:0.25rem;
          
          button {
            font-size:0.525rem;
            font-weight: 400;
            color: var(--blue-twitter);
            text-align: left;           
            cursor:pointer;
            &:hover {
              color: var(--orange);
            }

            svg {
              margin-right: 0.3rem;
            }
          }
        }
      }
    } 
`;

export const CheckModal = styled.div`
  width: 65%;
  height: auto;
  max-height: 25rem;
  background-color: #fff;
  box-shadow: 4px 4px 4px 4px rgba(0, 0, 0, 0.3);
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  position: absolute;
  top: 35%;

  > header {
    display: flex;
    align-items: center;
    justify-content: center;
    padding-right: 0.5rem;
    padding-top: 0.25rem;
    background-color: rgba(0, 0, 0, 0.1);
    color: var(--orange);
    > button {
      width: 24px;
      height: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
      > svg {
        width: 24px;
        height: 24px;
        color: var(--secondary);
      }

      &:hover {
        > svg {
          color: var(--orange);
        }
      }
    }
  }

  div {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 1rem 4rem;
    p {
      font-size: 0.675rem;
      color: var(--primary);
    }
  }

  footer {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    padding: 1rem;

    button {
      padding: 0.5rem 2rem;
      color: var(--white);
      border-radius: 0.25rem;
      margin: 0 0.5rem;
      display: flex;
      align-items: center;
      justify-content: center;

      svg {
        color: var(--white);
        width: 1.25rem;
        height: 1.25rem;
        margin-right: 0.5rem;
      }

      &:hover {
        filter: brightness(75%);
      }

      &.accept {
        background-color: var(--green);
      }

      &.cancel {
        background-color: var(--red);
      }
    }
  }
`;
