// src/app/services/sensor.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { Sensor } from '../models/sensor.model'; // Importa el modelo Sensor

@Injectable({
  providedIn: 'root'
})
export class SensorService {
   getSensoresByDispositivo(dispositivoId: number): Observable<Sensor[]> {
    let params = new HttpParams().set('dispositivo', dispositivoId.toString());
    return this.http.get<Sensor[]>(this.apiUrl, { params: params });
  }
  private apiUrl = `http://localhost:8000/api/sensores/`; // Asegúrate de que esta URL sea la correcta para tu API de Sensores

  constructor(private http: HttpClient) { }

  getSensores(): Observable<Sensor[]> {
    return this.http.get<Sensor[]>(this.apiUrl);
  }

  getSensorById(id: number): Observable<Sensor> {
    return this.http.get<Sensor>(`${this.apiUrl}${id}/`);
  }

  // Método crucial: Obtener sensores por una lista de IDs de dispositivos
  getSensorsByDevices(deviceIds: number[]): Observable<Sensor[]> {
    if (deviceIds.length === 0) {
      return new Observable(observer => {
        observer.next([]);
        observer.complete();
      });
    }

    // Si tu backend soporta filtrar por múltiples IDs de dispositivos en una sola petición (ej: /api/sensores/?dispositivo_ids=1,2,3)
    // esta es la forma más eficiente:
    let params = new HttpParams().set('dispositivo_ids', deviceIds.join(','));
    return this.http.get<Sensor[]>(this.apiUrl, { params: params });

    // *** ALTERNATIVA: Si tu backend SOLO soporta filtrar por un solo ID de dispositivo a la vez: ***
    // (Menos eficiente, más peticiones)
    /*
    const observables = deviceIds.map(id => {
      let params = new HttpParams().set('dispositivo', id.toString());
      return this.http.get<Sensor[]>(this.apiUrl, { params: params });
    });
    // Combina los resultados de todas las peticiones
    return forkJoin(observables).pipe(
      map(arraysOfSensors => arraysOfSensors.flat()) // Aplanamos el array de arrays en un solo array de sensores
    );
    */
  }

  createSensor(sensor: Sensor): Observable<Sensor> {
    return this.http.post<Sensor>(this.apiUrl, sensor);
  }

  updateSensor(id: number, sensor: Sensor): Observable<Sensor> {
    return this.http.put<Sensor>(`${this.apiUrl}${id}/`, sensor);
  }

  deleteSensor(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}${id}/`);
  }
}
