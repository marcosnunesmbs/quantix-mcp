import { z } from 'zod';

// --- Transfer Entities ---
export const TransferSchema = z.object({
  id: z.string(),
  sourceAccountId: z.string(),
  destinationAccountId: z.string(),
  amount: z.number().min(0.01),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  createdAt: z.string().datetime().optional(),
  updatedAt: z.string().datetime().optional(),
});

export const CreateTransferRequestSchema = z.object({
  sourceAccountId: z.string().describe("Source account ID (required — must ask the user if not provided, do not assume or default)"),
  destinationAccountId: z.string().describe("Destination account ID (required — must ask the user if not provided, do not assume or default)"),
  amount: z.number().min(0.01).describe("Transfer amount (required — must ask the user if not provided, do not assume or default)"),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).describe("Transfer date (required — must ask the user if not provided, do not assume or default)"),
});

export const UpdateTransferRequestSchema = z.object({
  sourceAccountId: z.string().optional(),
  destinationAccountId: z.string().optional(),
  amount: z.number().min(0.01).optional(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
});

// --- Domain Entities ---

export const CategorySchema = z.object({
  id: z.string(),
  name: z.string(),
  type: z.enum(["INCOME", "EXPENSE"]),
  color: z.string().optional(),
  createdAt: z.string().datetime().optional()
});

export const TransactionSchema = z.object({
  id: z.string(),
  type: z.enum(["INCOME", "EXPENSE"]),
  name: z.string(),
  amount: z.number().min(0),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format YYYY-MM-DD"),
  categoryId: z.string().optional(),
  paymentMethod: z.enum(["CASH", "PIX", "DEBIT", "CREDIT"]).optional(),
  creditCardId: z.string().optional(),
  installmentGroupId: z.string().optional(),
  installmentNumber: z.number().int().optional(),
  installmentTotal: z.number().int().optional(),
  recurrenceRuleId: z.string().optional(),
  accountId: z.string().optional(),
  paid: z.boolean().default(false),
  createdAt: z.string().datetime().optional()
});

export const CreditCardSchema = z.object({
  id: z.string(),
  name: z.string(),
  brand: z.string().optional(),
  limitAmount: z.number().min(0),
  closingDay: z.number().int().min(1).max(31),
  dueDay: z.number().int().min(1).max(31),
  createdAt: z.string().datetime().optional()
});

export const AccountSchema = z.object({
  id: z.string(),
  name: z.string(),
  type: z.enum(["BANK_ACCOUNT", "WALLET", "SAVINGS_ACCOUNT", "INVESTMENT_ACCOUNT", "OTHER"]),
  initialBalance: z.number(),
  currentBalance: z.number().optional(),
  createdAt: z.string().datetime().optional(),
  updatedAt: z.string().datetime().optional()
});

export const AccountBalanceSchema = z.object({
  accountId: z.string(),
  currentBalance: z.number(),
  calculatedAt: z.string().datetime()
});

export const StatementSchema = z.object({
  cardId: z.string(),
  periodStart: z.string(),
  periodEnd: z.string(),
  dueDate: z.string(),
  transactions: z.array(TransactionSchema).optional(),
  total: z.number(),
  availableLimit: z.number()
});

export const StatementStatusSchema = z.object({
  cardId: z.string(),
  month: z.string(),
  isPaid: z.boolean()
});

export const SummarySchema = z.object({
  period: z.object({
    month: z.string().optional(),
    startDate: z.string().optional(),
    endDate: z.string().optional()
  }).optional(),
  income: z.number(),
  expenses: z.number(),
  pendingIncome: z.number().optional(),
  pendingExpenses: z.number().optional(),
  balance: z.number(),
  creditCardExpenses: z.array(z.any()).optional(),
  expensesByCategory: z.array(z.any()).optional(),
  incomeByCategory: z.array(z.any()).optional(),
  accounts: z.array(z.any()).optional(),
  totalBalance: z.number().optional()
});

export const SettingsSchema = z.object({
  userName: z.string(),
  language: z.enum(["pt-BR", "en-US"]),
  currency: z.enum(["BRL", "USD", "EUR", "GBP", "JPY", "CAD", "AUD", "CHF"]),
  createdAt: z.string().datetime().optional(),
  updatedAt: z.string().datetime().optional()
});

// --- Tool Inputs ---

export const CreateCategoryInput = z.object({
  name: z.string(),
  type: z.enum(["INCOME", "EXPENSE"]),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/, "Invalid hex color").optional()
});

