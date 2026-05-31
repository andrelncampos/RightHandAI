[Capability: Segurança de APIs] Regras para proteger endpoints de API.

## Input Validation
- Validar TODOS os inputs no servidor (tipo, tamanho, formato, range)
- Whitelist > blacklist (aceitar apenas o esperado)
- Rejeitar input inválido com 400 (não tentar "limpar")
- Tamanho máximo para strings, arrays, uploads
- Regex para formatos esperados (email, telefone, CEP)

## Rate Limiting
- Login: 5 tentativas / 15 minutos por IP
- API pública: 100 requests / minuto por chave
- Operações destrutivas: 10 / hora por usuário
- Upload: 5 / minuto por usuário
- Retornar 429 com header Retry-After

## CORS
- Origens explícitas (NUNCA `*` em produção com credentials)
- Methods explícitos (GET, POST — não `*`)
- Headers explícitos
- Preflight cache (Access-Control-Max-Age)

## Headers de Segurança
```
Strict-Transport-Security: max-age=31536000; includeSubDomains
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
Content-Security-Policy: default-src 'self'
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: camera=(), microphone=(), geolocation=()
```

## Proteção de Endpoints
- Autenticação em TODOS os endpoints (exceto health check e login)
- Autorização verificada no servidor para cada operação
- Pagination obrigatória em listagens (max 100 items)
- Campos sensíveis nunca retornados em listagens (senha, token, secret)
- Versionamento de API para breaking changes

## Error Handling
- Erros genéricos para o cliente (400, 401, 403, 404, 500)
- NUNCA expor stack trace, query SQL, paths internos
- Log detalhado no servidor (com correlation ID)
- Mensagens de erro não revelam se recurso existe (prevenção de enumeration)

## Anti-padrões
- CORS com `*` e credentials
- Endpoint sem autenticação "porque é interno"
- Validação apenas no frontend
- Retornar objeto inteiro do banco (incluindo campos sensíveis)
- Rate limiting apenas no frontend
- Error messages que revelam estrutura interna
