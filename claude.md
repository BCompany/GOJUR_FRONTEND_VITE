# GOJUR Frontend — Guia para Claude Code

## Visão Geral
Sistema de gestão jurídica (GOJUR) desenvolvido em React + TypeScript + Vite. Produto SaaS para escritórios de advocacia com módulos de agenda, processos, financeiro, publicações, CRM, workflow e documentos.

## Tech Stack
- React 18+ com TypeScript
- Vite (build)
- Yarn (package manager)
- styled-components (estilos)
- react-router-dom v5 (rotas com `useHistory`, `Switch`, `Route`)
- react-beautiful-dnd (drag and drop — usado no Kanban)
- react-icons (ícones: `react-icons/fi`, `react-icons/md`, `react-icons/fc`)
- react-select (selects customizados)
- ESLint (qualidade de código)

## Code Style
- Preferir `interface` TypeScript ao invés de `type`
- Estilos em arquivos `styles.ts` separados com styled-components
- Cada página segue padrão: `index.tsx` + `styles.ts`
- Autenticação via token em `localStorage.getItem('@GoJur:token')`
- Chamadas de API via `import api from 'services/api'` (axios)

## Estrutura de Arquivos
```
src/
  components/          # Componentes reutilizáveis globais
  context/             # Contexts React (modal, toast, auth, etc.)
  pages/
    Dashboard/
      MainViewContent/
        pages/         # Todos os módulos da aplicação
          Calendar/    # Agenda/Calendário
          CalendarKanban/  # Kanban da agenda (rota: /calendar/kanban)
          Matter/      # Processos jurídicos
          Customer/    # Clientes + CRM
          Financeiro/  # Módulo financeiro
          Workflow/    # Automação de workflows
          Dashboard/   # Página inicial com indicadores
  routes/              # Configuração de rotas (index.tsx)
  services/
    api.ts             # Instância axios configurada
```

## Arquitetura de Rotas
Todas as rotas privadas usam `component={DashboardPath}` (que é `pages/Dashboard`). O Dashboard resolve internamente qual sub-página renderizar baseado no path. Ver `src/routes/index.tsx` para lista completa.

Rotas principais:
- `/dashboard` — Dashboard com indicadores
- `/calendar` — Calendário/Agenda
- `/calendar/kanban` — Agenda em formato Kanban (branch: KanbanCalendar)
- `/matter/list` — Lista de processos
- `/customer/list` — Lista de clientes
- `/financeiro` — Módulo financeiro
- `/publication` — Publicações
- `/workflow` — Workflows
- `/Subject` — Assuntos do calendário
- `/CRM/salesFunnel` — Funil de vendas CRM

## Contexts Principais
Todos em `src/context/`:
- `useModal()` — controla abertura de modais globais (`handleModalActive`, `isOpenModal`, `modalActiveId`, `caller`, `handleCaller`)
- `useToast()` — notificações toast (`addToast({ type, title, description })`) — tipos: `success`, `error`, `info`
- `AuthContext` — autenticação do usuário
- `useHeader` — contexto do header/navegação

## Padrões de Modal
Dois padrões coexistem:

**1. Modal inline com styled-components** (padrão novo — ex: CalendarKanban):
```tsx
{showModal && (
  <ModalOverlay onClick={handleClose}>
    <PanelsModal onClick={(e) => e.stopPropagation()}>
      <div className="modal-header"><h4>Título</h4><FiX onClick={handleClose} /></div>
      <div className="modal-body">...</div>
      <div className="modal-footer">...</div>
    </PanelsModal>
  </ModalOverlay>
)}
```

**2. Modal via context** (padrão legado — ex: Subject/Modal):
```tsx
const { handleModalActive, modalActiveId, caller } = useModal();
// Abre com: handleModalActive(true); isOpenModal('id');
// Componente renderiza baseado em: show={modalActive}
```

## API — Padrões de Chamada
```ts
// Listar
const response = await api.post('/Entidade/Listar', { token, ...filtros });
// Salvar/Criar (id=0 para novo)
await api.post('/Entidade/Salvar', { entidadeId: 0, ...campos, token });
// Editar/Carregar
const response = await api.post('/Entidade/Editar', { id, token });
// Excluir
await api.post('/Entidade/Excluir', { id, token });
```
Token sempre via: `const token = localStorage.getItem('@GoJur:token');`

## Módulo CalendarKanban (`/calendar/kanban`)
Branch ativa: `KanbanCalendar`
Arquivo: `src/pages/Dashboard/MainViewContent/pages/CalendarKanban/index.tsx`

Funcionalidades implementadas:
- Quadros (painéis) de colunas com drag & drop (react-beautiful-dnd)
- Fases/colunas com cor customizável e renomeação inline
- Cards arrastáveis entre fases
- Botão **Quadros** — abre modal para gerenciar painéis
- Botão **Assunto** — abre modal para cadastrar assunto (POST `/Assunto/Salvar`) com campos: Descrição (texto) e Tipo (Audiência/Prazo/Outros)
- Filtros: período, assunto, tipo de compromisso
- Botão **Retornar Calendário** → navega para `/calendar`

Styled-components exportados em `styles.ts`:
`Container`, `Content`, `TaskBar`, `BoardLayout`, `ModalOverlay`, `PanelsModal`, `PanelItem`, `KanbanArea`, `PhaseColumn`, `PhaseHeader`, `ColorPickerWrapper`, `ColorDot`, `CardsList`, `AppointmentCard`, `AddCardButton`, `AddPhaseColumn`, `EmptyState`

## Componentes Reutilizáveis Importantes
- `<HeaderPage>` — cabeçalho padrão de página
- `<Search>` — campo de busca padrão
- `<FilterCalendar>` — filtros do calendário
- `<Select>` (react-select customizado) — usar com `selectStyles` de `Shared/utils/commonFunctions`
- `<ConfirmDeleteModal>` — modal de confirmação de exclusão
- `useDelay(fn, deps, ms)` — hook de debounce para chamadas de API

## Desenvolvimento
```bash
yarn dev    # servidor local
yarn build  # build produção
```
Porta padrão: `http://localhost:3000`

## Convenções Importantes
- Não adicionar comentários desnecessários — apenas quando o "porquê" não for óbvio
- Não criar arquivos de documentação extras
- Modais inline seguem o padrão `ModalOverlay` + `PanelsModal` (styled-components locais)
- Sempre usar `className="buttonClick"` para botões de ação primária
- Sempre usar `className="buttonLinkClick"` para botões secundários/cancelar
