# Reforma tributaria 2026 (PL 477)

Resumen en lenguaje llano del proyecto de ley 477 de 2026, versionado en el repo para que no se desvíe en silencio del motor. Cada punto lleva artículo del Estatuto Tributario (ET) o del proyecto (PL) y, cuando se conoce, la vigencia.

El texto del proyecto puede cambiar en debates. La fecha «actualizado al» de los parámetros manda sobre este archivo si hay conflicto; al enmendar, actualiza ambos.

Estado del proyecto (2026-11-01): **en trámite**.

## Salarios, aportes y renta de personas naturales

- **Salud del trabajador.** Hoy 4 %. El proyecto introduce tarifas escalonadas por SMLMV (PL arts. 21 a 26). Texto completo de los tramos: investigación pendiente; ver `docs/parametros.md`.
- **Pensión y Fondo de Solidaridad Pensional.** Revisar el estado de la Ley 2381 (reforma pensional) al implementar tasas.
- **Ingresos no constitutivos y deducciones.** Hoy los dependientes de 72 UVT quedan fuera del tope. El proyecto los elimina (ET art. 336).
- **Renta exenta 25 %.** El tope baja de 790 a 630 UVT (ET art. 206).
- **Límite 40 %.** El tope en UVT baja de 1.340 a 1.180 (ET art. 336).
- **Tarifa de renta (art. 241).** Hoy 7 tramos; el proyecto deja 6. El 9 % empezaría en 720 UVT y el 39 % en 8.670 UVT.
- **Retención en la fuente (art. 383), procedimiento 1.** La tabla mensual debe recalcularse con los nuevos tramos.
- **Independientes y contratistas.** Pasan a retención del art. 392 cuando declaren costos.
- **Aportes patronales (art. 114-1).** Cambia la exención de cotizaciones; afecta el costo para pymes.

Vigencia típica de renta: año gravable 2027, salvo que el texto final diga otra cosa.

## IVA y canasta

- **Alimentos.** Arts. 424, 468-1 y 477: varios bienes de la canasta salen de exclusión o tarifa 0 y entran a gravamen, con calendario explícito hacia 2028.
- **EfectIVA.** Devolución del IVA: 100 % para Sisbén A y B; 50 %, 40 % o 30 % en grupos vulnerables; tope 5,5 UVT por persona al mes (PL arts. 38 a 40). La devolución depende de Sisbén, no de factura electrónica.
- **Premio Fiscal (art. 618-1).** Inscripción automática de compradores nominados en factura electrónica.
- **Compras internacionales (art. 428).** IVA sobre compras de menos de USD 200 (Temu, Shein, Amazon).

## Consumo y otros gravámenes

- Licores: IVA más el nuevo impuesto al consumo.
- Cerveza, cigarrillos, bebidas endulzadas (arts. 513-1 a 513-4).
- Gasolina/ACPM: impuesto al carbono más IVA desde 2028.
- Internet estrato 3, cine y espectáculos, nube y software.
- Medicina prepagada: del 5 % al 19 %.
- Celulares y computadores; motos y bicicletas de más de 50 UVT; vehículos eléctricos e híbridos.

## Ahorro, apuestas y patrimonio

- CDT, cuentas de ahorro y fondos de inversión pierden la exclusión del componente inflacionario (arts. 38 a 41).
- Ganancia ocasional de apuestas y loterías: del 20 % al 30 % (art. 317), más IVA a apuestas en línea (art. 420).
- Patrimonio: umbral 95.500 UVT; menos personas lo declararían. Tarjeta informativa, no calculadora de cuánto se paga.

## Calendario

Filtro útil para la página «¿Qué cambia y cuándo?»:

| Momento      | Qué entra                                               |
| :----------- | :------------------------------------------------------ |
| Promulgación | Normas de procedimiento y algunas de vigencia inmediata |
| 2027         | Renta, retención, aportes de salud del trabajador       |
| 2028         | IVA de alimentos, IVA de combustibles, varios consumos  |

Hay 55 artículos en el proyecto. La lista filtrable se implementa en una fase posterior.
