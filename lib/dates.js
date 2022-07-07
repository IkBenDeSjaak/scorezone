import format from 'date-fns/format'

// Ex: 19
export const convertDateToDayOfMonth = (date) => {
  return format(new Date(date), 'd')
}

// Ex: Feb
export const convertDateToShortMonthString = (date) => {
  return format(new Date(date), 'MMM')
}

// Ex: 2017
export const convertDateToYear = (date) => {
  return format(new Date(date), 'yyyy')
}

// Ex: Su
export const convertDateToShortDateString = (date) => {
  return format(new Date(date), 'EEEEEE')
}

// Ex: 13:10
export const convertDateToTimeString = (date) => {
  return format(new Date(date), 'HH:mm')
}

// Ex: 2-12-2021
export const convertDateTimeToDate = (date) => {
  return format(new Date(date), 'd-M-yyyy')
}

export const convertDateTimeToAmericanDate = (date) => {
  return format(new Date(date), 'yyyy-MM-dd')
}

export const convertDateTimeToFormInputCompatible = (date) => {
  return format(new Date(date), 'yyyy-MM-dd HH:mm')
}

export const convertDateTimeToLocalDateTime = (date) => {
  return format(new Date(date), 'dd-MM-yyyy HH:mm')
}

export const calculateFromDate = (inputDate) => {
  const date = new Date(inputDate)
  const fromDate = new Date(date)

  if (date.getDay() >= 2) {
    fromDate.setDate(fromDate.getDate() - (fromDate.getDay() - 2))
  } else {
    fromDate.setDate(fromDate.getDate() - (7 - fromDate.getDay()))
  }

  return fromDate
}

export const calculateTillDate = (fromDate) => {
  const tillDate = new Date(fromDate)
  tillDate.setDate(tillDate.getDate() + 6)
  return tillDate
}
