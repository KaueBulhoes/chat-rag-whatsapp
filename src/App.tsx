import ConfigPanel from './components/ConfigPanel'
import {
  Container,
  Header,
  HeaderContent,
  MainContent,
} from './styles/App.styles'

function App() {
  return (
    <Container>
      <Header>
        <HeaderContent>
          <h1>Chat IA com RAG + WhatsApp</h1>
        </HeaderContent>
      </Header>

      <MainContent>
        <ConfigPanel />
      </MainContent>
    </Container>
  )
}

export default App