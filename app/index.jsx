import { router } from 'expo-router';
import { Image, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';


export default function Home() {

  const logo = require('../assets/images/rendimoto_logo.png');
  
  return (
    <View style={styles.container}>

      <StatusBar barStyle="dark-content" backgroundColor="#F3F3EE" />

      {/* Logo */}
      <Image source={logo} style={styles.logo} />

      {/* Titulo y subtitulo */}
      <Text style={styles.title}>
        RendiMoto App
      </Text>
      <Text style={styles.subTitle}>
        Conoce el verdadero rendimiento de tu vehículo
      </Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push('/login')}
      >
        <Text style={styles.buttonText}>Iniciar sesión</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, styles.secondary]}
        onPress={() => router.push('/register')}
      >
        <Text style={styles.secondaryText}>Registrarse</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F3EE',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  logo: {
    width: 300,
    height: 150,
    marginBottom: 20,
    borderRadius: 20,
  },
  title: {
    color: '#000',
    fontSize: 28,
    fontWeight: '700'
  },
  subTitle: {
    color: '#000',
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
    fontWeight: '500',
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
  secondary: {
    backgroundColor: '#fff',
  },
  secondaryText: {
    color: '#FF6B00',
    fontWeight: '600',
    fontSize: 16,
  },
});
