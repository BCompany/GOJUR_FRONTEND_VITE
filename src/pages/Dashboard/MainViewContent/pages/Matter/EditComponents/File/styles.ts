import styled from 'styled-components'

export const Container = styled.div`
    min-height: 15rem;
    margin-right:0.7rem;
    margin-bottom:2rem;
    padding: 1rem 1rem;
    position:relative;

    .waiting {
      text-align: center;
      color: var(--blue-twitter);
    }

    footer {
        display:flex;
        justify-content: end;
        margin-bottom:0.5rem;
        margin-top:10px;
        margin-bottom:10px;
    }

    section {
        width:100%;
        display:flex;
        flex:1;
        column-gap:1.5rem;
        justify-content: space-around;

        .dragContainer {
          height: 100px;
          width: 100%;
          background-color: white;
          border-radius: 5px;
          border: 1px solid #4297d7;
          opacity: 0.8;
          margin-top:-2rem;
          display:flex;

          > span {
           width:100%;
           font-size:0.675rem;
           text-align:center;
           margin-top:35px;
          }
        }

        .messageSizeFile {
          font-family: montserrat, verdana;
          margin:1.5rem 4rem;
          text-align: center;
          font-size:0.675rem;
          color: var(--seconday);

        }

        .comboData {
          margin-top:0px;
          flex:45%;
        }

        >  label {

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

            textarea {
                background-color: var(--white);
                border: 1px solid rgba(0, 0, 0, 0.5);
                width: 50%;
                @media (min-width: 480px) {
                    width: 100%;
                }
            }

            > svg {
                width:1rem;
                height:1rem;
                color:var(--blue-twitter);
                cursor:pointer;
                float: right;
                margin-right: -2px;
                margin-top: -30px;

                &:hover {
                    color: var(--orange);
                }
            }
        }
    }
`;

export const DropArea = styled.div`

  display: flex;
  position:relative;
  justify-content: center;
  justify-items:center;
  width: 95%;
  margin:1%;
  height:6rem;
  border-radius:0.25px;
  border:0.5px solid rgba(255, 0, 0, 0.2);
  font-size:0.765rem;
  color:gray;
  padding-top:3rem;
  background-color:var(--gray);

  svg {
    position:absolute;
    width: 1.3rem;
    height: 1.3rem;
    margin-top:-1.4rem;
    margin-bottom:1rem;
  }
`;

export const LoaderContainer = styled.div`
  display:flex;
  justify-content:center;
  width:100%;
`;

export const TaskBar = styled.div `
  position: relative;
  float:right;
  margin-top:10px;
  margin-bottom:40px;
  margin-right:2.5vw;
`;

export const TotalRegisters = styled.div`
  /* margin-left:9.5rem; */
  margin-left:1rem;
  margin-top:-0.5rem;
  font-size:0.675rem;
  color:var(--secondary);
  font-family:montserrat;
`;
