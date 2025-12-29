import AppHeader from "@/components/appHeader";
import { useAuth } from "@/context/authContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Alert,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

export default function Feedback() {
  const router = useRouter();
  const { user } = useAuth();

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!message.trim()) {
      Alert.alert("Error", "Escribe un comentario antes de enviar");
      return;
    }

    try {
      setLoading(true);
      const token = await AsyncStorage.getItem("token");

      const res = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}/feedback`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            message,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        Alert.alert("Error", data.message || "No se pudo enviar el comentario");
        return;
      }

      Alert.alert(
        "¡Gracias!",
        "Tu comentario fue enviado correctamente",
        [{ text: "OK", onPress: () => router.push("/home") }]
      );
      

      setMessage("");

    } catch (error) {
      Alert.alert("Error", "No se pudo conectar con el servidor");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <AppHeader title="Comentarios" />
      <View style={styles.container}>
        <Text style={styles.title}>Queremos escucharte</Text>
        <Text style={styles.subtitle}>
          Cuéntanos qué podemos mejorar o qué te gustaría ver en la app
        </Text>

        <TextInput
          style={styles.textarea}
          placeholder="Escribe tu comentario aquí..."
          placeholderTextColor="#999"
          multiline
          numberOfLines={5}
          value={message}
          onChangeText={setMessage}
        />

        <Pressable
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleSubmit}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? "Enviando..." : "Enviar comentario"}
          </Text>
        </Pressable>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9fafb",
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
  textarea: {
    backgroundColor: "#fff",
    color: '#000',
    borderRadius: 12,
    padding: 14,
    fontSize: 15,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    height: 140,
    textAlignVertical: "top",
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#111827",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
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
