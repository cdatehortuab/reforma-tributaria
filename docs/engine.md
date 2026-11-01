# Motor de reglas

TypeScript puro en `src/engine/`. No importa React, layouts, páginas ni `astro:*`. Vitest lo cubre en `tests/engine/`. La UI solo consume el resultado.

## Convención `{ total, lineas }`

Cada función de cálculo exportada devuelve:

```ts
interface LineaCalculo {
  readonly concepto: string;
  readonly valor: number;
  readonly articulo: string;
  readonly explicacion: string;
}

interface ResultadoCalculo {
  readonly total: number;
  readonly lineas: readonly LineaCalculo[];
}
```

`total` es la cifra que muestra el titular. `lineas` alimenta el desglose en `<details>` (concepto, valor, artículo, explicación en lenguaje llano). `consolidarResultado` en `src/engine/resultado.ts` suma líneas para los módulos que se arman por partes.

## `vigente` vs `proyecto`

| Nombre     | Significado                |
| :--------- | :------------------------- |
| `vigente`  | Estatuto Tributario actual |
| `proyecto` | PL 477 de 2026             |

Los dos escenarios se evalúan con los mismos UVT y SMLMV (`params/constants.ts`) para que la diferencia sea solo legal. No mezclar inflación proyectada en esa resta.

## Cómo añadir un módulo

1. Parámetros en `params/vigente.ts` y `params/proyecto.ts`, cada número con artículo. Si es una constante oficial (UVT, SMLMV), va en `params/constants.ts` y se documenta en `docs/parametros.md`.
2. Función pura en `src/engine/<modulo>.ts` (por ejemplo `salario.ts`, `retencion.ts`, `renta.ts`, `iva.ts`). Tipo de retorno explícito; sin `any`; sin `eslint-disable`.
3. Reexportar desde `src/engine/index.ts`.
4. Fixtures en `tests/engine/<modulo>.test.ts`. El plan pide al menos 15 perfiles de salario (1, 2, 4, 6, 10, 20 SMLMV, integral, con y sin dependientes, etc.) contrastados a mano con la tabla oficial de retención.
5. La isla React en `src/components/` solo formatea y pinta. Nada de reglas de impuesto en el componente.

Módulos previstos: `salario.ts` (aportes), `retencion.ts` (art. 383 proc. 1), `renta.ts` (cédula general, arts. 206, 336, 241), `iva.ts`, `consumo.ts`, `rendimientos.ts`.
