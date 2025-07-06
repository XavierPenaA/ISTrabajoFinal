// src/app/models/dispositivo-iot.model.ts
export interface DispositivoIoT {
  id: number;
  zona: number; // Esto será el ID de la Zona, no el objeto Zona completo
  tipo: string;
  latitud: number;
  longitud: number;
  activo: boolean;
  fecha_registro: string; // Django lo enviará como string ISO 8601
  ultima_actualizacion: string; // Django lo enviará como string ISO 8601
}
