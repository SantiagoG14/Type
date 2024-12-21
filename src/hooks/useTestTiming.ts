import { useState, useRef, useEffect, useMemo, useCallback } from "react";
import { AppState, Feedback, FEEDBACK } from "./useTypeTest";

export function useTestTime(testState: AppState) {
  const [duration, setDuration] = useState(0);
  const [timer, setTimer] = useState(testState.tc.length);
  const [wpm, setWpm] = useState({ wpm: 0, rawWpm: 0 });

  useEffect(() => {
    setTimer(testState.tc.length);
  }, [testState.tc.length]);

  useEffect(() => {
    setWpm({
      wpm: getWpm(testState),
      rawWpm: getRawWPM(testState),
    });
  }, [duration]);

  const testDuration = useRef<number | null>(null);

  const testTimer = useRef<number | null>(null);

  // total is in milliseconds
  function getTimeRemaining() {
    const total = timer * 1000; // covert to milliseconds
    const seconds = Math.floor((total / 1000) % 60);
    const minutes = Math.floor((total / 1000 / 60) % 60);
    const hours = Math.floor((total / 1000 / 60 / 60) % 24);
    return {
      total,
      hours,
      minutes,
      seconds,
    };
  }

  const startTestTiming = () => {
    if (testDuration.current) clearInterval(testDuration.current);
    const id = setInterval(() => {
      setDuration((prev) => prev + 1);
    }, 1000);

    testDuration.current = id;
  };

  const clearTestTimer = () => {
    if (testTimer.current) clearInterval(testTimer.current);
    const id = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : prev));
    }, 1000);

    testTimer.current = id;
  };

  // creates date for when the test is over
  const resetTimer = useCallback(() => {
    if (testDuration.current) clearInterval(testDuration.current);
    if (testTimer.current) clearInterval(testTimer.current);
    setDuration(0);
    setTimer(testState.tc.length);
  }, []);

  function getWpm(s: AppState) {
    const correct = getCharFeedback(s, FEEDBACK.CORRECT) + s.cwp;
    const wpm = (correct * (60 / duration)) / 5;
    return wpm;
  }

  function getRawWPM(s: AppState) {
    const correct = getCharFeedback(s, FEEDBACK.CORRECT) + s.cwp;
    const incorrect = getCharFeedback(s, FEEDBACK.INCORRECT);
    const outOfBns = getCharFeedback(s, FEEDBACK.OUT_OF_BND);
    const skipped = getCharFeedback(
      s,
      FEEDBACK.OUT_OF_BND,
      [...s.tt].splice(0, s.cwp + 1),
    );

    const rawWpm =
      ((correct + incorrect + outOfBns + skipped) * (60 / duration)) / 5;
    return rawWpm;
  }

  function getCharFeedback(s: AppState, feedback: Feedback, arr = s.tt) {
    const count = arr.flatMap((word) =>
      word.filter((obj) => obj.feedback === feedback),
    ).length;
    return count;
  }

  const totalTimer = useMemo(() => getTimeRemaining(), [timer]);

  return {
    timer: totalTimer,
    clearTestTimer,
    duration,
    startTestTiming,
    resetTimer,
    wpm: wpm.wpm,
    rawWpm: wpm.rawWpm,
  };
}
