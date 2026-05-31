[Capability: SQL Server] Ao trabalhar com SQL Server, siga estas regras para migrations, índices e queries.

## Migration Safe

- NUNCA alterar migration existente (já aplicada em produção)
- Sempre criar nova migration para qualquer mudança de schema
- Testar rollback (Down) de toda migration antes de considerar pronta
- Naming: `{Timestamp}_{Descricao}.cs` (ex: `20240115_AddTenantIdToOrders.cs`)
- Usar `migrationBuilder.Sql()` para operações que EF não suporta nativamente
- Verificar se migration é idempotente (pode rodar 2x sem erro)

## Índices

- Clustered: 1 por tabela, geralmente na PK
- Nonclustered: para colunas usadas em WHERE, JOIN, ORDER BY
- INCLUDE: adicionar colunas lidas frequentemente para evitar key lookup
- Naming: `IX_{Table}_{Column1}_{Column2}`
- Não criar índice para tabelas < 1000 rows (overhead > benefício)
- Índice composto: coluna mais seletiva primeiro

## Anti-padrões (NUNCA fazer)

| Errado | Correto |
|--------|---------|
| `SELECT *` | Listar colunas explicitamente |
| Cursors para lógica de negócio | Set-based operations (UPDATE...FROM, MERGE) |
| `NOLOCK` indiscriminado | Usar apenas em relatórios read-only com dados tolerantes a dirty reads |
| Triggers complexas | Lógica no application layer |
| Queries não-parametrizadas | SEMPRE parametrizar (`@param`) |
| `LIKE '%texto%'` em tabelas grandes | Full-text search ou índice invertido |

## Padrões T-SQL

- **Paginação:** `OFFSET @skip ROWS FETCH NEXT @take ROWS ONLY`
- **Upsert:** `MERGE` com `WHEN MATCHED` / `WHEN NOT MATCHED`
- **Legibilidade:** CTEs (`WITH cte AS (...)`) para subqueries complexas
- **Strings:** `NVARCHAR` para texto com caracteres especiais, `VARCHAR` para ASCII puro
- **Diagnóstico:** `SET STATISTICS IO ON` + execution plan para otimização
- **Datas:** `DATETIMEOFFSET` para timestamps com timezone, `DATETIME2` para local

## Checklist pre-write (SQL/Migration)

- [ ] Migration nova (não alteração de existente)?
- [ ] Rollback (Down) implementado e testado?
- [ ] Índices para colunas em WHERE/JOIN?
- [ ] Queries parametrizadas (sem concatenação de string)?
- [ ] NVARCHAR para campos de texto do usuário?
