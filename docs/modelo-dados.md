# Painel de Projetos ANOVA · Modelo de dados e sincronismo com o Jira

Documento de decisão técnica. Objetivo: permitir que o painel crie e reflita tarefas do Jira em tempo real e sustente a tela de histórico de execuções por setor e por executivo.

Data: 20/07/2026 · Versão 1

---

## 1. Princípio que organiza tudo

O Jira e o painel guardam coisas diferentes. Tentar duplicar os dois gera conflito e trabalho dobrado.

| Camada | Fonte da verdade | Por quê |
|---|---|---|
| Existência da tarefa, título, status, responsável, projeto | **Jira** | É onde o time de desenvolvimento já trabalha. Duplicar status gera divergência. |
| Semana de compromisso, prioridade, cobrança, impeditivo, promessa, histórico semanal | **Backend próprio** | O Jira não tem campo para nada disso. São os dados da gestão, não da engenharia. |

Regra prática: se o campo existe no Jira, o Jira manda. Se não existe, o backend manda. Nunca os dois.

---

## 2. Stack recomendada

**Supabase**, por três motivos objetivos:

1. Já está conectado ao seu ambiente, então não há decisão nova de fornecedor.
2. Postgres puro, com Row Level Security nativa. Cada executivo enxerga o que deve enxergar sem código extra.
3. Realtime embutido. Quando o Oseias marca um passo como concluído, a tela do Bruno atualiza sozinha, sem refresh.

Componentes:

- **Postgres**: as tabelas abaixo.
- **Edge Function `jira-sync`**: guarda o token do Jira e faz as chamadas. O front nunca vê credencial.
- **Edge Function `jira-webhook`**: recebe eventos do Jira e atualiza o espelho local.
- **pg_cron**: fecha a semana automaticamente na segunda de manhã.

---

## 3. Tabelas

### 3.1 `pessoas`

Quem executa. Separado do usuário de login porque nem todo executivo tem conta no Jira hoje.

| Campo | Tipo | Nota |
|---|---|---|
| `id` | uuid PK | |
| `nome` | text | "Oseias Ayres" |
| `email` | text | |
| `setor` | text | tecnologia, infraestrutura, marketing, operacoes, juridico, comercial |
| `jira_account_id` | text nullable | nulo para quem ainda não tem conta |
| `ativo` | boolean | |

### 3.2 `projetos`

| Campo | Tipo | Nota |
|---|---|---|
| `id` | uuid PK | |
| `nome` | text | "AssetBanking" |
| `jira_epic_key` | text nullable | "KAN-46" |
| `tipo` | text | cliente ou interno |
| `status` | text | |

### 3.3 `tarefas`

O output da semana. Espelha uma Tarefa filha do Epic no Jira.

| Campo | Tipo | Fonte | Nota |
|---|---|---|---|
| `id` | uuid PK | backend | |
| `jira_key` | text nullable | Jira | nulo enquanto não sincronizada |
| `projeto_id` | uuid FK | | |
| `titulo` | text | Jira | |
| `status` | text | Jira | pendente, em_andamento, concluida |
| `responsavel_id` | uuid FK | Jira | |
| `data_conclusao` | date | backend | o Jira falha no campo duedate para Tarefa e Feature |
| `prioridade` | boolean | backend | |
| `semana` | date | backend | sempre a segunda-feira da semana |
| `criado_em`, `atualizado_em` | timestamptz | | |
| `sync_status` | text | backend | ok, pendente, erro |
| `sync_erro` | text nullable | backend | |

### 3.4 `passos`

O que de fato se executa. Vira Subtarefa da Tarefa no Jira.

| Campo | Tipo | Nota |
|---|---|---|
| `id` | uuid PK | |
| `tarefa_id` | uuid FK | |
| `jira_key` | text nullable | |
| `titulo` | text | com verbo de ação |
| `responsavel_id` | uuid FK | responsável único, sempre |
| `data_prevista` | date | obrigatória |
| `status` | text | |
| `ordem` | int | |

Decisão de contagem: passo **não** entra no cálculo de progresso do Epic. Só a tarefa conta. Assim o placar da semana não infla com trabalho intermediário.

### 3.5 `dependencias`

Quando a tarefa depende de terceiro.

| Campo | Tipo | Nota |
|---|---|---|
| `id` | uuid PK | |
| `tarefa_id` | uuid FK | |
| `depende_de` | text | "BTG", "AssetBank", "Cliente", "Régis" |
| `tipo` | text | credencial, acesso, validacao, contrato, dado, decisao |
| `desde` | date | início da espera, base do contador de dias |
| `resolvida_em` | date nullable | |
| `impacto` | text | o que para se não resolver |

### 3.6 `cobrancas`

A trilha de auditoria. É esta tabela que protege a Anova quando o atraso é externo.

| Campo | Tipo | Nota |
|---|---|---|
| `id` | uuid PK | |
| `dependencia_id` | uuid FK | |
| `data` | date | |
| `canal` | text | whatsapp, email, ligacao, reuniao, chamado_formal |
| `quem_foi_cobrado` | text | nome e cargo do lado do terceiro |
| `respondeu` | boolean | |
| `resultado` | text | o que a pessoa respondeu |
| `prometeu_para` | date nullable | |
| `registrado_por` | uuid FK pessoas | |

