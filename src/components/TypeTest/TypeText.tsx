import {
  useEffect,
  useRef,
  useState,
  forwardRef,
  PropsWithChildren,
  memo,
  useCallback,
  useLayoutEffect,
} from "react";
import Caret from "./Caret";
import TypeWord from "./TypeWord";
import styled from "styled-components";
import RestartButton from "./RestartButton";
import TestConfig from "./TestConfig";
import useTypeTest, {
  ACTIONS,
  Modes,
  MODES,
  Timer,
  TestConfigT,
} from "@/hooks/useTypeTest";
import { useTestTime } from "@/hooks/useTestTiming";
import { useSavedState } from "@/hooks/useSavedState";
import { useCaret } from "@/hooks/useCaret";

const initialTestConfig = {
  mode: MODES.WORDS,
  length: 25,
};

export default function TypeText() {
  const restartButtonRef = useRef<HTMLButtonElement>(null);
  const wordsWrapperRef = useRef<HTMLDivElement>(null);
  const [restartButtonFocus, setRestartButtonFocus] = useState(false);
  const [rerender, setRerender] = useState(0);

  const [tc, setTc] = useSavedState<TestConfigT>(
    "testConfig",
    initialTestConfig,
  );
  const [state, dispatch] = useTypeTest(tc);

  const { startTestTiming, timer, wpm, duration, resetTimer, clearTestTimer } =
    useTestTime(state);

  useEffect(() => {
    window.addEventListener("keydown", handleKeydown);
    return () => {
      window.removeEventListener("keydown", handleKeydown);
    };
  }, [state]);

  const curWordDy = useRef({ prevDy: 0, count: 0 });
  const wordScrollRef = useRef<HTMLDivElement>(null);
  const [wordsTop, setWordsTop] = useState(0);

  const { caretTop, caretLeft, inactive, updateCaretX, updateCaretY } =
    useCaret({
      cwp: state.cwp,
      clp: state.clp,
      wordsWrapperRef,
    });

  useLayoutEffect(() => {
    const height = wordScrollRef.current?.getBoundingClientRect().height;
    const firstWord = wordsWrapperRef.current?.children[0];
    const curWord = wordsWrapperRef.current?.children[state.cwp];

    if (!firstWord) return;
    if (!curWord) return;
    if (!height) return;

    const dy =
      curWord?.getBoundingClientRect().y -
      wordScrollRef.current?.getBoundingClientRect().y;

    if (dy > curWordDy.current.prevDy) {
      curWordDy.current = {
        prevDy: dy,
        count: curWordDy.current.count + 1,
      };
    }

    if (curWordDy.current.count < 2) {
      updateCaretY();
    }

    if (curWordDy.current.count === 2) {
      setWordsTop((prev) => prev + firstWord.getBoundingClientRect().height);
      curWordDy.current = {
        count: 0,
        prevDy: 0,
      };
    }
  }, [state.cwp]);

  useLayoutEffect(() => {
    updateCaretX();
  }, [state.clp, state.cwp]);

  useLayoutEffect(() => {
    if (!restartButtonRef.current) return;

    restartButtonFocus
      ? restartButtonRef.current.focus()
      : restartButtonRef.current.blur();
  }, [restartButtonFocus]);

  const handleKeydown = (e: KeyboardEvent) => {
    if (isTestOver()) return;

    const re = new RegExp("[a-z]");
    const res = re.test(e.key);

    // start timing as soon as move letters
    if (res && state.cwp === 0 && state.clp === 1) {
      if (tc.mode === MODES.TIME) {
        clearTestTimer();
      }
      startTestTiming();
    }

    if (e.key.length === 1 && e.key !== " ") {
      e.preventDefault();
      setRestartButtonFocus(false);
      dispatch({
        type: ACTIONS.MOVE_NEXT_LETTER,
        payload: {
          key: e.key,
        },
      });
    } else if (e.key === "Backspace") {
      dispatch({ type: ACTIONS.MOVE_PREV_LETTER });
    } else if (e.key === " ") {
      if (restartButtonFocus) {
        e.preventDefault();
        setRestartButtonFocus(false);
      }
      dispatch({ type: ACTIONS.MOVE_NEXT_WORD });
    } else if (e.key === "Tab") {
      e.preventDefault();
      setRestartButtonFocus(true);
    }
  };

  const handleRestartTest = useCallback(() => {
    if (!wordsWrapperRef.current) return;
    setWordsTop(0);
    setRerender((prev) => prev + 1);
    dispatch({ type: ACTIONS.RESTART_TEST });
    setRestartButtonFocus(false);
    resetTimer();
  }, []);

  const isTestOver = () => {
    // if (state.tc.mode === MODES.TIME) {
    //   return state.timer[0] === 0
    // }
    // return (
    //   state.cwp === state.tt.length - 1 &&
    //   state.clp === state.tt[state.tt.length].length
    // )

    return false;
  };
  const showConfig =
    duration === 0 ? state.clp === 0 && state.cwp === 0 : duration === 0;
  return (
    <TestWrapper>
      <TestConfig
        setTestConfig={setTc}
        testConfig={tc}
        resetTimer={resetTimer}
        appear={showConfig}
      />

      <MainActivityWrapper>
        <TestStats
          timer={timer}
          cwp={state.cwp}
          testLength={state.tt.length}
          wpm={wpm}
          mode={state.tc.mode}
        />

        <WordsWrapperScroll ref={wordScrollRef} key={rerender}>
          <Words
            ref={wordsWrapperRef}
            cwp={state.cwp}
            top={wordsTop}
            onTrasitionEnd={() => {
              updateCaretY();
              updateCaretX();
            }}
          >
            {state.tt.map((word, i) => {
              return (
                <TypeWord
                  word={word}
                  position={i}
                  curWordPos={state.cwp}
                  key={i}
                />
              );
            })}
          </Words>
        </WordsWrapperScroll>
        <Caret
          caretLeft={caretLeft}
          caretTop={caretTop}
          inactive={inactive}
          rerender={rerender}
        />
      </MainActivityWrapper>

      <RestartButton
        ref={restartButtonRef}
        handleRestartTest={handleRestartTest}
        setRestartButtonFocus={setRestartButtonFocus}
      />
    </TestWrapper>
  );
}

