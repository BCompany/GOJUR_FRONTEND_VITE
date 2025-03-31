import styled from 'styled-components'

export const Container = styled.div`
  font-size:0.765rem;
  flex-direction: column;
  font-family: Montserrat;
  min-height:35vh;
  z-index:9999;

  header {
    color: var(--blue-twitter);
    text-align: center;
    margin-bottom:1rem;

    h1 {
      font-size:0.9rem;
      font-weight:300;
      margin-bottom:0.5rem;
      border-bottom:1px solid var(--gray);
    }

    h5 {
      font-size:0.6rem;
      font-weight:300;
    }
  }

  footer {
    margin-top:1rem;
    margin-bottom:1rem;
    justify-content:center;
    text-align:center;

    >div {
      margin-top:1rem;
      color: var(--blue-twitter);
      font-size:0.765rem;
      text-align:center;
      display:flex;
      font-weight:500;
      flex-direction:column;
    }
  }


  .custom-file-upload {
    float: left;
    margin-top: 5px;
    display: inline-block;
    height: 35px;
    widthg: 35px;
    padding: 8px 18px;
    cursor: pointer;
    background-color: #007bff;
    color: white;
    border-radius: 8px;
    transition: background 0.3s;
  }

  .custom-file-upload:hover {
    background-color: #0056b3;
  }

  .custom-file-upload input[type="file"] {
    display: none;
  }


`;


export const Content = styled.div`
  display:flex;
  min-height:20vh;
  width:97%;
  margin:auto;
`;


export const Box = styled.div`
  header{
    font-size:0.65rem;
    font-weight:500;
    background-color: rgba(0,0,0,0.1);
    font-weight:400;
    color: var(--primary);
    font-family: Montserrat;
    padding:0.15rem;
  }

  flex:1;
  margin-right:0.5rem;
  max-height:30vh;
  border: 1px solid var(--blue-twitter);
  overflow:auto;

  >div{
    margin-top:-20px;
    font-size:0.65rem;
    padding:0.3rem;
    cursor:move;
  }

  .messageEmpty {
    text-align: center;
    color: var(--blue-twitter);
  }
`;


export const ItemBox = styled.div`
  margin:0.3rem;
  margin-top:5px;
  margin-bottom:10px;

  > svg {
    justify-content:center;
    text-align: center;
    margin-right:5px;
    width:0.75rem;
    height:0.75rem;
    color:var(--blue-twitter);
    cursor:pointer;

    &:hover {
      color: var(--orange);
    }
  }

  > input {
    margin-right:5px;
  }
`;


export const OverlayPermission = styled.div `
  background-color: rgba(0, 0, 0, 0.4);
  position: fixed; /* Alterado de absolute para fixed */
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 9999999; /* Diminuído o valor do z-index */
  display: flex;
  justify-content: center;
  align-items: center;

  /* text inside overlay */
  > div {
    background: var(--white-card);
    height: 3rem;
    color: var(--blue-twitter);
    font-size: 0.765rem;
    text-align: center;
    padding: 1rem;
    border-radius: 0.25rem;
    box-shadow: 1px 1px 4px 0.5px rgba(0, 0, 0, 0.15);
  }
`;
