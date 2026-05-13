# Feature Specification: Atualizar README com Nova Arquitetura de Microsserviços

**Feature Branch**: `008-update-readme-microservices`

**Created**: 2026-05-13

**Status**: Draft

**Input**: User description: "[Issue #11] [M-10] Atualizar README com a nova arquitetura de microsserviços — refletir a arquitetura alvo no README principal do projeto."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Novo colaborador entende o projeto pelo README (Priority: P1)

Um desenvolvedor que acessa o repositório pela primeira vez lê o README e entende a arquitetura atual, os serviços planejados e como rodar o projeto localmente.

**Why this priority**: O README é o primeiro ponto de contato. Um README desatualizado gera confusão e onboarding ineficiente.

**Independent Test**: Pedir a alguém que nunca viu o projeto para ler apenas o README e explicar a arquitetura. Deve conseguir nomear os serviços, linguagens e como iniciar o ambiente.

**Acceptance Scenarios**:

1. **Given** o README está atualizado, **When** um novo colaborador o lê, **Then** consegue identificar todos os microsserviços planejados, suas linguagens e responsabilidades.
2. **Given** o README está atualizado, **When** um colaborador quer rodar o projeto localmente, **Then** encontra comandos claros e funcionais para subir o ambiente.
3. **Given** o README descreve a arquitetura alvo, **When** um colaborador lê a seção de status, **Then** entende o que já está implementado versus o que ainda está planejado.

---

### Edge Cases

- O README deve cobrir tanto o estado atual (monólito) quanto o estado alvo (microsserviços)?
- Como indicar claramente quais serviços já existem e quais são planejados?

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: O README DEVE descrever a arquitetura alvo de microsserviços com todos os 6 serviços (api-gateway, financial-service, medical-service, ideas-service, reminders-service, processor).
- **FR-002**: O README DEVE incluir um diagrama de arquitetura mostrando as relações entre serviços.
- **FR-003**: O README DEVE indicar o status de cada serviço (implementado / em desenvolvimento / planejado).
- **FR-004**: O README DEVE conter instruções atualizadas para rodar o projeto localmente (Docker e desenvolvimento direto).
- **FR-005**: O README DEVE descrever as variáveis de ambiente relevantes de cada serviço.

### Key Entities

- **README.md**: Documento de entrada do repositório, visível na página inicial do GitHub.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Um novo colaborador consegue entender a arquitetura e rodar o projeto em menos de 15 minutos lendo apenas o README.
- **SC-002**: 100% dos serviços da arquitetura alvo estão mencionados com linguagem e responsabilidade.
- **SC-003**: Os comandos de setup no README funcionam sem erros em ambiente limpo.

## Assumptions

- O README será o documento principal; detalhes técnicos profundos ficam em documentação separada (coberta pela Issue #1).
- Diagramas serão representados em texto (ASCII ou Mermaid) para não depender de ferramentas externas.
- O README cobre o ambiente Docker como caminho principal de desenvolvimento.
