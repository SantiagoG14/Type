import { useEffect, useRef, useLayoutEffect, useState } from "react"
import Caret from "./Caret"
import TypeWord from "./TypeWord"
import styled from "styled-components"
import RestartButton from "./RestartButton"
import TestConfig from "./TestConfig"
import useTypeTest, { ACTIONS, MODES } from "../../hooks/useTypeTest"
import { AnimatePresence, motion } from "framer-motion"

export default function TypeText() {
  const caretRef = useRef()
  const testWrapperRef = useRef()
  const restartButtonRef = useRef()
  const wordsWrapperRef = useRef()
  const [restartButtonFocus, setRestartButtonFocus] = useState(false)
  const [caretLeft, setCaretLeft] = useState(-2)
  const [caretTop, setCaretTop] = useState(0)
  const [state, dispatch, resetTimer] = useTypeTest()
  const adjustCaretPixels = 3
  const caretHeighChange = useRef(0)
  const wordCountTracker = useRef(new Map())
  const [numOfHiddenWords, setNumOfHiddenWords] = useState(0)

  useEffect(() => {
    window.addEventListener("keydown", handleKeydown)
    return () => {
      window.removeEventListener("keydown", handleKeydown)
    }
  })

  // effect to set the position of caret

  // useLayoutEffect(() => {
  //   let mounted = true

  //   if (mounted) {
  //     const testWrapperRect = testWrapperRef.current.getBoundingClientRect()
  //     const pixelsLeftToTest = testWrapperRect.left
  //     const pixelsTopToTest = testWrapperRect.top
  //     if (state.clp - 1 < 0) {
  //       const curLetterNode =
  //         wordsWrapperRef.current.children[state.cwp - numOfHiddenWords]
  //           .children[0]
  //       const rect = curLetterNode.getBoundingClientRect()
  //       setCaretLeft(rect.left - pixelsLeftToTest - adjustCaretPixels)
  //     } else {
  //       const curLetterNode =
  //         wordsWrapperRef.current.children[state.cwp - numOfHiddenWords]
  //           .children[state.clp - 1]
  //       const rect = curLetterNode.getBoundingClientRect()
  //       setCaretLeft(rect.right - pixelsLeftToTest - adjustCaretPixels)
  //     }

  //     const curWordNode =
  //       wordsWrapperRef.current.children[state.cwp - numOfHiddenWords]
  //     const rect = curWordNode.getBoundingClientRect()
  //     setCaretTop((prev) => {
  //       if (prev !== rect.top - pixelsLeftToTest) {
  //         return rect.top - pixelsTopToTest
  //       }
  //       return prev
  //     })
  //   }

  //   return () => (mounted = false)
  // }, [state.clp, state.cwp, state.tt, numOfHiddenWords])
  useLayoutEffect(() => {
    let canceled = false

    const updateCaretPosition = () => {
      if (canceled) {
        return
      }

      const testWrapperRect = testWrapperRef.current.getBoundingClientRect()
      const pixelsLeftToTest = testWrapperRect.left
      const pixelsTopToTest = testWrapperRect.top

      if (state.clp - 1 < 0) {
        const curLetterNode =
          wordsWrapperRef.current.children[state.cwp - numOfHiddenWords]
            .children[0]
        const rect = curLetterNode.getBoundingClientRect()
        setCaretLeft(rect.left - pixelsLeftToTest - adjustCaretPixels)
      } else {
        const curLetterNode =
          wordsWrapperRef.current.children[state.cwp - numOfHiddenWords]
            .children[state.clp - 1]
        const rect = curLetterNode.getBoundingClientRect()
        setCaretLeft(rect.right - pixelsLeftToTest - adjustCaretPixels)
      }

      const curWordNode =
        wordsWrapperRef.current.children[state.cwp - numOfHiddenWords]
      const rect = curWordNode.getBoundingClientRect()

      setCaretTop((prev) => {
        if (prev !== rect.top - pixelsTopToTest) {
          return rect.top - pixelsTopToTest
        }
        return prev
      })
    }

    updateCaretPosition()

    return () => {
      canceled = true
    }
  }, [
    state.clp,
    state.cwp,
    state.tt,
    numOfHiddenWords,
    testWrapperRef,
    wordsWrapperRef,
  ])

  // effect to scroll the text down when the test has more then three lines

  useEffect(() => {
    let mounted = true
    caretHeighChange.current = caretHeighChange.current + 1

    if (mounted) {
      // console.log(caretTop)
      console.log(wordCountTracker.current, caretHeighChange.current)

      if (caretHeighChange.current >= 0) {
        wordCountTracker.current.set(caretHeighChange.current, state.cwp)
      }

      if (caretHeighChange.current === 2) {
        setNumOfHiddenWords(wordCountTracker.current.get(1))
        console.log(numOfHiddenWords)
        caretHeighChange.current = 0
      }
    }

    return () => (mounted = false)
  }, [caretTop])

  // // useEffect(() => {
  // //   console.log("left", caretLeft)
  // // }, [caretLeft])

  // useEffect(() => {
  //   console.log(caretHeighChange.current)
  //   caretHeighChange.current = caretHeighChange.current + 1
  // }, [caretTop])

  //set the focus of restart button

  useLayoutEffect(() => {
    let mounted = true

    if (mounted) {
      restartButtonFocus === true
        ? restartButtonRef.current.focus()
        : restartButtonRef.current.blur()
    }

    return () => (mounted = false)
  }, [restartButtonFocus])

  useEffect(() => {
    console.log("current caretHeight", caretHeighChange.current)
  }, [caretHeighChange.current])
  const handleKeydown = (e) => {
    if (!isTestOver()) {
      if (e.key.length === 1 && e.key !== " ") {
        e.preventDefault()
        setRestartButtonFocus(false)
        dispatch({
          type: ACTIONS.MOVE_NEXT_LETTER,
          payload: {
            word: state.currentWordStr,
            key: e.key,
          },
        })
      } else if (e.key === "Backspace") {
        dispatch({ type: ACTIONS.MOVE_PREV_LETTER })
      } else if (e.key === " ") {
        if (restartButtonFocus) {
          e.preventDefault()
          setRestartButtonFocus(false)
        }
        dispatch({ type: ACTIONS.MOVE_NEXT_WORD })
      } else if (e.key === "Tab") {
        e.preventDefault()
        setRestartButtonFocus(true)
      }
    }
  }

  const handleRestartTest = () => {
    dispatch({ type: ACTIONS.RESTART_TEST })
    setRestartButtonFocus(false)
    resetTimer(state.tc.length)
    caretHeighChange.current = 0
    wordCountTracker.current = new Map()
    setNumOfHiddenWords(0)
  }

  const isTestOver = () => {
    // if (state.tc.mode === MODES.TIME) {
    //   return state.timer[0] === 0
    // }
    // return (
    //   state.cwp === state.tt.length - 1 &&
    //   state.clp === state.tt[state.tt.length].length
    // )

    return false
  }
  return (
    <>
      <TestConfig
        dispatch={dispatch}
        testConfig={state.tc}
        resetTimer={resetTimer}
        appear={
          state.timing === 0
            ? state.clp === 0 && state.cwp === 0
            : state.timing === 0
        }
      />

      <StyledWrapper>
        <TestWrapper ref={testWrapperRef}>
          <div style={{ display: "flex" }}>
            <StyledCounter style={{ marginRight: "2rem" }}>
              {state.tc.mode === MODES.WORDS
                ? `${state.cwp}/${state.tt.length}`
                : (state.timer[1] > 0 ? `${state.timer}:` : "") +
                  (state.timer[2] > 0 ? `${state.timer[2]}:` : "") +
                  (state.timer[3] > 9
                    ? `${state.timer[3]}`
                    : `0${state.timer[3]}`)}
            </StyledCounter>
            <StyledCounter>
              {state.wpm.length !== 0
                ? Math.floor(state.wpm[state.wpm.length - 1])
                : "0"}
            </StyledCounter>
          </div>

          <WordsWrapper ref={wordsWrapperRef}>
            {state.tt.map((word, i) => {
              return (
                i >= numOfHiddenWords && (
                  <TypeWord
                    word={word}
                    myPosition={i}
                    curWordPos={state.cwp}
                    key={i}
                  />
                )
              )
            })}
          </WordsWrapper>

          <Caret
            caretRef={caretRef}
            curLeft={caretLeft}
            curTop={caretTop}
            restartbuttonfocus={restartButtonFocus.toString()}
          />
        </TestWrapper>

        <RestartButton
          handleRestartTest={handleRestartTest}
          restartButtonRef={restartButtonRef}
          setRestartButtonFocus={setRestartButtonFocus}
        />
      </StyledWrapper>
    </>
  )
}

const StyledCounter = styled.div`
  font-size: 1.5rem;
  font-family: ${({ theme }) => theme.font.primary}, sans-serif;
  color: ${({ theme }) => theme.colors.correct};
  margin: 1rem 0;
  height: 29.71px;
`

const StyledWrapper = styled.div`
  min-height: 600px;
  display: flex;
  flex-direction: column;
  justify-content: center;

  @keyframes disappear {
    0% {
      opacity: 1;
    }

    50% {
      opacity: 0;
    }

    100% {
      opacity: 1;
    }
  }
`

const TestWrapper = styled.div`
  position: relative;
  max-width: 58rem;
  position: relative;
`

const WordsWrapper = styled.div`
  display: flex;
  width: 100%;
  flex-wrap: wrap;
  transition: top 200ms ease;
  cursor: default;
  pointer-events: none;
  overflow: hidden;
  align-content: flex-start;
  height: 125.1428604125977px;
  top: 16px;
  /* position: absolute; */
`
