import { useVehicle } from '@/context/vehicleContext';
import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function AppHeader({ onMenuPress, onVehiclePress }) {
  const { activeVehicle } = useVehicle();

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={onMenuPress}>
        <Ionicons name="menu" size={26} color="#333" />
      </TouchableOpacity>

      <View style={styles.center}>
        <Text style={styles.greeting}>Hola de nuevo</Text>

        {activeVehicle && (
          <Text style={styles.vehicle}>
            {activeVehicle.plate} · {activeVehicle.brand} {activeVehicle.model}
          </Text>
        )}
      </View>

      <TouchableOpacity onPress={onVehiclePress}>
        <Ionicons name="bicycle-outline" size={26} color="#333" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 70,
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderColor: '#EEE',
  },
  center: {
    alignItems: 'center',
    flex: 1,
  },
  greeting: {
    fontSize: 14,
    color: '#666',
  },
  vehicle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111',
    marginTop: 2,
  },
});
