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

    header {
        display:flex;
        justify-content: end;
        width:30rem;
        margin-top:-15px;
        float:right;
        align-items:flex-end;

        @media (min-width: 480px) {
          justify-content: end;
        }

        .buttons {
          margin-bottom:7px;
        }

        .totals {
            font-size:0.65rem;
            text-align: left;
            width:10rem;
            margin-left:1rem;
            border: 1px solid rgba(0,0,0,0.1);
            padding: 0.2rem;

            span:first-child{
                font-weight:500;
                color:green;
            }

            span:last-child{
                font-weight:500;
                color:red;
            }
        }
/*
        .buttonReceita {
          position: absolute;
          float: right;
          right: 7rem;
        }

        .buttonDespesa {
          position: absolute;
          float: right;
          right: 0.5rem;
        } */
    }

    section {
        width:100%;
        /* display:flex;             */
        @media (min-width: 480px) {
          display:flex;
        }

        flex:1;
        column-gap:1.5rem;
        justify-content: space-around;

        .comboData {
            margin-top:0px;
            flex:30%;
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
