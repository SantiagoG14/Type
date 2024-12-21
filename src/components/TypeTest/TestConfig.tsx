import styled from "styled-components";
import { MODES, TestConfigT } from "../../hooks/useTypeTest";
import { memo } from "react";
import { Dispatch } from "react";

const TestConfig = memo(function TestConfig({
  testConfig,
  setTestConfig,
  resetTimer,
  appear,
}: {
  testConfig: TestConfigT;
  setTestConfig: Dispatch<React.SetStateAction<TestConfigT>>;
  appear: boolean;
  resetTimer: () => void;
}) {
  const handleClick = (testConfig: TestConfigT) => {
    setTestConfig(testConfig);
    resetTimer();
  };
  return (
    <ConfigWrapper className="row" appear={appear}>
      {(testConfig.mode === MODES.WORDS || testConfig.mode === MODES.TIME) && (
        <>
          <ConfigButton>Punctiation</ConfigButton>
          <ConfigButton>Numbers</ConfigButton>
          <Spacer />
        </>
      )}
      <ConfigButton
        onClick={() => handleClick({ mode: MODES.TIME, length: 15 })}
        active={testConfig.mode === MODES.TIME}
      >
        time
      </ConfigButton>
      <ConfigButton
        onClick={() => handleClick({ mode: MODES.WORDS, length: 25 })}
        active={testConfig.mode === MODES.WORDS}
      >
        words
      </ConfigButton>
      <ConfigButton
        onClick={() =>
          handleClick({ mode: MODES.QUOTES, length: testConfig.length })
        }
      >
        quote
      </ConfigButton>
      <Spacer />

      {testConfig.mode === MODES.WORDS ? (
        <WordLengthOptions handleClick={handleClick} testConfig={testConfig} />
      ) : (
        <TimerLengthOption handleClick={handleClick} testConfig={testConfig} />
      )}
    </ConfigWrapper>
  );
});

type ConfigOptionsProps = {
  handleClick: (config: TestConfigT) => void;
  testConfig: TestConfigT;
};

function WordLengthOptions({ handleClick, testConfig }: ConfigOptionsProps) {
  return (
    <>
      <ConfigButton
        onClick={() => handleClick({ mode: MODES.WORDS, length: 10 })}
        active={testConfig.length === 10}
      >
        10
      </ConfigButton>
      <ConfigButton
        onClick={() => handleClick({ mode: MODES.WORDS, length: 25 })}
        active={testConfig.length === 25}
      >
        25
      </ConfigButton>
      <ConfigButton
        onClick={() => handleClick({ mode: MODES.WORDS, length: 50 })}
        active={testConfig.length === 50}
      >
        50
      </ConfigButton>
      <ConfigButton
        onClick={() => handleClick({ mode: MODES.WORDS, length: 100 })}
        active={testConfig.length === 100}
      >
        100
      </ConfigButton>
    </>
  );
}

function TimerLengthOption({ handleClick, testConfig }: ConfigOptionsProps) {
  return (
    <>
      <ConfigButton
        onClick={() => handleClick({ mode: MODES.TIME, length: 15 })}
        active={testConfig.length === 15}
      >
        15
      </ConfigButton>
      <ConfigButton
        onClick={() => handleClick({ mode: MODES.TIME, length: 30 })}
        active={testConfig.length === 30}
      >
        30
      </ConfigButton>
      <ConfigButton
        onClick={() => handleClick({ mode: MODES.TIME, length: 60 })}
        active={testConfig.length === 60}
      >
        60
      </ConfigButton>

      <ConfigButton
        onClick={() => handleClick({ mode: MODES.TIME, length: 120 })}
        active={testConfig.length === 120}
      >
        120
      </ConfigButton>
    </>
  );
}

export default TestConfig

const ConfigWrapper = styled.div<{ appear?: boolean }>`
  background-color: #ececec;
  border-radius: 0.5rem;
  display: flex;
  justify-content: space-between;
  height: 2rem;
  align-items: center;
  padding: 1.5rem;
  opacity: ${({ appear }) => (appear ? "1" : "0")};
  transition: opacity 200ms ease-out;
  max-width: fit-content;
  margin: auto
`;

const ConfigButton = styled.div<{ active?: boolean }>`
  padding: 1rem;
  color: ${({ theme, active }) =>
    active ? theme.colors.main : theme.colors.notPressed};
  font-family: ${({ theme }) => theme.font.primary}, sans-serif;
  cursor: pointer;
  text-transform: capitalize;
  transition: color 150ms ease;

  &:hover {
    color: ${({ theme }) => theme.colors.correct};
  }
`;

const Spacer = styled.div`
  height: 2rem;
  width: 2px;
  padding: 0.15rem;
  border-radius: 0.5rem;
  background-color: grey;
`;
