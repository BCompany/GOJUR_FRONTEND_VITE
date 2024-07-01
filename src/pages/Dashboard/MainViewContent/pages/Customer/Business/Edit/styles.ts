import styled from 'styled-components';

export const Container = styled.div`
  flex: 1;
  height: 100vh;
  @media (min-width: 480px) {
    padding: 0.5rem 3rem; // browser
  }
`;

export const Content = styled.div `
    flex: 1;
    flex-direction: column;
    height: 100vh;
    background-color: var(--white);
    border-radius: 0.25rem;
    box-shadow: 1px 1px 5px 5px rgba(0,0,0,0.15);
    overflow: auto;

    .lineDivisor{
      margin-top:15px;
      margin-bottom:15px;
      background-color:var(--blue-twitter);
      height:2px;
      opacity:0.4;
    }

    textarea {
      background-color: var(--white);
      border: 1px solid rgba(0, 0, 0, 0.5);
      width: 100%;   // mobile
      @media (min-width: 480px) {
        width: 203%; // browser
      }         
    }
`

export const Form = styled.form`
    flex-direction: column;
    padding: 0.5rem 1rem;
    font-size: 0.675rem;

    .threeColumns {
        grid-template-columns: 1fr 1fr 1fr;
    }

    section{
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

      .textInputBig{
        width: 100%;   // mobile
        @media (min-width: 480px) {
          width: 203%; // browser
        }         
      }

      .textInputMedium{
        width: 40%;   // mobile
        @media (min-width: 480px) {
          width: 99%; // browser
        }         
      }

      .textInputSmall{
        width: 40%;   // mobile
        @media (min-width: 480px) {
          width: 70%; // browser
        }         
      }

      .whats{
        svg {
          color: var(--green);
          width: 18px;
          height: 19px;
        }
      }

      .whatsButtonDiv{
        float: left;
        margin-Top: 4px;
        margin-Left: 5px;
      }

    >  label {
        color: var(--primary);
        display: flex;
        flex-direction: column;    
        font-size: 0.765rem;
        color: var(--secondary);

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

      /* > textarea {
        border: 1px solid rgba(0,0,0,0.5);
        width: 100%;
        @media (min-width: 480px) {
          width: 100%;
        }
        
        height: auto;
        padding: 0.5rem;
        background-color: var(--white);
        color: var(--secondary);
        font-size: 0.75rem;
        border-radius: 0.25rem;
      }   */
  }

    .css-yk16xz-control{
      background-color: rgba(255,255,255,0.25);
    }
`;
