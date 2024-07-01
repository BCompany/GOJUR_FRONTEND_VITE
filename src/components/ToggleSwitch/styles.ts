import styled from 'styled-components';

export const ToggleSwitcWrapper = styled.div`
    background-color: white;
    width: 158px;
    height: 38px;
    user-select: none;
    position: relative;
    border-radius: 4px;
    padding: 2px;
    cursor: pointer;

    .toggle-btn{
        display: flex;
        justify-content: center;
        align-items: center;
        box-sizing: border-box;
        width: 55px;
        font-size: 14px;
        line-height: 16px;
        cursor: pointer;
        color: #fff;
        background-color: blue;
        box-shadow: 0 2px 4px black;
        padding: 8px 12px;
        border-radius: 3px;
        position: absolute;
        transition: all 0.2s ease;
        left: 100px;
    }

    .change{
        background-color: blue;
        left: 2px;     
    }
`;