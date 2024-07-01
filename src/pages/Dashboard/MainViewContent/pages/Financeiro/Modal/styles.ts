import styled from 'styled-components';

interface SearchProps {
  show:boolean
}

export const Modal = styled.div<SearchProps>`
  border: 1px solid var(--blue-twitter);
  font-size:0.665rem;
  box-shadow: 1px 1px 4px 0.5px rgba(0,0,0,0.15);
  width:70%;
  height:600px;
  background-color:var(--white);
  position:fixed;
  justify-content:center;
  left:20%;
  top:2rem;

  display: ${props => (props.show ? 'block' : 'none')};
  z-index:99999;

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

  textarea {
    border: 1px solid #B3B3B3;
    width: 100%;
    min-height: 3rem;
    height: auto;
    padding: 0.5rem;
    background-color: #FFFFFF;
    color: var(--secondary);
    font-size: 0.65rem;
    border-radius: 0.25rem;
  }

  .menuTitle {
    font-size:0.65rem;
    padding: 0.25rem 0.5rem;
    color:black;
    text-align:center;
    float: left;
    width:96%;
    background-color: #dcdcdc;
    height: 27px;
  }

  .menuSection {
    font-size: 0.65rem;
    padding: 0.25rem 0.5rem;
    color:var(--blue-twitter);
    text-align:right;
    cursor:pointer;
    float: left;
    width: 4%;
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

  .log {
    float: left;
    margin-top: 115px;
    margin-left: 40px;

    svg {
      color: var(--blue);
      width: 1rem;
      height: 1rem;
    }
  }

`;


export const Container = styled.div`
 /* flex:  1;*/
  height: 100vh;
  width: 92vw;

  display: flex;
  flex-direction: column;
  padding-bottom: 1rem;
  overflow:auto;
`;

export const Content = styled.div`
    flex: 1;
    display: flex;
    flex-direction: column;
    width: 98%;
    justify-content:center;
    margin-left: 2.5%;

    section {
      display:flex;
    }

    label {

        flex:1;
        font-size: 0.675rem;
        color: var(--primary);
        margin:0.3rem;

        input {
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

      .comboData {
        margin-top:-27px;
      }

    .personList {

      display:flex;
      flex-direction: column;
      justify-content: center;
      text-align:center;
      max-height:75px;
      overflow:auto;

      >p {
        padding:0.2rem;

        >svg {
          width:0.85rem;
          height:0.85rem;
          color: var(--blue-twitter);
          margin-left:5px;
          top:5px;
          cursor:pointer;

          &:hover {
            color: var(--orange);
          }
        }
      }
    }

    .help {
        color: var(--blue-twitter);
        cursor: pointer;

        &:hover {
          color: var(--orange);
        }
      }
`;
