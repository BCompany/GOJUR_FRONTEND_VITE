import styled from 'styled-components';

export const Container = styled.div`
  flex: 1;
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  overflow: auto;
  font-size: 14px;
  background-color: #EDF0F7;

  .buttonLinkClick {
    border: 2px solid var(--blue-twitter);
    padding: 10px 20px;
    background-color: var(--blue-twitter);
    color: white;
    cursor: pointer;
    border-radius: 5px;
    transition: background-color 0.3s, color 0.3s;
  }

  .buttonLinkClick:hover {
    background-color: orange;
    border:  2px solid orange;
  }

  #logout {
    background: none;
    border: none;
    color: inherit;
    cursor: pointer;
    position: absolute;
    bottom: 10%;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    align-items: center;
    justify-content: center;
  }

  #message
  {
      margin-left:3rem;
      margin-right:3rem;
      padding:0.5rem;
      border-top:solid 1px;
      border-bottom:solid 1px;
      border-color: var(--gray);
      font-size:0.75rem;
      color: var(--secondary);
      justify-content: center;
      text-align:center;
      font-family:verdana;
      text-justify:justify;

      svg {
        width: 1rem;
        height:1rem;
        margin-right:5px;
        margin-top:5px;
        color: var(--blue-twitter);
      }

      span {
        color: var(--blue-twitter);
      }

      div {
        margin-top:10px;
        font-size:0.7rem;
        svg {
          width: 1rem;
          height:1rem;
          margin-top:5px;
          color: var(--blue-twitter);
        }
      }
  }
`;

export const OverlayModal = styled.div `
    background-color: rgba(0, 0, 0, 0.4);
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index:1;

    /* text inside overlay */
    >div{
      background: var(--white-card);
      height:3rem;
      color:var(--blue-twitter);
      font-size:0.765rem;
      text-align:center;
      padding:1rem;
      margin-left:30vw;
      margin-right:25vw;
      margin-top:20%;
      border-radius: 0.25rem;
      box-shadow: 1px 1px 4px 0.5px rgba(0,0,0,0.15);
    }
`;


export const Center = styled.div`
  .flex-box {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .container-box {
    background-color: #EDF0F7;
  }

  .content-box {
    text-align: center;
    width: 70%;
  }
`;

