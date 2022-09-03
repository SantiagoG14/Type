import { useEffect, useReducer } from "react"
import { v4 as uuidv4 } from "uuid"
import TypeWord from "./TypeWord"

const ACTIONS = {
  MOVE_NEXT_LETTER: "move-next-letter",
  MOVE_NEXT_WORD: "move-next-word",
  MOVE_PREV_LETTER: "move-prev-letter",
  MOVE_PREV_WORD: "move-prev-word",
}

export const FEEDBACK = {
  NOT_PRESSED: "letter-not-pressed",
  CORRECT: "correct-letter-pressed",
  INCORRECT: "incorrect-letter-pressed",
  OUT_OF_BND: "letter-out-of-bounds",
}

export default function TypeText({ text }) {
  // const [currentWordPosition, setCurrentWordPosition] = useState(0)
  // const [currentLetterPosition, setCurrentLetterPosition] = useState(0)
  const [state, dispatch] = useReducer(
    reducer,
    // getWordsArray(text).map((word) =>
    //   getLettersArray(word, FEEDBACK.NOT_PRESSED)
    // )
    new State(
      getWordsArray(text).map((word) =>
        getLettersArray(word, FEEDBACK.NOT_PRESSED)
      ),
      0,
      0
    )
  )

  function reducer(state, action) {
    switch (action.type) {
      case ACTIONS.MOVE_NEXT_LETTER:
        // if (currentLetterPosition >= 24) {
        //   return typeText
        // } else {
        //   setCurrentLetterPosition(
        //     (prevLetterPosition) => prevLetterPosition + 1
        //   )
        //   return updateOnMoveForward(action.payload.key, typeText)
        // }
        return Algebra.next(action.payload.key, state)
      case ACTIONS.MOVE_PREV_LETTER:
        // if (currentLetterPosition === 0) return typeText
        // setCurrentLetterPosition((prev) => prev - 1)
        // return updateOnMoveBackward(typeText)
        return Algebra.back(state)
      default:
        return state
    }
  }
  // function updateOnMoveForward(key, typeText) {
  //   if (currentLetterPosition >= typeText[currentWordPosition].length) {
  //     return typeText[currentWordPosition].push({
  //       letter: key,
  //       feedback: FEEDBACK.OUT_OF_BND,
  //     })
  //   }
  //   return typeText.map((word, i) => {
  //     return word.map((obj, j) => {
  //       return i === currentWordPosition &&
  //         j === currentLetterPosition &&
  //         obj.feedback !== FEEDBACK.OUT_OF_BND
  //         ? {
  //             feedback:
  //               obj.letter === key ? FEEDBACK.CORRECT : FEEDBACK.INCORRECT,
  //             letter: obj.letter,
  //           }
  //         : obj
  //     })
  //   })
  // }

  // function updateOnMoveBackward(typeText) {
  //   const prevLetterPosition = currentLetterPosition + 1
  //   if (prevLetterPosition > typeText[currentWordPosition].length) {
  //     return typeText.map((wordArr, i) => {
  //       if (i === currentWordPosition) {
  //         return wordArr.filter((_, j) => j !== wordArr.length - 1)
  //       }
  //       return wordArr
  //     })
  //   }
  //   return typeText.map((word, i) => {
  //     return word.map((obj, j) => {
  //       return i === currentWordPosition &&
  //         j === prevLetterPosition &&
  //         obj.feedback !== FEEDBACK.OUT_OF_BND
  //         ? {
  //             feedback: FEEDBACK.NOT_PRESSED,
  //             letter: obj.letter,
  //           }
  //         : obj
  //     })
  //   })
  // }

  useEffect(() => {
    window.addEventListener("keydown", handleKeydown)

    return () => {
      window.removeEventListener("keydown", handleKeydown)
    }
  })

  const handleKeydown = (e) => {
    if (e.key.length === 1 && e.key !== " ") {
      dispatch({
        type: ACTIONS.MOVE_NEXT_LETTER,
        payload: {
          word: state.currentWordStr,
          key: e.key,
        },
      })
    } else if (e.key === "Backspace") {
      dispatch({ type: ACTIONS.MOVE_PREV_LETTER })
    }
  }
  return (
    <div className="TypeTextWordWrapper">
      {Array.isArray(state.tt)
        ? state.tt.map((word) => <TypeWord word={word} />)
        : null}
    </div>
  )
}

class State {
  constructor(tt, cwp, clp) {
    this.tt = tt
    this.cwp = cwp
    this.clp = clp
  }

  get currentWord() {
    return this.tt[this.cwp]
  }

  get currentWordStr() {
    const wordArr = this.currentWord
    let word = ""
    wordArr.forEach((letterObj) => (word += letterObj.letter))
    return word
  }

  get inbound() {
    return (
      this.clp <
      this.tt[this.cwp].filter((obj) => obj.feedback !== FEEDBACK.OUT_OF_BND)
        .length
    )
  }

  replaceCur(f) {
    return this.tt.map((word, i) => {
      return word.map((obj, j) => {
        return i === this.cwp && j === this.clp ? f(word, obj) : obj
      })
    })
  }

  replacePrev(f) {
    return this.tt.map((word, i) => {
      return word.map((obj, j) => {
        return i === this.cwp && j === this.clp - 1 ? f(word, obj) : obj
      })
    })
  }

  removePrev() {
    return this.tt.map((word, i) =>
      i === this.cwp ? word.filter((obj, j) => j !== word.length - 1) : word
    )
  }
}

class Algebra {
  static next(l, s) {
    //inbound
    if (s.inbound) {
      const newtt = s.replaceCur((_, obj) => {
        return {
          feedback: obj.letter === l ? FEEDBACK.CORRECT : FEEDBACK.INCORRECT,
          letter: obj.letter,
        }
      })
      return new State(newtt, s.cwp, s.clp + 1)
    }
    // outbound
    if (s.tt[s.cwp].length === 24) return s
    const newtt = s.tt.map((wordArr, i) => {
      if (i === s.cwp) {
        return [
          ...wordArr,
          {
            feedback: FEEDBACK.OUT_OF_BND,
            letter: l,
          },
        ]
      }
      return wordArr
    })
    return new State(newtt, s.cwp, s.clp + 1)
  }

  static back(s) {
    if (s.clp === 0) return s
    //inboud
    if (
      s.inbound ||
      s.currentWord.filter((obj) => obj.feedback !== FEEDBACK.OUT_OF_BND)
        .length === s.clp
    ) {
      const newtt = s.replacePrev((_, obj) => {
        return {
          feedback: FEEDBACK.NOT_PRESSED,
          letter: obj.letter,
        }
      })
      return new State(newtt, s.cwp, s.clp - 1)
    }

    //outbound
    console.log("happened")
    const newtt = s.removePrev()
    return new State(newtt, s.cwp, s.clp - 1)
  }
  static space(s) {}
}

function getWordsArray(strText) {
  return strText.split(" ")
}

function getLettersArray(strWord, feedback) {
  return strWord.split("").map((l) => {
    return {
      letter: l,
      feedback: feedback,
    }
  })
}

function getWordFromArray(wordArr) {
  let word = ""
  wordArr.forEach((letterObj) => (word += letterObj.letter))
  return word
}
