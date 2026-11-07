import { describe, expect, it } from 'vitest';

import {
  aplicarTablaUvt,
  calcularAportes,
  calcularRenta,
  MESES_DEL_ANIO,
  pesosAUvt,
  proyecto,
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

describe('calcularRenta cédula general', () => {
  it('no grava 1 SMLMV anualizado', () => {
    const datos = entrada(smlmv);
    const aportes = calcularAportes(datos, vigente.salud);
    const hoy = calcularRenta(datos, aportes.total, vigente.renta);
    const reforma = calcularRenta(datos, aportes.total, proyecto.renta);

    expect(hoy.total).toBe(0);
    expect(reforma.total).toBe(0);
    expect(hoy.ingresosAnuales).toBe(smlmv * MESES_DEL_ANIO);
    expect(hoy.baseUvt).toBeLessThan(720);
  });

  it('reproduce a mano 10 SMLMV sin extras, vigente vs proyecto', () => {
    const salario = 10 * smlmv;
    const datos = entrada(salario);
    const hoyAportes = calcularAportes(datos, vigente.salud);
    const reformaAportes = calcularAportes(datos, proyecto.salud);
    const hoy = calcularRenta(datos, hoyAportes.total, vigente.renta);
    const reforma = calcularRenta(datos, reformaAportes.total, proyecto.renta);

    const ingresoNetoHoy =
      salario * MESES_DEL_ANIO - hoyAportes.total * MESES_DEL_ANIO;
    const renta25Hoy = Math.round(ingresoNetoHoy * 0.25);
    const tope790 = Math.round(790 * uvt);
    const exentaHoy = Math.min(renta25Hoy, tope790);
    const baseHoy = ingresoNetoHoy - exentaHoy;
    const impuestoHoy = uvtAPesos(
      aplicarTablaUvt(pesosAUvt(baseHoy, uvt), vigente.renta.tabla241),
      uvt,
    );

    expect(hoy.baseGravable).toBe(baseHoy);
    expect(hoy.total).toBe(impuestoHoy);
    expect(reforma.total).toBeGreaterThan(hoy.total);
  });

  it('reduce el impuesto vigente cuando hay dependientes por los 72 UVT', () => {
    const salario = 15 * smlmv;
    const sinDep = entrada(salario);
    const conDep = entrada(salario, { personasACargo: 2 });
    const aportes = calcularAportes(sinDep, vigente.salud);
    const sin = calcularRenta(sinDep, aportes.total, vigente.renta);
    const con = calcularRenta(conDep, aportes.total, vigente.renta);
    const reformaCon = calcularRenta(conDep, aportes.total, proyecto.renta);

    expect(con.total).toBeLessThan(sin.total);
    expect(con.baseGravable).toBeLessThan(sin.baseGravable);
    expect(reformaCon.baseGravable).toBeGreaterThan(con.baseGravable);
  });

  it('cita los artículos 241, 206 y 336 en el desglose', () => {
    const datos = entrada(10 * smlmv);
    const aportes = calcularAportes(datos, vigente.salud);
    const resultado = calcularRenta(datos, aportes.total, vigente.renta);
    const articulos = resultado.lineas.map((linea) => linea.articulo).join(' ');

    expect(articulos).toContain('241');
    expect(articulos).toContain('206');
    expect(articulos).toContain('336');
  });
});
