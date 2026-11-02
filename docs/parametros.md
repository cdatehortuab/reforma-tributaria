# Parámetros

Fuente y vigencia de cada constante numérica del motor. Si el Congreso enmienda el proyecto, actualiza `src/engine/params/proyecto.ts`, la fecha «actualizado al» y este archivo.

No inventar cifras. Una constante entra al motor solo con documento (resolución DIAN, decreto, Gaceta del Congreso o texto del PL 477) y artículo.

## Bitácora

| Fecha      | Qué cambió                                                               | Fuente           |
| :--------- | :----------------------------------------------------------------------- | :--------------- |
| 2026-11-01 | Estructura del repo. UVT, SMLMV y tablas **pendientes de verificación**. | Scaffold inicial |

## Pendiente de verificación antes del primer release

- **UVT 2026.** Resolución DIAN de UVT. Valor y número de resolución: por llenar.
- **SMLMV 2026.** Decreto del salario mínimo. Valor y número de decreto: por llenar.
- **Tabla de retención art. 383** vigente, para las fixtures de Vitest.
- **Tramos de salud del trabajador (PL arts. 21 a 26).** Texto completo del PL 477 (Gaceta del Congreso o PDF en estatuto.co).
- **Tasas del Fondo de Solidaridad Pensional** tras la Ley 2381.
- **Tramos de renta art. 241** vigentes vs. proyecto (7 vs. 6; 9 % desde 720 UVT; 39 % desde 8.670 UVT).
- **Topes en UVT:** renta exenta 25 % (790 → 630, art. 206); límite 40 % (1.340 → 1.180, art. 336); dependientes 72 UVT hoy, eliminados en el proyecto.
- **EfectIVA:** porcentajes por grupo Sisbén y tope 5,5 UVT/persona/mes (PL arts. 38 a 40).
- **Patrimonio:** umbral 95.500 UVT.

Mientras `verificado` no sea verdadero, la UI debe decirlo: es un proyecto de ley en trámite y la estimación es aproximada.

## Dónde viven en código

| Constante                         | Archivo                          |
| :-------------------------------- | :------------------------------- |
| UVT, SMLMV, metadatos de fuente   | `src/engine/params/constants.ts` |
| Tablas y topes de la norma actual | `src/engine/params/vigente.ts`   |
| Tablas y topes del PL 477         | `src/engine/params/proyecto.ts`  |

La comparación «hoy vs. reforma» usa **los mismos** UVT y SMLMV en ambos escenarios. Un interruptor aparte puede mostrar valores proyectados de 2027 y 2028; eso no debe mezclarse con el aislamiento del efecto legal.
