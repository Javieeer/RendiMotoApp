import AppHeader from "@/components/appHeader";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";

export default function SecuritySettings() {
    
  const router = useRouter();

  return (
    <>
        <AppHeader title="Seguridad" />
        <View style={styles.container}>
        <Text style={styles.title}>Seguridad</Text>
        <Text style={styles.subtitle}>
            Protege tu cuenta y administra opciones de seguridad
        </Text>

        {/* Cambiar contraseña */}
        <Pressable
            style={styles.card}
            onPress={() => router.push("/settings/security/change-password")}
        >
            <View style={styles.iconContainer}>
            <Ionicons name="lock-closed-outline" size={26} color="#fff" />
            </View>

            <View style={styles.textContainer}>
            <Text style={styles.cardTitle}>Cambiar contraseña</Text>
            <Text style={styles.cardDescription}>
                Actualiza tu contraseña para mantener tu cuenta segura
            </Text>
            </View>

            <Ionicons
            name="chevron-forward"
            size={22}
            color="#9ca3af"
            />
        </Pressable>

        {/* Placeholder para futuras opciones */}
        {/* 
        <Pressable style={[styles.card, styles.disabledCard]}>
            <View style={styles.iconContainerDisabled}>
            <Ionicons name="shield-outline" size={26} color="#9ca3af" />
            </View>

            <View style={styles.textContainer}>
            <Text style={styles.cardTitle}>Actividad de la cuenta</Text>
            <Text style={styles.cardDescription}>
                Revisa accesos y sesiones activas
            </Text>
            </View>
        </Pressable>
        */}
        </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f9fafb",
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 4,
    color: "#111827",
  },
  subtitle: {
    fontSize: 14,
    color: "#6b7280",
    marginBottom: 20,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff",
    padding: 16,
    borderRadius: 14,
    marginBottom: 14,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 3,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#111827",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },
  textContainer: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
  },
  cardDescription: {
    fontSize: 13,
    color: "#6b7280",
    marginTop: 2,
  },

  /* Opciones futuras */
  disabledCard: {
    opacity: 0.5,
  },
  iconContainerDisabled: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#e5e7eb",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },
});
