// src/app/models/sensor.model.ts
export interface Sensor {
  id: number;
  dispositivo: number; // Esto será el ID del DispositivoIoT
  tipo_medicion: string; // Ej: 'CO2', 'PM25', 'TEMP', 'HUMEDAD'
  unidad: string; // Ej: 'ppm', 'µg/m³', '°C', '%'
  umbral_min: number;
  umbral_max: number;
  activo: boolean;
}
