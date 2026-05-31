[Capability: Supply Chain] Regras para dependências seguras.

## Versionamento
- Versões FIXAS (pinned): `"lodash": "4.17.21"` (não `^4.17.0`)
- Lockfile SEMPRE versionado (package-lock.json, yarn.lock, Cargo.lock)
- Atualizar dependências com frequência (não deixar acumular)
- Testar após cada atualização

## Audit de vulnerabilidades
- Rodar `npm audit` / `dotnet list package --vulnerable` / `cargo audit` regularmente
- Zero vulnerabilidades críticas ou altas em produção
- Vulnerabilidades médias: avaliar e documentar se aceitar risco
- Monitorar CVEs via OSV.dev, NVD, GitHub Advisories

## Escolha de dependências
- Preferir pacotes bem mantidos (commits recentes, issues respondidas)
- Verificar número de dependências transitivas (menos = melhor)
- Desconfiar de pacotes com nomes similares a populares (typosquatting)
- Verificar se o pacote faz o que diz (ler código se necessário)
- Preferir pacotes com muitos downloads e estrelas (não é garantia, mas é sinal)

## Integridade
- SRI (Subresource Integrity) em scripts/styles de CDN
- Verificar checksums de downloads binários
- Assinar artefatos de build quando possível
- Não executar scripts de install sem revisar (postinstall hooks)

## CI/CD
- Pipeline com mesmas proteções do sistema implantado
- Secrets do pipeline isolados por ambiente
- Builds reproduzíveis (mesma entrada = mesma saída)
- Não instalar dependências de dev em produção

## Anti-padrões
- Versões com range aberto (`*`, `latest`, `^`)
- Lockfile no .gitignore
- `npm install` sem `--ignore-scripts` em CI
- Dependências abandonadas (sem commit há >2 anos)
- Copiar código de Stack Overflow sem verificar segurança
- Instalar pacote só para uma função de 3 linhas
