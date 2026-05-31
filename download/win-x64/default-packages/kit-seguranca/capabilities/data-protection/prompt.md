[Capability: Proteção de Dados] Regras para manipulação segura de dados pessoais e sensíveis.

## Classificação de dados
- PII (Personally Identifiable Information): nome, CPF, email, telefone, endereço
- Dados sensíveis: senha, token, chave de API, dados financeiros, dados de saúde
- Dados públicos: nome de produto, preço, descrição

## Princípios (LGPD/GDPR)
- Minimização: coletar APENAS o necessário para a funcionalidade
- Finalidade: usar dados APENAS para o propósito declarado
- Retenção: definir prazo de armazenamento e descarte
- Consentimento: base legal para cada tratamento
- Portabilidade: usuário pode exportar seus dados
- Exclusão: usuário pode solicitar remoção (direito ao esquecimento)

## Proteção em código
- PII criptografada at-rest (AES-256)
- PII nunca em logs (mascarar: `***@email.com`, `***.***.***-00`)
- PII nunca em URLs (query params são logados por proxies)
- PII nunca em cache público (Cache-Control: no-store)
- PII nunca em mensagens de erro
- Dados de teste SEMPRE fictícios (nunca dados reais de produção)

## Redação (mascaramento)
```
CPF: ***.***.***-{últimos 2}
Email: ***@{domínio}
Telefone: (XX) *****-{últimos 4}
Cartão: **** **** **** {últimos 4}
Nome: {primeiro nome} ***
```

## Descarte seguro
- Soft delete com prazo de retenção (30-90 dias)
- Hard delete após prazo (sobrescrição, não apenas DELETE)
- Backups: respeitar prazo de retenção
- Logs: rotação com descarte seguro

## Anti-padrões
- Logar dados pessoais completos
- Armazenar PII em plain text
- Retornar PII em listagens sem necessidade
- Usar dados reais em ambiente de teste
- Cache de dados sensíveis sem TTL
- Compartilhar dados entre serviços sem base legal
