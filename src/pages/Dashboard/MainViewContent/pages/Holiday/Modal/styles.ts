import styled from 'styled-components';

interface SearchProps {
  show:boolean
}

export const Flags = styled.div`
  font-size: 0.675rem;
  width: 50px;;
`;


export const TaskBar = styled.div `
  margin-top:4%;
  margin-bottom:2%;
  margin-left:75%;
`;


export const OverlayModal = styled.div `
    background-color: rgba(0, 0, 0, 0.4);
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index:3;

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

export const OverlayUpload = styled.div `
    background-color: rgba(0, 0, 0, 0.4);
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index:999999;

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



export const ModalHoliday = styled.div<SearchProps>`
  border: 1px solid var(--blue-twitter);
  font-size:0.665rem;
  box-shadow: 1px 1px 4px 0.5px rgba(0,0,0,0.15);
  width:60%;
  min-height:95%;
  height: 50%;
  background-color:var(--white);
  position:absolute;
  z-index:99999;
  justify-content:center;
  margin-left:15%;
  margin-top:0.5%;
  overflow: auto;
  display: ${props => (props.show ? 'block' : 'none')};

  

  #log {
     display: flex;
     align-items: center;
     justify-content: center;
     border-radius: 0.25rem;
     margin-left:1rem;
     margin-right:35px;
     

     svg {
      width: 16px;
      height: 16px;
      color: var(--blue);
      margin-right: 0.2rem;
     }

     &:hover {
      color: var(--orange);
       svg {
        color: var(--orange);
       }
      }

      > p {
      color: var(--blue);
      font-size: 0.75rem;
      font-family: montserrat;
      &:hover {
      color: var(--orange);
       svg {
        color: var(--orange);
       }

        }
        
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
            #BtSvCl{
              margin-right: 10px
            }
          }
        }
        .labelNacional {
          color: var(--blue-twitter);
        };

        .css-yk16xz-control{
      background-color: rgba(255,255,255,0.25);      

    .andamentoText {
        border: 1px solid rgba(0,0,0,0.2);
        border-radius: 0.20rem; 
        padding:0.3rem;
        font-size:0.65rem;
        margin-top:0px;
        width:98%;
        cursor:pointer;
        white-space: pre-line;
        background-color:white;
        margin-top:1%
      }

      ::-webkit-scrollbar {
    width: 0.225rem;
  }

  ::-webkit-scrollbar-thumb {
    -webkit-border-radius: 0.5rem;
    border-radius: 0.5rem;
    background: var(--orange);
    -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.125);
  }
`;

export const ModalHolidayMobile = styled.div<SearchProps>`
  border: 1px solid var(--blue-twitter);
  font-size:0.665rem;
  box-shadow: 1px 1px 4px 0.5px rgba(0,0,0,0.15);
  width:90%;
  min-height:95%;
  height: 50%;
  background-color:var(--white);
  position:absolute;
  z-index:99999;
  justify-content:center;
  margin-left:1%;
  margin-top:5%;
  overflow: auto;
  display: ${props => (props.show ? 'block' : 'none')};
  
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


export const ModalFilter = styled.div<SearchProps>`
  border: 1px solid var(--blue-twitter);
  font-size:0.665rem;
  box-shadow: 1px 1px 4px 0.5px rgba(0,0,0,0.15);
  width:22rem;
  height:10rem;
  background-color:var(--white);
  position:absolute;
  z-index:99999;
  justify-content:center;
  margin-left:35%;
  margin-top:20%;
  display: ${props => (props.show ? 'block' : 'none')};
  
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

    ::-webkit-scrollbar {
    width: 0.225rem;
  }

  ::-webkit-scrollbar-thumb {
    -webkit-border-radius: 0.5rem;
    border-radius: 0.5rem;
    background: var(--orange);
    -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.125);
  }
`;
