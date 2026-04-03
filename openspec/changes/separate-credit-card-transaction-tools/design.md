## Context

O MCP server `quantix-mcp` expõe ferramentas de transação para um LLM via Model Context Protocol. Atualmente existem duas tools genéricas:
- `create_transaction`: envia tudo para `POST /transactions`
- `update_transaction`: envia tudo para `PATCH /transactions/:id`

A API Quantix evoluiu e agora rejeita transações de cartão na rota genérica (HTTP 400 com mensagem "Use POST /transactions/credit for credit card transactions"). As rotas dedicadas são:
- `POST /transactions/credit` → cria transações de cartão
- `PATCH /transactions/credit/:id` → atualiza transações de cartão

Os schemas de input também divergem: o recurrence de cartão suporta 7 frequências (BIWEEKLY, BIMONTHLY, QUARTERLY, SEMIANNUALLY, ANNUALLY além de WEEKLY/MONTHLY/YEARLY), enquanto o genérico suporta apenas 3.

## Goals / Non-Goals

**Goals:**
- Separar tools de cartão em `create_credit_transaction` e `update_credit_transaction` com schemas próprios
- Restringir `create_transaction` e `update_transaction` a métodos diretos (CASH, PIX, DEBIT)
- Alinhar schemas do MCP aos DTOs da API (RecurrenceDto vs CreditCardRecurrenceDto)
- Manter `delete_transaction`, `get_transactions`, `get_transaction`, `pay_transaction`, `unpay_transaction` inalteradas

**Non-Goals:**
- Não alterar a lógica de outras domains (accounts, categories, credit-cards, subscriptions)
- Não modificar o schema de entidade `TransactionSchema` (representa a resposta da API, que é unificada via `TransactionWithRelationsDto`)
- Não adicionar novas funcionalidades além da separação de rotas

## Decisions

### 1. Tools separadas vs roteamento interno

**Decisão:** Tools separadas (`create_credit_transaction`, `update_credit_transaction`).

**Razão:** Os schemas de input são diferentes (campos obrigatórios diferentes, recurrence com enums diferentes). Tools separadas dão descrições mais precisas ao LLM, melhorando a qualidade das escolhas de tool. A API já trata como domínios distintos.

**Alternativa considerada:** Roteamento interno baseado em `paymentMethod`. Rejeitada porque esconde complexidade, torna descrições ambíguas, e o `UpdateTransactionDto` não tem `paymentMethod` como campo obrigatório — não haveria como detectar reliably.

### 2. Schema de recurrence

**Decisão:** Manter dois schemas de recurrence distintos no MCP:
- `TransactionRecurrenceSchema`: 3 frequências (WEEKLY, MONTHLY, YEARLY) — para transações diretas
- `CreditCardRecurrenceSchema`: 7 frequências — para transações de cartão

**Razão:** Espelha exatamente os DTOs da API (`RecurrenceDto` vs `CreditCardRecurrenceDto`). Evita que o LLM tente usar `BIWEEKLY` em transações diretas.

### 3. Tratamento de campos removidos

**Decisão:** Remover silenciosamente `paymentMethod: "CREDIT"`, `creditCardId`, `targetDueMonth`, `purchaseDate` dos schemas de transação direta. Se o LLM tentar usar, a validação Zod rejeitará o campo.

**Razão:** Zod valida estritamente — campos não declarados serão rejeitados pelo SDK do MCP antes mesmo de chegar na API. Não é necessário tratamento especial.

### 4. Estrutura de arquivos

**Decisão:** Manter tudo em `src/tools/transactions.ts`. São 4 tools no mesmo domínio, não justifica separação de arquivo.

## Risks / Trade-offs

| Risco | Mitigação |
|-------|-----------|
| LLM tenta usar `create_transaction` com cartão e recebe erro de validação | Descrições claras nas tools indicando "não use para cartão" |
| Quebra de compatibilidade para clientes existentes | É intencional — o comportamento antigo já retornava 400 da API |
| Dois schemas de recurrence aumentam complexidade | Nomes claros (`TransactionRecurrenceSchema` vs `CreditCardRecurrenceSchema`) + descrições |
