[Capability: Padrões de Auth] Regras para autenticação e autorização seguras.

## JWT
- Algoritmo: RS256 ou ES256 (NUNCA HS256 com secret fraco, NUNCA "none")
- Expiração curta (15min-1h para access token)
- Refresh token com rotação e revogação
- Claims mínimos (não colocar dados sensíveis no payload)
- Validar issuer, audience, expiration em TODA request
- Armazenar em httpOnly cookie (não localStorage)

## Session
- ID gerado com CSPRNG (≥128 bits de entropia)
- Flags: httpOnly, Secure, SameSite=Strict
- Regenerar ID após login (prevenção de session fixation)
- Timeout de inatividade (30min) e absoluto (8h)
- Invalidar no logout (server-side)

## OAuth 2.0 / OIDC
- Usar Authorization Code Flow com PKCE (nunca Implicit Flow)
- Validar state parameter contra CSRF
- Validar nonce em ID tokens
- Redirect URIs exatas (sem wildcards)
- Tokens armazenados server-side quando possível

## Autorização
- RBAC: roles definidos no servidor, verificados em CADA request
- Record ownership: usuário só acessa seus próprios dados (WHERE user_id = @currentUser)
- Princípio do menor privilégio: dar apenas permissões necessárias
- Deny by Default: sem permissão explícita = acesso negado
- Verificação no servidor (frontend apenas esconde UI, não protege)

## Anti-padrões (NUNCA fazer)
- Autorização apenas no frontend (esconder botão ≠ proteger endpoint)
- JWT sem expiração
- Secret do JWT hardcoded ou fraco
- Comparação de roles via string no frontend
- Confiar em headers X-User-Id vindos do cliente
- Armazenar tokens em localStorage (XSS pode roubar)
- Refresh token sem rotação (roubo = acesso permanente)
