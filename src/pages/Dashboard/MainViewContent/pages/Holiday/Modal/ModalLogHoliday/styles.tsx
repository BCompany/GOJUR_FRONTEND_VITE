import styled from 'styled-components'

export const Container = styled.div`

    flex-direction: column;
    font-family: Montserrat;
    min-height:40vh;
    
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
            font-size:0.65rem;
            text-align:center;
            display:flex;
            font-weight:500;
            flex-direction:column;
        }
    }

    > div {

        max-height:20rem;
        overflow:auto;
        text-align:center;

        >div {

            font-size:0.65rem;
            margin:0.3rem;
            border-bottom:1px solid var(--grey);
            padding:0.3rem;

            span {
                font-weight:600;            
            }

            svg {
                width:1rem;
                height:1rem;
                cursor:pointer;
                margin-left:5px;
                margin-top:5px;
                &:hover {
                    color: var(--orange);
                }
            }
        }

        input {
            border:1px solid var(--gray);
            background-color: rgba(255,255,255,0.25);
            border-bottom: 1px solid rgba(0,0,0,0.15);
            color: var(--secondary); 
            margin-right:0.3rem;
            padding:0.2rem;
            font-size:0.75rem;
            width:80%;
        }        
    }
`;

export const ContainerDetails = styled.div `
    
    position:absolute;
    font-family: montserrat, verdana;
    min-width:51vw;
    top:0.7rem;
    width:10rem;    
    display:flex;
    flex-direction: column;
    background-color: var(--white);
    box-shadow: 2px 2px 2px 2px rgba(0,0,0,0.4);
    border-radius: 0.25rem;  

    >div {
        max-height:30vh;
        overflow:auto;

        p {
            color: var(--secondary);
            font-weight:400;
            margin-bottom:5px;
            border-bottom: 0.1rem solid var(--gray);
        }
    }
    
`;