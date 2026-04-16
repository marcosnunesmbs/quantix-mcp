# Data Import/Export Specification

## Purpose
Backup e restauração de todos os dados do usuário (configurações, categorias, contas, cartões de crédito, regras de recorrência, transações) via exportação e importação JSON.

## Scope
O que está **incluído** nesta spec:
- Exportação completa de todos os dados (`GET /export`)
- Importação em modo `reset` (limpa dados existentes) ou `increment` (adiciona sem duplicar)
- Validação de formato e versão do export

O que está **fora do escopo**:
- Exportação parcial por domínio ou data
- Migração entre versões de formato de export

## Requirements

### Requirement: Export all data
The system SHALL return all user data as a complete backup in JSON format, including settings, categories, accounts, credit cards, recurrence rules, and transactions.

#### Scenario: Successful export
- **WHEN** the user requests an export
- **THEN** the system returns a JSON object with `version`, `exportedAt`, and a `data` object containing all domains

#### Scenario: Export includes version metadata
- **WHEN** the user receives the export
- **THEN** the response includes `version` (e.g., "1.0") and `exportedAt` (ISO timestamp)

### Requirement: Import data in reset mode
The system SHALL allow importing a previously exported backup in `reset` mode, which clears all existing data before importing.

#### Scenario: Reset import clears and replaces data
- **WHEN** the user imports with `mode: "reset"` and valid export data
- **THEN** the system clears existing records and imports all data from the backup

#### Scenario: Validation rejects wrong version
- **WHEN** the user provides a `version` that does not match "1.0"
- **THEN** the input is rejected

### Requirement: Import data in increment mode
The system SHALL allow importing a backup in `increment` mode, which adds new records and skips any IDs that already exist.

#### Scenario: Increment import skips duplicates
- **WHEN** the user imports with `mode: "increment"` and the backup contains IDs that already exist
- **THEN** the system skips existing IDs and only imports new records

#### Scenario: Increment import adds new records
- **WHEN** the user imports with `mode: "increment"` and the backup contains new IDs
- **THEN** the system adds all new records to the existing data
