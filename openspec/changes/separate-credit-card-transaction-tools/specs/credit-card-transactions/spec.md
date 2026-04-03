## ADDED Requirements

### Requirement: Create credit card transaction
The system SHALL provide a `create_credit_transaction` tool that sends a POST request to `/transactions/credit` with a schema specific to credit card transactions.

#### Scenario: Successful creation
- **WHEN** the user provides `name`, `amount`, `purchaseDate`, and `creditCardId`
- **THEN** the system calls `POST /transactions/credit` and returns the created transaction

#### Scenario: Creation with installments
- **WHEN** the user provides `installments` > 1
- **THEN** the transaction is split into installments with the due date calculated from the card closing day

#### Scenario: Creation with target due month
- **WHEN** the user provides `targetDueMonth` in YYYY-MM format
- **THEN** the first installment's due date is set to the target month

#### Scenario: Creation with recurrence
- **WHEN** the user provides `recurrence` with one of the 7 supported frequencies (WEEKLY, BIWEEKLY, MONTHLY, BIMONTHLY, QUARTERLY, SEMIANNUALLY, ANNUALLY)
- **THEN** the system includes the recurrence object in the request body

### Requirement: Update credit card transaction
The system SHALL provide an `update_credit_transaction` tool that sends a PATCH request to `/transactions/credit/:id` with a schema specific to credit card transactions.

#### Scenario: Successful update
- **WHEN** the user provides a valid transaction ID and one or more updateable fields
- **THEN** the system calls `PATCH /transactions/credit/:id` and returns the updated transaction

#### Scenario: Recalculation of due date
- **WHEN** the user changes `purchaseDate` or `targetDueMonth`
- **THEN** the due date is recalculated by the API

#### Scenario: Update with recurrence
- **WHEN** the user modifies the `recurrence` field
- **THEN** the recurrence object is updated with one of the 7 supported frequencies

### Requirement: Credit card transaction input schema
The input schema for credit card transaction tools SHALL include the following fields: `name` (required), `amount` (required, min 0), `purchaseDate` (required, YYYY-MM-DD), `creditCardId` (required), `categoryId` (optional), `installments` (optional, min 1), `targetDueMonth` (optional, YYYY-MM), `isPaid` (optional, default false), `recurrence` (optional, CreditCardRecurrenceDto with 7 frequencies).

#### Scenario: Validation rejects missing required fields
- **WHEN** any of `name`, `amount`, `purchaseDate`, or `creditCardId` is missing
- **THEN** the MCP SDK rejects the input with a validation error

#### Scenario: Validation rejects invalid frequency
- **WHEN** the user provides a recurrence frequency not in the 7 supported values
- **THEN** the input is rejected by the Zod schema
