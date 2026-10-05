# Qualtrics Manager - Prompt de Rework Completo

## Objetivo

Você atuará como um **Software Architect**, **Senior Full Stack Engineer**, **DevOps Engineer**, **Security Engineer** e **UI/UX Engineer**.

Sua missão é analisar completamente este projeto chamado **Qualtrics Manager** antes de realizar qualquer alteração.

**Não implemente mudanças imediatamente.**

Primeiro compreenda totalmente como o sistema funciona, sua arquitetura, seus fluxos, suas dependências e seu propósito. Somente após essa análise, inicie as melhorias.

O objetivo é transformar este projeto em uma aplicação moderna, extremamente rápida, segura, organizada, escalável e fácil de manter.

---

# Etapa 1 — Auditoria Completa

Realize uma análise detalhada do projeto.

Compreenda completamente:

- Arquitetura
- Estrutura de pastas
- Backend
- Frontend
- Banco de dados
- APIs
- Fluxo das telas
- Fluxo de autenticação
- Sistema de login
- Gerenciamento de estado
- Comunicação Cliente ↔ Servidor
- Build
- Scripts
- Dependências
- Configurações

Durante a auditoria identifique:

- Código duplicado
- Arquivos mortos
- Componentes não utilizados
- Código legado
- Problemas arquiteturais
- Gargalos de performance
- Problemas de segurança
- Melhorias de UX
- Melhorias de organização
- Possíveis bugs

Nenhuma implementação deve ser feita antes dessa compreensão.

---

# Etapa 2 — Documentação

Crie uma pasta:

```text
/docs
```

Documente completamente o projeto.

Exemplo de estrutura:

```text
docs/
│
├── Architecture.md
├── Backend.md
├── Frontend.md
├── Authentication.md
├── API.md
├── Database.md
├── Components.md
├── Hooks.md
├── Services.md
├── Scripts.md
├── StateManagement.md
├── FolderStructure.md
├── Security.md
├── Performance.md
├── Deployment.md
├── Development.md
├── ReusablePatterns.md
├── Features.md
├── Roadmap.md
├── Troubleshooting.md
└── Changelog.md
```

Cada documento deve explicar detalhadamente sua área.

Sempre que alguma funcionalidade for alterada, atualize automaticamente sua documentação correspondente.

---

# Etapa 3 — CLAUDE.md

Crie ou mantenha atualizado um arquivo chamado:

```text
CLAUDE.md
```

Esse arquivo será a memória técnica permanente do projeto.

Ele deve conter:

- Visão geral
- Arquitetura
- Tecnologias utilizadas
- Estrutura do projeto
- Convenções
- Decisões arquiteturais
- Padrões adotados
- Fluxos da aplicação
- Funcionalidades existentes
- Como iniciar o projeto
- Como realizar deploy
- Como criar componentes
- Como criar APIs
- Como criar scripts
- Como criar novas funcionalidades
- Roadmap
- Limitações conhecidas

Sempre mantenha esse arquivo sincronizado.

---

# Etapa 4 — Refatoração do Servidor

Refatore completamente o backend.

Objetivos:

- Mais seguro
- Mais rápido
- Mais organizado
- Mais escalável

Revise completamente:

- Middleware
- Rotas
- Controllers
- Services
- Autenticação
- Autorização
- Sessões
- Tokens
- Cookies
- CORS
- Rate Limiting
- Cache
- Sanitização
- Validação
- Logs
- Tratamento de erros
- Variáveis de ambiente

Remova qualquer implementação insegura.

Aplique boas práticas modernas.

---

# Etapa 5 — Login e Sessão

Refatore completamente o sistema de autenticação.

Objetivos:

- Login rápido
- Login seguro
- Sessão persistente

O usuário deve permanecer autenticado até clicar em **Logout**.

Fechar:

- Navegador
- Aba
- Computador

não deve encerrar sua sessão.

Ao abrir novamente:

- Restaurar autenticação automaticamente.
- Validar sessão silenciosamente.
- Renovar tokens quando possível.
- Evitar exibir a tela de login desnecessariamente.

