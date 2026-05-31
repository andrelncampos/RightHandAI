[Capability: QA Widget Flutter] Ao gerar testes para widgets Flutter, siga estes templates.

## Widget Testing

```dart
testWidgets('{widget} deve {comportamento}', (WidgetTester tester) async {
  // Arrange
  await tester.pumpWidget(
    MaterialApp(home: {Widget}()),
  );

  // Act
  await tester.tap(find.byKey(Key('btn-salvar')));
  await tester.pumpAndSettle();

  // Assert
  expect(find.text('Sucesso'), findsOneWidget);
});
```

## Finders

| Finder | Quando usar |
|--------|-------------|
| `find.byKey(Key('...'))` | Seletor estável (preferido) |
| `find.byType({Widget})` | Quando Key não disponível |
| `find.text('...')` | Verificar texto visível |
| `find.byIcon(Icons.add)` | Verificar ícone |

## Tester Interactions

```dart
await tester.tap(finder);           // toque
await tester.enterText(finder, 'texto'); // digitar
await tester.drag(finder, Offset(0, -300)); // scroll
await tester.longPress(finder);     // pressionar longo
await tester.pumpAndSettle();       // esperar animações
```

## Integration Testing

```dart
void main() {
  IntegrationTestWidgetsFlutterBinding.ensureInitialized();

  testWidgets('fluxo completo de {feature}', (tester) async {
    app.main();
    await tester.pumpAndSettle();

    // Navegar, interagir, verificar
    await tester.tap(find.byKey(Key('btn-inicio')));
    await tester.pumpAndSettle();
    expect(find.text('Resultado'), findsOneWidget);
  });
}
```

## Anti-padrões (NUNCA fazer)

| Errado | Correto |
|--------|---------|
| Teste sem `pump`/`pumpAndSettle` | Sempre pump após ação |
| `find` sem `expect` | Sempre verificar resultado |
| Golden tests com dados dinâmicos | Dados fixos para golden |
| Depender de timing (`Future.delayed`) | `pumpAndSettle` ou `pump(Duration)` |
| Testar widget sem MaterialApp wrapper | Sempre wrappear com MaterialApp |

## Checklist pre-write (Flutter test)

- [ ] `testWidgets` com descrição clara?
- [ ] Widget wrappado em MaterialApp?
- [ ] `pumpAndSettle` após interações?
- [ ] Finders por Key (estáveis)?
- [ ] Assertions com `expect` + matcher?
- [ ] Sem dependência de timing?
