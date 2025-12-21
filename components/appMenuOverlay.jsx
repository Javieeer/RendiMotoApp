import { useAuth } from '@/context/authContext';
import { useVehicle } from '@/context/vehicleContext';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useEffect, useRef } from 'react';
import { Animated, Dimensions, Easing, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function AppMenuOverlay({ visible, onClose }) {

  const SCREEN_HEIGHT = Dimensions.get('window').height;
  const slideAnim = useRef(new Animated.Value(SCREEN_HEIGHT)).current;

  const { activeVehicle } = useVehicle();
  const { user, logout } = useAuth();

  /* Animate the menu */
  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: visible ? 0 : SCREEN_HEIGHT,
      duration: 260,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start();
  }, [visible]);

  /* Menu item component */
  const MenuItem = ({ icon, label, onPress, danger }) => (
    <TouchableOpacity
      onPress={onPress}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 14,
      }}
    >
      <Ionicons
        name={icon}
        size={22}
        color={danger ? '#E74C3C' : '#333'}
        style={{ width: 30 }}
      />
      <Text
        style={{
          fontSize: 16,
          fontWeight: '600',
          color: danger ? '#E74C3C' : '#333',
        }}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View pointerEvents={visible ? 'auto' : 'none'} style={StyleSheet.absoluteFill}>
      
      {/* FONDO */}
      <Animated.View
        style={[
          StyleSheet.absoluteFill,
          {
            backgroundColor: 'rgba(0,0,0,0.4)',
            opacity: slideAnim.interpolate({
              inputRange: [0, 300],
              outputRange: [1, 0],
            }),
          },
        ]}
      >
        <TouchableOpacity style={{ flex: 1 }} onPress={onClose} />
      </Animated.View>

      {/* PANEL */}
      <Animated.View
        style={[
          styles.panel,
          { transform: [{ translateY: slideAnim }] },
        ]}
      >
        <View>
          {/* HEADER */}
          <View style={{ marginBottom: 20 }}>
            <Text style={{ fontSize: 18, fontWeight: '700' }}>
              {user?.name ?? 'Usuario'}
            </Text>
            {activeVehicle ? (
              <Text style={styles.vehicle}>
                {activeVehicle.plate} · {activeVehicle.brand} {activeVehicle.model}
              </Text>
            ) : (
              <Text style={styles.vehiclePlaceholder}>
                Sin vehículo activo
              </Text>
            )}
          </View>

          <View style={{ height: 1, backgroundColor: '#EEE', marginVertical: 12 }} />

          {/* ACCIONES */}
          <MenuItem
            icon="swap-horizontal"
            label="Cambiar vehículo"
            onPress={() => {
              onClose();
              router.push('/select-vehicle');
            }}
          />

          <MenuItem
            icon="list"
            label="Ver todos los movimientos"
            onPress={() => {
              onClose();
              router.push('/movements');
            }}
          />

          <MenuItem
            icon="bar-chart"
            label="Reportes"
            onPress={() => {
              onClose();
              router.push('/reports');
            }}
          />

          <View style={{ height: 1, backgroundColor: '#EEE', marginVertical: 12 }} />

          {/* CONFIG */}
          <MenuItem
            icon="settings-outline"
            label="Configuración"
            onPress={() => {
              onClose();
            }}
          />

          <MenuItem
            icon="help-circle-outline"
            label="Ayuda"
            onPress={() => {
              onClose();
            }}
          />

          <View style={{ height: 1, backgroundColor: '#EEE', marginVertical: 12 }} />

          {/* LOGOUT */}
          <MenuItem
            icon="log-out-outline"
            label="Cerrar sesión"
            danger
            onPress={() => {
              onClose();
              logout();
            }}
          />
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  panel: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    minHeight: 260,
    backgroundColor: '#fff',
    padding: 24,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  vehiclePlaceholder: {
    fontSize: 14,
    color: '#999',
    fontStyle: 'italic',
  }
});
