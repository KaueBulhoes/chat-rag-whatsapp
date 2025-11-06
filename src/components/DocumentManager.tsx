import { useState, useEffect } from 'react'
import {
    DocumentContainer,
    DocumentTitle,
    UploadSection,
    UploadForm,
    InputWrapper,
    UploadButton,
    DocumentListSection,
    EmptyState,
    DocumentList,
    DocumentCard,
    DocumentName,
    DocumentInfo,
    DocumentActions,
    DeleteButton,
    ViewButton,
    LoadingSpinner,
    SuccessMessage,
    ErrorMessage,
} from './DocumentManager.styles'

interface Document {
    id: number
    filename: string
    file_type: string
    file_size: number
    created_at: string
}

export default function DocumentManager() {
    const [documents, setDocuments] = useState<Document[]>([])
    const [file, setFile] = useState<File | null>(null)
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

    useEffect(() => {
        loadDocuments()
    }, [])

    const loadDocuments = async () => {
        try {
            setLoading(true)
            const response = await fetch('/api/documents')

            if (!response.ok) throw new Error('Erro ao carregar documentos')

            const data = await response.json()
            setDocuments(Array.isArray(data) ? data : [])
        } catch (error) {
            console.error('Erro:', error)
            setMessage({ type: 'error', text: 'Erro ao carregar documentos' })
        } finally {
            setLoading(false)
        }
    }

    const handleUpload = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!file) {
            setMessage({ type: 'error', text: 'Selecione um arquivo' })
            return
        }

        const validExtensions = ['.pdf', '.txt', '.md']
        const ext = '.' + file.name.split('.').pop()?.toLowerCase()

        if (!validExtensions.includes(ext)) {
            setMessage({ type: 'error', text: 'Apenas PDF, TXT e MD são permitidos' })
            return
        }

        if (file.size > 10 * 1024 * 1024) {
            setMessage({ type: 'error', text: 'Arquivo não pode exceder 10MB' })
            return
        }

        const formData = new FormData()
        formData.append('file', file)

        setLoading(true)
        try {
            const response = await fetch('/api/documents', {
                method: 'POST',
                body: formData,
            })

            if (!response.ok) throw new Error('Erro ao fazer upload')

            setMessage({ type: 'success', text: '✅ Arquivo enviado com sucesso!' })
            setFile(null)

            const input = document.querySelector('input[type="file"]') as HTMLInputElement
            if (input) input.value = ''

            await loadDocuments()

            setTimeout(() => setMessage(null), 3000)
        } catch (error) {
            console.error('Erro:', error)
            setMessage({ type: 'error', text: '❌ Erro ao fazer upload do arquivo' })
        } finally {
            setLoading(false)
        }
    }

    const handleDelete = async (id: number, filename: string) => {
        if (!confirm(`Tem certeza que deseja deletar "${filename}"?`)) {
            return
        }

        setLoading(true)
        try {
            const response = await fetch(`/api/documents?id=${id}`, {
                method: 'DELETE',
            })

            if (!response.ok) throw new Error('Erro ao deletar')

            setMessage({ type: 'success', text: '✅ Arquivo deletado!' })
            await loadDocuments()

            setTimeout(() => setMessage(null), 3000)
        } catch (error) {
            console.error('Erro:', error)
            setMessage({ type: 'error', text: '❌ Erro ao deletar arquivo' })
        } finally {
            setLoading(false)
        }
    }

    const formatFileSize = (bytes: number) => {
        if (bytes === 0) return '0 Bytes'
        const k = 1024
        const sizes = ['Bytes', 'KB', 'MB']
        const i = Math.floor(Math.log(bytes) / Math.log(k))
        return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i]
    }

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        })
    }

    return (
        <DocumentContainer>
            <DocumentTitle>📚 Gerenciar Documentos</DocumentTitle>

            {message && (
                message.type === 'success' ? (
                    <SuccessMessage>{message.text}</SuccessMessage>
                ) : (
                    <ErrorMessage>{message.text}</ErrorMessage>
                )
            )}

            <UploadSection>
                <UploadForm onSubmit={handleUpload}>
                    <InputWrapper>
                        <label htmlFor="file">📄 Selecione um arquivo (PDF, TXT, MD)</label>
                        <input
                            id="file"
                            type="file"
                            accept=".pdf,.txt,.md"
                            onChange={(e) => setFile(e.target.files?.[0] || null)}
                            disabled={loading}
                        />
                    </InputWrapper>
                    <UploadButton type="submit" disabled={!file || loading}>
                        {loading ? (
                            <>
                                <LoadingSpinner /> Uploadando...
                            </>
                        ) : (
                            '📤 Upload'
                        )}
                    </UploadButton>
                </UploadForm>
            </UploadSection>

            <DocumentListSection>
                {documents.length === 0 ? (
                    <EmptyState>
                        <p>📭 Nenhum documento enviado ainda</p>
                        <p style={{ fontSize: '0.875rem', marginTop: '0.5rem' }}>
                            Envie seus primeiros documentos acima
                        </p>
                    </EmptyState>
                ) : (
                    <>
                        <h3 style={{ color: '#374151', marginBottom: '1rem' }}>
                            📂 {documents.length} documento(s) enviado(s)
                        </h3>
                        <DocumentList>
                            {documents.map((doc) => (
                                <DocumentCard key={doc.id}>
                                    <DocumentName title={doc.filename}>📄 {doc.filename}</DocumentName>
                                    <DocumentInfo>
                                        <p>Tipo: {doc.file_type}</p>
                                        <p>Tamanho: {formatFileSize(doc.file_size)}</p>
                                        <p>Data: {formatDate(doc.created_at)}</p>
                                    </DocumentInfo>
                                    <DocumentActions>
                                        <ViewButton disabled>👁️ Visualizar</ViewButton>
                                        <DeleteButton
                                            onClick={() => handleDelete(doc.id, doc.filename)}
                                            disabled={loading}
                                        >
                                            🗑️ Deletar
                                        </DeleteButton>
                                    </DocumentActions>
                                </DocumentCard>
                            ))}
                        </DocumentList>
                    </>
                )}
            </DocumentListSection>
        </DocumentContainer>
    )
}