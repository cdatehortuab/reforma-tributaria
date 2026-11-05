import { describe, expect, it } from 'vitest';

import {
  aplicarTablaUvt,
  BordeHastaSmlmv,
  buscarTramoSmlmv,
  FONDO_SOLIDARIDAD_PENSIONAL_VIGENTE,
  proyecto,
  vigente,
} from '../../src/engine';

describe('aplicarTablaUvt — art. 383 vigente', () => {
  const tabla = vigente.retencion.tabla383;

  it('no retiene hasta 95 UVT inclusive', () => {
    expect(aplicarTablaUvt(0, tabla)).toBe(0);
    expect(aplicarTablaUvt(95, tabla)).toBe(0);
  });

  it('aplica 19 % sobre el exceso de 95 UVT', () => {
    expect(aplicarTablaUvt(96, tabla)).toBeCloseTo(0.19, 10);
    expect(aplicarTablaUvt(150, tabla)).toBeCloseTo((150 - 95) * 0.19, 10);
  });

  it('usa el acumulado redondeado de la norma al pasar de 150 UVT', () => {
    expect(aplicarTablaUvt(150, tabla)).toBeCloseTo(10.45, 10);
    expect(aplicarTablaUvt(150.0001, tabla)).toBeCloseTo(10 + 0.0001 * 0.28, 8);
  });

  it('reproduce un punto interior del tramo 28 %', () => {
    expect(aplicarTablaUvt(200, tabla)).toBeCloseTo(
      10 + (200 - 150) * 0.28,
      10,
    );
  });
});

describe('aplicarTablaUvt — art. 383 proyecto', () => {
  const tabla = proyecto.retencion.tabla383;

  it('no retiene hasta 65 UVT y cobra 9 % desde más de 65', () => {
    expect(aplicarTablaUvt(65, tabla)).toBe(0);
    expect(aplicarTablaUvt(66, tabla)).toBeCloseTo(0.09, 10);
  });

  it('llega al 39 % desde más de 640 UVT', () => {
    expect(aplicarTablaUvt(640, tabla)).toBeCloseTo(
      72 + (640 - 360) * 0.33,
      10,
    );
    expect(aplicarTablaUvt(641, tabla)).toBeCloseTo(164 + 0.39, 10);
  });
});

describe('aplicarTablaUvt — art. 241', () => {
  it('vigente: 0 % hasta 1.090 UVT y 19 % después', () => {
    const tabla = vigente.renta.tabla241;
    expect(aplicarTablaUvt(1090, tabla)).toBe(0);
    expect(aplicarTablaUvt(1091, tabla)).toBeCloseTo(0.19, 10);
  });

  it('proyecto: 9 % desde más de 720 UVT y 39 % desde más de 8.670 UVT', () => {
    const tabla = proyecto.renta.tabla241;
    expect(aplicarTablaUvt(720, tabla)).toBe(0);
    expect(aplicarTablaUvt(721, tabla)).toBeCloseTo(0.09, 10);
    expect(aplicarTablaUvt(8670, tabla)).toBeCloseTo(
      821 + (8670 - 4100) * 0.33,
      10,
    );
    expect(aplicarTablaUvt(8671, tabla)).toBeCloseTo(2329 + 0.39, 10);
  });
});

describe('buscarTramoSmlmv', () => {
  it('salud del proyecto: hasta 2 inclusive al 4 %, más de 2 al 5,5 %', () => {
    const tramos = proyecto.salud.tramosEmpleado;
    expect(buscarTramoSmlmv(2, tramos, BordeHastaSmlmv.INCLUSIVO)?.tarifa).toBe(
      0.04,
    );
    expect(
      buscarTramoSmlmv(2.001, tramos, BordeHastaSmlmv.INCLUSIVO)?.tarifa,
    ).toBe(0.055);
    expect(buscarTramoSmlmv(4, tramos, BordeHastaSmlmv.INCLUSIVO)?.tarifa).toBe(
      0.055,
    );
    expect(
      buscarTramoSmlmv(10, tramos, BordeHastaSmlmv.INCLUSIVO)?.tarifa,
    ).toBe(0.065);
    expect(
      buscarTramoSmlmv(25, tramos, BordeHastaSmlmv.INCLUSIVO)?.tarifa,
    ).toBe(0.08);
  });

  it('FSP vigente: menor a 4 SMLMV al 0 %, desde 4 al 1 %', () => {
    const tramos = FONDO_SOLIDARIDAD_PENSIONAL_VIGENTE.tramos;
    expect(
      buscarTramoSmlmv(3.999, tramos, BordeHastaSmlmv.EXCLUSIVO)?.tarifa,
    ).toBe(0);
    expect(buscarTramoSmlmv(4, tramos, BordeHastaSmlmv.EXCLUSIVO)?.tarifa).toBe(
      0.01,
    );
    expect(
      buscarTramoSmlmv(20, tramos, BordeHastaSmlmv.EXCLUSIVO)?.tarifa,
    ).toBe(0.02);
  });
});
