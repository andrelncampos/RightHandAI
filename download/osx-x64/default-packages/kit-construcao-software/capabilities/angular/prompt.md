[Capability: Angular] Ao escrever código Angular com TypeScript, siga estes padrões e templates.

## Padrões obrigatórios

- **Standalone components** (não NgModules) — `standalone: true` em todo componente
- **Signals** para state reativo local (`signal()`, `computed()`, `effect()`)
- **RxJS** para streams assíncronos (HTTP, WebSocket, eventos complexos)
- **Reactive forms** (ReactiveFormsModule) sobre template-driven
- **Lazy loading** de rotas (`loadComponent` / `loadChildren`)
- **OnPush** change detection em todo componente
- **Interceptors** funcionais (`HttpInterceptorFn`) para headers, auth, retry
- **Guards** funcionais (`CanActivateFn`) para proteção de rotas
- **Typed forms** (`FormGroup<{...}>`) com tipagem forte

## Templates

**Component (standalone, OnPush):**
```typescript
@Component({
  selector: 'app-{name}',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './{name}.component.html'
})
export class {Name}Component {
  private readonly http = inject(HttpClient);
  readonly data = signal<Dto[]>([]);
  readonly loading = signal(false);
}
```

**Service:**
```typescript
@Injectable({ providedIn: 'root' })
export class {Name}Service {
  private readonly http = inject(HttpClient);
  getAll(): Observable<Dto[]> { return this.http.get<Dto[]>('/api/{entity}'); }
}
```

**Guard (funcional):**
```typescript
export const authGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  return auth.isAuthenticated() || inject(Router).createUrlTree(['/login']);
};
```

**Interceptor (funcional):**
```typescript
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = inject(AuthService).getToken();
  const authReq = token ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } }) : req;
  return next(authReq);
};
```

## Anti-padrões (NUNCA fazer)

| Errado | Correto |
|--------|---------|
| `any` types | Tipos explícitos sempre |
| `subscribe()` sem unsubscribe | `takeUntilDestroyed()` ou `async` pipe |
| Lógica no template | Mover para component/service |
| NgModules | Standalone components |
| `new HttpClient()` | `inject(HttpClient)` |
| Class-based guards/interceptors | Functional guards/interceptors |

## Checklist pre-write (.ts/.html)

- [ ] Component é standalone com OnPush?
- [ ] Imports explícitos (não módulo inteiro)?
- [ ] Signals para state local?
- [ ] RxJS com cleanup (takeUntilDestroyed)?
- [ ] Tipos explícitos (zero `any`)?
- [ ] Lazy loading para rotas pesadas?
