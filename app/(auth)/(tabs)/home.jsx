import AppHeader from '@/components/appHeader';
import BalanceCard from '@/components/balanceCard';
import MovementsList from '@/components/movementsList';
import { useVehicle } from '@/context/vehicleContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';

export default function HomeScreen() {
  const router = useRouter();
  const { activeVehicle } = useVehicle();

  const [movements, setMovements] = useState([]);
  const [balance, setBalance] = useState(null);
  const [loading, setLoading] = useState(true);

  const handleMenu = () => {
    console.log('Abrir menú');
  };

  const handleVehicleChange = () => {
    console.log('Cambiar vehículo');
    // luego: router.push('/select-vehicle')
  };

  useEffect(() => {
    if (!activeVehicle) return;

    let isMounted = true;

    const loadData = async () => {
      try {
        const token = await AsyncStorage.getItem('token');

        // 🔹 Movimientos
        const movementsRes = await fetch(
          `${process.env.EXPO_PUBLIC_API_URL}/movements/vehicle/${activeVehicle.id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const movementsJson = await movementsRes.json();

        if (!movementsRes.ok) {
          throw new Error(movementsJson.message || 'Error cargando movimientos');
        }

        // 🔹 Balance
        const balanceRes = await fetch(
          `${process.env.EXPO_PUBLIC_API_URL}/balance/vehicle/${activeVehicle.id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const balanceJson = await balanceRes.json();

        if (!balanceRes.ok) {
          throw new Error(balanceJson.message || 'Error cargando balance');
        }

        if (isMounted) {
          setMovements(movementsJson);
          setBalance(balanceJson);
        }
      } catch (e) {
        console.error('Error cargando home', e);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadData();

    return () => {
      isMounted = false;
    };
  }, [activeVehicle]);

  if (!activeVehicle) {
    return <Text>No hay vehículo activo</Text>;
  }

  if (loading) {
    return <ActivityIndicator size="large" />;
  }

  if (!balance) {
    return <Text>No se pudo cargar el balance</Text>;
  }

  const lastMovements = movements
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5);

  return (
    <>
      <AppHeader
        onMenuPress={handleMenu}
        onVehiclePress={handleVehicleChange}
      />
      <View style={{ padding: 16 }}>
        <View style={{ marginTop: 20 }}>
          <BalanceCard balance={balance} />
        </View>
        <View style={{ marginTop: 24 }}>
          <MovementsList movements={movements} />
        </View>
      </View>
    </>
  );
}
