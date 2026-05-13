# Feature Specification: Reconexão Automática do WebSocket

**Feature Branch**: `016-websocket-auto-reconnect`

**Created**: 2026-05-13

**Status**: Draft

**Input**: User description: "[Issue #20] Reconexão automática do WebSocket quando a conexão cair — quando o WebSocket desconectar (servidor reiniciou, rede instável, computador voltou do modo de espera), o frontend deve tentar reconectar automaticamente com backoff progressivo."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Usuário continua recebendo atualizações após queda de conexão (Priority: P1)

Um usuário está com o Mosaic aberto quando o servidor reinicia ou a rede cai brevemente. Após alguns segundos, a conexão é restaurada automaticamente e o usuário volta a receber atualizações em tempo real sem precisar recarregar a página.

**Why this priority**: Sem reconexão automática, qualquer instabilidade de rede transforma o usuário em observador passivo de uma tela desatualizada. É a funcionalidade mais impactante para a confiabilidade percebida do produto.

**Independent Test**: Conectar ao frontend, desligar o servidor por 5 segundos, religar, e verificar que as atualizações voltam a aparecer sem o usuário fazer nada.

**Acceptance Scenarios**:

1. **Given** o WebSocket está conectado, **When** a conexão cai (servidor reinicia ou rede cai), **Then** o frontend tenta reconectar automaticamente após um intervalo.
2. **Given** a reconexão falhou, **When** o intervalo de espera passa, **Then** o frontend tenta novamente com um intervalo maior (backoff progressivo).
3. **Given** o servidor volta a ficar disponível, **When** o frontend tenta reconectar, **Then** a conexão é restabelecida e as atualizações voltam a chegar normalmente.
4. **Given** o WebSocket reconectou com sucesso, **When** uma nova mensagem é enviada, **Then** o usuário vê a atualização em tempo real como antes.

---

### User Story 2 - Usuário sabe quando está desconectado (Priority: P2)

Enquanto o WebSocket está desconectado e tentando reconectar, o usuário vê algum indicador visual informando que a conexão está sendo restabelecida.

**Why this priority**: Sem feedback visual, o usuário não sabe se a aplicação está funcionando ou travada durante a reconexão.

**Independent Test**: Derrubar a conexão WebSocket e verificar que aparece um indicador de "reconectando" na interface.

**Acceptance Scenarios**:

1. **Given** o WebSocket está desconectado, **When** o frontend está tentando reconectar, **Then** um indicador visual informa ao usuário que a conexão está sendo restabelecida.
2. **Given** a reconexão foi bem-sucedida, **When** a conexão volta, **Then** o indicador visual desaparece e a interface volta ao estado normal.

---

### Edge Cases

- O que acontece se o usuário ficar offline por muito tempo (ex: várias horas)? Deve parar de tentar ou continuar indefinidamente?
- Como tratar o caso de o usuário fechar a aba e reabrir — deve reconectar imediatamente?
- O que acontece com mensagens enviadas durante a desconexão?

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: O frontend DEVE detectar automaticamente quando o WebSocket é desconectado.
- **FR-002**: O frontend DEVE tentar reconectar automaticamente após a desconexão, com delays progressivos (ex: 3s, 5s, 10s, 30s).
- **FR-003**: O frontend DEVE limitar as tentativas de reconexão para não sobrecarregar o servidor (ex: parar após N tentativas ou após tempo máximo).
- **FR-004**: O frontend DEVE exibir um indicador visual quando a reconexão está em andamento.
- **FR-005**: O frontend DEVE remover o indicador visual e retomar atualizações normalmente após reconexão bem-sucedida.
- **FR-006**: O frontend NÃO DEVE tentar reconectar quando o usuário fechar a aba intencionalmente.

### Key Entities

- **Estado de Conexão**: Situação atual do WebSocket (conectado / desconectado / reconectando).
- **Backoff Progressivo**: Estratégia de aumentar o intervalo entre tentativas para não sobrecarregar o servidor.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: O frontend reconecta automaticamente em menos de 35 segundos após uma queda de conexão (3 tentativas com backoff).
- **SC-002**: 100% das desconexões involuntárias resultam em tentativas automáticas de reconexão.
- **SC-003**: O usuário vê feedback visual de "reconectando" em menos de 1 segundo após a desconexão.
- **SC-004**: Após reconexão bem-sucedida, as atualizações em tempo real voltam a funcionar sem necessidade de ação do usuário.

## Assumptions

- A reconexão é responsabilidade exclusiva do frontend (hook `useMessagesWebSocket`); o backend não precisa de alterações.
- O número máximo de tentativas antes de desistir será definido na implementação (sugestão: 4 tentativas com delays 3s, 5s, 10s, 30s).
- Após desistir de reconectar, o usuário precisa recarregar a página manualmente (exibir mensagem orientativa).
- A reconexão não tenta reenviar mensagens que foram enviadas durante a desconexão.
