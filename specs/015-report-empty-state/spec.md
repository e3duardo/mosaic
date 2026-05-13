# Feature Specification: Estado Vazio nas Páginas de Relatório

**Feature Branch**: `015-report-empty-state`

**Created**: 2026-05-13

**Status**: Draft

**Input**: User description: "[Issue #19] Adicionar estado vazio quando não há dados nas páginas de relatório — em vez de mostrar uma página em branco ou tabela sem linhas, exibir uma mensagem amigável orientando o usuário."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Novo usuário entende o que fazer ao ver página vazia (Priority: P1)

Um usuário que acabou de começar a usar o Mosaic acessa a página de relatório financeiro e, em vez de ver uma tabela vazia, vê uma mensagem que explica que ainda não há dados e orienta como começar.

**Why this priority**: Uma página vazia sem contexto é confusa. O usuário pode achar que há um bug ou que a aplicação não funciona. O empty state transforma isso numa oportunidade de onboarding.

**Independent Test**: Acessar cada página de relatório sem dados cadastrados e verificar que uma mensagem orientativa aparece.

**Acceptance Scenarios**:

1. **Given** não há dados de nenhuma categoria, **When** o usuário acessa qualquer página de relatório, **Then** vê uma mensagem clara indicando que não há dados ainda e como registrar o primeiro item.
2. **Given** o usuário exclui todos os registros de uma categoria, **When** acessa a página de relatório correspondente, **Then** vê o estado vazio (não uma tabela com zero linhas).
3. **Given** existem dados em uma categoria mas não em outra, **When** o usuário acessa a página da categoria sem dados, **Then** vê o estado vazio apenas nela.

---

### User Story 2 - Estado vazio é consistente em todas as páginas de relatório (Priority: P2)

Todas as 4 páginas de relatório (financeiro, medicamentos, ideias, lembretes) exibem um estado vazio com estilo consistente.

**Why this priority**: Inconsistência de UX entre páginas prejudica a experiência e transmite falta de cuidado.

**Independent Test**: Verificar empty state nas 4 páginas com zero dados em cada.

**Acceptance Scenarios**:

1. **Given** nenhuma das categorias tem dados, **When** o usuário navega pelas páginas de relatório, **Then** todas exibem empty state com estilo visual consistente.

---

### Edge Cases

- O que mostrar quando os dados estão carregando vs quando de fato não há dados? (não confundir com skeleton)
- O empty state deve ter um botão/link de ação ou apenas texto?

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Todas as páginas de relatório DEVEM exibir estado vazio quando não houver dados para a categoria correspondente.
- **FR-002**: O estado vazio DEVE incluir uma mensagem explicando que não há dados e orientando como registrar o primeiro item.
- **FR-003**: O estado vazio DEVE ser visualmente distinto do estado de carregamento (skeleton) — não devem ser confundidos.
- **FR-004**: O estado vazio DEVE ter estilo visual consistente entre as 4 páginas de relatório.
- **FR-005**: O estado vazio DEVE aparecer apenas após a confirmação de que não há dados (não durante o carregamento).

### Key Entities

- **Estado Vazio (Empty State)**: Componente visual exibido quando uma lista ou relatório não possui itens.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% das páginas de relatório exibem empty state quando não há dados.
- **SC-002**: Em testes de usabilidade, usuários novos entendem o que fazer ao ver o empty state sem ajuda externa.
- **SC-003**: O empty state nunca é exibido durante o carregamento dos dados (somente após confirmação de lista vazia).
- **SC-004**: O visual do empty state é consistente em todas as páginas (mesmo componente base ou mesmo padrão de design).

## Assumptions

- O empty state é um componente de apresentação puro — não requer lógica de backend.
- A mensagem orientativa pode mencionar como registrar itens (ex: "Envie uma mensagem descrevendo sua despesa").
- Esta feature é independente do skeleton (Issue #18) mas complementar — ambos podem ser desenvolvidos separadamente.
- Um ícone ou ilustração simples pode ser incluído no empty state para torná-lo mais amigável.
