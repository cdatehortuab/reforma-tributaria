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

## Módulos laborales (salario, retención, renta)

Entrada común: `EntradaLaboral` en `entrada.ts` (salario mensual, ordinario/integral, personas a cargo, intereses de vivienda, medicina prepagada, aportes voluntarios a pensión/AFC). Ceros = no aplica.

| Módulo         | `total`                                        | Notas                                                                                                                                                                                                                                                      |
| :------------- | :--------------------------------------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `salario.ts`   | Aportes del trabajador (salud + pensión + FSP) | IBC = salario, o 70 % si es integral, tope 25 SMLMV. Salud del PL 477 por tramo del **IBC** en SMLMV. FSP vigente (Ley 100); la Ley 2381 no entra en la comparación.                                                                                       |
| `retencion.ts` | Retención de enero (con cupo)                  | Depura con `cedula.ts` en periodo mensual. `proyectarRetencion` arrastra 12 meses iguales. Art. 388: el 40 % es de cada mes; el 25 % (790/630 UVT), el tope global (1.340/1.180 UVT) y el AFC (3.800 UVT) son cupos anuales restantes, no ÷ 12. Tabla 383. |
| `renta.ts`     | Impuesto anual de la cédula general            | Anualiza × 12 (mes típico; no incluye prima ni cesantías). 25 % con tope 790/630 UVT, 40 % y tope 1.340/1.180 UVT, más 72 UVT/dependiente solo en vigente. Tabla 241.                                                                                      |
| `laboral.ts`   | —                                              | `compararLaboral` arma ambos escenarios. `netoMensual` usa la retención de enero; `netoMensualTrasAgotarCupos` usa el mes 12. `proyeccionRetencion` alimenta el aviso y la tabla de la UI.                                                                 |

`cedula.ts` es el depurador compartido. Orden: no constitutivos (aportes obligatorios) → deducciones art. 387 (topes mensuales de 32, 100 y 16 UVT) → otras exentas (AFC/voluntarios, art. 126-1, sujetas al 40 % y al cupo de 3.800 UVT) → 25 % laboral (cupo 790/630 UVT) → límite 40 % del mes y cupo global restante (1.340/1.180 UVT) → 72 UVT del art. 336 solo en la declaración.

En retención los cupos anuales se descuentan de lo que queda, no se prorratean. Si el 40 % o el cupo global recortan, se pierde primero el 25 %, luego el AFC y al final las deducciones 387. La proyección asume 12 salarios iguales y no incluye prima de servicios: en la vida real el salto puede llegar un mes antes.

Tablas UVT: `aplicarTablaUvt` en `tramos.ts` usa el `impuestoAcumuladoUvt` del tramo (la norma redondea el acumulado). Las UVT no se aproximan; el peso sí (`aPesos` en `dinero.ts`).
