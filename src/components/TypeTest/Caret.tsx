import { motion } from "framer-motion";
import styled from "styled-components";
import CaretUrl from "../../assets/carrot.png";
import { ComponentProps, forwardRef } from "react";
import { useCaret, UserCaretProps } from "../../hooks/useCaret";

const Caret = forwardRef<HTMLDivElement, UserCaretProps>(function Caret(
  { clp, cwp, wordsWrapperRef },
  ref,
) {
  const { caretTop, caretLeft, inactive } = useCaret({
    cwp,
    clp,
    wordsWrapperRef,
  });

  return (
    <StyledCaret
      as={motion.div}
      ref={ref}
      animate={{ x: caretLeft, y: caretTop }}
      transition={{ ease: "linear", duration: 0.1 }}
      ina
    >
      <CaretImg src={CaretUrl} height={28} width={6} inactive={inactive} />
    </StyledCaret>
  );
});

export default Caret;

const CaretImg = styled.img<{ inactive: boolean }>`
  animation: ${({ inactive }) => (inactive ? "afk 1000ms ease" : "")};
  animation-iteration-count: infinite;

  @keyframes afk {
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
`;

const StyledCaret = styled.div`
  height: 2rem;
  width: 0.5rem;
  background-repeat: no-repeat;
  background-size: contain;
  position: absolute;
  z-index: 1;
  top: 0;
  left: 0;
`;
