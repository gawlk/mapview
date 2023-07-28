import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'

dayjs.extend(utc)

type ParamType = Parameters<typeof dayjs>

export const dayjsUtc = (date: ParamType[0]) => dayjs(date).utc()
