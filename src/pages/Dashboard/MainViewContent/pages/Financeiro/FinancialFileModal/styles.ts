import styled from 'styled-components';

interface SearchProps {
  show:boolean
}


export const FileModal = styled.div<SearchProps>`
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
  height:35rem;
  background-color:var(--white);
  position:absolute;
  z-index:99998;
  justify-content:center;
  margin-left:8%;
  margin-top:2%;
  display: ${props => (props.show ? 'block' : 'none')};
  overflow: auto;

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
  }
`;


export const FileModalMobile = styled.div<SearchProps>`
  font-size:0.665rem;
  border-radius:10px;
  box-shadow: 1px 1px 4px 0.5px rgba(0,0,0,0.15);
  width:25rem;
  height:37rem;
  background-color:var(--white);
  position:absolute;
  z-index:999999;
  justify-content:center;
  margin-left:-5%;
  margin-top:6%;
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
  }

  .footer {
    float:right;
    border-top: 1px solid var(--blue-twitter);
    width:100%;
  }
`;


export const GridSubContainer = styled.div`
  width: 100%;
  font-family: Montserrat;
  margin-top:20px;
  border: 1px solid rgba(0,0,0,0.15);
  font-size: 13px;

  big {
    font-size:0.675rem;
    color: var(--blue-twitter);
  }

  span {
    font-size:0.65rem;
    color: var(--blue-twitter);
  }

  text-decoration {
    font-size:0.70rem;
    color: var(--blue-twitter);
  }

  table tr td {
    white-space: inherit;
    font-size:0.70rem;
  }

  svg {
      width: 1rem;
      height: 1rem;
      color: var(--blue-light);
      cursor:pointer;

      &:hover {
        color: var(--orange)
      }
  }
  & tbody tr:nth-of-type(odd){
    background-color: #D9ECEC
  }
`;


export const OverlayFinancial = styled.div `
    background-color: rgba(0, 0, 0, 0.4);
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index:99999;

    /* text inside overlay */
    >div{
      background: var(--white-card);
      height: 3rem;
      color: var(--blue-twitter);
      font-size: 0.765rem;
      text-align: center;
      padding: 1rem;
      margin-left: 30vw;
      margin-right: 25vw;
      margin-top: 20%;
      border-radius: 0.25rem;
      box-shadow: 1px 1px 4px 0.5px rgba(0,0,0,0.15);
    }
`;
