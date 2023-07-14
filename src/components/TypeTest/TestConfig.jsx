import React from "react"
import styled from "styled-components"
import { MODES } from "../../hooks/useTypeTest"
export default function TestConfig({ setTestConfig, testConfig, appear }) {
  const handleClick = (testConfig) => {
    setTestConfig(testConfig)
  }

  return (
    <ConfigWrapper className="row" appear={appear}>
      {/* {(testConfig.mode === MODES.WORDS || testConfig.mode === MODES.TIME) && (
        <>
          <ConfigButton>Punctiation</ConfigButton>
          <ConfigButton>Numbers</ConfigButton>
          <Spacer />
        </>
      )} */}
      <ConfigButton
        onClick={() => handleClick({ mode: MODES.TIME, length: 15 })}
        active={testConfig.mode === MODES.TIME}
      >
        <span className="material-symbols-outlined">timer</span>
        time
      </ConfigButton>
      <ConfigButton
        onClick={() => handleClick({ mode: MODES.WORDS, length: 25 })}
        active={testConfig.mode === MODES.WORDS}
      >
        <span className="material-symbols-outlined">format_italic</span>
        words
      </ConfigButton>
      {/* <ConfigButton
      // onClick={() =>
      //   dispatch({
      //     type: ACTIONS.SET_TEST_CONFIG,
      //     payload: {
      //       testConfig: { mode: MODES.QUOTES, length: testConfig.length },
      //     },
      //   })
      // }
      >
        <span className="material-symbols-outlined">format_quote</span>
        quote
      </ConfigButton> */}
      <Spacer />

      {testConfig.mode === MODES.WORDS ? (
        <WordLengthOptions handleClick={handleClick} testConfig={testConfig} />
      ) : (
        <TimerLengthOption handleClick={handleClick} testConfig={testConfig} />
      )}
    </ConfigWrapper>
  )
}

function WordLengthOptions({ handleClick, testConfig }) {
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
  )
}

function TimerLengthOption({ handleClick, testConfig }) {
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
  )
}

const ConfigWrapper = styled.div`
  background-color: ${({ theme }) => theme.colors.altColor};
  border-radius: 0.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  opacity: ${({ appear }) => (appear ? "1" : "0")};
  transition: opacity 200ms ease-out;
  padding: 0.4rem 2rem;
  gap: 1.2rem;
`

const ConfigButton = styled.div`
  color: ${({ theme, active }) =>
    active ? theme.colors.main : theme.colors.notPressed};
  font-family: ${({ theme }) => theme.font.primary}, sans-serif;
  cursor: pointer;
  text-transform: capitalize;
  transition: color 150ms ease;
  font-size: 0.85rem;
  display: flex;
  align-items: center;

  & span {
    font-size: 1rem;
    margin-right: 0.2rem;
  }

  &:hover {
    color: ${({ theme }) => theme.colors.correct};
  }
`

const Spacer = styled.div`
  height: 2rem;
  width: 2px;
  padding: 0.15rem;
  border-radius: 0.5rem;
  background-color: ${({ theme }) => theme.colors.bg};
`
