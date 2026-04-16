## Why

A API Quantix separou as rotas de transações: `POST /transactions` agora aceita apenas `CASH|PIX|DEBIT`, enquanto `POST /transactions/credit` é a rota dedicada para transações de cartão. O MCP server ainda possui uma única tool `create_transaction` genérica que envia tudo para `/transactions`, resultando em erro 400 quando `paymentMethod` é `CREDIT`. O mesmo problema ocorre no `update_transaction`.

## What Changes

- **`create_transaction`**: Removidos os campos exclusivos de cartão (`paymentMethod: "CREDIT"`, `creditCardId`, `targetDueMonth`). Agora envia apenas para `POST /transactions`.
- **`update_transaction`**: Removidos os campos exclusivos de cartão (`paymentMethod: "CREDIT"`, `creditCardId`, `targetDueMonth`, `purchaseDate`). Agora envia apenas para `PATCH /transactions/:id`.
- **Nova tool `create_credit_transaction`**: Tool dedicada para criar transações de cartão via `POST /transactions/credit`, com schema próprio (`purchaseDate`, `creditCardId`, `installments`, `targetDueMonth`, recurrence com 7 frequências).
- **Nova tool `update_credit_transaction`**: Tool dedicada para atualizar transações de cartão via `PATCH /transactions/credit/:id`, com schema próprio.
- **`delete_transaction`**: Permanece inalterada (a rota de delete é compartilhada).

## Capabilities

### New Capabilities
- `credit-card-transactions`: Criação e atualização de transações de cartão de crédito com schema próprio (purchaseDate, targetDueMonth, installments, recurrence estendida).

### Modified Capabilities
- `transactions`: Requisitos de criação e atualização agora restritos a métodos diretos (CASH, PIX, DEBIT). Campos de cartão removidos do schema de input.

## Impact

- `src/types/schemas.ts`: Reorganização dos schemas de input; adição de schemas específicos para cartão.
- `src/tools/transactions.ts`: Separação em 4 tools distintas; remoção de campos de cartão das tools genéricas.
- Clients MCP que usavam `create_transaction` com `paymentMethod: "CREDIT"` precisarão migrar para `create_credit_transaction`.
