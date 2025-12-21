import AppHeader from '@/components/appHeader';
import BalanceCard from '@/components/balanceCard';
import { useVehicle } from '@/context/vehicleContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import {
    Alert,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

/* FORMATEO DE FECHAS */
const formatDate = (date) => date.toISOString().split('T')[0];

/* MENSUAL */
const getMonthRange = () => {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), 1);
  return { start, end: now };
};

/* SEMANAL */
const getWeekRange = () => {
  const now = new Date();
  const day = now.getDay();
  const diff = day === 0 ? 6 : day - 1;
  const start = new Date(now);
  start.setDate(now.getDate() - diff);
  return { start, end: now };
};

/* DIARIO */
const getDayRange = () => {
  const now = new Date();
  return { start: now, end: now };
};

/* Botón reutilizable */
function ReportButton({ label, onPress, active }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.button,
        active && styles.buttonActive,
      ]}
    >
      <Text
        style={[
          styles.buttonText,
          active && styles.buttonTextActive,
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}

export default function ReportsScreen() {
    
  const { activeVehicle } = useVehicle();

  const [loading, setLoading] = useState(false);
  const [balance, setBalance] = useState(null);
  const [rangeType, setRangeType] = useState('MONTH'); // DAY | WEEK | MONTH | ALL

  /* Cargar balance */
  const fetchBalance = async (type) => {
    if (!activeVehicle) return;

    setLoading(true);

    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) return;

      let url = `${process.env.EXPO_PUBLIC_API_URL}/balance/vehicle/${activeVehicle.id}`;

      /* Editar URL del fetch según rango */
      if (type !== 'ALL') {
        let range;

        if (type === 'MONTH') range = getMonthRange();
        if (type === 'WEEK') range = getWeekRange();
        if (type === 'DAY') range = getDayRange();

        url += `/range?startDate=${formatDate(range.start)}&endDate=${formatDate(range.end)}`;
      }

      const res = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();

      /* En caso de error */
      if (!res.ok) {
        Alert.alert('Error', data.message || 'No se pudo obtener el balance');
        return;
      }

      /* Si todo sale bien */
      setBalance(data);

    } catch (e) {
      Alert.alert('Error', 'No se pudo conectar con el servidor');
    } finally {
      setLoading(false);
    }
  };

  /* Carga inicial → mensual */
  useEffect(() => {
    fetchBalance('MONTH');
  }, [activeVehicle]);

  return (
    <>
      <AppHeader />

      <View style={styles.container}>
        <Text style={styles.title}>Reportes</Text>

        {/* BALANCE */}
        <BalanceCard balance={balance} />

        {/* BOTONES */}
        <View style={styles.actions}>
          <ReportButton
            label="Reporte mensual"
            active={rangeType === 'MONTH'}
            onPress={() => {
              setRangeType('MONTH');
              fetchBalance('MONTH');
            }}
          />

          <ReportButton
            label="Reporte semanal"
            active={rangeType === 'WEEK'}
            onPress={() => {
              setRangeType('WEEK');
              fetchBalance('WEEK');
            }}
          />

          <ReportButton
            label="Reporte diario"
            active={rangeType === 'DAY'}
            onPress={() => {
              setRangeType('DAY');
              fetchBalance('DAY');
            }}
          />

          <ReportButton
            label="Histórico"
            active={rangeType === 'ALL'}
            onPress={() => {
              setRangeType('ALL');
              fetchBalance('ALL');
            }}
          />

          <ReportButton
            label="Personalizado"
            onPress={() => {
              Alert.alert(
                'Próximamente',
                'El reporte personalizado estará disponible pronto'
              );
            }}
          />
        </View>
      </View>
    </>
  );
}

/* Styles */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F3EE',
    padding: 24,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 16,
  },
  actions: {
    marginTop: 20,
    gap: 10,
  },
  button: {
    backgroundColor: '#fff',
    padding: 14,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#DDD',
  },
  buttonActive: {
    backgroundColor: '#2ECC71',
    borderColor: '#2ECC71',
  },
  buttonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
  },
  buttonTextActive: {
    color: '#fff',
  },
});
