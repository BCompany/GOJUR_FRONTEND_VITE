import React, { useState } from 'react'
import Select from 'react-select'
import {
  Container,
  Header,
  Label,
  Arrow,
  Dropdown,
  OptionLabel,
  SubjectWrapper,
} from './styles'

export interface ISelectValues {
  id: string
  label: string
}

export interface ICalendarFilterOption {
  value: string
  label: string
}

interface FilterCalendarProps {
  optionsCalendarFilter: ICalendarFilterOption[]
  multiFilter: { value: string; label: string }[]
  selectedFilterValues: string[]
  onToggleFilter: (value: string) => void
  optionsSubject: ISelectValues[]
  appointmentSubjectId: string
  appointmentSubject: string
  onSubjectChange: (item: ISelectValues | null) => void
  setIsLoading: (value: boolean) => void
  setIsLoadingSearch: (value: boolean) => void
  showSearchList: boolean
  width?: number
}

const FilterCalendar: React.FC<FilterCalendarProps> = ({
  optionsCalendarFilter,
  multiFilter,
  selectedFilterValues,
  onToggleFilter,
  optionsSubject,
  appointmentSubjectId,
  appointmentSubject,
  onSubjectChange,
  setIsLoading,
  setIsLoadingSearch,
  showSearchList,
  width = 350,
}) => {
  const [open, setOpen] = useState(false)

  const label =
    [
      ...multiFilter.map(item => item.label),
      //appointmentSubject,
    ]
      .filter(Boolean)
      .join(', ') || 'Filtragem Rápida'

  return (
    <Container width={width} className='select'>
      <Header onClick={() => setOpen(o => !o)}>
        <Label>{label}</Label>
        <Arrow open={open} />
      </Header>

      {open && (
        <Dropdown>
          {optionsCalendarFilter.map(opt => (
            <OptionLabel key={opt.value}>
              <input
                type="checkbox"
                checked={selectedFilterValues.includes(opt.value)}
                onChange={() => {
                  onToggleFilter(opt.value)
                  setIsLoadingSearch(showSearchList)
                  setIsLoading(!showSearchList)
                }}
              />
              {opt.label}
            </OptionLabel>
          ))}

          <SubjectWrapper>
            <Select
              placeholder="Digite ou selecione o assunto"
              isClearable
              isSearchable
              options={optionsSubject}
              value={
                optionsSubject.find(
                  o => o.id === appointmentSubjectId
                ) ?? null
              }
              onChange={opt =>
                onSubjectChange(opt as ISelectValues | null)
              }
              getOptionLabel={o => o.label}
              getOptionValue={o => String(o.id)}
              styles={{
                control: base => ({
                  ...base,
                  minHeight: 12,
                  fontSize: 12,
                }),
                option: base => ({
                  ...base,
                  fontSize: 12,
                }),
                menuPortal: base => ({
                  ...base,
                  zIndex: 99999,
                }),
              }}
              menuPortalTarget={document.body}
            />
          </SubjectWrapper>
        </Dropdown>
      )}
    </Container>
  )
}

export default FilterCalendar