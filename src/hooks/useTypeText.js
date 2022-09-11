import { useReducer } from "react"
import getRandomWordList from "../utils/wordGenerator"

export const ACTIONS = {
  MOVE_NEXT_LETTER: "move-next-letter",
  MOVE_NEXT_WORD: "move-next-word",
  MOVE_PREV_LETTER: "move-prev-letter",
  MOVE_PREV_WORD: "move-prev-word",
  RESTART_TEST: "restart-test",
}

export const FEEDBACK = {
  NOT_PRESSED: "letter-not-pressed",
  CORRECT: "correct-letter-pressed",
  INCORRECT: "incorrect-letter-pressed",
  OUT_OF_BND: "letter-out-of-bounds",
}

function reducer(state, action) {
  switch (action.type) {
    case ACTIONS.MOVE_NEXT_LETTER:
      return Algebra.next(action.payload.key, state)
    case ACTIONS.MOVE_PREV_LETTER:
      return Algebra.back(state)
    case ACTIONS.MOVE_NEXT_WORD:
      return Algebra.space(state)
    case ACTIONS.RESTART_TEST:
      return new State(getRandomWordList(50), 0, 0)
    default:
      return state
  }
}

export default function useTypeText() {
  const [state, dispatch] = useReducer(
    reducer,
    new State(getRandomWordList(50), 0, 0)
  )

  return [state, dispatch]
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

  get prevIsPerfect() {
    return this.cwp - 1 < 0
      ? false
      : this.tt[this.cwp - 1].every((obj) => obj.feedback === FEEDBACK.CORRECT)
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
    if (s.clp === 0 && s.cwp === 0) return s

    if (s.clp === 0 && s.cwp > 0) {
      return s.prevIsPerfect
        ? s
        : new State(
            s.tt,
            s.cwp - 1,
            s.tt[s.cwp - 1].length -
              s.tt[s.cwp - 1].filter(
                (obj) => obj.feedback === FEEDBACK.NOT_PRESSED
              ).length
          )
    }

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
    const newtt = s.removePrev()
    return new State(newtt, s.cwp, s.clp - 1)
  }
  static space(s) {
    if (s.clp > 0) {
      return new State(s.tt, s.cwp + 1, 0)
    }
    return s
  }
}
