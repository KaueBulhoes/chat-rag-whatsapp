import { useState, useEffect } from 'react'
import {
    ConfigContainer,
    FormGroup,
    ButtonGroup,
    Button,
    SuccessMessage,
    ErrorMessage,
    LoadingSpinner,
} from './ConfigPanel.styles'

interface Config {
    id?: number
    api_key_openrouter: string
    selected_model: string
    system_prompt: string
}

const MODELS = [
    'gpt-4-turbo',
    'gpt-4',
    'gpt-3.5-turbo',
    'claude-3-opus',
    'claude-3-sonnet',
    'meta-llama/llama-2-70b',
]

export default function ConfigPanel() {
    const [config, setConfig] = useState<Config>({
        api_key_openrouter: '',
        selected_model: 'gpt-3.5-turbo',
        system_prompt: 'Você é um assistente útil que ajuda com perguntas e tarefas.',
    })

    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

    useEffect(() => {
        loadConfig()
    }, [])

    const loadConfig = async () => {
        try {
            setLoading(true)
            const response = await fetch('/api/config')

            if (!response.ok) throw new Error('Erro ao carregar configurações')

            const data = await response.json()
            if (data && data.length > 0) {
                setConfig(data[0])
            }
        } catch (error) {
            console.error('Erro:', error)
            setMessage({ type: 'error', text: 'Erro ao carregar configurações' })
        } finally {
            setLoading(false)
        }
    }

    const handleSave = async () => {
        try {
            setLoading(true)
            setMessage(null)

            if (!config.api_key_openrouter.trim()) {
                setMessage({ type: 'error', text: 'Por favor, preencha a API Key' })
                setLoading(false)
                return
            }

            const response = await fetch('/api/config', {
                method: config.id ? 'PUT' : 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(config),
            })

            if (!response.ok) throw new Error('Erro ao salvar')

            const data = await response.json()
            setConfig(data)
            setMessage({ type: 'success', text: '✅ Configurações salvas com sucesso!' })

            setTimeout(() => setMessage(null), 3000)
        } catch (error) {
            console.error('Erro:', error)
            setMessage({ type: 'error', text: 'Erro ao salvar configurações' })
        } finally {
            setLoading(false)
        }
    }

    return (
        <ConfigContainer>
            {message && (
                message.type === 'success' ? (
                    <SuccessMessage>{message.text}</SuccessMessage>
                ) : (
                    <ErrorMessage>{message.text}</ErrorMessage>
                )
            )}

            <FormGroup>
                <label htmlFor="apiKey">API Key Open Router</label>
                <input
                    id="apiKey"
                    type="password"
                    placeholder="sk-or-v1-xxxxx"
                    value={config.api_key_openrouter}
                    onChange={(e) =>
                        setConfig({ ...config, api_key_openrouter: e.target.value })
                    }
                    disabled={loading}
                />
            </FormGroup>

            <FormGroup>
                <label htmlFor="model">Modelo de IA</label>
                <select
                    id="model"
                    value={config.selected_model}
                    onChange={(e) =>
                        setConfig({ ...config, selected_model: e.target.value })
                    }
                    disabled={loading}
                >
                    {MODELS.map((model) => (
                        <option key={model} value={model}>
                            {model}
                        </option>
                    ))}
                </select>
            </FormGroup>

            <FormGroup>
                <label htmlFor="systemPrompt">System Prompt</label>
                <textarea
                    id="systemPrompt"
                    placeholder="Escreva as instruções para o assistente..."
                    value={config.system_prompt}
                    onChange={(e) =>
                        setConfig({ ...config, system_prompt: e.target.value })
                    }
                    disabled={loading}
                />
            </FormGroup>

            <ButtonGroup>
                <Button
                    variant="secondary"
                    onClick={loadConfig}
                    disabled={loading}
                >
                    {loading ? <LoadingSpinner /> : 'Recarregar'}
                </Button>
                <Button
                    onClick={handleSave}
                    disabled={loading}
                >
                    {loading ? <LoadingSpinner /> : 'Salvar'}
                </Button>
            </ButtonGroup>
        </ConfigContainer>
    )
}