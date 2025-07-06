// src/app/services/protocolo.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

// Si tu modelo de ProtocoloEmergencia en el frontend va a ser más completo:
// export interface ProtocoloEmergencia {
//   id?: number;
//   nombre: string;
//   zona: number; // ID de la zona
//   sensores: number[]; // Array de IDs de sensores
//   activadores: number[]; // Array de IDs de activadores
//   descripcion: string;
//   creado_por?: number; // ID del usuario que lo crea
//   fecha_creacion?: string;
// }

@Injectable({
  providedIn: 'root'
})
export class ProtocoloService {
  private apiUrl = `http://localhost:8000/api/protocolos/`; // ¡Asegúrate de que esta URL sea la correcta para tu API de Protocolos!

  constructor(private http: HttpClient) { }

  // Método para crear un nuevo protocolo de emergencia
  // El 'protocolData' puede ser de tipo 'any' o puedes definir una interfaz
  createProtocol(protocolData: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, protocolData);
  }

  // Otros métodos que podrías necesitar:
  getProtocolos(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  getProtocoloById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}${id}/`);
  }

  updateProtocolo(id: number, protocolData: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}${id}/`, protocolData);
  }

  deleteProtocolo(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}${id}/`);
  }
}
