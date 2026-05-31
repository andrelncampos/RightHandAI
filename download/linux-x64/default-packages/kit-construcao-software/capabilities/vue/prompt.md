[Capability: Vue] Ao escrever código Vue 3 com TypeScript, siga estes padrões e templates.

## Padrões obrigatórios

- **`<script setup lang="ts">`** como padrão em todo componente
- **Composables** (`useXxx`) para lógica reutilizável
- **Pinia** para state management (defineStore)
- **Vue Router** para navegação
- **Vite** como bundler
- **Refs e computed** para reatividade (`ref()`, `computed()`)
- **Watch** com cleanup (`watchEffect`, `watch` com `onCleanup`)
- **Provide/inject** para dependências cross-component
- **TypeScript strict** — tipos explícitos, sem `any`

## Templates

**Component (script setup):**
```vue
<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useEntityStore } from '@/stores/entity'

const store = useEntityStore()
const loading = ref(false)
const items = computed(() => store.items)

onMounted(async () => {
  loading.value = true
  await store.fetchAll()
  loading.value = false
})
</script>

<template>
  <div v-if="loading">Carregando...</div>
  <div v-else-if="items.length === 0">Nenhum item.</div>
  <ul v-else>
    <li v-for="item in items" :key="item.id">{{ item.name }}</li>
  </ul>
</template>
```

**Composable:**
```typescript
// composables/useEntity.ts
export function useEntity() {
  const items = ref<EntityDto[]>([])
  const loading = ref(false)

  async function fetchAll() {
    loading.value = true
    items.value = await api.getEntities()
    loading.value = false
  }

  return { items, loading, fetchAll }
}
```

**Store Pinia:**
```typescript
// stores/entity.ts
export const useEntityStore = defineStore('entity', () => {
  const items = ref<EntityDto[]>([])
  async function fetchAll() { items.value = await api.getEntities() }
  return { items, fetchAll }
})
```

## Anti-padrões (NUNCA fazer)

| Errado | Correto |
|--------|---------|
| Options API (`export default {}`) | `<script setup>` |
| Vuex | Pinia |
| Mixins | Composables |
| `this` em setup | Variáveis locais + refs |
| Mutação direta de props | `emit` + v-model |
| `any` types | Tipos explícitos |

## Checklist pre-write (.vue/.ts)

- [ ] `<script setup lang="ts">`?
- [ ] Composables para lógica reutilizável?
- [ ] Pinia para state global?
- [ ] Tipos explícitos (zero `any`)?
- [ ] Watch com cleanup se necessário?
- [ ] 5 estados UI (loading, empty, error, not-found, success)?
