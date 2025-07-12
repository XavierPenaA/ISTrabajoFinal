from django.db import models
from django.contrib.auth.models import AbstractUser
from django.contrib.contenttypes.fields import GenericForeignKey  # <--- ASEGÚRATE DE QUE ESTA LÍNEA ESTÉ AQUÍ
from django.contrib.contenttypes.models import ContentType  

# --- Roles disponibles en el sistema ---
ROLES = [
    ('ADMIN', 'Administrador'),
    ('SUPERVISOR', 'Supervisor de Planta'),
    ('TECNICO', 'Técnico de Mantenimiento'),
    ('ANALISTA', 'Analista de Datos'),
]


TIPOS_MEDICION = [
    ('CO2', 'CO₂'),
    ('PM25', 'Partículas PM2.5'),
    ('TEMP', 'Temperatura'),
    ('HUMEDAD', 'Humedad'),
]

# --- Modelo para Roles con Permisos Explícitos ---
class Rol(models.Model):
    nombre = models.CharField(max_length=50, unique=True)

    # Permisos generales de gestión (relacionados con usuarios/sistema)
    can_manage_users = models.BooleanField(default=False)      # Configura permisos, crea/elimina cuentas de usuario
    can_configure_system = models.BooleanField(default=False)  # Responsable de la configuración inicial y parámetros del sistema.

    # Permisos de monitoreo y operación de planta
    can_monitor_realtime = models.BooleanField(default=False)  # Monitorea estado de calidad del aire en tiempo real, ver diagnósticos
    can_activate_actuators = models.BooleanField(default=False) # Activar actuadores
    can_define_protocols = models.BooleanField(default=False)  # Definición de protocolos de emergencia
    can_receive_critical_alerts = models.BooleanField(default=False) # Recibe alertas críticas

    # Permisos de mantenimiento
    can_consult_device_history = models.BooleanField(default=False) # Consulta historial de dispositivos
    can_receive_maintenance_notifications = models.BooleanField(default=False) # Recibe notificaciones de fallos o mantenimientos
    can_verify_sensor_status = models.BooleanField(default=False) # Verifica estado general de sensores

    # Permisos de análisis de datos
    can_access_historical_data = models.BooleanField(default=False) # Accede a bases de datos históricas
    can_generate_reports = models.BooleanField(default=False)    # Genera gráficos, descarga reportes

    def __str__(self):
        return self.nombre
# --- Modifica tu modelo Usuario para que apunte a este nuevo modelo Rol ---
class Usuario(AbstractUser):
    telefono = models.CharField(max_length=20, blank=True)
    # 'rol' es una ForeignKey al modelo Rol
    rol = models.ForeignKey(Rol, on_delete=models.SET_NULL, null=True, blank=True, related_name='usuarios')


# --- Zonas dentro de la planta ---
class Zona(models.Model):
    nombre = models.CharField(max_length=100)
    peligro = models.CharField(max_length=100, blank=True)
    
    def __str__(self):
        return self.nombre

# --- Dispositivos conectados (gateway) ---
class DispositivoIoT(models.Model):
    zona = models.ForeignKey(Zona, on_delete=models.CASCADE, related_name='dispositivos')
    tipo = models.CharField(max_length=100)
    latitud = models.FloatField()
    longitud = models.FloatField()
    activo = models.BooleanField(default=True)
    fecha_registro = models.DateTimeField(auto_now_add=True) # Se establece una vez al crearse
    ultima_actualizacion = models.DateTimeField(auto_now=True) # Se actualiza en cada guardado

    def __str__(self):
        return f"{self.tipo} ({self.id})" 

# --- Sensores de un dispositivo ---
class Sensor(models.Model):
    dispositivo = models.ForeignKey(DispositivoIoT, on_delete=models.CASCADE, related_name='sensores')
    tipo_medicion = models.CharField(max_length=20, choices=TIPOS_MEDICION)
    unidad = models.CharField(max_length=20)
    umbral_min = models.FloatField()
    umbral_max = models.FloatField()
    activo = models.BooleanField(default=True)

# --- Activadores controlables ---
class Activador(models.Model):
    dispositivo = models.ForeignKey(DispositivoIoT, on_delete=models.CASCADE, related_name='activadores')
    tipo = models.CharField(max_length=100)
    accion = models.CharField(max_length=100)

# --- Mediciones periódicas registradas ---
class Medicion(models.Model):
    sensor = models.ForeignKey(Sensor, on_delete=models.CASCADE, related_name='mediciones')
    valor = models.FloatField()
    fecha = models.DateTimeField(auto_now_add=True)

class Mantenimiento(models.Model):
    content_type = models.ForeignKey(ContentType, on_delete=models.CASCADE)
    object_id = models.PositiveIntegerField()
    content_object = GenericForeignKey('content_type', 'object_id') # Campo virtual para acceder al objeto

    fecha_mantenimiento = models.DateField()
    tipo_mantenimiento = models.CharField(max_length=100)
    descripcion = models.TextField()
    duracion_horas = models.DecimalField(max_digits=5, decimal_places=2)
    tecnico_responsable = models.ForeignKey(Usuario, on_delete=models.SET_NULL, null=True, blank=True, related_name='mantenimientos_asignados')
    fecha_registro = models.DateTimeField(auto_now_add=True)
    ultima_actualizacion = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Mantenimiento de {self.content_object} ({self.content_type.model}) el {self.fecha_mantenimiento}"

    class Meta:
        verbose_name_plural = "Mantenimientos"
# --- Protocolos de emergencia ---
class ProtocoloEmergencia(models.Model):
    nombre = models.CharField(max_length=100)
    zona = models.ForeignKey(Zona, on_delete=models.CASCADE)
    sensores = models.ManyToManyField(Sensor)
    activadores = models.ManyToManyField(Activador)
    descripcion = models.TextField()
    creado_por = models.ForeignKey(Usuario, on_delete=models.SET_NULL, null=True, blank=True, related_name='protocolos_creados', limit_choices_to={'rol__nombre': 'Supervisor de Planta'})
    fecha_creacion = models.DateTimeField(auto_now_add=True)

# --- Logs de auditoría ---
class LogAuditoria(models.Model):
    usuario = models.ForeignKey(Usuario, on_delete=models.SET_NULL, null=True)
    accion = models.CharField(max_length=255)
    fecha = models.DateTimeField(auto_now_add=True)
