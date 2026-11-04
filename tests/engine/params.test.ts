import { describe, expect, it } from 'vitest';

import {
  ACTUALIZADO_AL,
  FONDO_SOLIDARIDAD_PENSIONAL_LEY_2381,
  FONDO_SOLIDARIDAD_PENSIONAL_VIGENTE,
  SMLMV_2026,
  UVT_2026,
  areParametrosVerificados,
  proyecto,
  vigente,
} from '../../src/engine';

import type { TramoSmlmv, TramoUvt } from '../../src/engine';

function tramoEn(tramos: readonly TramoUvt[], indice: number): TramoUvt {
  const tramo = tramos[indice];
  if (tramo === undefined) {
    throw new Error(`No hay tramo en el índice ${indice.toString()}.`);
  }
  return tramo;
}

function ultimoTramo(tramos: readonly TramoUvt[]): TramoUvt {
  return tramoEn(tramos, tramos.length - 1);
}

/**
 * Regla de datos: las tablas de rangos se definen en orden ascendente y
 * contiguo. El motor las recorre así; no las ordena en runtime.
 */
function expectTramosUvtOrdenados(
  tramos: readonly TramoUvt[],
  etiqueta: string,
): void {
  expect(tramos.length, etiqueta).toBeGreaterThan(0);
  expect(tramoEn(tramos, 0).desdeUvt, etiqueta).toBe(0);

  for (const [indice, tramo] of tramos.entries()) {
    expect(
      tramo.desdeUvt < tramo.hastaUvt,
      `${etiqueta}[${indice.toString()}]: desde < hasta`,
    ).toBe(true);

    const siguiente = tramos[indice + 1];
    if (siguiente === undefined) {
      expect(tramo.hastaUvt, `${etiqueta}: último hasta`).toBe(Infinity);
      continue;
    }

    expect(
      siguiente.desdeUvt,
      `${etiqueta}[${indice.toString()}→${(indice + 1).toString()}]: contiguo`,
    ).toBe(tramo.hastaUvt);
  }
}

function expectTramosSmlmvOrdenados(
  tramos: readonly TramoSmlmv[],
  etiqueta: string,
): void {
  expect(tramos.length, etiqueta).toBeGreaterThan(0);
  expect(tramos[0]?.desdeSmlmv, etiqueta).toBe(0);

  for (const [indice, tramo] of tramos.entries()) {
    expect(
      tramo.desdeSmlmv < tramo.hastaSmlmv,
      `${etiqueta}[${indice.toString()}]: desde < hasta`,
    ).toBe(true);

    const siguiente = tramos[indice + 1];
    if (siguiente === undefined) {
      continue;
    }

    expect(
      siguiente.desdeSmlmv,
      `${etiqueta}[${indice.toString()}→${(indice + 1).toString()}]: contiguo`,
    ).toBe(tramo.hastaSmlmv);
  }
}

describe('constantes oficiales 2026', () => {
  it('cita UVT y SMLMV verificados', () => {
    expect(areParametrosVerificados).toBe(true);
    expect(ACTUALIZADO_AL).toBe('2026-11-02');
    expect(UVT_2026.valor).toBe(52_374);
    expect(UVT_2026.fuente.articulo).toBe('ET art. 868');
    expect(SMLMV_2026.valor).toBe(1_750_905);
    expect(SMLMV_2026.fuente.documento).toContain('Decreto 1469');
  });
});

describe('tablas vigentes arts. 241, 383, 206 y 336', () => {
  it('tiene 7 tramos de renta y empieza a gravar después de 1.090 UVT', () => {
    const { tramos, fuente } = vigente.renta.tabla241;
    expect(tramos).toHaveLength(7);
    expect(fuente.articulo).toBe('ET art. 241');
    expect(tramoEn(tramos, 0)).toMatchObject({
      hastaUvt: 1090,
      tarifa: 0,
    });
    expect(ultimoTramo(tramos)).toMatchObject({
      desdeUvt: 31_000,
      tarifa: 0.39,
      impuestoAcumuladoUvt: 10_352,
    });
  });

  it('tiene 7 tramos de retención y no retiene hasta 95 UVT', () => {
    const { tramos, fuente } = vigente.retencion.tabla383;
    expect(tramos).toHaveLength(7);
    expect(fuente.articulo).toBe('ET art. 383');
    expect(tramoEn(tramos, 0)).toMatchObject({ hastaUvt: 95, tarifa: 0 });
    expect(ultimoTramo(tramos)).toMatchObject({
      desdeUvt: 2300,
      tarifa: 0.39,
      impuestoAcumuladoUvt: 770,
    });
  });

  it('respeta los topes de renta exenta, límite 40 % y dependientes', () => {
    expect(vigente.renta.rentaExentaLaboral).toMatchObject({
      porcentaje: 0.25,
      topeAnualUvt: 790,
    });
    expect(vigente.renta.limiteExentasDeducciones).toMatchObject({
      porcentaje: 0.4,
      topeAnualUvt: 1340,
    });
    expect(vigente.renta.dependientesAdicionales).toMatchObject({
      uvtPorDependiente: 72,
      maxDependientes: 4,
    });
  });

  it('mantiene la cotización de salud del trabajador en 4 %', () => {
    expect(vigente.salud.tarifaEmpleado).toBe(0.04);
    expect(vigente.salud.tarifaEmpleador).toBe(0.085);
    expect(vigente.aportesPatronales.exoneracionMenosDeSmlmv).toBe(10);
  });
});

