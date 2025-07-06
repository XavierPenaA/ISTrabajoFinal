// src/app/models/medicion.model.ts
export interface Medicion {
  id: number;
  sensor: number; // Assuming this is the sensor ID
  valor: number;
  fecha: string; // ISO string format for date/time
}