export const UpdateCategoryInput = z.object({
  id: z.string(),
  name: z.string().optional(),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/, "Invalid hex color").optional()
});

export const CreateCreditCardInput = z.object({
  name: z.string(),
  brand: z.string().optional(),
  limitAmount: z.number().min(0),
  closingDay: z.number().int().min(1).max(31),
  dueDay: z.number().int().min(1).max(31)
});

export const UpdateCreditCardInput = z.object({
  id: z.string(),
  name: z.string().optional(),
  brand: z.string().optional(),
  limitAmount: z.number().min(0).optional(),
  closingDay: z.number().int().min(1).max(31).optional(),
  dueDay: z.number().int().min(1).max(31).optional()
});

export const CreateTransactionInput = z.object({
  type: z.enum(["INCOME", "EXPENSE"]),
  name: z.string(),
  amount: z.number().nonnegative().describe("Transaction amount (required — must ask the user if not provided, do not assume or default)"),
  date: z.string().describe("ISO date string YYYY-MM-DD"),
  categoryId: z.string().optional(),
  paymentMethod: z.enum(["CASH", "PIX", "DEBIT", "CREDIT"]).optional(),
  creditCardId: z.string().optional(),
  accountId: z.string().optional(),
  installments: z.number().int().min(1).optional(),
  targetDueMonth: z.string().regex(/^\d{4}-\d{2}$/).optional(),
  purchaseDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).describe("Actual purchase date (credit card only), YYYY-MM-DD").optional(),
  isPaid: z.boolean().describe("Whether the transaction is already paid at creation time").optional(),
  recurrence: z.object({
    frequency: z.enum(["MONTHLY", "WEEKLY", "YEARLY"]),
    interval: z.number().int().min(1).optional(),
    endDate: z.string().optional(),
    occurrences: z.number().int().min(2).describe("Number of occurrences (mutually exclusive with endDate)").optional()
  }).optional()
});

export const UpdateTransactionInput = z.object({
  id: z.string(),
  mode: z.enum(["SINGLE", "PENDING", "ALL"]).default("SINGLE").optional(),
  type: z.enum(["INCOME", "EXPENSE"]).optional(),
  name: z.string().optional(),
  amount: z.number().nonnegative().optional(),
  date: z.string().describe("ISO date string YYYY-MM-DD").optional(),
  categoryId: z.string().optional(),
  paymentMethod: z.enum(["CASH", "PIX", "DEBIT", "CREDIT"]).optional(),
  creditCardId: z.string().optional(),
  accountId: z.string().optional(),
  installments: z.number().int().min(1).optional(),
  targetDueMonth: z.string().regex(/^\d{4}-\d{2}$/).optional(),
  isPaid: z.boolean().optional(),
  purchaseDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).describe("Actual purchase date (credit card only), YYYY-MM-DD").optional(),
  recurrence: z.object({
    frequency: z.enum(["MONTHLY", "WEEKLY", "YEARLY"]).optional(),
    interval: z.number().int().min(1).optional(),
    endDate: z.string().optional(),
    occurrences: z.number().int().min(2).describe("Number of occurrences (mutually exclusive with endDate)").optional()
  }).optional()
});

