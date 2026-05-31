[Capability: QA Unit JS] Ao gerar testes unitários para JavaScript/TypeScript, siga estes templates (Jest/Vitest).

## Template de teste

```typescript
describe('{Module}', () => {
  let service: {Service};

  beforeEach(() => {
    service = new {Service}(mockDependency);
  });

  it('should {expected behavior}', () => {
    // Arrange
    const input = { ... };

    // Act
    const result = service.method(input);

    // Assert
    expect(result).toEqual(expected);
  });

  it('should throw when {error condition}', () => {
    expect(() => service.method(invalid)).toThrow(ExpectedError);
  });
});
```

## Mocking

**Jest:**
```typescript
jest.mock('./dependency', () => ({
  fetchData: jest.fn().mockResolvedValue(mockData)
}));

const spy = jest.spyOn(service, 'method');
expect(spy).toHaveBeenCalledWith(expectedArgs);
```

**Vitest:**
```typescript
vi.mock('./dependency', () => ({
  fetchData: vi.fn().mockResolvedValue(mockData)
}));

const spy = vi.spyOn(service, 'method');
expect(spy).toHaveBeenCalledWith(expectedArgs);
```

## Coverage

- Thresholds mínimos: statements 80%, branches 70%, functions 80%, lines 80%
- Configurar em `jest.config.ts` ou `vitest.config.ts`
- Focar em lógica de negócio (não em boilerplate/UI)
- Relatório: `--coverage` flag

## Anti-padrões (NUNCA fazer)

| Errado | Correto |
|--------|---------|
| Testes dependentes de ordem | Cada teste é independente (beforeEach limpa) |
| Mocks globais (sem restore) | `jest.restoreAllMocks()` em afterEach |
| Snapshot abuse (snapshots grandes) | Assertions específicas |
| Testar implementação interna | Testar comportamento público |
| `any` em mocks | Tipos explícitos nos mocks |
| setTimeout em testes | `jest.useFakeTimers()` / `vi.useFakeTimers()` |

## Checklist pre-write (teste JS/TS)

- [ ] describe/it com nomes descritivos?
- [ ] Arrange-Act-Assert separados?
- [ ] Mocks restaurados em afterEach?
- [ ] Sem dependência de ordem?
- [ ] Tipos explícitos (sem any)?
- [ ] Async tests com await?
