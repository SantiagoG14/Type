import { useEffect, useRef, useLayoutEffect, useState } from "react"
import useTypeText, { ACTIONS } from "../../hooks/useTypeText"
import Caret from "./Caret"
import TypeWord from "./TypeWord"

export default function TypeText() {
  const currentWordRef = useRef()
  const caretRef = useRef()
  const testWrapperRef = useRef()
  const [wordTop, setWordTop] = useState(0)
  const [caretLeft, setCaretLeft] = useState()
  const [caretTop, setCaretTop] = useState(0)
  const [state, dispatch] = useTypeText()

  useEffect(() => {
    window.addEventListener("keydown", handleKeydown)

    return () => {
      window.removeEventListener("keydown", handleKeydown)
    }
  })

  // get the height of the type text so it only has 3 lines

  useLayoutEffect(() => {
    testWrapperRef.current.height = `${
      currentWordRef.current.getBoundingClientRect().height * 3
    }px`
  })

  // effect to set the position of caret

  useLayoutEffect(() => {
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
  }, [state.clp, state.cwp])

  // effect to scroll the text down when the test has more then three lines
  // TODO: add a mask to add the scroll down effect

  useLayoutEffect(() => {
    if (
      caretTop - 3 ===
      currentWordRef.current.getBoundingClientRect().height * 2
    ) {
      setWordTop(
        (prev) => prev - currentWordRef.current.getBoundingClientRect().height
      )
      setCaretTop(currentWordRef.current.getBoundingClientRect().height + 3)
    }
  }, [caretTop])

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
    } else if (e.key === " ") {
      dispatch({ type: ACTIONS.MOVE_NEXT_WORD })
    }
  }
  return (
    <div className="testWrapper" ref={testWrapperRef}>
      <div className="TypeTextWordWrapper" style={{ top: `${wordTop}px` }}>
        {state.tt.map((word, i) =>
          i === state.cwp ? (
            <TypeWord word={word} currentWordRef={currentWordRef} />
          ) : (
            <TypeWord word={word} />
          )
        )}
      </div>

      <Caret caretRef={caretRef} curLeft={caretLeft} curTop={caretTop} />
    </div>
  )
}
