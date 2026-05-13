# Feature Specification: Criar Estrutura Base do Medical Service

**Feature Branch**: `003-medical-service-base`

**Created**: 2026-05-13

**Status**: Draft

**Input**: User description: "[Issue #4] [M-3] Criar estrutura base do medical-service (PHP) — novo microsserviço independente responsável por gerenciar medicamentos e consultas médicas do usuário."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Serviço responde a requisições básicas (Priority: P1)

Um desenvolvedor sobe o medical-service isoladamente e consegue verificar que ele está operacional, sem depender de nenhum outro serviço do Mosaic.

**Why this priority**: Critério mínimo de existência do serviço. Um serviço que não sobe isoladamente bloqueia todo desenvolvimento médico downstream.

**Independent Test**: Subir apenas o medical-service e consultar seu endpoint de health check sem outros serviços ativos.

**Acceptance Scenarios**:

1. **Given** o medical-service está rodando, **When** um cliente consulta o endpoint de saúde, **Then** recebe confirmação de que o serviço está operacional.
2. **Given** o medical-service está parado, **When** um cliente tenta se conectar, **Then** recebe erro de conexão (comportamento esperado).

---

### User Story 2 - Serviço gerencia medicamentos (Priority: P2)

Um usuário consegue registrar um medicamento com nome, dosagem e frequência, e consultá-lo posteriormente.

**Why this priority**: Gerenciar medicamentos é a responsabilidade central do medical-service.

**Independent Test**: Registrar um medicamento e verificar que aparece na listagem, tudo via medical-service isolado.

**Acceptance Scenarios**:

1. **Given** o serviço está operacional, **When** um cliente registra um medicamento com nome, dosagem e frequência, **Then** o medicamento é persistido e retornado com identificador único.
2. **Given** existem medicamentos cadastrados, **When** um cliente lista os medicamentos, **Then** recebe todos os medicamentos registrados.
3. **Given** um medicamento inexistente, **When** um cliente busca pelo identificador, **Then** recebe resposta de recurso não encontrado.

---

### User Story 3 - Serviço gerencia consultas médicas (Priority: P3)

Um usuário consegue registrar uma consulta médica com data, médico e especialidade.

**Why this priority**: Consultas complementam o escopo médico do serviço.

**Independent Test**: Registrar uma consulta e verificar que aparece na listagem de consultas.

**Acceptance Scenarios**:

1. **Given** o serviço está operacional, **When** um cliente registra uma consulta com data, médico e especialidade, **Then** a consulta é persistida e retornada com identificador único.
2. **Given** existem consultas cadastradas, **When** um cliente lista as consultas, **Then** recebe todas as consultas com dados completos.

---

### Edge Cases

- O que acontece quando o banco de dados não está disponível na inicialização?
- Como o serviço lida com nomes de medicamentos duplicados?
- O que acontece com consultas agendadas para datas no passado?

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: O medical-service DEVE ser executável de forma independente, sem depender de outros microsserviços em tempo de execução.
- **FR-002**: O medical-service DEVE expor um endpoint de verificação de saúde.
- **FR-003**: O medical-service DEVE permitir criar, listar e consultar medicamentos individualmente.
- **FR-004**: O medical-service DEVE permitir criar, listar e consultar consultas médicas individualmente.
- **FR-005**: O medical-service DEVE persistir medicamentos e consultas em banco de dados relacional próprio.
- **FR-006**: O medical-service DEVE validar campos obrigatórios e retornar erros claros quando ausentes.
- **FR-007**: O medical-service DEVE ser executável via Docker.

### Key Entities

- **Medicamento (Medicine)**: Registro de medicamento com nome, dosagem, frequência e message_id de origem.
- **Consulta (Appointment)**: Registro de consulta médica com data, médico, especialidade e notas.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: O medical-service sobe e responde ao health check em menos de 5 segundos após o start.
- **SC-002**: 100% das operações de criação e listagem de medicamentos e consultas funcionam em ambiente isolado.
- **SC-003**: Requisições com dados inválidos retornam erros em menos de 500ms.
- **SC-004**: O serviço pode ser inicializado com um único comando.

## Assumptions

- O medical-service terá seu próprio banco de dados, não compartilhado com outros serviços.
- Autenticação e autorização são responsabilidade do api-gateway.
- Os endpoints seguem convenções REST padrão já adotadas no projeto.
- A migração de dados do monólito está fora do escopo desta issue.
- O serviço expõe API REST para manter consistência com os demais serviços.
