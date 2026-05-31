[Capability: .NET API] Ao escrever código backend ASP.NET Core, siga estas regras e templates.

## Templates

**Use Case (Command/Query + Validator + Handler em 1 arquivo):**
```csharp
// Arquivo: Features/{Feature}/{Action}Handler.cs
public record {Action}Command(/* params */);
public class {Action}Validator { /* FluentValidation rules */ }
public class {Action}Handler
{
    private readonly AppDbContext _db;
    public {Action}Handler(AppDbContext db) => _db = db;
    public async Task<{Result}> HandleAsync({Action}Command cmd, CancellationToken ct) { /* lógica */ }
}
```

**Controller thin:**
```csharp
[ApiController]
[Route("api/[controller]")]
[Authorize]
public class {Entity}Controller : ControllerBase
{
    private readonly {Action}Handler _handler;
    public {Entity}Controller({Action}Handler handler) => _handler = handler;

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateRequest req, CancellationToken ct)
        => Ok(await _handler.HandleAsync(new(req.Field1, req.Field2), ct));
}
```
Zero try/catch no controller. Zero lógica de negócio. Apenas delega para handler.

**Entity Type Configuration:**
```csharp
public class {Entity}Configuration : IEntityTypeConfiguration<{Entity}>
{
    public void Configure(EntityTypeBuilder<{Entity}> builder)
    {
        builder.HasKey(e => e.Id);
        builder.Property(e => e.Name).HasMaxLength(200).IsRequired();
        builder.HasIndex(e => e.TenantId);
    }
}
```

**DTO contracts (records em Shared):**
```csharp
public record {Entity}Dto(Guid Id, string Name, /* campos */);
public record Create{Entity}Request(string Name, /* campos */);
public record Update{Entity}Request(string Name, /* campos */);
```

## Anti-padrões (NUNCA fazer)

| Errado | Correto |
|--------|---------|
| Repository pattern | EF Core direto no handler |
| MediatR | Handler injetado diretamente |
| AutoMapper | Mapeamento manual (explícito) |
| Minimal APIs | Controllers com [ApiController] |
| `BadRequest(new { error = "..." })` | Exceção tipada + middleware |
| `StatusCode(422, ...)` | `UnprocessableEntity()` ou exceção |
| try/catch no controller | Middleware de exceção global |
| `.Result` ou `.Wait()` | async/await |
| `async void` | `async Task` |

## Padrões obrigatórios

- Nullable reference types habilitado
- Records para DTOs (imutáveis)
- async/await em toda operação I/O
- DI nativa (construtor, sem ServiceLocator)
- EF Core direto (sem camada repository)
- `AsNoTracking()` em toda query de leitura
- `DateTime.UtcNow` (nunca DateTime.Now)
- `CancellationToken` em toda operação async
- Pattern matching e switch expressions quando legível

## Checklist pre-write (.cs)

- [ ] PascalCase para público, _camelCase para privado
- [ ] Usings organizados (sem desnecessários)
- [ ] CancellationToken em toda async
- [ ] AsNoTracking em queries de leitura
- [ ] Nullable annotations corretas (string? vs string)
- [ ] Sem lógica no controller (apenas delegação)
