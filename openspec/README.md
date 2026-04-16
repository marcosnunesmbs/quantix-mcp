# OpenSpec — Quantix MCP Server

Especificações comportamentais do sistema, organizadas por domínio.

## Estrutura

### specs/
Source of truth — como o sistema atualmente se comporta.

| Domínio | Descrição | # Requirements |
|---------|-----------|:-:|
| [accounts](specs/accounts/spec.md) | Contas financeiras (CRUD + saldo) | 6 |
| [categories](specs/categories/spec.md) | Categorias de classificação (CRUD) | 5 |
| [credit-cards](specs/credit-cards/spec.md) | Cartões de crédito (CRUD + extratos + antecipação) | 10 |
| [credit-card-transactions](specs/credit-card-transactions/spec.md) | Transações de cartão de crédito (criar/atualizar) | 3 |
| [data](specs/data/spec.md) | Exportação e importação de backup | 3 |
| [settings](specs/settings/spec.md) | Configurações globais (usuário, idioma, moeda) | 3 |
| [subscriptions](specs/subscriptions/spec.md) | Assinaturas e pagamentos recorrentes | 8 |
| [summary](specs/summary/spec.md) | Resumo financeiro consolidado | 4 |
| [transactions](specs/transactions/spec.md) | Transações diretas (CASH, PIX, DEBIT) | 8 |
| [transfers](specs/transfers/spec.md) | Transferências entre contas | 5 |

**Total: 10 domínios, ~55 requirements**

### changes/
Modificações propostas. Cada change vive em sua própria pasta até ser mergeada.

## Convenções

- Requisitos usam keywords RFC 2119 (SHALL, MUST, SHOULD, MAY)
- Cenários seguem formato **WHEN**/**THEN**
- Specs descrevem **comportamento**, não implementação
- Delta specs vivem em `changes/<name>/specs/` e são syncadas para `specs/` ao arquivar
