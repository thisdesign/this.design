export const asText = (field) => {
  const newString = field.map((item) => item.text).join('')
  console.log(newString)
  return newString
}
