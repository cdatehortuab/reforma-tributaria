/** Fuente de un parámetro numérico del motor, para citar artículo y documento. */
export interface FuenteParametro {
  readonly articulo: string;
  readonly documento: string;
  readonly actualizadoAl: string;
}

export interface ParametroNumerico {
  readonly valor: number;
  readonly fuente: FuenteParametro;
}

/**
 * Tramo de una tabla marginal en UVT.
 * `desdeUvt` es inclusivo en 0 y exclusivo en el resto (`>` en la norma).
 * `hastaUvt` es inclusivo. El último tramo usa `Infinity`.
 */
export interface TramoUvt {
  readonly desdeUvt: number;
  readonly hastaUvt: number;
  readonly tarifa: number;
  readonly impuestoAcumuladoUvt: number;
}

/**
 * Tramo en SMLMV. La convención de bordes la documenta cada tabla:
 * salud del PL 477 usa `hastaSmlmv` inclusivo (como {@link TramoUvt});
 * el FSP usa `hastaSmlmv` exclusivo («menor a»).
 */
export interface TramoSmlmv {
  readonly desdeSmlmv: number;
  readonly hastaSmlmv: number;
  readonly tarifa: number;
}

export interface TablaMarginalUvt {
  readonly tramos: readonly TramoUvt[];
  readonly fuente: FuenteParametro;
}

/** Fecha ISO de la última verificación de fuentes oficiales. */
export const ACTUALIZADO_AL = '2026-11-02' as const;

/** Estado del PL 477; se muestra junto a la fecha «actualizado al». */
export const ESTADO_PROYECTO = 'en trámite' as const;

export const RADICADO_EL = '2026-10-29' as const;

/**
 * Los valores de UVT, SMLMV y las tablas de este paquete se contrastaron con
 * el documento citado en cada `fuente`. El proyecto de ley puede cambiar.
 */
export const areParametrosVerificados = true;

export const DOCUMENTO_PL_477 =
  'PL 477 de 2026 Cámara, radicado el 29 de octubre de 2026. Texto del Ministerio de Hacienda: Cámara de Representantes, proyecto 36548, PDF «PROYECTO-DE-LEY-Rescate-Economico-2026-VSD-RADICADA-1.pdf».' as const;

export const URL_PL_477 =
  'https://www.camara.gov.co/wp-content/uploads/2026/10/proyectos-ley/documentos/proyecto-36548/PROYECTO-DE-LEY-Rescate-Economico-2026-VSD-RADICADA-1.pdf' as const;

export const UVT_2026: ParametroNumerico = {
  valor: 52_374,
  fuente: {
    articulo: 'ET art. 868',
    documento:
      'Resolución DIAN 000238 del 15 de diciembre de 2025, Diario Oficial 53.338 del 17 de diciembre de 2025. Fija $52.374 para el año 2026 (IPC clase media 5,17 %; certificación DANE 205971 del 9 de octubre de 2025).',
    actualizadoAl: ACTUALIZADO_AL,
  },
};

export const SMLMV_2026: ParametroNumerico = {
  valor: 1_750_905,
  fuente: {
    articulo: 'Decreto 1469 de 2025, art. 1',
    documento:
      'Decreto 1469 del 29 de diciembre de 2025, Diario Oficial 53.350. Incremento del 23 % sobre el SMLMV 2025 ($1.423.500, Decreto 1572 de 2024). El monto coincide con el Decreto 159 de 2026 (transitorio). La Sección II del Consejo de Estado reactivó el Decreto 1469; el proceso de nulidad sigue, el valor no cambia.',
    actualizadoAl: ACTUALIZADO_AL,
  },
};

export const AUXILIO_TRANSPORTE_2026: ParametroNumerico = {
  valor: 249_095,
  fuente: {
    articulo: 'Decreto 1470 de 2025, art. 1',
    documento:
      'Decreto 1470 del 29 de diciembre de 2025, Diario Oficial 53.350. Para servidores públicos y trabajadores particulares que devenguen hasta 2 SMLMV.',
    actualizadoAl: ACTUALIZADO_AL,
  },
};

