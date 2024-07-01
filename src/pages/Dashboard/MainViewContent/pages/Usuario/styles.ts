import styled from 'styled-components';


interface SearchProps {
  show:boolean
}


export const Container = styled.div`
  flex: 1;
  height: 100vh;
  width: 95vw;
  display: flex;
  flex-direction: column;
  overflow: auto;
`;


export const Content = styled.div`
  flex: 1;
  padding: 0.5rem 2rem;
  margin: 0.5rem 1rem;
  background-color: rgba(255,255,255, 0.3);
  border-radius: 0.25rem;
  box-shadow: 1px 1px 4px 0.5px rgba(0,0,0,0.15);
  overflow: auto;
`;


export const AvatarChange = styled.label`
  display: flex;
  align-items: center;
  font-size: 0.875rem;
  cursor: pointer;
  color: var(--secondary);
  svg {
    width: 2rem;
    height: 2rem;
    margin-right: 0.5rem;
    color: var(--blue-light);
    transition: color 0.3s;
  }
  input {
    display: none;
  }

  &:hover {
    opacity: 0.8;
    svg {
      color: var(--orange);
    }
  }
`;


export const AccountHelper = styled.label`
  display: flex;
  align-items: center;
  font-size: 0.875rem;
  cursor: pointer;
  color: var(--secondary);
  
  svg {
    width: 2rem;
    height: 2rem;
    margin-right: 0.5rem;
    color: var(--blue-light);
    transition: color 0.3s;
  }
  input {
    display: none;
  }
  button {
    font-size: 0.875rem;
    color: var(--secondary);
  }

  &:hover {
    opacity: 0.8;
    svg {
      color: var(--orange);
    }
  }
`;


export const ModalPassword = styled.div<SearchProps>`
  border: 1px solid var(--blue-twitter);
  font-size: 0.665rem;
  box-shadow: 1px 1px 4px 0.5px rgba(0,0,0,0.15);
  width: 20rem;
  height: 11rem;
  background-color: var(--white);
  position: absolute;
  z-index: 9999;
  justify-content: center;
  margin-top: 10%;
  margin-left: 33%;
  display: ${props => (props.show ? 'block' : 'none')};
  
  input, select {
      flex: 1;
      font-size: 0.675rem;
      padding: 0.25rem;
      background-color: rgba(255,255,255,0.25);
      width: 99%;
      border-bottom: 1px solid rgba(0,0,0,0.15);
      color: var(--secondary);
      -webkit-text-security: disc;
      text-security: disc;

      &:focus {
        border-bottom: 1px solid var(--orange);
      }
    }
`;


export const CropContainer = styled.div`
  width: 800px;
  height: 400px;
  display: flex;
  flex-direction: column;
  align-items: center;
  border: 1px solid #000;
  position: relative;
`;


export const ImgControls = styled.div`
  width: 800px;
  height: 120px;
  padding: 0.5rem 1rem;
  display: flex;
  flex-direction: column;
  border-radius: 0.5rem;
  margin-top: 1rem;
  background-color: var(--white-card);
  box-shadow: 1px 1px 1px 1px rgba(0, 0, 0, 0.2);
  /* align-items: center; */
  label {
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-family: Montserrat;
    font-size: 1rem;
    color: var(--secondary);

    & + label {
      margin-top: 0.5rem;
    }

    input {
      width: 650px;
      margin: 0 0.5rem;
    }
  }

  button {
    flex: 1;
    margin-top: 0.5rem;
    margin-left: 0.5rem;
    padding: 0.25rem;
    border-radius: 0.25rem;
    background-color: var(--blue-twitter);
    color: var(--white);
    font-weight: 600;
    font-size: 0.75rem;
    font-family: Poppins;
    transition: filter 0.2s;

    &:hover {
      filter: brightness(90%);
    }
  }


  .button-controls {
    display: flex;
    align-items: center;
    justify-content: center;


    > label {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: space-evenly;
      margin-top: 0.5rem;
      margin-left: 0.5rem;
      padding: 0.25rem;
      border-radius: 0.25rem;
      background-color: var(--blue-twitter);
      color: var(--white);
      font-weight: 600;
      font-size: 0.75rem;
      font-family: Poppins;
      transition: filter 0.2s;

    &:hover {
      filter: brightness(90%);
    }
      >input {
        display: none;
      }
    }
    
  }
`;


export const ItemCard = styled.div`
    flex: 1;
    min-height: 170px;
    min-width: 40%;
    max-width: 25rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    background-color: var(--white-card);
    box-shadow: 2px 2px 2px 2px rgba(0,0,0,0.4);
    border-radius: 0.25rem;
    float: left;
    margin-left: 5%;
    margin-right: 5%;
    margin-top: 40px;

    header {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: rgba(0,0,0,0.1);
      padding: 0.25rem 1rem;
      font-size: 16px;

      > span {
        position: relative;
        margin-right:30%;
      }

      button {
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 0.15rem;

        &+ button {
          margin-left: 0.5rem;
        }

        &:hover{
          svg {
            color: var(--orange);
          }
        } 

        svg {
          width: 1rem;
          height: 1rem;
          color: var(--blue-twitter);
        }
      }
    }

    div {
      flex: 1;
      width: 100%;
      display: flex;
      flex-direction: column;
      padding: 0.5rem 1rem;
      align-items: center;

      section {
        display: flex;
        justify-content: space-between;
        #whats{
            display: flex;
            flex-direction: row;

            button {
              display: flex;
              align-items: center;
              justify-content: center;
              margin-left: 0.5rem;

              &:hover{
                box-shadow: 1px 1px 1px 1px rgba(0,0,0,0.1);
              }  
              svg {
                color: var(--green);
                width: 1rem;
                height: 1rem;
              }
            }
          }

        &+section {
          margin-top: 0.5rem;
        }

        article {
          flex: 1;
          display: flex;
          flex-direction: column;

          p {
            font-size: 0.750rem;
            font-weight: 400;
            color: var(--secondary);
          }

          b {
            font-family: Montserrat;
            font-size: 0.750rem;
            font-weight: 600;
            color: var(--primary);
            margin-right: 0.5rem;

            // id customer left side from name person
            > span{
              color:var(--grey);
              font-size:0.65rem;
              font-weight: 300;
            }
          }

          #mail{
            color: var(--blue-light);
          }
        }
      }

      > article {
        display: flex;
        align-items: center;
        margin-top: 0.5rem;
        
        p {
          font-size: 0.75rem;
          font-weight: 400;
          color: var(--secondary);
        }

        b {
          margin-right: 0.5rem;
          font-family: Montserrat;
          font-size: 0.875rem;
          font-weight: 600;
          color: var(--primary);
        }
      }

      > div {
        margin-top: 1rem;
        display: grid;
        grid-template-columns: 1fr 1fr 1fr;
        grid-gap: 0.25rem 0.5rem;
        padding: 0;

        > p {
          font-size: 0.65rem;
          display: flex;
          flex-direction: column;

          strong {
            font-size: .75rem;
          }
        }
      } 
    }
`;


export const OverlayPassword = styled.div `
    background-color: rgba(0, 0, 0, 0.4);
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index:1;

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
