import { Component, OnInit } from '@angular/core';
import { ZonaService } from '../../services/zona.service';
import { CommonModule } from '@angular/common'; // Importa CommonModule
import { IonicModule } from '@ionic/angular'; // Importa IonicModule
import { FormsModule } from '@angular/forms'; // Importa FormsModule

@Component({
  selector: 'app-zonas',
  templateUrl: './zonas.page.html',
  styleUrls: ['./zonas.page.scss'],
  standalone: true, // Asegúrate de que tu componente sea standalone o se importe correctamente
  imports: [IonicModule, CommonModule, FormsModule] // Añade CommonModule y FormsModule aquí
})
export class ZonasPage implements OnInit {
  zonas: any[] = [];
  nuevaZona: any = { nombre: '', peligro: '' };

  constructor(private zonaService: ZonaService) { }

  ngOnInit() {
    this.loadZonas();
  }

  loadZonas() {
    this.zonaService.getZonas().subscribe((data: any[]) => {
      this.zonas = data;
    }, (error: any) => {
      console.error('Error al cargar zonas:', error);
      // Aquí podrías mostrar una alerta al usuario
    });
  }

  addZona() {
    this.zonaService.createZona(this.nuevaZona).subscribe((response: any) => {
      console.log('Zona creada:', response);
      this.nuevaZona = { nombre: '', peligro: '' }; // Limpiar formulario
      this.loadZonas(); // Recargar la lista de zonas
    }, (error: any) => {
      console.error('Error al crear zona:', error);
      // Aquí podrías mostrar una alerta al usuario
    });
  }

  deleteZona(id: number) {
    this.zonaService.deleteZona(id).subscribe(() => {
      console.log('Zona eliminada.');
      this.loadZonas(); // Recargar la lista de zonas
    }, error => {
      console.error('Error al eliminar zona:', error);
      // Aquí podrías mostrar una alerta al usuario
    });
  }
}
