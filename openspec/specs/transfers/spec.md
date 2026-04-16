# Transfers Specification

## Purpose
Transferências de saldo entre contas financeiras do próprio usuário. Uma transferência debita de uma conta de origem e credita em uma conta de destino.

## Scope
O que está **incluído** nesta spec:
- CRUD completo de transferências
- Filtros por conta, mês e intervalo de datas

O que está **fora do escopo**:
- Criação de contas (domínio: accounts)
- Transações de despesas/receitas (domínio: transactions)

## Requirements

### Requirement: Create transfer
The system SHALL allow creating a transfer between two accounts with source account ID, destination account ID, amount (minimum 0.01), and date (YYYY-MM-DD).

#### Scenario: Successful transfer creation
- **WHEN** the user provides `sourceAccountId`, `destinationAccountId`, `amount`, and `date`
- **THEN** the system creates the transfer and debits/credits both accounts accordingly

#### Scenario: Validation rejects zero or negative amount
- **WHEN** the user provides an `amount` less than 0.01
- **THEN** the Zod schema rejects the input

#### Scenario: Validation rejects invalid date format
- **WHEN** the user provides a `date` not matching YYYY-MM-DD
- **THEN** the Zod schema rejects the input

### Requirement: List transfers
The system SHALL return transfers with optional filters by account ID, month (YYYY-MM), start date, and end date.

#### Scenario: List all transfers
- **WHEN** the user requests transfers without filters
- **THEN** the system returns all transfers

#### Scenario: List transfers filtered by account
- **WHEN** the user provides `accountId`
- **THEN** the system returns only transfers involving that account

#### Scenario: List transfers filtered by month
- **WHEN** the user provides `month` in YYYY-MM format
- **THEN** the system returns only transfers within that month

#### Scenario: List transfers filtered by date range
- **WHEN** the user provides `startDate` and `endDate`
- **THEN** the system returns only transfers within that date range (inclusive)

### Requirement: Get transfer by ID
The system SHALL return a specific transfer by its ID.

#### Scenario: Transfer found
- **WHEN** the user requests a transfer with a valid ID
- **THEN** the system returns the transfer details

#### Scenario: Transfer not found
- **WHEN** the user requests a transfer with a non-existent ID
- **THEN** the system returns a 404 error

### Requirement: Update transfer
The system SHALL allow updating a transfer's source account, destination account, amount, and/or date.

#### Scenario: Successful update
- **WHEN** the user provides a valid transfer ID and one or more updateable fields
- **THEN** the system updates and returns the modified transfer

### Requirement: Delete transfer
The system SHALL allow deleting a transfer by its ID.

#### Scenario: Successful deletion
- **WHEN** the user deletes a transfer with a valid ID
- **THEN** the system confirms the deletion
