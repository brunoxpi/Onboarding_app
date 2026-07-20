# Painel de Projetos · ANOVA

Gestão ponta a ponta das tarefas de todos os projetos da Anova: status, gestor,
data de conclusão obrigatória, cobrança de dependências externas e fechamento
semanal com motivo, nova data e impeditivo. Segunda define os outputs da semana;
sexta bate o placar, pessoa por pessoa.

## Estado atual

- **`index.html`** — protótipo funcional, self-contained, com estado local
  (dados `SEED` + `localStorage`). É a base de partida (fim da Fase 1 do modelo
  de dados). Duas visões: *Semana · por pessoa* e *Projetos*.

## Arquitetura-alvo

Ver [`docs/modelo-dados.md`](docs/modelo-dados.md). Resumo:

- **Supabase** (Postgres + Row Level Security + Realtime).
- **Edge Functions** `jira-sync` (painel cria no Jira) e `jira-webhook`
  (Jira reflete no painel).
- **pg_cron** para fechamento automático da semana e `snapshots_semana`.

### Fases

| Fase | Entrega |
|---|---|
| 1 | Tabelas, carga inicial dos outputs/passos, painel lendo do Supabase |
| 2 | `jira-sync`: painel cria a issue no Jira |
| 3 | `jira-webhook` + reconciliação diária (espelho nos dois sentidos) |
| 4 | `pg_cron` de fechamento + `snapshots_semana` (série histórica) |
| 5 | Tela de histórico por setor e por executivo |

## Rodar localmente

Abrir `index.html` no navegador. Sem build, sem dependências.
