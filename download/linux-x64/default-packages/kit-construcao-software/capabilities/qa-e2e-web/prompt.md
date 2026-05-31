[Capability: QA E2E Web] Ao gerar testes end-to-end para aplicações web, siga estes templates (Cypress/Playwright).

## Template de teste E2E

```javascript
// Cypress
describe('Feature: {Nome}', () => {
  beforeEach(() => {
    cy.visit('/pagina');
  });

  it('deve {comportamento esperado}', () => {
    cy.get('[data-testid="campo-nome"]').type('Valor');
    cy.get('[data-testid="btn-salvar"]').click();
    cy.get('[data-testid="mensagem-sucesso"]').should('be.visible');
  });
});
```

```javascript
// Playwright
test.describe('Feature: {Nome}', () => {
  test('deve {comportamento esperado}', async ({ page }) => {
    await page.goto('/pagina');
    await page.getByTestId('campo-nome').fill('Valor');
    await page.getByTestId('btn-salvar').click();
    await expect(page.getByTestId('mensagem-sucesso')).toBeVisible();
  });
});
```

## Seletores (OBRIGATÓRIO)

- SEMPRE usar `data-testid` como seletor principal
- Adicionar `data-testid` nos componentes durante implementação
- Naming: `{contexto}-{elemento}` (ex: `form-usuario-nome`, `btn-salvar`, `lista-itens`)

| Errado | Correto |
|--------|---------|
| `cy.get('.mud-button')` | `cy.get('[data-testid="btn-salvar"]')` |
| `cy.get('#app > div > button')` | `cy.get('[data-testid="btn-cancelar"]')` |
| `page.locator('text=Salvar')` | `page.getByTestId('btn-salvar')` |

## Page Objects

```javascript
// pages/LoginPage.js
export class LoginPage {
  visit() { cy.visit('/login'); }
  fillEmail(email) { cy.get('[data-testid="login-email"]').type(email); }
  fillPassword(pwd) { cy.get('[data-testid="login-password"]').type(pwd); }
  submit() { cy.get('[data-testid="login-submit"]').click(); }
  login(email, pwd) { this.fillEmail(email); this.fillPassword(pwd); this.submit(); }
}
```

Usar page objects para encapsular interações repetidas. Um arquivo por página/componente complexo.

## Sincronização

- Cypress: assertions automáticas com retry (cy.get espera até timeout)
- Playwright: `await expect(...).toBeVisible()` com auto-wait
- NUNCA usar `cy.wait(3000)` ou `page.waitForTimeout(3000)`
- Se precisa esperar API: `cy.intercept` + `cy.wait('@alias')` ou `page.waitForResponse`

## Anti-padrões (NUNCA fazer)

| Errado | Correto |
|--------|---------|
| `cy.wait(5000)` | `cy.intercept` + `cy.wait('@request')` |
| Seletores por classe CSS | `data-testid` |
| Testes dependentes de ordem | Cada teste é independente |
| Dados hardcoded no teste | Seed via API ou fixture |
| Testar sem app rodando | Configurar `baseUrl` + app em background |

## Checklist pre-write (E2E)

- [ ] `data-testid` adicionado nos componentes alvo?
- [ ] Page objects para interações repetidas?
- [ ] Sem waits fixos (usar intercept/waitForResponse)?
- [ ] Cada teste independente (não depende de outro)?
- [ ] Seed de dados via API (não via UI)?
