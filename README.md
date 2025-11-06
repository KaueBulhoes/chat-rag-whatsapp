# 🚀 Chat IA com RAG + WhatsApp

Um sistema completo de chat com inteligência artificial, retrieval-augmented generation (RAG) e integração WhatsApp via Evolution API.

**Link do Deploy**: [Será preenchido após deploy]

---

## 📋 Sobre o Projeto

Este é um teste fullstack que implementa:

- ✅ **Painel de Configurações** - Configure API Keys e modelos de IA
- ✅ **Sistema RAG** - Upload e gerenciamento de documentos
- ✅ **Chat Local** - Interface para testar com RAG
- ✅ **Integração WhatsApp** - Receba mensagens e responda automaticamente
- ✅ **Histórico de Conversas** - Tudo é armazenado em banco de dados

---

## 🛠️ Stack Tecnológico

### Frontend

- **React 18** + **TypeScript**
- **Vite** (build tool)
- **Styled Components** (CSS-in-JS)

### Backend

- **API Routes (Vercel)** (serverless)
- **Node.js**

### Banco de Dados

- **Supabase** (PostgreSQL gerenciado)

### Integrações

- **Open Router API** (múltiplos modelos de IA)
- **Evolution API** (WhatsApp)

---

## 🚀 Quick Start

### Pré-requisitos

