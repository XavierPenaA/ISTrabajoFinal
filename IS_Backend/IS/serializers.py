from rest_framework import serializers
from .models import (
    Usuario, Zona, DispositivoIoT, Sensor, Activador, Rol,
    Medicion, Mantenimiento, ProtocoloEmergencia, LogAuditoria
)
from django.contrib.contenttypes.models import ContentType  
from rest_framework import serializers
from .models import Usuario, Rol

class RolSerializer(serializers.ModelSerializer):
    class Meta:
        model = Rol
        fields = '__all__'

class UsuarioSerializer(serializers.ModelSerializer):
    rol = serializers.PrimaryKeyRelatedField(queryset=Rol.objects.all(), write_only=True, allow_null=True, required=False)

    class Meta:
        model = Usuario
        fields = ['id', 'username', 'email', 'telefono', 'rol'] # Asegúrate que 'rol' esté en fields
        read_only_fields = ['id'] # 'id' es de solo lectura

    def to_representation(self, instance):
        # Esta función se llama cuando se serializa el objeto para una respuesta GET/LIST
        representation = super().to_representation(instance)
        # Reemplazamos el ID del rol con la representación completa del objeto Rol
        if instance.rol:
            representation['rol'] = RolSerializer(instance.rol).data
        else:
            representation['rol'] = None
        return representation

# --- Zona ---
class ZonaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Zona
        fields = '__all__'

class DispositivoIoTSerializer(serializers.ModelSerializer):
    zona_info = ZonaSerializer(source='zona', read_only=True)

    sensores = serializers.ListField(
        child=serializers.DictField(), # Usaremos DictField para validación manual o SensorSerializer si es más complejo
        write_only=True, # Estos campos solo se usan para la escritura (creación/actualización), no para la lectura
        required=False,
        allow_empty=True # Permite que no se envíen sensores al crear/actualizar
    )
    activadores = serializers.ListField(
        child=serializers.DictField(), # Usaremos DictField para validación manual o ActivadorSerializer si es más complejo
        write_only=True,
        required=False,
        allow_empty=True # Permite que no se envíen activadores
    )

    class Meta:
        model = DispositivoIoT
        fields = [
            'id', 'tipo', 'zona', 'zona_info', 'latitud', 'longitud', 'activo',
            'fecha_registro', 'ultima_actualizacion', 'sensores', 'activadores'
        ]
        read_only_fields = ['fecha_registro', 'ultima_actualizacion', 'zona_info']

    def create(self, validated_data):
        sensores_data = validated_data.pop('sensores', [])
        activadores_data = validated_data.pop('activadores', [])

        # Crea el DispositivoIoT primero
        dispositivo = DispositivoIoT.objects.create(**validated_data)

        # Crea los Sensores asociados
        for sensor_data in sensores_data:
            Sensor.objects.create(dispositivo=dispositivo, **sensor_data)

        # Crea los Activadores asociados
        for activador_data in activadores_data:
            Activador.objects.create(dispositivo=dispositivo, **activador_data)
        
        return dispositivo

    # --- MÉTODO UPDATE MODIFICADO PARA MANEJAR SERIALIZERS ANIDADOS ---
    def update(self, instance, validated_data):
    
        sensores_data = validated_data.pop('sensores', [])
        activadores_data = validated_data.pop('activadores', [])

        # Actualiza el DispositivoIoT
        instance.tipo = validated_data.get('tipo', instance.tipo)
        instance.zona = validated_data.get('zona', instance.zona)
        instance.latitud = validated_data.get('latitud', instance.latitud)
        instance.longitud = validated_data.get('longitud', instance.longitud)
        instance.activo = validated_data.get('activo', instance.activo)
        instance.save()

        if sensores_data: # Solo si se enviaron nuevos datos de sensores
            instance.sensores.all().delete()
            for sensor_data in sensores_data:
                Sensor.objects.create(dispositivo=instance, **sensor_data)
        
        if activadores_data: # Solo si se enviaron nuevos datos de activadores
            instance.activadores.all().delete()
            for activador_data in activadores_data:
                Activador.objects.create(dispositivo=instance, **activador_data)

        return instance

