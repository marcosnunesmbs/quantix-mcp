# Accounts Specification

## Purpose
Gerenciamento de contas financeiras (contas bancárias, carteiras, poupanças, investimentos). Cada conta possui um saldo inicial e um saldo calculado baseado nas transações.

## Scope
O que está **incluído** nesta spec:
- CRUD completo de contas financeiras
- Consulta de saldo individual por conta
- Tipos de conta: BANK_ACCOUNT, WALLET, SAVINGS_ACCOUNT, INVESTMENT_ACCOUNT, OTHER

O que está **fora do escopo**:
- Transferências entre contas (domínio: transfers)
- Cálculo de saldo agregado (domínio: summary)

## Requirements

### Requirement: Create account
The system SHALL allow creating a new financial account with a name, type, and optional initial balance. The system SHALL assign a unique ID and set `currentBalance` equal to `initialBalance` upon creation.

#### Scenario: Create account with initial balance
- **WHEN** the user provides `name`, `type`, and `initialBalance`
- **THEN** the system creates the account with `currentBalance` equal to `initialBalance` and returns the full account object

#### Scenario: Create account without initial balance
- **WHEN** the user provides `name` and `type` but no `initialBalance`
- **THEN** the system creates the account with `initialBalance` defaulting to 0

#### Scenario: Validation rejects invalid type
- **WHEN** the user provides a `type` not in the allowed enum
- **THEN** the input is rejected by the Zod schema

### Requirement: List all accounts
The system SHALL return all financial accounts with their current balances.

#### Scenario: List accounts when some exist
- **WHEN** the user requests the account list
- **THEN** the system returns an array of all accounts with their `currentBalance`

#### Scenario: List accounts when none exist
- **WHEN** no accounts have been created
- **THEN** the system returns an empty array

### Requirement: Get account by ID
The system SHALL return the details of a specific account by its ID.

#### Scenario: Account found
- **WHEN** the user requests an account with a valid ID
- **THEN** the system returns the account details

#### Scenario: Account not found
- **WHEN** the user requests an account with an ID that does not exist
- **THEN** the system returns a 404 error

### Requirement: Update account
The system SHALL allow updating an existing account's name, type, and initial balance.

#### Scenario: Successful update
- **WHEN** the user provides a valid account ID and one or more updateable fields
- **THEN** the system updates the account and returns the updated object

#### Scenario: Account not found on update
- **WHEN** the user attempts to update a non-existent account
- **THEN** the system returns a 404 error

### Requirement: Delete account
The system SHALL allow deleting an account by its ID.

#### Scenario: Successful deletion
- **WHEN** the user deletes an account with a valid ID
- **THEN** the system confirms the deletion

#### Scenario: Account not found on deletion
- **WHEN** the user attempts to delete a non-existent account
- **THEN** the system returns a 404 error

### Requirement: Get account balance
The system SHALL return the current balance for a specific account.

#### Scenario: Balance retrieved successfully
- **WHEN** the user requests the balance of an existing account
- **THEN** the system returns the `accountId`, `currentBalance`, and `calculatedAt` timestamp

#### Scenario: Account not found for balance
- **WHEN** the user requests the balance of a non-existent account
- **THEN** the system returns a 404 error
