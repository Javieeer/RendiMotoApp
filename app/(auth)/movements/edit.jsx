import AppHeader from '@/components/appHeader';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import {
  Alert,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

export default function MovementEditScreen() {
  const router = useRouter();
  const { movement } = useLocalSearchParams();

  const parsedMovement = JSON.parse(movement);
  const movementObj =
    typeof parsedMovement === 'string'
      ? JSON.parse(parsedMovement)
      : parsedMovement;

  const [loading, setLoading] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

  // 🔑 FECHA SE MANTIENE COMO STRING
  const [form, setForm] = useState({
    date: movementObj.date, // yyyy-mm-dd
    amount: String(movementObj.amount),
    description: movementObj.description || '',
    type: movementObj.type,
    odometer: movementObj.odometer
      ? String(movementObj.odometer)
      : '',
  });

  // 🔑 Convertimos SOLO para el picker
  const dateToPicker = new Date(form.date + 'T12:00:00');

  const handleSave = async () => {
    if (!form.amount || Number(form.amount) <= 0) {
      Alert.alert('Monto inválido');
      return;
    }

    setLoading(true);

    try {
      const token = await AsyncStorage.getItem('token');

      const res = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}/movements/${movementObj.id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            amount: Number(form.amount),
            description: form.description.trim(),
            odometer: form.odometer
              ? Number(form.odometer)
              : null,
            date: form.date, // 👈 sigue siendo string
          }),
        }
      );

      const json = await res.json();

      if (!res.ok) {
        Alert.alert('Error', json.message || 'No se pudo actualizar');
        return;
      }

      Alert.alert('Éxito', 'Movimiento actualizado', [
        { text: 'OK', onPress: () => router.push('/home') },
      ]);
    } catch (e) {
      Alert.alert('Error', 'No se pudo conectar con el servidor');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <AppHeader title="Editar movimiento" />

      <View style={styles.container}>
        <Text style={styles.title}>Editar movimiento</Text>

        {/* FECHA */}
        <TouchableOpacity
          style={styles.input}
          onPress={() => setShowDatePicker(true)}
        >
          <Text>{form.date}</Text>
        </TouchableOpacity>

        {showDatePicker && (
          <DateTimePicker
            value={dateToPicker}
            mode="date"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={(event, selectedDate) => {
              setShowDatePicker(false);
              if (selectedDate) {
                const yyyyMmDd = selectedDate
                  .toISOString()
                  .split('T')[0];

                setForm({ ...form, date: yyyyMmDd });
              }
            }}
          />
        )}

        <TextInput
          style={styles.input}
          placeholder="Monto"
          keyboardType="numeric"
          value={form.amount}
          onChangeText={(v) => setForm({ ...form, amount: v })}
        />

        <TextInput
          style={styles.input}
          placeholder="Descripción"
          value={form.description}
          onChangeText={(v) =>
            setForm({ ...form, description: v })
          }
        />

        <TextInput
          style={styles.input}
          placeholder="Odómetro"
          keyboardType="numeric"
          value={form.odometer}
          onChangeText={(v) =>
            setForm({ ...form, odometer: v })
          }
        />

        <TouchableOpacity
          style={styles.button}
          onPress={handleSave}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? 'Guardando...' : 'Guardar cambios'}
          </Text>
        </TouchableOpacity>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: '#F3F3EE',
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 20,
  },
  input: {
    backgroundColor: '#fff',
    padding: 14,
    borderRadius: 8,
    marginBottom: 12,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#3498DB',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 12,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});
