[Capability: Blazor Web App] Ao escrever componentes .razor para Blazor Server/Web App com MudBlazor, siga estas regras.

## Templates

**Form.razor (create+edit unificado):**
- Dual @page: `@page "/entidade/criar"` e `@page "/entidade/{Id:guid}/editar"`
- `EditForm OnSubmit="SaveAsync"` (NUNCA OnValidSubmit)
- `LoadAsync` carrega todos os campos do UpdateRequest quando Id presente
- `SaveAsync` trata 400/404/409 com ServerValidationMessageStore
- Zero `<FluentValidationValidator />` ou `<DataAnnotationsValidator />`

**List.razor (MudDataGrid):**
- `MudDataGrid T="EntidadeDto"` com ServerData para paginação server-side
- Colunas tipadas com `PropertyColumn` ou `TemplateColumn`
- Botões de ação por linha (editar, excluir com confirmação)
- Estado loading com `MudProgressLinear`

**Detail.razor (somente leitura):**
- 5 estados: loading (skeleton), empty (não encontrado), error (mensagem), not-found (404), success (dados)
- Sem formulário — apenas exibição com `MudCard` ou `MudSimpleTable`

## Anti-padrões (NUNCA fazer)

| Errado | Correto |
|--------|---------|
| `OnValidSubmit` | `OnSubmit` |
| `<FluentValidationValidator />` | Validação server-side via middleware |
| Create.razor + Edit.razor separados | Form.razor unificado com dual @page |
| `Style="color:#6C3FE0"` | Classes CSS ou Color enum |
| `style="padding:16px"` | Classes MudBlazor (Class="pa-4") |
| JavaScript interop para UI | Componentes MudBlazor nativos |

## Checklist pre-write (.razor)

Antes de escrever QUALQUER arquivo .razor, verificar:
- [ ] `T` explícito em todo genérico MudBlazor (`MudSelect T="string"`, `MudDataGrid T="Dto"`)
- [ ] `Variant.Outlined` (não string "Outlined")
- [ ] 5 estados UI implementados (loading, empty, error, not-found, success)
- [ ] PT-BR em todo texto visível ao usuário
- [ ] Zero `Style="..."` com hex ou px inline
- [ ] `@code` ou code-behind (.razor.cs) para componentes > 50 linhas

## Pitfalls MudBlazor

| Pitfall | Errado | Correto |
|---------|--------|---------|
| MudSelect sem T | `<MudSelect @bind-Value="_x">` | `<MudSelect T="string" Value="_x" ValueChanged="OnChanged">` |
| MudChip content | `<MudChip>Label</MudChip>` | `<MudChip T="string" Text="Label" />` |
| MudIconButton Title | `Title="tooltip"` | Omitir (usar MudTooltip wrapper) |
| MudMenu Label | `Label="Menu"` | `ButtonText="Menu"` |

## Padrões obrigatórios

- `[Parameter]` para props de componente
- `@inject` para DI (nunca construtor em .razor)
- `OnInitializedAsync` para carregamento inicial
- Code-behind (.razor.cs) para componentes complexos (> 50 linhas de @code)
- `CancellationToken` em toda operação async
- `StateHasChanged()` apenas quando necessário (não após cada operação)
- Scoped services para estado por circuito SignalR
