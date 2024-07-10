import styled from 'styled-components'

export const Container = styled.div`
    margin-top:10px;
    min-height: 15rem;
    margin-right:0.7rem;
    padding: 1rem 1rem;
    position:relative;

    .waiting {
      text-align: center;
      color: var(--blue-twitter);
    }

    footer {
        display:flex;
        justify-content: start;

        @media (min-width: 480px) {
          justify-content: end;
        }

        margin-bottom:0.5rem;
        margin-top:10px;
        margin-bottom:10px;
    }

    section {
        width:100%;
        flex:1;
        column-gap:1.5rem;
        justify-content: space-around;
        @media (min-width: 480px) {
          display:flex;
        }

        .linkButtons {
          display:flex;
          align-items:center;
          gap:0.3rem;
          cursor:pointer;
          svg {
            color: var(--blue-twitter);
            width:0.9rem;
            height:0.9rem;
            &:hover {
                color: var(--orange);
            }
          }
        }

        .comboData {
          margin-top:0px;
          flex:25%;
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
                background-color: #FFFFFF;
                border: 1px solid rgba(0, 0, 0, 0.5);
                width: 100%;
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
                margin-right: -25px;
                margin-top: -30px;

                &:hover {
                    color: var(--orange);
                }
            }
        }
    }
`;
