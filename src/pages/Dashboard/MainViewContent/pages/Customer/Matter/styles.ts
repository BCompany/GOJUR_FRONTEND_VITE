import styled from 'styled-components';

interface cardSize{
  autoSizeCard: boolean;
}

export const Container = styled.div`
  flex: 1;
  height: 100vh;
  width: 100%;
  display: flex;
  flex-direction: column;
  padding: 0.5rem 4rem;
  
`;

export const Content = styled.div`

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
`;

export const ListMatter = styled.div`
    flex: 1;
    display: grid;
    /* overflow: auto; */

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
    min-height: ${props => (!props.autoSizeCard ? '11rem' : '17rem')}; 
    max-height: ${props => (!props.autoSizeCard ? '11rem' : '17rem')}; 
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
            //color: var(--blue-twitter);
            color: var(--white);
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
