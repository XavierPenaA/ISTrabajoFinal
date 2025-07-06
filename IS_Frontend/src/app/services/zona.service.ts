import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ZonaService {
  private apiUrl = 'http://localhost:8000/api/zonas/'; // ¡CAMBIA ESTO A TU URL REAL DE LA API DE DJANGO REST!

  constructor(private http: HttpClient) { }

  getZonas(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  createZona(zona: any): Observable<any> {
    console.log(zona)
    return this.http.post<any>(this.apiUrl, zona);
  }

  updateZona(id: number, zona: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}${id}/`, zona);
  }

  deleteZona(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}${id}/`);
  }
}
