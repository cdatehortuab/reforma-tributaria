# Calculadora reforma tributaria 2026

Estimación aproximada del efecto del [proyecto de ley 477 de 2026](https://github.com/cdatehortuab/reforma-tributaria) sobre salarios, IVA de alimentos y otros impuestos en Colombia.

El sitio está pensado para publicarse como assets estáticos en Cloudflare Workers (`reforma-tributaria.*.workers.dev` o un dominio propio). Todavía no hay un despliegue de producción.

## Cómo correrlo

```sh
npm install
npm run dev
```

El servidor de desarrollo queda en `http://localhost:4321`.

Otros comandos:

| Comando                | Acción                            |
| :--------------------- | :-------------------------------- |
| `npm run typecheck`    | Comprueba tipos con `astro check` |
| `npm run lint`         | ESLint con `--max-warnings=0`     |
| `npm run test`         | Vitest                            |
| `npm run build`        | Genera `dist/`                    |
| `npm run wrangler:dev` | Sirve el build con Wrangler       |

Los cálculos viven en `src/engine/` y se ejecutan solo en el navegador.

## Licencia

[MIT](./LICENSE). El código es público y no incluye secretos.

## Aviso

Tus datos no salen de tu navegador. Es un proyecto de ley en trámite; puede cambiar. Estimación aproximada, **no es asesoría tributaria**.

Para contribuir, lee [CONTRIBUTING.md](./CONTRIBUTING.md).
