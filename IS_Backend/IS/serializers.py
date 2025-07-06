from rest_framework import serializers
from .models import (
    Usuario, Zona, DispositivoIoT, Sensor, Activador, Rol,
    Medicion, Mantenimiento, ProtocoloEmergencia, LogAuditoria
)

# --- Nuevo Serializer para el modelo Rol ---
# my_app/serializers.py
from rest_framework import serializers
from .models import Usuario, Rol # Asegúrate de que Rol esté importado

class RolSerializer(serializers.ModelSerializer):
    class Meta:
        model = Rol
        fields = '__all__'

class UsuarioSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=False)

    # Este campo 'rol' es para la SALIDA (GET requests):
    # Cuando un usuario es recuperado, Django devolverá el objeto Rol anidado.
    # No es para la entrada.
    rol = RolSerializer(read_only=True)

    # Este es el campo que se usará para la ENTRADA (POST, PUT, PATCH):
    # Se llama 'rol_id' aquí en el serializer para distinguirlo del campo 'rol' de salida.
    # Utiliza PrimaryKeyRelatedField para mapear el ID de un Rol.
    # El 'source='rol'' es CRUCIAL: le dice a DRF que este campo 'rol_id' del serializer
    # se mapea al campo 'rol' del MODELO Usuario.
    # 'write_only=True' asegura que solo se use para entrada.
    # 'required=True' asegura que sea obligatorio al crear.
    rol_id = serializers.PrimaryKeyRelatedField(
        queryset=Rol.objects.all(), # Todos los objetos Rol válidos
        source='rol',              # Mapea al campo 'rol' del modelo Usuario
        write_only=True,           # Solo para escritura (POST, PUT, PATCH)
        required=True              # ¡Es obligatorio!
    )

    class Meta:
        model = Usuario
        # Incluye 'rol_id' para la entrada, 'rol' para la salida
        fields = ['id', 'username', 'email', 'telefono', 'password', 'rol', 'rol_id']
        # 'extra_kwargs' es opcional, pero puede ayudar a asegurar el 'required'
        extra_kwargs = {
            'password': {'write_only': True, 'required': False}, # Password puede no ser requerido en updates
            'rol_id': {'required': True} # Asegura que rol_id es requerido para POST/PUT
        }


    # Los métodos create y update NO necesitan hacer .pop() del 'rol_id'
    # ni buscar el objeto Rol si se usa PrimaryKeyRelatedField con source='rol'.
    # DRF lo manejará automáticamente.

    def create(self, validated_data):
        # PrimaryKeyRelatedField con source='rol' ya ha transformado 'rol_id'
        # en el objeto Rol y lo ha puesto en validated_data bajo la clave 'rol'.
        # Por lo tanto, no necesitamos un .pop('rol_id') y luego buscar el objeto.
        # validated_data ya contendrá el objeto Rol asignado a 'rol'.

        password = validated_data.pop('password', None)
        user = Usuario.objects.create(**validated_data) # 'rol' ya será el objeto Rol aquí

        if password is not None:
            user.set_password(password)

        user.save()
        return user

    def update(self, instance, validated_data):
        # Similar para update: 'rol' en validated_data ya será el objeto Rol
        # si 'rol_id' fue enviado.

        password = validated_data.pop('password', None)

        instance.username = validated_data.get('username', instance.username)
        instance.email = validated_data.get('email', instance.email)
        instance.telefono = validated_data.get('telefono', instance.telefono)
        # DRF automáticamente actualiza instance.rol si 'rol' está en validated_data
        # y viene del rol_id del serializer.

        if password is not None:
            instance.set_password(password)

        instance.save()
        return instance

# --- Zona ---
class ZonaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Zona
        fields = '__all__'

# --- DispositivoIoT ---
class DispositivoIoTSerializer(serializers.ModelSerializer):
    class Meta:
        model = DispositivoIoT
        fields = '__all__'

# --- Sensor ---
class SensorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Sensor
        fields = '__all__'

# --- Activador ---
class ActivadorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Activador
        fields = '__all__'

# --- Medición ---
class MedicionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Medicion
        fields = '__all__'

# --- Mantenimiento ---
class MantenimientoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Mantenimiento
        fields = '__all__'

# --- Protocolo de Emergencia ---
class ProtocoloEmergenciaSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProtocoloEmergencia
        fields = '__all__'

# --- Log de Auditoría ---
class LogAuditoriaSerializer(serializers.ModelSerializer):
    class Meta:
        model = LogAuditoria
        fields = '__all__'
