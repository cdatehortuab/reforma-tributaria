# Calculadora reforma tributaria 2026

Estimación aproximada del efecto del proyecto de ley 477 de 2026. El código vive en [este repositorio](https://github.com/cdatehortuab/reforma-tributaria).

## Cómo correrlo

El gestor de paquetes es **pnpm** (fijado en `packageManager`). Con Node 22: `corepack enable`.

```sh
pnpm install
pnpm dev
```

El servidor de desarrollo queda en `http://localhost:4321`.

Antes de abrir un PR:

```sh
pnpm typecheck
pnpm lint
pnpm test
pnpm build
```

## Licencia

[MIT](./LICENSE). El código es público y no incluye secretos.

## Aviso

Tus datos no salen de tu navegador. Es un proyecto de ley en trámite; puede cambiar. Estimación aproximada, **no es asesoría tributaria**.
