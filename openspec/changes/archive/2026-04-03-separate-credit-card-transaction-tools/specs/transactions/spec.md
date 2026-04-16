## ADDED Requirements

### Requirement: Create direct transaction only
The `create_transaction` tool SHALL only support direct payment methods: CASH, PIX, and DEBIT. It SHALL send a POST request to `/transactions` and SHALL NOT accept credit-card-specific fields.

#### Scenario: Successful direct transaction creation
- **WHEN** the user provides `type`, `name`, `amount`, `date`, `paymentMethod` (CASH, PIX, or DEBIT), and `accountId`
- **THEN** the system calls `POST /transactions` and returns the created transaction

#### Scenario: Validation rejects credit card fields
- **WHEN** the user attempts to provide `creditCardId`, `targetDueMonth`, or `purchaseDate`
- **THEN** the Zod schema rejects the input as those fields are not part of the direct transaction schema

#### Scenario: Validation rejects CREDIT payment method
- **WHEN** the user provides `paymentMethod` as "CREDIT"
- **THEN** the Zod schema rejects the input as the enum only allows CASH, PIX, DEBIT

### Requirement: Update direct transaction only
The `update_transaction` tool SHALL only support updating direct payment method transactions. It SHALL send a PATCH request to `/transactions/:id` and SHALL NOT accept credit-card-specific fields.

#### Scenario: Successful direct transaction update
- **WHEN** the user provides a valid transaction ID and one or more updateable fields (type, name, amount, date, categoryId, paymentMethod, accountId, isPaid)
- **THEN** the system calls `PATCH /transactions/:id` and returns the updated transaction

#### Scenario: Recurring transaction update mode
- **WHEN** the user provides `mode` as SINGLE, PENDING, or ALL
- **THEN** the update is applied according to the mode (only this transaction, this and future pending, or all in the series)

#### Scenario: Validation rejects credit card fields
- **WHEN** the user attempts to provide `creditCardId`, `targetDueMonth`, or `purchaseDate`
- **THEN** the Zod schema rejects the input as those fields are not part of the direct transaction schema

### Requirement: Direct transaction recurrence
The recurrence for direct transactions SHALL support only 3 frequencies: WEEKLY, MONTHLY, YEARLY.

#### Scenario: Valid recurrence frequencies
- **WHEN** the user provides a recurrence with WEEKLY, MONTHLY, or YEARLY
- **THEN** the request is accepted

#### Scenario: Invalid recurrence frequency
- **WHEN** the user provides BIWEEKLY, BIMONTHLY, QUARTERLY, SEMIANNUALLY, or ANNUALLY
- **THEN** the Zod schema rejects the input
