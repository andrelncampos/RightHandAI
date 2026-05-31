[Capability: Criptografia] Regras para uso correto de criptografia.

## Hashing de senhas
- USAR: bcrypt (cost ≥ 12), scrypt, ou Argon2id
- NUNCA: MD5, SHA-1, SHA-256 puro (sem salt), PBKDF2 com poucas iterações
- Salt único por senha (gerado automaticamente pelo bcrypt/Argon2)
- Nunca truncar senha antes de hash

## Encryption at rest
- AES-256-GCM para dados em banco/disco
- Chave de criptografia em cofre (AWS KMS, Azure Key Vault, HashiCorp Vault)
- Rotação de chaves com suporte a múltiplas versões
- Nunca usar ECB mode

## Encryption in transit
- TLS ≥ 1.2 (preferir 1.3)
- Forward Secrecy habilitado (ECDHE)
- Certificados válidos e renovados automaticamente
- HSTS com max-age ≥ 1 ano

## Números aleatórios
- USAR: CSPRNG (crypto.randomBytes, RandomNumberGenerator, secrets)
- NUNCA: Math.random(), Random() sem seed criptográfico, time-based seeds
- Tokens: ≥ 128 bits de entropia
- IDs: UUID v4 (gerado com CSPRNG)

## Assinatura digital
- RSA ≥ 2048 bits ou ECDSA P-256+
- Verificar assinatura ANTES de processar payload
- Nunca confiar em dados não assinados de fonte externa

## Anti-padrões (NUNCA fazer)
- MD5 ou SHA-1 para qualquer propósito de segurança
- Criptografia "caseira" (implementar próprio algoritmo)
- Chave hardcoded no código
- IV/nonce reutilizado
- Comparação de hashes sem constant-time (timing attack)
- Base64 como "criptografia" (é encoding, não encryption)
- Desabilitar verificação de certificado SSL
