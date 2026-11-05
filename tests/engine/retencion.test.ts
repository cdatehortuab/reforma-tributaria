import { describe, expect, it } from 'vitest';

import {
  aplicarTablaUvt,
  calcularAportes,
  calcularRetencion,
  DEDUCCION_DEPENDIENTES_ART_387,
  MESES_DEL_ANIO,
  pesosAUvt,
  proyecto,
  proyectarRetencion,
  SMLMV_2026,
  TipoSalario,
  UVT_2026,
  uvtAPesos,
  vigente,
} from '../../src/engine';

import type { EntradaLaboral } from '../../src/engine';

const smlmv = SMLMV_2026.valor;
const uvt = UVT_2026.valor;

function entrada(
  salarioMensual: number,
  extras: Partial<Omit<EntradaLaboral, 'salarioMensual'>> = {},
): EntradaLaboral {
  return {
    salarioMensual,
    tipoSalario: extras.tipoSalario ?? TipoSalario.ORDINARIO,
    personasACargo: extras.personasACargo ?? 0,
    interesesViviendaMensual: extras.interesesViviendaMensual ?? 0,
    medicinaPrepagadaMensual: extras.medicinaPrepagadaMensual ?? 0,
    aportesVoluntariosPensionAfcMensual:
      extras.aportesVoluntariosPensionAfcMensual ?? 0,
  };
}

describe('calcularRetencion procedimiento 1', () => {
  it('no retiene a 1 SMLMV ni hoy ni con el proyecto', () => {
    const datos = entrada(smlmv);
    const aportes = calcularAportes(datos, vigente.salud);
    const hoy = calcularRetencion(
      datos,
      aportes.total,
      vigente.retencion,
      vigente.renta,
    );
    const reforma = calcularRetencion(
      datos,
      aportes.total,
      proyecto.retencion,
      proyecto.renta,
    );

    expect(hoy.total).toBe(0);
    expect(reforma.total).toBe(0);
    expect(hoy.baseUvt).toBeLessThan(65);
  });

  it('reproduce a mano un mes de 6 SMLMV sin extras, norma vigente', () => {
    const salario = 6 * smlmv;
    const datos = entrada(salario);
    const aportes = calcularAportes(datos, vigente.salud);
    const resultado = calcularRetencion(
      datos,
      aportes.total,
      vigente.retencion,
      vigente.renta,
    );

    const ingresoNeto = salario - aportes.total;
    const renta25 = Math.round(ingresoNeto * 0.25);
    const base = ingresoNeto - renta25;
    const baseUvt = pesosAUvt(base, uvt);
    const retencionUvt = aplicarTablaUvt(baseUvt, vigente.retencion.tabla383);

    expect(resultado.ingresoNeto).toBe(ingresoNeto);
    expect(resultado.baseGravable).toBe(base);
    expect(resultado.total).toBe(uvtAPesos(retencionUvt, uvt));
    expect(resultado.baseUvt).toBeGreaterThan(95);
    expect(
      resultado.lineas.some((linea) => linea.articulo.includes('383')),
    ).toBe(true);
  });

  it('empieza a retener antes con el proyecto (umbral 65 UVT)', () => {
    const salario = 4 * smlmv;
    const datos = entrada(salario);
    const hoyAportes = calcularAportes(datos, vigente.salud);
    const reformaAportes = calcularAportes(datos, proyecto.salud);
    const hoy = calcularRetencion(
      datos,
      hoyAportes.total,
      vigente.retencion,
      vigente.renta,
    );
    const reforma = calcularRetencion(
      datos,
      reformaAportes.total,
      proyecto.retencion,
      proyecto.renta,
    );

    expect(hoy.baseUvt).toBeLessThanOrEqual(95);
    expect(hoy.total).toBe(0);
    expect(reforma.baseUvt).toBeGreaterThan(65);
    expect(reforma.total).toBeGreaterThan(0);
  });

  it('baja la base cuando hay dependientes (10 % art. 387)', () => {
    const salario = 10 * smlmv;
    const sinDep = entrada(salario);
    const conDep = entrada(salario, { personasACargo: 1 });
    const aportes = calcularAportes(sinDep, vigente.salud);
    const sin = calcularRetencion(
      sinDep,
      aportes.total,
      vigente.retencion,
      vigente.renta,
    );
    const con = calcularRetencion(
      conDep,
      aportes.total,
      vigente.retencion,
      vigente.renta,
    );

    expect(con.baseGravable).toBeLessThan(sin.baseGravable);
    expect(con.total).toBeLessThan(sin.total);
  });
});

