import {
  useState,
  MutableRefObject,
  useEffect,
} from "react";

export type UserCaretProps = {
  wordsWrapperRef: MutableRefObject<null | HTMLDivElement>;
  cwp: number;
  clp: number;
};
export function useCaret({
  wordsWrapperRef,
  cwp,
  clp,
}: UserCaretProps) {
  const [caretLeft, setCaretLeft] = useState(0);
  const [caretTop, setCaretTop] = useState(0);
  const [inactive, setInactive] = useState(true);

  function updateCaretX() {
    const curLetterRect = getCurLetterRect();

    if (!curLetterRect) return;

    const sideOfLetter = clp - 1 < 0 ? curLetterRect.left : curLetterRect.right;
    setCaretLeft(sideOfLetter);
  }

  function updateCaretY() {
    const curLetterRect = getCurLetterRect();

    if (!curLetterRect) return;

    setCaretTop(curLetterRect.top);
  }

  function getCurLetterRect() {
    if (!wordsWrapperRef.current) return;

    // clp - 1 < 0 ? 0 : clp - 1
    //  ? left side : right side of letter
    const curLetterNode =
      wordsWrapperRef.current.children[cwp].children[clp - 1 < 0 ? 0 : clp - 1];

    const letterRect = curLetterNode.getBoundingClientRect();
    return letterRect;
  }

  // update caret position when window is resized
  useEffect(() => {
    const updateCaret = () => {
      updateCaretX()
      updateCaretY()
    }
    window.addEventListener("resize", updateCaret);

    return () => window.removeEventListener("resize", updateCaret);
  }, []);

  useEffect(() => {
    setInactive(false);

    const id = setTimeout(() => {
      setInactive(true);
    }, 500);

    return () => {
      clearTimeout(id);
    };
  }, [cwp, clp]);

  return { caretLeft, caretTop, inactive, updateCaretX, updateCaretY };
}
