import styled from 'styled-components';

interface SearchProps {
  show:boolean
}

export const ItemList = styled.div`

      display:flex;
      flex-direction:column;
      
      >span {
        display:flex;
        margin:0.2rem 0.5rem;
      }

      p{
        margin-left:0.75rem;
      }
`;

export const OverlayModal = styled.div `
    background-color: rgba(0, 0, 0, 0.4);
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index:99999999;

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

export const OverlayModal2 = styled.div `
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

export const ModalCustomerInformation = styled.div<SearchProps>`
  width: 36rem;
  height: 430px;
  max-height: 25rem;
  background-color: #fff;
  z-index:9999;
  box-shadow: 2px 2px 2px 2px rgba(0, 0, 0, 0.3);
  border-radius: 12px;
  background-color:var(--white);
  display: flex;
  flex-direction: column;
  font-size:0.675rem;
  top:13%;
  left:28%;
  position: absolute;
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
    height: 75%;
  }

  .footer {
    float:right;
    border-top: 1px solid black;
    width:100%;
  }

  .border{
    border-bottom: 1px solid black;
    margin-top: 5px;
  }

  .infoMessages {
    width: 1rem;
    height: 1rem;
    margin-top: 20px;
    margin-bottom: auto;
    margin-left: 0.5%;
    color: var(--blue-twitter);
  }



  input, select {
      flex: 1;
      font-size: 0.675rem;
      padding: 0.25rem;
      background-color: rgba(255,255,255,0.25);
      width: 99%;
      border-bottom: 1px solid rgba(0,0,0,0.15);
      color: var(--secondary);

      &:focus {
        border-bottom: 1px solid var(--orange);
      }
    }
`;
