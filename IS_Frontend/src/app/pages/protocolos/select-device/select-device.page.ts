// src/app/pages/protocolos/select-device/select-device.page.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, NavController, ToastController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router'; // Para leer parámetros de la URL
import { DispositivoService } from '../../../services/dispositivo.service'; // Asumiendo que tienes un servicio para Dispositivos IoT
import { ProtocolDataService } from '../../../services/protocol-data.service';
import { DispositivoIoT } from '../../../models/dispositivo-iot.model'; // Necesitas crear este modelo
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-select-device',
  templateUrl: './select-device.page.html',
  styleUrls: ['./select-device.page.scss'],
  standalone: true,
  imports: [
    IonicModule,
    CommonModule,
    FormsModule
  ]
})
export class SelectDevicePage implements OnInit {
  zoneId: number | null = null;
  dispositivos: DispositivoIoT[] = [];
  selectedDeviceIds: number[] = [];
  isLoading: boolean = false;

  constructor(
    private activatedRoute: ActivatedRoute, // Inyecta ActivatedRoute
    public navCtrl: NavController, // Public para uso en HTML
    private toastController: ToastController,
    private dispositivoIoTService: DispositivoService, // Inyecta el servicio de dispositivos
    private protocolDataService: ProtocolDataService // Inyecta el servicio de datos compartidos
  ) { }

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe(params => {
      const zoneIdParam = params.get('zoneId');
      if (zoneIdParam) {
        this.zoneId = +zoneIdParam; // Convertir a número
        this.loadDispositivos(this.zoneId);
      } else {
        this.presentToast('No se especificó una zona. Regresando a Protocolos.', 'danger');
        this.navCtrl.navigateBack('/protocolos');
      }
    });

    // Preseleccionar dispositivos si ya existen en el borrador
    this.selectedDeviceIds = [...this.protocolDataService.getProtocolDraft().deviceIds]; // Copia el array
  }

  loadDispositivos(zoneId: number) {
    this.isLoading = true;
    this.dispositivoIoTService.getDispositivosByZone(zoneId).pipe( // Necesitas un método en tu servicio para filtrar por zona
      finalize(() => this.isLoading = false)
    ).subscribe({
      next: (data) => {
        this.dispositivos = data;
      },
      error: (error) => {
        console.error('Error al cargar dispositivos:', error);
        this.presentToast('Error al cargar dispositivos. Inténtalo de nuevo.', 'danger');
      }
    });
  }

  onDeviceSelect(deviceId: number, isChecked: boolean) {
    if (isChecked) {
      if (!this.selectedDeviceIds.includes(deviceId)) {
        this.selectedDeviceIds.push(deviceId);
      }
    } else {
      this.selectedDeviceIds = this.selectedDeviceIds.filter(id => id !== deviceId);
    }
    console.log('Dispositivos seleccionados:', this.selectedDeviceIds);
  }

  isSelected(deviceId: number): boolean {
    return this.selectedDeviceIds.includes(deviceId);
  }

  confirmSelection() {
    if (this.selectedDeviceIds.length > 0) {
      // Guarda los IDs de dispositivos seleccionados en el servicio de datos
      this.protocolDataService.updateProtocolDraft({ deviceIds: this.selectedDeviceIds, sensorIds: [], activatorIds: [] });
      this.presentToast('Dispositivos seleccionados: ' + this.selectedDeviceIds.join(', '), 'success');
      // Al seleccionar nuevos dispositivos, reseteamos sensores y activadores,
      // ya que deben ser coherentes con los nuevos dispositivos.
      this.protocolDataService.updateProtocolDraft({ sensorIds: [], activatorIds: [] });
      this.navCtrl.navigateBack('/protocolos');
    } else {
      this.presentToast('Por favor, selecciona al menos un dispositivo.', 'warning');
    }
  }

  cancelSelection() {
    // Simplemente navega de vuelta sin guardar los cambios
    this.navCtrl.navigateBack('/protocolos');
  }

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
