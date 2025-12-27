import { useVehicle } from '@/context/vehicleContext';
import { useRouter } from 'expo-router';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function SelectVehicleScreen() {
  
  const { vehicles, selectVehicle } = useVehicle();
  const router = useRouter();

  /* Función para seleccionar un vehículo */
  const handleSelectVehicle = async (vehicle) => {
    await selectVehicle(vehicle);
    router.replace('/home');
  };

  return (
    <View style={styles.root}>
      {/* CONTENIDO */}
      <View style={styles.container}>
        <Text style={styles.title}>
          Selecciona un vehículo
        </Text>

        <FlatList
          data={vehicles}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={{
                padding: 16,
                backgroundColor: '#fff',
                borderRadius: 8,
                marginBottom: 12,
              }}
              onPress={() => handleSelectVehicle(item)}
            >
              <Text style={{ fontWeight: '600' }}>
                {item.plate} · {item.brand} {item.model}
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>
      {/* FOOTER */}
      <View style={styles.footer}>
        <TouchableOpacity
            onPress={() => router.push('/vehicles/form')}
            style={{
              padding: 14,
              borderRadius: 8,
              backgroundColor: '#E5E7EB',
              alignItems: 'center',
            }}
          >
            <Text style={{ fontWeight: '600' }}>
              ➕ Agregar otro vehículo
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
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    marginTop: 50,
    marginBottom: 12,
    textAlign: 'center',
  },
  footer: {
    padding: 24,
    paddingBottom: 32, 
  },
});
