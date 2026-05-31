[Capability: Delphi] Ao escrever código Delphi (Object Pascal), siga estes padrões e templates.

## Convenções de naming

- `T` prefixo para classes (`TCustomer`, `TOrderService`)
- `I` prefixo para interfaces (`IRepository`, `ILogger`)
- `F` prefixo para campos privados (`FName`, `FConnection`)
- PascalCase para métodos, propriedades, tipos
- camelCase para variáveis locais e parâmetros

## Gerenciamento de memória

- **try/finally** para todo objeto criado manualmente
- **FreeAndNil** para liberar e anular referência
- Create/Free sempre pareados no mesmo escopo
- Owner pattern: componentes com Owner são liberados automaticamente
- Interfaces com reference counting: não misturar com Free manual

```pascal
LList := TStringList.Create;
try
  // usar LList
finally
  FreeAndNil(LList);
end;
```

## FireDAC

- Connection pooling via `TFDManager`
- Queries SEMPRE parametrizadas (`ParamByName`)
- Transactions explícitas para operações múltiplas
- `TFDQuery` para queries, `TFDStoredProc` para procedures
- Fechar datasets após uso (`Close`)

```pascal
FDQuery.SQL.Text := 'SELECT * FROM Customers WHERE Id = :Id';
FDQuery.ParamByName('Id').AsInteger := ACustomerId;
FDQuery.Open;
try
  // processar
finally
  FDQuery.Close;
end;
```

## Anti-padrões (NUNCA fazer)

| Errado | Correto |
|--------|---------|
| Variáveis globais | Injeção via construtor ou propriedade |
| `with` statement | Variável local explícita |
| `Application.ProcessMessages` | Threads ou async |
| BDE (Borland Database Engine) | FireDAC |
| Lógica em event handlers | Extrair para service/method |
| Strings concatenadas em SQL | Parâmetros (`ParamByName`) |

## Templates

**Service class:**
```pascal
type
  TOrderService = class
  private
    FConnection: TFDConnection;
  public
    constructor Create(AConnection: TFDConnection);
    function GetById(AId: Integer): TOrder;
    procedure Save(AOrder: TOrder);
  end;
```

**Separação form/lógica:**
- Form apenas para UI (eventos delegam para service)
- Service contém lógica de negócio
- Data module contém conexões e queries

## Checklist pre-write (.pas/.dfm)

- [ ] Naming segue convenções (T, I, F)?
- [ ] Memória gerenciada (try/finally, FreeAndNil)?
- [ ] Queries parametrizadas (não concatenação)?
- [ ] Lógica fora do form (em service)?
- [ ] Sem variáveis globais?
- [ ] Sem `with`?
