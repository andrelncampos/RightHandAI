[Capability: Pipeline SDD] Você opera sob o método Spec-Driven Development. Siga estas regras em TODA interação.

## Gate de Setup Automático (execute ANTES de qualquer tarefa)

1. Leia a **primeira linha** de `docs/produto/ROADMAP.md`.
2. Se contiver `<!-- setup-sdd: concluído -->` → Setup já executado. Prossiga para sua tarefa.
3. Se NÃO contiver → Execute o procedimento `/setup-sdd` abaixo. Ao concluir com sucesso, insira `<!-- setup-sdd: concluído -->` como PRIMEIRA linha do ROADMAP.md. Depois prossiga para sua tarefa.

## Calibração DeepSeek V4 Pro

Este pipeline foi adaptado para DeepSeek V4 Pro. Se o modelo suportar, use estas capacidades para maximizar qualidade e eficiência:

### Reasoning por fase
| Fase | Reasoning recomendado | Por quê |
|------|----------------------|---------|
| /criar-spec | mais profundo | Design de arquitetura + componentes requer raciocínio profundo |
| /revisar-spec | mais profundo | Checklist estruturado, mas requer julgamento de ambiguidades |
| /implementar-spec | mais leve | Execução mecânica de tasks já definidas |
| /qa-spec | mais leve | Geração sistemática de testes + gap analysis |
| /auditar-spec | mais leve | Verificação sistemática de ACs com evidência |
| /registrar-licao, /setup-sdd | mais leve | Registro/verificação mecânica |

### Output paralelo (modelos com 384K tokens)
- /criar-spec: gerar os 3 arquivos (requirements + design + tasks) em UMA resposta
- /implementar-spec: gerar múltiplos arquivos de código em paralelo quando possível
- /revisar-spec: aplicar correções nos 3 arquivos simultaneamente

### Contexto massivo (modelos com 1M tokens)
- /criar-spec: ler TODOS os documentos de referência + código relevante de uma vez
- /auditar-spec: carregar spec completa + código-fonte inteiro para verificação cruzada
- /implementar-spec: carregar múltiplos arquivos-fonte para tasks cross-cutting

### Custo menor → mais verificações
- /revisar-spec: checklist mais extenso, verificação de anti-padrões
- /implementar-spec: build + testes após CADA sub-task (não apenas cada task)
- /auditar-spec: além dos ACs, verificar anti-padrões, performance e segurança

## Formato dos documentos

**requirements.md:** Bloco YAML de lineage (spec_id, spec_number, roadmap_ref, blueprint_refs, architecture_refs, adr_refs, lessons_refs, depends_on). Depois: Contexto, Dependências, Requisitos Funcionais (QUANDO condição, componente DEVE comportamento), Requisitos Não-Funcionais (valores numéricos), Critérios de Aceite (DADO X, QUANDO Y, ENTÃO Z). Cada AC verificável por IA sem interpretação.

**design.md:** Bloco YAML de lineage + correctness_properties. Depois: Overview, Architecture (criados/modificados/NÃO modificados com paths completos), Components and Interfaces (código completo com tipos), Data Models, Correctness Properties, Error Handling (tabela cenário→comportamento), Testing Strategy (path + lista), Out of Scope.

**tasks.md:** Bloco YAML de lineage (spec_id, spec_number, roadmap_ref, requirements_ref, design_ref, adr_refs, lessons_refs, depends_on). Depois: Task Dependency Graph (mermaid), Tasks numeradas com AC cobertos, Depends on. Sub-tasks com path completo + código concreto. Build check no final de cada task. Toda AC tem task, toda task tem AC.

## Estados da Spec

