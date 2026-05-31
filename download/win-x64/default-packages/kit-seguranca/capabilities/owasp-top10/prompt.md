[Capability: OWASP Top 10:2025] Checklist de segurança baseado no OWASP Top 10:2025. Aplicar em toda revisão e auditoria de código.

## A01: Controle de Acesso (inclui SSRF)
- Deny by Default — recursos inacessíveis sem autenticação
- Controles no servidor (nunca client-side)
- Record ownership — prevenção de IDOR (usar UUIDs, não IDs sequenciais)
- CORS restrito a origens confiáveis
- Rate limiting em endpoints sensíveis (login, APIs públicas, operações destrutivas)
- Separação de roles com permissões mínimas
- Endpoints admin protegidos com verificação de role no servidor
- SSRF: URLs validadas contra whitelist, IPs privados bloqueados (169.254.x.x, 10.x.x.x, 172.16.x.x)
- SSRF: Timeouts em chamadas externas, circuit breaker para dependências

## A02: Configuração de Segurança
- Debug mode desabilitado em produção
- Headers: HSTS, X-Content-Type-Options, X-Frame-Options, CSP, Referrer-Policy
- Mensagens de erro genéricas (sem stack traces)
- Configs sensíveis via variáveis de ambiente (nunca hardcoded)
- SSL/TLS nunca desabilitado em produção

## A03: Supply Chain
- Dependências com versões fixas (pinned)
- Monitoramento de CVEs (OSV.dev, NVD)
- SRI em recursos externos (CDN)
- Pipeline CI/CD endurecido

## A04: Criptografia
- Dados sensíveis criptografados at-rest e in-transit (TLS ≥ 1.2)
- Algoritmos fortes: SHA-256+, AES-256, RSA-2048+, bcrypt/Argon2
- PROIBIDO: MD5, SHA-1, DES, RC4, CBC mode
- Secrets em cofre (nunca no código)
- CSPRNG para números aleatórios

## A05: Injection
- Queries parametrizadas (NUNCA concatenação de strings)
- Input validado e sanitizado ANTES de processamento
- Sem eval()/exec() com input externo
- XML parsers sem entidades externas (XXE)
- Output encoding por contexto (HTML, JS, URL, CSS)
- Sem shell=True em execução de comandos

## A06: Design Inseguro
- Threat modeling em fluxos críticos
- Limites de negócio (rate limits, quotas, tamanhos máximos)
- Fail-safe defaults (nega acesso em caso de erro)
- Princípio do menor privilégio em todas as camadas
- Dados fictícios em ambientes de teste

## A07: Autenticação
- Senha forte (≥12 caracteres)
- MFA para acessos críticos
- Bloqueio após 3 tentativas falhas
- Tokens com httpOnly, Secure, SameSite
- JWT com expiração e algoritmo seguro (nunca "none")
- Mecanismo de revogação/rotação de tokens

## A08: Integridade
- Desserialização segura (nunca pickle/yaml.unsafe_load com dados externos)
- Validação de integridade em deploys
- Rollback seguro

## A09: Logging e Alertas
- Auditoria em operações críticas (login, alteração de dados, admin)
- Dados sensíveis NUNCA logados (senhas, tokens, PII)
- Logs estruturados (JSON) com timestamp, usuário, resultado
- Alertas para eventos de segurança críticos
- Detecção e resposta a incidentes em tempo hábil

## A10: Tratamento de Condições Excepcionais
- Erros não expõem informação interna (stack traces, queries, paths)
- Fail-closed: em caso de exceção, negar acesso (não "fail open")
- Cleanup adequado em exceções (liberar recursos, reverter estado)
- Tratamento explícito de todos os caminhos de erro
- Não ignorar exceções silenciosamente (catch vazio)
- Validar retornos de funções externas (null, erro, timeout)

## Como usar na spec

Ao criar spec, adicionar seção:
```markdown
## Requisitos de Segurança
- [A01.1] Deny by Default — endpoints requerem autenticação
- [A05.1] Queries parametrizadas
- [A07.5] JWT com expiração de 1h
- [A09.1] Logging de auditoria em operações de escrita
```
