# Feature Specification: Endpoint GET /health no Processor

**Feature Branch**: `011-processor-health-endpoint`

**Created**: 2026-05-13

**Status**: Draft

**Input**: User description: "[Issue #15] Adicionar endpoint GET /health no processor (Python) — permitir que o api-gateway e ferramentas de infraestrutura verifiquem se o processor está operacional."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - API Gateway verifica se o processor está disponível (Priority: P1)

O api-gateway (ou qualquer ferramenta de monitoramento) consulta o processor e recebe uma resposta clara indicando se ele está operacional e pronto para processar mensagens.

**Why this priority**: Sem health check, o api-gateway não tem como distinguir entre "processor lento" e "processor morto", o que dificulta diagnóstico e automação de recuperação.

**Independent Test**: Subir o processor e fazer uma requisição GET /health; deve retornar status de saúde. Parar o processor e verificar que a conexão falha (comportamento esperado de serviço inativo).

**Acceptance Scenarios**:

1. **Given** o processor está rodando e conectado ao Ollama, **When** um cliente requisita GET /health, **Then** recebe resposta confirmando que o serviço está operacional.
2. **Given** o processor está rodando mas o Ollama não está disponível, **When** um cliente requisita GET /health, **Then** recebe resposta indicando que o serviço está degradado.
3. **Given** o processor está parado, **When** um cliente tenta acessar GET /health, **Then** recebe erro de conexão recusada.

---

### Edge Cases

- O health check deve verificar a conectividade com o Ollama ou apenas confirmar que o processo Python está ativo?
- Qual deve ser o código HTTP para estado "degradado" (Ollama indisponível)?

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: O processor DEVE expor o endpoint `GET /health`.
- **FR-002**: O endpoint DEVE retornar status de operacional quando o processor estiver pronto para aceitar requisições.
- **FR-003**: O endpoint DEVE indicar degradação quando dependências críticas (ex: Ollama) estiverem indisponíveis.
- **FR-004**: O endpoint DEVE responder em menos de 2 segundos em condições normais.
- **FR-005**: O endpoint NÃO DEVE processar mensagens ou executar operações custosas — apenas verificar estado.

### Key Entities

- **Status de Saúde**: Indicação do estado operacional do serviço (operacional / degradado).

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: GET /health responde em menos de 2 segundos em condições normais.
- **SC-002**: O endpoint distingue corretamente entre "operacional" e "degradado" em 100% dos casos testados.
- **SC-003**: O endpoint está disponível desde o primeiro segundo após o processor iniciar.

## Assumptions

- O health check verifica a conectividade com o Ollama além de confirmar que o processo está ativo.
- O endpoint não requer autenticação.
- O formato de resposta segue o padrão já adotado pelo projeto (JSON).
- Esta feature não altera o comportamento do endpoint `/process` existente.
