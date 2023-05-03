import styled from "styled-components"
import TypeLetter from "./TypeLetter"
import { FEEDBACK } from "../../hooks/useTypeTest"
import { memo } from "react"
import { motion } from "framer-motion"

export default memo(function TypeWord({
  word,
  currentWordRef,
  myPosition,
  curWordPos,
}) {
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
    <StyledTypeWord
      ref={currentWordRef}
      underline={underlineIncorrect()}
      // as={motion.div}
      // layout
      // animate={{ opacity: 1 }}
      // exit={{ opacity: 0 }}
      // transition={{ duration: 0.1 }}
    >
      {word.map((letter) => (
        <TypeLetter letter={letter} key={letter.id} />
      ))}
    </StyledTypeWord>
  )
})

const StyledTypeWord = styled.div`
  display: flex;
  font-size: 1.5rem;
  font-family: ${({ theme }) => theme.font.primary}, sans-serif;
  margin-right: 12px;
  margin-bottom: 10px;
  transition: border 100ms ease-in;
  border-bottom: ${({ underline, theme }) =>
    underline
      ? `solid 2px ${theme.colors.incorrect}`
      : `solid 2px ${theme.colors.bg}`};
  font-weight: 400;
`
