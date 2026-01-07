import styled from 'styled-components'

export const Container = styled.div<{ width: number }>`
  width: ${({ width }) => width}px;
  position: relative;
  font-family: Arial, sans-serif;
`

export const Header = styled.div`
  border: 1px solid #4a90e2;
  border-radius: 6px;
  padding: 10px 12px;
  cursor: pointer;
  background: #fff;
  display: flex;
  justify-content: space-between;
  align-items: center;
  min-width: 200px;
`

export const Label = styled.span`
  text-align: center;
  flex: 1;
`

export const Arrow = styled.span<{ open: boolean }>`
  width: 8px;
  height: 8px;
  margin-left: 8px;
  border-right: 2px solid #bdbdbd;
  border-bottom: 2px solid #bdbdbd;
  transform: rotate(${({ open }) => (open ? '-135deg' : '45deg')});
  transition: transform 0.2s ease;
`

export const Dropdown = styled.div`
  position: absolute;
  top: 110%;
  left: 0;
  width: 100%;
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 6px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
  z-index: 1000;
`

export const OptionLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 12px;
  cursor: pointer;
`

export const SubjectWrapper = styled.div`
  padding: 12px;
  border-top: 1px solid #eee;
`