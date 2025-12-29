import AppHeader from "@/components/appHeader";
import { useAuth } from "@/context/authContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useState } from "react";
import { Alert, Pressable, StyleSheet, Text, TextInput, View } from "react-native";

export default function ChangePassword() {

  const { user, logout } = useAuth();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  /* Manejo del el envío de datos */
  const handleSubmit = async () => {

    /* Validación de campos */
    if (!currentPassword || !newPassword || !confirmPassword) {
      Alert.alert("Error", "Todos los campos son obligatorios");
      return;
    }
    if (newPassword.length < 6) {
      Alert.alert("Error", "La nueva contraseña debe tener al menos 6 caracteres");
      return;
    }
    if (newPassword !== confirmPassword) {
      Alert.alert("Error", "Las contraseñas no coinciden");
      return;
    }

    if (!user?.id) {
      Alert.alert("Error", "No se pudo identificar el usuario");
      return;
    }


    try {
      setLoading(true);
      const token = await AsyncStorage.getItem("token");

      const res = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}/delivery/${user.id}/change-password`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            currentPassword,
            newPassword,
            confirmPassword,
          }),
        }
      );

      const data = await res.json();
      console.log(data);

      /* Si algo sale mal */
      if (!res.ok || !data.successfully) {
        Alert.alert("Error", data.message || "No se pudo cambiar la contraseña");
        return;
      }

      /* Si todo salió bien */
      Alert.alert(
        "Contraseña actualizada",
        "Por seguridad, debes iniciar sesión nuevamente",
        [
          {
            text: "OK",
            onPress: async () => {
              await logout();
            },
          },
        ]
      );

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      Alert.alert("Error", "No se pudo conectar con el servidor " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <AppHeader title="Cambiar contraseña" />
      <View style={styles.container}>
        <Text style={styles.title}>Cambiar contraseña</Text>
        <Text style={styles.subtitle}>
          Por seguridad, debes ingresar tu contraseña actual
        </Text>

        <TextInput
          style={styles.input}
          placeholder="Contraseña actual"
          placeholderTextColor="#999"
          secureTextEntry
          value={currentPassword}
          onChangeText={setCurrentPassword}
        />

        <TextInput
          style={styles.input}
          placeholder="Nueva contraseña"
          placeholderTextColor="#999"
          secureTextEntry
          value={newPassword}
          onChangeText={setNewPassword}
        />

        <TextInput
          style={styles.input}
          placeholder="Confirmar nueva contraseña"
          placeholderTextColor="#999"
          secureTextEntry
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />

        <Pressable
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleSubmit}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? "Guardando..." : "Cambiar contraseña"}
          </Text>
        </Pressable>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F3F3EE",
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    color: "#6b7280",
    marginBottom: 20,
  },
  input: {
    backgroundColor: "#fff",
    color: '#000',
    borderRadius: 12,
    padding: 14,
    fontSize: 15,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    marginBottom: 14,
  },
  button: {
    backgroundColor: "#111827",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 10,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
