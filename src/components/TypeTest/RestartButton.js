import styled from "styled-components"

export default function RestartButton({
  handleRestartTest,
  restartButtonRef,
  setRestartButtonFocus,
}) {
  return (
    <StyledButton
      ref={restartButtonRef}
      onClick={handleRestartTest}
      tabIndex={0}
      onBlur={() => setRestartButtonFocus(false)}
      onMouseDown={() => setRestartButtonFocus(true)}
      message="Restart Test"
    >
      <span className="material-symbols-outlined">restart_alt</span>
    </StyledButton>
  )
}

const StyledButton = styled.button`
  background: none;
  border: none;
  border-radius: 0.5rem;
  color: ${({ theme }) => theme.colors.notPressed};
  font-family: ${({ theme }) => theme.font.primary}, sans-serif;
  margin: 0 auto;
  padding: 1rem 2rem;
  transition: color 200ms ease, background-color 150ms ease-in;
  margin-top: 2rem;
  pointer-events: all;
  position: relative;
  cursor: pointer;

  &:hover {
    color: ${({ theme }) => theme.colors.correct};
  }

  &:focus {
    background-color: ${({ theme }) => theme.colors.correct};
    color: white;
    outline: none;
  }

  &::before {
    content: " ";
    position: absolute;
    left: 50%;
    transform: translate(-50%, 45px);
    border-width: 5px;
    border-style: solid;
    border-color: transparent transparent black transparent;
    opacity: 0;
    transition: opacity 200ms ease-in, transform 200ms ease-out 150ms;
    pointer-events: none;
  }

  &::after {
    content: "${({ message }) => message}";
    font-size: 1rem;
    position: absolute;
    border-radius: 2px;
    padding: 0.5rem 1rem;
    background-color: black;
    white-space: nowrap;
    bottom: 0;
    left: 50%;
    transform: translate(-50%, 45px);
    color: white;
    border: none;
    opacity: 0;
    transition: opacity 200ms ease-in, transform 200ms ease-out 150ms;
    pointer-events: none;
  }

  &:focus::before {
    opacity: 1;
    transform: translate(-50%, 50px);
  }

  &:focus::after {
    opacity: 1;
    transform: translate(-50%, 50px);
  }

  &:hover::before {
    opacity: 1;
    transform: translate(-50%, 50px);
  }

  &:hover::after {
    opacity: 1;
    transform: translate(-50%, 50px);
  }
`
