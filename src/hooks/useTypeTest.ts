import { useReducer } from "react";
import getRandomWordList, { getRandomWord } from "../utils/wordGenerator";
import { v4 as uuidv4 } from "uuid";

export const ACTIONS = {
  MOVE_NEXT_LETTER: "move-next-letter",
  MOVE_NEXT_WORD: "move-next-word",
  MOVE_PREV_LETTER: "move-prev-letter",
  MOVE_PREV_WORD: "move-prev-word",
  RESTART_TEST: "restart-test",
  SET_TEST_CONFIG: "set-test-config",
} as const;

export const FEEDBACK = {
  NOT_PRESSED: "letter-not-pressed",
  CORRECT: "correct-letter-pressed",
  INCORRECT: "incorrect-letter-pressed",
  OUT_OF_BND: "letter-out-of-bounds",
} as const;

export const MODES = {
  WORDS: "words",
  TIME: "time",
  QUOTES: "quotes",
} as const;

const feedbackValues = Object.values(FEEDBACK);
const modeValues = Object.values(MODES);
const actionValues = Object.values(ACTIONS);

export type Feedback = (typeof feedbackValues)[number];
export type Modes = (typeof modeValues)[number];
export type Actions = (typeof actionValues)[number];

type ReducerAction =
  | {
      type: `${typeof ACTIONS.MOVE_NEXT_LETTER}`;
      payload: {
        key: string;
      };
    }
  | { type: typeof ACTIONS.MOVE_PREV_LETTER }
  | { type: typeof ACTIONS.MOVE_NEXT_WORD }
  | { type: typeof ACTIONS.RESTART_TEST }
  | {
      type: typeof ACTIONS.SET_TEST_CONFIG;
      payload: { testConfig: TestConfigT };
    };

export type TestConfigT = {
  mode: Modes;
  length: number;
};

type Test = Word[];

export type Word = Letter[];

export type Letter = {
  id: string;
  letter: string;
  feedback: Feedback;
};

export type Timer = {
  total: number;
  hours: number;
  minutes: number;
  seconds: number;
};

export type AppState = {
  tt: Test;
  cwp: number;
  clp: number;
  tc: TestConfigT;
};

function reducer(state: AppState, action: ReducerAction): AppState {
  switch (action.type) {
    case ACTIONS.MOVE_NEXT_LETTER:
      return Algebra.next(action.payload.key, state);
    case ACTIONS.MOVE_PREV_LETTER:
      return Algebra.back(state);
    case ACTIONS.MOVE_NEXT_WORD:
      return Algebra.space(state);
    case ACTIONS.RESTART_TEST:
      return Algebra.restart(state);
    case ACTIONS.SET_TEST_CONFIG:
      return Algebra.setConfig(action.payload.testConfig);
    default:
      return state;
  }
}

export default function useTypeTest() {
  const initialTestConfig = {
    mode: MODES.WORDS,
    length: 25,
  };

  // tt = type text
  // cwp = current word position
  // clp = current letter possition
  // tc = test config

  const [state, dispatch] = useReducer(reducer, {
    tt: getRandomWordList(initialTestConfig.length),
    cwp: 0,
    clp: 0,
    tc: initialTestConfig,
  } satisfies AppState);

  return [state, dispatch] as const;
}

// helper functions

function currentWord(s: AppState) {
  return s.tt[s.cwp];
}

function inbound(state: AppState) {
  return (
    state.clp <
    state.tt[state.cwp].filter((obj) => obj.feedback !== FEEDBACK.OUT_OF_BND)
      .length
  );
}

type ReplaceFunction = (word: Word, obj: Letter) => Letter;

function prevIsPerfect(state: AppState) {
  return state.cwp - 1 < 0
    ? false
    : state.tt[state.cwp - 1].every((obj) => obj.feedback === FEEDBACK.CORRECT);
}
function replaceCur(f: ReplaceFunction, state: AppState) {
  return state.tt.map((word, i) => {
    return word.map((obj, j) => {
      return i === state.cwp && j === state.clp ? f(word, obj) : obj;
    });
  });
}

