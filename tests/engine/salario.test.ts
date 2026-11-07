import { describe, expect, it } from 'vitest';

import {
  AUXILIO_TRANSPORTE_2026,
  calcularAportes,
  calcularIbc,
  FONDO_SOLIDARIDAD_PENSIONAL_LEY_2381,
  IBC_TOPE_SMLMV,
  proyecto,
  SALARIO_INTEGRAL_BASE_COTIZACION,
  SMLMV_2026,
  TipoSalario,
  vigente,
} from '../../src/engine';

import type { EntradaLaboral } from '../../src/engine';

const smlmv = SMLMV_2026.valor;

function entrada(
  salarioMensual: number,
  tipoSalario: EntradaLaboral['tipoSalario'] = TipoSalario.ORDINARIO,
): EntradaLaboral {
  return {
    salarioMensual,
    tipoSalario,
    personasACargo: 0,
    interesesViviendaMensual: 0,
    medicinaPrepagadaMensual: 0,
    aportesVoluntariosPensionAfcMensual: 0,
  };
}

describe('calcularIbc', () => {
  it('usa el salario ordinario y lo recorta a 25 SMLMV', () => {
    expect(calcularIbc(smlmv, TipoSalario.ORDINARIO)).toBe(smlmv);
    expect(calcularIbc(30 * smlmv, TipoSalario.ORDINARIO)).toBe(
      IBC_TOPE_SMLMV.valor * smlmv,
    );
  });

  it('usa el 70 % del salario integral', () => {
    const integral = 13 * smlmv;
    expect(calcularIbc(integral, TipoSalario.INTEGRAL)).toBe(
      Math.round(integral * SALARIO_INTEGRAL_BASE_COTIZACION.valor),
    );
  });
});

describe('calcularAportes vigente', () => {
  it('cobra 4 % de salud y 4 % de pensión a 1 SMLMV, sin FSP, con auxilio', () => {
    const resultado = calcularAportes(entrada(smlmv), vigente.salud);
    const esperado = Math.round(smlmv * 0.04);

    expect(resultado.ibc).toBe(smlmv);
    expect(resultado.tarifaSalud).toBe(0.04);
    expect(resultado.salud).toBe(esperado);
    expect(resultado.pension).toBe(esperado);
    expect(resultado.fsp).toBe(0);
    expect(resultado.total).toBe(esperado * 2);
    expect(resultado.auxilioTransporte).toBe(AUXILIO_TRANSPORTE_2026.valor);
    expect(resultado.lineas).toHaveLength(3);
  });

  it('empieza el FSP en 4 SMLMV exactos, al 1 %', () => {
    const salario = 4 * smlmv;
    const resultado = calcularAportes(entrada(salario), vigente.salud);

    expect(resultado.fsp).toBe(Math.round(salario * 0.01));
    expect(resultado.tarifaSalud).toBe(0.04);
  });

  it('cobra FSP del 2 % desde 20 SMLMV', () => {
    const salario = 20 * smlmv;
    const resultado = calcularAportes(entrada(salario), vigente.salud);

    expect(resultado.fsp).toBe(Math.round(salario * 0.02));
  });
});

describe('calcularAportes proyecto (PL art. 21)', () => {
  it('mantiene 4 % hasta 2 SMLMV inclusive', () => {
    const resultado = calcularAportes(entrada(2 * smlmv), proyecto.salud);
    expect(resultado.tarifaSalud).toBe(0.04);
    expect(resultado.auxilioTransporte).toBe(AUXILIO_TRANSPORTE_2026.valor);
  });

  it('pasa a 5,5 % con un peso por encima de 2 SMLMV', () => {
    const salario = 2 * smlmv + 1;
    const resultado = calcularAportes(entrada(salario), proyecto.salud);

    expect(resultado.tarifaSalud).toBe(0.055);
    expect(resultado.salud).toBe(Math.round(salario * 0.055));
    expect(resultado.auxilioTransporte).toBe(0);
  });

  it.each([
    [4, 0.055],
    [5, 0.06],
    [10, 0.065],
    [15, 0.07],
    [20, 0.075],
    [25, 0.08],
  ] as const)('en %i SMLMV de IBC cobra %s de salud', (vecesSmlmv, tarifa) => {
    const salario = vecesSmlmv * smlmv;
    const resultado = calcularAportes(entrada(salario), proyecto.salud);
    expect(resultado.tarifaSalud).toBe(tarifa);
    expect(resultado.salud).toBe(Math.round(salario * tarifa));
  });

  it('mira el IBC, no el salario bruto, en el salario integral', () => {
    const salario = 13 * smlmv;
    const ibc = Math.round(salario * 0.7);
    const resultado = calcularAportes(
      entrada(salario, TipoSalario.INTEGRAL),
      proyecto.salud,
    );

    expect(resultado.ibc).toBe(ibc);
    expect(resultado.ibcSmlmv).toBeGreaterThan(5);
    expect(resultado.ibcSmlmv).toBeLessThanOrEqual(10);
    expect(resultado.tarifaSalud).toBe(0.065);
    expect(resultado.auxilioTransporte).toBe(0);
  });
});

describe('aislamiento del efecto legal', () => {
  it('no usa las tarifas del FSP de la Ley 2381', () => {
    const salario = 5 * smlmv;
    const vigenteAportes = calcularAportes(entrada(salario), vigente.salud);
    const proyectoAportes = calcularAportes(entrada(salario), proyecto.salud);

    expect(FONDO_SOLIDARIDAD_PENSIONAL_LEY_2381.tramos[1].tarifa).toBe(0.015);
    expect(vigenteAportes.fsp).toBe(Math.round(salario * 0.01));
    expect(proyectoAportes.fsp).toBe(vigenteAportes.fsp);
    expect(proyectoAportes.fsp).not.toBe(Math.round(salario * 0.015));
  });
});
