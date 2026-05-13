# Feature Specification: Mover Carregamento de Arquivos de Configuração para o Startup do Processor

**Feature Branch**: `013-processor-config-startup-load`

**Created**: 2026-05-13

**Status**: Draft

**Input**: User description: "[Issue #17] Mover carregamento de arquivos de configuração para o startup do processor — os arquivos categories.txt, examples.txt e accounts.txt devem ser lidos uma vez na inicialização, não a cada requisição."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Processamento de mensagens é mais rápido (Priority: P1)

Um usuário envia uma mensagem e percebe que a resposta chega mais rapidamente, porque o processor não precisa mais ler arquivos do disco a cada requisição.

**Why this priority**: Ler arquivos do disco a cada requisição é um desperdício de I/O desnecessário. Esta mudança melhora a performance diretamente.

**Independent Test**: Medir o tempo médio de processamento de uma mensagem antes e depois da mudança. Deve haver redução mensurável.

**Acceptance Scenarios**:

1. **Given** o processor iniciou com sucesso, **When** chega a primeira requisição de processamento, **Then** os arquivos de configuração já estão em memória (não são lidos do disco neste momento).
2. **Given** um arquivo de configuração está ausente ou corrompido, **When** o processor tenta iniciar, **Then** falha na inicialização com mensagem de erro clara (não falha silenciosamente na primeira requisição).
3. **Given** o processor está rodando, **When** múltiplas requisições chegam em paralelo, **Then** todas usam a mesma cópia em memória dos arquivos de configuração sem conflito.

---

### Edge Cases

- O que acontece se um arquivo de configuração for modificado enquanto o processor está rodando?
- Como o processor se comporta se um arquivo opcional estiver ausente?

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Os arquivos `categories.txt`, `examples.txt` e `accounts.txt` DEVEM ser carregados uma única vez durante a inicialização do processor.
- **FR-002**: Se um arquivo obrigatório estiver ausente ou ilegível na inicialização, o processor DEVE falhar com mensagem de erro descritiva.
- **FR-003**: O processamento de requisições DEVE usar os dados já carregados em memória, sem acessar o disco.
- **FR-004**: O comportamento funcional do endpoint `/process` DEVE permanecer idêntico ao atual após a refatoração.

### Key Entities

- **Configuração em Memória**: Dados dos arquivos de configuração carregados e mantidos em memória durante toda a vida do processo.
- **Inicialização (Startup)**: Fase de carregamento do processor antes de aceitar requisições.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: O tempo médio de processamento de uma mensagem reduz em pelo menos 10% após a mudança (eliminação do I/O de disco por requisição).
- **SC-002**: O processor falha na inicialização (não em runtime) quando arquivos obrigatórios estão ausentes.
- **SC-003**: 100% dos testes existentes continuam passando após a refatoração.
- **SC-004**: O processor inicia em menos de 3 segundos mesmo com arquivos de configuração de tamanho normal.

## Assumptions

- Os arquivos de configuração não mudam enquanto o processor está rodando (não é necessário hot-reload).
- A refatoração é interna ao processor e não altera a interface da API (`/process`).
- `categories.txt` e `examples.txt` são obrigatórios; `accounts.txt` pode ser opcional.
- Esta mudança não altera o formato ou conteúdo dos arquivos de configuração.
