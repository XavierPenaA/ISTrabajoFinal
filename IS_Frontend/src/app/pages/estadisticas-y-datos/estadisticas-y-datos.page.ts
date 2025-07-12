// src/app/pages/estadisticas-y-datos/estadisticas-y-datos.page.ts

import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, NavController, ToastController } from '@ionic/angular';
import { ZonaService } from '../../services/zona.service';
import { DispositivoService } from '../../services/dispositivo.service';
import { SensorService } from '../../services/sensor.service';
import { MedicionService } from '../../services/medicion.service';
import { Zona } from '../../models/zona.model';
import { DispositivoIoT } from '../../models/dispositivo-iot.model';
import { Sensor } from '../../models/sensor.model';
import { Medicion } from '../../models/medicion.model';

// --- Importaciones para Gráficos ---
import { Chart, ChartConfiguration, ChartData, ChartEvent, ChartType, registerables } from 'chart.js'; // Importa 'Chart' y 'registerables'
import { BaseChartDirective } from 'ng2-charts';

// ¡Mantenemos esta importación! Es crucial.
import 'chartjs-adapter-date-fns';


Chart.register(...registerables);


@Component({
  selector: 'app-estadisticas-y-datos',
  templateUrl: './estadisticas-y-datos.page.html',
  styleUrls: ['./estadisticas-y-datos.page.scss'],
  standalone: true,
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    BaseChartDirective
  ]
})
export class EstadisticasYDatosPage implements OnInit {

  @ViewChild(BaseChartDirective) chart?: BaseChartDirective;

  selectedZoneId: number | null = null;
  selectedDeviceId: number | null = null;
  selectedTipoMedicion: string | null = null;
  selectedSensorId: number | null = null;
  selectedDate: string = new Date().toISOString();

  zonas: Zona[] = [];
  dispositivos: DispositivoIoT[] = [];
  sensores: Sensor[] = [];
  tiposMedicion: string[] = [];

  medicionesResult: Medicion[] = [];
  maxMedicion: number | null = null;
  minMedicion: number | null = null;
  avgMedicion: number | null = null;
  stdDevMedicion: number | null = null;

  public lineChartType: ChartType = 'line';

  public lineChartData: ChartData<'line'> = {
    labels: [],
    datasets: [
      {
        data: [],
        label: 'Valor de Medición',
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        borderColor: 'rgba(54, 162, 235, 1)',
        pointBackgroundColor: '#36A2EB',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: '#36A2EB',
        fill: 'origin',
      }
    ]
  };

