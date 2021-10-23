export const toGMTDate = (gmtDateInSeconds: number): Date => {
  return new Date(gmtDateInSeconds + 3600000 * 5.5)
}

export const toISTDate = (istDateInSeconds: number): Date => {
  return new Date(istDateInSeconds - 3600000 * 5.5)
}

const addZero = (number: number) => {
  return number < 10 ? "0" + number : number
}

export const getTime = (date: Date) => {
  date = new Date(date)
  const hours = date.getHours()
  const minutes = date.getMinutes()
  if (hours > 12) return `${addZero(hours - 12)}:${addZero(minutes)} PM`
  return `${addZero(hours)}:${addZero(minutes)} AM`
}

export const getDate = (date: Date) => {
  return new Date(date).toDateString().substring(4)
}

export const getDateFromTimeStamp = (date: number) =>
  new Date(date).toDateString().substring(4)