# --- Serializers para Sensor y Activador (para uso general y posible validación individual) ---
class SensorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Sensor
        fields = ['id', 'tipo_medicion', 'unidad', 'umbral_min', 'umbral_max', 'activo']

class ActivadorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Activador
        fields = ['id', 'tipo', 'accion']

class MedicionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Medicion
        fields = ['id', 'sensor', 'valor', 'fecha'] # 'sensor_details' si lo añades

class MantenimientoSerializer(serializers.ModelSerializer):
    dispositivo_info = DispositivoIoTSerializer(source='dispositivo', read_only=True)
    tecnico_responsable_info = UsuarioSerializer(source='tecnico_responsable', read_only=True)

    class Meta:
        model = Mantenimiento
        fields = [
            'id', 'dispositivo', 'dispositivo_info', 'fecha_mantenimiento',
            'tipo_mantenimiento', 'descripcion', 'duracion_horas',
            'tecnico_responsable', 'tecnico_responsable_info',
            'fecha_registro', 'ultima_actualizacion'
        ]
        read_only_fields = ['fecha_registro', 'ultima_actualizacion', 'dispositivo_info', 'tecnico_responsable_info']


class ProtocoloEmergenciaSerializer(serializers.ModelSerializer):
    zona_info = ZonaSerializer(source='zona', read_only=True)
    sensores_info = SensorSerializer(source='sensores', many=True, read_only=True) # Muestra detalles de sensores
    activadores_info = ActivadorSerializer(source='activadores', many=True, read_only=True) # Muestra detalles de activadores
    creado_por_info = UsuarioSerializer(source='creado_por', read_only=True) # Muestra detalles del usuario

    class Meta:
        model = ProtocoloEmergencia
        fields = [
            'id', 'nombre', 'zona', 'zona_info', 'sensores', 'sensores_info',
            'activadores', 'activadores_info', 'descripcion', 'creado_por',
            'creado_por_info', 'fecha_creacion'
        ]
        read_only_fields = ['fecha_creacion', 'zona_info', 'sensores_info', 'activadores_info', 'creado_por_info']



class MantenimientoSerializer(serializers.ModelSerializer):
    target_object = serializers.SerializerMethodField()

    content_type_id = serializers.PrimaryKeyRelatedField(
        queryset=ContentType.objects.all(),
        write_only=True,
        required=True,
        source='content_type' # Mapea al campo content_type del modelo
    )
    object_id = serializers.IntegerField(
        write_only=True,
        required=True
    )

    tecnico_responsable_username = serializers.CharField(source='tecnico_responsable.username', read_only=True)

    tecnico_responsable_id = serializers.PrimaryKeyRelatedField(
        queryset=Usuario.objects.filter(rol__nombre='Técnico de Mantenimiento'),
        source='tecnico_responsable',
        write_only=True,
        required=False,
        allow_null=True
    )

    class Meta:
        model = Mantenimiento
        fields = [
            'id',
            'content_type_id',     
            'object_id',           
            'target_object',       
            'fecha_mantenimiento',
            'tipo_mantenimiento',
            'descripcion',
            'duracion_horas',
            'tecnico_responsable_id',
            'tecnico_responsable_username',
            'fecha_registro',
            'ultima_actualizacion',
        ]
        read_only_fields = ['fecha_registro', 'ultima_actualizacion', 'target_object']

    def get_target_object(self, obj):
        """
        Retorna el serializer apropiado para el objeto relacionado.
        """
        if obj.content_object:
            if isinstance(obj.content_object, DispositivoIoT):
                return DispositivoIoTSerializer(obj.content_object).data
            elif isinstance(obj.content_object, Sensor):
                return SensorSerializer(obj.content_object).data
            elif isinstance(obj.content_object, Activador):
                return ActivadorSerializer(obj.content_object).data
        return None


class ContentTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContentType
        fields = '__all__'
class LogAuditoriaSerializer(serializers.ModelSerializer):
    class Meta:
        model = LogAuditoria
        fields = '__all__'

