from rest_framework import viewsets
from .models import (
    Rol, Usuario, Zona, DispositivoIoT, Sensor, Activador,
    Medicion, Mantenimiento, ProtocoloEmergencia, LogAuditoria
)
from .serializers import (
    RolSerializer, UsuarioSerializer, ZonaSerializer, DispositivoIoTSerializer, SensorSerializer,
    ActivadorSerializer, MedicionSerializer, MantenimientoSerializer,
    ProtocoloEmergenciaSerializer, LogAuditoriaSerializer
)

class UsuarioViewSet(viewsets.ModelViewSet):
    queryset = Usuario.objects.all()
    serializer_class = UsuarioSerializer

class ZonaViewSet(viewsets.ModelViewSet):
    queryset = Zona.objects.all()
    serializer_class = ZonaSerializer

class DispositivoIoTViewSet(viewsets.ModelViewSet):
    queryset = DispositivoIoT.objects.all()
    serializer_class = DispositivoIoTSerializer

class SensorViewSet(viewsets.ModelViewSet):
    queryset = Sensor.objects.all()
    serializer_class = SensorSerializer

class ActivadorViewSet(viewsets.ModelViewSet):
    queryset = Activador.objects.all()
    serializer_class = ActivadorSerializer

class MedicionViewSet(viewsets.ModelViewSet):
    queryset = Medicion.objects.all()
    serializer_class = MedicionSerializer

class MantenimientoViewSet(viewsets.ModelViewSet):
    queryset = Mantenimiento.objects.all()
    serializer_class = MantenimientoSerializer

class ProtocoloEmergenciaViewSet(viewsets.ModelViewSet):
    queryset = ProtocoloEmergencia.objects.all()
    serializer_class = ProtocoloEmergenciaSerializer

class LogAuditoriaViewSet(viewsets.ModelViewSet):
    queryset = LogAuditoria.objects.all()
    serializer_class = LogAuditoriaSerializer
class RolViewSet(viewsets.ModelViewSet):
    queryset = Rol.objects.all()
    serializer_class = RolSerializer