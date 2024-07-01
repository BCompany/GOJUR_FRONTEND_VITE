import styled from 'styled-components';

interface colorProps{
  colorName: string;
}

interface activityProps{
  show:boolean;
}


export const Container = styled.div`
  flex: 1;
  height: 100vh;
  width: 96vw;
  display: flex;
  flex-direction: column;
`;


export const Content = styled.div`
    padding: 0.5rem 1rem;
    margin: 0.5rem 1rem;
    background-color: rgba(255,255,255, 0.3);
    border-radius: 0.25rem;
    height:100%;
    box-shadow: 1px 1px 4px 0.5px rgba(0,0,0,0.15);
    overflow:auto;

    .buttonsHeader{
      position: absolute;
      float: right;
      right: 0px;
      margin-right: 10px;
      margin-top: -60px;
    }

    .selectFunnelSteps {
      width: 100%;
      margin-left:-1px;
      justify-content: center;
      position:relative;
      align-items: center;
    }

    .messageEmpty{
      text-align: center;
      font-size:1rem;
      width: 88vw;
      margin-top: 25vh;
      color: var(--blue-twitter);

      >svg{
        width:2rem;
        height:2rem;
      }
    }

    .headerInformation {
      display:flex;
      font-size:0.65rem;
      color: var(--blue-twitter);
      font-family:Montserrat;
      margin-top:10px;
      opacity:0.9;

      >label{
        margin-top:5px;
      }

      .filterConclude{
        color: var(--blue-twitter);
        flex: auto;
        margin-right:1rem;
      }

      .filterLose{
        color: var(--red);
        flex: auto;
        margin-right:1rem;
      }

      .filterFile{
        color: var(--grey);
        flex: auto;
        margin-right:1rem;
      }

      .filterFollowing{
        color: var(--green);
        flex:auto;
        margin-right:1rem;
      }

      .dateStartText{
        margin-top:7px;
        margin-right: 5px;
      }

      .dateStartInput{
        margin-top:4px;
      }

      .infoButton {
        cursor:pointer;
        width: 1rem;
        height: 1rem;
        margin-top:5px;
        margin-left:-10px;
      }
    }

    .totalLines {
      margin-top:-3px;
      margin-bottom:-10px;
      font-size:0.65rem;
      font-weight:500;
      color: var(--blue-twitter);
    }
`;


export const ListActivitiesSearch = styled.div<activityProps>`
  display:flex;
  position:absolute;
  flex-direction:column;
  overflow:auto;
  font-family: Montserrat;
  z-index:999;
  font-size:0.65rem;
  height:100%;
  width:94%;
  margin:0.5rem;
  display: ${activityProps => (activityProps.show? 'block': 'none')};

  .infoMessage{
    color: var(--blue-twitter);
    font-size:0.765rem;
    display: flex;
    text-align:center;
    flex-direction:column;
    margin-top:13rem;
    width:100%;

    > svg {
      text-align: center;
      margin-left:49%;
      margin-bottom:5px;
      width:1.5rem;
      height:1.5rem;
    }
  }

  .toolBarSearch {
    display:flex;
    width:90%;
    height:2.5rem;
    padding:0.5rem;
    float:right;
    justify-content:flex-start;
    z-index:9999;
    background-color: var(--white);

    label {
      padding-top:3px;
      margin-right:1rem;
    }

    .loaderSearch{
      display:flex;
      margin-top:0.3rem;
      margin-left:10px;
      color: var(--blue-twitter);
    }

    .select {
      margin-top: -5px;
      width: 8.5rem;
      margin-right:10px;
    }

    .infoIcon {
      width: 1rem;
      height: 1rem;
      margin-top:0.3rem;
      cursor:help;
      margin-right:5px;
    }

    .searchIcon {
      width: 1rem;
      height: 1rem;
      margin-top:0.3rem;
      margin-left:-0.2rem;
      color: var(--blue-twitter);
      cursor:pointer;
    }

    .textIcon {
      font-size:0.675rem;
      margin-left:5px;
      font-family: Montserrat;
      margin-top:0.5rem;
      color: var(--blue-twitter);
    }
  }

  .toolBarButtons {
    background-color: var(--white);
    display:flex;
    width:10%;
    height:2.5rem;
    padding:0.5rem;
    float:right;
    z-index:9999;
    justify-content:flex-end;
  }

  .contentList {
    width:100%;
    height:100%;
    border-top: 1px solid var(--gray-outline);
    box-shadow: 1px 1px 4px 0.5px rgba(0,0,0,0.15);
    background-color: var(--white);

    .itemList {
      display:flex;
      flex-direction:row;
      justify-content: space-between;
      margin:1px;
      padding:0.5rem;
      cursor:pointer;
      background-color:white;
      border:1px solid var(--gray);
      border-radius:5px;
      flex-wrap: wrap;
      align-items: flex-end;
      box-shadow:0.5px 0.5px 0.5px 0.5px rgba(0,0,0,0.15);

      svg{
        width:0.5rem;
        height:0.5rem;
        cursor:help;
      }

      .customerColumn {
        flex: 1;
        padding-right:1rem;
        max-width:20%;
        svg{
          width:0.8rem;
          height:0.8rem;
          cursor:help;
          color:var(--blue-twitter);
        }
      }

      .descColumn{
        max-width:20%;
        padding-right:1rem;
        flex: 1;
      }

      .activityColumn{
        max-width:50%;
        padding-right:1rem;
        flex: 1;
      }

      .dateColumn{
        flex: 1;
        padding-right:1rem;
        max-width:10%
      }
    }
  }
`;


