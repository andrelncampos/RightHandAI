[Capability: Flutter] Ao escrever código Flutter/Dart, siga estes padrões e templates.

## Padrões obrigatórios

- **Composição sobre herança** — widgets pequenos e compostos
- **StatelessWidget** quando não há estado local
- **StatefulWidget** apenas quando necessário (animações, controllers)
- **Riverpod** ou **Bloc** para state management (não setState em árvores grandes)
- **Null safety** — tipos non-nullable por padrão, `?` explícito quando nullable
- **Async** com `Future` e `Stream` — `async/await` para I/O
- **Layouts** com `Row`, `Column`, `Stack`, `Expanded`, `Flexible`
- **Navegação** declarativa (GoRouter ou Navigator 2.0)

## Templates

**StatelessWidget:**
```dart
class {Name}Widget extends StatelessWidget {
  const {Name}Widget({super.key});

  @override
  Widget build(BuildContext context) {
    return Container(); // composição aqui
  }
}
```

**Riverpod Provider:**
```dart
final {name}Provider = FutureProvider<List<{Entity}>>((ref) async {
  final repository = ref.watch({entity}RepositoryProvider);
  return repository.getAll();
});
```

**Repository:**
```dart
class {Entity}Repository {
  final Dio _dio;
  {Entity}Repository(this._dio);

  Future<List<{Entity}>> getAll() async {
    final response = await _dio.get('/api/{entities}');
    return (response.data as List).map((e) => {Entity}.fromJson(e)).toList();
  }
}
```

## Anti-padrões (NUNCA fazer)

| Errado | Correto |
|--------|---------|
| Widgets profundamente aninhados (>5 níveis) | Extrair sub-widgets |
| `setState` em árvores grandes | Riverpod/Bloc |
| Lógica no `build` method | Mover para provider/bloc |
| `BuildContext` fora do widget tree | Passar como parâmetro ou usar ref |
| `late` sem necessidade | Inicializar no construtor |
| Strings hardcoded na UI | Constantes ou i18n |

## Checklist pre-write (.dart)

- [ ] Widget é stateless se não tem estado local?
- [ ] Composição (widgets pequenos, não monolíticos)?
- [ ] Null safety correto (? apenas quando nullable)?
- [ ] State management via Riverpod/Bloc (não setState global)?
- [ ] Async/await para operações I/O?
- [ ] Layouts responsivos (MediaQuery, LayoutBuilder)?
