import styled from 'styled-components';

export const Container = styled.div`
  font-size:0.765rem;
  width:100%;
  height:100%;
  box-shadow: 1px 1px 4px 0.5px rgba(0,0,0,0.15);
  background-color:var(--white);
  z-index:1000;
  position: absolute;

  header {
    text-align:center;
    font-size:0.80rem;
    font-weight:500;
    margin-top:1.5rem;
    color: var(--blue-twitter);
    margin: 0.5rem;
  }

  >footer {
    display:flex;
    justify-content:center;
    border-top:solid 1px;
    border-bottom:solid 1px;
    border-color: var(--gray);
    padding: 2rem;
  }

  .videoHelp
  {
    display:flex;
    justify-content:center;
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

export const Content = styled.div`

  padding-left:15rem;
  padding-right:15rem;
  margin-bottom:2rem;

  .buttonsAction
  {
      display:flex;
      justify-content: center;
      button{
        font-size:0.70rem;
        font-weight:450;
        margin-top:10px;
      }
  }

  .lastUpdate{
    color: var(--blue-twitter);
    font-size:0.70rem;
    display:flex;
    justify-content:center;
    svg{
      margin-right:0.2rem;
      width:0.85rem;
      height:0.85rem;
      cursor:pointer;
    }
  }

  div {

      margin-bottom:10px;

    >  label {
        font-size: 0.675rem;
        color: var(--primary);
        display: flex;
        flex-direction: column;

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
  }

`;