export const CreateAccountInput = z.object({
  name: z.string(),
  type: z.enum(["BANK_ACCOUNT", "WALLET", "SAVINGS_ACCOUNT", "INVESTMENT_ACCOUNT", "OTHER"]),
  initialBalance: z.number().optional()
});

export const UpdateAccountInput = z.object({
  id: z.string(),
  name: z.string().optional(),
  type: z.enum(["BANK_ACCOUNT", "WALLET", "SAVINGS_ACCOUNT", "INVESTMENT_ACCOUNT", "OTHER"]).optional(),
  initialBalance: z.number().optional()
});

export const GetTransactionsInput = z.object({
  month: z.string().regex(/^\d{4}-\d{2}$/, "Format: YYYY-MM").describe("Filter by month, format: YYYY-MM").optional(),
  accountId: z.string().describe("Filter by account ID").optional(),
  categoryId: z.string().describe("Filter by category ID").optional(),
  creditCardId: z.string().describe("Filter by credit card ID").optional(),
  type: z.enum(["INCOME", "EXPENSE"]).describe("Filter by transaction type").optional(),
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).describe("Filter from this date (inclusive), YYYY-MM-DD").optional(),
  endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).describe("Filter up to this date (inclusive), YYYY-MM-DD").optional(),
  paid: z.boolean().describe("Filter by payment status (true = paid, false = unpaid)").optional()
});

export const PayStatementInput = z.object({
  cardId: z.string(),
  month: z.string().regex(/^\d{4}-\d{2}$/, "Format: YYYY-MM"),
  paymentAccountId: z.string()
});

export const ReopenStatementInput = z.object({
  cardId: z.string().describe('Credit card ID'),
  month: z.string().regex(/^\d{4}-\d{2}$/, "Format: YYYY-MM").describe('Month in YYYY-MM format')
});

export const GetSummaryInput = z.object({
  month: z.string().regex(/^\d{4}-\d{2}$/, "Format: YYYY-MM").describe("Month in YYYY-MM format (use this OR startDate+endDate)").optional(),
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).describe("Start date for custom range, YYYY-MM-DD (use with endDate)").optional(),
  endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).describe("End date for custom range, YYYY-MM-DD (use with startDate)").optional()
});

export const CreateSettingsInput = z.object({
  userName: z.string(),
  language: z.enum(["pt-BR", "en-US"]),
  currency: z.enum(["BRL", "USD", "EUR", "GBP", "JPY", "CAD", "AUD", "CHF"])
});

export const UpdateSettingsInput = z.object({
  userName: z.string().optional(),
  language: z.enum(["pt-BR", "en-US"]).optional(),
  currency: z.enum(["BRL", "USD", "EUR", "GBP", "JPY", "CAD", "AUD", "CHF"]).optional()
});

export const CreateAnticipationInput = z.object({
  cardId: z.string().describe('Credit card ID'),
  name: z.string().describe('Name/description of the anticipation'),
  amount: z.number().min(0.01).describe('Amount to anticipate'),
  purchaseDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).describe('Date the money leaves the account (YYYY-MM-DD)'),
  targetDueMonth: z.string().regex(/^\d{4}-\d{2}$/).describe('Target statement due month (YYYY-MM)'),
  accountId: z.string().describe('Account ID from which money will be debited'),
  categoryId: z.string().optional().describe('Category ID for both transactions')
});

export const ImportDataInput = z.object({
  mode: z.enum(["reset", "increment"]).describe("reset: clears all data before import; increment: adds new records, skipping existing IDs"),
  version: z.string().describe('Export format version, must be "1.0"'),
  exportedAt: z.string().datetime().describe("ISO timestamp of when the data was exported"),
  data: z.object({
    settings: z.any().nullable().optional(),
    categories: z.array(z.any()).optional(),
    accounts: z.array(z.any()).optional(),
    creditCards: z.array(z.any()).optional(),
    recurrenceRules: z.array(z.any()).optional(),
    transactions: z.array(z.any()).optional()
  })
});
