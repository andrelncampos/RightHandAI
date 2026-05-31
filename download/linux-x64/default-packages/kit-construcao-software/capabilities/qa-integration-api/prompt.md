[Capability: QA Integration API] Ao gerar testes de integração para API .NET, siga estes templates.

## Template WebApplicationFactory

```csharp
public class CustomWebApplicationFactory : WebApplicationFactory<Program>
{
    protected override void ConfigureWebHost(IWebHostBuilder builder)
    {
        builder.ConfigureServices(services =>
        {
            // Substituir banco real por in-memory
            var descriptor = services.SingleOrDefault(d => d.ServiceType == typeof(DbContextOptions<AppDbContext>));
            if (descriptor != null) services.Remove(descriptor);

            services.AddDbContext<AppDbContext>(options =>
                options.UseInMemoryDatabase("TestDb_" + Guid.NewGuid()));
        });
    }
}

public class {Entity}ApiTests : IClassFixture<CustomWebApplicationFactory>
{
    private readonly HttpClient _client;
    private readonly CustomWebApplicationFactory _factory;

    public {Entity}ApiTests(CustomWebApplicationFactory factory)
    {
        _factory = factory;
        _client = factory.CreateClient();
    }
}
```

## Validação de status codes

| Cenário | Status esperado | Verificação |
|---------|----------------|-------------|
| Criar com dados válidos | 201 Created | `Assert.Equal(HttpStatusCode.Created, response.StatusCode)` |
| Criar com dados inválidos | 400 Bad Request | Body contém erros de validação |
| Buscar existente | 200 OK | Body contém entidade |
| Buscar inexistente | 404 Not Found | — |
| Sem autenticação | 401 Unauthorized | — |
| Sem permissão | 403 Forbidden | — |
| Conflito (duplicata) | 409 Conflict | — |

## Seed de dados

```csharp
private async Task<Guid> SeedEntity()
{
    using var scope = _factory.Services.CreateScope();
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    var entity = new Entity { Id = Guid.NewGuid(), Name = "Test", ... };
    db.Entities.Add(entity);
    await db.SaveChangesAsync();
    return entity.Id;
}
```

Regras:
- Seed no Arrange de cada teste (não compartilhar entre testes)
- Usar `Guid.NewGuid()` para IDs (evitar colisão)
- InMemoryDatabase com nome único por fixture (isolamento)

## Anti-padrões (NUNCA fazer)

| Errado | Correto |
|--------|---------|
| Compartilhar dados entre testes | Seed próprio por teste |
| Depender de ordem de execução | Cada teste é independente |
| Testar contra banco real | InMemoryDatabase ou SQLite :memory: |
| Não verificar status code | Assert explícito do status |
| Ignorar body em erros 400 | Verificar mensagens de validação |

## Checklist pre-write (integração API)

- [ ] WebApplicationFactory configurada com banco in-memory?
- [ ] Cada teste faz seed próprio?
- [ ] Status code verificado explicitamente?
- [ ] Body deserializado e assertions nos campos?
- [ ] Cenários de erro cobertos (400, 401, 404)?
