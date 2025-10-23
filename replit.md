# SocialBuzz - Blog de Notícias sobre Redes Sociais

## Visão Geral
SocialBuzz é um blog/rede social focado em notícias sobre TikTok e Instagram. A plataforma permite que usuários compartilhem, curtam e comentem em posts sobre as últimas novidades e tendências dessas redes sociais.

## Características Principais (MVP)
- **Feed de Notícias**: Exibição de posts em cards com imagens, títulos e preview do conteúdo
- **Criação de Posts**: Sistema completo para criar posts com título, conteúdo, imagem e categorização por plataforma
- **Categorização**: Filtros por plataforma (Todos, TikTok, Instagram)
- **Sistema de Likes**: Usuários podem curtir posts com contador de likes
- **Comentários**: Sistema de comentários em tempo real para cada post
- **Design Dark**: Tema escuro com gradientes violeta e roxo
- **Responsivo**: Layout otimizado para mobile e desktop

## Arquitetura do Projeto

### Frontend (React + TypeScript)
- **Framework**: React com Vite
- **Roteamento**: Wouter
- **Estado**: TanStack Query (React Query v5)
- **UI**: Shadcn UI + Tailwind CSS
- **Ícones**: Lucide React + React Icons (logos TikTok/Instagram)
- **Formulários**: React Hook Form + Zod validation

### Backend (Express + TypeScript)
- **Framework**: Express.js
- **Storage**: In-memory storage (MemStorage)
- **Validação**: Zod schemas

### Schema de Dados
```typescript
Post {
  id: string (UUID)
  title: string
  content: string
  platform: 'tiktok' | 'instagram'
  imageUrl?: string
  author: string
  authorAvatar?: string
  likes: number
  commentCount: number
  createdAt: timestamp
}

Comment {
  id: string (UUID)
  postId: string
  author: string
  authorAvatar?: string
  content: string
  createdAt: timestamp
}

Like {
  id: string (UUID)
  postId: string
  userId: string
  createdAt: timestamp
}
```

## Design System

### Cores
- **Background**: Dark (240 6% 10%)
- **Primary**: Violeta (262 83% 58%)
- **Gradientes**: Violeta → Roxo → Rosa
  - from: 262 83% 58%
  - via: 280 70% 62%
  - to: 295 65% 60%
- **Accent**: Tons escuros com variações sutis

### Tipografia
- **Headings**: Plus Jakarta Sans (configurado via --font-heading)
- **Body**: Inter (configurado via --font-sans)

### Componentes Principais
- **PostCard**: Card de post com imagem, autor, conteúdo, likes e comentários
- **CreatePostDialog**: Modal para criação de novos posts
- **CommentsSection**: Seção de comentários com formulário de envio
- **CategoryFilter**: Filtros de categoria com badges
- **Hero Section**: Banner principal com gradiente e CTAs

## Rotas da API

### Posts
- `GET /api/posts` - Lista todos os posts
- `POST /api/posts` - Cria novo post
- `POST /api/posts/:id/like` - Adiciona like em um post

### Comentários
- `GET /api/comments?postId=:id` - Lista comentários de um post
- `POST /api/comments` - Cria novo comentário

## Estrutura de Pastas
```
client/
  src/
    components/
      ui/           - Componentes Shadcn UI
      post-card.tsx
      create-post-dialog.tsx
      comments-section.tsx
      category-filter.tsx
    pages/
      home.tsx      - Página principal
    lib/
      queryClient.ts
      utils.ts
shared/
  schema.ts         - Schemas Drizzle + Zod
server/
  storage.ts        - Interface e implementação de storage
  routes.ts         - Rotas da API
```

## Como Executar
O projeto usa um workflow que executa `npm run dev`, iniciando:
- Backend Express na porta configurada
- Frontend Vite (servido pelo mesmo servidor)

## Preferências de Desenvolvimento
- Usar in-memory storage (MemStorage) para dados
- Seguir design guidelines em design_guidelines.md
- Manter componentes modulares e reutilizáveis
- Design dark-first com gradientes violeta/roxo
- Idioma português para UI e conteúdo

## Próximas Funcionalidades (Fora do MVP)
- Sistema de busca e filtros avançados
- Tags e trending topics
- Perfis de autor
- Compartilhamento social
- Paginação/infinite scroll
- Autenticação de usuários
