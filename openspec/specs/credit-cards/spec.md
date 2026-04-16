# Credit Cards Specification

## Purpose
Gerenciamento de cartões de crédito, incluindo CRUD, consultas de extrato (statement), pagamento de fatura, reabertura de fatura e antecipação de parcelas.

## Scope
O que está **incluído** nesta spec:
- CRUD de cartões de crédito (nome, bandeira, limite, dia de fechamento, dia de vencimento)
- Consulta de extrato mensal (`/credit-cards/{id}/statement`)
- Pagamento de fatura (`pay-statement`)
- Reabertura de fatura (`reopen-statement`)
- Status de pagamento da fatura (`statement-status`)
- Antecipação de parcelas (`anticipations`)

O que está **fora do escopo**:
- Transações de cartão de crédito (domínio: credit-card-transactions)
- Criação de parcelamento manual (domínio: credit-card-transactions)

## Requirements

### Requirement: Create credit card
The system SHALL allow creating a new credit card with name, optional brand, limit amount, closing day (1-31), and due day (1-31).

#### Scenario: Create credit card with all fields
- **WHEN** the user provides `name`, `brand`, `limitAmount`, `closingDay`, and `dueDay`
- **THEN** the system creates the card with an `availableLimit` equal to `limitAmount`

#### Scenario: Validation rejects closing day outside range
- **WHEN** the user provides a `closingDay` less than 1 or greater than 31
- **THEN** the Zod schema rejects the input

#### Scenario: Validation rejects due day outside range
- **WHEN** the user provides a `dueDay` less than 1 or greater than 31
- **THEN** the Zod schema rejects the input

### Requirement: List all credit cards
The system SHALL return all credit cards with their available limits.

#### Scenario: Cards exist
- **WHEN** the user requests the credit card list
- **THEN** the system returns an array of all cards with `availableLimit`

### Requirement: Get credit card by ID
The system SHALL return a specific credit card by its ID.

#### Scenario: Card found
- **WHEN** the user requests a card with a valid ID
- **THEN** the system returns the card details including `availableLimit`

#### Scenario: Card not found
- **WHEN** the user requests a card with a non-existent ID
- **THEN** the system returns a 404 error

### Requirement: Update credit card
The system SHALL allow updating a credit card's name, brand, limit, closing day, and/or due day.

#### Scenario: Successful update
- **WHEN** the user provides a valid card ID and one or more updateable fields
- **THEN** the system updates and returns the modified card

### Requirement: Delete credit card
The system SHALL allow deleting a credit card by its ID.

#### Scenario: Successful deletion
- **WHEN** the user deletes a card with a valid ID
- **THEN** the system confirms the deletion

### Requirement: Get statement
The system SHALL return the credit card statement for a specific month, including all transactions, total amount, and available limit.

#### Scenario: Statement retrieved
- **WHEN** the user provides a valid card ID and a month in YYYY-MM format
- **THEN** the system returns the statement with transactions, total, and available limit

#### Scenario: Card not found for statement
- **WHEN** the user requests a statement for a non-existent card
- **THEN** the system returns a 404 error

### Requirement: Pay statement
The system SHALL mark all transactions in a credit card statement as paid, debiting from a specified payment account.

#### Scenario: Statement paid successfully
- **WHEN** the user provides `cardId`, `month`, and `paymentAccountId`
- **THEN** all transactions in the statement are marked as paid and the system confirms the payment

### Requirement: Reopen statement
The system SHALL reopen a credit card statement by marking all transactions as unpaid.

#### Scenario: Statement reopened
- **WHEN** the user provides `cardId` and `month`
- **THEN** all transactions in the statement are marked as unpaid

### Requirement: Get statement status
The system SHALL return the payment status of a credit card statement for a specific month.

#### Scenario: Status retrieved
- **WHEN** the user provides `cardId` and `month`
- **THEN** the system returns the `isPaid` status for that month

### Requirement: Create anticipation
The system SHALL allow creating a credit card anticipation (advance payment toward a future statement). The system SHALL create a linked pair: an INCOME transaction on the credit card side and an EXPENSE transaction on the account side.

#### Scenario: Anticipation created
- **WHEN** the user provides `cardId`, `name`, `amount`, `purchaseDate`, `targetDueMonth`, `accountId`, and optional `categoryId`
- **THEN** the system creates the linked INCOME/EXPENSE transaction pair and returns the result

#### Scenario: Validation rejects amount below minimum
- **WHEN** the user provides an `amount` less than 0.01
- **THEN** the Zod schema rejects the input
