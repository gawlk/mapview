import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'

dayjs.extend(utc)

type paramType = Parameters<typeof dayjs>

export const dayjsUtc = (date: paramType[0]) => {
  return dayjs(date).utc()
}
