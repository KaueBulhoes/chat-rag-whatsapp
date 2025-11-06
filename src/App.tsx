import SettingsButton from './components/SettingsButton'
import DocumentManager from './components/DocumentManager'
import ChatInterface from './components/ChatInterface'
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
          <h1>🚀 Chat IA com RAG + WhatsApp</h1>
          <SettingsButton />
        </HeaderContent>
      </Header>

      <MainContent>
        <DocumentManager />
        <ChatInterface />
      </MainContent>
    </Container>
  )
}

export default App