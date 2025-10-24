# Impulsiona Digital - Landing Page de Seleção de Plataforma

## Visão Geral
Landing page simples e conversão-focada que permite aos usuários escolherem entre Instagram ou TikTok para impulsionar sua presença digital. Ao clicar em qualquer plataforma ou no botão CTA, o usuário é redirecionado para https://app.impulsionalikes.com/

## Características Principais
- **Hero Section**: Título principal com destaque em gradiente cyan/laranja
- **Grid de Plataformas**: 2 cards clicáveis (Instagram, TikTok)
- **Botão CTA**: "COMEÇAR AGORA" em destaque com cor laranja vibrante
- **Design Dark**: Tema azul escuro profundo (navy blue)
- **Responsivo**: Layout otimizado para mobile, tablet e desktop
- **Sem Redirecionamento Automático**: Usuário escolhe quando avançar

## Arquitetura do Projeto

### Frontend (React + TypeScript)
- **Framework**: React com Vite
- **Roteamento**: Wouter (configurado mas com página única)
- **UI**: Shadcn UI + Tailwind CSS
- **Ícones**: React Icons (SiInstagram, SiTiktok)
- **Formulários**: N/A (não há formulários nesta landing page)

### Backend (Express + TypeScript)
- **Framework**: Express.js
- **Storage**: In-memory storage (MemStorage) - mantido mas não utilizado
- **Nota**: Backend existe mas não é necessário para a landing page estática

### Esquema de Dados
A landing page não utiliza banco de dados ou armazenamento. Os schemas existentes no projeto (posts, comments, likes) são remnantes do projeto anterior e podem ser ignorados.

## Design System

### Cores
- **Background**: Deep navy blue (220 70% 10%)
- **Card Background**: Slightly lighter navy (220 60% 15%)
- **Primary (CTA)**: Vibrant orange (36 100% 50%)
- **Accent**: Cyan (189 100% 50%) - usado no gradiente do título
- **Text**: White (#ffffff)
- **Muted Text**: Light gray (70% opacity)

### Tipografia
- **Headings**: Plus Jakarta Sans (configurado via --font-heading)
- **Body**: Inter (configurado via --font-sans)

### Componentes Principais
- **PlatformCard**: Card de plataforma com ícone em gradiente, nome e hover effect
- **Hero Section**: Título principal com destaque em gradiente + subtítulo
- **CTA Button**: Botão laranja grande com texto branco
- **Footer**: Texto de qualidade e garantia

## Estrutura de Pastas
```
client/
  src/
    components/
      ui/              - Componentes Shadcn UI
      theme-toggle.tsx - Toggle de tema dark/light
      theme-provider.tsx - Provider de tema
    pages/
      home.tsx         - Landing page principal
    lib/
      queryClient.ts   - Configuração TanStack Query (não utilizado)
      utils.ts         - Utilitários
shared/
  schema.ts            - Schemas Drizzle + Zod (não utilizados)
server/
  storage.ts           - Interface de storage (não utilizado)
  routes.ts            - Rotas da API (não utilizadas)
```

## Como Executar
O projeto usa um workflow que executa `npm run dev`, iniciando:
- Backend Express na porta configurada
- Frontend Vite (servido pelo mesmo servidor)

## Fluxo do Usuário
1. Usuário acessa a landing page
2. Visualiza o título "Impulsione sua presença No Digital!"
3. Vê os 2 cards de plataformas disponíveis (Instagram, TikTok)
4. Clica em qualquer card OU no botão "COMEÇAR AGORA"
5. É redirecionado para https://app.impulsionalikes.com/

## Preferências de Desenvolvimento
- Design dark-first com azul navy profundo
- Botões e CTAs em laranja vibrante para alto contraste
- Hover effects sutis mas perceptíveis (scale 1.05)
- Idioma português (Brasil) para todo conteúdo
- Cards com gradientes nas cores das marcas (Instagram rosa/roxo/laranja, TikTok preto, etc.)

## Histórico de Mudanças
- **Outubro 2024**: Transformação de blog SocialBuzz em landing page Impulsiona Digital
  - Removidos: sistema de posts, comentários, likes, filtros de categoria
  - Removidos: componentes post-card, comments-section, create-post-dialog, category-filter
  - Adicionados: PlatformCard component, nova estrutura de hero section
  - Mudança de paleta: violeta/roxo → azul navy/laranja/cyan
