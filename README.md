# PurpleFeed

Landing page configurável para campanhas, captação e redirecionamento para um app principal.

O projeto foi pensado para ser publicado por outras pessoas com pouca fricção:

- CTA e onboarding apontam para URLs configuráveis
- GA4 e Google Ads podem ser ligados por `.env`
- WhatsApp, textos da hero e labels da interface são configuráveis
- O app roda em modo local e em produção com o mesmo código
- O script `docs/scripts/setup.sh` gera os arquivos de ambiente e os templates de `systemd` e `nginx`

---

## Estrutura do Repositório

O projeto possui uma estrutura limpa e modularizada na raiz, contendo exatamente **7 itens visíveis**:

```text
PurpleFeed/
├── client/          # Aplicação frontend React + Vite + Tailwind CSS
├── config/          # Central de arquivos de configuração do projeto
├── docs/            # Documentação técnica, changelog e scripts de automação/setup
├── server/          # Servidor Node.js / Express e rotas de backend
├── shared/          # Esquemas compartilhados, validação de env (Zod) e utilitários
├── package.json     # Manifest do projeto e scripts de execução
└── README.md        # Documentação principal
```

### Arquivos de Configuração (`config/`)

Para manter a raiz organizada, todas as configurações de ferramentas e compiladores foram centralizadas no diretório `config/`:

- `config/vite.config.ts`: Configuração do bundler Vite e plugins React.
- `config/tsconfig.json`: Configuração do compilador TypeScript.
- `config/tailwind.config.ts`: Tema e plugins do Tailwind CSS.
- `config/postcss.config.js`: Processamento PostCSS e Autoprefixer.
- `config/drizzle.config.ts`: Configuração do ORM Drizzle e migrações.
- `config/components.json`: Configuração do Shadcn UI.
- `config/ecosystem.config.cjs`: Configuração do PM2 para produção.

---

## O que o projeto faz

- Exibe uma landing com duas opções de plataforma
- Preserva `gclid` na navegação para o app de destino
- Pode abrir o fluxo em aba nova no onboarding
- Mostra um modal de acompanhamento no onboarding após a navegação
- Registra eventos de engajamento no `gtag` quando o GA4 está configurado

---

## Tecnologias

- React 18
- TypeScript
- Vite
- Express
- Tailwind CSS
- Wouter
- Shadcn UI
- Zod (Validação de variáveis de ambiente em `shared/env.ts`)

---

## Requisitos

- Node.js 18+ recomendado
- npm
- Para deploy em produção com serviço: Linux com `systemd`
- Para reverse proxy: `nginx`

---

## Inicialização Rápida

1. Instale as dependências:

```bash
npm ci
```

2. Crie seu arquivo `.env`:

```bash
cp .env.example .env
```

3. Ajuste os valores do seu domínio, app alvo, GA4, WhatsApp e textos.

4. Rode em desenvolvimento:

```bash
npm run dev
```

---

## Setup Guiado

Se quiser um fluxo mais completo, use:

```bash
./docs/scripts/setup.sh
```

O script pergunta:

- Escopo do deploy: `local`, `production` ou `ambos`
- Exposição da landing: `internal`, `external` ou `internal + external`
- URLs do app, CTA e onboarding
- ID do GA4 e Google Ads
- Telefone e mensagem do WhatsApp
- Textos visuais da landing
- Se deve gerar configurações de `systemd` e `nginx`
- Se deve executar `npm run check`, `npm run build` e smoke test local

Ele gera:

- `.env`
- `.env.local`
- `.env.production`
- `deploy/generated/systemd/*.service`
- `deploy/generated/nginx/*.conf`
- `deploy/generated/setup-report.txt`

---

## Variáveis de Ambiente

Validadas e tipadas centralizadamente via `shared/env.ts`.

### Domínio e rotas

- `APP_ROOT`: raiz do app no servidor
- `HOST`: host de bind do processo Node
- `PORT`: porta do app
- `VITE_SITE_URL`: URL canônica do site público
- `VITE_APP_URL`: URL do app principal
- `VITE_CTA_URL`: URL do CTA principal
- `VITE_ONBOARDING_URL`: URL do onboarding

### Branding e conteúdo

- `VITE_BRAND_NAME`: nome da marca
- `VITE_SITE_NAME`: nome público do site
- `VITE_SITE_DESCRIPTION`: descrição usada em metatags
- `VITE_HOME_PAGE_TITLE`: título da home
- `VITE_ONBOARDING_PAGE_TITLE`: título do onboarding
- `VITE_HERO_TITLE_PREFIX`
- `VITE_HERO_TITLE_HIGHLIGHT`
- `VITE_HERO_SUBTITLE`
- `VITE_SECTION_TITLE`
- `VITE_SECTION_SUBTITLE`
- `VITE_CTA_LABEL`
- `VITE_ONBOARDING_SELECTION_HINT`
- `VITE_FOOTER_TEXT`
- `VITE_FOLLOW_UP_TITLE`
- `VITE_FOLLOW_UP_BODY`

### Analytics

- `VITE_GA4_ID`
- `VITE_GOOGLE_ADS_ID`
- `VITE_GA4_MEASUREMENT_ID`
- `VITE_GOOGLE_ADS_MEASUREMENT_ID`

### WhatsApp

- `VITE_WHATSAPP_PHONE`
- `VITE_WHATSAPP_PHONE_NUMBER`
- `VITE_WHATSAPP_DISPLAY_PHONE`
- `VITE_WHATSAPP_MESSAGE`

---

## Deploy Local

Fluxo recomendado:

```bash
npm ci
npm run check
npm run build
npm run start
```

---

## Deploy em Produção

O app foi desenhado para rodar atrás de `nginx` com um serviço `systemd`.

Pontos importantes:

- `server/index.ts` usa `PORT` e `HOST`
- `server/vite.ts` serve o build de `dist/public` em modo produção
- `docs/scripts/setup.sh` gera o unit do `systemd` com `WorkingDirectory` apontando para a raiz do projeto
- `docs/scripts/setup.sh` gera o `nginx` com `proxy_pass` para `HOST:PORT`

---

## Licença

MIT
