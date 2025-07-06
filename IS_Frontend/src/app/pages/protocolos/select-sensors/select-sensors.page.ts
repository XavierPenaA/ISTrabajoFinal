// src/app/pages/protocolos/select-sensors/select-sensors.page.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, NavController, ToastController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router'; // Para leer parámetros de la URL
import { SensorService } from '../../../services/sensor.service'; // Necesitas crear este servicio
import { ProtocolDataService } from '../../../services/protocol-data.service';
import { Sensor } from '../../../models/sensor.model'; // Importa el modelo Sensor
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-select-sensors',
  templateUrl: './select-sensors.page.html',
  styleUrls: ['./select-sensors.page.scss'],
  standalone: true,
  imports: [
    IonicModule,
    CommonModule,
    FormsModule
  ]
})
export class SelectSensorsPage implements OnInit {
  deviceIds: number[] = [];
  sensors: Sensor[] = [];
  selectedSensorIds: number[] = [];
  isLoading: boolean = false;

  constructor(
    private activatedRoute: ActivatedRoute,
    public navCtrl: NavController,
    private toastController: ToastController,
    private sensorService: SensorService, // Inyecta el servicio de sensores
    private protocolDataService: ProtocolDataService
  ) { }

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe(params => {
      const deviceIdsParam = params.get('deviceIds');
      if (deviceIdsParam) {
        // Los IDs vendrán como una cadena separada por comas, ej: "1,5,10"
        this.deviceIds = deviceIdsParam.split(',').map(id => +id).filter(id => !isNaN(id));
        if (this.deviceIds.length > 0) {
          this.loadSensors(this.deviceIds);
        } else {
          this.presentToast('No se especificaron IDs de dispositivos válidos. Regresando a Protocolos.', 'danger');
          this.navCtrl.navigateBack('/protocolos');
        }
      } else {
        this.presentToast('No se especificaron dispositivos. Regresando a Protocolos.', 'danger');
        this.navCtrl.navigateBack('/protocolos');
      }
    });

    // Preseleccionar sensores si ya existen en el borrador para los dispositivos actuales
    const currentDraftSensorIds = this.protocolDataService.getProtocolDraft().sensorIds;
    // Solo preseleccionar los sensores que pertenecen a los deviceIds actuales
    // (Esto es más complejo y quizás lo quieras simplificar, pero es la versión "correcta")
    this.selectedSensorIds = currentDraftSensorIds.filter(id =>
      this.sensors.some(sensor => sensor.id === id && this.deviceIds.includes(sensor.dispositivo))
    );
    // Para simplificar: this.selectedSensorIds = [...currentDraftSensorIds];
    // Pero si cambian los dispositivos, los sensores antiguos ya no son válidos.
  }

  loadSensors(deviceIds: number[]) {
    this.isLoading = true;
    this.sensorService.getSensorsByDevices(deviceIds).pipe( // Necesitas este método en tu servicio de sensores
      finalize(() => this.isLoading = false)
    ).subscribe({
      next: (data) => {
        this.sensors = data;
        // Después de cargar los sensores, ajusta los preseleccionados
        const currentDraftSensorIds = this.protocolDataService.getProtocolDraft().sensorIds;
        this.selectedSensorIds = currentDraftSensorIds.filter(draftId =>
          this.sensors.some(loadedSensor => loadedSensor.id === draftId)
        );
      },
      error: (error) => {
        console.error('Error al cargar sensores:', error);
        this.presentToast('Error al cargar sensores. Inténtalo de nuevo.', 'danger');
      }
    });
  }

  onSensorSelect(sensorId: number, isChecked: boolean) {
    if (isChecked) {
      if (!this.selectedSensorIds.includes(sensorId)) {
        this.selectedSensorIds.push(sensorId);
      }
    } else {
      this.selectedSensorIds = this.selectedSensorIds.filter(id => id !== sensorId);
    }
    console.log('Sensores seleccionados:', this.selectedSensorIds);
  }

  isSelected(sensorId: number): boolean {
    return this.selectedSensorIds.includes(sensorId);
  }

  confirmSelection() {
    // No es obligatorio seleccionar sensores, pero si se seleccionan, los guardamos
    // Si la selección de sensores es obligatoria, añade un 'if (this.selectedSensorIds.length === 0)'
    this.protocolDataService.updateProtocolDraft({ sensorIds: this.selectedSensorIds });
    this.presentToast('Sensores seleccionados: ' + (this.selectedSensorIds.length > 0 ? this.selectedSensorIds.join(', ') : 'Ninguno'), 'success');
    this.navCtrl.navigateBack('/protocolos');
  }

  cancelSelection() {
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
