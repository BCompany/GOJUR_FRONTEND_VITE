import styled from 'styled-components';

export const Container = styled.div `
   header {
      width: 100%;
      background-color: rgba(0,0,0,0.1);
      justify-content:flex-end;
           
      button {
        margin-right:0;
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
      padding: 0.5rem 1rem;

      section {
        display: flex;
        justify-content: space-between;

        article {
          flex: 1;
          display: flex;
          flex-direction: column;

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

            > span{
              color:var(--grey);
              font-size:0.65rem;
              font-weight: 300;
            }
          }

          span {
            /* color:var(--blue-twitter); */
            font-weight: 300;
            //font-weight: 500;
          }
        }
      }
    }
`;
