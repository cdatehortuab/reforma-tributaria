# Parámetros

Fuente y vigencia de cada constante numérica del motor. Si el Congreso enmienda el proyecto, actualiza `src/engine/params/proyecto.ts`, la fecha «actualizado al» y este archivo.

No inventar cifras. Una constante entra al motor solo con documento (resolución DIAN, decreto, Gaceta del Congreso o texto del PL 477) y artículo.

Corte de esta bitácora: **2026-11-02**. Texto del PL 477: el radicado el 29 de octubre de 2026 (Cámara, proyecto 36548). Estado: **en trámite**.

## Bitácora

| Fecha      | Qué cambió                                                                                           | Fuente                                                                      |
| :--------- | :--------------------------------------------------------------------------------------------------- | :-------------------------------------------------------------------------- |
| 2026-11-02 | UVT, SMLMV, tablas vigentes 241/383/206/336, tablas del PL 477, salud art. 21 y EfectIVA arts. 38-40 | Resolución DIAN 000238/2025, Decreto 1469/2025, ET vigente, PL 477 radicado |
| 2026-11-01 | Estructura del repo. UVT, SMLMV y tablas pendientes de verificación.                                 | Scaffold inicial                                                            |

## Dónde viven en código

| Constante                                                   | Archivo                          |
| :---------------------------------------------------------- | :------------------------------- |
| UVT, SMLMV, auxilio, pensión, FSP, IBC, arts. 387/119/126-1 | `src/engine/params/constants.ts` |
| Tablas y topes de la norma actual                           | `src/engine/params/vigente.ts`   |
| Tablas y topes del PL 477                                   | `src/engine/params/proyecto.ts`  |

La comparación «hoy vs. reforma» usa **los mismos** UVT y SMLMV en ambos escenarios. Un interruptor aparte puede mostrar valores proyectados de 2027 y 2028; eso no debe mezclarse con el aislamiento del efecto legal.

`areParametrosVerificados` es verdadero desde este corte. El proyecto sigue en trámite: la UI debe decirlo y mostrar `ACTUALIZADO_AL`.

## Constantes oficiales 2026

### UVT

| Campo     | Valor                                                                                                         |
| :-------- | :------------------------------------------------------------------------------------------------------------ |
| Valor     | **$52.374**                                                                                                   |
| Vigencia  | Año 2026                                                                                                      |
| Norma     | ET art. 868                                                                                                   |
| Documento | Resolución DIAN **000238** del 15 de diciembre de 2025, Diario Oficial **53.338** del 17 de diciembre de 2025 |
| Cálculo   | IPC de clase media 5,17 % (certificación DANE 205971 del 9 de octubre de 2025)                                |

