import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UsuarioService } from '../../services/usuario.service';
import { CommonModule } from '@angular/common';
import { IonicModule, ToastController } from '@ionic/angular'; // Asegúrate de importar ToastController
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-modificar-rol',
  templateUrl: './modificar-rol.page.html',
  styleUrls: ['./modificar-rol.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class ModificarRolPage implements OnInit {
  userId: number | null = null;
  usuario: any;
  selectedRolId: number | null = null;

  rolesDisponibles: any[] = [];
  currentSelectedRol: any = {};
  currentSelectedRolHasPermissions: boolean = false;

  constructor(
    private activatedRoute: ActivatedRoute,
    private usuarioService: UsuarioService,
    private router: Router,
    private toastController: ToastController // Inyectado aquí
  ) { }

  ngOnInit() {
    this.loadRoles();
    this.activatedRoute.paramMap.subscribe(params => {
      const idParam = params.get('id');
      if (idParam) {
        this.userId = +idParam;
        this.loadUsuarioDetails();
      } else {
        console.error('No se proporcionó ID de usuario.');
        this.router.navigate(['/usuarios']);
      }
    });
  }

  loadRoles() {
    this.usuarioService.getRoles().subscribe(data => {
      this.rolesDisponibles = data;
    }, error => {
      console.error('Error al cargar roles disponibles:', error);
      this.presentToast('Error al cargar opciones de rol.', 'danger'); // Mensaje de error usa el toast básico
    });
  }

  loadUsuarioDetails() {
    if (this.userId) {
      this.usuarioService.getUsuarioById(this.userId).subscribe(data => {
        this.usuario = data;
        if (this.usuario.rol && this.usuario.rol.id) {
          this.selectedRolId = this.usuario.rol.id;
          // Asegúrate de que rolesDisponibles ya esté cargado antes de buscar
          if (this.rolesDisponibles.length > 0) {
            this.currentSelectedRol = this.rolesDisponibles.find(r => r.id === this.selectedRolId) || {};
            this.updatePermissionsDisplay();
          } else {
            // Si los roles aún no se han cargado, espera y luego actualiza
            // Esto podría manejarse con un Promise.all o similar si fuera más complejo
            // pero para este caso simple, confiar en que loadRoles ya ha iniciado la carga es suficiente.
            // Opcional: una pequeña espera o un refetch si es crucial para la UX
            this.usuarioService.getRoles().subscribe(rolesData => {
              this.rolesDisponibles = rolesData;
              this.currentSelectedRol = this.rolesDisponibles.find(r => r.id === this.selectedRolId) || {};
              this.updatePermissionsDisplay();
            });
          }
        }
      }, error => {
        console.error('Error al cargar detalles del usuario:', error);
        this.presentToast('Error al cargar detalles del usuario.', 'danger');
        this.router.navigate(['/usuarios']);
      });
    }
  }

  onRolChange() {
    this.currentSelectedRol = this.rolesDisponibles.find(r => r.id === this.selectedRolId) || {};
    this.updatePermissionsDisplay();
  }

  updatePermissionsDisplay() {
    this.currentSelectedRolHasPermissions =
      this.currentSelectedRol.can_manage_users ||
      this.currentSelectedRol.can_configure_system ||
      this.currentSelectedRol.can_monitor_realtime ||
      this.currentSelectedRol.can_activate_actuators ||
      this.currentSelectedRol.can_define_protocols ||
      this.currentSelectedRol.can_receive_critical_alerts ||
      this.currentSelectedRol.can_consult_device_history ||
      this.currentSelectedRol.can_receive_maintenance_notifications ||
      this.currentSelectedRol.can_verify_sensor_status ||
      this.currentSelectedRol.can_access_historical_data ||
      this.currentSelectedRol.can_generate_reports;
  }

  async confirmarModificacion() {
    if (!this.usuario || this.selectedRolId === null) {
      this.presentToast('No se ha seleccionado un rol o usuario.', 'warning');
      return;
    }

    this.usuarioService.updateUsuario(this.userId!, this.selectedRolId).subscribe(async response => {
      console.log('Usuario actualizado:', response);
      // Llama a la función de toast con los parámetros para el mensaje de éxito
      await this.presentSuccessToastAndRedirect();

    }, async error => {
      console.error('Error al actualizar rol:', error);
      let errorMessage = 'Error al actualizar el rol.';
      if (error.error && typeof error.error === 'object') {
        for (const key in error.error) {
          if (error.error.hasOwnProperty(key)) {
            errorMessage += `\n${key}: ${error.error[key].join(', ')}`;
          }
        }
      } else if (error.message) {
        errorMessage = error.message;
      }
      await this.presentToast(errorMessage, 'danger'); // Mensaje de error usa el toast básico
    });
  }

  cancelar() {
    this.router.navigate(['/usuarios']);
  }

  /**
   * Muestra un mensaje Toast con opciones personalizadas.
   * @param message El mensaje a mostrar.
   * @param color El color del toast.
   * @param icon El nombre del icono Ionic.
   * @param duration Duración del toast. Si es 0, no se cierra automáticamente.
   * @param buttons Botones del toast.
   */
  async presentToast(message: string, color: string = 'primary', icon?: string, duration: number = 3000, buttons?: any[]) {
    const toast = await this.toastController.create({
      message: message,
      duration: duration,
      color: color,
      position: 'top',
      icon: icon, // Añade el icono si se proporciona
      buttons: buttons // Añade los botones si se proporcionan
    });
    toast.present();
    return toast; // Retorna la instancia del toast por si necesitas interactuar con ella
  }

  /**
   * Muestra el toast de éxito personalizado y redirige después de que se cierre.
   */
  async presentSuccessToastAndRedirect() {
    const toast = await this.presentToast(
      'Cambio Realizado con Éxito. El rol ha sido actualizado correctamente.',
      'success',
      'checkmark-circle-outline', // Icono de verificación
      3000, // Duración de 3 segundos
      [
        {
          text: 'X', // Texto del botón de cierre
          role: 'cancel', // Rol para indicar que es un botón de cierre
          handler: () => {
            console.log('Toast dismissed');
          }
        }
      ]
    );

    // Cuando el toast se cierre (ya sea por duración o por el botón 'X'), redirige.
    // el método 'onDidDismiss' retorna una promesa que se resuelve cuando el toast se cierra.
    toast.onDidDismiss().then(() => {
      this.router.navigate(['/usuarios']);
    });
  }
}
