import { useState, MutableRefObject, useLayoutEffect, useEffect } from "react";

export type UserCaretProps = {
  wordsWrapperRef: MutableRefObject<null | HTMLDivElement>;
  cwp: number;
  clp: number;
};
export function useCaret({ wordsWrapperRef, cwp, clp }: UserCaretProps) {
  const [caretLeft, setCaretLeft] = useState(0);
  const [caretTop, setCaretTop] = useState(0);
  const [inactive, setInactive] = useState(true);

  const updateCaretPosition = () => {
    setInactive(false)
    if (!wordsWrapperRef.current) return;

    // clp - 1 < 0 ? 0 : clp - 1
    //  ? left side : right side of letter
    const curLetterNode =
      wordsWrapperRef.current.children[cwp].children[clp - 1 < 0 ? 0 : clp - 1];
    if (!curLetterNode) return;
    const letterRect = curLetterNode.getBoundingClientRect();
    const sideOfLetter = clp - 1 < 0 ? letterRect.left : letterRect.right;
    setCaretLeft(sideOfLetter);

    setCaretTop(() => {
      // height to top + height of box + height of caret
      return letterRect.top;
    });
  };

  // update caret position when window is resized
  useEffect(() => {
    window.addEventListener("resize", updateCaretPosition);

    return () => window.removeEventListener("resize", updateCaretPosition);
  });

  useEffect(() => {
    updateCaretPosition();

    const id = setTimeout(() => {
      setInactive(true);
    }, 1000);

    return () => {
      clearTimeout(id);
    };
  }, [cwp, clp]);

  return { caretLeft, caretTop, inactive };
}
