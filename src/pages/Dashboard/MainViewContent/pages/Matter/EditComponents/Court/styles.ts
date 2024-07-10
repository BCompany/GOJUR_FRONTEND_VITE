import styled from 'styled-components'

export const Container = styled.div`
    margin-top:10px;
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

        justify-content: start;

        @media (min-width: 480px) {
          justify-content: end;
        }

        margin-bottom:0.5rem;
        margin-top:-15px;
        margin-bottom:10px;
    }

    .comboData {
        margin:0;
    }

      /* instancia atual - checkbox */
    .instance {

      width:7rem;
      text-align:center;

      label {

        flex:1;
        font-size: 0.675rem;
        color: var(--primary);
        margin:1px;

        input {
          flex: 1;
            font-size: 0.675rem;
            margin-left:10px;
            background-color: rgba(255,255,255,0.25);
            border-bottom: 1px solid rgba(0,0,0,0.15);
            color: var(--secondary);
        }
      }
    }

    section {
        width:100%;
        // display:flex;
        @media (min-width: 480px) {
          display:flex;
        }
        flex:1;
        column-gap:1.5rem;
        justify-content: space-around;

        >  label {

            flex:1;
            font-size: 0.675rem;
            color: var(--primary);
            margin:0.3rem;

            input {
                flex: 1;
                font-size: 0.675rem;
                padding: 0.25rem;
                background-color: #FFFFFF;
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

