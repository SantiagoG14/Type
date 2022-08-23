import { useState, useEffect, useRef } from "react"

export default function TypeText({ text }) {
  const [currentWordPosition, setCurrentWordPosition] = useState(-1)
  const [currentLetterPosition, setCurrentLetterPosition] = useState(-1)
  const [typeText, setTypeText] = useState(
    getWordsArray(text).map((word) => getLettersArray(word))
  )
  const textRef = useRef()

  useEffect(() => {
    window.addEventListener("keydown", handleKeydown)

    return () => {
      window.removeEventListener("keydown", handleKeydown)
    }
  })

  const handleKeydown = (e) => {
    const [cwp, clp] = pureMoveForward(
      currentWordPosition,
      currentLetterPosition,
      typeText
    )
    const newTypeText = updateTypeText(typeText, cwp, clp, e.key)
    setCurrentWordPosition(cwp)
    setCurrentLetterPosition(clp)
    setTypeText(newTypeText)
  }

  function pureMoveForward(cwp, clp, tt) {
    if (cwp === -1) {
      return [0, 0]
    }
    return clp < tt[cwp].length - 1 ? [cwp, clp + 1] : [cwp + 1, 0]
  }

  function updateTypeText(tt, cwp, clp, key) {
    return tt.map((word, i) => {
      return word.map((obj, j) => {
        return i === cwp && j === clp
          ? {
              feedback: obj.letter === key,
              pressed: true,
              letter: obj.letter,
            }
          : obj
      })
    })
  }

  return (
    <div
      className="TypeTextWordWrapper"
      tabIndex="0"
      onKeyDown={handleKeydown}
      ref={textRef}
    >
      {typeText.map((word, p) => (
        <TypeWord word={word} key={p} />
      ))}
    </div>
  )
}

function TypeWord({ word }) {
  return (
    <div className="word">
      {word.map((letter, p) => (
        <div
          className={
            letter.feedback && letter.pressed
              ? "letter green"
              : !letter.feedback && letter.pressed
              ? "letter red"
              : "letter"
          }
          key={p}
        >
          {letter.letter}
        </div>
      ))}
    </div>
  )
}
function getWordsArray(strText) {
  return strText.split(" ")
}

function getLettersArray(strWord) {
  return strWord.split("").map((l) => {
    return {
      letter: l,
      pressed: false,
      feedback: false,
    }
  })
}