export const List = styled.div`
    display: inline-block;
    vertical-align: top;
    white-space: nowrap;
    margin-left:-20px;

    @media (min-width: 480px) {
      grid-template-columns: 1fr 1fr;
    }
`;


export const Card = styled.div`
    width: 15.6rem;
    display: inline-flex;
    margin:0.4rem;
    flex-direction: column;
    align-items: center;
    box-shadow: 2px 2px 2px 2px rgba(0,0,0,0.4);
    border-radius: 0.25rem;
    font-size:0.75rem;
    font-family: Montserrat;
    background-color:var(--white);
    height:auto;
    min-height:10vh;

    header {
      width: 100%;
      display: flex;
      align-items: center;
      font-weight:500;
      font-size:0.765rem;
      padding-left:1rem;
      padding-right:1rem;
      justify-content: center;
      background-color: rgba(0,0,0,0.1);
      font-family: Montserrat;
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: normal;
      word-break:break-all;

      >svg{
        cursor:pointer;
      }
    }

    .totalHeader {
      font-size: 0.650rem;
      font-weight:500;
      color:var(--blue-twitter);
      margin-top:0.2rem;
      margin-bottom:-0.5rem;
    }
`;


export const BusinessCard = styled.div<colorProps>`
  width:95%;
  cursor:pointer;
  margin: 0.5rem 0.5rem;
  padding: 0.5rem 0.5rem;
  border-left: 3px solid ${colorProps => (colorProps.colorName)};
  box-shadow: 2px 2px 2px 2px rgba(0,0,0,0.1);
  border-radius: 0.25rem;
  font-size:0.65rem;
  font-weight:200;

  >div{
    > p{
      white-space: normal;
      > label {
        font-weight:500;
        margin-right:5px;
      }

      .customerLink {
        color: var(--blue-twitter);
        font-weight:500;
        cursor:pointer;
      }
    }

    .customerInfo{
      height: auto;
      font-size:0.60rem;
      padding:0.5rem;
      white-space: normal;
      border-radius: 0.25rem;
      border: 0.1px solid ${colorProps => (colorProps.colorName)};
      box-shadow: 2px 2px 2px 2px rgba(0,0,0,0.1);
      margin:0.2rem;

      >p{
        span:first-child{
          color: var(--secondary);
          font-weight: 500;
        }
        line-break:anywhere;
        cursor:default;
        text-align:center;
        color: var(--secondary);

        .whatsIcon{
          color: var(--green-dark);
          cursor:pointer;
        }

        .copyIcon{
          width:0.75rem;
          height:0.75rem;
          cursor:pointer;
          color:var(--blue-twitter);
        }
      }
    }
  }

  .headerCard {
    display: flex;
    cursor: pointer;
    float: right;
    color:var(--blue-twitter);
    width: 0.85rem;
    height: 0.85rem;
    margin-right:-10px;
    margin-top: -5px;

    :hover  {
      color: var(--orange);
    }
  }

  .notificationsCard {
    cursor: pointer;
    color:var(--blue-twitter);
    font-size:0.65rem;

    >svg{
      width: 0.65rem;
      height: 0.65rem;
    }

    :hover  {
      color: var(--orange);
    }
  }
`;