/** Tope del ingreso base de cotización a salud y pensión. */
export const IBC_TOPE_SMLMV: ParametroNumerico = {
  valor: 25,
  fuente: {
    articulo: 'Ley 100 de 1993, art. 18 y art. 204 par. 3',
    documento:
      'Ley 100 de 1993. El Consejo Nacional de Seguridad Social en Salud puede limitar la base a 25 SMLMV cuando se devenguen más de 20.',
    actualizadoAl: ACTUALIZADO_AL,
  },
};

/** Base de cotización del salario integral: 70 % del salario. */
export const SALARIO_INTEGRAL_BASE_COTIZACION: ParametroNumerico = {
  valor: 0.7,
  fuente: {
    articulo: 'CST art. 132',
    documento:
      'Código Sustantivo del Trabajo, artículo 132. El factor prestacional no es inferior al 30 % del salario integral; la base de aportes es el 70 %.',
    actualizadoAl: ACTUALIZADO_AL,
  },
};

export const COTIZACION_PENSION = {
  tarifaTotal: 0.16,
  tarifaEmpleado: 0.04,
  tarifaEmpleador: 0.12,
  fuente: {
    articulo: 'Ley 100 de 1993, art. 20',
    documento:
      'Ley 100 de 1993, art. 20, modificado por la Ley 797 de 2003, art. 7. Empleador 75 % y trabajador 25 % de la cotización del 16 %. El PL 477 no modifica estas tarifas. La Ley 2381 de 2024, art. 20, mantiene el 16 %; rige desde el 1 de abril de 2027 (Corte Constitucional, C-264 de 2026).',
    actualizadoAl: ACTUALIZADO_AL,
  },
} as const satisfies {
  readonly tarifaTotal: number;
  readonly tarifaEmpleado: number;
  readonly tarifaEmpleador: number;
  readonly fuente: FuenteParametro;
};

/**
 * Fondo de Solidaridad Pensional a cargo del afiliado.
 * Bordes: `desdeSmlmv` inclusivo, `hastaSmlmv` exclusivo; el último tramo
 * usa `Infinity`.
 */
export const FONDO_SOLIDARIDAD_PENSIONAL_VIGENTE = {
  tramos: [
    { desdeSmlmv: 0, hastaSmlmv: 4, tarifa: 0 },
    { desdeSmlmv: 4, hastaSmlmv: 16, tarifa: 0.01 },
    { desdeSmlmv: 16, hastaSmlmv: 17, tarifa: 0.012 },
    { desdeSmlmv: 17, hastaSmlmv: 18, tarifa: 0.014 },
    { desdeSmlmv: 18, hastaSmlmv: 19, tarifa: 0.016 },
    { desdeSmlmv: 19, hastaSmlmv: 20, tarifa: 0.018 },
    { desdeSmlmv: 20, hastaSmlmv: Infinity, tarifa: 0.02 },
  ],
  fuente: {
    articulo: 'Ley 100 de 1993, art. 27',
    documento:
      'Ley 100 de 1993, art. 27, modificado por la Ley 797 de 2003, art. 8. El 1 % desde 4 SMLMV se reparte entre las subcuentas de solidaridad y subsistencia; el recargo desde 16 SMLMV va a subsistencia. Decreto 1833 de 2016, art. 2.2.14.1.6.',
    actualizadoAl: ACTUALIZADO_AL,
  },
} as const satisfies {
  readonly tramos: readonly TramoSmlmv[];
  readonly fuente: FuenteParametro;
};

/**
 * Tarifas del FSP de la reforma pensional. No son el PL 477: no deben entrar
 * en la resta «hoy vs. reforma tributaria».
 */
