import styled from 'styled-components';

interface SearchProps {
  show:boolean
}

interface cardSize{
  autoSizeCard?: boolean;
}

export const MatterCRMModalStyle = styled.div<SearchProps>`
  font-size:0.665rem;
  border-radius:10px;
  box-shadow: 1px 1px 4px 0.5px rgba(0,0,0,0.15);
  @media(max-width:1920px){margin-left:12%; margin-top: 4%}
  @media screen and (max-width:1280px) and (max-height: 768px){width:49rem; height: 31rem; margin-top:1%;}
  @media screen and (max-width:1366px) and (max-height: 768px){width:49rem; height: 31rem; margin-top:1%;}
  @media screen and (max-width:1280px) and (max-height: 720px){width:49rem; height: 30rem; margin-top:1%;}
  @media screen and (max-width:1280px) and (max-height: 1024px){width:49rem; height: 31rem; margin-top:1%;}
  @media screen and (max-width:1280px) and (max-height: 600px){width:49rem; height: 24rem; margin-top:1%;}
  @media(max-width:1024px){margin-left:0%; width:49rem;}
  width:57rem;
  height:30rem;
  background-color:var(--white);
  position:absolute;
  z-index:999999;
  justify-content:center;
  margin-left:8%;
  margin-top:2%;
  display: ${props => (props.show ? 'block' : 'none')};

  .header {
    background-color: rgba(0,0,0,0.1)
  }

  .headerLabel{
    text-align: center;
    font-size: 16px;
    font-family: montserrat;
    font-weight: normal;
    padding: 5px;
  }

  .mainDiv {
    margin-left: 10px;
    margin-top: 10px;
    margin-right: 10px;
    height: 84%;
    overflow: auto;
    @media screen and (max-width:1280px) and (max-height: 768px){height: 84%;}
    @media screen and (max-width:1280px) and (max-height: 600px){height: 80%;}
  }

  .footer {
    float:right;
    border-top: 1px solid var(--blue-twitter);
    width:100%;
    bottom: 0;
    position: absolute;
    margin-bottom: 2%;
  }

  .centered {
    position: absolute;
    width: max-content;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    box-shadow: 2px 2px 2px 2px rgba(0, 0, 0, 0.2);
    border-radius: 0.25rem;
    padding: 15px; 
    font-size: 14px;
    background-color: #FFF;
    color: blue;
  }

`;


export const ListCards = styled.div`
    display: grid;

    @media (min-width: 480px) {
        grid-template-columns: 1fr 1fr;
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
    font-family: Montserrat;

    .matterFollowBox{
      width: 99%;
      font-Size: 13px;
      background-Color: #FBFBFB;
      border: solid 1px white;
      border-Radius: 6px;
      box-shadow: 1px 1px 1px 1px rgba(0, 0, 0, 0.2);
    }
    
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
      }
    } 
`;
