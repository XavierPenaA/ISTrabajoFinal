// src/app/pages/protocolos/protocolos-main/protocolos-main.page.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, NavController, ToastController, AlertController } from '@ionic/angular';
import { ProtocolDataService, ProtocolDraft } from '../../../services/protocol-data.service';
import { ZonaService } from '../../../services/zona.service';
import { DispositivoService } from '../../../services/dispositivo.service';
import { SensorService } from '../../../services/sensor.service';
import { ActivadorService } from '../../../services/activador.service';
import { ProtocoloService } from '../../../services/protocolo.service';
import { Zona } from '../../../models/zona.model';
import { DispositivoIoT } from '../../../models/dispositivo-iot.model';
import { Sensor } from '../../../models/sensor.model';
import { Activador } from '../../../models/activador.model';
import { forkJoin, of, Subject } from 'rxjs';
import { switchMap, takeUntil } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-protocolos-main',
  templateUrl: './protocolos-main.page.html',
  styleUrls: ['./protocolos-main.page.scss'],
  standalone: true,
  imports: [
    IonicModule,
    CommonModule,
    FormsModule
  ]
})
export class ProtocolosMainPage implements OnInit, OnDestroy {
  protocolDraft: ProtocolDraft;

  selectedZone: Zona | null = null;
  selectedDevices: DispositivoIoT[] = [];
  selectedSensors: Sensor[] = [];
  selectedActivators: Activador[] = [];

  private destroy$ = new Subject<void>();

  constructor(
    private protocolDataService: ProtocolDataService,
    private navCtrl: NavController,
    private toastController: ToastController,
    private alertController: AlertController,
    private zonaService: ZonaService,
    private dispositivoService: DispositivoService,
    private sensorService: SensorService,
    private activadorService: ActivadorService,
    private protocoloService: ProtocoloService
  ) {
    this.protocolDraft = this.protocolDataService.getProtocolDraft();
  }

  ngOnInit() {
    this.protocolDataService.protocolDraft$
      .pipe(takeUntil(this.destroy$))
      .subscribe(draft => {
        this.protocolDraft = draft;
        this.loadProtocolDetails();
      });

    this.loadProtocolDetails();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadProtocolDetails() {
    const zoneObs = this.protocolDraft.zoneId
      ? this.zonaService.getZonaById(this.protocolDraft.zoneId)
      : of(null);

    const devicesObs = this.protocolDraft.deviceIds.length > 0
      ? forkJoin(this.protocolDraft.deviceIds.map(id => this.dispositivoService.getDispositivoIoTById(id)))
      : of([]);

    const sensorsObs = this.protocolDraft.sensorIds.length > 0
      ? forkJoin(this.protocolDraft.sensorIds.map(id => this.sensorService.getSensorById(id)))
      : of([]);

    const activatorsObs = this.protocolDraft.activatorIds.length > 0
      ? forkJoin(this.protocolDraft.activatorIds.map(id => this.activadorService.getActivadorById(id)))
      : of([]);


    forkJoin([zoneObs, devicesObs, sensorsObs, activatorsObs])
      .subscribe({
        next: ([zone, devices, sensors, activators]) => {
          this.selectedZone = zone;
          this.selectedDevices = devices.filter(d => !!d); // Filtra cualquier null/undefined si la API devuelve 404
          this.selectedSensors = sensors.filter(s => !!s);
          this.selectedActivators = activators.filter(a => !!a);
        },
        error: (error) => {
          console.error('Error al cargar detalles del protocolo:', error);
          this.presentToast('Error al cargar detalles.', 'danger');
        }
      });
  }

  // --- Métodos de navegación ---
  goToSelectZone() {
    this.navCtrl.navigateForward('/protocolos/select-zone');
  }

  goToSelectDevices() {
    if (this.protocolDraft.zoneId) {
      this.navCtrl.navigateForward(`/protocolos/select-device/${this.protocolDraft.zoneId}`);
    } else {
      this.presentToast('Por favor, selecciona una zona primero.', 'warning');
    }
  }

  goToSelectSensors() {
    if (this.protocolDraft.deviceIds.length > 0) {
      this.navCtrl.navigateForward(`/protocolos/select-sensors/${this.protocolDraft.deviceIds.join(',')}`);
    } else {
      this.presentToast('Por favor, selecciona al menos un dispositivo primero.', 'warning');
    }
  }

  goToSelectActivators() {
    if (this.protocolDraft.deviceIds.length > 0) {
      this.navCtrl.navigateForward(`/protocolos/select-activators/${this.protocolDraft.deviceIds.join(',')}`);
    } else {
      this.presentToast('Por favor, selecciona al menos un dispositivo primero.', 'warning');
    }
  }

  // --- Lógica para el botón "CREAR PROTOCOLO" ---
  canCreateProtocol(): boolean {
    return (
      !!this.protocolDraft.zoneId &&
      this.protocolDraft.deviceIds.length > 0 &&
      this.protocolDraft.sensorIds.length > 0
    );
  }

  async createProtocol() {
    if (!this.canCreateProtocol()) {
      this.presentToast('Completa todos los campos obligatorios (Zona, Dispositivos, Sensores) antes de crear el protocolo.', 'warning');
      return;
    }

    const protocolData = {
      nombre: 'Nuevo Protocolo de Emergencia',
      zona: this.protocolDraft.zoneId,
      sensores: this.protocolDraft.sensorIds,
      activadores: this.protocolDraft.activatorIds,
      descripcion: 'Protocolo automático generado por la app.',
      // creado_por: ID_DEL_USUARIO_ACTUAL // Descomentar y asignar si tienes manejo de usuarios logueados
    };

    const alert = await this.alertController.create({
      header: 'Confirmar Creación',
      message: '¿Estás seguro de que quieres crear este protocolo?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
        },
        {
          text: 'Crear',
          handler: async () => {
            try {
              const response = await this.protocoloService.createProtocol(protocolData).toPromise();
              console.log('Protocolo creado exitosamente:', response);
              this.presentToast('Protocolo creado exitosamente.', 'success');
              this.protocolDataService.resetProtocolDraft();
              this.navCtrl.navigateRoot('/protocolos');
            } catch (error: any) {
              console.error('Error al crear protocolo:', error);
              // Mejor manejo de errores de la API
              let errorMessage = 'Error desconocido al crear el protocolo.';
              if (error instanceof HttpErrorResponse) {
                if (error.error && typeof error.error === 'object') {
                  // Errores de validación de Django REST Framework
                  errorMessage = Object.values(error.error).flat().join('. ');
                } else if (error.error) {
                  errorMessage = error.error;
                } else if (error.message) {
                  errorMessage = error.message;
                }
              } else if (error.message) {
                errorMessage = error.message;
              }
              this.presentToast(`Error al crear el protocolo: ${errorMessage}`, 'danger', 5000);
            }
          },
        },
      ],
    });
    await alert.present();
  }

  // --- Métodos auxiliares ---
  async presentToast(message: string, color: string = 'primary', duration: number = 3000) {
    const toast = await this.toastController.create({
      message: message,
      duration: duration,
      color: color,
      position: 'top',
    });
    toast.present();
  }
}
