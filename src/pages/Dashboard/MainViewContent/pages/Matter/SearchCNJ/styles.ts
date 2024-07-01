import styled from 'styled-components'

export const Container = styled.div`

    font-size:0.765rem;    
    flex-direction: column;
    font-family: Montserrat;
    min-height:30vh;

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

    .buttonAddNew {
        font-size:0.65rem;
        margin-top:0.1rem;
        cursor:pointer;    
        margin-left:43%;    
        margin-bottom:0.5rem;
    }

    .passWord {
        display:flex;
        width:31rem;
        margin-top:0.5rem;
        margin-bottom:0.5rem;
    }

    .messageEmpty{
        font-size:0.65rem;
        color:var(--red);
        text-align:center;
        margin-left:100px;
    }

    > div {

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
        
        .secret { 

            position: absolute;
            color:var(--blue-twitter);
            display: inline;
            font-size: 0.65rem;
            width:20%;
            text-align:center;
            justify-content: center;
            margin-top: -40px;
            right: 0;
            margin-right: 57px;

            input {
                position: absolute;
                float: left;
                left: -30px;
                margin-top: 18px;
            }

            span {
                margin-top: 16px;
                position: absolute;
                margin-left: -35px;
                cursor:pointer;
            }

            svg{
                width:0.9rem;
                height:0.9rem;
                float: right;
                margin-top: 16px;
                margin-right: -15px;
                cursor:pointer;
            }
        }
    }

    .listItem {
        display:flex;
        flex-direction:column;
        justify-content: center;
        text-align:center;
        font-size:0.75rem;
        margin-bottom:0.5rem;
        color:var(--blue-twitter);
        max-height:15rem;
        overflow:auto;

        svg{
            width: 0.75rem;
            height: 0.75rem;
            margin-right:5px;
            cursor:pointer;
            
            &:hover {
                color:var(--orange);
            }
        }

        .password {
            font-size:0.65rem;
            font-weight:600;
        }
    }

`;