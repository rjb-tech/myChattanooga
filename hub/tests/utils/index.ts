import { addHours } from 'date-fns'

export const getUtcTime = (): Date => {
  return addHours(new Date(), new Date().getTimezoneOffset() / 60)
}
