export interface LineaCalculo {
  readonly concepto: string;
  readonly valor: number;
  readonly articulo: string;
  readonly explicacion: string;
}

export interface ResultadoCalculo {
  readonly total: number;
  readonly lineas: readonly LineaCalculo[];
}

export function consolidarResultado(
  lineas: readonly LineaCalculo[],
): ResultadoCalculo {
  const valores = lineas.map((linea) => linea.valor);
  const total = valores.reduce((acumulado, valor) => acumulado + valor, 0);

  return { total, lineas };
}
