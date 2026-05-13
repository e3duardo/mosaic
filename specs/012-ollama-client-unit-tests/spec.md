# Feature Specification: Testes Unitários para ollama_client.py

**Feature Branch**: `012-ollama-client-unit-tests`

**Created**: 2026-05-13

**Status**: Draft

**Input**: User description: "[Issue #16] Escrever testes unitários para ollama_client.py — garantir que a lógica de comunicação com o Ollama está correta e que comportamentos de erro são tratados adequadamente."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Desenvolvedor verifica comportamento do cliente Ollama sem precisar do serviço rodando (Priority: P1)

Um desenvolvedor modifica o `ollama_client.py` e executa os testes unitários para verificar se a lógica continua correta, sem precisar ter o Ollama em execução.

**Why this priority**: Testes unitários são a primeira linha de defesa contra regressões. Sem eles, qualquer mudança no cliente pode quebrar o processamento silenciosamente.

**Independent Test**: Executar a suite de testes em ambiente sem Ollama instalado e verificar que todos passam.

**Acceptance Scenarios**:

1. **Given** os testes unitários estão implementados, **When** um desenvolvedor os executa sem o Ollama rodando, **Then** todos os testes passam (usando mocks do serviço externo).
2. **Given** uma modificação quebra a lógica de chamada ao Ollama, **When** os testes são executados, **Then** pelo menos um teste falha indicando a regressão.
3. **Given** o Ollama retorna um erro, **When** o cliente o processa, **Then** o teste verifica que o erro é tratado adequadamente (não propaga como exceção inesperada).

---

### User Story 2 - CI/CD executa os testes automaticamente (Priority: P2)

Os testes do `ollama_client.py` são executados automaticamente a cada push, garantindo que o pipeline detecte regressões antes do merge.

**Why this priority**: Testes só têm valor se executados consistentemente. Integração com CI elimina o risco de esquecer de rodar.

**Independent Test**: Fazer um push com uma mudança intencional que quebra o cliente e verificar que o pipeline falha.

**Acceptance Scenarios**:

1. **Given** os testes estão integrados ao pipeline, **When** um PR é aberto com uma regressão no ollama_client, **Then** o CI falha e bloqueia o merge.

---

### Edge Cases

- Como testar o comportamento quando o Ollama retorna resposta malformada?
- Como cobrir o caso de timeout de conexão?

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: DEVE existir uma suite de testes unitários cobrindo os comportamentos principais do `ollama_client.py`.
- **FR-002**: Os testes DEVEM executar sem dependência de serviços externos (Ollama, rede).
- **FR-003**: Os testes DEVEM cobrir: chamada bem-sucedida, erro de conexão, resposta malformada e timeout.
- **FR-004**: Os testes DEVEM ser executáveis com o mesmo comando de testes já existente no projeto (`pytest`).
- **FR-005**: Os testes DEVEM ser independentes entre si (sem estado compartilhado entre casos de teste).

### Key Entities

- **ollama_client.py**: Módulo responsável por se comunicar com o serviço Ollama e retornar resultados de classificação.
- **Caso de Teste**: Cenário isolado que verifica um comportamento específico do cliente.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Cobertura de testes de pelo menos 80% do código do `ollama_client.py`.
- **SC-002**: Todos os testes executam em menos de 5 segundos no total (sem I/O real).
- **SC-003**: Os testes cobrem todos os cenários de erro documentados (conexão, timeout, resposta inválida).
- **SC-004**: `pytest` retorna zero falhas em ambiente limpo após a implementação.

## Assumptions

- O projeto já usa `pytest` para testes (conforme `CLAUDE.md`).
- Mocks/stubs serão usados para simular respostas do Ollama sem chamar o serviço real.
- Os testes ficam no diretório `processor/tests/` ou equivalente já existente.
- Não é esperada cobertura de 100% — cenários de integração com Ollama real ficam fora do escopo.