export const FONDO_SOLIDARIDAD_PENSIONAL_LEY_2381 = {
  vigenciaDesde: '2027-04-01',
  tramos: [
    { desdeSmlmv: 0, hastaSmlmv: 4, tarifa: 0 },
    { desdeSmlmv: 4, hastaSmlmv: 7, tarifa: 0.015 },
    { desdeSmlmv: 7, hastaSmlmv: 11, tarifa: 0.018 },
    { desdeSmlmv: 11, hastaSmlmv: 19, tarifa: 0.025 },
    { desdeSmlmv: 19, hastaSmlmv: 20, tarifa: 0.028 },
    { desdeSmlmv: 20, hastaSmlmv: Infinity, tarifa: 0.03 },
  ],
  fuente: {
    articulo: 'Ley 2381 de 2024, art. 20',
    documento:
      'Ley 2381 de 2024, art. 20, numerales 1 a 5. El tramo 19 a 20 SMLMV es «menor o igual a 20». Sentencia C-264 de 2026: las disposiciones exequibles de esa ley rigen desde el 1 de abril de 2027.',
    actualizadoAl: ACTUALIZADO_AL,
  },
} as const satisfies {
  readonly vigenciaDesde: string;
  readonly tramos: readonly TramoSmlmv[];
  readonly fuente: FuenteParametro;
};

export const DEDUCCION_DEPENDIENTES_ART_387 = {
  porcentajeIngresosBrutos: 0.1,
  topeMensualUvt: 32,
  topeAnualUvt: 384,
  fuente: {
    articulo: 'ET art. 387 inc. 2',
    documento:
      'Estatuto Tributario, art. 387, modificado por la Ley 1607 de 2012, art. 15. El PL 477 no deroga esta deducción.',
    actualizadoAl: ACTUALIZADO_AL,
  },
} as const satisfies {
  readonly porcentajeIngresosBrutos: number;
  readonly topeMensualUvt: number;
  readonly topeAnualUvt: number;
  readonly fuente: FuenteParametro;
};

export const DEDUCCION_SALUD_ART_387 = {
  topeMensualUvt: 16,
  fuente: {
    articulo: 'ET art. 387 inc. 2',
    documento:
      'Estatuto Tributario, art. 387. Medicina prepagada (Supersalud) o póliza de salud (Superintendencia Financiera), hasta 16 UVT mensuales.',
    actualizadoAl: ACTUALIZADO_AL,
  },
} as const satisfies {
  readonly topeMensualUvt: number;
  readonly fuente: FuenteParametro;
};

/** Meses del año gravable. El motor anualiza el salario mensual × 12. */
export const MESES_DEL_ANIO = 12 as const;

/**
 * Deducción de intereses o corrección monetaria de préstamos para vivienda.
 * El tope mensual rige la retención (DUR 1625 art. 1.2.4.1.23); el anual, la
 * declaración (ET art. 119). El PL 477 no los modifica.
 */
export const INTERESES_VIVIENDA = {
  topeMensualUvt: 100,
  topeAnualUvt: 1200,
  fuente: {
    articulo: 'ET art. 119 y art. 387',
    documento:
      'Estatuto Tributario, art. 119 (tope anual 1.200 UVT) y art. 387 (disminución de la base de retención). Decreto 1625 de 2016, art. 1.2.4.1.23: tope mensual de 100 UVT. El PL 477 no modifica estos topes.',
    actualizadoAl: ACTUALIZADO_AL,
  },
} as const satisfies {
  readonly topeMensualUvt: number;
  readonly topeAnualUvt: number;
  readonly fuente: FuenteParametro;
};

/**
 * Aportes voluntarios a pensiones (seguros privados / fondos voluntarios) y
 * cuentas AFC. Son renta exenta, no ingreso no constitutivo: entran al límite
 * del 40 % del art. 388 / art. 336.
 */
export const RENTA_EXENTA_APORTES_VOLUNTARIOS = {
  porcentajeIngresoLaboral: 0.3,
  topeAnualUvt: 3800,
  fuente: {
    articulo: 'ET art. 126-1',
    documento:
      'Estatuto Tributario, art. 126-1, modificado por la Ley 1819 de 2016, art. 15. Junto con los aportes a cuentas AFC (art. 126-4), hasta el 30 % del ingreso laboral o tributario del año y 3.800 UVT. El PL 477 no modifica este tope.',
    actualizadoAl: ACTUALIZADO_AL,
  },
} as const satisfies {
  readonly porcentajeIngresoLaboral: number;
  readonly topeAnualUvt: number;
  readonly fuente: FuenteParametro;
};
