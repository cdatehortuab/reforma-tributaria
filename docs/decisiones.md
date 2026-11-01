# Decisiones

Registro breve. No reabrir sin un hecho nuevo (cambio de producto, de plataforma o de la ley).

## 2026-11-01 — `dev` integra, `main` publica, squash solo hacia `dev`

Los PRs de trabajo van a `dev` (rama predeterminada) y se fusionan con squash; el título del PR es el asunto. Un release es un PR de `dev` a `main`: rebase and merge cuando la historia es lineal, merge commit cuando no. Squash hacia `main` está apagado.

## 2026-11-01 — Producción de Cloudflare solo en tags

Workers Builds no dispara por tags. Publicar en cada push a `main` desplegaría dos veces el mismo código si el bump de versión va después del merge. El workflow `release` (tag `v*`) mueve la rama `production` a ese commit; Cloudflare publica producción desde `production` y previews desde las demás ramas. GitHub no guarda un token de Cloudflare.

## 2026-11-01 — Workers Static Assets, no Pages

Cloudflare mantiene Pages en modo mantenimiento y dirige proyectos nuevos a Workers. Este sitio no necesita un Worker script: solo HTML/CSS/JS estático. Assets-only evita el tope de invocaciones del plan gratuito. `_headers` funciona igual que en Pages.

## 2026-11-01 — Astro con islas React, no un SPA

Las landings deben indexar y funcionar sin JavaScript. Las calculadoras son islas. El motor es TypeScript puro, independiente de la UI.

## 2026-11-01 — CSP en `_headers`, `connect-src 'none'`

La garantía de privacidad tiene que ser comprobable desde la respuesta HTTP. `connect-src 'none'` impide que el front hable con red. `style-src` incluye `'unsafe-inline'` porque el HTML estático de Astro/Tailwind lleva estilos en línea; `script-src` sigue en `'self'`.

## 2026-11-01 — Workers Builds, no `wrangler deploy` desde GitHub

GitHub corre `ci` y, en un tag, mueve la rama `production`. El `wrangler deploy` lo hace Cloudflare (Workers Builds) con su propio token. Así no hay `CLOUDFLARE_API_TOKEN` en GitHub y los previews son las Preview URLs nativas, no un Worker compartido.

## 2026-11-01 — pnpm, no npm

Instalaciones más rápidas y un lockfile más estricto. La versión va en `packageManager` para que Corepack y CI usen la misma. El check `ci` corre `pnpm install --frozen-lockfile`.

## 2026-11-01 — ESLint 10 y plugins equivalentes

`eslint-plugin-astro` 3 exige ESLint 10. `eslint-plugin-react` y `eslint-plugin-jsx-a11y` aún no declaran ESLint 10. En su lugar: `@eslint-react/eslint-plugin`, `eslint-plugin-react-hooks` y `eslint-plugin-jsx-a11y-x`. Importaciones: `eslint-plugin-import-x` (`no-cycle`, `order`, y `no-restricted-imports` para aislar `src/engine/`).
