import { useVehicle } from '@/context/vehicleContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
    Alert,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

export default function CreateMovementScreen() {
  const { type } = useLocalSearchParams(); // INCOME | EXPENSE
  const router = useRouter();
  const { activeVehicle } = useVehicle();

  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    date: new Date(),
    amount: '',
    description: '',
    type: type || 'INCOME',
    odometer: '',
  });

  useEffect(() => {
    if (!activeVehicle) {
      Alert.alert('Error', 'No hay vehículo activo');
      router.replace('/home');
    }
  }, []);

  const update = (key, value) => {
    setForm({ ...form, [key]: value });
  };

  const handleSave = async () => {
    if (!form.amount || Number(form.amount) <= 0) {
      Alert.alert('Monto inválido', 'Ingresa un monto válido');
      return;
    }

    if (!form.description.trim()) {
      Alert.alert('Descripción requerida', 'Describe el movimiento');
      return;
    }

    setLoading(true);

    try {
      const token = await AsyncStorage.getItem('token');

      const payload = {
        vehicleId: activeVehicle.id,
        date: form.date.toISOString().split('T')[0],
        amount: Number(form.amount),
        description: form.description.trim(),
        type: form.type,
        odometer: form.odometer ? Number(form.odometer) : null,
      };

      const res = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}/movements`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        Alert.alert('Error', data.message || 'No se pudo guardar');
        return;
      }

      Alert.alert(
        'Movimiento registrado',
        form.type === 'INCOME'
          ? 'Ingreso guardado correctamente'
          : 'Egreso guardado correctamente',
        [{ text: 'OK', onPress: () => router.replace('/home') }]
      );
    } catch (e) {
      Alert.alert('Error', 'No se pudo conectar con el servidor');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {form.type === 'INCOME'
          ? 'Registrar ingreso'
          : 'Registrar egreso'}
      </Text>

      <TextInput
        placeholder="Monto"
        keyboardType="numeric"
        value={form.amount}
        onChangeText={(v) => update('amount', v)}
        style={styles.input}
      />

      <TextInput
        placeholder="Descripción"
        value={form.description}
        onChangeText={(v) => update('description', v)}
        style={styles.input}
      />

      <TextInput
        placeholder="Odómetro (opcional)"
        keyboardType="numeric"
        value={form.odometer}
        onChangeText={(v) => update('odometer', v)}
        style={styles.input}
      />

      <TouchableOpacity
        style={[
          styles.button,
          form.type === 'EXPENSE' && styles.expenseButton,
        ]}
        onPress={handleSave}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? 'Guardando…' : 'Guardar'}
        </Text>
      </TouchableOpacity>
    </View>
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
    marginBottom: 20,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 14,
    fontSize: 16,
    marginBottom: 12,
  },
  button: {
    backgroundColor: '#2ECC71',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  expenseButton: {
    backgroundColor: '#E74C3C',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
