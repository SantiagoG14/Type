import { FEEDBACK, MODES } from "../hooks/useTypeTest"
import { v4 as uuidv4 } from "uuid"
import getRandomWordList, { getRandomWord } from "./wordGenerator"

export class Algebra {
  static next(l, s) {
    //inbound
    if (inbound(s)) {
      const newtt = replaceCur((_, obj) => {
        return {
          feedback: obj.letter === l ? FEEDBACK.CORRECT : FEEDBACK.INCORRECT,
          letter: obj.letter,
          id: obj.id,
        }
      }, s)
      const newState = { ...s }
      newState.tt = newtt
      newState.clp += 1
      return newState
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
            id: uuidv4(),
          },
        ]
      }
      return wordArr
    })

    const newState = { ...s }
    newState.tt = newtt
    newState.clp += 1
    return newState
  }

  static back(s) {
    if (s.clp === 0 && s.cwp === 0) return s

    if (s.clp === 0 && s.cwp > 0) {
      if (prevIsPerfect(s)) {
        return s
      } else {
        const newState = { ...s }
        newState.cwp -= 1
        newState.clp =
          s.tt[s.cwp - 1].length -
          s.tt[s.cwp - 1].filter((obj) => obj.feedback === FEEDBACK.NOT_PRESSED)
            .length
        return newState
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
          id: obj.id,
        }
      }, s)

      const newState = { ...s }
      newState.tt = newtt
      newState.clp -= 1
      return newState
    }

    //outbound
    const newtt = removePrev(s)
    const newState = { ...s }
    newState.tt = newtt
    newState.clp -= 1
    return newState
  }
  static space(s) {
    if (s.clp > 0 && s.cwp < s.tt.length) {
      if (s.tc.mode === MODES.TIME) {
        const newtt = [...s.tt]
        newtt.push(getRandomWord())
        const newState = { ...s }
        newState.tt = newtt
        newState.cwp += 1
        newState.clp = 0
        return newState
      }

      const newState = { ...s }
      newState.cwp += 1
      newState.clp = 0
      return newState
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
        timing: 0,
        wpm: [],
        rawWpm: [],
      }
    } else if (s.tc.mode === MODES.TIME) {
      return {
        tt: getRandomWordList(50),
        cwp: 0,
        clp: 0,
        tc: s.tc,
        timer: [],
        timing: 0,
        wpm: [],
        rawWpm: [],
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
        timing: 0,
        wpm: [],
        rawWpm: [],
      }
    } else if (newTc.mode === MODES.TIME) {
      return {
        tt: getRandomWordList(50),
        cwp: 0,
        clp: 0,
        tc: newTc,
        timer: [],
        timing: 0,
        wpm: [],
        rawWpm: [],
      }
    }
  }

  static updateTimer(s, newTimer) {
    const newState = { ...s }
    newState.timer = newTimer
    return newState
  }

  static endTimer(s, ref) {
    const newState = { ...s }
    newState.timer = []
    clearInterval(ref)
  }

  static startTestTiming(s) {
    const newState = { ...s }
    newState.timing += 1
    return newState
  }

  static endTestTiming(s) {
    const newState = { ...s }
    newState.timing = 0
    return newState
  }

  static updateWpm(s, wpm, rawWpm) {
    const newState = { ...s }
    const newWpm = [...newState.wpm, wpm]
    const newRawWpm = [...newState.rawWpm, rawWpm]
    newState.wpm = newWpm
    newState.rawWpm = newRawWpm
    return newState
  }
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
    i === s.cwp ? word.filter((_, j) => j !== word.length - 1) : word
  )
}

function currentWord(s) {
  return s.tt[s.cwp]
}
