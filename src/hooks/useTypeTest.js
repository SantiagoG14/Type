import { useReducer, useLayoutEffect, useRef } from "react"
import getRandomWordList, { getRandomWord } from "../utils/wordGenerator"

export const ACTIONS = {
  MOVE_NEXT_LETTER: "move-next-letter",
  MOVE_NEXT_WORD: "move-next-word",
  MOVE_PREV_LETTER: "move-prev-letter",
  MOVE_PREV_WORD: "move-prev-word",
  RESTART_TEST: "restart-test",
  SET_TEST_CONFIG: "set-test-config",
  UPDATE_TIMER: "update-timer",
}

export const FEEDBACK = {
  NOT_PRESSED: "letter-not-pressed",
  CORRECT: "correct-letter-pressed",
  INCORRECT: "incorrect-letter-pressed",
  OUT_OF_BND: "letter-out-of-bounds",
}

export const MODES = {
  WORDS: "words",
  TIME: "time",
  QUOTES: "quotes",
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
    case ACTIONS.UPDATE_TIMER:
      return {
        tt: state.tt,
        cwp: state.cwp,
        clp: state.clp,
        tc: state.tc,
        timer: action.payload.newTimer,
      }
    default:
      return state
  }
}

export default function useTypeTest() {
  const Ref = useRef(null)

  const initialTestConfig = {
    mode: MODES.WORDS,
    length: 25,
  }

  // tt = type text
  // cwp = current word position
  // clp = current letter possition
  // tc = test config

  const [state, dispatch] = useReducer(reducer, {
    tt: getRandomWordList(initialTestConfig.length),
    cwp: 0,
    clp: 0,
    tc: initialTestConfig,
    timer: [],
  })

  const [total, hours, minutes, seconds] = state.timer

  //update timer

  function getTimeRemaining(e) {
    const total = Date.parse(e) - Date.parse(new Date())
    const seconds = Math.floor((total / 1000) % 60)
    const minutes = Math.floor((total / 1000 / 60) % 60)
    const hours = Math.floor((total / 1000 / 60 / 60) % 24)
    return {
      total,
      hours,
      minutes,
      seconds,
    }
  }

  const startTimer = (e) => {
    let { total, hours, minutes, seconds } = getTimeRemaining(e)
    if (total >= 0) {
      dispatch({
        type: ACTIONS.UPDATE_TIMER,
        payload: {
          newTimer: [total, hours, minutes, seconds],
        },
      })
    }
  }

  const clearTimer = (e) => {
    let { total, hours, minutes, seconds } = getTimeRemaining(e)

    if (total >= 0) {
      dispatch({
        type: ACTIONS.UPDATE_TIMER,
        payload: {
          newTimer: [total, hours, minutes, seconds],
        },
      })
    }
    if (Ref.current) clearInterval(Ref.current)
    const id = setInterval(() => {
      startTimer(e)
    }, 1000)
    Ref.current = id
  }

  const getDeadTime = (seconds = 60) => {
    let deadline = new Date()
    deadline.setSeconds(deadline.getSeconds() + seconds)
    return deadline
  }

  const resetTimer = (length) => {
    clearTimer(getDeadTime(0))
    startTimer(getDeadTime(length))
  }

  useLayoutEffect(() => {
    if (state.cwp === 0 && state.clp === 1) {
      if (total < state.tc.length * 1000) return
      clearTimer(getDeadTime(state.tc.length))
    }
  }, [state.clp])

  return [state, dispatch, resetTimer]
}

// helper functions

function currentWord(s) {
  return s.tt[s.cwp]
}

function inbound(state) {
  return (
    state.clp <
    state.tt[state.cwp].filter((obj) => obj.feedback !== FEEDBACK.OUT_OF_BND)
      .length
  )
}

function prevIsPerfect(state) {
  return state.cwp - 1 < 0
    ? false
    : state.tt[state.cwp - 1].every((obj) => obj.feedback === FEEDBACK.CORRECT)
}
function replaceCur(f, state) {
  return state.tt.map((word, i) => {
    return word.map((obj, j) => {
      return i === state.cwp && j === state.clp ? f(word, obj) : obj
    })
  })
}

function replacePrev(f, state) {
  return state.tt.map((word, i) => {
    return word.map((obj, j) => {
      return i === state.cwp && j === state.clp - 1 ? f(word, obj) : obj
    })
  })
}

function removePrev(s) {
  return s.tt.map((word, i) =>
    i === s.cwp ? word.filter((obj, j) => j !== word.length - 1) : word
  )
}

class Algebra {
  static next(l, s) {
    //inbound
    if (inbound(s)) {
      const newtt = replaceCur((_, obj) => {
        return {
          feedback: obj.letter === l ? FEEDBACK.CORRECT : FEEDBACK.INCORRECT,
          letter: obj.letter,
        }
      }, s)
      return { tt: newtt, cwp: s.cwp, clp: s.clp + 1, tc: s.tc, timer: s.timer }
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
    return { tt: newtt, cwp: s.cwp, clp: s.clp + 1, tc: s.tc, timer: s.timer }
  }

  static back(s) {
    if (s.clp === 0 && s.cwp === 0) return s

    if (s.clp === 0 && s.cwp > 0) {
      return prevIsPerfect(s)
        ? s
        : {
            tt: s.tt,
            cwp: s.cwp - 1,
            clp:
              s.tt[s.cwp - 1].length -
              s.tt[s.cwp - 1].filter(
                (obj) => obj.feedback === FEEDBACK.NOT_PRESSED
              ).length,
            tc: s.tc,
            timer: s.timer,
          }
    }

    //inboud
    if (
      inbound(s) ||
      currentWord(s).filter((obj) => obj.feedback !== FEEDBACK.OUT_OF_BND)
        .length === s.clp
    ) {
      const newtt = replacePrev((_, obj) => {
        return {
          feedback: FEEDBACK.NOT_PRESSED,
          letter: obj.letter,
        }
      }, s)
      return { tt: newtt, cwp: s.cwp, clp: s.clp - 1, tc: s.tc, timer: s.timer }
    }

    //outbound
    const newtt = removePrev(s)
    return { tt: newtt, cwp: s.cwp, clp: s.clp - 1, tc: s.tc, timer: s.timer }
  }
  static space(s) {
    if (s.clp > 0 && s.cwp < s.tt.length) {
      if (s.tc.mode === MODES.TIME) {
        const newTt = [...s.tt]
        newTt.push(getRandomWord())
        return { tt: newTt, cwp: s.cwp + 1, clp: 0, tc: s.tc, timer: s.timer }
      }
      return { tt: s.tt, cwp: s.cwp + 1, clp: 0, tc: s.tc, timer: s.timer }
    }
    return s
  }

  static restart(s) {
    if (s.tc.mode === MODES.WORDS) {
      return {
        tt: getRandomWordList(s.tc.length),
        cwp: 0,
        clp: 0,
        tc: s.tc,
        timer: [],
      }
    } else if (s.tc.mode === MODES.TIME) {
      return {
        tt: getRandomWordList(30),
        cwp: 0,
        clp: 0,
        tc: s.tc,
        timer: [],
      }
    }
  }

  static setConfig(newTc) {
    if (newTc.mode === MODES.WORDS) {
      return {
        tt: getRandomWordList(newTc.length),
        cwp: 0,
        clp: 0,
        tc: newTc,
        timer: [],
      }
    } else if (newTc.mode === MODES.TIME) {
      return {
        tt: getRandomWordList(30),
        cwp: 0,
        clp: 0,
        tc: newTc,
        timer: [],
      }
    }
  }
}
