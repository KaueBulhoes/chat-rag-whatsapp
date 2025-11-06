import { useState, useEffect, useRef } from 'react'
import {
    ChatContainer,
    ChatTitle,
    MessagesContainer,
    Message,
    MessageBubble,
    MessageTime,
    TypingIndicator,
    InputSection,
    InputWrapper,
    InputLabel,
    TextInput,
    SendButton,
    ClearButton,
    InfoMessage,
} from './ChatInterface.styles'

interface ChatMessage {
    id: string
    role: 'user' | 'assistant'
    content: string
    timestamp: Date
}

export default function ChatInterface() {
    const [messages, setMessages] = useState<ChatMessage[]>([])
    const [input, setInput] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const messagesEndRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages])

    const handleSendMessage = async () => {
        if (!input.trim()) return

        try {
            const configRes = await fetch('/api/config')
            const configs = await configRes.json()

            if (!configs || configs.length === 0 || !configs[0].api_key_openrouter) {
                setError('Configure a API Key do Open Router nas configurações!')
                return
            }
        } catch {
            setError('Erro ao verificar configurações')
            return
        }

        const userMessage: ChatMessage = {
            id: Date.now().toString(),
            role: 'user',
            content: input,
            timestamp: new Date(),
        }

        setMessages((prev) => [...prev, userMessage])
        setInput('')
        setLoading(true)
        setError(null)

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: input }),
            })

            if (!response.ok) {
                const errorData = await response.json()
                throw new Error(errorData.error || 'Erro ao processar mensagem')
            }

            const data = await response.json()

            const assistantMessage: ChatMessage = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: data.response,
                timestamp: new Date(),
            }

            setMessages((prev) => [...prev, assistantMessage])
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido'
            setError(`${errorMessage}`)
            console.error('Chat error:', err)
        } finally {
            setLoading(false)
        }
    }

    const handleClearChat = () => {
        if (confirm('Tem certeza que deseja limpar todo o histórico?')) {
            setMessages([])
            setError(null)
        }
    }

    const formatTime = (date: Date) => {
        return date.toLocaleTimeString('pt-BR', {
            hour: '2-digit',
            minute: '2-digit',
        })
    }

    return (
        <ChatContainer>
            <ChatTitle>Chat com IA + RAG</ChatTitle>

            {error && <InfoMessage>{error}</InfoMessage>}

            <MessagesContainer>
                {messages.length === 0 ? (
                    <div style={{ textAlign: 'center', color: '#9ca3af', marginTop: 'auto', marginBottom: 'auto' }}>
                        <p style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>👋</p>
                        <p>Nenhuma mensagem ainda</p>
                        <p style={{ fontSize: '0.875rem' }}>Comece uma conversa digitando uma mensagem abaixo</p>
                    </div>
                ) : (
                    <>
                        {messages.map((msg) => (
                            <Message key={msg.id} role={msg.role}>
                                <div>
                                    <MessageBubble role={msg.role}>{msg.content}</MessageBubble>
                                    <MessageTime>{formatTime(msg.timestamp)}</MessageTime>
                                </div>
                            </Message>
                        ))}
                        {loading && (
                            <Message role="assistant">
                                <TypingIndicator>
                                    <span></span>
                                    <span></span>
                                    <span></span>
                                </TypingIndicator>
                            </Message>
                        )}
                    </>
                )}
                <div ref={messagesEndRef} />
            </MessagesContainer>

            <InputSection>
                <InputWrapper>
                    <InputLabel htmlFor="messageInput">Sua mensagem:</InputLabel>
                    <TextInput
                        id="messageInput"
                        type="text"
                        placeholder="Digite sua pergunta..."
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault()
                                handleSendMessage()
                            }
                        }}
                        disabled={loading}
                    />
                </InputWrapper>
                <SendButton
                    onClick={handleSendMessage}
                    disabled={!input.trim() || loading}
                    title="Enviar mensagem (Enter)"
                >
                    {loading ? '⏳' : 'Enviar'}
                </SendButton>
                <ClearButton onClick={handleClearChat} disabled={messages.length === 0 || loading}>
                    Limpar
                </ClearButton>
            </InputSection>
        </ChatContainer>
    )
}