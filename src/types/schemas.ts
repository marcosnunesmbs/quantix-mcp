import { z } from 'zod';

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
  month: z.string(),
  income: z.number(),
  expenses: z.number(),
  balance: z.number(),
  creditCardStatements: z.array(z.any()).optional()
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
  amount: z.number().positive(),
  date: z.string().describe("ISO date string YYYY-MM-DD"),
  categoryId: z.string().optional(),
  paymentMethod: z.enum(["CASH", "PIX", "DEBIT", "CREDIT"]).optional(),
  creditCardId: z.string().optional(),
  accountId: z.string().optional(),
  installments: z.number().int().min(1).optional(),
  targetDueMonth: z.string().regex(/^\d{4}-\d{2}$/).optional(),
  recurrence: z.object({
    frequency: z.enum(["MONTHLY", "WEEKLY", "YEARLY"]),
    interval: z.number().int().min(1).optional(),
    endDate: z.string().optional()
  }).optional()
});

export const UpdateTransactionInput = z.object({
  id: z.string(),
  mode: z.enum(["SINGLE", "PENDING", "ALL"]).default("SINGLE").optional(),
  type: z.enum(["INCOME", "EXPENSE"]).optional(),
  name: z.string().optional(),
  amount: z.number().positive().optional(),
  date: z.string().describe("ISO date string YYYY-MM-DD").optional(),
  categoryId: z.string().optional(),
  paymentMethod: z.enum(["CASH", "PIX", "DEBIT", "CREDIT"]).optional(),
  creditCardId: z.string().optional(),
  accountId: z.string().optional(),
  targetDueMonth: z.string().regex(/^\d{4}-\d{2}$/).optional(),
  recurrence: z.object({
    frequency: z.enum(["MONTHLY", "WEEKLY", "YEARLY"]).optional(),
    interval: z.number().int().min(1).optional(),
    endDate: z.string().optional()
  }).optional()
});

export const CreateAccountInput = z.object({
  name: z.string(),
  type: z.enum(["BANK_ACCOUNT", "WALLET", "SAVINGS_ACCOUNT", "INVESTMENT_ACCOUNT", "OTHER"]),
  initialBalance: z.number()
});

export const UpdateAccountInput = z.object({
  id: z.string(),
  name: z.string().optional(),
  type: z.enum(["BANK_ACCOUNT", "WALLET", "SAVINGS_ACCOUNT", "INVESTMENT_ACCOUNT", "OTHER"]).optional()
});

export const GetTransactionsInput = z.object({
  month: z.string().regex(/^\d{4}-\d{2}$/, "Format: YYYY-MM").describe("Format: YYYY-MM").optional()
});

export const PayStatementInput = z.object({
  cardId: z.string(),
  month: z.string().regex(/^\d{4}-\d{2}$/, "Format: YYYY-MM"),
  paymentAccountId: z.string()
});

export const GetSummaryInput = z.object({
  month: z.string().regex(/^\d{4}-\d{2}$/, "Format: YYYY-MM").describe("Format: YYYY-MM")
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
