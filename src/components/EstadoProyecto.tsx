import { ACTUALIZADO_AL, ESTADO_PROYECTO, RADICADO_EL } from '../engine';

export function EstadoProyecto() {
  return (
    <p className="text-stone-700">
      Estado del proyecto de ley: {ESTADO_PROYECTO} (Cámara de Representantes,
      radicado el {RADICADO_EL}). Parámetros contrastados con el texto radicado
      y las normas vigentes, actualizados al {ACTUALIZADO_AL}. La calculadora
      está en construcción. Los cálculos se harán solo en tu navegador; tus
      datos no salen de aquí.
    </p>
  );
}
