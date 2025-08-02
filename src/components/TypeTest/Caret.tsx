import { motion } from "framer-motion";
import styled from "styled-components";
import CaretUrl from "../../assets/carrot.png";
import { forwardRef } from "react";

type CaretProps = {
  caretLeft: number;
  caretTop: number;
  inactive: boolean;
  rerender: number
};

const Caret = forwardRef<HTMLDivElement, CaretProps>(function Caret(
  { caretTop, caretLeft, inactive, rerender },
  ref,
) {
  return (
    <StyledCaret
      as={motion.div}
      key={rerender}
      ref={ref}
      animate={{ x: caretLeft, y: caretTop, }}
      transition={{ ease: "linear", duration: 0.1 }}
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
`;

const StyledCaret = styled.div`
  height: 2rem;
  width: 0.3rem;
  background-repeat: no-repeat;
  background-size: contain;
  position: absolute;
  z-index: 1;
  top: 0;
  left: 0;
  animation: reveal 500ms ease-out;

  @keyframes reveal {
    from {
      opacity: 0;
    }

    to {
      opacity: 1;
    }
  }
`;
