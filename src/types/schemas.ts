import { z } from 'zod';

// --- Domain Entities ---

export const CategorySchema = z.object({
  id: z.string(),
  name: z.string(),
  type: z.enum(["INCOME", "EXPENSE"]),
  createdAt: z.string().datetime().optional() // Optional in response mainly? Spec says req.
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

export const SummarySchema = z.object({
  month: z.string(),
  income: z.number(),
  expenses: z.number(),
  balance: z.number(),
  creditCardStatements: z.array(z.any()).optional() // Simplification
});

// --- Tool Inputs ---

export const CreateCategoryInput = z.object({
  name: z.string(),
  type: z.enum(["INCOME", "EXPENSE"])
});

export const CreateCreditCardInput = z.object({
  name: z.string(),
  brand: z.string().optional(),
  limitAmount: z.number().min(0),
  closingDay: z.number().int().min(1).max(31),
  dueDay: z.number().int().min(1).max(31)
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
  installments: z.number().int().min(1).optional(), // From CreateTransactionRequest in spec
  targetDueMonth: z.string().optional(), // From CreateTransactionRequest in spec
  recurrence: z.object({
    frequency: z.enum(["MONTHLY", "WEEKLY", "YEARLY"]),
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
  month: z.string().regex(/^\d{4}-\d{2}$/, "Format: YYYY-MM").describe("Format: YYYY-MM")
});

export const PayStatementInput = z.object({
  cardId: z.string(),
  month: z.string().regex(/^\d{4}-\d{2}$/, "Format: YYYY-MM"),
  paymentAccountId: z.string()
});

export const GetSummaryInput = z.object({
  month: z.string().regex(/^\d{4}-\d{2}$/, "Format: YYYY-MM").describe("Format: YYYY-MM")
});
