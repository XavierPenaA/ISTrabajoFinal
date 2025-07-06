// src/app/services/medicion.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MedicionService {
  private apiUrl = 'http://localhost:8000/api/mediciones/'; // Ajusta esta URL a tu endpoint de mediciones en Django

  constructor(private http: HttpClient) { }

  /**
   * Obtiene mediciones filtradas por sensor, tipo de medición y rango de fechas.
   * @param sensorId El ID del sensor.
   * @param tipoMedicion El tipo de medición (ej. 'CO2', 'TEMP').
   * @param startDate Fecha de inicio (YYYY-MM-DD).
   * @param endDate Fecha de fin (YYYY-MM-DD).
   * @returns Observable de un array de mediciones.
   */
  getMedicionesFiltradas(
    sensorId: number,
    tipoMedicion: string,
    startDate: string, // Formato 'YYYY-MM-DD'
    endDate: string    // Formato 'YYYY-MM-DD'
  ): Observable<any[]> {
    let params = new HttpParams();
    params = params.append('sensor_id', sensorId.toString());
    params = params.append('tipo_medicion', tipoMedicion); // Si el backend filtra por tipo de medición del sensor
    params = params.append('start_date', startDate);
    params = params.append('end_date', endDate);

    return this.http.get<any[]>(this.apiUrl, { params: params });
  }

  // Si necesitas obtener todos los tipos de medición disponibles (pueden venir de un endpoint de Django)
  getTiposMedicion(): Observable<string[]> {
    // Esto es un mock. En un caso real, harías una llamada a tu API de Django
    // Por ejemplo: this.http.get<string[]>('http://localhost:8000/api/tipos-medicion/');
    return new Observable(observer => {
      observer.next(['CO2', 'PM25', 'TEMP', 'HUMEDAD']);
      observer.complete();
    });
  }

  // Podrías añadir métodos para obtener zonas, dispositivos, sensores si no los tienes en otros servicios
}
