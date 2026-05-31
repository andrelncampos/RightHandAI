[Capability: Blazor WASM] Ao escrever componentes para Blazor WebAssembly, considere que o código roda 100% no browser. Estas regras complementam a capability blazor-app.

## Diferenças fundamentais WASM vs Server

- Execução client-side no browser (não no servidor)
- Sem SignalR — não há circuito persistente
- Comunicação com backend APENAS via HttpClient (API REST)
- Sem acesso direto a filesystem, banco de dados, ou serviços server-side
- Bundle size importa — cada DLL é baixada pelo browser
- Sem threads nativas (single-threaded via WASM)

## Anti-padrões WASM (NUNCA fazer)

| Errado | Por que | Correto |
|--------|---------|---------|
| Injetar `DbContext` | Não existe client-side | Usar HttpClient para chamar API |
| Usar `File.IO` | Sem filesystem no browser | Usar localStorage/sessionStorage |
| Scoped services como circuito | Não há circuito em WASM | Scoped = por request HTTP ou Singleton |
| Bundle > 5MB sem lazy loading | Download inicial lento | Lazy load assemblies pesados |
| Cookie de sessão para auth | WASM não gerencia cookies nativamente | Token JWT via header Authorization |
| `Thread.Sleep` ou `Task.Delay` longo | Bloqueia a UI thread | Usar async/await com operações curtas |

## Padrões obrigatórios

- `HttpClient` via DI (`builder.Services.AddHttpClient<IApiClient>(...)`)
- `IHttpClientFactory` para múltiplos endpoints
- Lazy loading de assemblies pesados (`LazyAssemblyLoader`)
- Armazenamento local via `localStorage`/`sessionStorage` (Blazored.LocalStorage ou JS interop)
- Autenticação via token JWT (AuthenticationStateProvider customizado)
- Tratamento de erros HTTP (401 → redirect login, 404 → not found, 500 → mensagem genérica)

## Checklist pre-write (WASM-specific)

Antes de escrever componente WASM, verificar:
- [ ] Componente depende de algo server-side? → Mover para API
- [ ] Novo pacote NuGet? → Verificar impacto no bundle size
- [ ] API endpoint que o componente chama existe?
- [ ] Dados sensíveis expostos no client? → Mover lógica para API
- [ ] Operação pesada? → Considerar Web Worker ou mover para API

## Quando usar WASM vs Server

- WASM: apps offline-first, SPAs com pouca dependência de servidor, PWAs
- Server: apps com muita lógica server-side, real-time, acesso direto a banco
