# Calculadora reforma tributaria 2026

Estimación aproximada del efecto del proyecto de ley 477 de 2026 sobre salarios, IVA de alimentos y otros impuestos en Colombia. El código vive en [este repositorio](https://github.com/cdatehortuab/reforma-tributaria).

El sitio se publica como assets estáticos en Cloudflare Workers. El check `ci` vive en GitHub. Un PR `release/X.Y.Z` → `main` publica producción (Workers Builds) y el workflow **Release** crea el tag y el GitHub Release. `dev` y el resto de ramas son Preview URLs. Todavía no hay un despliegue de producción.

## Cómo correrlo

El gestor de paquetes es **pnpm** (fijado en `packageManager`). Con Node 22: `corepack enable`.

```sh
pnpm install
pnpm dev
```

El servidor de desarrollo queda en `http://localhost:4321`.

Otros comandos:

| Comando             | Acción                            |
| :------------------ | :-------------------------------- |
| `pnpm typecheck`    | Comprueba tipos con `astro check` |
| `pnpm lint`         | ESLint con `--max-warnings=0`     |
| `pnpm test`         | Vitest                            |
| `pnpm build`        | Genera `dist/`                    |
| `pnpm wrangler:dev` | Sirve el build con Wrangler       |

Los cálculos viven en `src/engine/` y se ejecutan solo en el navegador.

## Licencia

[MIT](./LICENSE). El código es público y no incluye secretos.

## Aviso

Tus datos no salen de tu navegador. Es un proyecto de ley en trámite; puede cambiar. Estimación aproximada, **no es asesoría tributaria**.

Para contribuir, lee [CONTRIBUTING.md](./CONTRIBUTING.md).
