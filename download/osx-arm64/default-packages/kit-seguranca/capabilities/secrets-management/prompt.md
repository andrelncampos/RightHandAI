[Capability: Gestão de Secrets] Regras para nunca expor secrets no código.

## Regra fundamental
SECRETS NUNCA NO CÓDIGO. Nunca. Em nenhuma circunstância. Nem "temporariamente". Nem em "branch de teste".

## O que é secret
- API keys (OpenAI, Stripe, AWS, etc.)
- Senhas de banco de dados
- Tokens de autenticação
- Chaves de criptografia
- Connection strings com credenciais
- Certificados privados
- Webhooks secrets

## Onde armazenar
- **Desenvolvimento:** variáveis de ambiente, `.env` (no .gitignore)
- **CI/CD:** secrets do pipeline (GitHub Secrets, GitLab CI Variables)
- **Produção:** cofre (AWS Secrets Manager, Azure Key Vault, HashiCorp Vault)
- **Nunca:** código-fonte, configs versionados, comentários, READMEs

## Detecção de vazamento
Padrões a buscar no código:
```
- Strings que parecem API keys: sk-..., AKIA..., ghp_..., glpat-...
- Connection strings com password=
- Bearer tokens hardcoded
- Variáveis com nome "secret", "key", "token", "password" com valor literal
- Arquivos .env, .pem, .key versionados
```

## Rotação
- Rotação periódica (90 dias para secrets de longa duração)
- Rotação imediata se vazamento detectado
- Suporte a múltiplas versões durante rotação (graceful)
- Alertas quando secret está próximo da expiração

## .gitignore obrigatório
```
.env
.env.*
*.pem
*.key
*.p12
**/secrets/
**/credentials/
```

## Anti-padrões
- Secret em variável com valor literal no código
- Secret em config.json versionado
- Secret em docker-compose.yml versionado
- Secret em comentário "TODO: mover para env"
- Secret em log de debug
- Secret em mensagem de erro
- .env commitado "por engano" (já está no histórico git)
