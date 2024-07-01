import styled from 'styled-components'

export const Container = styled.div`
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
            border: 1px solid rgba(0,0,0,0.5);
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
`;

export const Content = styled.div`
    display:flex;
    flex-wrap: wrap;

    >div {
        >header {
            display:flex;
            justify-content:space-between;
            font-weight:500;
            background-color: var(--gray);

            svg {
                cursor:pointer;
            }
        }
        justify-content:center;
        box-shadow: 2px 2px 2px 2px rgba(0, 0, 0, 0.2);
        border-radius: 0.25rem;
        margin:0.5em;
        min-width:24%;
        max-width:24%;
        margin:0.3rem;
        padding:0.2rem;
        flex:1;
    }
`;
