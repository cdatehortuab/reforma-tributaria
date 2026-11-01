# Decisiones

Registro breve. No reabrir sin un hecho nuevo (cambio de producto, de plataforma o de la ley).

## 2026-11-01 — Workers Static Assets, no Pages

Cloudflare mantiene Pages en modo mantenimiento y dirige proyectos nuevos a Workers. Este sitio no necesita un Worker script: solo HTML/CSS/JS estático. Assets-only evita el tope de invocaciones del plan gratuito. `_headers` funciona igual que en Pages.

## 2026-11-01 — Astro con islas React, no un SPA

Las landings deben indexar y funcionar sin JavaScript. Las calculadoras son islas. El motor es TypeScript puro, independiente de la UI.

## 2026-11-01 — CSP en `_headers`, `connect-src 'none'`

La garantía de privacidad tiene que ser comprobable desde la respuesta HTTP. `connect-src 'none'` impide que el front hable con red. `style-src` incluye `'unsafe-inline'` porque el HTML estático de Astro/Tailwind lleva estilos en línea; `script-src` sigue en `'self'`.

## 2026-11-01 — Workers Builds, no GitHub Actions para el deploy

GitHub se queda con el check `ci` (typecheck, lint, test, build), que es el que exige el ruleset de `main`. El deploy lo hace Cloudflare al conectar el repo: previews por rama, logs de build en el dashboard, sin token de cuenta en GitHub. Un workflow propio duplicaba eso y el preview compartido (`reforma-tributaria-preview`) era peor que las Preview URLs nativas.

## 2026-11-01 — pnpm, no npm

Instalaciones más rápidas y un lockfile más estricto. La versión va en `packageManager` para que Corepack y CI usen la misma. El check `ci` corre `pnpm install --frozen-lockfile`.

## 2026-11-01 — ESLint 10 y plugins equivalentes

`eslint-plugin-astro` 3 exige ESLint 10. `eslint-plugin-react` y `eslint-plugin-jsx-a11y` aún no declaran ESLint 10. En su lugar: `@eslint-react/eslint-plugin`, `eslint-plugin-react-hooks` y `eslint-plugin-jsx-a11y-x`. Importaciones: `eslint-plugin-import-x` (`no-cycle`, `order`, y `no-restricted-imports` para aislar `src/engine/`).
