# Feature Specification: Endpoint DELETE /api/messages/:id

**Feature Branch**: `009-delete-message-endpoint`

**Created**: 2026-05-13

**Status**: Draft

**Input**: User description: "[Issue #13] Adicionar endpoint DELETE /api/messages/:id — permitir que o usuário exclua uma mensagem e todos os seus artefatos associados."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Usuário exclui uma mensagem (Priority: P1)

Um usuário quer remover uma mensagem que registrou incorretamente, e após excluir ela desaparece da interface e não volta mais.

**Why this priority**: É a funcionalidade central desta issue e entrega valor imediato ao usuário que cometeu um erro de entrada.

**Independent Test**: Criar uma mensagem, deletá-la via API e verificar que ela não aparece mais na listagem.

**Acceptance Scenarios**:

1. **Given** existe uma mensagem com ID válido, **When** o cliente envia uma requisição de exclusão para esse ID, **Then** a mensagem é removida e o cliente recebe confirmação de sucesso.
2. **Given** uma mensagem foi excluída, **When** o cliente lista as mensagens, **Then** a mensagem excluída não aparece na listagem.
3. **Given** um ID de mensagem inexistente, **When** o cliente tenta excluí-la, **Then** recebe resposta indicando que o recurso não foi encontrado.

---

### User Story 2 - Artefatos associados são removidos junto (Priority: P2)

Ao excluir uma mensagem, todos os artefatos gerados por ela (despesas, medicamentos, ideias, lembretes) também são removidos automaticamente.

**Why this priority**: Artefatos órfãos polui os relatórios e cria inconsistência de dados.

**Independent Test**: Criar uma mensagem que gera uma despesa, excluir a mensagem e verificar que a despesa desapareceu do relatório financeiro.

**Acceptance Scenarios**:

1. **Given** uma mensagem possui artefatos associados (ex: despesa), **When** a mensagem é excluída, **Then** os artefatos associados também são removidos e não aparecem nos relatórios.
2. **Given** uma mensagem foi excluída com seus artefatos, **When** o frontend recebe a atualização via WebSocket, **Then** os relatórios refletem a remoção imediatamente.

---

### Edge Cases

- O que acontece ao tentar excluir uma mensagem que está sendo processada no momento?
- Como tratar exclusão de mensagem com ID inválido (formato incorreto)?

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: O sistema DEVE expor o endpoint `DELETE /api/messages/:id`.
- **FR-002**: A exclusão DEVE remover a mensagem e todos os seus artefatos associados (despesas, receitas, medicamentos, consultas, ideias, lembretes) de forma atômica.
- **FR-003**: O endpoint DEVE retornar resposta de sucesso quando a mensagem for excluída.
- **FR-004**: O endpoint DEVE retornar resposta de recurso não encontrado quando o ID não existir.
- **FR-005**: Após a exclusão, o frontend DEVE receber atualização via WebSocket refletindo a remoção.

### Key Entities

- **Mensagem (Message)**: Registro de entrada do usuário com artefatos associados.
- **Artefatos**: Entidades geradas pelo processamento da mensagem (Expense, Earning, Medicine, Appointment, Idea, Reminder).

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A exclusão de uma mensagem e seus artefatos é concluída em menos de 1 segundo.
- **SC-002**: 100% dos artefatos associados a uma mensagem excluída são removidos na mesma operação.
- **SC-003**: O frontend reflete a exclusão via WebSocket em menos de 2 segundos após a operação.
- **SC-004**: Tentativas de excluir mensagens inexistentes retornam erro adequado em menos de 200ms.

## Assumptions

- A exclusão é permanente (sem soft delete / lixeira).
- A autenticação não está no escopo desta issue — o endpoint é acessível por qualquer cliente conectado.
- A atomicidade (excluir mensagem + artefatos na mesma transação) é garantida pelo banco de dados.
