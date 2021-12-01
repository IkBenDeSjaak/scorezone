import format from 'date-fns/format'

export const convertDateToDayOfMonth = (date) => {
  return format(new Date(date), 'd')
}

export const convertDateToShortMonthString = (date) => {
  return format(new Date(date), 'MMM')
}

export const convertDateToYear = (date) => {
  return format(new Date(date), 'yyyy')
}

export const convertDateToShortDateString = (date) => {
  return format(new Date(date), 'EEEEEE')
}

export const convertDateToTimeString = (date) => {
  return format(new Date(date), 'HH:mm')
}
