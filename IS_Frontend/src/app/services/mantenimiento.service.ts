// src/app/services/mantenimiento.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment'; // Asume que tienes un archivo environment.ts

@Injectable({
  providedIn: 'root'
})
export class MantenimientoService {
  private apiUrl = `http://localhost:8000/api`; // Tu URL base de la API de Django (ej. http://localhost:8000/api/)
  private mantenimientoEndpoint = `${this.apiUrl}/mantenimientos/`; // Endpoint para mantenimientos
  private contentTypeEndpoint = `${this.apiUrl}/contenttypes/`; // Endpoint de Django REST ContentType (si lo configuras)
  private dispositivosEndpoint = `${this.apiUrl}/dispositivos/`;
  private sensoresEndpoint = `${this.apiUrl}/sensores/`;
  private activadoresEndpoint = `${this.apiUrl}/activadores/`;
  private usuariosEndpoint = `${this.apiUrl}/usuarios/`; // Para obtener técnicos

  constructor(private http: HttpClient) { }

  // Puedes añadir un método para obtener el token de autenticación si lo usas
  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('access_token'); // O donde sea que guardes tu token
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : ''
    });
  }

  /**
   * Crea un nuevo registro de mantenimiento.
   * @param mantenimientoData Los datos del formulario, incluyendo content_type_id y object_id.
   */
  createMantenimiento(mantenimientoData: any): Observable<any> {
    return this.http.post<any>(this.mantenimientoEndpoint, mantenimientoData, { headers: this.getHeaders() });
  }

  /**
   * Obtiene la lista de ContentTypes de modelos específicos.
   * IMPORTANTE: Necesitarás configurar una vista en Django para exponer los ContentTypes
   * si este endpoint no existe ya. Por ejemplo, un ViewSet para ContentType.
   * Si no tienes una vista para esto, podrías hardcodear los IDs de ContentType en el frontend
   * una vez que los obtengas del shell de Django.
   */
  getContentTypeForModel(modelName: string): Observable<any> {
    // Asume que tu API de ContentType permite filtrar por 'model'
    // Si no tienes un endpoint /api/contenttypes/model_name, necesitarás crearlo o ajustar esto.
    return this.http.get<any[]>(`${this.contentTypeEndpoint}?model=${modelName}`, { headers: this.getHeaders() });
  }

  /**
   * Obtiene todos los dispositivos IoT.
   */
  getDispositivosIoT(): Observable<any[]> {
    return this.http.get<any[]>(this.dispositivosEndpoint, { headers: this.getHeaders() });
  }

  /**
   * Obtiene todos los sensores.
   */
  getSensores(): Observable<any[]> {
    return this.http.get<any[]>(this.sensoresEndpoint, { headers: this.getHeaders() });
  }

  /**
   * Obtiene todos los activadores.
   */
  getActivadores(): Observable<any[]> {
    return this.http.get<any[]>(this.activadoresEndpoint, { headers: this.getHeaders() });
  }

  /**
   * Obtiene los usuarios con rol 'Técnico de Mantenimiento'.
   * Necesitarás un endpoint en Django que permita filtrar usuarios por rol,
   * o un endpoint específico para técnicos.
   */
  getTecnicos(): Observable<any[]> {
    // Esto es un ejemplo. Ajusta el filtro según cómo tu backend exponga los técnicos.
    // Podría ser: `${this.usuariosEndpoint}?rol__nombre=Técnico de Mantenimiento`
    // O si tienes un endpoint específico: `${this.apiUrl}/tecnicos/`
    return this.http.get<any[]>(`${this.usuariosEndpoint}?rol__nombre=Técnico de Mantenimiento`, { headers: this.getHeaders() });
  }
}
