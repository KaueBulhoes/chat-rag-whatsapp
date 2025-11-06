import ConfigPanel from './components/ConfigPanel'
import DocumentManager from './components/DocumentManager'
import ChatInterface from './components/ChatInterface'
import {
  Container,
  Header,
  HeaderContent,
  MainContent,
  GridLayout,
} from './styles/App.styles'

function App() {
  return (
    <Container>
      <Header>
        <HeaderContent>
          <h1>🚀 Chat IA com RAG + WhatsApp</h1>
        </HeaderContent>
      </Header>

      <MainContent>
        <GridLayout>
          <ConfigPanel />
        </GridLayout>
        <DocumentManager />
        <ChatInterface />
      </MainContent>
    </Container>
  )
}

export default App