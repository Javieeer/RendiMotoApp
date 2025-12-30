import AppHeader from '@/components/appHeader';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  Alert,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';


export default function ProfileSettingsScreen() {

  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [password, setPassword] = useState('');
  const [deliveryId, setDeliveryId] = useState(null);
  const [form, setForm] = useState({
    documentType: '',
    documentNumber: '',
    firstName: '',
    lastName: '',
    phoneNumber: '',
    email: '',
    city: '',
  });

  /* Cargar perfil */
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = await AsyncStorage.getItem('token');

        const res = await fetch(
          `${process.env.EXPO_PUBLIC_API_URL}/delivery/me`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const data = await res.json();

        if (!res.ok) {
          Alert.alert('Error', data.message || 'No se pudo cargar el perfil');
          return;
        }

        setDeliveryId(data.id);
        setForm({
          documentType: data.documentType,
          documentNumber: data.documentNumber,
          firstName: data.firstName,
          lastName: data.lastName,
          phoneNumber: data.phoneNumber,
          email: data.email,
          city: data.city,
        });
      } catch (e) {
        Alert.alert('Error', 'No se pudo conectar con el servidor');
      }
    };

    fetchProfile();
  }, []);

  /* Guardar cambios (abre modal) */
  const handleSave = () => {

    /* Validar campos requeridos */
    if (!form.firstName || !form.lastName || !form.email) {
      Alert.alert('Campos requeridos', 'Completa la información obligatoria');
      return;
    }

    setShowConfirm(true);
  };

  /* Confirmar con contraseña */
  const confirmSave = async () => {

    /* Si no ingresa contraseña */
    if (!password) {
      Alert.alert('Contraseña requerida', 'Ingresa tu contraseña');
      return;
    }

    setLoading(true);

    try {
      const token = await AsyncStorage.getItem('token');

      const res = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}/delivery/${deliveryId}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            ...form,
            password,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        Alert.alert('Error', data.message || 'No se pudo actualizar');
        return;
      }

      Alert.alert('Perfil actualizado', 'Tus datos fueron guardados', [
        {
          text: 'OK',
          onPress: () => {
            setShowConfirm(false);
            router.back();
          },
        },
      ]);
    } catch (e) {
      Alert.alert('Error', 'Contraseña incorrecta, intenta de nuevo');
    } finally {
      setLoading(false);
      setPassword('');
    }
  };

  return (
    <>
      <AppHeader title="Editar perfil" />

      <View style={styles.container}>
        <Text style={styles.title}>Información personal</Text>

        <TextInput
          style={styles.input}
          placeholder="Nombres"
          value={form.firstName}
          onChangeText={(v) => setForm({ ...form, firstName: v })}
        />

        <TextInput
          style={styles.input}
          placeholder="Apellidos"
          value={form.lastName}
          onChangeText={(v) => setForm({ ...form, lastName: v })}
        />

        <TextInput
          style={styles.input}
          placeholder="Teléfono"
          keyboardType="phone-pad"
          value={form.phoneNumber}
          onChangeText={(v) => setForm({ ...form, phoneNumber: v })}
        />

        <TextInput
          style={styles.input}
          placeholder="Email"
          keyboardType="email-address"
          value={form.email}
          onChangeText={(v) => setForm({ ...form, email: v })}
        />

        <TextInput
          style={styles.input}
          placeholder="Ciudad"
          value={form.city}
          onChangeText={(v) => setForm({ ...form, city: v })}
        />

        <TouchableOpacity style={styles.button} onPress={handleSave}>
          <Text style={styles.buttonText}>Guardar cambios</Text>
        </TouchableOpacity>
      </View>

      {/* 🔐 MODAL CONFIRMAR CONTRASEÑA */}
      <Modal transparent visible={showConfirm} animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modal}>
            <Text style={styles.modalTitle}>Confirmar cambios</Text>
            <Text style={styles.modalText}>
              Ingresa tu contraseña para guardar los cambios
            </Text>

            <TextInput
              style={styles.input}
              placeholder="Contraseña"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />

            <View style={styles.modalActions}>
              <TouchableOpacity
                onPress={() => setShowConfirm(false)}
                style={styles.cancelButton}
              >
                <Text>Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={confirmSave}
                disabled={loading}
                style={styles.confirmButton}
              >
                <Text style={{ color: '#fff' }}>
                  {loading ? 'Guardando...' : 'Confirmar'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    padding: 24,
  },
  modal: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 6,
  },
  modalText: {
    color: '#666',
    marginBottom: 12,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 10,
  },
  cancelButton: {
    padding: 10,
    marginRight: 10,
  },
  confirmButton: {
    backgroundColor: '#2ECC71',
    padding: 10,
    borderRadius: 6,
  },
});