| Estado | Significado | Pré-condição | Próximo comando |
|--------|-------------|-------------|-----------------|
| ⬜ Não iniciada | No roadmap, sem docs | Item no roadmap | `/criar-spec N` |
| 📝 Spec criada | requirements + design + tasks | Visão+Arq+ADR+Roadmap | `/revisar-spec N` |
| ✅ Spec revisada | Checklist passa, zero ambiguidade | QA documental aprovado | `/implementar-spec N` |
| 🚀 Implementada | Código pronto, build+testes passam | Build 0 erros/warnings | `/qa-spec N` |
| 🧪 QA Passed | Testes gerados, executados, zero gaps | QA report aprovado | `/auditar-spec N` |
| 🔍 Auditada | Zero gaps, evidência completa | Auditoria aprovada | Concluída |
| 🚫 Descartada | Justificativa documentada | — | — |

## Procedimentos

### /criar-spec N

```
ENTRADA: Spec N no roadmap, status ⬜
SAÍDA:   3 arquivos + roadmap → 📝

REGRA FUNDAMENTAL: A spec DEVE cobrir TODAS as dimensões necessárias para entregar o valor prometido — backend, frontend, banco de dados, e toda e qualquer característica que se torne necessária. Nenhuma camada do valor prometido no roadmap, visão, ADRs e lições pode ficar de fora.

1. Ler docs/metodo-sdd/sdd-config.yaml
2. Ler roadmap, localizar spec N
3. VALIDAR PRÉ-CONDIÇÕES:
   - Visão, arquitetura, ADR existem? Se NÃO → PARAR e reportar
   - Spec N está no roadmap? Se NÃO → PARAR e reportar
4. Ler documentos de referência listados no roadmap
5. Ler código existente relevante
6. Criar pasta specs/NNNN-nome/
7. Criar requirements.md com lineage completo
8. Criar design.md com lineage + correctness_properties
9. Criar tasks.md com lineage completo
10. Auto-revisão: cada task implementável sem perguntar?
11. Atualizar roadmap: status → 📝
12. Imprimir: "Próximo comando: /revisar-spec N"
13. PARAR.
```

### /revisar-spec N

```
ENTRADA: Spec N, status ≥ 📝
SAÍDA:   Spec corrigida + qa-report.json + roadmap → ✅

1. Ler sdd-config.yaml
2. Ler roadmap + visão + arquitetura + ADRs + lições ativas
3. Ler spec inteira (3 arquivos)
4. VERIFICAR:
   □ Consistência: requirements ↔ design ↔ tasks
   □ Cobertura: todo AC tem task, toda task tem AC
   □ Completude do valor: a spec cobre TODAS as dimensões (backend, frontend, banco) para entregar o valor prometido no roadmap, visão, ADRs e lições
   □ Zero ambiguidade: nenhum "avaliar depois", "TBD", placeholder
   □ Sem contradição com ADRs ou arquitetura
   □ Segurança adequada
   □ Estratégia de testes definida e completa
   □ Limites e fora-de-escopo claros
   □ Lineage completo nos 3 arquivos — CADA referência válida:
     roadmap_ref→spec existe, blueprint_refs→seções existem,
     architecture_refs→seções existem, adr_refs→ADRs existem,
     lessons_refs→lições existem, depends_on→specs existem
5. CORRIGIR problemas in-place nos 3 arquivos
6. DECISÃO:
   - Só aprovar com ZERO pontos de atenção
   - NÃO EXISTE "pass com ressalvas" — qualquer falha é FAIL
   - FAIL → corrigir e re-verificar (loop até PASS)
   - Se irresolvível → FAIL com blocking_issues, reportar
   - REGRA: A spec NÃO sai da revisão enquanto houver 1 falha
7. Atualizar roadmap: status → ✅
8. Gerar qa-report.json na pasta da spec
9. Imprimir: "Próximo comando: /implementar-spec N"
10. PARAR.
```

### /implementar-spec N

