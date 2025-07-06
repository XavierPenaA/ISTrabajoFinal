// src/app/services/dispositivo.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http'; // Importa HttpParams
import { Observable } from 'rxjs';
import { DispositivoIoT } from '../models/dispositivo-iot.model'; // <-- ¡IMPORTA TU MODELO AQUÍ!
import { Zona } from '../models/zona.model'; // Si necesitas tipar las zonas, también impórtala

@Injectable({
  providedIn: 'root'
})
export class DispositivoService {
  // Asegúrate de que esta URL base apunte a tu backend de Django
  // Ejemplo: private apiUrl = 'http://localhost:8000/api/';
  private apiUrl = 'http://localhost:8000/api'; // Sin la barra final si tus rutas no la esperan

  constructor(private http: HttpClient) { }

  /**
   * Obtiene la lista de todas las zonas disponibles.
   * @returns Observable<Zona[]>
   */
  getZonas(): Observable<Zona[]> { // Tipado con el modelo Zona
    return this.http.get<Zona[]>(`${this.apiUrl}/zonas/`);
  }

  /**
   * Registra un nuevo dispositivo IoT.
   * @param dispositivoData Los datos del formulario del dispositivo.
   * @returns Observable<DispositivoIoT>
   */
  crearDispositivoIoT(dispositivoData: any): Observable<DispositivoIoT> {
    return this.http.post<DispositivoIoT>(`${this.apiUrl}/dispositivos/`, dispositivoData);
  }

  /**
   * Obtiene la lista de todos los dispositivos IoT.
   * @returns Observable<DispositivoIoT[]>
   */
  getDispositivosIoT(): Observable<DispositivoIoT[]> {
    return this.http.get<DispositivoIoT[]>(`${this.apiUrl}/dispositivos/`);
  }

  /**
   * Obtiene un dispositivo IoT por su ID.
   * @param id El ID del dispositivo.
   * @returns Observable<DispositivoIoT>
   */
  getDispositivoIoTById(id: number): Observable<DispositivoIoT> {
    return this.http.get<DispositivoIoT>(`${this.apiUrl}/dispositivos/${id}/`);
  }

  /**
   * Obtiene dispositivos IoT filtrados por el ID de la zona.
   * @param zoneId El ID de la zona para filtrar.
   * @returns Observable<DispositivoIoT[]>
   */
  getDispositivosByZone(zoneId: number): Observable<DispositivoIoT[]> {
    // 'zona' es el nombre del campo de filtro que configuraste en tu backend (DispositivoIoTViewSet)
    let params = new HttpParams().set('zona', zoneId.toString());
    return this.http.get<DispositivoIoT[]>(`${this.apiUrl}/dispositivos/`, { params: params });
  }

  // Puedes añadir más métodos aquí si los necesitas para actualizar o eliminar dispositivos.
}
