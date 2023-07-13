import styled from "styled-components"
import { FEEDBACK } from "../../hooks/useTypeTest"
import { memo } from "react"

const TypeLetter = memo(({ letter }) => (
  <StyledTypeLetter feedback={letter.feedback}>
    {letter.letter}
  </StyledTypeLetter>
))

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

export const StyledTypeLetter = styled.div`
  color: ${({ feedback, theme }) =>
    feedback === FEEDBACK.CORRECT
      ? theme.colors.correct
      : feedback === FEEDBACK.INCORRECT
      ? theme.colors.incorrect
      : feedback === FEEDBACK.OUT_OF_BND
      ? theme.colors.incorrect
      : theme.colors.notPressed};
  user-select: none;
`
