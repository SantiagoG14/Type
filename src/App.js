import TypeText from "./components/TypeTest/TypeText"
import styled, { ThemeProvider } from "styled-components"
import { GlobalStyles } from "./components/GlobalStyles"

const theme = {
  colors: {
    correct: "#080909",
    incorrect: "#c87e74",
    notPressed: "#99947f",
    main: "#080909",
    bg: "#eeebe2",
    altColor: "#d3cfc1",
  },

  font: {
    primary: "Atkinson Hyperlegible",
    fallback: "sans-serif",
  },
}

function App() {
  return (
    <ThemeProvider theme={theme}>
      <StyledApp>
        <GlobalStyles />
        <TypeText />
      </StyledApp>
    </ThemeProvider>
  )
}

const StyledApp = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: ${({ theme }) => theme.colors.bg};
`

export default App
