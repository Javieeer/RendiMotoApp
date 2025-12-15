import Header from '@/components/header';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function LoginScreen() {
  
  /* Manejo de navegación */
  const router = useRouter();

  /* Declaramos estados necesarios para el manejo de la información */
  const [form, setForm] = useState({
    email: '',
    password: '',
  });

  /* Función para actualizar el formulario */
  const update = (key: string, value: string) => {
    setForm({ ...form, [key]: value });
  };

  /* Validación simple del formulario */
  const isFormValid = form.email.includes('@') && form.password.length >= 6;

  /* Función para iniciar sesión */
  const handleLogin = async () => {
    try {
      const payload = {
        email: form.email.trim().toLowerCase(),
        password: form.password, 
      };

      console.log('Login payload:', payload); // BORRAR LUEGO --------------------

      const response = await fetch('https://tu-backend.com/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok) {
        console.log('Login exitoso:', data);
        // Redirigir a pantalla principal
        router.replace('/home'); // REVISAR LA RUTA DE LA PANTALLA PRINCIPAL DEL USER REGISTRADO
      } else {
        alert(data.message || 'Error al iniciar sesión');
      }
    } catch (err) {
      console.error(err);
      alert('Ocurrió un error. Intenta de nuevo.');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header fijo */}
      <Header title="Iniciar sesión" />

      {/* Contenido scrollable */}
      <ScrollView contentContainerStyle={styles.form}>
        <Text style={styles.subTitle}>
          Accede a tu cuenta de RendiMoto
        </Text>

        <TextInput
          placeholder="Correo electrónico"
          placeholderTextColor="#999"
          style={styles.input}
          keyboardType="email-address"
          autoCapitalize="none"
          value={form.email}
          onChangeText={(v) => update('email', v)}
        />

        <TextInput
          placeholder="Contraseña"
          placeholderTextColor="#999"
          style={styles.input}
          secureTextEntry
          value={form.password}
          onChangeText={(v) => update('password', v)}
        />

        <TouchableOpacity
          style={[styles.button, !isFormValid && styles.buttonDisabled]}
          disabled={!isFormValid}
          onPress={handleLogin}
        >
          <Text style={styles.buttonText}>Entrar</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F3F3EE',
  },
  form: {
    padding: 24,
    paddingTop: 16, // espacio debajo del header
    alignItems: 'center',
  },
  subTitle: {
    color: '#000',
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
    fontWeight: '500',
  },
  input: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 14,
    fontSize: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#DDD',
  },
  button: {
    width: '100%',
    backgroundColor: '#FF6B00',
    padding: 14,
    borderRadius: 8,
    marginBottom: 12,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  buttonDisabled: {
    opacity: 0.5,
  }
});
