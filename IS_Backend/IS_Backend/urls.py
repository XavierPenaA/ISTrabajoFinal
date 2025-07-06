from django.urls import path, include
from rest_framework.routers import DefaultRouter
from IS.views import (
    ContentTypeViewSet, RolViewSet, UsuarioViewSet, ZonaViewSet, DispositivoIoTViewSet, SensorViewSet,
    ActivadorViewSet, MedicionViewSet, MantenimientoViewSet,
    ProtocoloEmergenciaViewSet, LogAuditoriaViewSet
)

router = DefaultRouter()
router.register(r'contenttypes', ContentTypeViewSet, basename='contenttype')
router.register(r'usuarios', UsuarioViewSet)
router.register(r'zonas', ZonaViewSet)
router.register(r'dispositivos', DispositivoIoTViewSet)
router.register(r'sensores', SensorViewSet)
router.register(r'activadores', ActivadorViewSet)
router.register(r'mediciones', MedicionViewSet)
router.register(r'mantenimientos', MantenimientoViewSet)
router.register(r'protocolos', ProtocoloEmergenciaViewSet)
router.register(r'logs', LogAuditoriaViewSet)
router.register(r'roles', RolViewSet)

urlpatterns = [
    path('api/', include(router.urls)),
]
