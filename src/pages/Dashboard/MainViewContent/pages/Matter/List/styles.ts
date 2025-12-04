import styled from 'styled-components';

export const Container = styled.div`
  flex: 1;
  height: 100vh;
  width: 95vw;
  display: flex;
  flex-direction: column;
  overflow:auto;
  font-family: Montserrat verdana;

  .messageEmpty {
    position:absolute;
    margin-top:45vh;
    margin-left:40vw;
    display:flex;
    flex-direction: column;
    justify-content:center;
    color:var(--blue-twitter);
    font-size:0.85rem;

    svg{
      width:1.5rem;
      height:1.5rem;
      margin-left:45%;
      cursor:pointer;
      color: var(--blue-twitter);
    }
  }
`;

export const Filter = styled.div`
  display:flex;
  width:98%;
  max-height:3.3rem;
  padding: 0.5rem 0.5rem;
  margin-left:7px;
  margin-right:1rem;
  margin-top:0.4rem;
  border-bottom:1px solid var(--gray-outline);
  font-size:0.65rem;
  justify-content:space-evenly;

  .buttonInclude {
    /* margin-right:50%;
    margin-left:-1.8vw; */
    margin-right: 30%;
    margin-left: -3%;
    width:11.8rem;
  }

  .filterSelect {
    @media (min-width: 480px) { flex:13% }
    margin-top:-12px;
    margin-right:10px;
    color:var(--blue-twitter);
  }

  .total {
    @media (min-width: 480px) { flex:15% }
    margin-top:15px;
    text-align:center;
    color:var(--blue-twitter);
  }

  .matterStatus {
    max-height:2rem;
  }

  .arrowOrderBy {
    svg{
      width:1.15rem;
      height:1.15rem;
      color: var(--blue-twitter);
      margin-top:10px;
      margin-left:-5px;
      margin-right: 5px;
      cursor:pointer;
    }
  }

  #options {
     display: flex;
     align-items: center;
     justify-content: center;
     border-radius: 0.25rem;
     margin-left:1rem;
     margin-right:35px;

     svg {
       color: var(--blue);
       width: 1.5rem;
       height: 1.5rem;
     }

     &:hover {
       svg {
        color: var(--orange);
       }
      }
    }
`;

export const MatterList = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 0.5rem 0.5rem;
  min-height:200px;

  .loadingMessage {
    text-align: center;
    font-size:0.75rem;
    color: var(--blue-twitter);
  }

.ReactTags__remove svg {
  fill: #000 !important;
  width: 8px;
  height: 8px;
}

