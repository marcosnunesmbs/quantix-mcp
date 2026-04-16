# Settings Specification

## Purpose
Configurações globais do sistema, incluindo nome do usuário, idioma e moeda padrão. Existe apenas um registro de configurações por usuário.

## Scope
O que está **incluído** nesta spec:
- Criação (apenas se não existir), leitura e atualização de configurações
- Validação de idioma (pt-BR, en-US) e moeda (BRL, USD, EUR, GBP, JPY, CAD, AUD, CHF)

O que está **fora do escopo**:
- Preferências por feature ou módulo
- Configurações de notificação ou autenticação

## Requirements

### Requirement: Create settings
The system SHALL allow creating global settings with user name, language, and currency. Creation SHALL fail if settings already exist.

#### Scenario: Settings created successfully
- **WHEN** the user provides `userName`, `language` (pt-BR or en-US), and `currency` (e.g., BRL)
- **THEN** the system creates the settings with `createdAt` and returns them

#### Scenario: Validation rejects invalid language
- **WHEN** the user provides a `language` not in [pt-BR, en-US]
- **THEN** the Zod schema rejects the input

#### Scenario: Validation rejects invalid currency
- **WHEN** the user provides a `currency` not in [BRL, USD, EUR, GBP, JPY, CAD, AUD, CHF]
- **THEN** the Zod schema rejects the input

### Requirement: Get settings
The system SHALL return the current global settings.

#### Scenario: Settings exist
- **WHEN** the user requests the settings
- **THEN** the system returns the settings object

#### Scenario: Settings do not exist
- **WHEN** no settings have been created
- **THEN** the system returns an empty or null response (or 404)

### Requirement: Update settings
The system SHALL allow updating existing settings fields (userName, language, currency). The update SHALL use PUT (full replace).

#### Scenario: Successful update
- **WHEN** the user provides one or more settings fields to update
- **THEN** the system updates the settings and returns the modified object with updated `updatedAt` timestamp
