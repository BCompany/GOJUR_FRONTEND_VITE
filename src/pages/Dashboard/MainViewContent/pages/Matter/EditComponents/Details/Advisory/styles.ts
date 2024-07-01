import styled from 'styled-components'

export const Container = styled.div`
    margin-top:10px;
    min-height: 35rem;
    margin-right:0.7rem;

    .waiting {
        text-align: center;
        color: var(--blue-twitter);
    }

    .markers {
        margin-top: -20px;
        margin-left: -15px;
        border-bottom: solid 1px var(--gray);
    }

    .content {

        margin-top:10px;

        section {

            width:100%;
            flex:1;
            column-gap:1.5rem;

            .infoMessage {
                width:0.85rem;
                height:0.85rem;
                margin-top:0.7rem;
            }
            
            @media (min-width: 480px) {
              display:flex;
            }

            justify-content: space-around;

            >  label {

                flex:1;
                font-size: 0.675rem;
                color: var(--primary);
                margin:0.3rem;

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

                .inputField {

                    font-size: 0.675rem;
                    background-color: rgba(255,255,255,0.25);
                    width: 100%;
                    height:40px;
                    border-bottom: 1px solid rgba(0,0,0,0.15);
                    color: var(--secondary);

                    &:focus {
                        border-bottom: 1px solid var(--orange);
                    }
                }


                &:focus-within {
                    color: var(--orange);

                    &.required{
                        color: var(--red);
                    }
                }
            }

            .css-yk16xz-control{
                background-color: rgba(255,255,255,0.25);
            }
        }

        .valores {
            margin-top:20px;
            display: grid;
            font-size:0.675rem;

            header {
                overflow: hidden;
                text-align: center;
                font-size:0.8rem;
                font-weight:500;
                margin-bottom:5px;
            }

            header:before,
            header:after {
                background-color: rgba(0,0,0,0.15);
                content: "";
                display: inline-block;
                height: 1px;
                position: relative;
                vertical-align: middle;
                width: 50%;
            }

            header:before {
                right: 0.5em;
                margin-left: -50%;
            }

            header:after {
                left: 0.5em;
                margin-right: -50%;
            }

            div {
                display:flex;
                flex-direction:row;
                justify-content: space-between;
                margin-top:10px;

                label {
                    flex: 1;
                    font-size: 0.675rem;
                    font-weight:400;
                }

                svg {

                    width:0.7rem;
                    height: 0.7rem;
                    margin-top:10px;
                    margin-right: 10px;
                    color: var(--blue-twitter);
                    cursor:pointer;

                    &:hover{
                        color: var(--orange);
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
                    margin-right:1rem;
                    &:focus {
                        border-bottom: 1px solid var(--orange);
                    }
                }
            }
        }


        .buttonAddNewValue {
            text-align: center;
        }

        .objectResume {

            margin-top:1rem;
            padding-top: 10px;
            display:flex;
            flex-direction: column;
            margin-bottom:10px;
            header {
                overflow: hidden;
                text-align: center;
                font-size:0.7rem;
                font-weight:500;
                margin-bottom:5px;
            }

            header:before,
            header:after {
                background-color: rgba(0,0,0,0.15);
                content: "";
                display: inline-block;
                height: 1px;
                position: relative;
                vertical-align: middle;
                width: 50%;
            }

            header:before {
                right: 0.5em;
                margin-left: -50%;
            }

            header:after {
                left: 0.5em;
                margin-right: -50%;
            }

            textarea {

                margin-top:10px;
                border: 1px solid rgba(0,0,0, 0.15);
                width: 100%;
                background-color: rgba(255,255,255,0.25);
                min-height: 4rem;
                height: auto;
                padding: 0.5rem;
                background-color: var(--white);
                color: var(--secondary);
                font-size: 0.75rem;
                border-radius: 0.25rem;
            }
        }
/*
        .selectGroup{

            height: 25px;
            margin-top: -4px;
            margin-left: 0px;
        } */
    }

    footer {
        display:flex;
        justify-content: end;
        margin-top:1rem;
        margin-bottom:0.5rem;
    }

`;
