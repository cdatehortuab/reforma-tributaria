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

Los dos escenarios se evalúan con los mismos UVT y SMLMV (`params/constants.ts`) para que la diferencia sea solo legal. No mezclar inflación proyectada en esa resta. Las tarifas del Fondo de Solidaridad Pensional de la Ley 2381 tampoco entran en esa resta: viven en `constants.ts`, no en `proyecto.ts`.

Cada tramo y tope lleva `fuente` (artículo y documento). El corte de verificación es `ACTUALIZADO_AL`. Detalle de las cifras: `docs/parametros.md`.

`vigente` y `proyecto` van como `as const` (datos + literales). El contrato tipado lo define cada módulo al implementarse: p. ej. `renta.ts` exporta el tipo de parámetros que necesita y ambos objetos lo `satisfies`. Hasta entonces no inventar un tipo compartido en `params/`.

**Regla de datos:** las tablas de rangos (`TramoUvt`, `TramoSmlmv`) se definen en orden ascendente y contiguo. Lo afirma `tests/engine/params.test.ts`. El motor las asume así; no las reordena ni lanza en runtime por eso. Los `tramos` de EfectIVA son categorías (proporciones), no rangos: esa regla no les aplica.

## Cómo añadir un módulo

1. Parámetros en `params/vigente.ts` y `params/proyecto.ts`, cada número con artículo. Si es una constante oficial (UVT, SMLMV), va en `params/constants.ts` y se documenta en `docs/parametros.md`.
2. Función pura en `src/engine/<modulo>.ts` (por ejemplo `salario.ts`, `retencion.ts`, `renta.ts`, `iva.ts`). Tipo de retorno explícito; sin `any`; sin `eslint-disable`. Define ahí el tipo de parámetros del módulo y haz que `vigente` / `proyecto` (o el subobjeto que use) lo satisfagan.
3. Reexportar desde `src/engine/index.ts`.
4. Fixtures en `tests/engine/<modulo>.test.ts`. El plan pide al menos 15 perfiles de salario (1, 2, 4, 6, 10, 20 SMLMV, integral, con y sin dependientes, etc.) contrastados a mano con la tabla oficial de retención.
5. La isla React en `src/components/` solo formatea y pinta. Nada de reglas de impuesto en el componente.

Módulos previstos: `salario.ts` (aportes), `retencion.ts` (art. 383 proc. 1), `renta.ts` (cédula general, arts. 206, 336, 241), `iva.ts`, `consumo.ts`, `rendimientos.ts`.
