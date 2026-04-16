# Transactions Specification

## Purpose
Gerenciamento de transações financeiras diretas (receitas e despesas) com métodos de pagamento CASH, PIX e DEBIT. Suporte a recorrência e parcelamento.

## Scope
O que está **incluído** nesta spec:
- Criação, atualização, exclusão de transações diretas
- Marcação como paga/não-paga
- Filtros por mês, conta, categoria, tipo, datas e status de pagamento
- Recorrência com 3 frequências (WEEKLY, MONTHLY, YEARLY)

O que está **fora do escopo**:
- Transações de cartão de crédito (domínio: credit-card-transactions)
- Transferências entre contas (domínio: transfers)

## Requirements

### Requirement: Create direct transaction
The system SHALL allow creating a new income or expense transaction with type, name, amount, date, paymentMethod (CASH, PIX, or DEBIT), and accountId.

#### Scenario: Successful direct transaction creation
- **WHEN** the user provides `type`, `name`, `amount`, `date`, `paymentMethod` (CASH, PIX, or DEBIT), and `accountId`
- **THEN** the system creates the transaction via `POST /transactions` and returns it

#### Scenario: Validation rejects credit card fields
- **WHEN** the user attempts to provide `creditCardId`, `targetDueMonth`, or `purchaseDate`
- **THEN** the Zod schema rejects the input as those fields are not part of the direct transaction schema

#### Scenario: Validation rejects CREDIT payment method
- **WHEN** the user provides `paymentMethod` as "CREDIT"
- **THEN** the Zod schema rejects the input as the enum only allows CASH, PIX, DEBIT

### Requirement: Update direct transaction
The system SHALL allow updating a direct payment transaction. For recurring transactions, the user MAY specify an update mode: SINGLE (only this), PENDING (this and future pending), or ALL (all in series).

#### Scenario: Successful direct transaction update
- **WHEN** the user provides a valid transaction ID and one or more updateable fields
- **THEN** the system updates via `PATCH /transactions/:id` and returns the modified transaction

#### Scenario: Recurring transaction update mode
- **WHEN** the user provides `mode` as SINGLE, PENDING, or ALL
- **THEN** the update is applied according to the mode

#### Scenario: Validation rejects credit card fields
- **WHEN** the user attempts to provide `creditCardId`, `targetDueMonth`, or `purchaseDate`
- **THEN** the Zod schema rejects the input

### Requirement: Delete transaction
The system SHALL allow deleting a transaction by its ID. For recurring transactions, the user MAY specify a deletion mode.

#### Scenario: Successful deletion
- **WHEN** the user deletes a transaction with a valid ID
- **THEN** the system confirms the deletion

#### Scenario: Recurring transaction deletion mode
- **WHEN** the user provides `mode` as SINGLE, PENDING, or ALL
- **THEN** the deletion applies according to the mode

### Requirement: Mark transaction as paid
The system SHALL allow marking a transaction as paid via `PATCH /transactions/:id/pay`.

#### Scenario: Transaction marked as paid
- **WHEN** the user provides a valid transaction ID
- **THEN** the transaction's `paid` field is set to true

### Requirement: Mark transaction as unpaid
The system SHALL allow marking a transaction as unpaid via `PATCH /transactions/:id/unpay`.

#### Scenario: Transaction marked as unpaid
- **WHEN** the user provides a valid transaction ID
- **THEN** the transaction's `paid` field is set to false

### Requirement: List transactions
The system SHALL return transactions with optional filters: month, accountId, categoryId, creditCardId, type, startDate, endDate, paid.

#### Scenario: List all transactions
- **WHEN** the user requests transactions without filters
- **THEN** the system returns all transactions

#### Scenario: List transactions filtered by month
- **WHEN** the user provides `month` in YYYY-MM format
- **THEN** the system returns only transactions within that month

#### Scenario: List transactions filtered by date range
- **WHEN** the user provides `startDate` and `endDate`
- **THEN** the system returns transactions within that range (inclusive)

#### Scenario: List transactions filtered by payment status
- **WHEN** the user provides `paid` as true or false
- **THEN** the system returns only paid or unpaid transactions respectively

### Requirement: Get transaction by ID
The system SHALL return a specific transaction with its related data (category, credit card, account, subscription).

#### Scenario: Transaction found
- **WHEN** the user requests a transaction with a valid ID
- **THEN** the system returns the transaction with related entities

#### Scenario: Transaction not found
- **WHEN** the user requests a transaction with a non-existent ID
- **THEN** the system returns a 404 error

### Requirement: Direct transaction recurrence
The recurrence for direct transactions SHALL support only 3 frequencies: WEEKLY, MONTHLY, YEARLY.

#### Scenario: Valid recurrence frequencies
- **WHEN** the user provides a recurrence with WEEKLY, MONTHLY, or YEARLY
- **THEN** the request is accepted

#### Scenario: Invalid recurrence frequency
- **WHEN** the user provides BIWEEKLY, BIMONTHLY, QUARTERLY, SEMIANNUALLY, or ANNUALLY
- **THEN** the Zod schema rejects the input