describe('tablas del PL 477', () => {
  it('deja 6 tramos de renta, con 9 % desde 720 UVT y 39 % desde 8.670 UVT', () => {
    const { tramos, fuente } = proyecto.renta.tabla241;
    expect(tramos).toHaveLength(6);
    expect(fuente.articulo).toContain('art. 48');
    expect(tramoEn(tramos, 1)).toMatchObject({
      desdeUvt: 720,
      hastaUvt: 1090,
      tarifa: 0.09,
    });
    expect(ultimoTramo(tramos)).toMatchObject({
      desdeUvt: 8670,
      tarifa: 0.39,
      impuestoAcumuladoUvt: 2329,
    });
  });

  it('empieza la retención en 65 UVT y llega al 39 % desde 640 UVT', () => {
    const { tramos } = proyecto.retencion.tabla383;
    expect(tramos).toHaveLength(6);
    expect(tramoEn(tramos, 1)).toMatchObject({
      desdeUvt: 65,
      hastaUvt: 95,
      tarifa: 0.09,
    });
    expect(ultimoTramo(tramos)).toMatchObject({
      desdeUvt: 640,
      tarifa: 0.39,
      impuestoAcumuladoUvt: 164,
    });
  });

  it('baja los topes de la cédula general y elimina los 72 UVT por dependiente', () => {
    expect(proyecto.renta.rentaExentaLaboral.topeAnualUvt).toBe(630);
    expect(proyecto.renta.limiteExentasDeducciones.topeAnualUvt).toBe(1180);
    expect(proyecto.renta.dependientesAdicionales.uvtPorDependiente).toBe(0);
  });

  it('escalona la salud del trabajador por SMLMV desde 2027 (PL art. 21)', () => {
    expect(proyecto.salud.vigenciaDesde).toBe('2027-01-01');
    expect(proyecto.salud.tarifaEmpleador).toBe(0.085);
    expect(proyecto.salud.tramosEmpleado).toEqual([
      { desdeSmlmv: 0, hastaSmlmv: 2, tarifa: 0.04 },
      { desdeSmlmv: 2, hastaSmlmv: 4, tarifa: 0.055 },
      { desdeSmlmv: 4, hastaSmlmv: 5, tarifa: 0.06 },
      { desdeSmlmv: 5, hastaSmlmv: 10, tarifa: 0.065 },
      { desdeSmlmv: 10, hastaSmlmv: 15, tarifa: 0.07 },
      { desdeSmlmv: 15, hastaSmlmv: 20, tarifa: 0.075 },
      { desdeSmlmv: 20, hastaSmlmv: 25, tarifa: 0.08 },
    ]);
    expect(proyecto.salud.tramosIndependiente[0].tarifa).toBe(0.125);
    expect(proyecto.salud.tramosIndependiente.at(-1)?.tarifa).toBe(0.155);
  });

  it('define EfectIVA por persona, con tope 5,5 UVT y porcentajes del articulado', () => {
    expect(proyecto.efectiva.vigenciaDesde).toBe('2028-01-01');
    expect(proyecto.efectiva.topeMensualUvt).toBe(5.5);
    expect(proyecto.efectiva.porPersona).toBe(true);
    expect(proyecto.efectiva.mapeoInstrumentoFocalizacion).toBe(
      'pendiente-dnp-minhacienda',
    );
    expect(proyecto.efectiva.tramos.map((tramo) => tramo.proporcion)).toEqual([
      1, 1, 1, 0.5, 0.4, 0.3,
    ]);
  });

  it('sube el umbral de patrimonio a 95.500 UVT', () => {
    expect(proyecto.patrimonio.umbralUvt).toBe(95_500);
    expect(proyecto.patrimonio.periodosGravables).toEqual([
      2027, 2028, 2029, 2030,
    ]);
  });
});

describe('Fondo de Solidaridad Pensional', () => {
  it('separa las tarifas vigentes de las de la Ley 2381', () => {
    expect(FONDO_SOLIDARIDAD_PENSIONAL_VIGENTE.tramos[1].tarifa).toBe(0.01);
    expect(FONDO_SOLIDARIDAD_PENSIONAL_LEY_2381.vigenciaDesde).toBe(
      '2027-04-01',
    );
    expect(FONDO_SOLIDARIDAD_PENSIONAL_LEY_2381.tramos[1].tarifa).toBe(0.015);
  });
});

describe('orden de tramos (regla de datos)', () => {
  it('deja las tablas en UVT ascendentes y contiguas', () => {
    expectTramosUvtOrdenados(vigente.renta.tabla241.tramos, 'vigente.renta');
    expectTramosUvtOrdenados(
      vigente.retencion.tabla383.tramos,
      'vigente.retencion',
    );
    expectTramosUvtOrdenados(
      vigente.patrimonio.tabla2026.tramos,
      'vigente.patrimonio',
    );
    expectTramosUvtOrdenados(proyecto.renta.tabla241.tramos, 'proyecto.renta');
    expectTramosUvtOrdenados(
      proyecto.retencion.tabla383.tramos,
      'proyecto.retencion',
    );
    expectTramosUvtOrdenados(
      proyecto.patrimonio.tabla.tramos,
      'proyecto.patrimonio',
    );
  });

  it('deja las tablas en SMLMV ascendentes y contiguas', () => {
    expectTramosSmlmvOrdenados(
      proyecto.salud.tramosEmpleado,
      'proyecto.salud.empleado',
    );
    expectTramosSmlmvOrdenados(
      proyecto.salud.tramosIndependiente,
      'proyecto.salud.independiente',
    );
    expectTramosSmlmvOrdenados(
      FONDO_SOLIDARIDAD_PENSIONAL_VIGENTE.tramos,
      'fsp.vigente',
    );
    expectTramosSmlmvOrdenados(
      FONDO_SOLIDARIDAD_PENSIONAL_LEY_2381.tramos,
      'fsp.ley2381',
    );
  });
});
