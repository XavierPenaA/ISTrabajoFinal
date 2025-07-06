// src/app/crear-dispositivo/crear-dispositivo.page.ts

import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { IonicModule, ToastController } from '@ionic/angular';
import { DispositivoService } from '../../services/dispositivo.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-crear-dispositivo',
  templateUrl: './crear-dispositivo.page.html',
  styleUrls: ['./crear-dispositivo.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class CrearDispositivoPage implements OnInit {
isNaN(arg0: any): any {
throw new Error('Method not implemented.');
}
  // NOTA: isNaN(arg0: any): boolean { throw new Error('Method not implemented.'); }
  // Esta línea no debería estar aquí en el componente. Es un error de sintaxis.
  // Elimínala de tu archivo si la tienes.

  @ViewChild('dispositivoForm') dispositivoForm!: NgForm;

  dispositivo: any = {
    zona: null, // ID de la zona
    tipo: '',
    latitud: null,
    longitud: null,
    activo: true // Por defecto activo
  };

  sensores: any[] = [{ // Inicializamos con un sensor vacío
    tipo_medicion: '',
    unidad: '',
    umbral_min: null,
    umbral_max: null,
    activo: true
  }];

  activadores: any[] = [{ // Inicializamos con un activador vacío
    tipo: '',
    accion: ''
  }];

  zonas: any[] = []; // Para almacenar las zonas que se cargarán del backend

  // TIPOS_MEDICION según tu models.py (hardcodeado para frontend)
  tiposMedicion: string[] = ['CO2', 'PM25', 'TEMP', 'HUMEDAD'];


  constructor(
    private dispositivoService: DispositivoService,
    private toastController: ToastController,
    private router: Router
  ) { }

  ngOnInit() {
    this.cargarZonas();
  }

  cargarZonas() {
    this.dispositivoService.getZonas().subscribe({
      next: (zonasData) => {
        this.zonas = zonasData;
      },
      error: (error) => {
        console.error('Error al cargar zonas:', error);
        this.presentToast('Error al cargar las zonas disponibles.', 'danger');
      }
    });
  }

  // --- Métodos para manejar Sensores ---
  addSensor() {
    this.sensores.push({
      tipo_medicion: '',
      unidad: '',
      umbral_min: null,
      umbral_max: null,
      activo: true
    });
  }

  removeSensor(index: number) {
    if (this.sensores.length > 1) { // Permite eliminar si hay más de uno
      this.sensores.splice(index, 1);
    } else {
      this.presentToast('Debe haber al menos un sensor.', 'warning');
    }
  }

  // --- Métodos para manejar Activadores ---
  addActivador() {
    this.activadores.push({
      tipo: '',
      accion: ''
    });
  }

  removeActivador(index: number) {
    if (this.activadores.length > 1) { // Permite eliminar si hay más de uno
      this.activadores.splice(index, 1);
    } else {
      this.presentToast('Debe haber al menos un activador.', 'warning');
    }
  }


  async crearDispositivo() {
    this.dispositivoForm.form.markAllAsTouched();

    // Validar manualmente los campos de sensores y activadores
    const sensoresValidos = this.sensores.every(s =>
      s.tipo_medicion && s.unidad && s.umbral_min !== null && s.umbral_max !== null
    );
    const activadoresValidos = this.activadores.every(a =>
      a.tipo && a.accion
    );

    if (this.dispositivoForm.valid && sensoresValidos && activadoresValidos) {
      // Prepara los datos para enviar, incluyendo sensores y activadores anidados
      const dataToSend = {
        ...this.dispositivo, // Incluye los datos del dispositivo principal
        sensores: this.sensores.map(s => ({
            tipo_medicion: s.tipo_medicion,
            unidad: s.unidad,
            umbral_min: parseFloat(s.umbral_min), // Asegúrate de enviar como número
            umbral_max: parseFloat(s.umbral_max), // Asegúrate de enviar como número
            activo: s.activo
        })),
        activadores: this.activadores.map(a => ({
            tipo: a.tipo,
            accion: a.accion
        }))
      };

      this.dispositivoService.crearDispositivoIoT(dataToSend).subscribe({
        next: (response) => {
          console.log('Dispositivo IoT completo registrado con éxito:', response);
          this.presentSuccessToastAndClearForm();
        },
        error: (error) => {
          console.error('Error al registrar dispositivo IoT completo:', error);
          let errorMessage = 'Error al registrar el dispositivo IoT.';
          if (error.error && typeof error.error === 'object') {
            for (const key in error.error) {
              if (error.error.hasOwnProperty(key)) {
                // Si el error es un array (ej. de una lista anidada), únete
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
    } else {
      this.presentToast('Por favor, completa todos los campos obligatorios y corrige los errores.', 'warning');
    }
  }

  // --- Funciones para Toasts (modificadas para la lógica de éxito) ---
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
      message: 'Dispositivo IoT y sus componentes registrados con éxito.',
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
      // Limpia el formulario y las listas de sensores/activadores
      this.dispositivoForm.resetForm({
        zona: null,
        tipo: '',
        latitud: null,
        longitud: null,
        activo: true
      });
      this.sensores = [{ // Reinicia a un sensor por defecto
        tipo_medicion: '', unidad: '', umbral_min: null, umbral_max: null, activo: true
      }];
      this.activadores = [{ // Reinicia a un activador por defecto
        tipo: '', accion: ''
      }];
      this.dispositivo.zona = null; // Para asegurar que el ion-select se reinicie
    });
  }
}
