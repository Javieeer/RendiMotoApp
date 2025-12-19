import AppHeader from '@/components/appHeader';
import BalanceCard from '@/components/balanceCard';
import MovementsList from '@/components/movementsList';
import { useVehicle } from '@/context/vehicleContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Text, View } from 'react-native';

export default function HomeScreen() {

  const router = useRouter();
  const { activeVehicle, loadVehicles } = useVehicle();

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
    if (!activeVehicle) return;

    let isMounted = true;

    setBalance(null); 
    setMovements([]);

    const loadData = async () => {
      try {
        setSwitchingVehicle(true); 
        const token = await AsyncStorage.getItem('token');

        const movementsRes = await fetch(
          `${process.env.EXPO_PUBLIC_API_URL}/movements/vehicle/${activeVehicle.id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const movementsJson = await movementsRes.json();

        const balanceRes = await fetch(
          `${process.env.EXPO_PUBLIC_API_URL}/balance/vehicle/${activeVehicle.id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        
        const balanceJson = await balanceRes.json();

        if (!movementsRes.ok || !balanceRes.ok) throw new Error();

        if (isMounted) {
          setMovements(movementsJson);
          setBalance(balanceJson);
        }
      } catch (e) {
        console.error(e);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadData();

    return () => {
      isMounted = false;
    };
  }, [activeVehicle]);

  /* Centrar el cargando en la pantalla */
  if (loading) return <Text
      style={{
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
        marginTop: '50%',
      }}
    >
      Cargando...
    </Text>;
  if (!balance && !switchingVehicle) {
    return <Text>No se pudo cargar el balance</Text>;
  }

  return (
    <>
      <AppHeader />
      <View style={{ padding: 16 }}>
        <BalanceCard balance={balance} />
        <MovementsList movements={movements} />
      </View>
    </>
  );
}
