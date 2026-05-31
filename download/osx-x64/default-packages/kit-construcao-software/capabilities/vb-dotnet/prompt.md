[Capability: VB.NET] Ao escrever código Visual Basic .NET, siga estes padrões.

## Padrões obrigatórios

- **Option Strict On** — sempre no topo de cada arquivo
- **Option Explicit On** — sempre
- **PascalCase** para tudo público (métodos, propriedades, classes)
- **Async/Await** para operações I/O (nunca bloquear thread)
- **LINQ** para consultas em coleções
- **Using** para IDisposable (equivalente ao try/finally)
- **Nullable reference types** quando disponível

## Templates

**Classe de serviço:**
```vb
Option Strict On
Option Explicit On

Public Class OrderService
    Private ReadOnly _db As AppDbContext

    Public Sub New(db As AppDbContext)
        _db = db
    End Sub

    Public Async Function GetByIdAsync(id As Guid, ct As CancellationToken) As Task(Of OrderDto)
        Dim order = Await _db.Orders.FindAsync({id}, ct)
        If order Is Nothing Then Throw New KeyNotFoundException()
        Return MapToDto(order)
    End Function
End Class
```

**Using statement:**
```vb
Using connection As New SqlConnection(connectionString)
    Await connection.OpenAsync(ct)
    ' operações
End Using
```

## Anti-padrões (NUNCA fazer)

| Errado | Correto |
|--------|---------|
| `On Error Resume Next` | Try/Catch estruturado |
| Variantes (`Object` sem tipo) | Tipos explícitos |
| Late binding | Option Strict On + tipos |
| `ReDim Preserve` excessivo | `List(Of T)` |
| `GoTo` | Fluxo estruturado |
| Concatenação de SQL | Parâmetros (`@param`) |

## Interop com C#

- Referenciar bibliotecas C# normalmente (mesmo runtime .NET)
- Usar `NameOf()` para referências type-safe
- Nullable: `Dim x As String? = Nothing`
- Records não existem em VB — usar Class com ReadOnly properties

## Checklist pre-write (.vb)

- [ ] Option Strict On no topo?
- [ ] Option Explicit On no topo?
- [ ] PascalCase para público?
- [ ] Async/Await para I/O?
- [ ] Using para IDisposable?
- [ ] Sem On Error Resume Next?
