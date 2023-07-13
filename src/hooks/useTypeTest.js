import { useReducer, useEffect, useRef } from "react"
import getRandomWordList from "../utils/wordGenerator"
import { Algebra } from "../utils/gameAlgebra"

export const ACTIONS = {
  MOVE_NEXT_LETTER: "move-next-letter",
  MOVE_NEXT_WORD: "move-next-word",
  MOVE_PREV_LETTER: "move-prev-letter",
  MOVE_PREV_WORD: "move-prev-word",
  RESTART_TEST: "restart-test",
  SET_TEST_CONFIG: "set-test-config",
  UPDATE_TIMER: "update-timer",
  START_TEST_TIMING: "start-test-timing",
  END_TEST_TIMING: "end-test-timing",
  UPDATE_WPM: "update-wpm",
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
      return Algebra.updateTimer(state, action.payload.newTimer)
    case ACTIONS.START_TEST_TIMING:
      return Algebra.startTestTiming(state)
    case ACTIONS.END_TEST_TIMING:
      return Algebra.endTestTiming(state)
    case ACTIONS.UPDATE_WPM:
      return Algebra.updateWpm(state, action.payload.wpm, action.payload.rawWpm)
    default:
      return state
  }
}

export default function useTypeTest() {
  const Ref = useRef(null)
  const testTimingRef = useRef(null)
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
    timing: 0,
    wpm: [],
    rawWpm: [],
  })

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

  const startTestTiming = () => {
    if (testTimingRef.current) clearInterval(testTimingRef.current)
    const id = setInterval(() => {
      dispatch({ type: ACTIONS.START_TEST_TIMING })
    }, 1000)

    testTimingRef.current = id
  }

  const endTestTiming = () => {
    clearInterval(testTimingRef.current)
    dispatch({ type: ACTIONS.END_TEST_TIMING })
  }

  const getDeadTime = (seconds = 60) => {
    let deadline = new Date()
    deadline.setSeconds(deadline.getSeconds() + seconds)
    return deadline
  }

  const resetTimer = (length) => {
    clearTimer(getDeadTime(0))
    endTestTiming()
    startTimer(getDeadTime(length))
  }

  // calculate wpm and raw wpm every second
  // test passes

  useEffect(() => {
    let mounted = true

    if (mounted) {
      const wpm = getWpm(state)
      const rawWpm = getRawWPM(state)
      if (state.timing === 0) return
      if (
        state.cwp === state.tt.length - 1 &&
        state.clp === state.tt[state.cwp].length
      )
        return
      dispatch({
        type: ACTIONS.UPDATE_WPM,
        payload: {
          wpm: wpm,
          rawWpm: rawWpm,
        },
      })
    }
  }, [state.timing])

  // start timer

  useEffect(() => {
    let mounted = true

    if (mounted) {
      if (state.cwp === 0 && state.clp === 1 && state.tc.mode === MODES.TIME) {
        if (state.timer[0] < state.tc.length * 1000) return
        clearTimer(getDeadTime(state.tc.length))
      }

      if (state.cwp === 0 && state.clp === 1) {
        startTestTiming()
      }
    }
  }, [state.clp])

  function nextLetter(key) {
    dispatch({
      type: ACTIONS.MOVE_NEXT_LETTER,
      payload: {
        word: state.curWordStr,
        key: key,
      },
    })
  }

  function space() {
    dispatch({
      type: ACTIONS.MOVE_NEXT_WORD,
    })
  }

  function prevLetter() {
    dispatch({
      type: ACTIONS.MOVE_PREV_LETTER,
    })
  }

  function restartTest() {
    dispatch({
      type: ACTIONS.RESTART_TEST,
    })
    resetTimer(state.tc.length)
  }

  function setTestConfig(testConfig) {
    dispatch({
      type: ACTIONS.SET_TEST_CONFIG,
      payload: {
        testConfig: testConfig,
      },
    })
    resetTimer(testConfig.length)
  }

  return [state, nextLetter, space, prevLetter, restartTest, setTestConfig]
}

// helper functions

function getCharFeedback(s, feedback, arr = s.tt) {
  const updateArr = [...arr]
  const count = updateArr.flatMap((word) =>
    word.filter((obj) => obj.feedback === feedback)
  ).length
  return count
}

function getRawWPM(s) {
  const correct = getCharFeedback(s, FEEDBACK.CORRECT) + s.cwp
  const incorrect = getCharFeedback(s, FEEDBACK.INCORRECT)
  const outOfBns = getCharFeedback(s, FEEDBACK.OUT_OF_BND)
  const skipped = getCharFeedback(
    s,
    FEEDBACK.OUT_OF_BND,
    [...s.tt].splice(0, s.cwp + 1)
  )

  const rawWpm =
    ((correct + incorrect + outOfBns + skipped) * (60 / s.timing)) / 5
  return rawWpm
}

function getWpm(s) {
  const correct = getCharFeedback(s, FEEDBACK.CORRECT) + s.cwp
  const wpm = (correct * (60 / s.timing)) / 5
  return wpm
}
