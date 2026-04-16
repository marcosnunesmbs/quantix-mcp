# Categories Specification

## Purpose
Gerenciamento de categorias de classificação para transações financeiras. Cada categoria é do tipo INCOME (receita) ou EXPENSE (despesa) e pode ter uma cor associada.

## Scope
O que está **incluído** nesta spec:
- CRUD completo de categorias
- Validação de tipo (INCOME/EXPENSE) e cor hexadecimal

O que está **fora do escopo**:
- Atribuição de categorias a transações (domínio: transactions)
- Hierarquia ou subcategorias

## Requirements

### Requirement: Create category
The system SHALL allow creating a new category with a name, type (INCOME or EXPENSE), and optional hex color.

#### Scenario: Create category with color
- **WHEN** the user provides `name`, `type`, and a valid hex color (e.g., `#FF5733`)
- **THEN** the system creates the category and returns it with the assigned ID

#### Scenario: Create category without color
- **WHEN** the user provides `name` and `type` but no color
- **THEN** the system creates the category with `color` as undefined/null

#### Scenario: Validation rejects invalid color format
- **WHEN** the user provides a color that is not a valid 6-digit hex
- **THEN** the Zod schema rejects the input

#### Scenario: Validation rejects invalid type
- **WHEN** the user provides a `type` not in INCOME/EXPENSE
- **THEN** the Zod schema rejects the input

### Requirement: List all categories
The system SHALL return all categories.

#### Scenario: Categories exist
- **WHEN** the user requests the category list
- **THEN** the system returns an array of all categories

#### Scenario: No categories exist
- **WHEN** no categories have been created
- **THEN** the system returns an empty array

### Requirement: Get category by ID
The system SHALL return a specific category by its ID.

#### Scenario: Category found
- **WHEN** the user requests a category with a valid ID
- **THEN** the system returns the category details

#### Scenario: Category not found
- **WHEN** the user requests a category with a non-existent ID
- **THEN** the system returns a 404 error

### Requirement: Update category
The system SHALL allow updating a category's name and/or color.

#### Scenario: Successful update
- **WHEN** the user provides a valid category ID and one or more fields to update
- **THEN** the system updates and returns the modified category

#### Scenario: Category not found on update
- **WHEN** the user attempts to update a non-existent category
- **THEN** the system returns a 404 error

### Requirement: Delete category
The system SHALL allow deleting a category by its ID.

#### Scenario: Successful deletion
- **WHEN** the user deletes a category with a valid ID
- **THEN** the system confirms the deletion

#### Scenario: Category not found on deletion
- **WHEN** the user attempts to delete a non-existent category
- **THEN** the system returns a 404 error