- Node.js 18+
- Conta Supabase (gratuita em https://supabase.com)
- API Key Open Router (com créditos)
- Conta Evolution API

### 1. Clonar Repositório

```bash
git clone https://github.com/seu-usuario/chat-rag-whatsapp.git
cd chat-rag-whatsapp
```

### 2. Instalar Dependências

```bash
npm install
```

### 3. Configurar Variáveis de Ambiente

Crie arquivo `.env` na raiz:

```env
# Supabase
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua-chave-anon
SUPABASE_SERVICE_KEY=sua-service-key

# Evolution API (WhatsApp)
EVOLUTION_API_URL=https://evodevs.cordex.ai
EVOLUTION_API_KEY=sua-chave-evolution
EVOLUTION_INSTANCE=chat-rag

# Open Router (IA)
OPENROUTER_API_KEY=sk-or-v1-sua-chave
```

### 4. Rodar Localmente

```bash
npm install -g vercel
vercel dev
```

Acesse: **http://localhost:3000**

---

## 📚 Como Usar

### 1. Configurar Sistema

1. Preencha a **API Key do Open Router**
2. Escolha o **modelo de IA** (GPT-4, Claude, etc)
3. Configure o **System Prompt** (instruções para o AI)
4. Clique em **Salvar**

### 2. Upload de Documentos

1. Clique em **"Escolher arquivo"**
2. Selecione um arquivo PDF, TXT ou MD
3. Clique em **"Upload"**
4. Arquivo aparecerá na listagem

Os documentos serão usados como contexto (RAG) nas respostas.

### 3. Chat Local

1. Digite uma pergunta
2. Clique em **"Enviar"** (ou Enter)
3. IA respondará usando contexto dos documentos
4. Histórico é salvo automaticamente

### 4. WhatsApp (Após Deploy)

1. Configure webhook (veja `WEBHOOK_SETUP.md`)
2. Envie mensagens no WhatsApp
3. IA responderá automaticamente

---

## 📁 Estrutura de Pastas

```
chat-rag-whatsapp/
├── api/                          # API Routes (backend)
│   ├── config.ts                # Gerenciar configurações
│   ├── documents.ts             # Upload/listar/deletar docs
│   ├── chat.ts                  # Chat com RAG
│   ├── webhook.ts               # Webhook WhatsApp
│   └── db.ts                    # Conexão Supabase
│
├── src/
│   ├── components/              # Componentes React
│   │   ├── ConfigPanel.tsx
│   │   ├── ConfigPanel.styles.ts
│   │   ├── DocumentManager.tsx
│   │   ├── DocumentManager.styles.ts
│   │   ├── ChatInterface.tsx
│   │   └── ChatInterface.styles.ts
│   │
│   ├── styles/
│   │   └── App.styles.ts        # Estilos globais
│   │
│   ├── App.tsx                  # App principal
│   └── main.tsx                 # Entry point
│
├── sql/
│   └── schema.sql               # Migrações do banco
│
├── .env                         # Variáveis de ambiente
├── vercel.json                  # Configuração Vercel
├── package.json
├── tsconfig.json
├── vite.config.ts
├── README.md
├── PROCESSO.md
└── WEBHOOK_SETUP.md
```

---

## 🔑 Credenciais

### Supabase

Obtenha em: https://app.supabase.com

- Settings → API
- Copie `Project URL` e `anon public key`

### Open Router

Obtenha em: https://openrouter.ai

- Keys → Create new key
- Certifique-se de ter créditos ($5 inicial)

### Evolution API

Já fornecido:

```
URL: https://evodevs.cordex.ai
Key: V0e3EBKbaJFnKREYfFCqOnoi904vAPV7
```

---

## 🚀 Deploy no Vercel

### 1. Fazer Login

```bash
vercel login
```

### 2. Deploy

```bash
vercel deploy
```

### 3. Adicionar Variáveis de Ambiente

No dashboard Vercel:

1. Projeto → Settings → Environment Variables
2. Adicione todas as variáveis do `.env`

### 4. Registrar Webhook

Veja `WEBHOOK_SETUP.md` para instruções

---

## 📊 Banco de Dados

### Tabelas

**configs**

- id: Serial (PK)
- api_key_openrouter: String
- selected_model: String
- system_prompt: Text
- created_at, updated_at: Timestamp

**documents**

- id: Serial (PK)
- filename: String
- content: Text
- file_type: String
- file_size: Integer
- created_at: Timestamp

**conversations**

- id: Serial (PK)
- whatsapp_id: String
- user_message: Text
- ai_response: Text
- model_used: String
- documents_used: String[]
- created_at: Timestamp

---

## 🧪 Testes

### Testar Webhook Local

```bash
# GET
curl http://localhost:3000/api/webhook?challenge=test123

# POST (simular mensagem)
curl -X POST http://localhost:3000/api/webhook \
  -H "Content-Type: application/json" \
  -d '{
    "data": {
      "key": {"remoteJid": "5585988888888@s.whatsapp.net"},
      "message": {"text": "Teste"}
    }
  }'
```

---

## 🐛 Troubleshooting

### Erro: "API Key não configurada"

- Verifique se preencheu as Configurações
- Salve e recarregue a página

### Erro: "Insufficient credits"

- Open Router sem créditos
- Adicione método de pagamento em openrouter.ai

### Webhook não recebe mensagens

- Verifique se URL está registrada na Evolution API
- Confirme que deploy está ativo

### Documentos não usados no chat

- Certifique-se que fez upload
- Verifique se arquivo tem conteúdo válido

---

## 📝 Padrão de Commits

```bash
[AI] = Código gerado por IA (inclui prompt na descrição)
[MANUAL] = Ajuste manual
[REFACTOR] = Refatoração
```

Exemplo:

```bash
git commit -m "[AI] Add config handler" \
  -m "Prompt: Create API handler for configuration CRUD"
```

---

## 📚 Recursos Úteis

- [Documentação Supabase](https://supabase.com/docs)
- [Documentação Open Router](https://openrouter.ai/docs)
- [Documentação Evolution API](https://doc.evolution-api.com)
- [Documentação Vercel](https://vercel.com/docs)

---

## 📄 Licença

MIT License - veja LICENSE.md

---

## 👨‍💻 Autor

Desenvolvido como teste fullstack.

---

## 📞 Suporte

Para dúvidas ou problemas:

1. Verifique `PROCESSO.md`
2. Verifique `WEBHOOK_SETUP.md`
3. Abra uma issue no GitHub

---

**Status**: ✅ Completo e pronto para produção

Última atualização: 2025-01-06
