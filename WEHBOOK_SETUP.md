# 🔗 Configuração do Webhook WhatsApp

## Evolution API Integration

### 1. Registrar Webhook na Evolution API

Após fazer deploy no Vercel, você precisa registrar o webhook:

```bash
curl -X POST https://evodevs.cordex.ai/webhook \
  -H "apikey: V0e3EBKbaJFnKREYfFCqOnoi904vAPV7" \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://seu-app.vercel.app/api/webhook",
    "events": ["messages.upsert", "connection.update"]
  }'
```

### 2. Testar Webhook (GET)

```bash
curl https://seu-app.vercel.app/api/webhook?challenge=test123
```

Deve retornar: `{"challenge":"test123"}`

### 3. Enviar Mensagem de Teste

```bash
curl -X POST https://seu-app.vercel.app/api/webhook \
  -H "Content-Type: application/json" \
  -d '{
    "data": {
      "key": {
        "remoteJid": "5585988888888"
      },
      "message": {
        "text": "Olá, como você está?"
      }
    }
  }'
```

## Fluxo de Funcionamento

1. Usuário envia mensagem no WhatsApp
2. Evolution API envia POST para `/api/webhook`
3. Sistema processa com IA + RAG
4. Resposta é enviada de volta via Evolution API

## Variáveis Necessárias

```
EVOLUTION_API_URL=https://evodevs.cordex.ai
EVOLUTION_API_KEY=V0e3EBKbaJFnKREYfFCqOnoi904vAPV7
EVOLUTION_INSTANCE=chat-rag (opcional, padrão será usado se omitido)
```

## Troubleshooting

- **Webhook não está recebendo mensagens**: Verifique se a URL está registrada
- **Erro ao enviar resposta**: Verifique se o número está correto
- **Mensagens muito lentas**: Pode ser gargalo do Open Router, adicione créditos
