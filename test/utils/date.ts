const monthsMap: { [key: string]: number } = {
  JAN: 1,
  FEB: 2,
  MAR: 3,
  APR: 4,
  MAY: 5,
  JUN: 6,
  JUL: 7,
  AUG: 8,
  SEP: 9,
  OCT: 10,
  NOV: 11,
  DEC: 12,
}
const maxDaysInMonth: { [key: number]: number } = {
  1: 31,
  2: 28,
  3: 31,
  4: 30,
  5: 31,
  6: 30,
  7: 31,
  8: 31,
  9: 30,
  10: 31,
  11: 30,
  12: 31,
}

export const isValidDateFormat = (dateData: ParsedDate | string) => {
  let dateFormat =
    /(([1-9])|([0][1-9])|([1-2][0-9])|([3][0-1]))\-(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\-\d{4}/
  let dateString = ''

  if (typeof dateData === 'string') {
    dateFormat =
      /^20\d{2}-([0][1-9]|[1][0-2])-([0-2][1-9]|[3][0-1])T([01][0-9]|[2][0-3]):([0-5][0-9]):([0-5][0-9])(.\d{3})?Z?$/
    dateString = dateData
  } else {
    dateString = dateData.origin
  }

  return dateFormat.test(dateString)
}

export const isValidDateValue = (dateData: ParsedDate | string) => {
  let dateString = ''
  let dateParts = []
  let day = 0
  let month: string = '0'
  let year = 0

  if (typeof dateData === 'string') {
    dateString = dateData
    dateParts = dateString.split('T')[0].split('-')
  } else {
    dateString = dateData.origin
    dateParts = dateString.split('-')
  }

  if (typeof dateData === 'string') {
    day = parseInt(dateParts[2], 10)
    month = dateParts[1].toUpperCase()
    year = parseInt(dateParts[0], 10)
  } else {
    day = parseInt(dateParts[0], 10)
    month = dateParts[1].toUpperCase()
    year = parseInt(dateParts[2], 10)
  }

  if ((year % 4 === 0 && year % 100 !== 0) || year % 400 === 0) {
    maxDaysInMonth[2] = 29
  }

  if (
    (month.length === 3 && !monthsMap.hasOwnProperty(month)) ||
    Number(month) < 0 ||
    Number(month) > 12
  ) {
    return false
  }

  const monthIndex = month.length === 3 ? monthsMap[month] : Number(month)

  return day > 0 && day <= maxDaysInMonth[monthIndex]
}

export const isValidDate = (dateData: ParsedDate | string) => {
  return isValidDateFormat(dateData) && isValidDateValue(dateData)
}
