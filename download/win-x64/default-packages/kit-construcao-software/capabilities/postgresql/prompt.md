[Capability: PostgreSQL] Ao trabalhar com PostgreSQL, siga estas regras para tipos, índices, queries e migrations.

## Padrões PostgreSQL

- **jsonb** para dados JSON (não json — jsonb é indexável e mais rápido)
- **uuid** nativo como tipo de coluna (não TEXT para GUIDs)
- **ILIKE** para busca case-insensitive (não LOWER() + LIKE)
- **ON CONFLICT** para upsert (não SELECT + INSERT/UPDATE separados)
- **timestamp with time zone** para datas (nunca timestamp sem timezone)
- **TEXT** para strings sem limite (não VARCHAR(n) sem motivo — PostgreSQL trata igual internamente)
- **LIMIT/OFFSET** para paginação
- **CTEs** e window functions para queries complexas

## Índices

| Tipo | Quando usar | Exemplo |
|------|-------------|---------|
| BTREE | Padrão — igualdade, range, ORDER BY | `CREATE INDEX ix_orders_date ON orders(created_at)` |
| GIN | jsonb, arrays, full-text search | `CREATE INDEX ix_data_props ON items USING GIN(properties)` |
| GIST | Geoespacial, ranges, exclusion constraints | `CREATE INDEX ix_events_range ON events USING GIST(period)` |

- Usar `EXPLAIN ANALYZE` para validar que índice é usado
- Naming: `ix_{table}_{column}`
- Índices parciais: `WHERE condition` para filtrar rows irrelevantes

## Anti-padrões (NUNCA fazer)

| Errado | Correto |
|--------|---------|
| `SELECT *` | Listar colunas |
| Cursors para lógica | Set-based operations |
| Queries não-parametrizadas | `$1, $2` ou `@param` via driver |
| `VARCHAR(255)` sem motivo | `TEXT` (performance idêntica em PostgreSQL) |
| `LIKE '%x%'` em tabelas grandes | Full-text search com `tsvector` + GIN |
| Funções PL/pgSQL quando SQL puro resolve | SQL direto |

## Migration Safe

- NUNCA alterar migration existente
- Sempre criar nova migration
- Testar rollback
- Usar `IF NOT EXISTS` em CREATE TABLE/INDEX
- Migrations devem ser idempotentes
- Para renomear coluna: criar nova → copiar dados → dropar antiga (em migrations separadas)

## Checklist pre-write (PostgreSQL)

- [ ] Tipos corretos? (uuid, jsonb, timestamptz, TEXT)
- [ ] Índices para colunas em WHERE/JOIN?
- [ ] GIN para jsonb/arrays?
- [ ] ON CONFLICT para upserts?
- [ ] Queries parametrizadas?
- [ ] Migration nova (não alteração)?
