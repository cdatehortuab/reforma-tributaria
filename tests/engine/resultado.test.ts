import { describe, expect, it } from 'vitest';

import { consolidarResultado } from '../../src/engine/resultado';

import type { LineaCalculo } from '../../src/engine/resultado';

describe('consolidarResultado', () => {
  it('suma las líneas y conserva el desglose', () => {
    const lineas: readonly LineaCalculo[] = [
      {
        concepto: 'Salud',
        valor: 40_000,
        articulo: 'ET art. 204',
        explicacion: 'Aporte de salud del trabajador.',
      },
      {
        concepto: 'Pensión',
        valor: 40_000,
        articulo: 'ET art. 206',
        explicacion: 'Aporte de pensión del trabajador.',
      },
    ];

    expect(consolidarResultado(lineas)).toEqual({
      total: 80_000,
      lineas,
    });
  });

  it('devuelve total 0 cuando no hay líneas', () => {
    expect(consolidarResultado([])).toEqual({ total: 0, lineas: [] });
  });
});
