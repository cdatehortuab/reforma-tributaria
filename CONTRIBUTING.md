# Cómo contribuir

Este archivo es la fuente de verdad para cambiar el código. [README.md](./README.md) explica qué es el proyecto. [AGENTS.md](./AGENTS.md) solo apunta aquí. El detalle tributario, de arquitectura y de SEO vive en [`docs/`](./docs/).

## Principios (no negociables)

- **100 % en el navegador.** No hay backend, no hay formularios que posteen a ningún lado, no hay scripts de terceros. Los datos viven solo en memoria. Guardar en `localStorage` es opt-in y debe ir con un botón visible «Borrar mis datos».
- **Aviso en cada resultado:** «Tus datos no salen de tu navegador», «Es un proyecto de ley en trámite; puede cambiar», «Estimación aproximada, no es asesoría tributaria». Incluye la fecha «actualizado al» de los parámetros y el estado del proyecto de ley.
- **Código público:** licencia MIT, sin secretos, y cada cifra del motor cita su artículo (ET art. / PL 477 art.).
- **Simple por defecto, detalle a demanda.** El resultado principal va primero; el desglose completo va en `<details>`. Cada concepto tiene un tooltip en lenguaje llano.
- **Aislar el efecto de la reforma.** Compara ambos escenarios con los mismos UVT y SMLMV, para que la diferencia venga solo de la norma. Un interruptor secundario muestra los valores proyectados de 2027 y 2028.

## Política de ramas

Nadie con acceso de escritura empuja directo a `main`. Todo cambio, incluido el de quien mantiene el repo, entra por pull request.

- El PR se fusiona cuando el check de GitHub Actions llamado `ci` está en verde.
- CI **no** exige reseñas.
- Quien tiene acceso de escritura fusiona sus propios pull requests sin reseña, una vez CI está verde.
- Un contribuyente externo (sin write) también abre un PR y necesita CI verde. Antes de fusionar un PR externo, quien tiene write deja una reseña de aprobación. Esa aprobación es parte del merge, no un job de CI.
- No hay force-push a `main`.

Convenciones de PR y commit: mensajes cortos en español o inglés, en modo indicativo, que expliquen el **porqué**. Un PR, un tema. Si el proyecto de ley cambia, el título o la descripción deben citar el artículo y la fuente.

## Checks, en este orden, antes de dar un cambio por terminado

```sh
npm run typecheck
npm run lint
npm run test
npm run build
```

CI ejecuta los mismos cuatro. `npm run lint` usa `--max-warnings=0`: una advertencia falla el build.

El hook de pre-commit corre `eslint --fix` y `prettier --write` sobre los archivos en staging.

## Qué no editar ni commitear

- `dist/` es salida de `astro build`. No se versiona.
- `.astro/`, `.wrangler/`, `coverage/`, `node_modules/` y `.env*` tampoco.
- No hay secretos en el repo. El token de Cloudflare para el deploy vive como secret de GitHub Actions (`CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID`).

## Mapa de `docs/`

No copies este material a README ni a AGENTS.md. Ábrelo cuando lo necesites:

| Archivo                                                    | Cuándo abrirlo                                                              |
| :--------------------------------------------------------- | :-------------------------------------------------------------------------- |
| [docs/reforma-tributaria.md](./docs/reforma-tributaria.md) | Qué cambia el PL 477 por tema, con artículo y vigencia                      |
| [docs/parametros.md](./docs/parametros.md)                 | Fuente y fecha de cada constante numérica; bitácora de actualizaciones      |
| [docs/engine.md](./docs/engine.md)                         | Estructura del motor, convención `{ total, lineas }`, cómo añadir un módulo |
| [docs/arquitectura.md](./docs/arquitectura.md)             | Por qué client-only + Workers Static Assets, CSP y privacidad               |
| [docs/seo.md](./docs/seo.md)                               | URLs, términos de búsqueda y cómo añadir una landing                        |
| [docs/decisiones.md](./docs/decisiones.md)                 | Decisiones ya tomadas, para no reabrirlas                                   |

## Cómo actualizar parámetros cuando el proyecto de ley se enmienda

1. Cambia `src/engine/params/proyecto.ts` (y, si aplica, `src/engine/params/constants.ts`). No pongas cifras en la lógica: van en datos.
2. Actualiza la fecha «actualizado al» en esos archivos y en la UI.
3. Anota la fuente (Gaceta, ponencia, texto aprobado) en `docs/parametros.md`.
4. Añade o ajusta fixtures en `tests/engine/` con el resultado esperado.
5. Corre los cuatro checks de arriba y abre un PR.

Si cambia la norma vigente y no el proyecto, el archivo es `src/engine/params/vigente.ts`.

## Motor de reglas

`src/engine/` es TypeScript puro: nada de React, nada de `astro:*`. ESLint lo impide (`no-restricted-imports` y `linterOptions.noInlineConfig`). No uses `any` ni `eslint-disable` ahí. Las funciones exportadas llevan tipo de retorno explícito (`@typescript-eslint/explicit-module-boundary-types`).