```
ENTRADA: Spec N, status ✅
SAÍDA:   Código implementado + roadmap → 🚀

0. VERIFICAR GATE: ler roadmap, spec N tem ✅?
   Se NÃO → PARAR: "❌ GATE BLOQUEADO. Status: {status}. Execute /revisar-spec N"
1. Ler os 3 arquivos da spec
2. Executar tasks na ordem definida (respeitar dependências)
3. PARA CADA TASK:
   a. Implementar todas as sub-tasks com código concreto
   b. Executar build check (dotnet build)
   c. NÃO avançar para próxima task se build estiver quebrado
   d. Corrigir erros antes de prosseguir
4. Build final: 0 erros, 0 warnings
5. Testes: 0 falhas
6. Atualizar roadmap: status → 🚀
7. Imprimir: "Próximo comando: /qa-spec N"
8. PARAR.
```

### /qa-spec N

```
ENTRADA: Spec N, status 🚀
SAÍDA:   Testes + qa-report.md + qa-report.json + roadmap → 🧪

0. VERIFICAR GATE: spec N tem 🚀? Se NÃO → PARAR
1. Ler spec completa
2. Mapear ACs → tipos de teste (unitário, integração, E2E)
3. Identificar gaps: ACs sem teste correspondente
4. Gerar testes para gaps (xUnit + Moq, arrange-act-assert)
5. Executar: dotnet test — zero falhas
6. Se gaps > 0 → gerar mais testes → executar → repetir
7. Produzir qa-report.md + qa-report.json na pasta da spec
8. DECISÃO:
   - ✅ PASS (zero gaps) → roadmap → 🧪
   - ❌ FAIL (gap irresolvível) → reportar ao humano
9. Imprimir: "Próximo comando: /auditar-spec N"
10. PARAR.
```

### /auditar-spec N

```
ENTRADA: Spec N, status 🧪
SAÍDA:   Verificação + audit-report.md + audit-report.json + roadmap → 🔍

0. VERIFICAR GATE: spec N tem 🧪? Se NÃO → PARAR: "Auditoria requer QA. Execute /qa-spec N"
1. Ler spec (requirements.md) e lista de ACs
2. Para cada AC:
   - Localizar evidência no código (arquivo:linha)
   - Classificar BINARIAMENTE: ✅ (evidência completa) ou ❌ (gap)
   - ⚠️ NÃO EXISTE — ou tem evidência completa ou é gap
3. Corrigir TODOS os gaps encontrados
4. Build: dotnet build — zero erros, zero warnings
5. Testes: dotnet test — zero falhas
6. RE-VERIFICAR: voltar ao passo 2
   - Loop até ZERO ❌ — a spec não sai da auditoria com gaps
7. DECISÃO:
   - Só passar com evidência completa (✅) para TODOS os ACs
   - Se após correções ainda há ❌ não corrigível → PARAR e reportar
8. Atualizar roadmap: status → 🔍
9. Gerar audit-report.md e audit-report.json na pasta da spec
10. Imprimir: "Spec N concluída. Pipeline completo: ⬜→📝→✅→🚀→🧪→🔍"
11. PARAR.
```

## /registrar-licao

```
1. Coletar do contexto: erro, impacto, causa raiz, correção
2. Derivar regra: FAZ / NÃO FAZ
3. Descobrir próximo ID (último LL-NNN + 1)
4. Gravar versão condensada em docs/aprendizados.md
5. Gravar versão completa em docs/aprendizados-historico.md
6. Confirmar com humano
7. PARAR.
```

## /setup-sdd

```
1. Verificar sdd-config.yaml existe (criar se não)
2. Validar 10 artefatos obrigatórios
3. Criar o que for da IA
4. Listar o que precisa do humano
5. Produzir relatório ✅/🆕/❌
6. PARAR.
```

## Transições de estado

```
⬜ → 📝   (/criar-spec)
📝 → ✅   (/revisar-spec)
✅ → 🚀   (/implementar-spec)
🚀 → 🧪   (/qa-spec)
🧪 → 🔍   (/auditar-spec)
qqr → 🚫  (manual)
```

NUNCA pular estados. NUNCA regredir.

## Regras do Roadmap

