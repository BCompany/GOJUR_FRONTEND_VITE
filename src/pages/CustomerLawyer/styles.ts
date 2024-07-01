import styled from 'styled-components'


export const Container = styled.div`
  flex: 1;
  height: 100vh;
  background-color:var(--gray);
  @media (min-width: 480px) {
    padding: 2rem 5rem; // browser
  }
`;


export const Content = styled.div`
    flex: 1;
    display: flex;
    height: 100vh;
    flex-direction: column;
    background-color: var(--white);
    border-radius: 0.15rem;
    box-shadow: 1px 1px 5px 5px rgba(0,0,0,0.15);
    overflow: auto;

    .messageEmpty {
      display:flex;
      color:var(--blue-twitter);
      font-size:0.85rem;
      font-weight:500;
      flex-direction:column;
      align-items: center;

      svg {
        height:1.5rem;
        width:1.5rem;
      }

    }

    .header {
      display:flex;
      flex-direction:column;
      font-size:0.65rem;
      color:var(--blue-twitter);
      margin-top:10px;
      text-align:end;
      font-weight:500;
      align-items: end;
      margin-right:10px;  
      margin-bottom:-30px;   
    }

    #fc-dom-1 {
      font-weight:600;
      font-size:0.8rem;
      margin-top:10px;
      font-family: Montserrat;
      text-transform: capitalize;
   }

    #fc-dom-2 {
      font-weight:600;
      font-size:0.8rem;
      margin-top:10px;
      font-family: Montserrat;
      text-transform: capitalize;
    }

    .fc-col-header-cell-cushion {
      text-transform: capitalize;
      font-weight:500;
    }

    .fc-toolbar-chunk {
      font-size:0.65rem;
      margin:0.2rem;
    }

  .fc-toolbar-title{
    font-weight:400;
    font-size:0.865rem;
    font-family:montserrat;
  }

  .fc{
    font-size:0.675rem;
    font-weight:200;
  }
`;


export const MatterCard = styled.div`
    flex: 1;
    margin-top:1rem;
    display: flex;
    font-size:0.675rem;
    flex-direction: column;
    background-color: transparent;
    box-shadow: 2px 2px 2px 2px rgba(0,0,0,0.1);
    margin:1rem;
    border-radius: 0.25rem;
    overflow:auto;

    header {
      width: 100%;
      padding: 0.25rem 1rem;
      background-color: var(--gray);

      >span{
          font-weight:600;
          margin-right:5px;
        }

      svg {
        width: 1rem;
        height: 1rem;
        margin-right: 0.5rem;
        color: var(--blue-twitter);
      }
    }

    div {
      display:flex;
      width: 100%;
      padding: 0.5rem 1rem;
      border-bottom: 1px solid var(--gray);

      > section{
        flex:1;
        flex-direction: row;

        >span{
          font-weight:600;
          margin-right:5px;
        }
      }

    }

    .followList {

      header{
        background-color:transparent;
        margin-left:-20px;
        margin-bottom:10px;
      }

      section {
        margin-bottom:10px;
      }

      button {
        color:var(--blue-twitter);
        margin-left:5px;
        &:hover{
          color: var(--orange);
        }
      }

      footer {
        font-size:0.6rem;
        color: var(--blue-twitter);
        margin:0.5rem 0;
        &:hover {
          color: var(--orange)
        }
      }

      display:flex;
      flex-direction:column;
    }
`;


export const DropArea = styled.div`
    flex: 1;
    margin-top:1rem;
    display: flex;
    background-color: transparent;
    box-shadow: 2px 2px 2px 2px rgba(0,0,0,0.1);
    margin:1rem;
    border-radius: 0.25rem;
    overflow:auto;
    flex-direction: column;
`;


export const Divisor = styled.div`

    background-color:var(--gray);
    height:5px;
    margin:1rem;
    opacity:0.5;


`;


export const ModalDateSelect = styled.div`
  border: 1px solid var(--blue-twitter);
  font-size: 0.7rem;
  box-shadow: 1px 1px 4px 0.5px rgba(0,0,0,0.15);
  width: 400px;
  min-height: 10rem;
  max-height: 12rem;
  overflow: auto;
  background-color: var(--white);
  position: absolute;
  z-index: 99999;
  justify-content: center;
  margin-left: 35%;
  margin-top: 2%;

  > svg {
    width:1rem;
    height:2rem;
    color: white;
  }

  input, select {
    flex: 1;
    font-size: 0.675rem;
    padding: 0.25rem;
    background-color: #FFFFFF;
    width: 99%;
    border-bottom: 1px solid rgba(0,0,0,0.15);
    color: var(--secondary);

    &:focus {
    border-bottom: 1px solid var(--orange);
    }
  }

  .menuTitle {
    font-size: 0.65rem;
    padding: 0.25rem 0.5rem;
    color: black;
    text-align: center;
    float: left;
    width: 93%;
    background-color: #dcdcdc;
    height: 27px;
  }

  .menuSection {
    font-size: 0.65rem;
    padding: 0.25rem 0.5rem;
    color: var(--blue-twitter);
    text-align: right;
    cursor: pointer;
    float: left;
    width: 6.9%;
    background-color: #dcdcdc;
    height: 27px;

    > svg {
      width: 0.85rem;
      height: 0.85rem;
      stroke-width: 3px;
    }

    &:hover {
      color: var(--orange);
    }
  }
`;