type WordsProps = PropsWithChildren & {
  cwp: number;
  top: number;
  onTrasitionEnd: () => void;
};

const Words = memo(
  forwardRef<HTMLDivElement, WordsProps>(function Words(
    { children, top, onTrasitionEnd },
    ref,
  ) {
    return (
      <WordsWrapper ref={ref} top={top} onTransitionEnd={onTrasitionEnd}>
        {children}
      </WordsWrapper>
    );
  }),
);

const TestStats = memo(function TestStats({
  timer,
  mode,
  cwp,
  testLength,
  wpm,
}: {
  timer: Timer;
  mode: Modes;
  cwp: number;
  testLength: number;
  wpm: number;
}) {
  return (
    <div style={{ display: "flex" }}>
      <StyledCounter style={{ marginRight: "2rem" }}>
        {mode === MODES.WORDS
          ? `${cwp}/${testLength}`
          : (timer.hours > 0 ? `${timer.hours}:` : "") +
            (timer.minutes > 0 ? `${timer.minutes}:` : "") +
            (timer.seconds > 9 ? `${timer.seconds}` : `0${timer.seconds}`)}
      </StyledCounter>
      <StyledCounter>
        {!isNaN(wpm) && isFinite(wpm) ? Math.floor(wpm) : "0"}
      </StyledCounter>
    </div>
  );
});

const StyledCounter = styled.div`
  font-size: 1.5rem;
  font-family: ${({ theme }) => theme.font.primary}, sans-serif;
  color: ${({ theme }) => theme.colors.correct};
  margin: 1rem 0;
  height: 29.71px;
`;

const MainActivityWrapper = styled.div`
  width: 60%;
  max-width: 1300px;
  margin: auto;
`;

const TestWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 2rem;
`;

const WordsWrapperScroll = styled.div`
  width: 100%;
  height: 125.1428604125977px;
  position: relative;
  pointer-events: none;
  overflow: hidden;
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

const WordsWrapper = styled.div<{ top: number }>`
  display: flex;
  width: 100%;
  flex-wrap: wrap;
  position: absolute;
  transition: top 100ms ease;
  left: 0;
  top: -${({ top }) => top}px;
  cursor: default;
  align-content: flex-start;
`;
