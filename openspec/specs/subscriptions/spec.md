# Subscriptions Specification

## Purpose
Gerenciamento de assinaturas e pagamentos recorrentes vinculados a cartões de crédito (ex: Netflix, Spotify). Cada assinatura gera transações automáticas no cartão no dia de faturamento configurado.

## Scope
O que está **incluído** nesta spec:
- CRUD de assinaturas (nome, valor, dia de faturamento, cartão, categoria)
- Ativação/desativação (soft delete) e reativação
- Exclusão permanente (hard delete)
- Listagem de assinaturas ativas

O que está **fora do escopo**:
- Geração automática de transações (comportamento do backend da API)
- Transações de cartão avulsas (domínio: credit-card-transactions)

## Requirements

### Requirement: Create subscription
The system SHALL allow creating a new subscription with a name, amount, billing day (1-31), credit card ID, and optional category ID.

#### Scenario: Create subscription with all fields
- **WHEN** the user provides `name`, `amount`, `billingDay`, `creditCardId`, and `categoryId`
- **THEN** the system creates the subscription as active and returns it with assigned ID

#### Scenario: Validation rejects billing day outside range
- **WHEN** the user provides a `billingDay` less than 1 or greater than 31
- **THEN** the Zod schema rejects the input

### Requirement: List all subscriptions
The system SHALL return all subscriptions regardless of active status.

#### Scenario: Subscriptions exist
- **WHEN** the user requests the subscription list
- **THEN** the system returns an array of all subscriptions

### Requirement: List active subscriptions
The system SHALL return only active subscriptions.

#### Scenario: Active subscriptions exist
- **WHEN** the user requests active subscriptions
- **THEN** the system returns only subscriptions where `active` is true

### Requirement: Get subscription by ID
The system SHALL return a specific subscription by its ID.

#### Scenario: Subscription found
- **WHEN** the user requests a subscription with a valid ID
- **THEN** the system returns the subscription details

#### Scenario: Subscription not found
- **WHEN** the user requests a subscription with a non-existent ID
- **THEN** the system returns a 404 error

### Requirement: Update subscription
The system SHALL allow updating a subscription's name, amount, billing day, credit card ID, category ID, and/or active status.

#### Scenario: Successful update
- **WHEN** the user provides a valid subscription ID and one or more updateable fields
- **THEN** the system updates and returns the modified subscription

### Requirement: Deactivate subscription
The system SHALL allow deactivating (soft delete) a subscription by its ID.

#### Scenario: Successful deactivation
- **WHEN** the user deactivates a subscription with a valid ID
- **THEN** the subscription's `active` field is set to false

#### Scenario: Subscription not found on deactivation
- **WHEN** the user attempts to deactivate a non-existent subscription
- **THEN** the system returns a 404 error

### Requirement: Permanently delete subscription
The system SHALL allow permanently deleting (hard delete) a subscription by its ID.

#### Scenario: Successful permanent deletion
- **WHEN** the user permanently deletes a subscription with a valid ID
- **THEN** the subscription is removed from the database

### Requirement: Reactivate subscription
The system SHALL allow reactivating a previously deactivated subscription.

#### Scenario: Successful reactivation
- **WHEN** the user reactivates a deactivated subscription
- **THEN** the subscription's `active` field is set to true
