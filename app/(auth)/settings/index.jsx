import AppHeader from '@/components/appHeader';
import { useVehicle } from '@/context/vehicleContext';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function SettingsScreen() {

  const { activeVehicle } = useVehicle();

  /* Componente de tarjeta de configuración */
  const SettingCard = ({ icon, title, subtitle, onPress }) => (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={styles.iconContainer}>
        <Ionicons name={icon} size={26} color="#3498DB" />
      </View>

      <View style={{ flex: 1 }}>
        <Text style={styles.cardTitle}>{title}</Text>
        <Text style={styles.cardSubtitle}>{subtitle}</Text>
      </View>

      <Ionicons
        name="chevron-forward"
        size={20}
        color="#999"
      />
    </TouchableOpacity>
  );

  return (
    <>
      <AppHeader title="Configuración" />

      <View style={styles.container}>

        {/* 🚗 EDITAR VEHÍCULO */}
        <SettingCard
          icon="car-outline"
          title="Editar vehículo"
          subtitle={
            activeVehicle
              ? `${activeVehicle.plate} · ${activeVehicle.brand} ${activeVehicle.model}`
              : 'No hay vehículo activo'
          }
          onPress={() => {
            if (!activeVehicle) return;
            router.push('/settings/vehicle');
          }}
        />

        {/* 👤 EDITAR PERFIL */}
        <SettingCard
          icon="person-outline"
          title="Editar perfil"
          subtitle="Actualiza tu información personal"
          onPress={() => router.push('/settings/profile')}
        />

        {/* 📊 RANGO POR DEFECTO */}
        <SettingCard
          icon="bar-chart-outline"
          title="Rango por defecto"
          subtitle="Define cómo se muestran tus reportes"
          onPress={() => router.push('/settings/reports')}
        />

      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F3EE',
    padding: 24,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 14,
    marginBottom: 14,
    elevation: 2,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#EAF3FB',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
  },
  cardSubtitle: {
    fontSize: 13,
    color: '#777',
    marginTop: 2,
  },
});
