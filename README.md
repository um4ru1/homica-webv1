# Homica Web (Next.js + Tailwind v4) — Migrated from Vite

## Run
```bash
npm install
npm run dev
# open http://localhost:3000
```

## Tailwind v4 Notes
- Config-less by default. Styles are loaded via `@import "tailwindcss";` in `app/globals.css`.
- PostCSS plugin: `@tailwindcss/postcss` configured in `postcss.config.mjs`.
- If you need a JS config (plugins/safelist), use `@config` at the top of a CSS file:
  ```css
  @config "./tailwind.config.js";
  @import "tailwindcss";
  ```
  but it's not needed for standard usage.

## Migration Notes
- UI & animations kept identical; rendered as a client page in `app/page.tsx`.
- Assets moved to `public/assets`.
- `import.meta.env.X` -> `process.env.NEXT_PUBLIC_X`.
