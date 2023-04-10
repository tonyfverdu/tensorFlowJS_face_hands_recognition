function randomNumber(minPar, maxPar) {
  let resultRandomNumber = 0

  if ((typeof minPar === "number" && Number.isInteger(minPar)) && (typeof maxPar === "number" && Number.isInteger(maxPar))) {
    resultRandomNumber = Math.floor(Math.random() * (maxPar - minPar) + minPar)
  } else {
    console.error('Error:  The arguments of the function "randomNumber" muss be an integer number !!')
    resultRandomNumber = null
  }
  return resultRandomNumber
}

export default randomNumber