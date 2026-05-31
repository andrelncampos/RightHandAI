[Capability: QA Unit .NET] Ao gerar testes unitários para .NET, siga estes templates e padrões.

## Template de teste xUnit

```csharp
public class {Class}Tests
{
    [Fact]
    public async Task {Method}_{Scenario}_{ExpectedResult}()
    {
        // Arrange
        using var db = TestDbContextFactory.Create();
        var service = new {Service}(db);

        // Act
        var result = await service.{Method}(..., CancellationToken.None);

        // Assert
        Assert.{Assertion}(result);
    }

    [Theory]
    [InlineData(...)]
    public async Task {Method}_{Scenario}_ReturnsExpected(params...)
    {
        // Arrange, Act, Assert
    }
}
```

## Naming convention

`{MethodUnderTest}_{Scenario}_{ExpectedBehavior}`

Exemplos:
- `Register_ValidInput_ReturnsDto`
- `Transition_InvalidState_ThrowsException`
- `List_FilterByStatus_ReturnsOnlyMatching`

## Mocks e infraestrutura

- **DbContext:** SQLite in-memory via `TestDbContextFactory.Create()` (já existe no projeto)
- **Interfaces:** `Moq` — `new Mock<IService>()`, `Setup`, `Verify`
- **HttpClient:** `MockHttpMessageHandler` para testes de integração HTTP
- **Tempo:** Injetar `TimeProvider` ou usar `DateTimeOffset.UtcNow` diretamente (sem mock de DateTime)

## Tenant isolation test

```csharp
[Fact]
public async Task {Method}_CrossTenant_ReturnsEmpty()
{
    // Arrange
    using var db = TestDbContextFactory.Create();
    var tenantA = Guid.NewGuid();
    var tenantB = Guid.NewGuid();
    // Criar dados com tenantA
    db.{Entity}.Add(new { TenantId = tenantA, ... });
    await db.SaveChangesAsync();

    // Act — consultar com tenantB
    var service = new {Service}(db);
    var result = await service.ListByTenantAsync(tenantB, CancellationToken.None);

    // Assert
    Assert.Empty(result);
}
```

## Anti-padrões de teste (NUNCA fazer)

| Errado | Correto |
|--------|---------|
| Testes dependentes de ordem de execução | Cada teste é independente (setup próprio) |
| Acesso a rede/API externa | Mock ou in-memory |
| `Thread.Sleep` / `Task.Delay` para sincronização | Usar async/await corretamente |
| Assert sem contexto em cenários complexos | Mensagem descritiva ou Assert específico |
| Testar implementação interna (private methods) | Testar comportamento público |
| Compartilhar estado entre testes | Novo DbContext/service por teste |

## Checklist pre-write (teste)

- [ ] Naming segue `{Method}_{Scenario}_{Expected}`?
- [ ] Arrange-Act-Assert separados claramente?
- [ ] Teste é independente (não depende de outro)?
- [ ] Mock apenas para dependências externas (não para o SUT)?
- [ ] CancellationToken.None passado em toda async?