function replacePrev(f: ReplaceFunction, state: AppState) {
  return state.tt.map((word, i) => {
    return word.map((obj, j) => {
      return i === state.cwp && j === state.clp - 1 ? f(word, obj) : obj;
    });
  });
}

function removePrev(s: AppState) {
  return s.tt.map((word, i) =>
    i === s.cwp ? word.filter((_, j) => j !== word.length - 1) : word,
  );
}

class Algebra {
  static next(l: string, s: AppState) {
    //inbound
    if (inbound(s)) {
      const newtt = replaceCur((_, obj) => {
        return {
          feedback: obj.letter === l ? FEEDBACK.CORRECT : FEEDBACK.INCORRECT,
          letter: obj.letter,
          id: obj.id,
        };
      }, s);
      const newState = { ...s };
      newState.tt = newtt;
      newState.clp += 1;
      return newState;
    }
    // outbound
    if (s.tt[s.cwp].length === 24) return s;

    const newtt = s.tt.map((wordArr, i) => {
      if (i === s.cwp) {
        return [
          ...wordArr,
          {
            feedback: FEEDBACK.OUT_OF_BND,
            letter: l,
            id: uuidv4(),
          } satisfies Letter,
        ];
      }
      return wordArr;
    });

    const newState = { ...s };
    newState.tt = newtt;
    newState.clp += 1;
    return newState;
  }

  static back(s: AppState) {
    if (s.clp === 0 && s.cwp === 0) return s;

    if (s.clp === 0 && s.cwp > 0) {
      if (prevIsPerfect(s)) {
        return s;
      } else {
        const newState = { ...s };
        newState.cwp -= 1;
        newState.clp =
          s.tt[s.cwp - 1].length -
          s.tt[s.cwp - 1].filter((obj) => obj.feedback === FEEDBACK.NOT_PRESSED)
            .length;
        return newState;
      }
    }

    //inboud
    if (
      inbound(s) ||
      currentWord(s).filter((obj) => obj.feedback !== FEEDBACK.OUT_OF_BND)
        .length === s.clp
    ) {
      const newtt = replacePrev((_, obj) => {
        return {
          feedback: FEEDBACK.NOT_PRESSED,
          letter: obj.letter,
          id: obj.id,
        };
      }, s);

      const newState = { ...s };
      newState.tt = newtt;
      newState.clp -= 1;
      return newState;
    }

    //outbound
    const newtt = removePrev(s);
    const newState = { ...s };
    newState.tt = newtt;
    newState.clp -= 1;
    return newState;
  }
  static space(s: AppState) {
    if (s.clp > 0 && s.cwp < s.tt.length) {
      if (s.tc.mode === MODES.TIME) {
        const newtt = [...s.tt];
        newtt.push(getRandomWord());
        const newState = { ...s };
        newState.tt = newtt;
        newState.cwp += 1;
        newState.clp = 0;
        return newState;
      }

      const newState = { ...s };
      newState.cwp += 1;
      newState.clp = 0;
      return newState;
    }
    return s;
  }

  static restart(s: AppState): AppState {
    if (s.tc.mode === MODES.WORDS) {
      return {
        tt: getRandomWordList(s.tc.length),
        cwp: 0,
        clp: 0,
        tc: s.tc,
      };
    } else {
      return {
        tt: getRandomWordList(50),
        cwp: 0,
        clp: 0,
        tc: s.tc,
      };
    }
  }

  static setConfig(newTc: TestConfigT): AppState {
    if (newTc.mode === MODES.WORDS) {
      return {
        tt: getRandomWordList(newTc.length),
        cwp: 0,
        clp: 0,
        tc: newTc,
      };
    } else {
      return {
        tt: getRandomWordList(50),
        cwp: 0,
        clp: 0,
        tc: newTc,
      };
    }
  }
}
