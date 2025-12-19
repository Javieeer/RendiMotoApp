import { useRouter } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function CreateVehicleScreen() {
  const router = useRouter();

  return (
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
        onPress={() => router.replace('/home')}
        style={{ marginTop: 16 }}
      >
        <Text style={styles.link}>Volver al inicio</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
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
});
