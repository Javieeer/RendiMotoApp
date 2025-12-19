import { useVehicle } from '@/context/vehicleContext';
import { useRouter } from 'expo-router';
import { FlatList, Text, TouchableOpacity, View } from 'react-native';

export default function SelectVehicleScreen() {
  const { vehicles, selectVehicle } = useVehicle();
  const router = useRouter();

  const handleSelectVehicle = async (vehicle) => {
    await selectVehicle(vehicle);
    router.replace('/home');
  };

  return (
    <View style={{ padding: 24 }}>
      <Text style={{ fontSize: 20, fontWeight: '700', marginBottom: 16 }}>
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
  );
}
