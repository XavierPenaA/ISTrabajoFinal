// src/app/pages/protocolos/select-zone/select-zone.page.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, NavController, ToastController } from '@ionic/angular';
import { ZonaService } from '../../../services/zona.service';
import { ProtocolDataService } from '../../../services/protocol-data.service';
import { Zona } from '../../../models/zona.model';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-select-zone',
  templateUrl: './select-zone.page.html',
  styleUrls: ['./select-zone.page.scss'],
  standalone: true,
  imports: [
    IonicModule,
    CommonModule,
    FormsModule
  ]
})
export class SelectZonePage implements OnInit {
  zonas: Zona[] = [];
  selectedZoneId: number | null = null;
  isLoading: boolean = false;

  constructor(
    private zonaService: ZonaService,
    public navCtrl: NavController, // <--- ¡CAMBIA 'private' a 'public' AQUÍ!
    private toastController: ToastController,
    private protocolDataService: ProtocolDataService
  ) { }

  ngOnInit() {
    this.loadZonas();
    this.selectedZoneId = this.protocolDataService.getProtocolDraft().zoneId;
  }

  loadZonas() {
    this.isLoading = true;
    this.zonaService.getZonas().pipe(
      finalize(() => this.isLoading = false)
    ).subscribe({
      next: (data) => {
        this.zonas = data;
      },
      error: (error) => {
        console.error('Error al cargar zonas:', error);
        this.presentToast('Error al cargar zonas. Inténtalo de nuevo.', 'danger');
      }
    });
  }

  onZoneSelect(event: any) {
    this.selectedZoneId = event.detail.value;
  }

  confirmSelection() {
    if (this.selectedZoneId !== null) {
      this.protocolDataService.updateProtocolDraft({ zoneId: this.selectedZoneId });
      this.presentToast('Zona seleccionada: ' + this.selectedZoneId, 'success');
      this.navCtrl.navigateBack('/protocolos');
    } else {
      this.presentToast('Por favor, selecciona una zona para continuar.', 'warning');
    }
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
