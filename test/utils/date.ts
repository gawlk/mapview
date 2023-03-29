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

export const isValidDate = (dateData: ParsedDate) => {
  const dateString = dateData.origin
  const dateFormat =
    /(([1-9])|([0][1-9])|([1-2][0-9])|([3][0-1]))\-(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\-\d{4}/

  // Vérifier si la date respecte le format "dd-mmm-YYYY"
  if (!dateFormat.test(dateString)) {
    return false
  }

  // Vérifier si la date est valide
  const dateParts = dateString.split('-')
  const day = parseInt(dateParts[0], 10)
  const month = dateParts[1].toUpperCase()
  const year = parseInt(dateParts[2], 10)

  // Vérifier si l'année est bissextile
  if ((year % 4 === 0 && year % 100 !== 0) || year % 400 === 0) {
    maxDaysInMonth[2] = 29
  }

  // Vérifier si le mois est valide
  if (!monthsMap.hasOwnProperty(month)) {
    return false
  }
  const monthNumber = monthsMap[month]

  // Vérifier si le jour est valide
  if (day < 1 || day > maxDaysInMonth[monthNumber]) {
    return false
  }

  return true
}
