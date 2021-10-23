export const FREQUENCY_LIST = [
  { value: "HOUR", frequency: 60 * 60 },
  { value: "DAY", frequency: 24 * 60 * 60 }
]

export const getFrequency = (frequencyInSeconds: number): string => {
  //hours
  var inHours = frequencyInSeconds / FREQUENCY_LIST[0].frequency
  if (inHours < 24) return inHours + " " + FREQUENCY_LIST[0].value
  //days
  var inDays = frequencyInSeconds / FREQUENCY_LIST[1].frequency
  return inDays + " " + FREQUENCY_LIST[1].value
}
