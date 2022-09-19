import { useEffect, useRef, useLayoutEffect, useState } from "react"
import Caret from "./Caret"
import TypeWord from "./TypeWord"
import styled from "styled-components"
import RestartButton from "./RestartButton"
import TestConfig from "./TestConfig"
import useTypeTest, { ACTIONS, MODES } from "../../hooks/useTypeTest"

export default function TypeText() {
  const currentWordRef = useRef()
  const caretRef = useRef()
  const testWrapperRef = useRef()
  const restartButtonRef = useRef()
  const [restartButtonFocus, setRestartButtonFocus] = useState(false)
  const [wordTop, setWordTop] = useState(0)
  const [caretLeft, setCaretLeft] = useState(0)
  const [caretTop, setCaretTop] = useState(0)
  const [state, dispatch, resetTimer] = useTypeTest()

  useEffect(() => {
    window.addEventListener("keydown", handleKeydown)
    return () => {
      window.removeEventListener("keydown", handleKeydown)
    }
  })

  // get the height of the type text so it only has 3 lines

  useLayoutEffect(() => {
    let mounted = true

    if (mounted) {
      testWrapperRef.current.height = `${
        currentWordRef.current.getBoundingClientRect().height * 3
      }px`
    }

    return () => (mounted = false)
  }, [])

  // effect to set the position of caret

  useLayoutEffect(() => {
    let mounted = true

    if (mounted && state.cwp !== state.tt.length) {
      const testWrapperRect = testWrapperRef.current.getBoundingClientRect()
      const pixelsLeftToTest = testWrapperRect.left
      const pixelsTopToTest = testWrapperRect.top
      if (state.clp - 1 < 0) {
        const curLetterNode = currentWordRef.current.children[0]
        const rect = curLetterNode.getBoundingClientRect()
        setCaretLeft(rect.left - pixelsLeftToTest - 4)
      } else {
        const curLetterNode = currentWordRef.current.children[state.clp - 1]
        const rect = curLetterNode.getBoundingClientRect()
        setCaretLeft(rect.right - pixelsLeftToTest - 3)
      }

      const curWordNode = currentWordRef.current
      const rect = curWordNode.getBoundingClientRect()
      setCaretTop(rect.top - pixelsTopToTest)
    }

    return () => (mounted = false)
  }, [state.clp, state.cwp, state.tt])

  // effect to scroll the text down when the test has more then three lines
  // TODO: add a mask to add the scroll down effect

  useLayoutEffect(() => {
    let mounted = true

    if (mounted) {
      if (
        caretTop - 3 ===
        currentWordRef.current.getBoundingClientRect().height * 2
      ) {
        setWordTop(
          (prev) => prev - currentWordRef.current.getBoundingClientRect().height
        )
        setCaretTop(currentWordRef.current.getBoundingClientRect().height + 3)
      }
    }

    return () => (mounted = false)
  }, [caretTop])

  useLayoutEffect(() => {
    let mounted = true

    if (mounted) {
      restartButtonFocus === true
        ? restartButtonRef.current.focus()
        : restartButtonRef.current.blur()
    }

    return () => (mounted = false)
  }, [restartButtonFocus])

  const handleKeydown = (e) => {
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

  const handleRestartTest = () => {
    dispatch({ type: ACTIONS.RESTART_TEST })
    setRestartButtonFocus(false)
    resetTimer(state.tc.length)
  }

  const isTestOver = () => {
    if (state.tc.mode === MODES.TIME) {
      return state.timer[0] > 0
    }
    return state.cwp < state.tt.length
  }

  return (
    <>
      <TestConfig
        dispatch={dispatch}
        testConfig={state.tc}
        resetTimer={resetTimer}
      />
      <StyledWrapper>
        <TestWrapper ref={testWrapperRef}>
          <StyledCounter>
            {
              state.tc.mode === MODES.WORDS
                ? `${state.cwp}/${state.tt.length}`
                : (state.timer[1] > 0 ? `${state.timer}:` : "") +
                  (state.timer[2] > 0 ? `${state.timer[2]}:` : "") +
                  (state.timer[3] > 9
                    ? `${state.timer[3]}`
                    : `0${state.timer[3]}`)
              /* {`${state.cwp}/${state.tt.length}`} */
            }
          </StyledCounter>

          {isTestOver() ? (
            <div
              className="TypeTextWordWrapper"
              style={{ top: `${wordTop}px` }}
            >
              {state.tt.map((word, i) =>
                i === state.cwp ? (
                  <TypeWord word={word} currentWordRef={currentWordRef} />
                ) : (
                  <TypeWord word={word} />
                )
              )}
            </div>
          ) : (
            <h1>Test is done</h1>
          )}

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
  height: fit-content;
`
