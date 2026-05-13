# Feature Specification: Tratar Timeout do Processor com Resposta de Erro Amigável

**Feature Branch**: `010-processor-timeout-handling`

**Created**: 2026-05-13

**Status**: Draft

**Input**: User description: "[Issue #14] Tratar timeout do processor com resposta de erro amigável — quando o processor (LLM) demorar mais do que o esperado, o usuário deve receber uma mensagem clara de erro em vez de a requisição travar indefinidamente."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Usuário recebe feedback quando o processamento demora demais (Priority: P1)

Um usuário envia uma mensagem e, se o processador LLM não responder dentro de um tempo razoável, vê uma mensagem de erro clara na interface informando o problema, sem a tela travar.

**Why this priority**: Sem tratamento de timeout, o usuário fica com a interface bloqueada indefinidamente, sem saber se deve esperar ou recarregar a página. É a pior experiência possível.

**Independent Test**: Simular lentidão ou indisponibilidade do processor e verificar que o frontend exibe uma mensagem de erro amigável dentro do tempo limite configurado.

**Acceptance Scenarios**:

1. **Given** o processor não responde dentro do tempo limite, **When** o usuário aguarda o processamento de uma mensagem, **Then** recebe uma mensagem de erro clara informando que o processamento está demorando e pode tentar novamente.
2. **Given** o timeout ocorreu, **When** o usuário verifica a lista de mensagens, **Then** a mensagem aparece com status de erro (não fica "processando" para sempre).
3. **Given** o processor volta a funcionar, **When** o usuário tenta novamente, **Then** a mensagem é processada normalmente.

---

### Edge Cases

- O que acontece se o processor retorna parcialmente antes do timeout?
- Como tratar timeouts intermitentes (processor lento, não completamente fora)?
- O timeout deve ser configurável ou fixo?

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: O sistema DEVE definir um tempo limite máximo para respostas do processor.
- **FR-002**: Quando o tempo limite for atingido, o sistema DEVE cancelar a requisição pendente ao processor.
- **FR-003**: A mensagem DEVE ser marcada com status de erro quando o timeout ocorrer.
- **FR-004**: O frontend DEVE exibir uma mensagem de erro amigável (não técnica) quando o timeout ocorrer.
- **FR-005**: O frontend DEVE receber a atualização de status de erro via WebSocket para refletir o timeout em tempo real.
- **FR-006**: O sistema NÃO DEVE bloquear outras requisições enquanto uma está em timeout.

### Key Entities

- **Status de Mensagem**: Estado do processamento (processando, concluído, erro).
- **Tempo Limite**: Duração máxima permitida para o processor responder.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: O usuário recebe feedback de erro em no máximo 30 segundos após enviar uma mensagem quando o processor não responde.
- **SC-002**: 100% das requisições em timeout resultam em mensagem com status de erro visível no frontend.
- **SC-003**: Nenhuma mensagem fica presa em estado "processando" indefinidamente após um timeout.
- **SC-004**: A mensagem de erro exibida ao usuário é compreensível por uma pessoa não técnica.

## Assumptions

- O tempo limite padrão será 30 segundos (configurável via variável de ambiente).
- A mensagem de erro não será automaticamente reenviada ao processor; o usuário decide se tenta novamente.
- O tratamento de timeout é responsabilidade do api-gateway, não do frontend.
- O processor em si não precisa ser alterado para esta feature — apenas o api-gateway.
