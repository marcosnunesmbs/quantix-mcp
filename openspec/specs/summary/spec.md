# Summary Specification

## Purpose
Resumo financeiro consolidado de um período, incluindo receitas, despesas, saldos de contas, totais de cartão de crédito e detalhamento por categoria.

## Scope
O que está **incluído** nesta spec:
- Resumo por mês (YYYY-MM) ou intervalo customizado (startDate + endDate em YYYY-MM-DD)
- Totais de receita e despesa (pagos e pendentes)
- Saldo total e por conta
- Despesas de cartão de crédito e detalhamento por categoria

O que está **fora do escopo**:
- Geração de extratos individuais de cartão (domínio: credit-cards)
- Listagem de transações individuais (domínio: transactions)

## Requirements

### Requirement: Get summary by month
The system SHALL return a financial summary for a given month in YYYY-MM format, including income, expenses, balance, credit card totals, and category breakdowns.

#### Scenario: Monthly summary retrieved
- **WHEN** the user provides `month` in YYYY-MM format
- **THEN** the system returns income, expenses, balance, credit card expenses, expenses/income by category, and account balances for that month

#### Scenario: Monthly summary for month with no data
- **WHEN** the user requests a summary for a month with no transactions
- **THEN** the system returns zeros for all numeric fields

### Requirement: Get summary by date range
The system SHALL return a financial summary for a custom date range defined by `startDate` and `endDate` (both in YYYY-MM-DD format).

#### Scenario: Range summary retrieved
- **WHEN** the user provides both `startDate` and `endDate`
- **THEN** the system returns the aggregated financial data for that period

### Requirement: Validation requires period parameters
The system SHALL require either `month` OR both `startDate` and `endDate`.

#### Scenario: No parameters provided
- **WHEN** the user provides neither `month` nor `startDate`+`endDate`
- **THEN** the API returns a 400 error

### Requirement: Pending income and expenses included
The summary SHALL include both paid and pending amounts separately.

#### Scenario: Pending transactions exist
- **WHEN** the period contains unpaid income or expense transactions
- **THEN** the summary includes `pendingIncome` and `pendingExpenses` fields
