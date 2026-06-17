# PurpleFeed

Landing page configurável para campanhas, captação e redirecionamento para um app principal.

O projeto foi pensado para ser publicado por outras pessoas com pouca fricção:

- CTA e onboarding apontam para URLs configuráveis
- GA4 e Google Ads podem ser ligados por `.env`
- WhatsApp, textos da hero e labels da interface são configuráveis
- O app roda em modo local e em produção com o mesmo código
- O script `setup.sh` gera os arquivos de ambiente e os templates de `systemd` e `nginx`

## O que o projeto faz

- Exibe uma landing com duas opções de plataforma
- Preserva `gclid` na navegação para o app de destino
- Pode abrir o fluxo em aba nova no onboarding
- Mostra um modal de acompanhamento no onboarding após a navegação
- Registra eventos de engajamento no `gtag` quando o GA4 está configurado

## Tecnologias

- React 18
- TypeScript
- Vite
- Express
- Tailwind CSS
- Wouter
- Shadcn UI

## Estrutura Principal

- `client/src/components/landing-page.tsx`: landing principal e fluxo de CTA
- `client/src/components/site-integrations.tsx`: integração de metadados, canonical e analytics
- `client/src/lib/site-config.ts`: leitura de configuração pública via `import.meta.env`
- `server/index.ts`: servidor Express e porta de execução
- `server/vite.ts`: modo dev e serving do build estático
- `setup.sh`: setup guiado para local, build e deploy
- `.env.example`: exemplo completo das variáveis suportadas

## Requisitos

- Node.js 18+ recomendado
- npm
- Para deploy em produção com serviço: Linux com `systemd`
- Para reverse proxy: `nginx`

## Inicialização Rápida

1. Instale as dependências.

```bash
npm ci
```

2. Crie seu arquivo `.env`.

```bash
cp .env.example .env
```

3. Ajuste os valores do seu domínio, app alvo, GA4, WhatsApp e textos.

4. Rode em desenvolvimento.

```bash
npm run dev
```

## Setup Guiado

Se quiser um fluxo mais completo, use:

```bash
./setup.sh
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

## Variáveis de Ambiente

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

## Deploy Local

Fluxo recomendado:

```bash
npm ci
npm run check
npm run build
npm run start
```

Se estiver testando a exposição pública via proxy local, o servidor sobe na porta indicada por `PORT` e o `server/vite.ts` serve o build estático em produção.

## Deploy em Produção

O app foi desenhado para rodar atrás de `nginx` com um serviço `systemd`.

Pontos importantes:

- `server/index.ts` usa `PORT` e `HOST`
- `server/vite.ts` serve o build de `dist/public` em modo produção
- `setup.sh` gera o unit do `systemd` com `WorkingDirectory` apontando para a raiz do projeto
- `setup.sh` gera o `nginx` com `proxy_pass` para `HOST:PORT`

Fluxo típico:

1. Instalar dependências
2. Gerar `.env.production`
3. Rodar `npm run build`
4. Instalar o unit do `systemd`
5. Instalar o conf do `nginx`
6. Validar `nginx -t`
7. Reiniciar/recarregar os serviços

## Internal, External ou Ambos

O setup aceita três modos de publicação:

- `internal only`: a landing aponta para um domínio interno
- `external only`: a landing aponta para um domínio público
- `internal + external`: gera os dois alvos e permite ajustar cada URL separadamente

Isso é útil quando o mesmo código precisa ser usado em ambientes diferentes sem mudar o projeto.

## Verificação

Antes de subir em produção, confira:

- Se `VITE_SITE_URL` bate com o domínio final
- Se `VITE_APP_URL`, `VITE_CTA_URL` e `VITE_ONBOARDING_URL` apontam para o destino correto
- Se o `GA4` está preenchido apenas quando for usar analytics
- Se o `nginx` está fazendo proxy para a porta correta
- Se o `systemd` usa o usuário/grupo corretos

## Observações

- O projeto já preserva `gclid` ao redirecionar para o app destino
- O tracking de página só acontece quando `GA4` ou Google Ads estão configurados
- Os textos da landing podem ser alterados sem tocar em código, via `.env`

## Licença

MIT
