import AppHeader from '@/components/appHeader';
import BalanceCard from '@/components/balanceCard';
import MovementsList from '@/components/movementsList';
import { useVehicle } from '@/context/vehicleContext';
import { daysUntil } from '@/utils/alerts';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Text, View } from 'react-native';

export default function HomeScreen() {

  const router = useRouter();
  const { activeVehicle, loadVehicles, vehiclesLoaded } = useVehicle();

  const [movements, setMovements] = useState([]);
  const [balance, setBalance] = useState(null);
  const [loading, setLoading] = useState(true);
  const [switchingVehicle, setSwitchingVehicle] = useState(false);

  useEffect(() => {
    const init = async () => {
      const token = await AsyncStorage.getItem('token');
      const deliveryId = await AsyncStorage.getItem('deliveryId');

      if (!deliveryId || !token) return;

      await loadVehicles(Number(deliveryId), token);
    };

    init();
  }, []);

  useEffect(() => {
    if (!vehiclesLoaded) return;

    if (vehiclesLoaded && !activeVehicle) {
      router.replace('/vehicles/create');
    }
  }, [vehiclesLoaded, activeVehicle]);

  useEffect(() => {
    if (!vehiclesLoaded || !activeVehicle) return;

    let isMounted = true;

    setLoading(true);
    setBalance(null);
    setMovements([]);

    const loadData = async () => {
      const currentVehicleId = activeVehicle.id;

      try {
        setSwitchingVehicle(true);
        const token = await AsyncStorage.getItem('token');
        if (!token) return;

        const [movementsRes, balanceRes] = await Promise.all([
          fetch(
            `${process.env.EXPO_PUBLIC_API_URL}/movements/vehicle/${currentVehicleId}`,
            { headers: { Authorization: `Bearer ${token}` } }
          ),
          fetch(
            `${process.env.EXPO_PUBLIC_API_URL}/balance/vehicle/${currentVehicleId}`,
            { headers: { Authorization: `Bearer ${token}` } }
          ),
        ]);

        if (!movementsRes.ok || !balanceRes.ok) {
          console.warn('Fetch failed', {
            movements: movementsRes.status,
            balance: balanceRes.status,
          });
          return;
        }

        const movementsJson = await movementsRes.json();
        const balanceJson = await balanceRes.json();

        if (!isMounted || activeVehicle.id !== currentVehicleId) return;

        setMovements(movementsJson);
        setBalance(balanceJson);
      } catch (e) {
        console.error('Error fetching data:', e);
      } finally {
        if (isMounted) {
          setLoading(false);
          setSwitchingVehicle(false);
        }
      }
    };

    loadData();

    return () => {
      isMounted = false;
    };
  }, [vehiclesLoaded, activeVehicle]);

  /* Centrar el cargando en la pantalla */
  if (loading || !vehiclesLoaded) {
    return (
      <Text
        style={{
          fontSize: 18,
          fontWeight: 'bold',
          textAlign: 'center',
          marginTop: '50%',
        }}
      >
        Cargando...
      </Text>
    );
  }

  if (!activeVehicle) {
    return (
      <>
        <AppHeader />
        <View style={{ flex: 1, padding: 16, justifyContent: 'center' }}>
          <Text style={{ fontSize: 16, textAlign: 'center' }}>
            🚗 No tienes un vehículo registrado
          </Text>
          <Text style={{ marginTop: 8, textAlign: 'center', color: '#666' }}>
            Agrega un vehículo para ver tu balance y alertas
          </Text>
        </View>
      </>
    );
  }

  /* SOAT */
  const rawSoatDays = daysUntil(activeVehicle.soatExpiration);
  const soatDays = rawSoatDays < 0 ? Math.abs(rawSoatDays) : rawSoatDays;
  const daysRemaining = Math.max(0, 365 - soatDays);

  /* TECNO */  
  const rawTecnoDays = daysUntil(activeVehicle.tecnoMecanicaExpiration);
  const tecnoDays = rawTecnoDays < 0 ? Math.abs(rawTecnoDays) : rawTecnoDays;
  const tecnoRemaining = Math.max(0, 365 - tecnoDays);

  return (
    <>
      <AppHeader />
      {daysRemaining <= 30 && (
        <View style={{ backgroundColor: '#FFF3CD', padding: 12, borderRadius: 8 }}>
          <Text>
            ⚠️ El SOAT vence en {daysRemaining} días
          </Text>
        </View>
      )}
      {tecnoRemaining <= 30 && (
        <View
          style={{
            backgroundColor: '#F8D7DA',
            padding: 12,
            borderRadius: 8,
            marginTop: 8,
          }}
        >
          <Text>
            ⚠️ La Tecnomecánica vence en {tecnoRemaining} días
          </Text>
        </View>
      )}
      <View style={{ padding: 16 }}>
        <BalanceCard balance={balance} />
        <MovementsList movements={movements} />
      </View>
    </>
  );
}