Sempre minimizar chamadas desnecessárias ao servidor.

---

# Etapa 6 — Persistência da Aplicação

Atualmente a aplicação reinicia quando o usuário troca de aba.

Esse comportamento deve ser eliminado.

Ao:

- Trocar de aba
- Minimizar
- Retornar ao navegador

a aplicação deve preservar:

- Estado
- Cache
- Contextos
- Dados carregados
- Navegação
- Informações temporárias
- Sessão

Evite remontagens completas da aplicação.

---

# Etapa 7 — Performance

Otimize toda a aplicação.

Analise:

- Re-renderizações
- Requests
- Bundle
- Imports
- Lazy Loading
- Code Splitting
- Cache
- Memoização
- Debounce
- Throttle
- Virtualização
- Consultas ao banco
- APIs

Objetivo:

Deixar a aplicação significativamente mais rápida.

---

# Etapa 8 — Refatoração Geral

Refine todo o código.

Melhore:

- Organização
- Escalabilidade
- Legibilidade
- Padronização
- Nomenclaturas
- Reutilização
- Separação de responsabilidades

Sem alterar o comportamento esperado.

---

# Etapa 9 — Novas Funcionalidades

Após compreender completamente o propósito do projeto, proponha melhorias que façam sentido para o contexto do Qualtrics Manager.

Priorize funcionalidades que:

- Aumentem produtividade
- Automatizem tarefas
- Melhorem UX
- Reduzam trabalho repetitivo
- Facilitem manutenção
- Agreguem valor ao sistema

Evite adicionar funcionalidades sem utilidade prática.

---

# Etapa 10 — Biblioteca de Scripts Reutilizáveis

Implemente uma estrutura para reutilização.

Exemplo:

```text
/scripts
/templates
/snippets
/generators
/shared
/utils
```

Essa estrutura deve permitir adicionar facilmente:

- Scripts
- Templates
- Estruturas
- Utilitários
- Geradores
- Automatizações

Tudo devidamente documentado.

---

# Etapa 11 — Padronização

Padronize completamente o projeto.

Incluindo:

- ESLint
- Prettier
- TypeScript
- Aliases
- Imports
- Convenções
- Estrutura de pastas

Remova inconsistências.

---

# Etapa 12 — Experiência do Desenvolvedor

Melhore a DX (Developer Experience).

Implemente quando fizer sentido:

- Scripts úteis
- Helpers
- Templates
- Ferramentas
- Automatizações
- Exemplos
- Documentação

O objetivo é facilitar futuras implementações.

---

# Etapa 13 — Limpeza

Remova:

- Código morto
- Dependências não utilizadas
- Arquivos obsoletos
- Comentários antigos
- Imports desnecessários
- Componentes inutilizados

---

# Etapa 14 — Qualidade

Toda implementação deve seguir:

- Clean Code
- SOLID (quando aplicável)
- DRY
- KISS
- Componentização
- Reutilização
- Tipagem consistente
- Documentação atualizada

Evite soluções temporárias ou gambiarras.

Sempre prefira soluções escaláveis.

---

# Etapa 15 — Relatório Final

Ao concluir todas as melhorias, gere um relatório detalhado contendo:

- Problemas encontrados
- Problemas corrigidos
- Melhorias implementadas
- Ganhos de performance
- Melhorias de segurança
- Alterações arquiteturais
- Novas funcionalidades
- Alterações na documentação
- Alterações no servidor
- Próximos passos recomendados

---

# Diretrizes Gerais

- Preserve compatibilidade sempre que possível.
- Não quebre funcionalidades existentes sem justificativa.
- Prefira soluções reutilizáveis.
- Documente todas as decisões técnicas.
- Atualize continuamente a documentação.
- Atualize continuamente o `CLAUDE.md`.
- Sempre que encontrar oportunidades relevantes de melhoria durante o desenvolvimento, implemente-as, desde que sejam coerentes com o propósito do projeto e aumentem sua qualidade, segurança, desempenho, organização ou facilidade de manutenção.