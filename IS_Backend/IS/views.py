from rest_framework.response import Response # <--- This is the correct import for Response object

from rest_framework import viewsets
from rest_framework.decorators import action 
# ¡AÑADE ESTA LÍNEA!
from django.contrib.contenttypes.models import ContentType  
from django_filters import rest_framework as filters
from django_filters.rest_framework import DjangoFilterBackend
from .models import (
    Rol, Usuario, Zona, DispositivoIoT, Sensor, Activador,
    Medicion, Mantenimiento, ProtocoloEmergencia, LogAuditoria
)
from .serializers import (
    ContentTypeSerializer, RolSerializer, UsuarioSerializer, ZonaSerializer, DispositivoIoTSerializer, SensorSerializer,
    ActivadorSerializer, MedicionSerializer, MantenimientoSerializer,
    ProtocoloEmergenciaSerializer, LogAuditoriaSerializer
)

class UsuarioViewSet(viewsets.ModelViewSet):
    queryset = Usuario.objects.all()
    serializer_class = UsuarioSerializer

    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['rol', 'rol__nombre', 'username', 'email'] 
class ZonaViewSet(viewsets.ModelViewSet): 
    queryset = Zona.objects.all()
    serializer_class = ZonaSerializer

class DispositivoIoTViewSet(viewsets.ModelViewSet):
    queryset = DispositivoIoT.objects.all()
    serializer_class = DispositivoIoTSerializer
    filter_backends = [DjangoFilterBackend] 
    filterset_fields = ['zona']

class SensorViewSet(viewsets.ModelViewSet):
    queryset = Sensor.objects.all()
    serializer_class = SensorSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['dispositivo'] 
class ActivadorViewSet(viewsets.ModelViewSet):
    queryset = Activador.objects.all()
    serializer_class = ActivadorSerializer
    filter_backends = [DjangoFilterBackend] 
    filterset_fields = ['dispositivo'] 
class ProtocoloEmergenciaViewSet(viewsets.ModelViewSet):
    queryset = ProtocoloEmergencia.objects.all()
    serializer_class = ProtocoloEmergenciaSerializer


class MedicionFilter(filters.FilterSet):
    sensor_id = filters.NumberFilter(field_name='sensor__id')
    tipo_medicion = filters.CharFilter(field_name='sensor__tipo_medicion')
    start_date = filters.DateTimeFilter(field_name="fecha", lookup_expr='gte')
    end_date = filters.DateTimeFilter(field_name="fecha", lookup_expr='lte')

    class Meta:
        model = Medicion
        fields = ['sensor_id', 'tipo_medicion', 'start_date', 'end_date']


class MedicionViewSet(viewsets.ModelViewSet):
    queryset = Medicion.objects.all().order_by('fecha')
    serializer_class = MedicionSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_class = MedicionFilter

    @action(detail=False, methods=['get'], url_path='tipos-medicion')
    def get_tipos_medicion(self, request):
        tipos = Sensor.objects.values_list('tipo_medicion', flat=True).distinct()
        return Response(list(tipos))
class MantenimientoViewSet(viewsets.ModelViewSet):
    queryset = Mantenimiento.objects.all()
    serializer_class = MantenimientoSerializer


class LogAuditoriaViewSet(viewsets.ModelViewSet):
    queryset = LogAuditoria.objects.all()
    serializer_class = LogAuditoriaSerializer
class RolViewSet(viewsets.ModelViewSet):
    queryset = Rol.objects.all()
    serializer_class = RolSerializer

class ContentTypeViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = ContentType.objects.all()
    serializer_class = ContentTypeSerializer
    def get_queryset(self):
        queryset = super().get_queryset()
        model_name = self.request.query_params.get('model', None)
        if model_name is not None:
            queryset = queryset.filter(model=model_name.lower())
        return queryset
    
