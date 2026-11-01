import { ESTADO_PROYECTO } from '../engine';

export function EstadoProyecto() {
  return (
    <p className="text-stone-700">
      Estado del proyecto de ley: {ESTADO_PROYECTO}. La calculadora está en
      construcción. Los cálculos se harán solo en tu navegador; tus datos no
      salen de aquí.
    </p>
  );
}
