import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { IonicModule, ToastController } from '@ionic/angular';
import { MantenimientoService } from '../../services/mantenimiento.service';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-registrar-mantenimiento',
  templateUrl: './registrar-mantenimiento.page.html',
  styleUrls: ['./registrar-mantenimiento.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class RegistrarMantenimientoPage implements OnInit {
  @ViewChild('mantenimientoForm') mantenimientoForm!: NgForm;

  mantenimiento: any = {
    // MODIFICACIÓN: Inicializa fecha_mantenimiento con la fecha actual
    fecha_mantenimiento: new Date().toISOString(),
    tipo_mantenimiento: '',
    descripcion: '',
    duracion_horas: null,
    tecnico_responsable_id: null,
  };

  selectedTargetType: 'dispositivo' | 'sensor' | 'activador' = 'dispositivo';

  dispositivos: any[] = [];
  sensores: any[] = [];
  activadores: any[] = [];
  tecnicos: any[] = [];

  contentTypeIds: { dispositivo: number | null, sensor: number | null, activador: number | null } = {
    dispositivo: null,
    sensor: null,
    activador: null
  };

  tipoMantenimientoOptions: string[] = [
    'Preventivo',
    'Correctivo',
    'Predictivo',
    'Inspección',
    'Calibración',
    'Actualización de Firmware',
    'Reemplazo de Componente'
  ];

  isLoading: boolean = false;

  minDate: string = new Date().toISOString().slice(0, 10);

  constructor(
    private mantenimientoService: MantenimientoService,
    private toastController: ToastController,
    private router: Router
  ) { }

  ngOnInit() {
    this.cargarDatosIniciales();
  }

  isNumberNaN(value: any): boolean {
    return Number.isNaN(value);
  }

  cargarDatosIniciales() {
    this.isLoading = true;
    forkJoin([
      this.mantenimientoService.getDispositivosIoT(),
      this.mantenimientoService.getSensores(),
      this.mantenimientoService.getActivadores(),
      this.mantenimientoService.getTecnicos(),
      this.mantenimientoService.getContentTypeForModel('dispositivoiot'),
      this.mantenimientoService.getContentTypeForModel('sensor'),
      this.mantenimientoService.getContentTypeForModel('activador')
    ]).pipe(
      finalize(() => this.isLoading = false)
    ).subscribe({
      next: ([
        dispositivosData,
        sensoresData,
        activadoresData,
        tecnicosData,
        dispositivoCT,
        sensorCT,
        activadorCT
      ]) => {
        this.dispositivos = dispositivosData;
        this.sensores = sensoresData;
        this.activadores = activadoresData;
        this.tecnicos = tecnicosData;

        this.contentTypeIds.dispositivo = dispositivoCT.length > 0 ? dispositivoCT[0].id : null;
        this.contentTypeIds.sensor = sensorCT.length > 0 ? sensorCT[0].id : null;
        this.contentTypeIds.activador = activadorCT.length > 0 ? activadorCT[0].id : null;

        if (!this.contentTypeIds.dispositivo || !this.contentTypeIds.sensor || !this.contentTypeIds.activador) {
          this.presentToast('No se pudieron cargar todos los IDs de ContentType. Asegúrate de que los modelos existan y el endpoint de ContentType esté configurado.', 'danger');
        }

      },
      error: (error) => {
        console.error('Error al cargar datos iniciales para mantenimiento:', error);
        this.presentToast('Error al cargar datos iniciales. Revisa la consola.', 'danger');
      }
    });
  }

  async crearMantenimiento() {
    this.mantenimientoForm.form.markAllAsTouched();

    if (!this.mantenimientoForm.valid) {
      this.presentToast('Por favor, completa todos los campos obligatorios.', 'warning');
      return;
    }

    // --- VALIDACIÓN DE FECHA: IMPIDE EL REGISTRO SI ES UNA FECHA ANTERIOR ---
    if (this.mantenimiento.fecha_mantenimiento) {
      const selectedDate = new Date(this.mantenimiento.fecha_mantenimiento);
      const today = new Date();
      // Normalizar a inicio del día para comparar solo la fecha (año, mes, día)
      today.setHours(0, 0, 0, 0);

      if (selectedDate < today) {
        this.presentToast('La fecha de mantenimiento no puede ser anterior al día actual.', 'danger');
        return; // Detener el proceso de registro si la fecha es inválida
      }
    }
    // -----------------------------------------------------------------------

    const dataToSend = { ...this.mantenimiento };

    // Corrección de formato de fecha para el backend (si es necesario un formato específico)
    if (dataToSend.fecha_mantenimiento) {
      const dateObj = new Date(dataToSend.fecha_mantenimiento);
      const year = dateObj.getFullYear();
      const month = (dateObj.getMonth() + 1).toString().padStart(2, '0');
      const day = dateObj.getDate().toString().padStart(2, '0');
      dataToSend.fecha_mantenimiento = `${year}-${month}-${day}`;
    }

    // Añade content_type_id y object_id según la selección del usuario
    if (this.selectedTargetType === 'dispositivo') {
      dataToSend.content_type_id = this.contentTypeIds.dispositivo;
      dataToSend.object_id = this.mantenimiento.dispositivo_id;
      if (!dataToSend.content_type_id || !dataToSend.object_id) {
        this.presentToast('Selecciona un dispositivo para el mantenimiento.', 'warning');
        return;
      }
    } else if (this.selectedTargetType === 'sensor') {
      dataToSend.content_type_id = this.contentTypeIds.sensor;
      dataToSend.object_id = this.mantenimiento.sensor_id;
      if (!dataToSend.content_type_id || !dataToSend.object_id) {
        this.presentToast('Selecciona un sensor para el mantenimiento.', 'warning');
        return;
      }
    } else if (this.selectedTargetType === 'activador') {
      dataToSend.content_type_id = this.contentTypeIds.activador;
      dataToSend.object_id = this.mantenimiento.activador_id;
      if (!dataToSend.content_type_id || !dataToSend.object_id) {
        this.presentToast('Selecciona un activador para el mantenimiento.', 'warning');
        return;
      }
    } else {
      this.presentToast('Debe seleccionar un tipo de objetivo para el mantenimiento (Dispositivo, Sensor o Activador).', 'warning');
      return;
    }

    this.isLoading = true;
    this.mantenimientoService.createMantenimiento(dataToSend).pipe(
      finalize(() => this.isLoading = false)
    ).subscribe({
      next: (response) => {
        console.log('Mantenimiento registrado con éxito:', response);
        this.presentSuccessToastAndClearForm();
      },
      error: (error) => {
        console.error('Error al registrar mantenimiento:', error);
        let errorMessage = 'Error al registrar el mantenimiento.';
        if (error.error && typeof error.error === 'object') {
          for (const key in error.error) {
            if (error.error.hasOwnProperty(key)) {
              if (Array.isArray(error.error[key])) {
                errorMessage += `\n${key}: ${error.error[key].join(', ')}`;
              } else {
                errorMessage += `\n${key}: ${error.error[key]}`;
              }
            }
          }
        } else if (error.message) {
          errorMessage = error.message;
        }
        this.presentToast(errorMessage, 'danger');
      }
    });
  }

  async presentToast(message: string, color: string = 'primary', icon?: string, duration: number = 3000, position: 'top' | 'middle' | 'bottom' = 'top', buttons?: any[]) {
    const toast = await this.toastController.create({
      message: message,
      duration: duration,
      color: color,
      position: position,
      icon: icon,
      buttons: buttons
    });
    toast.present();
    return toast;
  }

  async presentSuccessToastAndClearForm() {
    const toast = await this.toastController.create({
      message: 'Mantenimiento registrado con éxito.',
      duration: 3000,
      color: 'success',
      position: 'middle',
      icon: 'checkmark-circle-outline',
      buttons: [
        {
          text: 'X',
          role: 'cancel',
          handler: () => { }
        }
      ]
    });
    toast.present();
    toast.onDidDismiss().then(() => {
      this.mantenimientoForm.resetForm();
      this.mantenimiento = {
        // Al resetear, también se reinicia a la fecha actual por defecto
        fecha_mantenimiento: new Date().toISOString(),
        tipo_mantenimiento: '',
        descripcion: '',
        duracion_horas: null,
        tecnico_responsable_id: null,
      };
      this.selectedTargetType = 'dispositivo';
    });
  }
}
