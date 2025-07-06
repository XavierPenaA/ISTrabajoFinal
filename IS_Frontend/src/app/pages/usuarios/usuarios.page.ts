import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../../services/usuario.service';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router'; // Importar Router

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.page.html',
  styleUrls: ['./usuarios.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class UsuariosPage implements OnInit {
  usuarios: any[] = [];

  constructor(private usuarioService: UsuarioService, private router: Router) { } // Inyectar Router

  ngOnInit() {
    this.loadUsuarios();
  }

  // Recarga la lista cada vez que se entra a la página (por si hay cambios)
  ionViewWillEnter() {
    this.loadUsuarios();
  }

  loadUsuarios() {
    this.usuarioService.getUsuarios().subscribe(data => {
      this.usuarios = data;
    }, error => {
      console.error('Error al cargar usuarios:', error);
      // Podrías mostrar una alerta aquí
    });
  }

  goToModificarRol(userId: number) {
    this.router.navigate(['/modificar-rol', userId]); // Navega a la nueva página con el ID del usuario
  }
}
