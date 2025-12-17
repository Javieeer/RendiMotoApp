import { useVehicle } from '@/context/vehicleContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Text, TouchableOpacity, View } from 'react-native';

export default function HomeScreen() {
  const router = useRouter();
  const { activeVehicle } = useVehicle();

  const [movements, setMovements] = useState([]);
  const [balance, setBalance] = useState(null);
  const [loading, setLoading] = useState(true);

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
    <View style={{ padding: 16 }}>
      <Text style={{ fontSize: 18, fontWeight: '600' }}>
        {activeVehicle.plate}
      </Text>

      <Text>
        {activeVehicle.brand} {activeVehicle.model}
      </Text>

      <View style={{ marginTop: 20 }}>
        <Text>💵 Ingresos: ${balance.totalIncome}</Text>
        <Text>💸 Egresos: ${balance.totalExpense}</Text>
        <Text style={{ fontWeight: '700', marginTop: 8 }}>
          📈 Balance: ${balance.balance}
        </Text>
      </View>

      <View style={{ marginTop: 24, gap: 12 }}>
        <TouchableOpacity
          style={{
            backgroundColor: '#2ECC71',
            padding: 14,
            borderRadius: 8,
            alignItems: 'center',
          }}
          onPress={() => router.push('/movement/create?type=INCOME')}
        >
          <Text style={{ color: '#fff', fontWeight: '600' }}>
            ➕ Registrar ingreso
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={{
            backgroundColor: '#E74C3C',
            padding: 14,
            borderRadius: 8,
            alignItems: 'center',
          }}
          onPress={() => router.push('/movement/create?type=EXPENSE')}
        >
          <Text style={{ color: '#fff', fontWeight: '600' }}>
            ➖ Registrar egreso
          </Text>
        </TouchableOpacity>
      </View>
      <View style={{ marginTop: 24 }}>
        <Text style={{ fontSize: 16, fontWeight: '700', marginBottom: 8 }}>
          Últimos movimientos
        </Text>

        {lastMovements.length === 0 && (
          <Text style={{ color: '#777' }}>
            No hay movimientos registrados
          </Text>
        )}

        {lastMovements.map((m) => {
          const isIncome = m.type === 'INCOME';

          return (
            <View
              key={m.id}
              style={{
                backgroundColor: '#fff',
                padding: 12,
                borderRadius: 8,
                marginBottom: 8,
                borderLeftWidth: 4,
                borderLeftColor: isIncome ? '#2ECC71' : '#E74C3C',
              }}
            >
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: '600',
                  color: isIncome ? '#2ECC71' : '#E74C3C',
                }}
              >
                {isIncome ? '+' : '-'} ${m.amount.toLocaleString()}
              </Text>

              <Text style={{ fontSize: 14 }}>
                {m.description || 'Sin descripción'}
              </Text>

              <Text style={{ fontSize: 12, color: '#777' }}>
                {new Date(m.date).toLocaleDateString()}
              </Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}
