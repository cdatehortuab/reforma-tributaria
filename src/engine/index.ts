export {
  cuposCedulaIniciales,
  dependientesEnteros,
  depurarCedula,
  PeriodoCedula,
} from './cedula';
export {
  aPesos,
  noNegativo,
  pesosAUvt,
  topeUvtAPesos,
  uvtAPesos,
} from './dinero';
export { RegimenTributario, TipoSalario } from './entrada';
export { calcularEscenarioLaboral, compararLaboral } from './laboral';
export {
  ACTUALIZADO_AL,
  AUXILIO_TRANSPORTE_2026,
  COTIZACION_PENSION,
  DEDUCCION_DEPENDIENTES_ART_387,
  DEDUCCION_SALUD_ART_387,
  DOCUMENTO_PL_477,
  ESTADO_PROYECTO,
  FONDO_SOLIDARIDAD_PENSIONAL_LEY_2381,
  FONDO_SOLIDARIDAD_PENSIONAL_VIGENTE,
  IBC_TOPE_SMLMV,
  INTERESES_VIVIENDA,
  MESES_DEL_ANIO,
  RADICADO_EL,
  RENTA_EXENTA_APORTES_VOLUNTARIOS,
  SALARIO_INTEGRAL_BASE_COTIZACION,
  SMLMV_2026,
  URL_PL_477,
  UVT_2026,
  areParametrosVerificados,
} from './params/constants';
export { proyecto } from './params/proyecto';
export { vigente } from './params/vigente';
export { calcularRenta } from './renta';
export { calcularRetencion, proyectarRetencion } from './retencion';
export { consolidarResultado } from './resultado';
export { calcularAportes, calcularIbc, isSaludPorTramos } from './salario';
export { aplicarTablaUvt, BordeHastaSmlmv, buscarTramoSmlmv } from './tramos';

export type { CuposCedula, ParametrosCedula, ResultadoCedula } from './cedula';
export type { EntradaLaboral } from './entrada';
export type { ComparacionLaboral, ResultadoEscenarioLaboral } from './laboral';
export type {
  FuenteParametro,
  ParametroNumerico,
  TablaMarginalUvt,
  TramoSmlmv,
  TramoUvt,
} from './params/constants';
export type { ParametrosProyecto } from './params/proyecto';
export type { ParametrosVigente } from './params/vigente';
export type { ParametrosRenta, ResultadoRenta } from './renta';
export type {
  MesRetencion,
  ParametrosRetencion,
  ProyeccionRetencion,
  ResultadoRetencion,
} from './retencion';
export type { LineaCalculo, ResultadoCalculo } from './resultado';
export type {
  ParametrosSalud,
  ParametrosSaludPlana,
  ParametrosSaludPorTramos,
  ResultadoAportes,
} from './salario';
