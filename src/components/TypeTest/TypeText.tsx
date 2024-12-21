import {
  useEffect,
  useRef,
  useLayoutEffect,
  useState,
  forwardRef,
  PropsWithChildren,
  memo,
  useCallback,
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
  TestConfigT,
  Timer,
} from "../../hooks/useTypeTest";
import { useTestTime } from "../../hooks/useTestTiming";

const initialTestConfig = {
  mode: MODES.WORDS,
  length: 25,
};

export default function TypeText() {
  const caretRef = useRef<HTMLDivElement>(null);
  const restartButtonRef = useRef<HTMLButtonElement>(null);
  const wordsWrapperRef = useRef<HTMLDivElement>(null);
  const [restartButtonFocus, setRestartButtonFocus] = useState(false);
  const [state, dispatch] = useTypeTest();
  const { startTestTiming, timer, wpm, duration, resetTimer } =
    useTestTime(state);
  const caretCol = useRef(-1);
  const wordCountTracker = useRef(new Map());
  const [numOfHiddenWords, setNumOfHiddenWords] = useState(0);

  const [tc, setTc] = useState<TestConfigT>(initialTestConfig);

  useEffect(() => {
    window.addEventListener("keydown", handleKeydown);
    return () => {
      window.removeEventListener("keydown", handleKeydown);
    };
  }, [state]);

  // effect to scroll the text down when the test has more then three lines
  /*
  useLayoutEffect(() => {
    let mounted = true;

    if (mounted) {
      if (caretLeft === -3) {
        caretCol.current = caretCol.current + 1;
        wordCountTracker.current.set(caretCol.current, state.cwp);
        console.log(caretCol, wordCountTracker);

        if (caretCol.current === 2) {
          setNumOfHiddenWords(wordCountTracker.current.get(1));
          caretCol.current = 0;
        }
      }
    }

    return () => {
      mounted = false;
    };
  }, [caretTop]); */

  useEffect(() => {
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
      if (state.tc.mode === MODES.TIME) {
        //clearTestTimer();
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
    dispatch({ type: ACTIONS.RESTART_TEST });
    setRestartButtonFocus(false);
    resetTimer();
    caretCol.current = -1;
    wordCountTracker.current = new Map();
    setNumOfHiddenWords(0);
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

        <Words
          ref={wordsWrapperRef}
          cwp={state.cwp}
          numOfHiddenWords={numOfHiddenWords}
        >
          {state.tt.map((word, i) => {
            return (
              i >= numOfHiddenWords && (
                <TypeWord
                  word={word}
                  position={i}
                  curWordPos={state.cwp}
                  key={i}
                />
              )
            );
          })}
        </Words>
      </MainActivityWrapper>

      <RestartButton
        ref={restartButtonRef}
        handleRestartTest={handleRestartTest}
        setRestartButtonFocus={setRestartButtonFocus}
      />

      <Caret
        wordsWrapperRef={wordsWrapperRef}
        ref={caretRef}
        clp={state.clp}
        cwp={state.cwp}
      />
    </TestWrapper>
  );
}

type WordsProps = PropsWithChildren & {
  cwp: number;
  numOfHiddenWords: number;
};

const Words = memo(
  forwardRef<HTMLDivElement, WordsProps>(function Words({ children }, ref) {
    return <WordsWrapper ref={ref}>{children}</WordsWrapper>;
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
  width: 80%;
  max-width: 1300px;
  margin: auto;
`;

const StyledWrapper = styled.div`
  min-height: 600px;
  display: flex;
  flex-direction: column;
  justify-content: center;

  @keyframes disappear {
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

type Props = PropsWithChildren;
const TestWrapper_ = forwardRef<HTMLDivElement, Props>(({ children }, ref) => {
  return (
    <div ref={ref} style={{ position: "relative", maxWidth: "58rem" }}>
      {children}
    </div>
  );
});

const TestWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const WordsWrapper = styled.div`
  display: flex;
  width: 100%;
  flex-wrap: wrap;
  gap: 0.7rem;
  transition: top 200ms ease;
  cursor: default;
  pointer-events: none;
  overflow: hidden;
  align-content: flex-start;
  height: 125.1428604125977px;
`;
