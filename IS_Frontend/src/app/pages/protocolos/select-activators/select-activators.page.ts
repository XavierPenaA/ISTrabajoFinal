// src/app/pages/protocolos/select-activators/select-activators.page.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, NavController, ToastController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router'; // Para leer parámetros de la URL
import { ActivadorService } from '../../../services/activador.service'; // Necesitas crear este servicio
import { ProtocolDataService } from '../../../services/protocol-data.service';
import { Activador } from '../../../models/activador.model'; // Importa el modelo Activador
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-select-activators',
  templateUrl: './select-activators.page.html',
  styleUrls: ['./select-activators.page.scss'],
  standalone: true,
  imports: [
    IonicModule,
    CommonModule,
    FormsModule
  ]
})
export class SelectActivatorsPage implements OnInit {
  deviceIds: number[] = [];
  activators: Activador[] = [];
  selectedActivatorIds: number[] = [];
  isLoading: boolean = false;

  constructor(
    private activatedRoute: ActivatedRoute,
    public navCtrl: NavController,
    private toastController: ToastController,
    private activadorService: ActivadorService, // Inyecta el servicio de activadores
    private protocolDataService: ProtocolDataService
  ) { }

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe(params => {
      const deviceIdsParam = params.get('deviceIds');
      if (deviceIdsParam) {
        // Los IDs vendrán como una cadena separada por comas, ej: "1,5,10"
        this.deviceIds = deviceIdsParam.split(',').map(id => +id).filter(id => !isNaN(id));
        if (this.deviceIds.length > 0) {
          this.loadActivators(this.deviceIds);
        } else {
          this.presentToast('No se especificaron IDs de dispositivos válidos. Regresando a Protocolos.', 'danger');
          this.navCtrl.navigateBack('/protocolos');
        }
      } else {
        this.presentToast('No se especificaron dispositivos. Regresando a Protocolos.', 'danger');
        this.navCtrl.navigateBack('/protocolos');
      }
    });

    // Preseleccionar activadores si ya existen en el borrador para los dispositivos actuales
    const currentDraftActivatorIds = this.protocolDataService.getProtocolDraft().activatorIds;
    // Similar a sensores, solo preseleccionar los activadores que pertenecen a los deviceIds actuales
    this.selectedActivatorIds = currentDraftActivatorIds.filter(id =>
      this.activators.some(activator => activator.id === id && this.deviceIds.includes(activator.dispositivo))
    );
  }

  loadActivators(deviceIds: number[]) {
    this.isLoading = true;
    this.activadorService.getActivatorsByDevices(deviceIds).pipe( // Necesitas este método en tu servicio de activadores
      finalize(() => this.isLoading = false)
    ).subscribe({
      next: (data) => {
        this.activators = data;
        // Después de cargar los activadores, ajusta los preseleccionados
        const currentDraftActivatorIds = this.protocolDataService.getProtocolDraft().activatorIds;
        this.selectedActivatorIds = currentDraftActivatorIds.filter(draftId =>
          this.activators.some(loadedActivator => loadedActivator.id === draftId)
        );
      },
      error: (error) => {
        console.error('Error al cargar activadores:', error);
        this.presentToast('Error al cargar activadores. Inténtalo de nuevo.', 'danger');
      }
    });
  }

  onActivatorSelect(activatorId: number, isChecked: boolean) {
    if (isChecked) {
      if (!this.selectedActivatorIds.includes(activatorId)) {
        this.selectedActivatorIds.push(activatorId);
      }
    } else {
      this.selectedActivatorIds = this.selectedActivatorIds.filter(id => id !== activatorId);
    }
    console.log('Activadores seleccionados:', this.selectedActivatorIds);
  }

  isSelected(activatorId: number): boolean {
    return this.selectedActivatorIds.includes(activatorId);
  }

  confirmSelection() {
    // No es obligatorio seleccionar activadores, pero si se seleccionan, los guardamos
    this.protocolDataService.updateProtocolDraft({ activatorIds: this.selectedActivatorIds });
    this.presentToast('Activadores seleccionados: ' + (this.selectedActivatorIds.length > 0 ? this.selectedActivatorIds.join(', ') : 'Ninguno'), 'success');
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
