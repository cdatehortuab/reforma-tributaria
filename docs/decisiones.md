# Decisiones

Registro breve. No reabrir sin un hecho nuevo (cambio de producto, de plataforma o de la ley).

## 2026-11-04 — Retención: cupos anuales arrastrados, no prorrateo ÷ 12

El empleador acumula el 25 % (790/630 UVT), el tope conjunto (1.340/1.180 UVT) y el AFC (3.800 UVT) mes a mes hasta agotar el año. El 40 % del art. 388 y los topes propios del art. 387 (32, 100 y 16 UVT) siguen siendo de cada mes. El titular de la UI es enero (cupo lleno); `proyectarRetencion` da el mes en que sube y los 12 meses. No se anualiza con prima.

## 2026-11-01 — Versión en `release/X.Y.Z`, tag en cada push a `main`

Los PRs de trabajo van a `dev` y se fusionan con squash. Un release es un PR `release/X.Y.Z` → `main`; el nombre de la rama es la versión. El workflow de PRs a `main` actualiza `package.json` si aún no coincide. Al fusionar, el workflow **Release** crea el tag y el GitHub Release. Cloudflare publica `main` (un deploy: la versión ya iba en esa rama). No hay rama `production` ni deploy key: en un repo de usuario GitHub Actions no puede ser bypass de un ruleset.

Los cuatro checks no se duplican: `.github/actions/checks` es un composite action. No usamos un reusable workflow (`workflow_call`) porque GitHub nombra el check `job / job` y rompería el ruleset que exige `ci`, y porque el bump de versión tiene que vivir en el mismo working tree que typecheck/lint/test/build.

## 2026-11-01 — `dev` integra, squash solo hacia `dev`

`dev` es la rama predeterminada. Squash hacia `main` está apagado: rebase and merge cuando la historia es lineal, merge commit cuando no.

## 2026-11-01 — Workers Static Assets, no Pages

Cloudflare mantiene Pages en modo mantenimiento y dirige proyectos nuevos a Workers. Este sitio no necesita un Worker script: solo HTML/CSS/JS estático. Assets-only evita el tope de invocaciones del plan gratuito. `_headers` funciona igual que en Pages.

## 2026-11-01 — Astro con islas React, no un SPA

Las landings deben indexar y funcionar sin JavaScript. Las calculadoras son islas. El motor es TypeScript puro, independiente de la UI.

## 2026-11-01 — CSP en `_headers`, `connect-src 'none'`

La garantía de privacidad tiene que ser comprobable desde la respuesta HTTP. `connect-src 'none'` impide que el front hable con red. `style-src` incluye `'unsafe-inline'` porque el HTML estático de Astro/Tailwind lleva estilos en línea; `script-src` sigue en `'self'`.

## 2026-11-01 — Workers Builds, no `wrangler deploy` desde GitHub

GitHub corre `ci` y **Release** (tag + GitHub Release). El `wrangler deploy` lo hace Cloudflare al ver un push a `main`. No hay `CLOUDFLARE_API_TOKEN` en GitHub. Previews en `dev` y PRs.

## 2026-11-01 — pnpm, no npm

Instalaciones más rápidas y un lockfile más estricto. La versión va en `packageManager` para que Corepack y CI usen la misma. El check `ci` corre `pnpm install --frozen-lockfile`.

## 2026-11-01 — ESLint 10 y plugins equivalentes

`eslint-plugin-astro` 3 exige ESLint 10. `eslint-plugin-react` y `eslint-plugin-jsx-a11y` aún no declaran ESLint 10. En su lugar: `@eslint-react/eslint-plugin`, `eslint-plugin-react-hooks` y `eslint-plugin-jsx-a11y-x`. Importaciones: `eslint-plugin-import-x` (`no-cycle`, `order`, y `no-restricted-imports` para aislar `src/engine/`).
