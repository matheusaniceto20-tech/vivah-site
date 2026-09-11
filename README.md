# Vivah Energia Solar — site institucional

Site em [Astro](https://astro.build) + Tailwind CSS para a Vivah Soluções Fotovoltaicas.

## Rodar localmente

```bash
npm install
npm run dev
```

## Build de produção

```bash
npm run build
npm run preview
```

## Estrutura

- `src/components/` — seções da home (Hero, Simulador, Portfólio, Depoimentos, etc.)
- `src/content/blog/` — artigos do blog (Markdown, frontmatter com `draft: true/false`)
- `src/lib/negocio.ts` — dados centrais (telefone, WhatsApp, Instagram) usados no site inteiro
- `public/videos/` — vídeos usados no hero e portfólio (não passam pela otimização de imagem do Astro)

## Deploy

Configurado para deploy automático via Netlify a cada push na branch `main` (ver `netlify.toml`).
