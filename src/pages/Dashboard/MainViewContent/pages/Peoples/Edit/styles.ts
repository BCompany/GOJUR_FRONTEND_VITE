import styled from 'styled-components';

interface cardSize{
  autoSizeCard?: boolean;
}
export const Flags = styled.div`
  font-size: 0.675rem;
  width: 50px;;
`;


export const Container = styled.div`
  flex: 1;
  height: 100vh;
  @media (min-width: 480px) {
    padding: 0.5rem 3rem; // browser
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
            #BtSvCl{
              margin-right: 10px
            }
          }
        }       
  
  .selectFederalUnit {
    width:53%;
    margin-left:5%;
    
  };
  .adv {
    width:45%
  };

  .contactSelect{
    width:150px
  }

  .infoMessage{
      color: var(--blue-twitter);
      font-size:0.725rem;
      display: flex;
      text-align:center;
      flex-direction:column;
      width:100%;
      margin-top:-25%;
      
      > svg {
        text-align: center;
        margin-left:49%;
        margin-bottom:5px;
        width:2rem;
        height:2rem;
      }
    }
    .css-yk16xz-control{
      background-color: rgba(255,255,255,0.25);
    
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
    

    header {
      width: 100%;
      padding: 0.25rem 1rem;
      background-color: transparent;

      button {

        float:right;
        margin-right: 1rem;
        justify-content: flex-end;
        svg {
          width: 1.5rem;
          height: 1.5rem;
          color: var(--orange);
        }
      }
    }    
`;

export const Form = styled.form`
    flex-direction: column;
    padding: 0.5rem 1rem;
    font-size: 0.675rem;
    padding-bottom: 11%;
    margin-bottom:4%;
    height: auto;

    #Select {
      width: 10px;
    }

    .contactSelect {
      width: 10px;
    }
    
    .threeColumns {
        grid-template-columns: 1fr 1fr 1fr;
    }
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
            #BtSvCl{
              margin-right: 10px
            }
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

export const FormMobile = styled.form`
    flex-direction: column;
    padding: 0.5rem 1rem;
    font-size: 0.675rem;
    padding-bottom: 60%;
  
    
    .threeColumns {
        grid-template-columns: 1fr 1fr 1fr;
    }
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
            #BtSvCl{
              margin-right: 10px
            }
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
    .css-yk16xz-control{
      background-color: rgba(255,255,255,0.25);
    }
`;

export const ListCards = styled.div`
    display: grid;

    @media (min-width: 480px) {
        grid-template-columns: 1fr 1fr;
    } 
    .css-yk16xz-control{
      background-color: rgba(255,255,255,0.25);
    }  
`;

export const Card = styled.div<cardSize>`
    display:flex;
    box-shadow: 2px 2px 2px 2px rgba(0, 0, 0, 0.2);
    border-radius: 0.25rem;
    flex-direction: column;
    font-size:0.625rem;
    margin:1rem;
    word-break: break-all;
    min-height: ${props => (!props.autoSizeCard ? '10rem' : '17rem')}; 
    max-height: ${props => (!props.autoSizeCard ? '10rem' : '17rem')}; 
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

        /* div {
          span:first-child{
            font-weight:500;
          }
          margin-top:0.2rem;
          margin-bottom:0.1rem;
        } */

        .footer {
          /* display:flex;
          justify-content:space-between;
          margin:0.25rem; */
          
          /* button {
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
          } */
        }
      }
    } 
    .css-yk16xz-control{
      background-color: rgba(255,255,255,0.25);
    }
`;


    
 