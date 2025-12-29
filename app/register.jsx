import Header from '@/components/header';
import * as Location from 'expo-location';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Register() {

  const router = useRouter();

  const [form, setForm] = useState({
    documentType: 1,
    documentNumber: '',
    fullName: '',
    phoneNumber: '',
    email: '',
    password: '',
    city: '',
  });
  const [locationError, setLocationError] = useState(false);

  /* Obtenemos la ciudad del dispositivo */
  const getCityFromDevice = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setLocationError(true);
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      const geo = await Location.reverseGeocodeAsync(location.coords);

      if (geo.length > 0) {
        update('city', geo[0].city ?? '');
        setLocationError(false);
      } else {
        setLocationError(true);
      }
    } catch (e) {
      setLocationError(true);
    }
  };
  useEffect(() => {
    getCityFromDevice();
  }, []);

  /* Función para actualizar el formulario */
  const update = (key: string, value: string | number) => {
    setForm({ ...form, [key]: value });
  };

  /* Función para validar que el nombre completo tenga al menos dos partes */
  const isValidFullName = (fullName: string) => {
    const parts = fullName.trim().split(/\s+/);
    return parts.length >= 2;
  };

  /* Validación del formulario (No se registra hasta que todos los campos estén completos) */
  const isFormValid =
    isValidFullName(form.fullName) &&
    form.documentNumber.trim().length > 0 &&
    form.phoneNumber.trim().length > 0 &&
    form.email.includes('@') &&
    form.password.length >= 6 &&
    form.city.trim().length > 0;

  /* Función para dividir el nombre completo en nombre y apellido */
  const splitAndFormatFullName = (fullName: string) => {
    const parts = fullName.trim().split(/\s+/);

    return {
      firstName: parts.slice(0, -1).join(' ').toUpperCase(),
      lastName: parts.slice(-1)[0].toUpperCase(),
    };
  };

  /* Función para registrar al usuario */
  const handleRegister = async () => {
    const { firstName, lastName } = splitAndFormatFullName(form.fullName);

    const payload = {
      documentType: form.documentType,
      documentNumber: form.documentNumber.trim().toUpperCase(),
      firstName,
      lastName,
      phoneNumber: form.phoneNumber.trim().toUpperCase(),
      email: form.email.trim().toLowerCase(),
      password: form.password, 
      city: form.city.trim().toUpperCase(),
    };

    try {
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}/delivery`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        }
      );

      let data = null;

      try {
        data = await response.json();
      } catch {
        // backend no devolvió JSON
      }

      /* Algo sale mal */
      if (!response.ok) {
        
        if (response.status === 409) {
          alert(data?.message || 'El usuario ya existe');
          return;
        }

        if (response.status === 400) {
          alert(data?.message || 'Datos inválidos');
          return;
        }

        alert(data?.message || 'Error al registrar el usuario');
        return;
      }

      /* Registro exitoso */
      if (response.ok) {
        Alert.alert(
          'Registro exitoso 🎉',
          'Tu cuenta fue creada correctamente. Ahora inicia sesión.',
          [
            {
              text: 'Iniciar sesión',
              onPress: () => router.replace('/login'),
            },
          ]
        );
        return;
      }

    } catch (err) {
      console.error(err);
      alert('No se pudo conectar con el servidor');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header title="Crear cuenta" />
      <ScrollView contentContainerStyle={styles.form} style={{ flex: 1 }}>
        
        <View style={styles.row}>
          <TouchableOpacity
            style={[styles.chip, form.documentType === 1 && styles.chipActive]}
            onPress={() => update('documentType', 1)}
          >
            <Text>CC</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.chip, form.documentType === 2 && styles.chipActive]}
            onPress={() => update('documentType', 2)}
          >
            <Text>TI</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.chip, form.documentType === 3 && styles.chipActive]}
            onPress={() => update('documentType', 3)}
          >
            <Text>Pasaporte</Text>
          </TouchableOpacity>
        </View>

        <TextInput 
          placeholder="Número de documento" 
          placeholderTextColor="#999"
          style={styles.input}
          onChangeText={(v) => update('documentNumber', v)}
        />

        <TextInput
          placeholder="Nombre completo"
          placeholderTextColor="#999"
          style={styles.input}
          onChangeText={(v) => update('fullName', v)}
        />

        <TextInput 
          placeholder="Ciudad" 
          placeholderTextColor="#999"
          style={[
            styles.input,
            locationError ? styles.inputEnabled : styles.inputDisabled,
          ]} value={form.city} editable={locationError}
          onChangeText={(v) => update('city', v)} 
        />

        <TextInput 
          placeholder="Teléfono" 
          placeholderTextColor="#999"
          keyboardType="phone-pad"
          style={styles.input}
          onChangeText={(v) => update('phoneNumber', v)}
        />

        <TextInput 
          placeholder="Correo" 
          placeholderTextColor="#999"
          keyboardType="email-address"
          autoCapitalize="none"
          style={styles.input}
          onChangeText={(v) => update('email', v)}
        />

        <TextInput 
          placeholder="Contraseña" 
          placeholderTextColor="#999"
          secureTextEntry
          style={styles.input}
          onChangeText={(v) => update('password', v)}
        />

        <TouchableOpacity
          style={[
            styles.button,
            !isFormValid && styles.buttonDisabled
          ]}
          disabled={!isFormValid}
          onPress={handleRegister}
        >
          <Text style={styles.buttonText}>Registrarme</Text>
        </TouchableOpacity>

        {form.fullName.length > 0 && !isValidFullName(form.fullName) && (
          <Text style={styles.errorText}>
            Ingresa nombre y apellido
          </Text>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#F3F3EE',
    padding: 24,
  },
  title: {
    marginTop: 30,
    fontSize: 26,
    fontWeight: '700',
    marginBottom: 20,
  },
  input: {
    backgroundColor: '#fff',
    color: '#000',
    borderRadius: 8,
    padding: 14,
    marginBottom: 12,
  },
  inputDisabled: {
    backgroundColor: '#E0E0E0', 
    color: '#7f7f7f', 
  },
  button: {
    backgroundColor: '#FF6B00',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  row: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 16,
  },
  chip: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    backgroundColor: '#ddd',
  },
  chipActive: {
    backgroundColor: '#FF6B00',
  },
  safeArea: {
    flex: 1,
    backgroundColor: '#F3F3EE',
  },
  form: {
    padding: 24,
    paddingTop: 0,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  errorText: {
  color: '#C0392B',
  marginBottom: 8,
  fontSize: 13,
}
});

