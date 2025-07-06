// src/app/services/zona.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment'; // Asegúrate de tener tu environment configurado
import { Zona } from '../models/zona.model'; // <-- ¡IMPORTA EL MODELO AQUÍ!

@Injectable({
  providedIn: 'root'
})
export class ZonaService {
  private apiUrl = `http://localhost:8000/api/zonas/`; // Asegúrate de que esta URL sea la correcta para tu API de Zonas

  constructor(private http: HttpClient) { }

  getZonas(): Observable<Zona[]> {
    return this.http.get<Zona[]>(this.apiUrl);
  }

  getZonaById(id: number): Observable<Zona> {
    return this.http.get<Zona>(`${this.apiUrl}${id}/`);
  }

  createZona(zona: Zona): Observable<Zona> {
    return this.http.post<Zona>(this.apiUrl, zona);
  }

  updateZona(id: number, zona: Zona): Observable<Zona> {
    return this.http.put<Zona>(`${this.apiUrl}${id}/`, zona);
  }

  deleteZona(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}${id}/`);
  }
}
