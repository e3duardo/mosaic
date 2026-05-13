# Feature Specification: Criar Estrutura Base do Ideas Service

**Feature Branch**: `004-ideas-service-base`

**Created**: 2026-05-13

**Status**: Draft

**Input**: User description: "[Issue #5] [M-4] Criar estrutura base do ideas-service (C#) — novo microsserviço independente responsável por armazenar e recuperar ideias capturadas pelo usuário."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Serviço responde a requisições básicas (Priority: P1)

Um desenvolvedor sobe o ideas-service isoladamente e verifica que está operacional sem depender de outros serviços.

**Why this priority**: Critério mínimo de existência. Um serviço que não sobe isoladamente bloqueia o desenvolvimento.

**Independent Test**: Subir apenas o ideas-service e consultar seu health check.

**Acceptance Scenarios**:

1. **Given** o ideas-service está rodando, **When** um cliente consulta o endpoint de saúde, **Then** recebe confirmação de que o serviço está operacional.
2. **Given** o ideas-service está parado, **When** um cliente tenta se conectar, **Then** recebe erro de conexão.

---

### User Story 2 - Usuário registra e recupera ideias (Priority: P2)

Um usuário captura uma ideia com título e descrição e consegue consultá-la posteriormente.

**Why this priority**: Registrar e recuperar ideias é a responsabilidade central do serviço.

**Independent Test**: Registrar uma ideia e verificar que aparece na listagem via ideas-service isolado.

**Acceptance Scenarios**:

1. **Given** o serviço está operacional, **When** um cliente registra uma ideia com título e descrição, **Then** a ideia é persistida e retornada com identificador único e data de criação.
2. **Given** existem ideias cadastradas, **When** um cliente lista as ideias, **Then** recebe todas as ideias com seus dados completos.
3. **Given** uma ideia inexistente, **When** um cliente busca pelo identificador, **Then** recebe resposta de recurso não encontrado.

---

### Edge Cases

- O que acontece com ideias sem título ou sem descrição?
- Como o serviço lida com ideias duplicadas (mesmo título)?
- O que acontece quando o banco de dados não está disponível na inicialização?

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: O ideas-service DEVE ser executável de forma independente, sem depender de outros microsserviços.
- **FR-002**: O ideas-service DEVE expor um endpoint de verificação de saúde.
- **FR-003**: O ideas-service DEVE permitir criar, listar e consultar ideias individualmente.
- **FR-004**: O ideas-service DEVE persistir ideias em banco de dados relacional próprio.
- **FR-005**: O ideas-service DEVE validar campos obrigatórios e retornar erros claros.
- **FR-006**: O ideas-service DEVE ser executável via Docker.

### Key Entities

- **Ideia (Idea)**: Registro de ideia com título, descrição, data de criação e message_id de origem.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: O ideas-service sobe e responde ao health check em menos de 5 segundos.
- **SC-002**: 100% das operações de criação e listagem de ideias funcionam em ambiente isolado.
- **SC-003**: Requisições com dados inválidos retornam erros em menos de 500ms.
- **SC-004**: O serviço pode ser inicializado com um único comando.

## Assumptions

- O ideas-service terá seu próprio banco de dados, não compartilhado com outros serviços.
- Autenticação e autorização são responsabilidade do api-gateway.
- Os endpoints seguem convenções REST padrão do projeto.
- A migração de dados do monólito está fora do escopo desta issue.
