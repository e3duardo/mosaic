# Feature Specification: Skeleton de Carregamento nas Páginas de Relatório

**Feature Branch**: `014-report-skeleton-loading`

**Created**: 2026-05-13

**Status**: Draft

**Input**: User description: "[Issue #18] Adicionar skeleton de carregamento nas páginas de relatório — enquanto os dados estão sendo carregados, exibir placeholders animados no lugar do conteúdo para indicar que a página está carregando."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Usuário vê feedback visual durante o carregamento (Priority: P1)

Um usuário navega para a página de relatório financeiro e, em vez de ver uma tela em branco ou um spinner genérico, vê placeholders animados com a forma dos elementos que irão aparecer.

**Why this priority**: Uma tela em branco durante o carregamento gera incerteza — o usuário não sabe se a página está carregando ou travada. Skeletons comunicam que o conteúdo está a caminho.

**Independent Test**: Abrir a página de relatório com conexão lenta simulada e verificar que skeletons aparecem imediatamente antes dos dados reais.

**Acceptance Scenarios**:

1. **Given** o usuário navega para uma página de relatório, **When** os dados ainda estão sendo carregados, **Then** vê placeholders animados com formato similar ao conteúdo real (não uma tela em branco).
2. **Given** os dados terminam de carregar, **When** a resposta chega, **Then** os skeletons são substituídos pelos dados reais de forma suave, sem flash ou reposicionamento brusco.
3. **Given** o carregamento falha, **When** ocorre um erro, **Then** os skeletons são substituídos por uma mensagem de erro (não ficam girando para sempre).

---

### User Story 2 - Skeleton cobre todas as páginas de relatório (Priority: P2)

O skeleton está presente em todas as páginas de relatório existentes: financeiro, medicamentos, ideias e lembretes.

**Why this priority**: Inconsistência de UX entre páginas é confusa. Todas devem ter o mesmo comportamento.

**Independent Test**: Navegar para cada uma das 4 páginas de relatório com carregamento lento e verificar que todas exibem skeleton.

**Acceptance Scenarios**:

1. **Given** o usuário navega para qualquer página de relatório, **When** os dados estão carregando, **Then** vê skeletons independentemente de qual página é.

---

### Edge Cases

- O que acontece quando o carregamento é tão rápido que o skeleton mal aparece?
- O skeleton deve ser diferente por tipo de página (tabela vs cards) ou um design genérico serve?

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Todas as páginas de relatório (financeiro, medicamentos, ideias, lembretes) DEVEM exibir skeletons enquanto os dados estão sendo carregados.
- **FR-002**: Os skeletons DEVEM ter formato similar ao conteúdo que irão representar (linhas para texto, blocos para cards).
- **FR-003**: Os skeletons DEVEM ter animação indicando atividade (ex: shimmer/pulse).
- **FR-004**: Os skeletons DEVEM ser substituídos pelo conteúdo real quando os dados chegarem.
- **FR-005**: Os skeletons DEVEM ser substituídos por mensagem de erro quando o carregamento falhar.
- **FR-006**: Os skeletons NÃO DEVEM aparecer em carregamentos subsequentes se os dados já estão em cache local.

### Key Entities

- **Skeleton**: Placeholder visual animado que representa o formato do conteúdo durante o carregamento.
- **Estado de Carregamento**: Fase entre a requisição e a exibição dos dados.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Skeletons aparecem em menos de 100ms após a navegação para qualquer página de relatório.
- **SC-002**: 100% das páginas de relatório exibem skeleton durante o carregamento inicial.
- **SC-003**: A transição de skeleton para conteúdo real ocorre sem deslocamento brusco de layout (sem layout shift).
- **SC-004**: Usuários em testes de usabilidade percebem que a página está carregando (não travada) ao ver o skeleton.

## Assumptions

- As páginas de relatório já existem no frontend; esta feature adiciona apenas o estado de carregamento.
- O design do skeleton seguirá o sistema de design já existente no projeto.
- Carregamentos muito rápidos (< 200ms) podem não exibir skeleton para evitar flash desnecessário.
- Esta feature cobre apenas o carregamento inicial da página, não paginação ou atualizações incrementais.
