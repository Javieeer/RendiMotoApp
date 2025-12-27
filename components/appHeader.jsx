import { useAuth } from '@/context/authContext';
import { useMenu } from '@/context/menuContext';
import { useVehicle } from '@/context/vehicleContext';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';


export default function AppHeader() {

  const { user } = useAuth();
  const router = useRouter();
  const { openMenu } = useMenu();
  const { activeVehicle } = useVehicle();
  const insets = useSafeAreaInsets();

  const firstName = user?.name ? user.name.split(' ')[0] : 'Usuario';

  return (
    <View
      style={{
        height: insets.top + 70,
        backgroundColor: '#fff',
        paddingHorizontal: 16,
        paddingTop: insets.top + 12,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottomWidth: 1,
        borderColor: '#EEE',
      }}
    >
      <TouchableOpacity onPress={openMenu}>
        <Ionicons name="menu" size={26} color="#333" />
      </TouchableOpacity>

      <View style={styles.center}>
        <Text style={styles.greeting}>Hola de nuevo {firstName}</Text>
        {activeVehicle ? (
          <Text style={styles.vehicle}>
            Vehículo activo: {activeVehicle.plate} - {activeVehicle.brand} {activeVehicle.model}
          </Text>
        ) : (
          <Text style={styles.vehiclePlaceholder}>
            Sin vehículo activo
          </Text>
        )}
      </View>

      <TouchableOpacity onPress={() => router.push('/select-vehicle')}>
        <Ionicons name="bicycle-outline" size={26} color="#333" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  center: { alignItems: 'center', flex: 1 },
  greeting: { fontSize: 14, color: '#666' },
  vehicle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111',
    marginTop: 2,
  },
});
