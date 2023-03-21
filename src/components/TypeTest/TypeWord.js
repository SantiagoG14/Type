import { useMemo, useRef } from "react"
import styled from "styled-components"
import TypeLetter from "./TypeLetter"
import { FEEDBACK } from "../../hooks/useTypeText"
import { AnimatePresence, motion } from "framer-motion"

export default function TypeWord({
  word,
  currentWordRef,
  myPosition,
  curWordPos,
}) {
  const key = useRef(0)

  function updateKey() {
    key.current += 1
    return key.current
  }
  const underlineIncorrect = () => {
    if (myPosition < curWordPos) {
      return (
        word.filter(
          (letter) =>
            letter.feedback === FEEDBACK.INCORRECT ||
            letter.feedback === FEEDBACK.NOT_PRESSED ||
            letter.feedback === FEEDBACK.OUT_OF_BND
        ).length > 0
      )
    }
    return false
  }
  return (
    <StyledTypeWord ref={currentWordRef} underline={underlineIncorrect()}>
      {word.map((letter) => (
        <TypeLetter letter={letter} key={letter.id} />
      ))}
    </StyledTypeWord>
  )
}

const StyledTypeWord = styled.div`
  display: flex;
  margin-right: 12px;
  margin-bottom: 12px;
  font-size: 1.5rem;
  font-family: ${({ theme }) => theme.font.primary}, sans-serif;
  text-decoration: ${({ underline }) => (underline ? "underline" : "")};
  text-decoration-color: ${({ theme }) => theme.colors.incorrect};
  text-underline-offset: 0.35rem;
`
