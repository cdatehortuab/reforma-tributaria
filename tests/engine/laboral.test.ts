import { describe, expect, it } from 'vitest';

import {
  AUXILIO_TRANSPORTE_2026,
  compararLaboral,
  SMLMV_2026,
  TipoSalario,
} from '../../src/engine';

import type { EntradaLaboral } from '../../src/engine';

const smlmv = SMLMV_2026.valor;

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

const perfiles: readonly {
  readonly nombre: string;
  readonly datos: EntradaLaboral;
}[] = [
  { nombre: '1 SMLMV ordinario', datos: entrada(smlmv) },
  { nombre: '2 SMLMV ordinario', datos: entrada(2 * smlmv) },
  {
    nombre: 'justo por encima de 2 SMLMV',
    datos: entrada(2 * smlmv + 1),
  },
  { nombre: '4 SMLMV ordinario', datos: entrada(4 * smlmv) },
  {
    nombre: '4 SMLMV con 2 dependientes',
    datos: entrada(4 * smlmv, { personasACargo: 2 }),
  },
  { nombre: '5 SMLMV ordinario', datos: entrada(5 * smlmv) },
  { nombre: '6 SMLMV ordinario', datos: entrada(6 * smlmv) },
  {
    nombre: '6 SMLMV con 4 dependientes, vivienda y prepagada al tope',
    datos: entrada(6 * smlmv, {
      personasACargo: 4,
      interesesViviendaMensual: 10_000_000,
      medicinaPrepagadaMensual: 2_000_000,
    }),
  },
  {
    nombre: '8 SMLMV con AFC',
    datos: entrada(8 * smlmv, {
      aportesVoluntariosPensionAfcMensual: 1_500_000,
    }),
  },
  { nombre: '10 SMLMV ordinario', datos: entrada(10 * smlmv) },
  {
    nombre: 'justo por encima de 10 SMLMV',
    datos: entrada(10 * smlmv + 1),
  },
  {
    nombre: '13 SMLMV integral',
    datos: entrada(13 * smlmv, { tipoSalario: TipoSalario.INTEGRAL }),
  },
  { nombre: '15 SMLMV ordinario', datos: entrada(15 * smlmv) },
  { nombre: '20 SMLMV ordinario', datos: entrada(20 * smlmv) },
  { nombre: '25 SMLMV ordinario', datos: entrada(25 * smlmv) },
  { nombre: '30 SMLMV (IBC tope 25)', datos: entrada(30 * smlmv) },
];

describe('compararLaboral — 16 perfiles', () => {
  it('cubre al menos 15 perfiles distintos', () => {
    expect(perfiles.length).toBeGreaterThanOrEqual(15);
  });

  it.each(perfiles)(
    '$nombre: la diferencia viene solo de la norma',
    ({ datos }) => {
      const comparacion = compararLaboral(datos);

      expect(comparacion.vigente.aportes.ibc).toBe(
        comparacion.proyecto.aportes.ibc,
      );
      expect(comparacion.vigente.aportes.pension).toBe(
        comparacion.proyecto.aportes.pension,
      );
      expect(comparacion.vigente.aportes.fsp).toBe(
        comparacion.proyecto.aportes.fsp,
      );
      expect(comparacion.proyecto.aportes.salud).toBeGreaterThanOrEqual(
        comparacion.vigente.aportes.salud,
      );
      expect(comparacion.vigente.netoMensual).toBeGreaterThanOrEqual(0);
      expect(comparacion.proyecto.netoMensual).toBeGreaterThanOrEqual(0);
      expect(comparacion.diferenciaAportesMensual).toBe(
        comparacion.proyecto.aportes.total - comparacion.vigente.aportes.total,
      );
      expect(comparacion.diferenciaRentaAnual).toBe(
        comparacion.proyecto.renta.total - comparacion.vigente.renta.total,
      );
    },
  );

  it('en 1 SMLMV el neto solo cambia por nada: misma salud, sin retención ni renta', () => {
    const { vigente, proyecto, diferenciaNetoMensual, diferenciaRentaAnual } =
      compararLaboral(entrada(smlmv));

    expect(vigente.aportes.tarifaSalud).toBe(0.04);
    expect(proyecto.aportes.tarifaSalud).toBe(0.04);
    expect(vigente.retencion.total).toBe(0);
    expect(proyecto.retencion.total).toBe(0);
    expect(vigente.renta.total).toBe(0);
    expect(proyecto.renta.total).toBe(0);
    expect(diferenciaNetoMensual).toBe(0);
    expect(diferenciaRentaAnual).toBe(0);
    expect(vigente.netoMensual).toBe(
      smlmv + AUXILIO_TRANSPORTE_2026.valor - vigente.aportes.total,
    );
  });

  it('en 4 SMLMV el proyecto sube salud y empieza a retener', () => {
    const { vigente, proyecto, diferenciaAportesMensual } = compararLaboral(
      entrada(4 * smlmv),
    );

    expect(vigente.aportes.tarifaSalud).toBe(0.04);
    expect(proyecto.aportes.tarifaSalud).toBe(0.055);
    expect(diferenciaAportesMensual).toBeGreaterThan(0);
    expect(vigente.retencion.total).toBe(0);
    expect(proyecto.retencion.total).toBeGreaterThan(0);
    expect(proyecto.netoMensual).toBeLessThan(vigente.netoMensual);
  });

  it('en integral de 13 SMLMV no hay auxilio y el IBC es el 70 %', () => {
    const { vigente, proyecto } = compararLaboral(
      entrada(13 * smlmv, { tipoSalario: TipoSalario.INTEGRAL }),
    );

    expect(vigente.aportes.auxilioTransporte).toBe(0);
    expect(proyecto.aportes.ibcSmlmv).toBeGreaterThan(5);
    expect(proyecto.aportes.ibcSmlmv).toBeLessThanOrEqual(10);
    expect(proyecto.aportes.tarifaSalud).toBe(0.065);
    expect(vigente.aportes.tarifaSalud).toBe(0.04);
  });

  it('el neto titular es el de enero y el de cupos agotados es el del mes 12', () => {
    const { vigente, proyecto } = compararLaboral(entrada(15 * smlmv));

    expect(vigente.retencion.total).toBe(
      vigente.proyeccionRetencion.retencionConCupo.total,
    );
    expect(proyecto.retencion.total).toBe(
      proyecto.proyeccionRetencion.retencionConCupo.total,
    );
    expect(vigente.netoMensualTrasAgotarCupos).toBeLessThanOrEqual(
      vigente.netoMensual,
    );
    expect(proyecto.netoMensualTrasAgotarCupos).toBeLessThanOrEqual(
      proyecto.netoMensual,
    );
    expect(vigente.proyeccionRetencion.meses).toHaveLength(12);
  });

  it('los 72 UVT por dependiente solo alivian la renta vigente', () => {
    const sinDep = compararLaboral(entrada(15 * smlmv));
    const conDep = compararLaboral(entrada(15 * smlmv, { personasACargo: 4 }));

    expect(conDep.vigente.renta.total).toBeLessThan(sinDep.vigente.renta.total);
    expect(conDep.proyecto.renta.baseGravable).toBeGreaterThan(
      conDep.vigente.renta.baseGravable,
    );
  });
});
