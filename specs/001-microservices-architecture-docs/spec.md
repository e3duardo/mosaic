# Feature Specification: Documentar a Arquitetura de Microsserviços do Mosaic

**Feature Branch**: `001-microservices-architecture-docs`

**Created**: 2026-05-13

**Status**: Draft

**Input**: User description: "[Issue #1] Documentar a arquitetura de microsserviços do Mosaic — criar documentação clara da arquitetura alvo de microsserviços (api-gateway Go, financial-service Go, medical-service PHP, ideas-service C#, reminders-service Node.js, processor Python), incluindo diagramas de comunicação, responsabilidades de cada serviço e contratos REST entre eles."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Entender a arquitetura geral (Priority: P1)

Um novo colaborador ou contribuidor do projeto precisa entender rapidamente como os serviços se comunicam, quais são as responsabilidades de cada um e por onde começar a trabalhar.

**Why this priority**: Sem uma visão geral da arquitetura, qualquer contribuidor desperdiça tempo tentando entender o sistema por conta própria, aumentando o risco de decisões inconsistentes.

**Independent Test**: Pode ser validado pedindo a um novo colaborador que leia apenas a documentação e explique o fluxo de uma mensagem do frontend até o banco de dados sem consultar o código.

**Acceptance Scenarios**:

1. **Given** um novo colaborador acessa o repositório, **When** lê a documentação de arquitetura, **Then** consegue descrever corretamente quais serviços existem, em qual linguagem são escritos e qual é a responsabilidade de cada um.
2. **Given** a documentação está disponível, **When** um colaborador precisa decidir em qual serviço implementar uma nova funcionalidade, **Then** encontra na documentação a diretriz clara para tomar essa decisão.

---

### User Story 2 - Entender os contratos REST entre serviços (Priority: P2)

Um desenvolvedor que vai implementar um novo serviço (ou integrar ao existente) precisa saber quais endpoints cada serviço expõe e qual o formato das requisições e respostas esperadas.

**Why this priority**: Contratos bem documentados evitam integrações incorretas e retrabalho entre equipes trabalhando em serviços diferentes em paralelo.

**Independent Test**: Um desenvolvedor deve ser capaz de implementar um cliente para qualquer serviço consultando apenas a documentação de contratos, sem precisar ler o código-fonte.

**Acceptance Scenarios**:

1. **Given** um desenvolvedor vai integrar o api-gateway com o financial-service, **When** consulta a documentação de contratos REST, **Then** encontra os endpoints disponíveis, os campos obrigatórios e opcionais, e exemplos de requisição e resposta.
2. **Given** a documentação está publicada, **When** um serviço muda sua interface, **Then** a documentação serve como contrato de referência para identificar breaking changes.

---

### User Story 3 - Visualizar o diagrama de comunicação entre serviços (Priority: P3)

Um arquiteto ou tech lead precisa visualizar rapidamente o fluxo de dados entre os serviços para tomar decisões sobre evolução da arquitetura.

**Why this priority**: Um diagrama visual reduz drasticamente o tempo necessário para entender dependências e pontos de falha no sistema.

**Independent Test**: O diagrama deve ser suficiente para que alguém responda "qual serviço chama qual, e em que situação?" sem consultar código ou documentação textual adicional.

**Acceptance Scenarios**:

1. **Given** o diagrama de arquitetura está disponível, **When** um tech lead precisa avaliar o impacto de uma mudança no processor, **Then** consegue identificar visualmente todos os serviços que dependem dele.
2. **Given** o diagrama mostra o fluxo de uma mensagem, **When** um novo colaborador o lê, **Then** consegue rastrear o caminho completo de uma requisição do frontend até o armazenamento de dados.

---

### Edge Cases

- O que acontece quando um serviço ainda não foi implementado mas já está na arquitetura alvo? (deve ser documentado como "planejado" com estado claro)
- Como lidar com divergências entre a arquitetura documentada e o código atual em produção?

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: A documentação DEVE descrever todos os 6 serviços da arquitetura alvo (api-gateway, financial-service, medical-service, ideas-service, reminders-service, processor) com linguagem, responsabilidade e status de implementação.
- **FR-002**: A documentação DEVE incluir um diagrama de comunicação mostrando quais serviços se comunicam entre si e a direção do fluxo de dados.
- **FR-003**: A documentação DEVE especificar os contratos REST de cada serviço: endpoints disponíveis, métodos HTTP, formato de entrada e saída.
- **FR-004**: A documentação DEVE distinguir claramente o estado atual (monólito Go) do estado alvo (microsserviços), indicando o que já existe e o que está planejado.
- **FR-005**: A documentação DEVE estar acessível diretamente no repositório, sem depender de ferramentas externas para leitura.
- **FR-006**: A documentação DEVE incluir as variáveis de ambiente relevantes de cada serviço e seus valores padrão.

### Key Entities

- **Serviço**: Unidade de deploy independente com responsabilidade única, linguagem definida e interface REST documentada.
- **Contrato REST**: Conjunto de endpoints, métodos, payloads de entrada/saída e códigos de resposta de um serviço.
- **Diagrama de Arquitetura**: Representação visual das dependências e fluxos de comunicação entre serviços.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Um novo colaborador consegue entender a responsabilidade de cada serviço e o fluxo de uma requisição em menos de 15 minutos lendo apenas a documentação.
- **SC-002**: 100% dos serviços da arquitetura alvo estão documentados com responsabilidade, linguagem e status (implementado / planejado).
- **SC-003**: Todos os contratos REST dos serviços já implementados estão documentados com pelo menos um exemplo de requisição e resposta.
- **SC-004**: O diagrama de comunicação cobre todos os 6 serviços e suas conexões diretas.

## Assumptions

- A audiência primária é desenvolvedores contribuindo para o projeto, não usuários finais.
- A documentação será mantida no próprio repositório (README ou arquivos Markdown dedicados), não em wikis externas.
- Os contratos REST dos serviços ainda não implementados (medical, ideas, reminders) serão documentados como "contrato previsto", baseado nos padrões já adotados pelos serviços existentes.
- O diagrama pode ser representado em texto (ASCII/Mermaid) para não depender de ferramentas de imagem externas.
- A documentação cobre a camada de serviços, não inclui detalhes de banco de dados ou infraestrutura de deploy nesta fase.