Regra derivada, calculada e não armazenada: promessa vencida quando `prometeu_para < hoje` e a dependência segue sem `resolvida_em`. Dispara escalonamento.

### 3.7 `fechamentos`

O registro do ritual de sexta. É a base da tela de histórico.

| Campo | Tipo | Nota |
|---|---|---|
| `id` | uuid PK | |
| `tarefa_id` | uuid FK | |
| `semana` | date | |
| `resultado` | text | entregue, nao_entregue, sem_batida |
| `motivo` | text nullable | obrigatório quando nao_entregue |
| `nova_data` | date nullable | |
| `tem_impeditivo` | boolean | |
| `impeditivo_texto` | text nullable | |
| `causa_raiz` | text | interna, terceiro, escopo, capacidade |
| `registrado_em` | timestamptz | |

O campo `causa_raiz` é o que transforma o histórico em decisão. Sem ele você sabe que atrasou, mas não sabe se o problema é time, cliente ou escopo mal dimensionado.

### 3.8 `snapshots_semana`

Agregado congelado toda segunda. Existe para a tela de histórico ser rápida e imutável: o passado não muda quando alguém edita uma tarefa antiga.

| Campo | Tipo |
|---|---|
| `semana` | date |
| `pessoa_id` / `setor` / `projeto_id` | uuid / text / uuid |
| `outputs_totais`, `entregues`, `nao_entregues`, `sem_batida` | int |
| `taxa_entrega` | numeric |
| `dias_bloqueado_terceiro` | int |
| `cobrancas_emitidas`, `promessas_vencidas` | int |

---

## 4. Sincronismo com o Jira

### 4.1 Painel cria, Jira recebe

1. Usuário cria a tarefa no painel. Grava em `tarefas` com `sync_status = pendente`.
2. A Edge Function `jira-sync` cria a issue: tipo Tarefa, `parent` = Epic do projeto, `assignee` = `jira_account_id`.
3. A data vai **na descrição**, porque `duedate` falha nesses tipos. Formato fixo, para poder ser lido de volta: `Prazo: AAAA-MM-DD`.
4. Retorna a key, grava em `jira_key` e marca `sync_status = ok`.
5. Se falhar, mantém `pendente` e mostra na tela que o card ainda não existe no Jira. Nunca falhar em silêncio.

Passos seguem o mesmo fluxo, criados como Subtarefa com `parent` = key da tarefa.

### 4.2 Jira muda, painel reflete

Webhook do Jira nos eventos `issue_updated`, `issue_deleted` e `issue_created`, apontando para a Edge Function `jira-webhook`.

- Issue atualizada: espelha status, título e responsável em `tarefas`.
- Issue criada direto no Jira dentro de um Epic conhecido: cria a linha correspondente, sem semana e sem prioridade. Aparece no painel como "não priorizada", esperando a segunda.
- Issue deletada: marca como arquivada, não apaga. O histórico precisa sobreviver à deleção do card.

Rede de segurança: uma reconciliação diária varre `parent = KAN-XX` de cada Epic e corrige divergências, porque webhook se perde.

### 4.3 Conflito

Não existe conflito real se a regra da seção 1 for respeitada, já que cada campo tem um dono só. Para os campos do Jira, a última escrita do Jira vence sempre. O painel nunca sobrescreve status vindo do Jira.

---

## 5. Fechamento automático da semana

`pg_cron` na segunda às 6h:

1. Toda tarefa com `semana` da semana anterior e sem registro em `fechamentos` recebe `resultado = sem_batida`.
2. Gera as linhas de `snapshots_semana`.
3. Tarefas não entregues e sem nova data aparecem no topo do painel como pendência da nova semana.

Isso resolve o furo que já apontei: sem esse job, uma sexta sem reunião vira buraco permanente na série histórica.

---

## 6. Permissões

- Executivo: lê tudo do seu setor, escreve nas próprias tarefas, passos e cobranças.
- COO e CEO: leem tudo, escrevem em tudo.
- Fechamentos e cobranças: nunca podem ser deletados, só corrigidos com novo registro. É trilha de auditoria, e trilha que se apaga não serve de prova.

---

## 7. Fases sugeridas

| Fase | Entrega | Resultado |
|---|---|---|
| 1 | Tabelas, carga inicial dos 37 outputs e 102 passos, painel lendo do Supabase | Fim do arquivo HTML com estado local |
| 2 | `jira-sync`: painel cria no Jira | Criação em um lugar só |
| 3 | `jira-webhook` e reconciliação diária | Espelho confiável nos dois sentidos |
| 4 | `pg_cron` de fechamento e `snapshots_semana` | Série histórica começa a acumular |
| 5 | Tela de histórico por setor e por executivo | Taxa de entrega, causa raiz, reincidência, tempo de destravamento |

Observação de sequência: a fase 4 precisa entrar cedo, mesmo que a tela da fase 5 demore. Histórico não se reconstrói depois.

---

## 8. Pendências que bloqueiam o início

1. Quatro executivos não têm conta no Jira: Régis, Bianca, Diovana e Dr. João Borja. Sem `jira_account_id` não há atribuição de responsável.
2. Cinco frentes não têm Epic: Infraestrutura, Marketing, Operações, Jurídico e Comercial.
3. Definir quem administra o token do Jira e com qual nível de permissão.
