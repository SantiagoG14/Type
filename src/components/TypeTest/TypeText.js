import { useEffect, useRef, useLayoutEffect, useState } from "react"
import Caret from "./Caret"
import TypeWord from "./TypeWord"
import styled from "styled-components"
import RestartButton from "./RestartButton"
import TestConfig from "./TestConfig"
import useTypeTest, { MODES } from "../../hooks/useTypeTest"
import { FEEDBACK } from "../../hooks/useTypeTest"
import { motion } from "framer-motion"

export default function TypeText() {
  const caretRef = useRef()
  const testWrapperRef = useRef()
  const testWrapperRect = useRef({ left: 0, top: 0 })
  const firstWordRect = useRef({ height: 0 })
  const restartButtonRef = useRef()
  const wordsWrapperRef = useRef()
  const navBarHeight = useRef()
  const [restartButtonFocus, setRestartButtonFocus] = useState(false)
  const [caretLeft, setCaretLeft] = useState(-2)
  const [caretTop, setCaretTop] = useState(0)
  const [state, nextLetter, space, prevLetter, restartTest, setTestConfig] =
    useTypeTest()
  const adjustCaretPixels = 3
  const wordCountTracker = useRef(new Map())
  const [numOfHiddenWords, setNumOfHiddenWords] = useState(0)
  const curRow = useRef(0)

  useEffect(() => {
    window.addEventListener("keydown", handleKeydown)
    return () => {
      window.removeEventListener("keydown", handleKeydown)
    }
  })

  useLayoutEffect(() => {
    testWrapperRect.current = testWrapperRef.current.getBoundingClientRect()
    firstWordRect.current =
      wordsWrapperRef.current.children[0].getBoundingClientRect()

    navBarHeight.current =
      testWrapperRef.current.children[0].getBoundingClientRect().height
  }, [])

  // effect to set the position of caret

  useEffect(() => {
    let canceled = false

    const updateCaretPosition = () => {
      if (canceled) {
        return
      }

      if (isTestOver()) return

      const pixelsLeftToTest = testWrapperRect.current.left
      const pixelsTopToTest = testWrapperRect.current.top
      const curWordNode =
        wordsWrapperRef.current.children[state.cwp - numOfHiddenWords]
      const curWordRect = curWordNode.getBoundingClientRect()

      updateCaretX()
      updateCaretY(curWordRect)
      updateScroll(navBarHeight.current)

      function updateCaretY(curWordRect) {
        setCaretTop(curWordRect.top - pixelsTopToTest)
      }

      function updateCaretX() {
        const curLetterNode =
          state.clp - 1 < 0
            ? wordsWrapperRef.current.children[state.cwp - numOfHiddenWords]
                .children[0]
            : wordsWrapperRef.current.children[state.cwp - numOfHiddenWords]
                .children[state.clp - 1]
        const rect = curLetterNode.getBoundingClientRect()
        setCaretLeft(
          state.clp - 1 < 0
            ? rect.left - pixelsLeftToTest - adjustCaretPixels
            : rect.right - pixelsLeftToTest - adjustCaretPixels
        )
      }

      function updateScroll(navBarHeight) {
        const row = Math.round(
          (curWordRect.top - pixelsTopToTest - navBarHeight) /
            (firstWordRect.current.height + 12)
        )
        curRow.current = row

        if (row === 2) {
          if (wordCountTracker.current.get(2)) {
            wordCountTracker.current.set(0, wordCountTracker.current.get(2) - 1)
          }
          setNumOfHiddenWords(wordCountTracker.current.get(0))
        }

        wordCountTracker.current.set(row, state.cwp + 1)
      }
    }

    updateCaretPosition()

    return () => {
      canceled = true
    }
  }, [state.clp, state.cwp, numOfHiddenWords, testWrapperRect, firstWordRect])

  useEffect(() => {
    let mounted = true

    if (mounted) {
      restartButtonFocus === true
        ? restartButtonRef.current.focus()
        : restartButtonRef.current.blur()
    }

    return () => (mounted = false)
  }, [restartButtonFocus])

  const handleKeydown = (e) => {
    if (!isTestOver()) {
      if (e.key.length === 1 && e.key !== " ") {
        setRestartButtonFocus(false)
        nextLetter(e.key)
      } else if (e.key === "Backspace") {
        prevLetter()
      } else if (e.key === " ") {
        if (restartButtonFocus) {
          e.preventDefault()
          setRestartButtonFocus(false)
        }
        space()
      }
    }

    if (e.key === "Tab") {
      setRestartButtonFocus(true)
      e.preventDefault()
    }
  }

  const handleRestartTest = () => {
    restartTest()
    setRestartButtonFocus(false)
    wordCountTracker.current = new Map()
    setNumOfHiddenWords(0)
  }

  const isTestOver = () => {
    if (state.tc.mode === MODES.WORDS) {
      return (
        state.cwp === state.tt.length - 1 &&
        state.clp === state.tt[state.cwp].length
      )
    }
    return state.timer[0] === 0
  }
  return (
    <>
      <TestConfig
        setTestConfig={setTestConfig}
        testConfig={state.tc}
        appear={
          state.timing === 0
            ? state.clp === 0 && state.cwp === 0
            : state.timing === 0
        }
      />

      <StyledWrapper>
        {!isTestOver() ? (
          <TestWrapper ref={testWrapperRef} as={motion.div}>
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

            <div style={{ overflow: "hidden" }}>
              <WordsWrapper ref={wordsWrapperRef}>
                {state.tt.map((word, i) => {
                  const key = word
                    .filter((letter) => letter.feedback !== FEEDBACK.OUT_OF_BND)
                    .reduce((acc, cur) => acc + cur.id, "")
                  return (
                    i >= numOfHiddenWords && (
                      <TypeWord
                        word={word}
                        myPosition={i}
                        curWordPos={state.cwp}
                        key={key}
                      />
                    )
                  )
                })}
              </WordsWrapper>
            </div>

            <Caret
              caretRef={caretRef}
              curLeft={caretLeft}
              curTop={caretTop}
              restartbuttonfocus={restartButtonFocus.toString()}
            />
          </TestWrapper>
        ) : (
          <StyledCounter>
            <span style={{ marginRight: "1rem" }}>Word per minute:</span>
            {state.wpm.length !== 0
              ? Math.floor(state.wpm[state.wpm.length - 1])
              : "0"}
          </StyledCounter>
        )}

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
  min-width: 58rem;
  position: relative;
`

const WordsWrapper = styled.div`
  display: flex;
  width: 100%;
  flex-wrap: wrap;
  transition: top 200ms ease;
  cursor: default;
  pointer-events: none;
  align-content: flex-start;
  height: 125.1428604125977px; // height for 3 lines of text
  position: relative;
`
