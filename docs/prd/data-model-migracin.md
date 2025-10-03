# Data model & migración

- Tabla propuesta `inventory` (ejemplo):

```sql
CREATE TABLE inventory (
  id uuid primary key,
  type text,
  name text,
  quantity numeric,
  unit text,
  notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  created_by uuid
);
```

- Añadir migration: `database/migrations/00xx_add_inventory_table.sql` (incluir índices sobre `type`, `created_at`).