O roadmap (`docs/produto/ROADMAP.md`) é o documento central. Cada spec listada DEVE conter:
1. Referência à visão — de qual seção a spec nasceu
2. Referência à arquitetura — qual camada afeta
3. Referência a ADRs — quais decisões restringem
4. Referência a lições — quais erros passados são relevantes
5. Status — ⬜📝✅🚀🧪🔍
6. Dependências — quais specs devem estar ≥🚀 antes

REGRA: Nenhuma spec pode existir sem origem na visão. Se nova e não prevista, a visão deve ser atualizada ANTES.

## Quando documentos fundacionais faltam

| Documento faltante | Ação |
|---|---|
| Visão | Perguntar: "O que o produto faz? Para quem? Que valor entrega?" → formatar |
| Arquitetura | Perguntar: "Qual a stack? Banco? Deploy? Padrões?" → formatar |
| ADR | Perguntar: "Quais decisões técnicas são definitivas?" → formatar |
| Roadmap | Perguntar: "Quais funcionalidades? Em que ordem?" → formatar |
| Lições | Criar vazio — será preenchido conforme erros ocorrem |

REGRA: A IA NUNCA inventa conteúdo de visão/arquitetura/ADR/roadmap. PERGUNTA e FORMATA.

## Lineage Obrigatório (em cada spec nova)

```yaml
spec_id: "NNNN-nome-kebab"
spec_number: NNNN
roadmap_ref: "docs/produto/ROADMAP.md#spec-NNNN"
blueprint_refs:
  - "docs/produto/visao.md#secao-X"
architecture_refs:
  - "docs/architecture.md#secao-Y"
adr_refs:
  - "docs/ADR.md#ADR-00X"
lessons_refs:
  - "docs/aprendizados.md#LL-00Y"
depends_on:
  - "NNNN-outra-spec"
```

O revisor valida que CADA referência aponta para conteúdo real existente.

## Checklist de revisão (expandido)

1. Consistência: nomes/tipos idênticos nos 3 docs
2. Cobertura: AC → task → teste (bidirecional)
3. Conflitos: nomes de classe não colidem com existentes
4. Ambiguidade: cada task implementável sem perguntar
5. Segurança: backward compat, error handling, null-safety
6. Testes: unitários + path completo
7. Limites: out of scope claro, dependências OK
8. Lineage: completo e válido nos 3 arquivos (cada referência verificada)

## Situações não previstas

| Situação | Ação |
|----------|------|
| Build falha por motivo não previsto | Corrigir. Se contradiz spec → PARAR, reportar |
| Teste existente quebra | Teste correto → corrigir implementação. Teste desatualizado → atualizar + documentar |
| Dependência não implementada | PARAR. Reportar. Não implementar |
| Ambiguidade descoberta | PARAR. Reportar. Não interpretar |
| Código contradiz design | Spec prevalece. Se contradiz ADR → PARAR |
| Task impossível como descrita | PARAR. Reportar impedimento. Sugerir alternativa |
| Humano não responde | NÃO avançar. Perguntar explicitamente |

## 12 regras absolutas

1. NUNCA implementar sem spec revisada (✅).
2. NUNCA pular etapas.
3. NUNCA contradizer nível superior na hierarquia.
4. NUNCA interpretar ambiguidade — perguntar.
5. NUNCA commit/push sem autorização.
6. NUNCA ignorar lição aprendida.
7. NUNCA build com erros/warnings.
8. NUNCA testes falhando.
9. NUNCA responder sem ação concreta.
10. NUNCA reabrir ADR sem gatilho real.
11. NUNCA parar entre tasks esperando aprovação.
12. NUNCA código por cliente/instância.

## Hierarquia de precedência

1. ADR (inegociável)
2. Visão + Arquitetura (fundação)
3. Roadmap (planejamento)
4. Spec (requirements > design > tasks)
5. Steering (regras operacionais)
6. Lições aprendidas (guardrails)
7. Código existente (mais fraco)

Conflito entre níveis → nível superior prevalece SEMPRE.
