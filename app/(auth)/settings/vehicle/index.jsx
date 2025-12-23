import AppHeader from '@/components/appHeader';
import { useVehicle } from '@/context/vehicleContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { useState } from 'react';
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

export default function EditVehicleScreen() {

  const { activeVehicle, selectVehicle } = useVehicle();

  /* Si no hay vehículo activo */
  if (!activeVehicle) {
    return (
      <>
        <AppHeader title="Editar vehículo" />
        <View style={styles.container}>
          <Text>No hay vehículo activo</Text>
        </View>
      </>
    );
  }

  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    plate: activeVehicle.plate || '',
    brand: activeVehicle.brand || '',
    model: activeVehicle.model || '',
  });

  /* Actualizar formulario */
  const update = (key, value) => {
    setForm({ ...form, [key]: value });
  };

  /* Guardar cambios */
  const handleSave = async () => {

    /* Validar campos */
    if (!form.plate.trim()) {
      Alert.alert('Placa requerida');
      return;
    }

    if (!form.brand.trim() || !form.model.trim()) {
      Alert.alert('Marca y modelo requeridos');
      return;
    }

    setLoading(true);

    try {
      const token = await AsyncStorage.getItem('token');

      const res = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}/vehicles/${activeVehicle.id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            plate: form.plate.trim().toUpperCase(),
            brand: form.brand.trim(),
            model: form.model.trim(),
          }),
        }
      );

      const data = await res.json();

      /* Si algo sale mal */
      if (!res.ok) {
        Alert.alert('Error', data.message || 'No se pudo actualizar');
        return;
      }

      /* Si todo sale bien */
      await selectVehicle(data.body || { ...activeVehicle, ...form });

      Alert.alert('Éxito', 'Vehículo actualizado', [
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
      <AppHeader title="Editar vehículo" />

      <View style={styles.container}>
        <Text style={styles.title}>Datos del vehículo</Text>

        <TextInput
          style={styles.input}
          placeholder="Placa"
          autoCapitalize="characters"
          value={form.plate}
          onChangeText={(v) => update('plate', v)}
        />

        <TextInput
          style={styles.input}
          placeholder="Marca"
          value={form.brand}
          onChangeText={(v) => update('brand', v)}
        />

        <TextInput
          style={styles.input}
          placeholder="Modelo"
          value={form.model}
          onChangeText={(v) => update('model', v)}
        />

        <TouchableOpacity
          style={styles.button}
          onPress={handleSave}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? 'Guardando…' : 'Guardar cambios'}
          </Text>
        </TouchableOpacity>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F3EE',
    padding: 24,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 16,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 14,
    fontSize: 16,
    marginBottom: 12,
  },
  button: {
    backgroundColor: '#3498DB',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
