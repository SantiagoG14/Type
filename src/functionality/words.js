export function getWordsArray(strText) {
  return strText.split(" ")
}

export function getLettersArray(strWord) {
  return strWord.split("").map((l) => {
    return {
      letter: l,
      pressed: false,
      feedback: false,
    }
  })
}

export function getWordFromArray(wordArr) {
  let word = ""
  wordArr.forEach((letterObj) => (word += letterObj.letter))
  return word
}
