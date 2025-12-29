import DateInput from '@/components/DateInput';
import { useAuth } from '@/context/authContext';
import { createVehicle } from '@/services/vehicleService';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';


export default function VehicleFormScreen() {
  const router = useRouter();
  const { user } = useAuth();

  const [plate, setPlate] = useState('');
  const [brand, setBrand] = useState('');
  const [model, setModel] = useState('');
  const [year, setYear] = useState('');
  const [mileage, setMileage] = useState('');
  const [soatExpiration, setSoatExpiration] = useState('');
  const [tecnoExpiration, setTecnoExpiration] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!plate || !brand || !model) {
      Alert.alert('Error', 'Completa los campos obligatorios');
      return;
    }

    try {
      setLoading(true);

      await createVehicle({
        plate,
        brand,
        model,
        year: Number(year),
        mileage: Number(mileage),
        soatExpiration,
        tecnoMecanicaExpiration: tecnoExpiration,
        deliveryId: user.id,
      });

      Alert.alert('Éxito', 'Vehículo creado correctamente', [
        { text: 'OK', onPress: () => router.replace('/home') },
      ]);
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.root}>
        <View style={styles.card}>
        <Text style={styles.title}>Nuevo vehículo</Text>
        <Text style={styles.subtitle}>
            Registra la información básica de tu vehículo
        </Text>

        <View style={styles.form}>
            <TextInput
            style={styles.input}
            placeholder="Placa (ABC123)"
            placeholderTextColor="#999"
            value={plate}
            onChangeText={setPlate}
            />

            <TextInput
            style={styles.input}
            placeholder="Marca (BAJAJ)"
            placeholderTextColor="#999"
            value={brand}
            onChangeText={setBrand}
            />

            <TextInput
            style={styles.input}
            placeholder="Modelo (Pulsar NS200)"
            placeholderTextColor="#999"
            value={model}
            onChangeText={setModel}
            />

            <View style={styles.row}>
            <TextInput
                style={[styles.input, styles.half]}
                placeholder="Año (2020)"
                placeholderTextColor="#999"
                keyboardType="numeric"
                value={year}
                onChangeText={setYear}
            />

            <TextInput
                style={[styles.input, styles.half]}
                placeholder="Kilometraje (15000)"
                placeholderTextColor="#999"
                keyboardType="numeric"
                value={mileage}
                onChangeText={setMileage}
            />
            </View>

            <DateInput
                label="Vencimiento SOAT"
                value={soatExpiration}
                onChange={setSoatExpiration}
            />

            <DateInput
                label="Vencimiento Tecnomecánica"
                value={tecnoExpiration}
                onChange={setTecnoExpiration}
            />


            <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleSubmit}
            disabled={loading}
            >
            <Text style={styles.buttonText}>
                {loading ? 'Guardando...' : 'Guardar vehículo'}
            </Text>
            </TouchableOpacity>
        </View>
        </View>
    </View>
    );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    padding: 20,
    justifyContent: 'center',
  },

  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 4,
  },

  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#111827',
    textAlign: 'center',
    marginBottom: 4,
  },

  subtitle: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 20,
  },

  form: {
    gap: 12,
  },

  input: {
    backgroundColor: '#F9FAFB',
    color: '#000',
    borderRadius: 12,
    padding: 14,
    fontSize: 15,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },

  row: {
    flexDirection: 'row',
    gap: 12,
  },

  half: {
    flex: 1,
  },

  button: {
    backgroundColor: '#2ECC71',
    paddingVertical: 16,
    borderRadius: 12,
    marginTop: 10,
    alignItems: 'center',
  },

  buttonDisabled: {
    opacity: 0.6,
  },

  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
