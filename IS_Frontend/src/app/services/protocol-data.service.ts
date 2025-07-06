// src/app/services/protocol-data.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

// Define la estructura de tu borrador de protocolo
export interface ProtocolDraft {
  zoneId: number | null;
  deviceIds: number[];
  sensorIds: number[];
  activatorIds: number[];
  // Puedes añadir más campos aquí para el nombre del protocolo, descripción, etc.
  // nombre: string;
  // descripcion: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProtocolDataService {
  // Estado inicial del borrador de protocolo
  private initialProtocolDraft: ProtocolDraft = {
    zoneId: null,
    deviceIds: [],
    sensorIds: [],
    activatorIds: [],
    // nombre: '',
    // descripcion: ''
  };

  // BehaviorSubject para mantener el estado del borrador y emitir cambios
  private _protocolDraft = new BehaviorSubject<ProtocolDraft>(this.initialProtocolDraft);

  // Observable público para que otros componentes puedan suscribirse a los cambios
  protocolDraft$: Observable<ProtocolDraft> = this._protocolDraft.asObservable();

  constructor() {
    // Intentar cargar un borrador guardado del almacenamiento local al iniciar
    const savedDraft = localStorage.getItem('protocolDraft');
    if (savedDraft) {
      try {
        this._protocolDraft.next(JSON.parse(savedDraft));
      } catch (e) {
        console.error('Error al parsear borrador guardado:', e);
        // Si hay un error, resetea a un estado limpio
        localStorage.removeItem('protocolDraft');
        this._protocolDraft.next(this.initialProtocolDraft);
      }
    }
  }

  // Obtiene el estado actual del borrador
  getProtocolDraft(): ProtocolDraft {
    return this._protocolDraft.getValue();
  }

  // Actualiza el borrador con nuevos datos (parciales)
  updateProtocolDraft(updates: Partial<ProtocolDraft>): void {
    const currentDraft = this._protocolDraft.getValue();
    const updatedDraft = { ...currentDraft, ...updates };
    this._protocolDraft.next(updatedDraft);
    // Opcional: Guarda el borrador en el almacenamiento local para persistencia
    localStorage.setItem('protocolDraft', JSON.stringify(updatedDraft));
  }

  /**
   * Restablece el borrador del protocolo a su estado inicial.
   * Esto es útil después de que un protocolo ha sido creado o cancelado.
   */
  resetProtocolDraft(): void { // <--- ¡AÑADE ESTE MÉTODO!
    this._protocolDraft.next(this.initialProtocolDraft);
    localStorage.removeItem('protocolDraft'); // También limpia del almacenamiento local
  }
}
