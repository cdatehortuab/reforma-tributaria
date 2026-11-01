# Arquitectura

```mermaid
flowchart LR
  subgraph build [Astro static build]
    Landing["SEO pages (.astro, zero JS)"]
    Islands["React islands (calculators)"]
    Engine["Rules engine (pure TS)"]
    Params["Versioned parameters: vigente / proyecto"]
  end
  Params --> Engine
  Engine --> Islands
  Islands --> Landing
  build -->|"wrangler deploy"| CF["Workers Static Assets (CDN, _headers CSP, no Worker script)"]
  CF --> Browser["User browser: all computation local"]
```

## Por qué client-only

El producto pide datos de salario, dependientes y gastos. Esos datos no deben salir del aparato. Sin backend no hay formulario que postee, no hay analítica de terceros por defecto y `connect-src 'none'` en CSP lo hace verificable. `localStorage` es opt-in, con «Borrar mis datos».

## Por qué Workers Static Assets

Cloudflare dirige proyectos nuevos aquí (Pages queda en mantenimiento). Servir solo archivos estáticos es ilimitado y gratuito. Las invocaciones de Worker script en el plan gratuito tienen tope (100.000/día), así que este sitio es **solo assets**: no hay `main`, no hay `run_worker_first`.

`wrangler.jsonc` apunta `assets.directory` a `./dist` y usa `not_found_handling: "404-page"` para respetar el 404 de Astro. `single-page-application` serviría `index.html` y ocultaría 404 reales.

En local: `pnpm wrangler:dev` (`astro build` + `wrangler dev`).

Producción: el workflow **Release** (manual, en `main`) sube `package.json`, taguea y crea el GitHub Release. El workflow **Deploy** (manual, con la versión) apunta `production` a ese tag; un rollback es el mismo workflow con una versión anterior. Workers Builds publica cuando se mueve `production`. Un merge a `main` no sale a producción.

Previews: Workers Builds en ramas que no son `production` (`dev`, PRs). GitHub no guarda un token de Cloudflare.

## CSP y privacidad

`public/_headers` se copia a `dist` y Workers lo aplica a las respuestas estáticas:

- `default-src 'self'`
- `connect-src 'none'` (nada de fetch, XHR ni beacons)
- `Referrer-Policy: no-referrer`
- `Permissions-Policy` restrictiva
- `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`

`style-src` admite `'unsafe-inline'` porque Astro y Tailwind emiten estilos en línea en el HTML estático. No se afloja `script-src` ni `connect-src`. Ver `docs/decisiones.md`.

## Estructura del repo

| Ruta              | Rol                                                           |
| :---------------- | :------------------------------------------------------------ |
| `src/engine/`     | Motor puro, testeable sin UI                                  |
| `src/components/` | Islas React                                                   |
| `src/pages/`      | Landings SEO en `.astro` (JS en cero por defecto)             |
| `src/content/`    | FAQ, glosario y resúmenes de artículos (colecciones Markdown) |
| `src/layouts/`    | Cáscara HTML, `lang="es-CO"`                                  |
| `tests/engine/`   | Vitest                                                        |
| `public/_headers` | CSP y cabeceras                                               |
| `docs/`           | Conocimiento del proyecto que no va en README/CONTRIBUTING    |