describe('proyectarRetencion arrastra cupos anuales', () => {
  it('tiene 12 meses y enero coincide con calcularRetencion sin cupos', () => {
    const datos = entrada(10 * smlmv);
    const aportes = calcularAportes(datos, vigente.salud);
    const enero = calcularRetencion(
      datos,
      aportes.total,
      vigente.retencion,
      vigente.renta,
    );
    const proyeccion = proyectarRetencion(
      datos,
      aportes.total,
      vigente.retencion,
      vigente.renta,
    );

    expect(proyeccion.meses).toHaveLength(MESES_DEL_ANIO);
    expect(proyeccion.retencionConCupo.total).toBe(enero.total);
    expect(proyeccion.meses[0]?.retencion.total).toBe(enero.total);
  });

  it('no sube la retención en 1 SMLMV: los cupos no se agotan', () => {
    const datos = entrada(smlmv);
    const aportes = calcularAportes(datos, vigente.salud);
    const proyeccion = proyectarRetencion(
      datos,
      aportes.total,
      vigente.retencion,
      vigente.renta,
    );

    expect(proyeccion.mesEnQueAumenta).toBeUndefined();
    expect(proyeccion.mesEnQueSeAgota25).toBeUndefined();
    expect(proyeccion.meses.every((item) => item.retencion.total === 0)).toBe(
      true,
    );
  });

  it('sube la retención cuando se agota el 25 % y el proyecto se agota antes', () => {
    const datos = entrada(15 * smlmv);
    const hoyAportes = calcularAportes(datos, vigente.salud);
    const reformaAportes = calcularAportes(datos, proyecto.salud);
    const hoy = proyectarRetencion(
      datos,
      hoyAportes.total,
      vigente.retencion,
      vigente.renta,
    );
    const reforma = proyectarRetencion(
      datos,
      reformaAportes.total,
      proyecto.retencion,
      proyecto.renta,
    );

    expect(hoy.mesEnQueAumenta).toBeDefined();
    expect(reforma.mesEnQueAumenta).toBeDefined();
    expect(hoy.retencionTrasAgotarCupos.total).toBeGreaterThan(
      hoy.retencionConCupo.total,
    );
    expect(reforma.mesEnQueSeAgota25).toBeLessThanOrEqual(
      hoy.mesEnQueSeAgota25 ?? MESES_DEL_ANIO,
    );
    expect(reforma.mesEnQueAumenta).toBeLessThanOrEqual(
      hoy.mesEnQueAumenta ?? MESES_DEL_ANIO,
    );
  });

  it('sigue aplicando el tope mensual de 32 UVT en diciembre', () => {
    const datos = entrada(15 * smlmv, { personasACargo: 1 });
    const aportes = calcularAportes(datos, vigente.salud);
    const proyeccion = proyectarRetencion(
      datos,
      aportes.total,
      vigente.retencion,
      vigente.renta,
    );
    const diciembre = proyeccion.meses[MESES_DEL_ANIO - 1];
    const tope32 = Math.round(
      DEDUCCION_DEPENDIENTES_ART_387.topeMensualUvt * uvt,
    );

    expect(
      diciembre?.retencion.lineas.some(
        (linea) =>
          linea.concepto.includes('art. 387') && linea.valor === -tope32,
      ),
    ).toBe(true);
  });
});
