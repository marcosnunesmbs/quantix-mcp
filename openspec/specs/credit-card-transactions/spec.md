# Credit Card Transactions Specification

## Purpose
Gerenciamento de transações de cartão de crédito, incluindo compras à vista e parceladas, com cálculo automático de data de vencimento baseado no dia de fechamento do cartão.

## Scope
O que está **incluído** nesta spec:
- Criação de transações de cartão via `POST /transactions/credit`
- Atualização de transações de cartão via `PATCH /transactions/credit/:id`
- Cálculo automático de data de vencimento
- Parcelamento com datas de vencimento distribuídas
- Recorrência com 7 frequências (WEEKLY, BIWEEKLY, MONTHLY, BIMONTHLY, QUARTERLY, SEMIANNUALLY, ANNUALLY)

O que está **fora do escopo**:
- Gestão de cartões de crédito em si (domínio: credit-cards)
- Extratos e pagamento de fatura (domínio: credit-cards)
- Transações diretas CASH/PIX/DEBIT (domínio: transactions)

## Requirements

### Requirement: Create credit card transaction
The system SHALL allow creating a credit card transaction via `POST /transactions/credit` with name, amount, purchaseDate, creditCardId, and optional fields (categoryId, installments, targetDueMonth, isPaid, recurrence).

#### Scenario: Successful creation
- **WHEN** the user provides `name`, `amount`, `purchaseDate`, and `creditCardId`
- **THEN** the system creates the transaction and the due date is calculated from the card's closing day

#### Scenario: Creation with installments
- **WHEN** the user provides `installments` > 1
- **THEN** the transaction is split into installments with due dates calculated from the card closing day

#### Scenario: Creation with target due month
- **WHEN** the user provides `targetDueMonth` in YYYY-MM format
- **THEN** the first installment's due date is set to the target month

#### Scenario: Creation with recurrence
- **WHEN** the user provides `recurrence` with one of the 7 supported frequencies (WEEKLY, BIWEEKLY, MONTHLY, BIMONTHLY, QUARTERLY, SEMIANNUALLY, ANNUALLY)
- **THEN** the system includes the recurrence object in the request body

### Requirement: Update credit card transaction
The system SHALL allow updating a credit card transaction via `PATCH /transactions/credit/:id`. If `purchaseDate` or `targetDueMonth` is changed, the due date SHALL be recalculated.

#### Scenario: Successful update
- **WHEN** the user provides a valid transaction ID and one or more updateable fields
- **THEN** the system updates and returns the modified transaction

#### Scenario: Recalculation of due date
- **WHEN** the user changes `purchaseDate` or `targetDueMonth`
- **THEN** the due date is recalculated by the API

#### Scenario: Update with recurrence
- **WHEN** the user modifies the `recurrence` field
- **THEN** the recurrence object is updated with one of the 7 supported frequencies

### Requirement: Credit card transaction input schema
The input schema for credit card transaction tools SHALL include: `name` (required), `amount` (required, min 0), `purchaseDate` (required, YYYY-MM-DD), `creditCardId` (required), `categoryId` (optional), `installments` (optional, min 1), `targetDueMonth` (optional, YYYY-MM), `isPaid` (optional, default false), `recurrence` (optional, CreditCardRecurrenceDto with 7 frequencies).

#### Scenario: Validation rejects missing required fields
- **WHEN** any of `name`, `amount`, `purchaseDate`, or `creditCardId` is missing
- **THEN** the MCP SDK rejects the input with a validation error

#### Scenario: Validation rejects invalid frequency
- **WHEN** the user provides a recurrence frequency not in the 7 supported values
- **THEN** the input is rejected by the Zod schema
