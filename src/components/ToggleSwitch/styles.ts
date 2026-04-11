import styled from 'styled-components';

export const ToggleWrapper = styled.div<{ active: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  user-select: none;

  .track {
    position: relative;
    width: 36px;
    height: 20px;
    border-radius: 999px;
    background-color: ${props => props.active ? 'var(--blue-twitter)' : '#c8cdd6'};
    transition: background-color 0.22s ease;
    flex-shrink: 0;
    box-shadow: inset 0 1px 3px rgba(0,0,0,0.15);
  }

  .thumb {
    position: absolute;
    top: 2px;
    left: ${props => props.active ? '18px' : '2px'};
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background-color: #fff;
    box-shadow: 0 1px 4px rgba(0,0,0,0.25);
    transition: left 0.22s ease;
  }

  .label {
    font-size: 0.65rem;
    font-family: Montserrat;
    color: ${props => props.active ? 'var(--blue-twitter)' : 'var(--grey)'};
    font-weight: ${props => props.active ? '600' : '400'};
    transition: color 0.2s;
  }

  &:hover .track {
    background-color: ${props => props.active ? '#1a7bc4' : '#b0b7c3'};
  }
`;
