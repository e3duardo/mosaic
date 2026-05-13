# Feature Specification: PostgreSQL — Schemas Separados por Serviço

**Feature Branch**: `006-postgres-schemas-per-service`

**Created**: 2026-05-13

**Status**: Draft

**Input**: User description: "[Issue #7] [M-6] PostgreSQL: criar schemas separados por serviço — garantir isolamento de dados entre microsserviços usando schemas distintos no PostgreSQL."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Dados de serviços diferentes ficam isolados (Priority: P1)

Um desenvolvedor opera o banco de dados e consegue verificar que as tabelas de cada microsserviço estão organizadas em schemas separados, sem mistura de dados entre serviços.

**Why this priority**: Isolamento de dados é o requisito fundamental da arquitetura de microsserviços. Sem ele, os serviços continuam acoplados no nível de banco de dados.

**Independent Test**: Conectar ao PostgreSQL e verificar que existem schemas distintos (ex: `financial`, `medical`, `ideas`, `reminders`) com as tabelas correspondentes a cada serviço.

**Acceptance Scenarios**:

1. **Given** o PostgreSQL está configurado, **When** um DBA lista os schemas, **Then** encontra um schema dedicado para cada microsserviço (financial, medical, ideas, reminders) além do schema padrão.
2. **Given** o financial-service cria uma tabela `expenses`, **When** o medical-service cria uma tabela com o mesmo nome, **Then** ambas coexistem sem conflito, cada uma em seu próprio schema.
3. **Given** um serviço está configurado com seu schema, **When** ele inicia, **Then** acessa apenas as tabelas do seu próprio schema sem enxergar as de outros serviços.

---

### User Story 2 - Migrations por serviço são independentes (Priority: P2)

Um desenvolvedor consegue rodar a migration de um único serviço sem afetar as tabelas dos demais.

**Why this priority**: Migrations independentes permitem que serviços evoluam seu schema sem coordenação entre equipes.

**Independent Test**: Rodar a migration do financial-service e verificar que apenas o schema `financial` foi alterado.

**Acceptance Scenarios**:

1. **Given** os schemas estão configurados, **When** a migration do financial-service é executada, **Then** apenas o schema `financial` recebe as novas tabelas/alterações.
2. **Given** dois serviços têm migrations pendentes, **When** a migration de um deles falha, **Then** o schema do outro serviço não é afetado.

---

### Edge Cases

- O que acontece se um serviço tenta acessar o schema de outro serviço?
- Como lidar com o schema existente do monólito durante a transição?
- O que acontece se um schema não existir quando o serviço iniciar?

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: DEVE existir um schema PostgreSQL dedicado para cada microsserviço: `financial`, `medical`, `ideas`, `reminders`.
- **FR-002**: Cada serviço DEVE conectar ao banco de dados usando seu schema dedicado como padrão (`search_path`).
- **FR-003**: As migrations de cada serviço DEVE operar exclusivamente dentro do schema correspondente.
- **FR-004**: A configuração de schemas DEVE ser aplicável via script ou automação, não apenas manualmente.
- **FR-005**: O schema do monólito existente (`public`) DEVE ser preservado durante a transição para não quebrar o sistema atual.

### Key Entities

- **Schema**: Namespace lógico dentro do PostgreSQL que agrupa as tabelas de um serviço específico.
- **Search Path**: Configuração do cliente de banco de dados que define qual schema usar por padrão.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% dos microsserviços planejados têm schemas dedicados criados e configurados.
- **SC-002**: Nenhum serviço consegue ler ou escrever nas tabelas de outro serviço sem configuração explícita.
- **SC-003**: A criação de todos os schemas pode ser executada com um único comando de setup.
- **SC-004**: O sistema existente (monólito) continua funcionando após a criação dos novos schemas.

## Assumptions

- Um único servidor PostgreSQL é compartilhado entre todos os microsserviços nesta fase, apenas com schemas separados (não bancos separados).
- O isolamento por schema é suficiente para esta fase; bancos separados podem ser considerados no futuro.
- O schema `public` existente pertence ao monólito e será mantido intacto.
- As credenciais de acesso por schema são configuradas fora do escopo desta issue (cada serviço usa o mesmo usuário por ora).
