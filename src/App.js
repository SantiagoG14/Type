import TypeText from "./components/TypeTest/TypeText"
import { Container } from "./components/Container.styled"
import Header from "./components/Header"
import { ThemeProvider } from "styled-components"
import { GlobalStyles } from "./components/Global"
import { mostCommon200 } from "./utils/wordGenerator"

const theme = {
  colors: {
    correct: "#000000",
    incorrect: "#d70000",
    notPressed: "#b7b7b7",
  },

  font: {
    primary: "Atkinson Hyperlegible",
    fallback: "sans-serif",
  },
}

function App() {
  return (
    <div className="App">
      <ThemeProvider theme={theme}>
        <GlobalStyles />
        <TypeText />
      </ThemeProvider>
    </div>
    // <ThemeProvider theme={theme}>
    //   <>
    //     <Header />
    //     <Container>
    //       <h1>Hello World</h1>
    //     </Container>
    //   </>
    // </ThemeProvider>
  )
}

export default App
