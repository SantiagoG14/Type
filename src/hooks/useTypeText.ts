import { useReducer } from "react"
import getRandomWordList from "../utils/wordGenerator"
import { useCountDown } from "./useCountdown"

export const ACTIONS = {
  MOVE_NEXT_LETTER: "move-next-letter",
  MOVE_NEXT_WORD: "move-next-word",
  MOVE_PREV_LETTER: "move-prev-letter",
  MOVE_PREV_WORD: "move-prev-word",
  RESTART_TEST: "restart-test",
  SET_TEST_CONFIG: "set-test-config",
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
      return Algebra.restart(state)
    case ACTIONS.SET_TEST_CONFIG:
      return Algebra.setConfig(action.payload.testConfig)
    default:
      return state
  }
}

export default function useTypeText() {
  // const [time, newTimer] = useCountDown()
  const initialTestConfig = {
    type: "words",
    length: 25,
  }
  const [state, dispatch] = useReducer(
    reducer,
    new State(
      getRandomWordList(initialTestConfig.length),
      0,
      0,
      initialTestConfig,
      useCountDown()
    )
  )

  return [state, dispatch]
}

class State {
  // tt = type text
  // cwp = current word position
  // clp = current letter position
  // tc = test config

  constructor(tt, cwp, clp, tc, timer) {
    this.tt = tt
    this.cwp = cwp
    this.clp = clp
    this.tc = tc
    this.timer = timer
  }

  get currentWord() {
    return this.tt[this.cwp]
  }

  get testStarted() {
    return this.clp > 1 || this.cwp > 1
  }

  get currentWordStr() {
    const wordArr = this.currentWord
    let word = ""
    wordArr.forEach((letterObj) => (word += letterObj.letter))
    return word
  }

  get uncorrectedErrors() {
    return this.tt.filter(
      (word) =>
        word.feedback === FEEDBACK.INCORRECT ||
        word.feedback === FEEDBACK.OUT_OF_BND
    )
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
      return new State(newtt, s.cwp, s.clp + 1, s.tc)
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
    return new State(newtt, s.cwp, s.clp + 1, s.tc)
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
              ).length,
            s.tc
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
      return new State(newtt, s.cwp, s.clp - 1, s.tc)
    }

    //outbound
    const newtt = s.removePrev()
    return new State(newtt, s.cwp, s.clp - 1, s.tc)
  }
  static space(s) {
    if (s.clp > 0 && s.cwp < s.tt.length) {
      return new State(s.tt, s.cwp + 1, 0, s.tc)
    }
    return s
  }

  static restart(s) {
    return new State(getRandomWordList(s.tc.length), 0, 0, s.tc)
  }

  static setConfig(tc) {
    return new State(getRandomWordList(tc.length), 0, 0, tc)
  }
}
