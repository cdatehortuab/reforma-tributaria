# Decisiones

Registro breve. No reabrir sin un hecho nuevo (cambio de producto, de plataforma o de la ley).

## 2026-11-01 — Bypass de GitHub Actions solo para release y `production`

Humanos no tienen bypass en `dev`, `main` ni `production`. `github-actions[bot]` (Actions) sí: en `main` y `dev` para el commit de versión del workflow **Release**; en `production` para el workflow **Deploy**. El resto de reglas (PR, `ci`, squash) sigue valiendo para las personas.

## 2026-11-01 — `dev` integra, `main` publica, squash solo hacia `dev`

Los PRs de trabajo van a `dev` (rama predeterminada) y se fusionan con squash; el título del PR es el asunto. Un release es un PR de `dev` a `main`: rebase and merge cuando la historia es lineal, merge commit cuando no. Squash hacia `main` está apagado.

## 2026-11-01 — Producción de Cloudflare solo vía workflow Deploy

Workers Builds no dispara por tags. El workflow **Release** (manual, desde `main`) sube la versión, taguea y crea el GitHub Release. El workflow **Deploy** (manual, versión X.Y.Z) es lo único que puede mover `production`; un rollback es el mismo workflow con una versión anterior. El ruleset de `production` bloquea pushes humanos; solo `github-actions[bot]` tiene bypass. GitHub no guarda un token de Cloudflare.

## 2026-11-01 — Workers Static Assets, no Pages

Cloudflare mantiene Pages en modo mantenimiento y dirige proyectos nuevos a Workers. Este sitio no necesita un Worker script: solo HTML/CSS/JS estático. Assets-only evita el tope de invocaciones del plan gratuito. `_headers` funciona igual que en Pages.

## 2026-11-01 — Astro con islas React, no un SPA

Las landings deben indexar y funcionar sin JavaScript. Las calculadoras son islas. El motor es TypeScript puro, independiente de la UI.

## 2026-11-01 — CSP en `_headers`, `connect-src 'none'`

La garantía de privacidad tiene que ser comprobable desde la respuesta HTTP. `connect-src 'none'` impide que el front hable con red. `style-src` incluye `'unsafe-inline'` porque el HTML estático de Astro/Tailwind lleva estilos en línea; `script-src` sigue en `'self'`.

## 2026-11-01 — Workers Builds, no `wrangler deploy` desde GitHub

GitHub corre `ci`, **Release** y **Deploy**. El `wrangler deploy` lo hace Cloudflare (Workers Builds) al ver un push a `production`, con su propio token. Así no hay `CLOUDFLARE_API_TOKEN` en GitHub y los previews son las Preview URLs nativas.

## 2026-11-01 — pnpm, no npm

Instalaciones más rápidas y un lockfile más estricto. La versión va en `packageManager` para que Corepack y CI usen la misma. El check `ci` corre `pnpm install --frozen-lockfile`.

## 2026-11-01 — ESLint 10 y plugins equivalentes

`eslint-plugin-astro` 3 exige ESLint 10. `eslint-plugin-react` y `eslint-plugin-jsx-a11y` aún no declaran ESLint 10. En su lugar: `@eslint-react/eslint-plugin`, `eslint-plugin-react-hooks` y `eslint-plugin-jsx-a11y-x`. Importaciones: `eslint-plugin-import-x` (`no-cycle`, `order`, y `no-restricted-imports` para aislar `src/engine/`).
