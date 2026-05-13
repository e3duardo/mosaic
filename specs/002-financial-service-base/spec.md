# Feature Specification: Criar Estrutura Base do Financial Service

**Feature Branch**: `002-financial-service-base`

**Created**: 2026-05-13

**Status**: Draft

**Input**: User description: "[Issue #2] [M-1] Criar estrutura base do financial-service (Go) — novo microsserviço independente responsável por gerenciar despesas e receitas do usuário."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Serviço responde a requisições básicas (Priority: P1)

Um desenvolvedor sobe o financial-service isoladamente e consegue fazer requisições HTTP para verificar que ele está funcionando, sem depender de nenhum outro serviço do Mosaic.

**Why this priority**: Um serviço que não sobe ou não responde sozinho bloqueia todo o desenvolvimento downstream. É o critério mínimo de existência do serviço.

**Independent Test**: Pode ser validado subindo apenas o financial-service (sem api-gateway, sem outros serviços) e consultando seu endpoint de health check.

**Acceptance Scenarios**:

1. **Given** o financial-service está rodando, **When** um cliente faz uma requisição ao endpoint de verificação de saúde, **Then** recebe uma resposta indicando que o serviço está operacional.
2. **Given** o financial-service está parado, **When** um cliente tenta se conectar, **Then** recebe um erro de conexão recusada (comportamento esperado de serviço inativo).

---

### User Story 2 - Serviço gerencia despesas (Priority: P2)

Um usuário consegue registrar uma despesa e consultá-la posteriormente através do financial-service.

**Why this priority**: Gerenciar despesas é a responsabilidade central do serviço. Sem isso o serviço não entrega valor.

**Independent Test**: Pode ser validado registrando uma despesa via API e verificando que ela aparece na listagem subsequente.

**Acceptance Scenarios**:

1. **Given** o financial-service está rodando com banco de dados disponível, **When** um cliente envia uma nova despesa com valor, descrição e data, **Then** a despesa é persistida e retornada com um identificador único.
2. **Given** existem despesas cadastradas, **When** um cliente lista as despesas, **Then** recebe todas as despesas registradas com seus dados completos.
3. **Given** uma despesa inexistente, **When** um cliente tenta buscá-la pelo identificador, **Then** recebe uma resposta indicando que o recurso não foi encontrado.

---

### User Story 3 - Serviço gerencia receitas (Priority: P3)

Um usuário consegue registrar uma receita e consultá-la, de forma análoga ao gerenciamento de despesas.

**Why this priority**: Receitas complementam o escopo financeiro. Têm prioridade menor que despesas pois o comportamento é análogo.

**Independent Test**: Pode ser validado registrando uma receita e verificando que ela aparece na listagem de receitas.

**Acceptance Scenarios**:

1. **Given** o serviço está operacional, **When** um cliente registra uma receita com valor, descrição e data, **Then** a receita é persistida e retornada com identificador único.
2. **Given** existem receitas cadastradas, **When** um cliente lista as receitas, **Then** recebe todas as receitas com seus dados completos.

---

### Edge Cases

- O que acontece quando o banco de dados não está disponível na inicialização do serviço?
- Como o serviço responde quando recebe um payload com campos obrigatórios ausentes?
- O que acontece quando o valor de uma despesa/receita é negativo ou zero?

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: O financial-service DEVE ser executável de forma independente, sem depender de outros microsserviços do Mosaic em tempo de execução.
- **FR-002**: O financial-service DEVE expor um endpoint de verificação de saúde que retorna o status operacional do serviço.
- **FR-003**: O financial-service DEVE permitir criar, listar e consultar despesas individualmente.
- **FR-004**: O financial-service DEVE permitir criar, listar e consultar receitas individualmente.
- **FR-005**: O financial-service DEVE persistir despesas e receitas em banco de dados relacional.
- **FR-006**: O financial-service DEVE validar os campos obrigatórios de despesas e receitas (valor, descrição, data) e retornar erros claros quando ausentes ou inválidos.
- **FR-007**: O financial-service DEVE ser executável via Docker para facilitar o desenvolvimento local e o deploy.

### Key Entities

- **Despesa (Expense)**: Registro de saída financeira com valor, descrição, data e categoria.
- **Receita (Earning)**: Registro de entrada financeira com valor, descrição e data.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: O financial-service sobe e responde ao health check em menos de 5 segundos após o start.
- **SC-002**: 100% das operações de criação e listagem de despesas e receitas funcionam corretamente em ambiente isolado (sem outros serviços).
- **SC-003**: Requisições com dados inválidos retornam respostas de erro em menos de 500ms.
- **SC-004**: O serviço pode ser inicializado com um único comando (ex: via Docker ou script de setup).

## Assumptions

- O financial-service terá seu próprio banco de dados, não compartilhado com outros serviços.
- A autenticação e autorização são responsabilidade do api-gateway; o financial-service confia nas requisições que chegam.
- Os endpoints seguem convenções REST padrão já adotadas no projeto.
- A migração dos dados existentes no monólito para o novo serviço está fora do escopo desta issue (coberta pela Issue #3).
- O serviço expõe uma API REST (não gRPC ou GraphQL) para manter consistência com o padrão atual do projeto.