`;


export const MatterItem = styled.div`
  display: flex;
  flex-direction: column;
  border-radius: 10px;
  overflow: hidden;
  margin:0.35rem;
  font-size:0.685rem;
  background-color: var(--white);
  box-shadow: 2px 2px 2px 2px rgba(0,0,0,0.4);
  border-radius: 0.25rem;
  color: var(--primary);
  font-family: Montserrat;
  position: relative;

  /* .iconMarkersInfo {
    position:absolute;
    float:right;
    right: 0;
    margin-right: 12rem;
    margin-top:1.8rem;
    width:1rem;
    height:1rem;
    cursor:pointer;
  } */

  > header {
    background-color: rgba(0,0,0,0.1);
    font-weight:600;
    padding: 0.20rem 0.20rem;

    >svg{
      color:var(--blue-twitter);
      width:0.85rem;
      height:0.85rem;
      cursor:pointer;
    }
  }

  >div {

   display:flex;

   >div{
    font-weight:600;
    span { font-weight:300; }

    .linkInfo {
      color:var(--blue-twitter);
      cursor:pointer;
    }
   }

  .matterDetails {

    flex:1;
    padding-left:0.5rem;
    margin-top:-5px;
    padding-top:1px;
    border-top:1px solid var(--blue-soft);

    .customerContact {
      background-color: var(--blue-hover-light);
      box-shadow: 1px 1px 1px 1px var(--blue-soft);
      border-radius: 0.25rem;
      min-width:20rem;
      position:absolute;
      padding:1rem;
      margin-left:13.5rem;
      margin-top:-2.5rem;
      z-index:999;

      div {
        margin-bottom:0.2rem;
        width:50%;

        svg {
          color:var(--blue-twitter);
          width:0.8rem; height: 0.8rem;
          margin-left:0.3rem;
          cursor:pointer;
        }
      }

      span:first-child{
        font-weight:600;
        margin-right:0.3rem;
      }
    }

    .andamentosList {
      margin-top:0.5rem;
      border-top: 1px solid var(--gray);
      min-height:5rem;
      font-weight:100;
      overflow:hidden;

      .title {
        font-weight:500;
        margin-right:5px;
      }

      .userName {
        opacity: 0.5;
        margin-right:5px;
        margin-left:5px;
      }

      .andamentoItem {
        margin-top:0.2rem;
        margin-bottom:0.2rem;
        font-size: 0.65rem;
        border: 1px solid var(--gray);
        background-color: var(--white-card);
        padding: 0.5rem 0rem;

        > span{
          word-wrap: break-word; 
          word-break: break-word; 
          overflow-wrap: break-word; 
          white-space: pre-line; 
          display: block; 
        }

        .followDescription {
          white-space: pre-line;
        }

        .userPhotos {
          display:flex;
          margin-top:5px;
        }

        .editItem {
          background:var(--white-card);
          padding:0.3rem;
          box-shadow: 1px 1px 1px 1px var(--blue-soft);
          border-radius: 0.25rem;
        }

        .editWarning {
          float: right;
          margin-right: 1rem;
          margin-top: -4rem;
          cursor:pointer;
          color:var(--blue-twitter);
          >svg{
            width: 1.5rem;
            height:1.5rem;
          }
          &:hover{
            color: var(--orange);
          }
        }

        .avatar {
          width: 1.5rem;
          height: 1.5rem;
          border-radius: 50%;
          border: 1px solid var(--blue-twitter);
          transition: opacity 0.5s;
          cursor:pointer;
          margin:2px;
          margin-top:-0.2rem;
        }
      }

      button {
        font-size:0.55rem;
        cursor:pointer;
        &:hover {
          color: var(--orange);
        }
      }

      .andamentoText {
        border: 1px solid rgba(0,0,0,0.2);
        border-radius: 0.20rem;
        padding:0.3rem;
        font-size:0.65rem;
        margin-top:0px;
        width:50%;
        cursor:pointer;
        white-space: pre-line;
        background-color:white;
      }

      .andamentoType {
        width: 50%;
        margin-bottom:10px;
      }

      .andamentoDate {

          width:10rem;

          button{
            float: right;
            margin-right:-3.5rem;
            margin-top:-1rem;
          }

          .buttonCancel {
            float: right;
            margin-right: -8rem;
          }
        }
      }

      textarea {
        font-size:0.675rem;
        font-weight:300;
        background-color: var(--white);
        width:30%;
        margin-top:1rem;
        min-height:5rem;
        border: 1px solid rgba(0, 0, 0, 0.5);
      }
    }
  }

  .matterEvents {

    font-size:0.65rem;
    margin-top:0.3rem;
    padding: 0.30rem 0.30rem;
    @media (min-width: 480px) { flex:19% }
    font-size:0.675rem;
    height:95px;
    position:absolute;
    float: right;
    right: 12rem;
    min-width:20rem;
    margin-top: -7px;

    /* svg{
      cursor:pointer;
      width:1rem;
      height:1rem;
      margin-left:1.8rem;
      font-weight:500;

      &:hover {
        color: var(--orange);
      }
    } */

    .waitingImport{
      text-align: center;
      font-size:0.75rem;
      color:var(--blue-twitter);
    }

    .aboutMessage {
      width:0.85rem;
    }

    .executingImport{
      text-align: center;
      color:var(--grey);
      font-size:0.65rem;
    }

    .notImport{
      text-align: center;
      color:var(--red);
      font-size:0.65rem;
    }

    >header{
      > svg {
        width: 0.85rem;
        height: 0.85rem;
        color: var(--blue);
        margin-right:5px;
      }
    }

    >div {

    color: var(--orange);
      font-weight:300;
      margin-top:5px;
      max-height:8rem;

      >div {
        cursor:pointer;
        &:hover {
          color: var(--orange);
        }
      }
    }
  }


  .matterEventsMobile {
    font-size:0.57rem;
    margin-top:0.2rem;

    >header{
      > svg {
        width: 0.85rem;
        height: 0.85rem;
        color: var(--blue);
        margin-right:5px;
      }
    }

    >div {

    color: var(--orange);
      font-weight:300;
      margin-top:5px;
      max-height:8rem;

      >div {
        cursor:pointer;
        &:hover {
          color: var(--orange);
        }
      }
    }
  }

  .matterMenu {
    margin-top:0.3rem;
    padding: 0.30rem 0.30rem;

    .menu {

      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      margin: 0.5rem 0.5rem;
      transition: all 0.5s;

      > button {
        flex: 1;
        background-color: transparent;

        &:hover {
        svg {
          color: var(--orange);
        }}
      }

      > div {

        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        border-left: 1px solid var(--blue);

        > section {
          margin-bottom: 0.5rem;
          margin-right:3px;
          display: flex;
          width:100%;
          flex-direction: column;


          > button {
              flex: 1;
              &:hover {
                svg {
                  color: var(--orange);
                }
              }
        }

      > p {
        width: 100%;
        padding-left: 1.5rem;
        text-align: left;
        justify-content: center;
        margin-top: 0.15rem;
        color: var(--blue-twitter);
        min-height:1.3rem;
        cursor: pointer;
        font-size:0.63rem;
        font-weight:300;

        &:hover {
            color: var(--orange);
          }

        svg {
          width: 0.8rem;
          height: 0.8rem;
          margin-right:5px;
          color: var(--blue);
          cursor:pointer;

          &:hover {
              color: var(--orange);
              background-color: rgba(0, 0, 0, 0.015);
            }
          }
        }

        &:hover {
            color: var(--orange);
            background-color: rgba(0, 0, 0, 0.015);
          }
        }
      }
    }
  }
}`;
