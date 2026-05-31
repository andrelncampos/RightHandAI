[Capability: QA Migration DB] Ao gerar testes de integridade de migrations, siga estes templates.

## Teste de aplicação (Up)

```csharp
[Fact]
public async Task Migration_{Name}_AppliesCorrectly()
{
    // Arrange — banco limpo (SQLite :memory: ou container)
    using var db = CreateEmptyDb();

    // Act — aplicar migration
    await db.Database.MigrateAsync();

    // Assert — verificar schema
    var tables = await GetTableNames(db);
    Assert.Contains("ExpectedTable", tables);

    var columns = await GetColumnNames(db, "ExpectedTable");
    Assert.Contains("ExpectedColumn", columns);
}
```

## Teste de rollback (Down)

```csharp
[Fact]
public async Task Migration_{Name}_RollbackWorks()
{
    using var db = CreateEmptyDb();

    // Apply
    await db.Database.MigrateAsync();
    var tablesAfterUp = await GetTableNames(db);
    Assert.Contains("NewTable", tablesAfterUp);

    // Rollback — usar migrator para reverter
    var migrator = db.GetInfrastructure().GetRequiredService<IMigrator>();
    await migrator.MigrateAsync("PreviousMigration");

    // Verify rollback
    var tablesAfterDown = await GetTableNames(db);
    Assert.DoesNotContain("NewTable", tablesAfterDown);
}
```

## Teste de idempotência

```csharp
[Fact]
public async Task Migration_{Name}_IsIdempotent()
{
    using var db = CreateEmptyDb();

    // Aplicar 2x — não deve lançar exceção
    await db.Database.MigrateAsync();
    await db.Database.MigrateAsync(); // segunda vez = noop

    // Se usar SQL direto: verificar IF NOT EXISTS
}
```

## Anti-padrões (NUNCA fazer)

| Errado | Correto |
|--------|---------|
| Testar contra banco de produção | Banco in-memory ou container isolado |
| Migration sem Down implementado | Sempre implementar rollback |
| Perder dados sem aviso | Migrations destrutivas com comentário explícito |
| Assumir que migration roda 1x | Testar idempotência (IF NOT EXISTS) |
| Alterar migration já aplicada | Criar nova migration |

## Checklist pre-write (migration test)

- [ ] Banco isolado (não compartilhado)?
- [ ] Up testado (schema correto após aplicar)?
- [ ] Down testado (schema volta ao anterior)?
- [ ] Idempotência testada (2x sem erro)?
- [ ] Dados existentes preservados (se migration não é destrutiva)?
