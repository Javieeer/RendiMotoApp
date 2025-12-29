import Header from '@/components/header';
import { useAuth } from '@/context/authContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function LoginScreen() {
  
  const API_URL = process.env.EXPO_PUBLIC_API_URL;

  const router = useRouter();
  const { login } = useAuth();

  const [loading, setLoading] = useState(false);
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
    setLoading(true);
    try {
      const payload = {
        email: form.email.trim().toLowerCase(),
        password: form.password,
      };

      const response = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}/delivery/login`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        }
      );

      let data = null;

      data = await response.json();

      /* Algo sale mal */
      if (!response.ok) {
        if (response.status === 401) {
          alert('Correo o contraseña incorrectos');
          return;
        }

        if (response.status === 400) {
          alert('Faltan datos en el formulario');
          return;
        }

        if (response.status >= 500) {
          alert('Error del servidor, inténtalo más tarde');
          return;
        }

        if (response.status === 429) {
          alert('Demasiados intentos, espera un momento');
          return;
        }

        if (data?.message) {
          alert(data.message);
          return;
        }

        alert(data?.message || 'Error al iniciar sesión');
        return;
      }

      /* Éxito */
      if (response.ok) {
        /* Borrar en un futuro */
        await AsyncStorage.setItem('token', data.token);
        await AsyncStorage.setItem('deliveryId', String(data.id));
        /* -------------------- */
        await login({
          token: data.token,
          deliveryId: data.id,
          userName: data.name,
        });
        router.replace('/home');
      }

    } catch (err) {
      if (err instanceof SyntaxError) {
        alert('Datos incorrectos, revise e intente nuevamente');
        return;
      }

      alert('No se pudo conectar con el servidor');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      
      <Header title="Iniciar sesión" />

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
          disabled={!isFormValid || loading}
          onPress={handleLogin}
        >
          {loading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.buttonText}>Entrar</Text> }
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
    paddingTop: 16, 
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
    color: '#000',
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
