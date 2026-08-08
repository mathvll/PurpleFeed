# Changelog

Todas as alterações notáveis neste projeto serão documentadas neste arquivo.

O formato é baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.0.0/),
e este projeto adere ao [Versionamento Semântico](https://semver.org/lang/pt-BR/).

---

## [1.0.0] - 2026-08-07

### Fases de Reorganização e Refatoração

#### 1. Reorganização Radical da Raiz
- Agrupamento de todas as configurações de ferramentas na pasta `config/`:
  - `config/vite.config.ts`
  - `config/tsconfig.json`
  - `config/tailwind.config.ts`
  - `config/postcss.config.js`
  - `config/drizzle.config.ts`
  - `config/components.json`
  - `config/ecosystem.config.cjs`
- Consolidação do diretório raiz em apenas **7 itens visíveis**:
  - `client/`
  - `config/`
  - `docs/`
  - `server/`
  - `shared/`
  - `package.json`
  - `README.md`

#### 2. Refatoração e Unificação do Gerenciamento de Ambientes (`env.ts`)
- Criação do módulo centralizado `shared/env.ts` utilizando validação forte com **Zod**.
- Tipagem estrita e validação com `z.infer<typeof envSchema>`.
- Suporte dinâmico para carregamento de variáveis de ambiente via `.env`, `.env.local`, `.env.production` e `.env.production.local`.
- Normalização de fallbacks e sanitização de configurações para Analytics (GA4, Google Ads), WhatsApp e URLs de onboarding/CTA.

#### 3. Limpeza de Código e Padronização de Scripts
- Migração de scripts utilitários e de setup de deploy para `docs/scripts/` (ex: `docs/scripts/setup.sh`).
- Atualização dos scripts do `package.json` para apontar corretamente para as novas localizações dos arquivos de configuração dentro de `config/`.
- Limpeza de dependências e arquivos temporários da raiz.

#### 4. Metadados e Controle de Versão
- Renomeação do pacote no `package.json` de `"rest-express"` para `"purplefeed"`.
- Definida a versão oficial `1.0.0`.
- Criação do arquivo local de versionamento `.version.local`.
- Atualização do `.gitignore` para ignorar `.version.local`, `.playwright-mcp/` e `deploy/generated/`.
