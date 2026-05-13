# Feature Specification: Criar Estrutura Base do Reminders Service

**Feature Branch**: `005-reminders-service-base`

**Created**: 2026-05-13

**Status**: Draft

**Input**: User description: "[Issue #6] [M-5] Criar estrutura base do reminders-service (Node.js) — novo microsserviço independente responsável por armazenar e recuperar lembretes do usuário."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Serviço responde a requisições básicas (Priority: P1)

Um desenvolvedor sobe o reminders-service isoladamente e verifica que está operacional.

**Why this priority**: Critério mínimo de existência do serviço.

**Independent Test**: Subir apenas o reminders-service e consultar seu health check.

**Acceptance Scenarios**:

1. **Given** o reminders-service está rodando, **When** um cliente consulta o health check, **Then** recebe confirmação de que o serviço está operacional.
2. **Given** o reminders-service está parado, **When** um cliente tenta se conectar, **Then** recebe erro de conexão.

---

### User Story 2 - Usuário cria e consulta lembretes (Priority: P2)

Um usuário registra um lembrete com texto e data/hora e consegue consultá-lo posteriormente.

**Why this priority**: Criar e consultar lembretes é a responsabilidade central do serviço.

**Independent Test**: Registrar um lembrete e verificá-lo na listagem via serviço isolado.

**Acceptance Scenarios**:

1. **Given** o serviço está operacional, **When** um cliente registra um lembrete com texto e data/hora, **Then** o lembrete é persistido e retornado com identificador único.
2. **Given** existem lembretes cadastrados, **When** um cliente lista os lembretes, **Then** recebe todos os lembretes com seus dados completos.
3. **Given** um lembrete inexistente, **When** um cliente busca pelo identificador, **Then** recebe resposta de recurso não encontrado.

---

### Edge Cases

- O que acontece com lembretes para datas no passado?
- Como o serviço lida com texto de lembrete vazio?
- O que acontece quando o banco de dados não está disponível na inicialização?

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: O reminders-service DEVE ser executável de forma independente, sem depender de outros microsserviços.
- **FR-002**: O reminders-service DEVE expor um endpoint de verificação de saúde.
- **FR-003**: O reminders-service DEVE permitir criar, listar e consultar lembretes individualmente.
- **FR-004**: O reminders-service DEVE persistir lembretes em banco de dados próprio.
- **FR-005**: O reminders-service DEVE validar campos obrigatórios e retornar erros claros.
- **FR-006**: O reminders-service DEVE ser executável via Docker.

### Key Entities

- **Lembrete (Reminder)**: Registro de lembrete com texto, data/hora agendada, data de criação e message_id de origem.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: O reminders-service sobe e responde ao health check em menos de 5 segundos.
- **SC-002**: 100% das operações de criação e listagem de lembretes funcionam em ambiente isolado.
- **SC-003**: Requisições com dados inválidos retornam erros em menos de 500ms.
- **SC-004**: O serviço pode ser inicializado com um único comando.

## Assumptions

- O reminders-service terá seu próprio banco de dados, não compartilhado com outros serviços.
- Autenticação e autorização são responsabilidade do api-gateway.
- Notificações push ou e-mail estão fora do escopo desta issue (apenas armazenamento).
- Os endpoints seguem convenções REST padrão do projeto.
