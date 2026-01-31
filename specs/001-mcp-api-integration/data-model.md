# Data Model & Schema Mapping

**Feature**: MCP Server for Quantix API Integration
**Source**: [contracts/openapi.yaml](./contracts/openapi.yaml)

## Domain Entities

### Category
- **Fields**:
  - `id`: string (UUID)
  - `name`: string
  - `type`: enum ("INCOME", "EXPENSE")
  - `createdAt`: datetime
- **Zod Schema**:
  ```typescript
  z.object({
    id: z.string(),
    name: z.string(),
    type: z.enum(["INCOME", "EXPENSE"]),
    createdAt: z.string().datetime()
  })
  ```

### Transaction
- **Fields**:
  - `id`: string
  - `type`: enum ("INCOME", "EXPENSE")
  - `name`: string
  - `amount`: number (min 0)
  - `date`: string (YYYY-MM-DD)
  - `categoryId`: string (optional)
  - `paymentMethod`: enum ("CASH", "PIX", "DEBIT", "CREDIT") (optional)
  - `creditCardId`: string (optional, required if CREDIT)
  - `paid`: boolean (default false)
- **Zod Schema**:
  ```typescript
  z.object({
    id: z.string(),
    type: z.enum(["INCOME", "EXPENSE"]),
    name: z.string(),
    amount: z.number().min(0),
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    categoryId: z.string().optional(),
    paymentMethod: z.enum(["CASH", "PIX", "DEBIT", "CREDIT"]).optional(),
    creditCardId: z.string().optional(),
    paid: z.boolean().default(false)
  })
  ```

### CreditCard
- **Fields**:
  - `id`: string
  - `name`: string
  - `limitAmount`: number
  - `closingDay`: integer (1-31)
  - `dueDay`: integer (1-31)
- **Zod Schema**:
  ```typescript
  z.object({
    id: z.string(),
    name: z.string(),
    limitAmount: z.number().min(0),
    closingDay: z.number().int().min(1).max(31),
    dueDay: z.number().int().min(1).max(31)
  })
  ```

## Tool Input Schemas

These schemas define the arguments for the MCP tools.

### `create_category`
```typescript
z.object({
  name: z.string(),
  type: z.enum(["INCOME", "EXPENSE"])
})
```

### `create_transaction`
```typescript
z.object({
  type: z.enum(["INCOME", "EXPENSE"]),
  name: z.string(),
  amount: z.number().positive(),
  date: z.string().describe("ISO date string YYYY-MM-DD"),
  categoryId: z.string().optional(),
  paymentMethod: z.enum(["CASH", "PIX", "DEBIT", "CREDIT"]).optional(),
  creditCardId: z.string().optional()
})
```

### `get_transactions`
```typescript
z.object({
  month: z.string().regex(/^\d{4}-\d{2}$/).describe("Format: YYYY-MM")
})
```

### `pay_statement`
```typescript
z.object({
  cardId: z.string(),
  month: z.string().regex(/^\d{4}-\d{2}$/)
})
```
