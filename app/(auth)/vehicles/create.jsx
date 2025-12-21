import { useAuth } from '@/context/authContext';
import { useVehicle } from '@/context/vehicleContext';
import { useRouter } from 'expo-router';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function CreateVehicleScreen() {

  const router = useRouter();
  const { vehicles, vehiclesLoaded } = useVehicle();
  const { logout } = useAuth();

  /* Volver a la pantalla principal */
  const handleBackHome = () => {
    if (!vehiclesLoaded) return;

    if (vehicles.length > 0) {
      router.replace('/home');
    } else {
      Alert.alert(
        'Vehículo requerido',
        'Debes registrar al menos un vehículo para poder continuar.'
      );
    }
  };

  return (
    <View style={styles.root}>
      {/* CONTENIDO */}
      <View style={styles.container}>
        <Text style={styles.title}>Registra tu vehículo</Text>

        <Text style={styles.subtitle}>
          Para empezar necesitas al menos un vehículo asociado a tu cuenta.
        </Text>

        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            // luego iremos al formulario real
            console.log('Ir a formulario de vehículo');
          }}
        >
          <Text style={styles.buttonText}>Agregar vehículo</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => handleBackHome()}
          style={{ marginTop: 16 }}
        >
          <Text style={styles.link}>Volver al inicio</Text>
        </TouchableOpacity>
      </View>

      {/* FOOTER */}
      <View style={styles.footer}>
        <TouchableOpacity
          onPress={() =>
            Alert.alert(
              'Cerrar sesión',
              '¿Seguro que deseas cerrar sesión?',
              [
                { text: 'Cancelar', style: 'cancel' },
                {
                  text: 'Cerrar sesión',
                  style: 'destructive',
                  onPress: logout,
                },
              ]
            )
          }
          style={styles.buttonLogOut}
        >
          <Text style={[styles.buttonLogOutText]}>
            Cerrar sesión
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#F3F3EE',
  },
  container: {
    flex: 1,
    backgroundColor: '#F3F3EE',
    padding: 24,
    justifyContent: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 15,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
  },
  button: {
    backgroundColor: '#2ECC71',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonLogOut: {  
    backgroundColor: '#E74C3C',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 32,
  },
  buttonLogOutText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  link: {
    textAlign: 'center',
    color: '#3498DB',
    fontSize: 14,
  },
  footer: {
    padding: 24,
    paddingBottom: 32, // 👈 aire visual abajo
  },
});
