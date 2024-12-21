import { FEEDBACK } from "../../hooks/useTypeText";
import styled from "styled-components";
import { Feedback, Letter } from "../../hooks/useTypeTest";
import { memo } from "react";

const TypeLetter = memo(function TypeLetter({ letter }: { letter: Letter }) {
  return (
    <StyledTypeLetter feedback={letter.feedback}>
      {letter.letter}
    </StyledTypeLetter>
  );
})

export const StyledTypeLetter = styled.div<{ feedback: Feedback }>`
  color: ${({ feedback, theme }) =>
    feedback === FEEDBACK.CORRECT
      ? theme.colors.correct
      : feedback === FEEDBACK.INCORRECT
        ? theme.colors.incorrect
        : feedback === FEEDBACK.OUT_OF_BND
          ? theme.colors.incorrect
          : theme.colors.notPressed};
`;

export default TypeLetter
