import styled from 'styled-components';

export const Container = styled.div`
 display: flex;
 align-items: center;
 justify-content: center;
 flex-direction: column;
 font-size: 0.625rem;

 .reportGenerating {
      background-color: #ffffb1
      height:25px;
      padding:0.1rem;
      text-align:center;
      width:95%;
      margin-left:1rem;
      color: var(--blue-twitter);      
      font-family:montserrat;
      font-weight:500;
} 

 h1 {
   font-family: Montserrat;
   font-size: 0.625rem;
   font-weight: 500;
   color: var(--primary);
 }

 > div{
  display:  flex;
  flex-direction: column;
  margin-top: 1rem;
  width: 100%;
  
   label {
     display: flex;
     flex-direction: column;
     align-items: center;
     margin: 0 0.5rem;
     font-size: 0.625rem;

     & + label {
       margin-top: 0.5rem;
     }
     p {
       /* font-size: 0.625rem; */
       color: var(--secondary);
     }

     input, select {
       margin-top: 0.5rem;
       border-bottom: 1px solid rgba(0,0,0,0.1);
       width: 100%;
       /* color: var(--primary);
       padding: 0.25rem;
       
       
       &:focus{
        border-bottom: 1px solid var(--orange);
       }

       option{
         
       } */
     }
     select#fixed {
        -webkit-appearance: none;
    }

     select {
       width: 10%;
     }
     
   }
 }
 
> footer {
    margin-top: 1rem;
  /* > button {  
    background-color: var(--blue);
    padding: 0.5rem 1rem;
    border-radius: 0.25rem;
    color: var(--white);
  
    & + button {
      margin-left: 1rem;
    }
    &:hover{
      filter: brightness(80%);
    }
 }     */

}
       
`;