Compilación: [Resolución 238 de 2025 DIAN](https://normograma.dian.gov.co/dian/compilacion/docs/resolucion_dian_0238_2025.htm).

### SMLMV

| Campo     | Valor                                                                                                                                                                 |
| :-------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Valor     | **$1.750.905**                                                                                                                                                        |
| Vigencia  | Desde el 1 de enero de 2026                                                                                                                                           |
| Documento | Decreto **1469** del 29 de diciembre de 2025, Diario Oficial **53.350**. Incremento del 23 % sobre $1.423.500 (Decreto 1572 de 2024).                                 |
| Nota      | El Decreto 159 de 2026 (transitorio) fijó el mismo monto. La Sección II del Consejo de Estado reactivó el 1469; el proceso de nulidad sigue y **el valor no cambia**. |

HTML: [Decreto 1469 de 2025](https://normograma.mintic.gov.co/mintic/compilacion/docs/decreto_1469_2025.htm). PDF: [Presidencia](https://dapre.presidencia.gov.co/normativa/normativa/DECRETO%201469%20DEL%2029%20DE%20DICIEMBRE%20DE%202025.pdf).

### Auxilio de transporte

**$249.095** mensuales desde el 1 de enero de 2026, para quien devengue hasta 2 SMLMV. Decreto **1470** del 29 de diciembre de 2025, Diario Oficial 53.350.

### Pensión y Fondo de Solidaridad Pensional

No los cambia el PL 477. Van en `constants.ts` para no mezclarlos con el efecto de la reforma tributaria.

| Concepto                          | Tarifa                                                    | Fuente                                                     |
| :-------------------------------- | :-------------------------------------------------------- | :--------------------------------------------------------- |
| Cotización pensión                | 16 % (empleado 4 %, empleador 12 %)                       | Ley 100 de 1993, art. 20 (Ley 797 de 2003, art. 7)         |
| FSP vigente                       | 0 % bajo 4 SMLMV; 1 % desde 4; recargo hasta 2 % desde 20 | Ley 100 art. 27 (Ley 797 art. 8); DUR 1833 art. 2.2.14.1.6 |
| FSP Ley 2381                      | 1,5 % / 1,8 % / 2,5 % / 2,8 % / 3,0 %                     | Ley 2381 de 2024, art. 20 nums. 1 a 5                      |
| Vigencia Ley 2381                 | **1 de abril de 2027**                                    | Corte Constitucional, sentencia C-264 de 2026              |
| IBC tope                          | 25 SMLMV                                                  | Ley 100 arts. 18 y 204 par. 3                              |
| Salario integral, base cotización | 70 %                                                      | CST art. 132                                               |

La tabla de la Ley 2381 **no** entra en la resta «hoy vs. PL 477».

## Norma vigente: renta, retención y cédula general

Texto del Estatuto Tributario, contrastado en [estatuto.co/241](https://estatuto.co/241), [estatuto.co/383](https://estatuto.co/383), [estatuto.co/206](https://estatuto.co/206) y [estatuto.co/336](https://estatuto.co/336). Ley 2277 de 2022 (arts. 2 y 7) y Ley 2010 de 2019 (arts. 34 y 42).

### Art. 241 — tarifa de renta de personas naturales (7 tramos)

| Desde (UVT) | Hasta (UVT) | Tarifa marginal | Impuesto en UVT                 |
| ----------: | ----------: | --------------: | :------------------------------ |
|           0 |       1.090 |              0% | 0                               |
|       1.090 |       1.700 |             19% | (Base − 1.090) × 19 %           |
|       1.700 |       4.100 |             28% | (Base − 1.700) × 28 % + 116     |
|       4.100 |       8.670 |             33% | (Base − 4.100) × 33 % + 788     |
|       8.670 |      18.970 |             35% | (Base − 8.670) × 35 % + 2.296   |
|      18.970 |      31.000 |             37% | (Base − 18.970) × 37 % + 5.901  |
|      31.000 | En adelante |             39% | (Base − 31.000) × 39 % + 10.352 |

### Art. 383 — retención en la fuente, procedimiento 1 (art. 385)

| Desde (UVT) | Hasta (UVT) | Tarifa marginal | Retención en UVT               |
| ----------: | ----------: | --------------: | :----------------------------- |
|           0 |          95 |              0% | 0                              |
|          95 |         150 |             19% | (Ingreso − 95) × 19 %          |
|         150 |         360 |             28% | (Ingreso − 150) × 28 % + 10    |
|         360 |         640 |             33% | (Ingreso − 360) × 33 % + 69    |
|         640 |         945 |             35% | (Ingreso − 640) × 35 % + 162   |
|         945 |       2.300 |             37% | (Ingreso − 945) × 37 % + 268   |
|       2.300 | En adelante |             39% | (Ingreso − 2.300) × 39 % + 770 |

### Art. 206 numeral 10 y art. 336

| Concepto                                | Valor vigente                                                              | Fuente                                           |
| :-------------------------------------- | :------------------------------------------------------------------------- | :----------------------------------------------- |
| Renta exenta laboral                    | 25 %, tope **790 UVT**/año                                                 | ET art. 206 num. 10                              |
| Límite conjunto exentas + deducciones   | 40 % del ingreso neto, tope **1.340 UVT**/año                              | ET art. 336 num. 3 inc. 1                        |
| Deducción adicional por dependiente     | **72 UVT** × hasta 4, fuera del tope                                       | ET art. 336 num. 3 inc. 2                        |
| Deducción por dependientes en retención | 10 % del ingreso bruto laboral, tope 32 UVT/mes (384 UVT/año)              | ET art. 387 inc. 2; el PL 477 **no** la deroga   |
| Medicina prepagada / póliza de salud    | Hasta 16 UVT/mes                                                           | ET art. 387 inc. 2                               |
| Intereses de crédito de vivienda        | 100 UVT/mes en retención; **1.200 UVT**/año en la declaración              | ET art. 119 y art. 387; DUR 1625 art. 1.2.4.1.23 |
| Aportes voluntarios a pensión y AFC     | Renta exenta: 30 % del ingreso laboral y **3.800 UVT**/año, sujeta al 40 % | ET art. 126-1; el PL 477 no la modifica          |

### Salud vigente y exoneración patronal

| Concepto                    | Valor                                            | Fuente           |
| :-------------------------- | :----------------------------------------------- | :--------------- |
| Salud empleado              | 4 %                                              | Ley 100 art. 204 |
| Salud empleador             | 8,5 %                                            | Ley 100 art. 204 |
| Salud independiente         | 12,5 %                                           | Ley 100 art. 204 |
| Exoneración SENA/ICBF/salud | Trabajadores que devenguen **menos de 10** SMLMV | ET art. 114-1    |

### Patrimonio vigente (informativo)

Umbral **72.000 UVT** (ET art. 294-3). Tabla 2026 del art. 296-3: 0 % / 0,5 % / 1,0 % / 1,5 %. El 1,5 % solo aplica 2023-2026; sin reforma, desde 2027 el máximo vigente sería 1 % desde 122.000 UVT.

## PL 477 de 2026 (texto radicado)

Documento: [PDF de la Cámara, proyecto 36548](https://www.camara.gov.co/wp-content/uploads/2026/10/proyectos-ley/documentos/proyecto-36548/PROYECTO-DE-LEY-Rescate-Economico-2026-VSD-RADICADA-1.pdf). 106 artículos; toca 55 del Estatuto.

### Art. 48 — tabla de renta (ET art. 241), 6 tramos

| Desde (UVT) | Hasta (UVT) | Tarifa marginal | Impuesto en UVT               |
| ----------: | ----------: | --------------: | :---------------------------- |
|           0 |         720 |              0% | 0                             |
|         720 |       1.090 |              9% | (Base − 720) × 9 %            |
|       1.090 |       1.700 |             19% | (Base − 1.090) × 19 % + 33    |
|       1.700 |       4.100 |             28% | (Base − 1.700) × 28 % + 149   |
|       4.100 |       8.670 |             33% | (Base − 4.100) × 33 % + 821   |
|       8.670 | En adelante |             39% | (Base − 8.670) × 39 % + 2.329 |

Desaparecen los tramos del 35 % y del 37 %.

### Art. 50 — retención (ET art. 383)

| Desde (UVT) | Hasta (UVT) | Tarifa marginal | Retención en UVT             |
| ----------: | ----------: | --------------: | :--------------------------- |
|           0 |          65 |              0% | 0                            |
|          65 |          95 |              9% | (Ingreso − 65) × 9 %         |
|          95 |         150 |             19% | (Ingreso − 95) × 19 % + 3    |
|         150 |         360 |             28% | (Ingreso − 150) × 28 % + 13  |
|         360 |         640 |             33% | (Ingreso − 360) × 33 % + 72  |
|         640 | En adelante |             39% | (Ingreso − 640) × 39 % + 164 |

Parágrafo 1: si el independiente toma costos y gastos, la retención pasa al art. 392. Se elimina el parágrafo del procedimiento 2.

### Arts. 47, 49 y 106 — cédula general

| Concepto                            | Proyecto                             | Artículo PL                                 |
| :---------------------------------- | :----------------------------------- | :------------------------------------------ |
| Renta exenta laboral 25 %           | Tope **630 UVT**/año                 | Art. 47                                     |
| Límite conjunto 40 %                | Tope **1.180 UVT**/año               | Art. 49                                     |
| 72 UVT por dependiente              | **Derogado**                         | Art. 106 (inciso 2 del num. 3 del art. 336) |
| Exenciones nums. 7 y 9 del art. 206 | Derogadas (gastos de representación) | Art. 106                                    |

### Art. 21 — cotización de salud (Ley 100 art. 204)

Vigencia: **1 de enero de 2027**. El empleador sigue en **8,5 %**. El empleado deja de ser plano.

| Ingreso (SMLMV)      | Empleado | Independiente |
| :------------------- | -------: | ------------: |
| Hasta 2              |       4% |         12,5% |
| Más de 2 y hasta 4   |     5,5% |           13% |
| Más de 4 y hasta 5   |       6% |         13,5% |
| Más de 5 y hasta 10  |     6,5% |           14% |
| Más de 10 y hasta 15 |       7% |         14,5% |
| Más de 15 y hasta 20 |     7,5% |           15% |
| Más de 20 y hasta 25 |       8% |         15,5% |

Regímenes especiales y de excepción: el empleador se mantiene en 1,5 %; el trabajador se incrementa 1,5 puntos (más de 2 y hasta 3 SMLMV) o 2,5 puntos (más de 3 SMLMV), destinado al régimen subsidiado.

Los arts. **22 a 26** no fijan tarifas de cotización del trabajador: destinan un punto de cajas a la ADRES (22), saldos y excedentes del FOSFEC (23 y 24), reserva matemática del art. 14 de la Ley 100 (25) y traslado de recursos pensionales de la Ley 2381 (26).

### Art. 20 — exoneración de aportes (ET art. 114-1)

Desde el **1 de enero de 2027**: exoneración total hasta **2 SMLMV**; entre más de 2 y 3 SMLMV el empleador paga SENA 1 %, ICBF 1 % y salud 4 %; por encima de 3 SMLMV no hay exoneración.

### Arts. 38 a 40 — EfectIVA

Vigencia: **1 de enero de 2028**. Devolución **por persona**, no por hogar, del IVA efectivamente pagado (factura electrónica).

| Regla             | Contenido                                                                                                                                | Artículo      |
| :---------------- | :--------------------------------------------------------------------------------------------------------------------------------------- | :------------ |
| Beneficiarios     | Personas naturales residentes en pobreza extrema, pobreza o vulnerabilidad, según el instrumento de focalización vigente                 | Art. 38       |
| 100 %             | Pobreza extrema, pobreza **y** el tramo de menores ingresos de la población vulnerable                                                   | Art. 38       |
| 50 %, 40 % y 30 % | Los demás tramos de vulnerabilidad, en orden creciente de ingreso                                                                        | Art. 38       |
| Mapeo a Sisbén    | **Pendiente.** Lo fijan DNP y MinHacienda; no está en el articulado. No hardcodear grupos A/B/C/D hasta esa reglamentación.              | Art. 38       |
| Tope              | **5,5 UVT** por persona al mes, actualizable con el PIB real a 12 meses a septiembre                                                     | Art. 38       |
| Periodicidad      | Liquidación y pago en periodos de máximo 15 días calendario                                                                              | Arts. 38 y 39 |
| Monto mínimo      | Solo pobreza extrema, fijado por MinHacienda en el mismo acto del tope; el mes es el mayor entre el mínimo y el cálculo, sin sumarlos    | Art. 38 par.  |
| Naturaleza        | No es subsidio ni ingreso laboral; no es renta ni ganancia ocasional; inembargable; no causa GMF                                         | Arts. 39 y 40 |
| Transición        | Giro anticipado a más tardar el 20 de diciembre de 2027; los hogares de la compensación IVA (Ley 2010 art. 21) no se cruzan con EfectIVA | Art. 40       |

La exposición de motivos estima 100 % en los deciles 1 a 3, 50 % en el 4, 40 % en el 5 y 30 % en el 6. Eso **no** es el articulado: no usarlo como regla del motor.

En la UI, «Sisbén A, B, C, D o no tengo» puede recogerse, pero el porcentaje solo se aplica cuando exista el mapeo de DNP o el usuario elija el tramo legal (pobreza / vulnerabilidad 1 a 4).

### Patrimonio (informativo)

Arts. 66 a 68: el impuesto queda para 2027-2030. Umbral **95.500 UVT**. Tabla: 0 % hasta 95.500; 0,5 % hasta 145.500; 1,0 % + 250 UVT desde 145.500.

## Pendiente de reglamentación o de otro régimen (no de verificación de cifras)

- Correspondencia de los tramos de EfectIVA con Sisbén u otro clasificador (DNP + MinHacienda, PL art. 38).
- Monto mínimo mensual de EfectIVA para pobreza extrema (MinHacienda, PL art. 38 par.).
- Proceso de nulidad del Decreto 1469 de 2025: el SMLMV sigue en $1.750.905 hasta sentencia.
- Tarifas del FSP de la Ley 2381, desde el 1 de abril de 2027: ajenas al PL 477.
