import AppHeader from '@/components/appHeader';
import BalanceCard from '@/components/balanceCard';
import { useVehicle } from '@/context/vehicleContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useEffect, useState } from 'react';
import {
  Alert,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

/* Utils */
const formatDate = (date) => date.toISOString().split('T')[0];

const getMonthRange = () => {
  const now = new Date();
  return {
    start: new Date(now.getFullYear(), now.getMonth(), 1),
    end: now,
  };
};

const getWeekRange = () => {
  const now = new Date();
  const day = now.getDay();
  const diff = day === 0 ? 6 : day - 1;
  const start = new Date(now);
  start.setDate(now.getDate() - diff);
  return { start, end: now };
};

const getDayRange = () => {
  const now = new Date();
  return { start: now, end: now };
};

const formatHumanDate = (date) =>
  date.toLocaleDateString('es-CO', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

const getSubtitleByRange = (type, range) => {
  switch (type) {
    case 'MONTH':
      return `Reporte mensual · ${range.start.toLocaleDateString('es-CO', {
        month: 'long',
        year: 'numeric',
      })}`;

    case 'WEEK':
      return `Reporte semanal · ${formatHumanDate(range.start)} – ${formatHumanDate(range.end)}`;

    case 'DAY':
      return `Reporte diario · ${formatHumanDate(range.start)}`;

    case 'ALL':
      return 'Histórico · todos los movimientos';

    case 'CUSTOM':
      return `Personalizado · ${formatHumanDate(range.start)} – ${formatHumanDate(range.end)}`;

    default:
      return '';
  }
};


export default function ReportsScreen() {
  
  const { activeVehicle } = useVehicle();

  const [loading, setLoading] = useState(false);
  const [balance, setBalance] = useState(null);
  const [rangeType, setRangeType] = useState('MONTH');
  /* Personalizado */
  const [showCustom, setShowCustom] = useState(false);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
  const [subtitle, setSubtitle] = useState('');

  /* Fetch balance data */
  const fetchBalance = async (type, customRange = null) => {
    if (!activeVehicle) return;

    setLoading(true);

    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) return;

      let url = `${process.env.EXPO_PUBLIC_API_URL}/balance/vehicle/${activeVehicle.id}`;

      let range = null;

      if (type !== 'ALL') {
        range = customRange;

        if (!range) {
          if (type === 'MONTH') range = getMonthRange();
          if (type === 'WEEK') range = getWeekRange();
          if (type === 'DAY') range = getDayRange();
        }

        url += `/range?startDate=${formatDate(range.start)}&endDate=${formatDate(range.end)}`;
      }

      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();

      if (!res.ok) {
        Alert.alert('Error', data.message || 'No se pudo obtener el balance');
        return;
      }

      setSubtitle(getSubtitleByRange(type, range));
      setBalance(data);
    } catch {
      Alert.alert('Error', 'No se pudo conectar con el servidor');
    } finally {
      setLoading(false);
    }
  };

  /* Initial fetch */
  useEffect(() => {
    fetchBalance('MONTH');
  }, [activeVehicle]);

  return (
    <>
      <AppHeader />

      <View style={styles.container}>
        <Text style={styles.title}>Reportes</Text>

        {subtitle ? (
        <Text style={styles.subtitle}>{subtitle}</Text>
        ) : null}

        <BalanceCard balance={balance} />

        <View style={styles.actions}>
          <ReportButton label="Reporte mensual" onPress={() => {
            setRangeType('MONTH');
            fetchBalance('MONTH');
          }} active={rangeType === 'MONTH'} />

          <ReportButton label="Reporte semanal" onPress={() => {
            setRangeType('WEEK');
            fetchBalance('WEEK');
          }} active={rangeType === 'WEEK'} />

          <ReportButton label="Reporte diario" onPress={() => {
            setRangeType('DAY');
            fetchBalance('DAY');
          }} active={rangeType === 'DAY'} />

          <ReportButton label="Histórico" onPress={() => {
            setRangeType('ALL');
            fetchBalance('ALL');
          }} active={rangeType === 'ALL'} />

          <ReportButton
            label="Personalizado"
            onPress={() => setShowCustom(true)}
          />
        </View>
      </View>

      {/* MODAL PERSONALIZADO */}
      <Modal transparent visible={showCustom} animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modal}>
            <Text style={styles.modalTitle}>Reporte personalizado</Text>

            <TouchableOpacity
              style={styles.input}
              onPress={() => setShowStartPicker(true)}
            >
              <Text>Desde: {startDate.toLocaleDateString()}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.input}
              onPress={() => setShowEndPicker(true)}
            >
              <Text>Hasta: {endDate.toLocaleDateString()}</Text>
            </TouchableOpacity>

            {showStartPicker && (
              <DateTimePicker
                value={startDate}
                mode="date"
                onChange={(e, date) => {
                  setShowStartPicker(false);
                  if (date) setStartDate(date);
                }}
              />
            )}

            {showEndPicker && (
              <DateTimePicker
                value={endDate}
                mode="date"
                onChange={(e, date) => {
                  setShowEndPicker(false);
                  if (date) setEndDate(date);
                }}
              />
            )}

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.cancel}
                onPress={() => setShowCustom(false)}
              >
                <Text>Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.confirm}
                onPress={() => {
                  if (startDate > endDate) {
                    Alert.alert('Fechas inválidas');
                    return;
                  }

                  setRangeType('CUSTOM');
                  setShowCustom(false);
                  fetchBalance('CUSTOM', {
                    start: startDate,
                    end: endDate,
                  });
                }}
              >
                <Text style={{ color: '#fff', fontWeight: '600' }}>
                  Generar
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}

/* Report button component */
function ReportButton({ label, onPress, active }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.button, active && styles.buttonActive]}
    >
      <Text style={[styles.buttonText, active && styles.buttonTextActive]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

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
    textAlign: 'center',
  },
  buttonTextActive: {
    color: '#fff',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  modal: {
    backgroundColor: '#fff',
    padding: 24,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 16,
  },
  input: {
    backgroundColor: '#F3F3EE',
    padding: 14,
    borderRadius: 8,
    marginBottom: 12,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
  },
  cancel: {
    padding: 12,
  },
  confirm: {
    backgroundColor: '#2ECC71',
    padding: 12,
    borderRadius: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
  },
});
