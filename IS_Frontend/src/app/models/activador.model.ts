// src/app/models/activador.model.ts
export interface Activador {
  id: number;
  dispositivo: number; // Esto será el ID del DispositivoIoT
  tipo: string; // Ej: 'Ventilador', 'Alarma', 'Válvula'
  accion: string; // Ej: 'Encender', 'Apagar', 'Abrir', 'Cerrar'
}
