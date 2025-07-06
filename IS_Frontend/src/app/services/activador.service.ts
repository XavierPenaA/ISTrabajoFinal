// src/app/services/activador.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { Activador } from '../models/activador.model'; // Importa el modelo Activador

@Injectable({
  providedIn: 'root'
})
export class ActivadorService {
  private apiUrl = `http://localhost:8000/api/activadores/`; // Asegúrate de que esta URL sea la correcta para tu API de Activadores

  constructor(private http: HttpClient) { }

  getActivadores(): Observable<Activador[]> {
    return this.http.get<Activador[]>(this.apiUrl);
  }

  getActivadorById(id: number): Observable<Activador> {
    return this.http.get<Activador>(`${this.apiUrl}${id}/`);
  }

  // Método crucial: Obtener activadores por una lista de IDs de dispositivos
  getActivatorsByDevices(deviceIds: number[]): Observable<Activador[]> {
    if (deviceIds.length === 0) {
      return new Observable(observer => {
        observer.next([]);
        observer.complete();
      });
    }

    // Si tu backend soporta filtrar por múltiples IDs de dispositivos en una sola petición (ej: /api/activadores/?dispositivo_ids=1,2,3)
    // esta es la forma más eficiente:
    let params = new HttpParams().set('dispositivo_ids', deviceIds.join(','));
    return this.http.get<Activador[]>(this.apiUrl, { params: params });

    // *** ALTERNATIVA: Si tu backend SOLO soporta filtrar por un solo ID de dispositivo a la vez: ***
    /*
    const observables = deviceIds.map(id => {
      let params = new HttpParams().set('dispositivo', id.toString());
      return this.http.get<Activador[]>(this.apiUrl, { params: params });
    });
    return forkJoin(observables).pipe(
      map(arraysOfActivators => arraysOfActivators.flat()) // Aplanamos el array de arrays
    );
    */
  }

  createActivador(activador: Activador): Observable<Activador> {
    return this.http.post<Activador>(this.apiUrl, activador);
  }

  updateActivador(id: number, activador: Activador): Observable<Activador> {
    return this.http.put<Activador>(`${this.apiUrl}${id}/`, activador);
  }

  deleteActivador(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}${id}/`);
  }
}
