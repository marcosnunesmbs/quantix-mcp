## 1. Schema definitions

- [x] 1.1 Create `CreditCardRecurrenceSchema` in `src/types/schemas.ts` with 7 frequencies (WEEKLY, BIWEEKLY, MONTHLY, BIMONTHLY, QUARTERLY, SEMIANNUALLY, ANNUALLY)
- [x] 1.2 Create `CreateCreditCardTransactionInput` schema with required fields (name, amount, purchaseDate, creditCardId) and optional fields (categoryId, installments, targetDueMonth, isPaid, recurrence)
- [x] 1.3 Create `UpdateCreditCardTransactionInput` schema with all fields optional
- [x] 1.4 Remove `paymentMethod: "CREDIT"`, `creditCardId`, `targetDueMonth` from `CreateTransactionInput`; keep `installments`
- [x] 1.5 Remove `paymentMethod: "CREDIT"`, `creditCardId`, `targetDueMonth`, `purchaseDate` from `UpdateTransactionInput`; keep `installments`

## 2. Transaction tools (direct payments)

- [x] 2.1 Update `create_transaction` tool to POST to `/transactions` with cleaned schema; update description to clarify "CASH, PIX, or DEBIT only"
- [x] 2.2 Update `update_transaction` tool to PATCH `/transactions/:id` with cleaned schema; update description to clarify "CASH, PIX, or DEBIT only"

## 3. Credit card transaction tools (new)

- [x] 3.1 Register `create_credit_transaction` tool that POSTs to `/transactions/credit` with `CreateCreditCardTransactionInput` schema
- [x] 3.2 Register `update_credit_transaction` tool that PATCHes `/transactions/credit/:id` with `UpdateCreditCardTransactionInput` schema

## 4. Verification

- [x] 4.1 Run `npm run build` and confirm no TypeScript errors
- [x] 4.2 Run `npm test` and confirm all tests pass
