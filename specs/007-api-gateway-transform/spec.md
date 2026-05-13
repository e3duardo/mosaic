# Feature Specification: Transformar o Serviço API em API Gateway

**Feature Branch**: `007-api-gateway-transform`

**Created**: 2026-05-13

**Status**: Draft

**Input**: User description: "[Issue #8] [M-7] Transformar o serviço api atual em API Gateway — o api-gateway deve rotear requisições para os microsserviços corretos sem conter lógica de negócio."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Frontend continua funcionando sem alterações (Priority: P1)

Um usuário do frontend envia mensagens e acessa relatórios exatamente como antes, sem perceber que o backend foi reestruturado internamente.

**Why this priority**: A transição não pode quebrar a experiência existente. O api-gateway é o ponto de entrada único; se ele quebrar, tudo quebra.

**Independent Test**: Executar todos os fluxos existentes do frontend (enviar mensagem, ver relatório financeiro, ver medicamentos) contra o api-gateway refatorado.

**Acceptance Scenarios**:

1. **Given** o api-gateway está rodando, **When** o frontend envia uma mensagem, **Then** a mensagem é processada e o resultado retorna exatamente como antes da refatoração.
2. **Given** o api-gateway está rodando com os microsserviços downstream, **When** o frontend acessa o relatório financeiro, **Then** os dados são retornados corretamente via roteamento pelo gateway.
3. **Given** um microsserviço downstream está indisponível, **When** o frontend faz uma requisição dependente dele, **Then** o gateway retorna um erro amigável (não um crash).

---

### User Story 2 - Gateway roteia para o microsserviço correto (Priority: P2)

Um desenvolvedor verifica que requisições financeiras chegam ao financial-service, médicas ao medical-service, etc., sem que o gateway execute qualquer lógica de negócio.

**Why this priority**: Roteamento correto é a função principal do gateway. Lógica de negócio no gateway viola o princípio de microsserviços.

**Independent Test**: Enviar uma requisição financeira e verificar nos logs do financial-service que ela foi recebida e processada lá, não no gateway.

**Acceptance Scenarios**:

1. **Given** o api-gateway e o financial-service estão rodando, **When** chega uma requisição de despesa, **Then** o gateway encaminha ao financial-service e retorna a resposta dele sem modificação de dados.
2. **Given** o api-gateway está rodando, **When** inspecionamos seu código, **Then** não encontramos validações de regras de negócio — apenas lógica de roteamento e composição de resposta.

---

### User Story 3 - WebSocket continua funcionando (Priority: P3)

O frontend continua recebendo atualizações em tempo real via WebSocket através do api-gateway.

**Why this priority**: WebSocket é um canal crítico para UX em tempo real; sua quebra seria perceptível imediatamente.

**Independent Test**: Conectar via WebSocket ao gateway e verificar que broadcasts continuam chegando após envio de mensagens.

**Acceptance Scenarios**:

1. **Given** o frontend está conectado via WebSocket ao api-gateway, **When** uma mensagem é processada, **Then** a atualização chega ao frontend via WebSocket como antes.

---

### Edge Cases

- O que acontece quando o api-gateway não consegue se conectar a um microsserviço downstream?
- Como lidar com timeouts de microsserviços downstream?
- O que acontece com requisições para rotas que ainda não foram migradas para microsserviços?

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: O api-gateway DEVE manter compatibilidade total com todos os endpoints existentes consumidos pelo frontend.
- **FR-002**: O api-gateway NÃO DEVE conter lógica de negócio — apenas roteamento, composição de resposta e tratamento de erros de conectividade.
- **FR-003**: O api-gateway DEVE rotear requisições financeiras para o financial-service quando disponível.
- **FR-004**: O api-gateway DEVE retornar respostas de erro claras e amigáveis quando um microsserviço downstream estiver indisponível.
- **FR-005**: O api-gateway DEVE manter suporte a WebSocket para broadcasts em tempo real.
- **FR-006**: O api-gateway DEVE manter um endpoint de health check próprio.
- **FR-007**: Rotas ainda não migradas para microsserviços DEVEM continuar sendo atendidas pelo próprio gateway durante a transição.

### Key Entities

- **Rota**: Mapeamento de endpoint HTTP para o microsserviço responsável.
- **Proxy**: Encaminhamento de requisição para downstream sem modificar dados de negócio.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% dos fluxos existentes do frontend continuam funcionando após a refatoração.
- **SC-002**: Nenhuma regra de negócio reside no código do api-gateway após a migração.
- **SC-003**: Requisições roteadas para microsserviços downstream chegam ao destino correto em 100% dos casos.
- **SC-004**: Erros de microsserviços downstream resultam em respostas de erro legíveis no frontend (não erros 500 genéricos).

## Assumptions

- A refatoração é incremental: o gateway pode ainda conter lógica de negócio temporariamente para rotas não migradas.
- O financial-service (Issue #2) é o primeiro microsserviço a receber roteamento do gateway.
- A interface WebSocket existente não muda — apenas o roteamento interno é alterado.
- O gateway continua sendo escrito em Go para esta fase.
