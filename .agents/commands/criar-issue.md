# Criar Issue para o Mosaic

Crie uma ou mais issues no repositório **e3duardo/mosaic** seguindo rigorosamente as regras abaixo.

## Contexto do projeto

O Mosaic é um assistente pessoal com arquitetura de microsserviços. A desenvolvedora principal das issues é **júnior**, com pouca experiência. Toda issue deve ser extremamente detalhada, didática e guiada — como se fosse uma aula, não apenas uma tarefa.

## Regras obrigatórias

### Idioma
- Todo o conteúdo das issues (título e corpo) deve ser escrito em **português (pt-BR)**
- Nomes de labels, branches e comandos técnicos permanecem em inglês

### Tom e nível de detalhe
- Escreva como se a pessoa nunca tivesse feito aquilo antes
- Explique o **porquê** de cada passo, não só o **o quê**
- Use analogias do mundo real para explicar conceitos técnicos
- Não poupe palavras — prolixidade é bem-vinda aqui
- Inclua diagramas ASCII sempre que ajudar a visualizar a arquitetura ou o fluxo

### Estrutura obrigatória de cada issue

```
## Contexto
<explique por que essa tarefa existe e qual problema resolve>

## O que é <conceito envolvido>? (se for algo não óbvio)
<explicação didática com analogia ou diagrama ASCII>

## Estrutura / Diagrama (quando aplicável)
<diagrama ASCII mostrando pastas, fluxo, arquitetura>

## Passo a passo
<passos numerados, com comandos prontos para copiar e colar>
<inclua exemplos de código completos, não fragmentos>

## Como testar
<comandos curl ou instruções para verificar que funcionou>

## Critérios de aceite
- [ ] item verificável 1
- [ ] item verificável 2

## Dicas
- arquivos relevantes para consultar
- armadilhas comuns a evitar
- links de documentação em português quando disponível
```

### Labels disponíveis
Use apenas labels existentes no repositório:
- `api-gateway` — serviço Go gateway
- `financial` — serviço financeiro Go
- `medical` — serviço médico PHP
- `ideas` — serviço de ideias C#
- `reminders` — serviço de lembretes Node.js
- `processor` — serviço Python de IA
- `frontend` — React/TypeScript
- `infra` — Docker, docker-compose, banco
- `good first issue` — tarefas simples, bom ponto de entrada
- `test` — testes unitários ou de integração
- `refactor` — refatoração de código
- `bug` — correção de problema existente
- `enhancement` — nova funcionalidade
- `documentation` — documentação

### Projeto GitHub
Após criar cada issue, adicione-a ao projeto **2** do usuário e3duardo:
```bash
gh issue create --title "..." --label "..." --body "..." 
# anote o número da issue criada, depois:
gh project item-add 2 --owner e3duardo --url https://github.com/e3duardo/mosaic/issues/<número>
```

### Arquitetura do projeto (referência)
```
frontend (React :5173)
    ↓
api-gateway (Go :8080)        ← mensagens, WebSocket, proxy
    ├── financial-service (Go :8081)
    ├── medical-service   (PHP :8082)
    ├── ideas-service     (C# :8083)
    └── reminders-service (Node.js :8084)
processor (Python :8000)      ← classificação LLM
postgres  (schemas separados por serviço)
ollama    (LLM local)
```

Schemas do banco: `financial`, `medical`, `ideas`, `reminders`, `public` (mensagens).

### Arquivos-chave para referência nas dicas
- `api/cmd/main.go` — gateway, registro de rotas
- `api/internal/models/models.go` — modelos GORM
- `api/internal/database/database.go` — conexão com banco
- `processor/app/ollama_client.py` — lógica de classificação LLM
- `processor/app/routes.py` — endpoint /process
- `frontend/src/api/client.ts` — cliente HTTP do frontend
- `frontend/src/hooks/useMessagesWebSocket.ts` — WebSocket
- `docker-compose.yml` — orquestração de todos os serviços

## Como usar este comando

Descreva a issue que quer criar. Exemplos:

- `/criar-issue adicionar filtro por data nos endpoints financeiros`
- `/criar-issue escrever testes para o medical-service`
- `/criar-issue página de configurações no frontend`

Se o argumento for vago, explore o código relevante antes de escrever a issue para garantir que os arquivos e dicas sejam precisos.