  public lineChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      title: {
        display: true,
        text: 'Tendencia de Mediciones'
      },
    },
    scales: {
      x: {
        type: 'time', // <-- Aquí es donde se usa la escala 'time'
        time: {
          unit: 'hour', // or 'day', 'minute' depending on data density
          displayFormats: {
            hour: 'MMM dd, HH:mm',
            day: 'MMM dd'
          },
          tooltipFormat: 'yyyy-MM-dd HH:mm'
        },
        title: {
          display: true,
          text: 'Fecha y Hora'
        }
      },
      y: {
        title: {
          display: true,
          text: 'Valor'
        },
        min: 0
      }
    }
  };

  constructor(
    private navCtrl: NavController,
    private toastController: ToastController,
    private zonaService: ZonaService,
    private dispositivoService: DispositivoService,
    private sensorService: SensorService,
    private medicionService: MedicionService
  ) { }

  ngOnInit() {
    this.loadZonas();
    this.loadTiposMedicion();
  }

  loadZonas() {
    this.zonaService.getZonas().subscribe({
      next: (data: Zona[]) => {
        this.zonas = data;
        console.log('Zonas cargadas:', this.zonas);
      },
      error: (error: any) => {
        console.error('Error al cargar zonas:', error);
        this.presentToast('Error al cargar zonas.', 'danger');
      }
    });
  }

  loadTiposMedicion() {
    this.medicionService.getTiposMedicion().subscribe({
      next: (data: string[]) => {
        this.tiposMedicion = data;
        console.log('Tipos de medición cargados:', this.tiposMedicion);
      },
      error: (error: any) => {
        console.error('Error al cargar tipos de medición:', error);
        this.presentToast('Error al cargar tipos de medición.', 'danger');
      }
    });
  }

  onZoneChange() {
    this.dispositivos = [];
    this.sensores = [];
    this.selectedDeviceId = null;
    this.selectedSensorId = null;
    if (this.selectedZoneId) {
      this.dispositivoService.getDispositivosByZone(this.selectedZoneId).subscribe({
        next: (data: DispositivoIoT[]) => {
          this.dispositivos = data;
          console.log('Dispositivos cargados para zona', this.selectedZoneId, ':', this.dispositivos);
        },
        error: (error: any) => {
          console.error('Error al cargar dispositivos por zona:', error);
          this.presentToast('Error al cargar dispositivos.', 'danger');
        }
      });
    }
  }

  onDeviceChange() {
    this.sensores = [];
    this.selectedSensorId = null;
    if (this.selectedDeviceId) {
      this.sensorService.getSensoresByDispositivo(this.selectedDeviceId).subscribe({
        next: (data: Sensor[]) => {
          console.log('Sensores cargados para dispositivo', this.selectedDeviceId, ':', data);
          if (this.selectedTipoMedicion) {
            this.sensores = data.filter((s: Sensor) => s.tipo_medicion === this.selectedTipoMedicion);
            console.log('Sensores filtrados por tipo', this.selectedTipoMedicion, ':', this.sensores);
          } else {
            this.sensores = data;
          }
        },
        error: (error: any) => {
          console.error('Error al cargar sensores por dispositivo:', error);
          this.presentToast('Error al cargar sensores.', 'danger');
        }
      });
    }
  }

  onTipoMedicionChange() {
    if (this.selectedDeviceId) {
      this.onDeviceChange();
    }
    this.selectedSensorId = null;
  }

  async realizarConsulta() {
    this.resetStats();

    console.log('Iniciando consulta con:', {
      zone: this.selectedZoneId,
      device: this.selectedDeviceId,
      type: this.selectedTipoMedicion,
      sensor: this.selectedSensorId,
      date: this.selectedDate
    });


    if (!this.selectedZoneId || !this.selectedDeviceId || !this.selectedTipoMedicion || !this.selectedSensorId || !this.selectedDate) {
      this.presentToast('Por favor, selecciona Zona, Dispositivo, Tipo de Medición, Sensor y Fecha.', 'warning');
      return;
    }

    const formattedDate = this.selectedDate ? this.selectedDate.split('T')[0] : '';

    try {
      const startOfDay = `${formattedDate} 00:00:00`;
      const endOfDay = `${formattedDate} 23:59:59`;

      this.medicionService.getMedicionesFiltradas(
        this.selectedSensorId,
        this.selectedTipoMedicion,
        startOfDay,
        endOfDay
      ).subscribe({
        next: (data: Medicion[]) => {
          this.medicionesResult = data;
          console.log('Mediciones obtenidas:', this.medicionesResult);

          if (this.medicionesResult.length > 0) {
            const valores = this.medicionesResult.map(m => m.valor);
            this.maxMedicion = Math.max(...valores);
            this.minMedicion = Math.min(...valores);
            this.avgMedicion = valores.reduce((sum, val) => sum + val, 0) / valores.length;

            const mean = this.avgMedicion;
            const squareDiffs = valores.map(value => (value - mean!) ** 2);
            const avgSquareDiff = squareDiffs.reduce((sum, val) => sum + val, 0) / squareDiffs.length;
            this.stdDevMedicion = Math.sqrt(avgSquareDiff);

            this.updateChart();
            this.presentToast('Consulta realizada con éxito.', 'success');
          } else {
            this.presentToast('No se encontraron mediciones para los criterios seleccionados.', 'warning');
            this.resetStats();
          }
        },
        error: (error: any) => {
          console.error('Error al realizar la consulta de mediciones:', error);
          this.presentToast('Error al consultar mediciones. Asegúrate de que el backend esté funcionando y los filtros sean válidos.', 'danger');
          this.resetStats();
        }
      });

    } catch (error) {
      console.error('Error inesperado durante la configuración de la consulta:', error);
      this.presentToast('Error inesperado durante la configuración de la consulta.', 'danger');
    }
  }

  resetStats() {
    this.medicionesResult = [];
    this.maxMedicion = null;
    this.minMedicion = null;
    this.avgMedicion = null;
    this.stdDevMedicion = null;
    this.resetChartData();
  }

  resetChartData() {
    console.log('Reseteando datos del gráfico...');
    this.lineChartData.labels = [];
    this.lineChartData.datasets[0].data = [];
    this.chart?.update();
  }

  updateChart() {
    console.log('Actualizando gráfico...');
    console.log('Mediciones para el gráfico:', this.medicionesResult);

    if (!this.medicionesResult || this.medicionesResult.length === 0) {
      console.warn('No hay datos en medicionesResult para actualizar el gráfico.');
      this.resetChartData();
      return;
    }

    this.medicionesResult.sort((a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime());

    const labels = this.medicionesResult.map(m => new Date(m.fecha));
    const data = this.medicionesResult.map(m => m.valor);

    console.log('Labels para el gráfico:', labels);
    console.log('Data para el gráfico:', data);

    this.lineChartData.labels = labels;
    this.lineChartData.datasets[0].data = data;

    // Actualiza el título del gráfico de forma segura
    if (this.lineChartOptions?.plugins?.title) {
        this.lineChartOptions.plugins.title.text = `Tendencia de ${this.selectedTipoMedicion} para Sensor ${this.selectedSensorId}`;
    }


    if (this.chart) {
        this.chart.update();
        console.log('Gráfico actualizado con éxito.');
    } else {
        console.warn('BaseChartDirective (chart) no está disponible para actualizar.');
    }
  }

  public chartClicked({ event, active }: { event?: ChartEvent, active?: {}[] }): void {
    console.log('Chart Clicked:', event, active);
  }

  public chartHovered({ event, active }: { event?: ChartEvent, active?: {}[] }): void {
    console.log('Chart Hovered:', event, active);
  }

  async exportarDatos() {
    if (this.medicionesResult.length === 0) {
      this.presentToast('No hay datos para exportar.', 'warning');
      return;
    }

    const header = ['ID', 'Sensor ID', 'Valor', 'Fecha'];
    const rows = this.medicionesResult.map(m => [m.id, m.sensor, m.valor, m.fecha].join(','));
    const csvContent = "data:text/csv;charset=utf-8," + [header.join(','), ...rows].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `mediciones_${this.selectedSensorId}_${this.selectedDate.split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();

    this.presentToast('Datos exportados correctamente.', 'success');
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
