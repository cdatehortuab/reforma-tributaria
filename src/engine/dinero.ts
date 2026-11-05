/** Redondea al peso. Las cifras en UVT no se aproximan; el peso sí. */
export function aPesos(valor: number): number {
  return Math.round(valor);
}

export function noNegativo(valor: number): number {
  return Math.max(0, valor);
}

export function pesosAUvt(pesos: number, uvt: number): number {
  return pesos / uvt;
}

export function uvtAPesos(cantidadUvt: number, uvt: number): number {
  return aPesos(cantidadUvt * uvt);
}

export function topeUvtAPesos(topeUvt: number, uvt: number): number {
  return aPesos(topeUvt * uvt);
}
