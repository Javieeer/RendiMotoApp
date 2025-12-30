import AppHeader from '@/components/appHeader';
import MovementItem from '@/components/movementItem';
import { useVehicle } from '@/context/vehicleContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  Text
} from 'react-native';


export default function MovementsScreen() {

  const { activeVehicle } = useVehicle();
  
  const [movements, setMovements] = useState([]);
  const [loading, setLoading] = useState(true);

  /* Cargar movimientos */
  useEffect(() => {
    if (!activeVehicle) return;

    const loadMovements = async () => {
      try {
        const token = await AsyncStorage.getItem('token');

        const res = await fetch(
          `${process.env.EXPO_PUBLIC_API_URL}/movements/vehicle/${activeVehicle.id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const json = await res.json();

        if (!res.ok) {
          throw new Error(json.message);
        }

        setMovements(json || []);
      } catch (e) {
        console.error('Error cargando movimientos', e);
      } finally {
        setLoading(false);
      }
    };

    loadMovements();
  }, [activeVehicle]);

  /* Ordenar movimientos por fecha */
  if (loading) {
    return <ActivityIndicator style={{ marginTop: 40 }} />;
  }
  movements.sort((a, b) => new Date(b.date) - new Date(a.date));

  return (
    <>
      <AppHeader />
      <ScrollView
        style={{ flex: 1, backgroundColor: '#F3F3EE' }}
        contentContainerStyle={{ padding: 16 }}
      >
        <Text
          style={{
            fontSize: 20,
            fontWeight: '700',
            marginBottom: 16,
          }}
        >
          Movimientos
        </Text>

        {movements.length === 0 ? (
          <Text>No hay movimientos registrados</Text>
        ) : (
          movements.map((m) => (
            <MovementItem key={m.id} movement={m} />
          ))
        )}
      </ScrollView>
    </>
  );
}
