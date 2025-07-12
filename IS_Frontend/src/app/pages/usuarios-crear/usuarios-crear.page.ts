import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../../services/usuario.service';
import { CommonModule } from '@angular/common';
import { IonicModule, ToastController } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-usuarios-crear',
  templateUrl: './usuarios-crear.page.html',
  styleUrls: ['./usuarios-crear.page.scss'],
  standalone: true,
  imports: [
    IonicModule,    // Módulo para componentes Ionic
    CommonModule,
    FormsModule     // Módulo para ngModel y formularios basados en plantillas
  ]
})
export class UsuariosCrearPage implements OnInit {
  // Objeto para almacenar los datos del nuevo usuario, con rol_id inicializado a null
  nuevoUsuario: any = {
    username: '',
    email: '',
    password: '',
    telefono: '',
    rol_id: null // Aquí guardamos el ID del rol seleccionado
  };

  // Array para almacenar los roles disponibles obtenidos del backend
  rolesDisponibles: any[] = [];

  constructor(
    private usuarioService: UsuarioService, // Servicio para interactuar con la API de usuarios
    private toastController: ToastController, // Para mostrar mensajes emergentes
    private router: Router // Para la navegación entre páginas
  ) { }

  ngOnInit() {
    // Cargar los roles disponibles cuando la página se inicializa
    this.loadRoles();
  }

  /**
   * Carga la lista de roles disponibles desde el servicio de usuario.
   * Muestra un toast en caso de error.
   */
  loadRoles() {
    this.usuarioService.getRoles().subscribe(data => {
      this.rolesDisponibles = data;
    }, error => {
      console.error('Error al cargar roles disponibles:', error);
      this.presentToast('Error al cargar opciones de rol.', 'danger');
    });
  }

  /**
   * Envía los datos del nuevo usuario al backend para su creación.
   * Realiza validaciones básicas y muestra toasts de éxito o error.
   */
  async createUsuario() {
    // Validación de campos obligatorios
    if (!this.nuevoUsuario.username || !this.nuevoUsuario.email || !this.nuevoUsuario.password || this.nuevoUsuario.rol_id === null) {
      await this.presentToast('Por favor, completa todos los campos obligatorios: Nombre de Usuario, Email, Contraseña y Rol.', 'warning');
      return;
    }

    // Llama al servicio para crear el usuario
    this.usuarioService.createUsuario(this.nuevoUsuario).subscribe(async response => {
      console.log('Usuario creado con éxito:', response);
      await this.presentToast('Usuario creado con éxito!', 'success');

      // Limpiar el formulario después de la creación exitosa
      this.nuevoUsuario = {
        username: '',
        email: '',
        password: '',
        telefono: '',
        rol_id: null // Resetea el ID del rol
      };

      // Redirigir a la lista de usuarios después de crear
      this.router.navigate(['/usuarios']);
    }, async error => {
      console.error('Error al crear usuario:', error);
      let errorMessage = 'Hubo un error al crear el usuario.';
      // Intenta extraer mensajes de error más específicos del backend
      if (error.error && typeof error.error === 'object') {
        for (const key in error.error) {
          if (error.error.hasOwnProperty(key)) {
            // Une los mensajes de error para cada campo
            errorMessage += `\n${key}: ${error.error[key].join(', ')}`;
          }
        }
      } else if (error.message) {
        errorMessage = error.message;
      }
      await this.presentToast(errorMessage, 'danger');
    });
  }

  /**
   * Muestra un mensaje Toast en la parte superior de la pantalla.
   * @param message El mensaje a mostrar.
   * @param color El color del toast (ej. 'success', 'danger', 'warning').
   */
  async presentToast(message: string, color: string = 'primary') {
    const toast = await this.toastController.create({
      message: message,
      duration: 3000, // Duración del toast en milisegundos
      color: color,
      position: 'top', // Posición en la pantalla
    });
    toast.present();
  }
}
